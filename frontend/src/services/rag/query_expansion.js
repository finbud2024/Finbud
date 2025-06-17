import { ChatOpenAI } from '@langchain/openai';
import { QueryExpansionTemplate } from './prompt_templates.js';

class QueryExpansion {
    async generateResponse(query, toExpandToN) {
        try {
            console.log('🔄 Creating query expansion prompt...');
            const queryExpansionTemplate = new QueryExpansionTemplate();
            const prompt = queryExpansionTemplate.createTemplate(toExpandToN);
            
            const model = new ChatOpenAI({
                modelName: "gpt-4o",
                openAIApiKey: process.env.VUE_APP_OPENAI_API_KEY,
                temperature: 0,
            });

            console.log('🔄 Generating expanded queries...');
            const response = await model.invoke(prompt.format({ question: query }));
            const content = response.content;
            console.log('🔄 Processing expanded queries...');
            const queries = content.trim().split(queryExpansionTemplate.separator);
            const validQueries = queries
                .map(item => item.trim())
                .filter(item => item.length > 0);

            console.log(`✅ Generated ${validQueries.length} expanded queries`);
            return validQueries;
        } catch (error) {
            console.error('Error in generateResponse:', {
                error: error.message,
                query
            });
            return [];
        }
    }
}

export default QueryExpansion; 