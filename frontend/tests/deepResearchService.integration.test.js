import { describe, it, expect, vi, beforeEach } from 'vitest';
// axios is NOT mocked here, it will make real API calls
import axios from 'axios';
import { DeepResearchService } from '../src/services/deepResearchService.js';
// We still use the mock JSON to START the pipeline
import { MECE_JSON_RESPONSE_SIMPLE, MECE_JSON_FULL_RESPONSE, RESEARCH_BRIEF } from './mockData.js';

// Mock socket.io-client as we are focused on testing the HTTP agent pipeline
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
  })),
}));

// Note: This is an INTEGRATION TEST. It requires the backend server to be running
// with valid API keys for Serper and Gemini
describe('DeepResearchService - MECE Pipeline Integration Test', () => {
  let deepResearchService;
  let mockLogCallback;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogCallback = vi.fn();
    deepResearchService = new DeepResearchService(mockLogCallback);
    deepResearchService.finalArchitecture = MECE_JSON_FULL_RESPONSE;
    deepResearchService.researchBrief = RESEARCH_BRIEF;
  });

  // Increase timeout for this test as it involves real network calls that can be slow.
  it('should run the full pipeline with REAL API calls', async () => {
    // --- NO MOCKING for axios ---
    // The test will make real HTTP requests to the running backend server.

    // --- EXECUTE THE PIPELINE ---
    const finalResult = await deepResearchService.runMECEPipeline();

    // --- ASSERTIONS ---

    // 1. Verify logging - check that the process started and completed
    // expect(mockLogCallback).toHaveBeenCalledWith('🚀 **Starting Deep Research Pipeline**');
    // expect(mockLogCallback).toHaveBeenCalledWith(expect.stringContaining('Processing Leaf:'));
    // expect(mockLogCallback).toHaveBeenCalledWith(expect.stringContaining('Synthesizing Branch:'));
    // expect(mockLogCallback).toHaveBeenCalledWith('✅ **Research Complete!**');
    
    // Log the full output for manual inspection if needed
    console.log("--- Full Integration Test Output ---");
    console.log(finalResult);
    console.log("------------------------------------");

    // 2. Verify the final output
    // We can't check for exact content, but we can check for structure and relevance.
    expect(typeof finalResult).toBe('string');
    expect(finalResult.length).toBeGreaterThan(200); // Expect a reasonably long report
    expect(finalResult).toContain('**Research Brief:**');
    // Check for a keyword from the research brief
    expect(finalResult.toLowerCase()).toContain('tesla'); 
    // expect(finalResult).toContain('*Verified by FinBud QA Bot ✅*');
    expect(finalResult).toContain('Feedback: Was this report helpful?');

  }, 600000); // Set a long timeout (10 minutes) for this test
}); 