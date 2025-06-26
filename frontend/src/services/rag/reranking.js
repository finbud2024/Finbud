import { ChatOpenAI } from '@langchain/openai';
import { RerankingTemplate } from './prompt_templates';

class Reranker {
    constructor() {
        if (!process.env.VUE_APP_OPENAI_API_KEY) {
            throw new Error('Missing OpenAI API key. Please check environment variables.');
        }
    }

    async generateResponse(query, passages, keepTopK) {
        if (!query || typeof query !== 'string') {
            throw new Error('Query must be a non-empty string');
        }

        if (!passages || !Array.isArray(passages) || passages.length === 0) {
            throw new Error('Passages must be a non-empty array');
        }

        if (!keepTopK || typeof keepTopK !== 'number' || keepTopK <= 0) {
            throw new Error('keepTopK must be a positive number');
        }

        try {
            console.log('🔄 Creating reranking prompt...');
            const rerankingTemplate = new RerankingTemplate();
            const prompt = rerankingTemplate.createTemplate(keepTopK);
            
            // Validate prompt creation
            if (!prompt || typeof prompt.format !== 'function') {
                throw new Error('Failed to create reranking prompt template');
            }
            
            // Try to create the model
            let model;
            try {
                model = new ChatOpenAI({
                    modelName: "gpt-4o",
                    openAIApiKey: process.env.VUE_APP_OPENAI_API_KEY,
                    temperature: 0,
                    maxTokens: 1000
                });
            } catch (modelError) {
                console.error('❌ Error creating ChatOpenAI model:', modelError);
                throw new Error(`Failed to create OpenAI model: ${modelError.message}`);
            }

            // Clean and format passages with indices
            console.log('🔄 Formatting passages with indices...');
            const formattedPassages = passages
                .map((item, index) => `${index}: ${item.trim()}`)
                .filter(item => item.length > 0)
                .join('\n');

            console.log(`✅ Formatted ${passages.length} passages with indices`);

            // Create the formatted prompt
            const formattedPrompt = prompt.format({
                question: query,
                passages: formattedPassages,
                maxIndex: passages.length - 1
            });
            
            console.log('🔄 Formatted prompt length:', formattedPrompt.length);
            console.log('🔄 Prompt preview:', formattedPrompt.substring(0, 200) + '...');

            console.log('🔄 Invoking reranking model...');
            const response = await model.invoke(formattedPrompt);

            console.log('🔄 Raw response from model:', response);
            console.log('🔄 Response type:', typeof response);
            console.log('🔄 Response keys:', Object.keys(response || {}));

            if (!response) {
                throw new Error('No response received from reranking model');
            }

            // Handle different response formats from LangChain
            let content;
            if (typeof response === 'string') {
                content = response;
            } else if (response.content) {
                content = response.content;
            } else if (response.text) {
                content = response.text;
            } else if (response.message && response.message.content) {
                content = response.message.content;
            } else if (response.generations && response.generations[0] && response.generations[0].text) {
                content = response.generations[0].text;
            } else {
                console.error('Unexpected response format:', response);
                throw new Error('Invalid response format from reranking model');
            }

            if (!content || typeof content !== 'string') {
                throw new Error('Invalid content in reranking model response');
            }

            console.log('🔄 Processing reranked indices...');
            const trimmedContent = content.trim();
            console.log('🔄 Trimmed content:', trimmedContent);
            
            // Parse the indices from the response
            const indices = trimmedContent
                .split(rerankingTemplate.separator)
                .map(item => item.trim())
                .filter(item => item.length > 0)
                .map(item => parseInt(item, 10))
                .filter(index => !isNaN(index) && index >= 0 && index < passages.length);

            console.log('🔄 Parsed indices:', indices);

            // Ensure we have the correct number of indices
            if (indices.length === 0) {
                console.warn('No valid indices returned from reranker, falling back to first N passages');
                return Array.from({ length: Math.min(keepTopK, passages.length) }, (_, i) => i);
            }

            // If we got fewer indices than requested, pad with remaining indices
            if (indices.length < keepTopK) {
                const remainingIndices = Array.from({ length: passages.length }, (_, i) => i)
                    .filter(i => !indices.includes(i))
                    .slice(0, keepTopK - indices.length);
                indices.push(...remainingIndices);
            }

            // Ensure we don't return more than keepTopK
            const finalIndices = indices.slice(0, keepTopK);
            console.log(`✅ Generated ${finalIndices.length} reranked indices: [${finalIndices.join(', ')}]`);
            return finalIndices;
        } catch (error) {
            console.error('❌ Error in generateResponse:', {
                error: error.message,
                query,
                passagesCount: passages.length,
                keepTopK,
                stack: error.stack
            });
            
            // Log more details about the error
            if (error.response) {
                console.error('❌ API Response Error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            
            // Fallback to first N indices
            const fallbackIndices = Array.from({ length: Math.min(keepTopK, passages.length) }, (_, i) => i);
            console.log('🔄 Using fallback indices:', fallbackIndices);
            return fallbackIndices;
        }
    }
}

export default Reranker;