/**
 * FinBud Deep Research Chat Pipeline v1.0
 * 4-Step Process: Classifier → Clarify&Validate → Research Architect → Display
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const API_BASE_URL = process.env.VUE_APP_DEPLOY_URL;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('⚠️ GEMINI API KEY NOT CONFIGURED! Please set VUE_APP_GEMINI_API_KEY in your environment.');
}

const geminiAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export class DeepResearchService {
  constructor() {
    this.currentStep = 1; // 1: Classifier, 2: Clarify, 3: Architect, 4: Display
    this.userPrompt = '';
    this.clarificationResponse = '';
    this.researchBrief = null;
    this.finalArchitecture = null;
    this.pipelineCompleted = false; // Track if pipeline has completed
    this.pipelineStartIndex = 0; // Track where current pipeline started in conversation history
  }

  // Main entry point - determines which step to execute
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
- domain: Asset Pricing & PM | Risk Management | Macro & Policy | Corporate Finance | FinTech & Digital Assets | Derivatives & Quant
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
             this.researchBrief = JSON.parse(jsonMatch[0]);
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
        this.researchBrief = this.buildResearchBriefFromResponses();
      }

      console.log('📊 Research Brief for Step 3:', this.researchBrief);

      if (!geminiAI) {
        // Fallback JSON structure
        return this.generateFallbackArchitecture();
      }
      
      const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const architectPrompt = `# META PROMPT — FinBud · Deep Research Architect (Advanced MECE Synthesis Engine)

## SYSTEM IDENTITY & CAPABILITIES
You are FinBud's Elite Deep Research Architect AI, specialized in Meta Prompting for Complex Financial Reasoning. You operate with advanced structural decomposition and type-theoretic categorization capabilities.

## META PROMPTING FRAMEWORK APPLICATION

### 1. COMPLEX PROBLEM DECOMPOSITION
Primary Challenge: Transform abstract financial research requirements into concrete, executable 5-level MECE architecture
Sub-Problems:
- Domain categorization and boundary definition
- Strategic pillar identification with mutual exclusivity
- Research topic hierarchical mapping
- Implementation module specification
- Execution step operationalization

### 2. PRELIMINARY FOUNDATIONAL CONTENT
Research Brief Analysis:
${JSON.stringify(this.researchBrief, null, 2)}

Theoretical Framework:
- MECE Principle: Mutually Exclusive (no overlap), Collectively Exhaustive (complete coverage)
- Type Theory Application: Each level represents a distinct categorical type with specific properties
- Financial Domain Taxonomy: Asset Pricing & PM | Risk Management | Macro & Policy | Corporate Finance | FinTech & Digital Assets | Derivatives & Quant
- Research Methodology Hierarchy: Strategic → Tactical → Operational → Implementation → Execution

### 3. STEP-BY-STEP STRUCTURED REASONING

#### Meta-Question 1: Domain Boundary Definition
**Reasoning Pattern**: Given research brief, identify primary and secondary domain intersections
**Structural Template**: Domain(name, scope, boundary_conditions)
**Expected Output**: Single root domain with clear definitional boundaries

#### Meta-Question 2: Strategic Pillar Extraction  
**Reasoning Pattern**: Decompose domain into 3-5 mutually exclusive strategic areas
**Structural Template**: Pillar(strategic_focus, coverage_scope, sub_domains)
**Expected Output**: Complete strategic coverage without overlap

#### Meta-Question 3: Research Topic Hierarchical Mapping
**Reasoning Pattern**: For each pillar, identify 2-4 research topics with logical progression
**Structural Template**: Topic(research_focus, methodology_type, deliverable_category)
**Expected Output**: Coherent research progression within each pillar

#### Meta-Question 4: Implementation Module Specification
**Reasoning Pattern**: Transform research topics into actionable modules with clear dependencies
**Structural Template**: Module(implementation_focus, resource_requirements, success_criteria)
**Expected Output**: Operational modules with defined inputs/outputs

#### Meta-Question 5: Execution Step Operationalization
**Reasoning Pattern**: Break down modules into discrete, executable steps with metadata
**Structural Template**: Step(action, goal, data_sources, methods, deliverables)
**Expected Output**: Granular execution plan with complete metadata

### 4. ADVANCED MECE SYNTHESIS RULES

#### Structural Constraints:
- Exactly 5 levels: Domain(0) → Pillars(0.x) → Topics(0.x.y) → Modules(0.x.y.z) → Steps(0.x.y.z.w)
- ID Notation: Hierarchical dot notation (e.g., "0.2.1.3.1")
- Node Structure: {name, id, children[]} for levels 1-4; {name, id, goal, data_sources, methods, deliverables} for level 5
- Naming Convention: Concise, descriptive (≤5 words), domain-specific terminology

#### Content Requirements:
- Generate COMPREHENSIVE, DETAILED architecture with maximum depth and breadth
- Each pillar should have 3-4 research topics (not just 1-2)
- Each topic should have 3-4 implementation modules  
- Each module should have 4-6 execution steps
- Level 5 Steps MUST include: goal (specific, actionable), data_sources (detailed sources), methods (specific techniques), deliverables (concrete outputs)
- Financial domain relevance for entity: ${this.researchBrief.entities}
- Geographic scope: ${this.researchBrief.geography}
- Temporal focus: ${this.researchBrief.time_horizon}
- Research objective: ${this.researchBrief.objective}

#### Quality Assurance:
- Mutual Exclusivity: No content overlap between sibling nodes
- Collective Exhaustiveness: Complete coverage of parent scope
- Logical Progression: Each level builds upon previous level
- Implementation Feasibility: All steps must be executable with available tools/data

## OUTPUT SPECIFICATION
CRITICAL: Generate COMPREHENSIVE, COMPLETE, VALID JSON ONLY. Maximum depth and detail required.

Required Structure:
- Exactly 5 levels deep with MAXIMUM breadth at each level
- Domain → 3-4 Strategic Pillars → 3-4 Topics each → 3-4 Modules each → 4-6 Steps each
- Every node must have: name, id, children (except level 5)
- Level 5 nodes must have: name, id, goal, data_sources, methods, deliverables
- Keep names concise but descriptive (≤5 words)
- Ensure proper JSON syntax with balanced braces
- GOAL: Create the most comprehensive research architecture possible

Example minimal structure:
{
  "root": {
    "name": "Domain",
    "id": "0",
    "children": [
      {
        "name": "Pillar One",
        "id": "0.1",
        "children": [
          {
            "name": "Topic Alpha", 
            "id": "0.1.1",
            "children": [
              {
                "name": "Module A",
                "id": "0.1.1.1", 
                "children": [
                  {
                    "name": "Step 1",
                    "id": "0.1.1.1.1",
                    "goal": "objective",
                    "data_sources": ["source1"],
                    "methods": ["method1"],
                    "deliverables": ["output1"]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

Generate complete, valid JSON architecture now:`;

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
        
        this.finalArchitecture = JSON.parse(cleanJson);
        
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
        
        return this.step4_DisplayResult();
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

  buildResearchBriefFromResponses() {
    return {
      domain: this.extractDomain(this.userPrompt),
      objective: this.extractObjective(this.userPrompt),
      entities: this.extractEntities(this.userPrompt),
      time_horizon: this.extractTimeHorizon(this.clarificationResponse),
      geography: this.extractGeography(this.userPrompt, this.clarificationResponse), // Use both prompt and clarification
      data_constraints: "no preference",
      output_preferences: "detailed report, Vietnamese"
    };
  }

  generateFallbackArchitecture() {
    this.finalArchitecture = {
      "root": {
        "name": "Asset Pricing & PM",
        "id": "0",
        "children": [
          {
            "name": "Market Analysis",
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

  // Extraction helper methods
  extractDomain(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    // Macro & Policy indicators
    if (lowerPrompt.includes('cpi') || lowerPrompt.includes('inflation') || lowerPrompt.includes('lạm phát')) return 'Macro & Policy';
    if (lowerPrompt.includes('gdp') || lowerPrompt.includes('tăng trưởng kinh tế')) return 'Macro & Policy';
    if (lowerPrompt.includes('vĩ mô') || lowerPrompt.includes('macro') || lowerPrompt.includes('fed')) return 'Macro & Policy';
    if (lowerPrompt.includes('lãi suất') || lowerPrompt.includes('interest rate') || lowerPrompt.includes('monetary policy')) return 'Macro & Policy';
    // Asset Pricing & PM
    if (lowerPrompt.includes('cổ phiếu') || lowerPrompt.includes('stock')) return 'Asset Pricing & PM';
    if (lowerPrompt.includes('đầu tư') || lowerPrompt.includes('investment') || lowerPrompt.includes('portfolio')) return 'Asset Pricing & PM';
    // Risk Management
    if (lowerPrompt.includes('rủi ro') || lowerPrompt.includes('risk')) return 'Risk Management';
    return 'Asset Pricing & PM';
  }

  extractObjective(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('phân tích') || lowerPrompt.includes('analyze')) return 'analyze';
    if (lowerPrompt.includes('dự báo') || lowerPrompt.includes('forecast')) return 'forecast';
    if (lowerPrompt.includes('so sánh') || lowerPrompt.includes('compare')) return 'compare';
    return 'analyze';
  }

  extractEntities(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    // Macro indicators
    if (lowerPrompt.includes('cpi')) return 'CPI (Consumer Price Index)';
    if (lowerPrompt.includes('gdp')) return 'GDP (Gross Domestic Product)';
    if (lowerPrompt.includes('inflation') || lowerPrompt.includes('lạm phát')) return 'Inflation Rate';
    if (lowerPrompt.includes('lãi suất') || lowerPrompt.includes('interest rate')) return 'Interest Rate';
    // Stocks and indices
    if (lowerPrompt.includes('apple') || lowerPrompt.includes('aapl')) return 'Apple Inc. (AAPL)';
    if (lowerPrompt.includes('vn-index') || lowerPrompt.includes('vnindex')) return 'VN-Index';
    if (lowerPrompt.includes('bitcoin') || lowerPrompt.includes('btc')) return 'Bitcoin (BTC)';
    if (lowerPrompt.includes('s&p 500') || lowerPrompt.includes('sp500')) return 'S&P 500 Index';
    return 'Financial instruments';
  }

  extractTimeHorizon(answer) {
    if (!answer) return '3-year historical analysis';
    const lowerAnswer = answer.toLowerCase();
    if (lowerAnswer.includes('2020') || lowerAnswer.includes('5 năm') || lowerAnswer.includes('5 year')) {
      return '5-year analysis (2020-2024)';
    }
    if (lowerAnswer.includes('2022') || lowerAnswer.includes('3 năm') || lowerAnswer.includes('3 year')) {
      return '3-year analysis (2022-2024)';
    }
    return '3-year historical analysis';
  }

  extractGeography(prompt, clarificationResponse = '') {
    const lowerPrompt = prompt.toLowerCase();
    const lowerClarification = clarificationResponse.toLowerCase();
    const combined = `${lowerPrompt} ${lowerClarification}`;
    
    // Check clarification response first (more specific)
    if (lowerClarification.includes('vietnam') || lowerClarification.includes('việt nam')) {
      return 'Vietnam';
    }
    if (lowerClarification.includes('us') || lowerClarification.includes('america') || lowerClarification.includes('united states')) {
      return 'United States';
    }
    if (lowerClarification.includes('china') || lowerClarification.includes('trung quốc')) {
      return 'China';
    }
    if (lowerClarification.includes('japan') || lowerClarification.includes('nhật bản')) {
      return 'Japan';
    }
    
    // Fallback to original prompt
    if (combined.includes('vietnam') || combined.includes('việt nam') || combined.includes('vn-index')) {
      return 'Vietnam';
    }
    if (combined.includes('us') || combined.includes('america') || combined.includes('nasdaq')) {
      return 'United States';
    }
    if (combined.includes('global') || combined.includes('toàn cầu') || combined.includes('worldwide')) {
      return 'Global markets';
    }
    
    return 'Global markets';
  }

  reset() {
    this.currentStep = 1;
    this.userPrompt = '';
    this.clarificationResponse = '';
    this.researchBrief = null;
    this.finalArchitecture = null;
    this.pipelineCompleted = false;
    // Note: pipelineStartIndex is NOT reset here - it's set when starting new pipeline
    console.log('🔄 Deep Research Service reset - ready for new pipeline');
  }
}

// Export singleton instance
export const deepResearchService = new DeepResearchService();