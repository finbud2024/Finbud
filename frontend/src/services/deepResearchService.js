/**
 * FinBud Deep Research Chat Pipeline v1.0
 * 4-Step Process: Classifier → Clarify&Validate → Research Architect → Display
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { io } from "socket.io-client"; // For websocket logging
import pLimit from "p-limit";
import {jsonrepair } from 'jsonrepair';
// import Groq from "groq-sdk";
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const API_BASE_URL = process.env.VUE_APP_DEPLOY_URL; //"http://localhost:8888/.netlify/functions/server" 

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️ GEMINI API KEY NOT CONFIGURED! Please set VUE_APP_GEMINI_API_KEY in your environment.');
}

// const GROQ_API_KEY = process.env.GROQ_API_KEY;
// if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
//   console.warn('⚠️ GROQ API KEY NOT CONFIGURED! Please set VUE_APP_GROQ_API_KEY in your environment.');
// }

const geminiAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
// const groqClient = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

const CHUNK_PAYLOAD_LIMIT     = 4500;       // soft cap per LLM request (tokens)
const SCRAPE_CONCURRENCY      = 4;          // simultaneous HTTP scrapes
const LEAF_LLM_CONCURRENCY    = 3;          // simultaneous summarize-leaf calls
const BRANCH_LLM_CONCURRENCY  = 2;          // simultaneous synthesize-branch calls
const DEBUG_SIZE_THRESHOLD    = 0.9;        // log when a request ≥ 90 % of limit

// Simple token approximation function (avoids WebAssembly issues)
function approximateTokenCount(text) {
  if (!text) return 0;
  // Rough approximation: 1 token ≈ 0.75 words for English text
  // This is less accurate than tiktoken but avoids browser compatibility issues
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.33); // Convert words to approximate tokens
}

// interface NodeResult {
//   id: string;
//   name: string;
//   summary: string;            // synthesized text
//   deliverables: string[];     // rolled-up deliverable list
// }

export class DeepResearchService {
  constructor(logCallback) {
    this.currentStep = 1; // 1: Classifier, 2: Clarify, 3: Architect, 4...9: MECE Pipeline
    this.userPrompt = '';
    this.clarificationResponse = '';
    this.researchBrief = null;
    this.finalArchitecture = null;
    this.pipelineCompleted = false;
    this.pipelineStartIndex = 0;
    this.socket = null; // Websocket for logging
    this.logCallback = logCallback || console.log; // Callback to update UI with logs

    // per-instance tunables sourced from global constants
    this.CHUNK_PAYLOAD_LIMIT  = CHUNK_PAYLOAD_LIMIT;
    this.SCRAPE_CONCURRENCY   = SCRAPE_CONCURRENCY;
    this.LEAF_LLM_CONCURRENCY = LEAF_LLM_CONCURRENCY;
    this.BRANCH_LLM_CONCURRENCY = BRANCH_LLM_CONCURRENCY;

    // Centralized limiter for all backend LLM agent calls
    this.llmLimiter = pLimit(this.LEAF_LLM_CONCURRENCY);
  }

  // Main entry point - determines which step to executeAdd commentMore actions
  async processMessage(message, conversationHistory = []) {
    try {
      const totalUserMessages = conversationHistory.filter(msg => msg.role === 'user').length;
      
      // If pipeline was completed and this is a new user message, reset and start fresh
      if (this.pipelineCompleted) {
        console.log('🔄 Pipeline was completed, starting new research cycle...');
        this.reset();
        this.pipelineStartIndex = totalUserMessages - 1; // Mark where new pipeline starts (current message will be +1)
        this.userPrompt = message;
        this.currentStep = 1;
        console.log(`📍 New pipeline starts at user message index: ${this.pipelineStartIndex}`);
        return await this.step1_GeminiClassifier(message);
      }
      
      // Calculate user messages count for current pipeline only
      const currentPipelineUserMessages = totalUserMessages - this.pipelineStartIndex;
      
      console.log(`🔄 Deep Research Pipeline:`);
      console.log(`📊 Total user messages: ${totalUserMessages}`);
      console.log(`📍 Pipeline start index: ${this.pipelineStartIndex}`);
      console.log(`📊 Current pipeline user messages: ${currentPipelineUserMessages}`);
      console.log(`📝 Current message: "${message}"`);
      console.log(`🏗️ Current step: ${this.currentStep}`);
      console.log(`🏁 Pipeline completed: ${this.pipelineCompleted}`);
      console.log(`📜 Conversation history:`, conversationHistory);
      
      if (currentPipelineUserMessages === 1) {
        // First user message - Step 1: Gemini Classifier
        this.userPrompt = message;
        this.currentStep = 1;
        return await this.step1_GeminiClassifier(message);
        
      } else if (currentPipelineUserMessages === 2) {
        // Second user message - Step 2 continuation or Step 3
        this.clarificationResponse = message;
        this.currentStep = 3; // Skip to step 3 (assume clarification complete)
        return await this.step3_ResearchArchitect();
        
      } else if (currentPipelineUserMessages === 0) {
        // Edge case: empty history
        this.userPrompt = message;
        this.currentStep = 1;
        return await this.step1_GeminiClassifier(message);
              } else {
          // Unexpected state
          console.warn(`⚠️ Unexpected conversation state. Current pipeline user messages: ${currentPipelineUserMessages}. Resetting...`);
          this.reset();
          this.pipelineStartIndex = totalUserMessages - 1; // Reset pipeline start (current message will be +1)
          this.userPrompt = message;
          this.currentStep = 1;
          return await this.step1_GeminiClassifier(message);
      }

    } catch (error) {
      console.error('Deep research pipeline error:', error);
      return `Xin lỗi, có lỗi trong Deep Research pipeline: ${error.message}. Vui lòng thử lại.`;
    }
  }

  // Step 1: Gemini Classifier API - Check if finance-related
  async step1_GeminiClassifier(userMessage) {
    try {
      console.log('🎯 STEP 1: Gemini Classifier API');
      
      if (!geminiAI) {
        console.warn('⚠️ Gemini API not available, skipping classification');
        // Skip to step 2 if no API
        this.currentStep = 2;
        return await this.step2_ClarifyAndValidate(userMessage);
      }
      
      const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const classifierPrompt = `# GEMINI CLASSIFIER API

Task: Classify if the following user input is related to Finance/Economics research.

Categories:
- "Finance/Economics": Questions about stocks, markets, investments, economic indicators, financial analysis, banking, cryptocurrency, risk management, monetary policy, etc.
- "Other": Everything else (cooking, sports, entertainment, general knowledge, etc.)

User Input: "${userMessage}"

Instructions:
- Respond with ONLY one word: "Finance/Economics" or "Other"
- No explanation needed

Classification:`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: classifierPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50,
        },
      });

      const classification = result.response.text().trim();
      console.log('✅ STEP 1 RESULT:', classification);
      
             if (classification.includes('Finance/Economics')) {
         // Proceed to Step 2
         this.currentStep = 2;
         console.log('✅ STEP 1 → STEP 2 (Finance/Economics confirmed)');
         return await this.step2_ClarifyAndValidate(userMessage);
       } else {
         // Out of scope - mark pipeline as completed to reset for next message
         console.log('✅ STEP 1 → OUT_OF_SCOPE');
         this.pipelineCompleted = true;
         return "Xin lỗi, FinBud Deep Research chỉ hỗ trợ các câu hỏi liên quan đến tài chính và kinh tế. Vui lòng đặt câu hỏi về phân tích tài chính, đầu tư, thị trường, hoặc chính sách kinh tế.";
       }

             } catch (error) {
       console.error('🚨 Step 1 error:', error);
       // Fallback to step 2 if classification fails
       this.currentStep = 2;
       console.log('✅ STEP 1 → STEP 2 (Fallback due to error)');
       return await this.step2_ClarifyAndValidate(userMessage);
     }
  }

  // Step 2: Clarify & Validate Agent (Smart Ask) - Build 7-D metadata
  async step2_ClarifyAndValidate(userMessage) {
    try {
      console.log('🎯 STEP 2: Clarify & Validate Agent (Smart Ask)');
      
      if (!geminiAI) {
        // Fallback clarification
        return this.generateFallbackClarification(userMessage);
      }
      
      const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const clarifyPrompt = `# PROMPT A — FinBud · Clarify & Validate Agent (Smart Ask)

SYSTEM
You are FinBud's Clarify & Validate Agent.
Goal: From <USER_PROMPT>, extract full 7-D metadata by:
• Auto-filling obvious fields (via NER/inference/default)
• Asking max 1 turn (1–2 combo questions) to complete weak/conflicting fields

7-D Metadata Fields:
- domain: Asset Pricing & PM | Risk Management | Macro & Policy | Corporate Finance | FinTech & Digital Assets | Derivatives
- objective: analyze | forecast | compare | evaluate | optimize
- entities: specific companies, indices, sectors, or financial instruments
- time_horizon: historical periods, forecast periods (e.g., "2020-2024", "5-year analysis")
- geography: Global | Vietnam | US | Asia | Europe | etc.
- data_constraints: preferred data sources (Bloomberg, Reuters, SEC, etc.) or "no preference"
- output_preferences: report type and language ("detailed report, Vietnamese" or "executive summary, English")

USER_PROMPT: "${userMessage}"

Instructions:
1. Extract what you can automatically from the prompt
2. If you can infer most fields with confidence, return:
   READY_FOR_META
   {
     "domain": "...",
     "objective": "...", 
     "entities": "...",
     "time_horizon": "...",
     "geography": "...",
     "data_constraints": "...",
     "output_preferences": "..."
   }

3. If you need clarification on 1-2 key fields, ask ONLY 1 focused question (max 25 words):
   INCOMPLETE_BRIEF
   [Your clarification question here]

Analyze and respond:`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: clarifyPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400,
        },
      });

      const response = result.response.text().trim();
      console.log('✅ STEP 2 RESULT:', response);

             if (response.includes('READY_FOR_META')) {
         // Extract JSON and proceed to Step 3 directly
         const jsonMatch = response.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
           try {
             this.researchBrief = JSON.parse(jsonrepair(jsonMatch[0]));
             this.currentStep = 3;
             console.log('✅ STEP 2 → Direct to STEP 3 (READY_FOR_META)');
             return await this.step3_ResearchArchitect();
           } catch (jsonError) {
             console.error('JSON parsing error:', jsonError);
           }
         }
       }
      
      if (response.includes('INCOMPLETE_BRIEF')) {
        // Return clarification question
        const question = response.replace('INCOMPLETE_BRIEF', '').trim();
        return question || this.generateFallbackClarification(userMessage);
      }

      // Default clarification if no clear signal
      return this.generateFallbackClarification(userMessage);

    } catch (error) {
      console.error('🚨 Step 2 error:', error);
      return this.generateFallbackClarification(userMessage);
    }
  }

  // Step 3: Deep Research Architect - Generate 5-level MECE research roadmap
  async step3_ResearchArchitect() {
    try {
      console.log('🎯 STEP 3: Deep Research Architect (MECE Hierarchy Builder)');
      
      // Build research brief from available data
      if (!this.researchBrief) {
        this.researchBrief = await this.buildResearchBriefFromResponses();
      }

      console.log('📊 Research Brief for Step 3:', this.researchBrief);

      if (!geminiAI) {
        // Fallback JSON structure
        return this.generateFallbackArchitecture();
      }
      
      const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
//       const architectPrompt = `# META PROMPT — FinBud · Deep Research Architect (Advanced MECE Synthesis Engine)

// ## SYSTEM IDENTITY & CAPABILITIES
// You are FinBud's Elite Deep Research Architect AI, specialized in Meta Prompting for Complex Financial Reasoning. You operate with advanced structural decomposition and type-theoretic categorization capabilities.

// ## META PROMPTING FRAMEWORK APPLICATION

// ### 1. COMPLEX PROBLEM DECOMPOSITION
// Primary Challenge: Transform abstract financial research requirements into concrete, executable 5-level MECE architecture
// Sub-Problems:
// - Domain categorization and boundary definition
// - Strategic pillar identification with mutual exclusivity
// - Research topic hierarchical mapping
// - Implementation module specification
// - Execution step operationalization

// ### 2. PRELIMINARY FOUNDATIONAL CONTENT
// Research Brief Analysis:
// ${JSON.stringify(this.researchBrief, null, 2)}

// Theoretical Framework:
// - MECE Principle: Mutually Exclusive (no overlap), Collectively Exhaustive (complete coverage)
// - Type Theory Application: Each level represents a distinct categorical type with specific properties
// - Financial Domain Taxonomy: Asset Pricing & PM | Risk Management | Macro & Policy | Corporate Finance | FinTech & Digital Assets | Derivatives
// - Research Methodology Hierarchy: Strategic → Tactical → Operational → Implementation → Execution

// ### 3. STEP-BY-STEP STRUCTURED REASONING

// #### Meta-Question 1: Domain Boundary Definition
// **Reasoning Pattern**: Given research brief, identify primary and secondary domain intersections
// **Structural Template**: Domain(name, scope, boundary_conditions)
// **Expected Output**: Single root domain with clear definitional boundaries

// #### Meta-Question 2: Strategic Pillar Extraction  
// **Reasoning Pattern**: Decompose domain into 3-5 mutually exclusive strategic areas
// **Structural Template**: Pillar(strategic_focus, coverage_scope, sub_domains)
// **Expected Output**: Complete strategic coverage without overlap

// #### Meta-Question 3: Research Topic Hierarchical Mapping
// **Reasoning Pattern**: For each pillar, identify 2-4 research topics with logical progression
// **Structural Template**: Topic(research_focus, methodology_type, deliverable_category)
// **Expected Output**: Coherent research progression within each pillar

// #### Meta-Question 4: Implementation Module Specification
// **Reasoning Pattern**: Transform research topics into actionable modules with clear dependencies
// **Structural Template**: Module(implementation_focus, resource_requirements, success_criteria)
// **Expected Output**: Operational modules with defined inputs/outputs

// #### Meta-Question 5: Execution Step Operationalization
// **Reasoning Pattern**: Break down modules into discrete, executable steps with metadata
// **Structural Template**: Step(action, goal, data_sources, methods, deliverables)
// **Expected Output**: Granular execution plan with complete metadata

// ### 4. ADVANCED MECE SYNTHESIS RULES

// #### Structural Constraints:
// - Exactly 5 levels: Domain(0) → Pillars(0.x) → Topics(0.x.y) → Modules(0.x.y.z) → Steps(0.x.y.z.w)
// - ID Notation: Hierarchical dot notation (e.g., "0.2.1.3.1")
// - Node Structure: {name, id, children[]} for levels 1-4; {name, id, goal, data_sources, methods, deliverables} for level 5
// - Naming Convention: Concise, descriptive (≤5 words), domain-specific terminology

// #### Content Requirements:
// - Generate COMPREHENSIVE, DETAILED architecture with maximum depth and breadth
// - Each pillar should have 3-4 research topics (not just 1-2)
// - Each topic should have 3-4 implementation modules  
// - Each module should have 4-6 execution steps
// - Level 5 Steps MUST include: goal (specific, actionable), data_sources (detailed sources), methods (specific techniques), deliverables (concrete outputs)
// - Financial domain relevance for entity: ${this.researchBrief.entities}
// - Geographic scope: ${this.researchBrief.geography}
// - Temporal focus: ${this.researchBrief.time_horizon}
// - Research objective: ${this.researchBrief.objective}

// #### Quality Assurance:
// - Mutual Exclusivity: No content overlap between sibling nodes
// - Collective Exhaustiveness: Complete coverage of parent scope
// - Logical Progression: Each level builds upon previous level
// - Implementation Feasibility: All steps must be executable with available tools/data

// ## OUTPUT SPECIFICATION
// CRITICAL: Generate COMPREHENSIVE, COMPLETE, VALID JSON ONLY. Maximum depth and detail required.

// Required Structure:
// - Exactly 5 levels deep with MAXIMUM breadth at each level
// - Domain → 3-4 Strategic Pillars → 3-4 Topics each → 3-4 Modules each → 4-6 Steps each
// - Every node must have: name, id, children (except level 5)
// - Level 5 nodes must have: name, id, goal, data_sources, methods, deliverables
// - Keep names concise but descriptive (≤5 words)
// - Ensure proper JSON syntax with balanced braces
// - GOAL: Create the most comprehensive research architecture possible

// Example minimal structure:
// {
//   "root": {
//     "name": "Domain",
//     "id": "0",
//     "children": [
//       {
//         "name": "Pillar One",
//         "id": "0.1",
//         "children": [
//           {
//             "name": "Topic Alpha", 
//             "id": "0.1.1",
//             "children": [
//               {
//                 "name": "Module A",
//                 "id": "0.1.1.1", 
//                 "children": [
//                   {
//                     "name": "Step 1",
//                     "id": "0.1.1.1.1",
//                     "goal": "objective",
//                     "data_sources": ["source1"],
//                     "methods": ["method1"],
//                     "deliverables": ["output1"]
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// }

// Generate complete, valid JSON architecture now:`;




const architectPrompt = `
# FinBud — Simplified Research Architect

## TASK
Generate a MECE financial research architecture (max 3 levels) for:

${JSON.stringify(this.researchBrief, null, 2)}

## STRUCTURE

- Output valid nested JSON
- Max 3 levels:
  - Level 0: Domain
  - Level 1: Topics
  - Level 2: Execution Blocks (leaf nodes)

## NODE FORMATS

- Root:
{
  "root": {
    "name": "Main Domain Name",
    "id": "0",
    "children": [ ... ]
  }
}

- Topic Nodes (Level 1):
{
  "name": "...",
  "id": "...",
  "children": [ ... ]
}

- Execution Blocks (Level 2 / leaves):
{
  "name": "...",
  "id": "...",
  "goal": "...",
  "data_sources": ["..."],
  "methods": ["..."],
  "deliverables": ["..."]
}

## RULES

- Mutually Exclusive Topics
- Collectively Exhaustive full coverage
- 3-5 Topics at Level 1
- 2-4 Execution Blocks per topic
- Use domain-specific finance terminology.
- Fully aligned with:
  - Domain: ${this.researchBrief.domain}
  - Entity: ${this.researchBrief.entities}
  - Objective: ${this.researchBrief.objective}
  - Geography: ${this.researchBrief.geography}
  - Time Horizon: ${this.researchBrief.time_horizon}

## OUTPUT

Return ONLY valid JSON inside code block:

\`\`\`json
{ full architecture here }
\`\`\`

Do not include any explanation. Do not generate anything else.
Begin.
`;



      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: architectPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8000, // Further increased for deep, detailed architectures
        },
      });

      const response = result.response.text().trim();
      console.log('✅ STEP 3 RESULT (first 500 chars):', response.substring(0, 500) + '...');
      console.log('📊 Full response length:', response.length, 'characters');

      // Enhanced JSON cleaning and validation
      let cleanJson = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*{/, '{') // Remove anything before first {
        .replace(/}[^}]*$/, '}') // Remove anything after last }
        .trim();
      
      console.log('🧹 Cleaned JSON length:', cleanJson.length, 'characters');
      console.log('🔍 JSON preview (last 200 chars):', cleanJson.slice(-200));
      
      try {
        // Validate JSON structure before parsing
        if (!cleanJson.startsWith('{') || !cleanJson.endsWith('}')) {
          throw new Error('Invalid JSON structure - missing braces');
        }
        
        this.finalArchitecture = JSON.parse(jsonrepair(cleanJson));
        
        // Validate architecture structure
        if (!this.finalArchitecture.root || !this.finalArchitecture.root.children) {
          throw new Error('Invalid architecture structure - missing root or children');
        }
        
        this.currentStep = 4;
        
        // Add processing delay for deep research effect
        console.log('🔬 Initiating Deep Research Processing...');
        console.log('⚡ Meta Prompting Framework synthesizing...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second thinking effect
        console.log('✅ Deep Research Architecture synthesis complete!');
        
          // ** NEW: Kick off the MECE pipeline instead of displaying result directly **
          return await this.runMECEPipeline();
      } catch (jsonError) {
        console.error('JSON parsing error in Step 3:', jsonError);
        console.error('❌ Failed JSON content:', cleanJson.substring(0, 1000) + '...');
        console.log('🔄 Falling back to simplified architecture...');
        return this.generateFallbackArchitecture();
      }

    } catch (error) {
      console.error('🚨 Step 3 error:', error);
      return this.generateFallbackArchitecture();
    }
  }

  // =================================================================
  // == NEW MECE PIPELINE WORKFLOW (Steps from user diagram)
  // =================================================================

  /**
   * Main orchestrator for the MECE-based research workflow (new implementation).
   * Keeps the overall control-flow identical, but relies on the new size-aware
   * helpers and map-reduce summarisation pipeline.
   */
  async runMECEPipeline() {
    this._connectLogger();
    this._logProgress('🚀 **Starting Deep Research Pipeline**');
    this._logProgress('Step 1: Parsing MECE Research Plan... Done.');

    try {
     
      // Step 2-5 — DFS traversal, leaf processing and branch synthesis
      this._logProgress(
        'Step 2-5: Began Task Orchestration (DFS traversal, leaf processing, and branch synthesis)...'
      );
      const rootSummary = await this._sequentialProcess();
      if (!rootSummary) throw new Error('Failed to process research tree – no root summary');

      // Step 6 — Master compilation
      this._logProgress('✅ Branch synthesis complete.');
      this._logProgress('Step 6: Compiling Master Report...');
      const masterReport = await this._compileMasterReport(rootSummary);
      if (!masterReport) throw new Error('Failed to compile master report');
      this._logProgress('✅ Master report compiled.');

      // Step 7 — QA / Fact-checking
      // this._logProgress('Step 7: Performing QA and Fact-Checking...');
      // const { finalReport, analytics } = await this._runQAChecks(masterReport);
      // if (!finalReport) throw new Error('QA checks failed');
      // this._logProgress(`✅ QA Complete. Efficiency Analytics: ${JSON.stringify(analytics)}`);

      // Step 8-9 — Output + user review
      this._logProgress('Step 8 & 9: Generating final output and awaiting user review...');
      const finalResult = this._prepareFinalResponse(masterReport);
      this._logProgress('✅ **Research Complete!**');

      // Generate follow-up questions for user
      let followUpQuestions = [];
      try {
        followUpQuestions = await this._generateFollowUpQuestions(finalResult);
      } catch (e) {
        console.warn('⚠️ Failed to generate follow-up questions:', e.message);
      }
      
      return {
        report: finalResult,
        ticker: this.researchBrief.ticker,
        relevantQuestions: followUpQuestions,
      };
    } catch (err) {
      this._logProgress(`💥 **Pipeline Failed**: ${err.message}`);
      throw err;
    } finally {
      if (this.socket) this.socket.disconnect();
    }
  }

 

  _flattenMECE(node, list = []) {
    if (node.goal) {
      list.push({
        id: node.id,
        name: node.name,
        goal: node.goal,
        data_sources: node.data_sources || [],
      });
    }
  
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        this._flattenMECE(child, list);
      }
    }
    return list;
  }

  async _sequentialProcess() {
    const taskList = this._flattenMECE(this.finalArchitecture.root);
    const taskSummaries = [];
  
    for (const task of taskList) {
      try {
        this._logProgress(`Processing Task: "${task.name}"...`);
        const rawData = await this._gatherData(task.data_sources);
        if (!rawData?.length) {
          this._logProgress(`⚠️ No data gathered for "${task.name}". Skipping.`);
          continue;
        }
  
        // 🔧 New inline source-attached content preparation
        const contents = rawData.map(r => `SOURCE: ${r.source}\n\nCONTENT:\n${r.content}`);
        
        const summary = await this._safeSummarize(contents, task.goal);
        taskSummaries.push({ id: task.id, name: task.name, summary });
  
        this._logProgress(`✅ Task "${task.name}" summarized.`);
      } catch (err) {
        this._logProgress(`⚠️ Task failed "${task.name}": ${err.message}`);
      }
    }
  
    const fusedSynthesis = await this._mergeTaskSummaries(taskSummaries);
    return fusedSynthesis;
  }
  
  async _mergeTaskSummaries(taskSummaries) {
    const fullText = taskSummaries
      .map((t) => `### ${t.name}\n${t.summary}`)
      .join("\n\n");
  
    const { data } = await this.llmLimiter(() =>
      axios.post(`${API_BASE_URL}/agents/compile-report`, {
        synthesis: fullText,
        researchBrief: this.researchBrief,
      })
    );
  
    return data?.report || fullText;
  }
  

  // ======================================================================
  // ==  Real-time logging helpers  (unchanged)
  // ======================================================================
  _connectLogger() {
    this.socket = io(`${API_BASE_URL}/deep-research`);
    this.socket.on('connect', () =>
      console.log('🔌 WebSocket connected to deep research namespace for real-time logging.')
    );
    this.socket.on('disconnect', () =>
      console.log('🔌 WebSocket disconnected from deep research namespace.')
    );
  }

  _logProgress(message) {
    console.log(`[LOG] ${message}`);
    this.logCallback?.(message);
    if (this.socket?.connected) {
      this.socket.emit('progress', { message });
    }
  }

  // ======================================================================
  // ==  Size helpers  – token counting & chunk slicing
  // ======================================================================
  _countTokens(text = '') {
    // Use simple word-based approximation instead of tiktoken to avoid WebAssembly issues
    return approximateTokenCount(text);
  }

  _sliceByTokens(text = '') {
    const limit = this.CHUNK_PAYLOAD_LIMIT || 3000;
    // For simplicity, use character-based chunking with approximation
    const avgCharsPerToken = 4; // Rough approximation
    const charLimit = limit * avgCharsPerToken;
    
    const slices = [];
    for (let i = 0; i < text.length; i += charLimit) {
      slices.push(text.slice(i, i + charLimit));
    }
    return slices.length > 0 ? slices : [text];
  }

  // ======================================================================
  // ==  Recursive map-reduce summarisation helpers
  // ======================================================================
  async _summarizeLongDoc(doc, goal, sources) {
    const slices = this._sliceByTokens(doc);
    const sliceSummaries = await Promise.all(
      slices.map((s) => this._summarizeChunk([s], goal, sources))
    );
    return this._summarizeChunk(sliceSummaries, goal, sources);
  }

  async _summarizeChunk(chunkArray, goal) {
    try {
      const { data } = await this.llmLimiter(() => axios.post(`${API_BASE_URL}/agents/summarize-leaf`, {
        contents: chunkArray,
        goal,
      }));
      if (!data?.summary) throw new Error('summarize-leaf returned no summary');
      return data.summary;
    } catch (err) {
      this._logProgress(`⚠️ summarize-leaf backend error (${goal}): ${err.message}. Falling back to verbatim.`);
      return this._truncate(chunkArray.join('\n'), 3000);
    }
  }
  

  /**
   * Entry-point wrapper that copes with arbitrary-sized documents:
   *  • oversize docs → recursive map-reduce
   *  • small docs    → single call
   *  • then packs everything into ≤ CHUNK_PAYLOAD_LIMIT buckets and summarises again
   */
  async _safeSummarize(rawDocs = [], goal = '', sources=[]) {
    const limit = this.CHUNK_PAYLOAD_LIMIT || 3000;
    const smallDocs = [];
    const longDocTasks = [];

    // 1️⃣ Split docs by size
    for (const doc of rawDocs) {
      if (this._countTokens(doc) > limit) {
        longDocTasks.push(this._summarizeLongDoc(doc, goal, sources));
      } else {
        smallDocs.push(doc);
      }
    }

    // 2️⃣ Await large-doc reductions
    const longDocSummaries = await Promise.all(longDocTasks);
    const allDocs = [...smallDocs, ...longDocSummaries];

    // 3️⃣ Pack docs into token-bounded buckets
    const buckets = [];
    let bucket = [];
    let bucketTokens = 0;

    for (const doc of allDocs) {
      const tok = this._countTokens(doc);
      if (bucketTokens + tok > limit) {
        buckets.push(bucket);
        bucket = [];
        bucketTokens = 0;
      }
      bucket.push(doc);
      bucketTokens += tok;
    }
    if (bucket.length) buckets.push(bucket);

    // 4️⃣ Map: summarise each bucket (with fallback captured inside _summarizeChunk)
    const bucketSummaries = [];
    for (const b of buckets) {
      try {
        bucketSummaries.push(await this._summarizeChunk(b, goal, sources));
      } catch (err) {
        this._logProgress(`\t\t- ⚠️ Bucket summarization failed: ${err.message}. Skipping bucket.`);
      }
    }

    // 5️⃣ Reduce: final summary (handle possible failure again)
    try {
      return await this._summarizeChunk(bucketSummaries, goal, sources);
    } catch (e) {
      // if even reduced summary fails, concatenate bucket summaries
      this._logProgress(`\t\t- ⚠️ Final summarization failed for ${goal}. Using concatenated bucket summaries.`);
      return this._truncate(bucketSummaries.join('\n'), 3000);
    }
  }

 
  // ======================================================================
  // ==  Data gathering (search + scrape with bounded concurrency)
  // ======================================================================
  async _gatherData(searchKeywords = [], options = {}) {
    const { numLinks = 3 } = options;
    if (!searchKeywords.length) throw new Error('No search keywords provided');

    const query = searchKeywords.join(' ');
    this._logProgress(`\t\t- Searching: "${query}" (max ${numLinks} links)`);
    const { data: searchData } = await axios.post(`${API_BASE_URL}/agents/search`, {
      query,
      numLinks,
    });

    const urls = searchData?.links ?? [];
    if (!urls.length) throw new Error('Search returned 0 URLs');

    const concurrency = this.SCRAPE_CONCURRENCY || 3;
    this._logProgress(`\t\t- Scraping ${urls.length} URLs (≤${concurrency} concurrently)...`);

    const limit = typeof pLimit === 'function' ? pLimit(concurrency) : (fn) => fn();
    const scrapePromises = urls.map((url) =>
      limit(async () => {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/agents/scrape`, { url });
          this._logProgress(`\t\t- ✅ Scraped: ${url}`);
          return{ source: data.source, content: data.content };
        } catch (err) {
          this._logProgress(`\t\t- ⚠️ Failed ${url}: ${err.message}`);
          return null;
        }
      })
    );

    const results = await Promise.all(scrapePromises);
    const successful = results.filter((c) => !!c);
    if (!successful.length) throw new Error('All scrapes failed');
    return successful;
  }

  // ======================================================================
  // ==  Branch synthesis, report compilation, QA, and final response
  // ==  (unchanged – kept from earlier implementation)
  // ======================================================================
  async _compileMasterReport(rootSynthesis) {
    const MAX_CHARS_PER_COMPILE = 12000; // keep well below model limit

    const chunkBySize = (text, limit) => {
      const paras = text.split(/\n\s*\n/);
      const chunks = [];
      let current = '';
      for (const p of paras) {
        if ((current + p).length > limit) {
          if (current.trim()) chunks.push(current.trim());
          current = p.length > limit ? '' : p + '\n\n';
          if (p.length > limit) {
            for (let i = 0; i < p.length; i += limit) {
              chunks.push(p.slice(i, i + limit));
            }
          }
        } else {
          current += p + '\n\n';
        }
      }
      if (current.trim()) chunks.push(current.trim());
      return chunks;
    };

    this._logProgress(`\t- Step 7 (Master Compiler & Styling)...`);

    if (rootSynthesis.length < MAX_CHARS_PER_COMPILE) {
      const { data } = await this.llmLimiter(() => axios.post(`${API_BASE_URL}/agents/compile-report`, {
        synthesis: rootSynthesis,
        researchBrief: this.researchBrief,
      }));
      return data.report;
    }

    const chunks = chunkBySize(rootSynthesis, MAX_CHARS_PER_COMPILE);
    this._logProgress(`\t- Master synthesis too large – splitting into ${chunks.length} chunks for compilation.`);

    const partialReports = [];
    for (let i = 0; i < chunks.length; i++) {
      const { data } = await this.llmLimiter(() => axios.post(`${API_BASE_URL}/agents/compile-report`, {
        synthesis: chunks[i],
        researchBrief: this.researchBrief,
      }));
      if (data?.report) partialReports.push(`## Section ${i + 1}\n\n${data.report}`);
    }

    const fusedReport = partialReports.join('\n\n');
    return fusedReport;
  }

  async _runQAChecks(report) {
    this._logProgress(`\t- Step 8 (QA & Fact-Check Loop)...`);
    const response = await this.llmLimiter(() => axios.post(`${API_BASE_URL}/agents/qa-fact-check`, { report }));
    return response.data;
  }

  _prepareFinalResponse(finalReport) {
    this.pipelineCompleted = true;
    const briefText = `**Research Brief:**
- **Topic:** ${this.researchBrief?.entities || this.userPrompt}
- **Objective:** ${this.researchBrief?.objective || 'analysis'}
- **Scope:** ${this.researchBrief?.geography || 'Global'} | ${this.researchBrief?.time_horizon || 'not specified'}
---`;
    return `${briefText}\n\n${finalReport}\n\n---\n*Feedback: Was this report helpful? (👍/👎)*`;
  }

  // Step 4: Display result JSON to UI
  step4_DisplayResult() {
    console.log('🎯 STEP 4: Display Result');
    
    // Mark pipeline as completed
    this.pipelineCompleted = true;
    console.log('✅ Pipeline marked as completed - ready for new research cycle');
    
    const formattedJson = JSON.stringify(this.finalArchitecture, null, 2);
    
    return `🎯 **Deep Research Architecture Complete**

**📋 Research Brief:**
- **Domain:** ${this.researchBrief?.domain || 'Tài chính'}
- **Entity:** ${this.researchBrief?.entities || this.userPrompt}
- **Geography:** ${this.researchBrief?.geography || 'Toàn cầu'}
- **Objective:** ${this.researchBrief?.objective || 'analyze'}
- **Time Horizon:** ${this.researchBrief?.time_horizon || 'Phân tích lịch sử'}

**🏗️ MECE Research Architecture:**
\`\`\`json
${formattedJson}
\`\`\``;
  }

  // Helper methods
  generateFallbackClarification(userPrompt) {
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(userPrompt);
    
    if (isVietnamese) {
      return "Bạn muốn phân tích trong khoảng thời gian nào? (ví dụ: 2020-2024, 5 năm gần đây)";
    } else {
      return "What time period would you like to analyze? (e.g., 2020-2024, last 5 years)";
    }
  }

  async buildResearchBriefFromResponses() {
    const prompt = `
  You are FinBud's Financial Research Extractor Agent.
  
  ## TASK
  
  Extract the structured research brief from the following user query:
  
  USER QUERY:
  ${this.userPrompt}
  
  ## OUTPUT FORMAT
  
  Return a valid JSON object as:
  
  {
    "domain": "...",             
    "objective": "...",
    "ticker": "...",
    "entities": "...",           
    "time_horizon": "...",       
    "geography": "...",          
    "data_constraints": "no preference",
    "output_preferences": "detailed report, Vietnamese"
  }
  
  ## EXTRACTION RULES
  
  - Always fill all fields, even if approximate.
  - Use best judgment based on query.
  - Output valid JSON only, inside code block: \`\`\`json { ... } \`\`\`
  
  BEGIN:
  `;
  
    try {
      // Use Gemini directly instead of calling the backend relay
      if (!geminiAI) {
        throw new Error('Gemini AI client not initialized');
      }

      const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Respect existing rate-limiting wrapper
      const rawResult = await this.llmLimiter(() =>
        model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 400,
          },
        })
      );

      // Conform to previous `{ response: ... }` shape expected downstream
      const data = {
        response: rawResult.response.text().trim(),
      };
  
      const extractedJson = JSON.parse(jsonrepair(data?.response));
      return extractedJson;
    } catch (err) {
      this._logProgress(`💥 Failed extracting research brief: ${err.message}`);
      throw err;
    }
  }
  

  generateFallbackArchitecture() {
    this.finalArchitecture = {
      "root": {
        "name": "Asset Pricing & PM",
        "id": "0",
        "children": [
          {
        "name": "Market Overview",
            "id": "0.0",
            "children": [
              {
                "name": "Price Discovery",
                "id": "0.0.0",
                "children": [
                  {
                    "name": "Data Collection Module",
                    "id": "0.0.0.0",
                    "children": [
                      {
                        "name": "Collect Market Data",
                        "id": "0.0.0.0.0",
                        "goal": "Gather relevant financial data for analysis",
                        "data_sources": ["Yahoo Finance", "Bloomberg", "Local exchanges"],
                        "methods": ["API calls", "Web scraping", "Database queries"],
                        "deliverables": ["Raw dataset", "Data quality report"]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    };
    
    return this.step4_DisplayResult();
  }

  _truncate(str = '', max = 3000) {
    return str.length > max ? str.slice(0, max) + '…(truncated)' : str;
  }

  // ---- REPLACED helper: hierarchical synthesis with size-aware chunking ----
  async _hierarchicalSynthesize(goal, childrenSummaries) {
    const MAX_PROMPT_CHARS = 12000; // safety margin
    const MAX_CHILD_SUMMARY_CHARS = 3500;

    // Pre-truncate any oversize child summary
    childrenSummaries = childrenSummaries.flatMap((child) => {
      if ((child.summary?.length || 0) <= MAX_CHILD_SUMMARY_CHARS) return [child];
      // slice summary into chunks and create pseudo children
      const parts = [];
      for (let i = 0; i < child.summary.length; i += MAX_CHILD_SUMMARY_CHARS) {
        parts.push({
          name: `${child.name} – part ${(i / MAX_CHILD_SUMMARY_CHARS) + 1}`,
          summary: child.summary.slice(i, i + MAX_CHILD_SUMMARY_CHARS) + '…',
        });
      }
      return parts;
    });

    // Batch children to fit within prompt limits
    const batches = [];
    let currentBatch = [];
    let currentCost = 0;

    for (const child of childrenSummaries) {
      const childCost = (child.name?.length || 0) + (child.summary?.length || 0);
      if (currentCost + childCost > MAX_PROMPT_CHARS && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [child];
        currentCost = childCost;
      } else {
        currentBatch.push(child);
        currentCost += childCost;
      }
    }
    if (currentBatch.length > 0) batches.push(currentBatch);

    // Synthesize each batch
    const batchSyntheses = [];
    for (const batch of batches) {
      try {
        const { data } = await this.llmLimiter(() => axios.post(`${API_BASE_URL}/agents/synthesize-branch`, {
          goal,
          childrenSummaries: batch,
        }));
        if (data?.synthesis) batchSyntheses.push(data.synthesis);
      } catch (err) {
        this._logProgress(`\t\t- ⚠️ Branch synthesis failed for batch: ${err.message}`);
        // Fallback: concatenate child summaries
        const fallback = batch.map(c => `**${c.name}**: ${c.summary}`).join('\n\n');
        batchSyntheses.push(this._truncate(fallback, 3000));
      }
    }

    // If multiple batches, synthesize the batch results
    if (batchSyntheses.length > 1) {
      try {
        const pseudoChildren = batchSyntheses.map((synthesis, i) => ({
          name: `${goal} - Batch ${i + 1}`,
          summary: synthesis,
        }));
        const { data } = await this.llmLimiter(() => axios.post(`${API_BASE_URL}/agents/synthesize-branch`, {
          goal,
          childrenSummaries: pseudoChildren,
        }));
        return data?.synthesis || batchSyntheses.join('\n\n');
      } catch (err) {
        this._logProgress(`\t\t- ⚠️ Final batch synthesis failed: ${err.message}`);
        return this._truncate(batchSyntheses.join('\n\n'), 6000);
      }
    }

    return batchSyntheses[0] || '';
  }

  async _generateFollowUpQuestions(report) {
    if (!geminiAI) return [];
    try {
      const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are FinBud. Read the following research report and suggest 3 concise follow-up research questions a finance analyst might ask next in Vietnamese. Return ONLY a JSON array of strings.\n\nREPORT:\n${report}`;
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 200 },
      });
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const arr = JSON.parse(jsonrepair(cleaned));
      return Array.isArray(arr) ? arr.slice(0, 5) : [];
    } catch (err) {
      console.error('Follow-up question generation failed:', err);
      return [];
    }
  }

  reset() {
    this.currentStep = 1;
    this.userPrompt = '';
    this.clarificationResponse = '';
    this.researchBrief = null;
    this.finalArchitecture = null;
    this.pipelineCompleted = false;
    if (this.socket) {
        this.socket.disconnect();
    }
    // Note: pipelineStartIndex is NOT reset here - it's set when starting new pipeline
    console.log('🔄 Deep Research Service reset - ready for new pipeline');
  }
}

// Export singleton instance
export const deepResearchService = new DeepResearchService();
