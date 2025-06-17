import { pipeline } from '@xenova/transformers';

class Embedder {
    constructor() {
        this._extractor = null;
        this._initialized = false;
    }

    async initialize() {
        if (this._initialized) return;

        try {
            console.log('🔄 Initializing embedder...');
            this._extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
            this._initialized = true;
            console.log('✅ Embedder initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing embedder:', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async embedSentence(sentence) {
        if (!this._initialized) {
            await this.initialize();
        }

        if (!sentence || typeof sentence !== 'string') {
            throw new Error('Sentence must be a non-empty string');
        }

        try {
            console.log('🔄 Computing embedding for sentence...');
            const embedding = await this._extractor(sentence, { 
                pooling: 'mean', 
                normalize: true 
            });

            if (!embedding || !embedding.data) {
                throw new Error('Invalid embedding result');
            }

            // Convert tensor to array
            const embeddingArray = Array.from(embedding.data);
            console.log(`✅ Generated embedding with dimension: ${embeddingArray.length}`);
            
            return embeddingArray;
        } catch (error) {
            console.error('❌ Error computing embedding:', {
                error: error.message,
                sentence,
                stack: error.stack
            });
            throw error;
        }
    }

    async embedSentences(sentences) {
        if (!this._initialized) {
            await this.initialize();
        }

        if (!Array.isArray(sentences) || sentences.length === 0) {
            throw new Error('Sentences must be a non-empty array');
        }

        try {
            console.log(`🔄 Computing embeddings for ${sentences.length} sentences...`);
            const embeddings = await this._extractor(sentences, { 
                pooling: 'mean', 
                normalize: true 
            });

            if (!embeddings || !embeddings.data) {
                throw new Error('Invalid embeddings result');
            }

            // Convert tensor to array of arrays
            const embeddingsArray = Array.from(embeddings.data).reduce((acc, val, idx) => {
                const chunkIndex = Math.floor(idx / embeddings.dims[1]);
                if (!acc[chunkIndex]) acc[chunkIndex] = [];
                acc[chunkIndex].push(val);
                return acc;
            }, []);

            console.log(`✅ Generated ${embeddingsArray.length} embeddings with dimension: ${embeddingsArray[0].length}`);
            return embeddingsArray;
        } catch (error) {
            console.error('❌ Error computing embeddings:', {
                error: error.message,
                sentences,
                stack: error.stack
            });
            throw error;
        }
    }
}

// Create a singleton instance
const embedder = new Embedder();

// Export the singleton instance
export default embedder;
