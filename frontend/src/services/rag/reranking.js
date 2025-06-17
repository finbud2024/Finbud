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
            
            const model = new ChatOpenAI({
                modelName: "gpt-4o",
                openAIApiKey: process.env.VUE_APP_OPENAI_API_KEY,
                temperature: 0
            });

            // Clean and join passages
            console.log('🔄 Cleaning passages...');
            const cleanedPassages = passages
                .map(item => item.trim())
                .filter(item => item.length > 0)
                .join(rerankingTemplate.separator);
            
            console.log(`✅ Cleaned ${passages.length} passages`);

            console.log('🔄 Invoking reranking model...');
            const response = await model.invoke(prompt.format({
                question: query,
                passages: cleanedPassages
            }));

            if (!response || !response.content) {
                throw new Error('Invalid response from reranking model');
            }

            console.log('🔄 Processing reranked results...');
            const content = response.content;
            const rerankedPassages = content
                .trim()
                .split(rerankingTemplate.separator)
                .map(item => item.trim())
                .filter(item => item.length > 0);

            console.log(`✅ Generated ${rerankedPassages.length} reranked passages`);
            return rerankedPassages;
        } catch (error) {
            console.error('❌ Error in generateResponse:', {
                error: error.message,
                query,
                stack: error.stack
            });
            return [];
        }
    }
}

export default Reranker;