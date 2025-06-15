import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { DeepResearchService } from '../src/services/deepResearchService.js';
import { MECE_JSON_RESPONSE, RESEARCH_BRIEF } from './mockData.js';

// Mock axios to avoid actual API calls
vi.mock('axios');

// Mock socket.io-client to avoid actual WebSocket connections
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
  })),
}));

describe('DeepResearchService - MECE Pipeline Test', () => {
  let deepResearchService;
  let mockLogCallback;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Create a mock logger
    mockLogCallback = vi.fn();

    // Instantiate the service
    deepResearchService = new DeepResearchService(mockLogCallback);
    
    // Set up the initial state for the pipeline run
    deepResearchService.finalArchitecture = MECE_JSON_RESPONSE;
    deepResearchService.researchBrief = RESEARCH_BRIEF;
  });

  it('should orchestrate the full MECE pipeline correctly', async () => {
    // --- MOCK API RESPONSES ---

    axios.post.mockImplementation((url) => {
      if (url.endsWith('/agents/search')) {
        return Promise.resolve({ data: { links: ['http://mockurl.com/article1'] } });
      }
      if (url.endsWith('/agents/scrape')) {
        return Promise.resolve({ data: { source: url, content: 'Scraped content from mock URL.' } });
      }
      if (url.endsWith('/agents/summarize-leaf')) {
        return Promise.resolve({ data: { summary: 'This is a mock leaf summary.' } });
      }
      if (url.endsWith('/agents/synthesize-branch')) {
        return Promise.resolve({ data: { synthesis: 'This is a mock branch synthesis.' } });
      }
      if (url.endsWith('/agents/compile-report')) {
        return Promise.resolve({ data: { report: '## Mock Master Report' } });
      }
      if (url.endsWith('/agents/qa-fact-check')) {
        return Promise.resolve({
          data: {
            finalReport: '## Mock Master Report\n\n---\n*Verified by FinBud QA Bot ✅*',
            analytics: { plagiarismScore: 0.01, coverage: 'good', brokenLinks: 0 },
          },
        });
      }
      return Promise.reject(new Error(`No mock for API endpoint: ${url}`));
    });

    // --- EXECUTE THE PIPELINE ---

    const finalResult = await deepResearchService.runMECEPipeline();

    // --- ASSERTIONS ---

    // 1. Verify logging
    expect(mockLogCallback).toHaveBeenCalledWith('🚀 **Starting Deep Research Pipeline**');
    expect(mockLogCallback).toHaveBeenCalledWith('Step 2-5: Began Task Orchestration (DFS traversal, leaf processing, and branch synthesis)...');
    expect(mockLogCallback).toHaveBeenCalledWith(expect.stringContaining('Processing Leaf:'));
    expect(mockLogCallback).toHaveBeenCalledWith(expect.stringContaining('Synthesizing Branch:'));
    expect(mockLogCallback).toHaveBeenCalledWith('Step 6: Compiling Master Report...');
    expect(mockLogCallback).toHaveBeenCalledWith('Step 7: Performing QA and Fact-Checking...');
    expect(mockLogCallback).toHaveBeenCalledWith('✅ **Research Complete!**');

    // 2. Verify API calls (check count and URLs)
    // The number of calls depends on the structure of the mock JSON.
    // Based on the provided MECE_JSON, let's calculate expected calls.
    // It has 36 leaf nodes.
    const leafNodeCount = 36; 
    // It has 1 (root) + 4 (pillars) + 12 (topics) + 24 (modules) = 41 branch nodes.
    // Let's recount from the JSON
    // root: 1
    // level 1 (pillars): 4
    // level 2 (topics): 2 + 2 + 2 + 2 = 8
    // level 3 (modules): 4 + 4 + 4 + 4 = 16
    // Total branch nodes = 1 + 4 + 8 + 16 = 29. Wait, my previous calculation was also off. Let's re-verify from the data.
    // root (1) -> 4 children (0.1, 0.2, 0.3, 0.4)
    // 0.1 -> 2 children (0.1.1, 0.1.2)
    // 0.2 -> 2 children (0.2.1, 0.2.2)
    // 0.3 -> 2 children (0.3.1, 0.3.2)
    // 0.4 -> 2 children (0.4.1, 0.4.2)
    // So that's 1 + 4 + (4 * 2) = 13 branch nodes that have children.
    // The next level of branches:
    // 0.1.1 -> 2 children
    // 0.1.2 -> 2 children
    // 0.2.1 -> 2 children
    // 0.2.2 -> 2 children
    // 0.3.1 -> 2 children
    // 0.3.2 -> 2 children
    // 0.4.1 -> 2 children
    // 0.4.2 -> 2 children
    // So that's another 8 * 2 = 16 branches.
    // The leaves are the final children. Let's count them.
    // Each of the 16 branches above has 3 leaves. 16 * 3 = 48. My previous count was wrong.
    const leafNodeCountActual = 48;
    const branchNodeCountActual = 1 + 4 + 8 + 16;


    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/agents/search'), expect.any(Object));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/agents/scrape'), expect.any(Object));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/agents/summarize-leaf'), expect.any(Object));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/agents/synthesize-branch'), expect.any(Object));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/agents/compile-report'), expect.any(Object));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/agents/qa-fact-check'), expect.any(Object));
    
    // Verify the number of calls for leaf/branch processing
    const searchCalls = axios.post.mock.calls.filter(call => call[0].endsWith('/search')).length;
    // Each search call returns 1 URL, so 1 scrape call per search call.
    const scrapeCalls = axios.post.mock.calls.filter(call => call[0].endsWith('/scrape')).length;
    const summarizeCalls = axios.post.mock.calls.filter(call => call[0].endsWith('/summarize-leaf')).length;
    const synthesizeCalls = axios.post.mock.calls.filter(call => call[0].endsWith('/synthesize-branch')).length;

    expect(searchCalls).toBe(leafNodeCountActual);
    expect(scrapeCalls).toBe(leafNodeCountActual);
    expect(summarizeCalls).toBe(leafNodeCountActual);
    expect(synthesizeCalls).toBe(branchNodeCountActual);


    // 3. Verify the final output
    expect(typeof finalResult).toBe('string');
    expect(finalResult).toContain('**Research Brief:**');
    expect(finalResult).toContain('## Mock Master Report');
    expect(finalResult).toContain('*Verified by FinBud QA Bot ✅*');
    expect(finalResult).toContain('Feedback: Was this report helpful?');
  });
}); 