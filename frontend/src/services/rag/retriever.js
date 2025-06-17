import { QdrantClient } from '@qdrant/js-client-rest';
import QueryExpansion from './query_expansion.js';
import SelfQuery from './self_query.js';
import Reranker from './reranking.js';
import embedder from './embedder.js';

class VectorRetriever {
    constructor(query) {
        if (!query || typeof query !== 'string') {
            throw new Error('Query must be a non-empty string');
        }
        
        if (!process.env.VUE_APP_QDRANT_CLOUD_URL || !process.env.VUE_APP_QDRANT_APIKEY) {
            throw new Error('Missing Qdrant configuration. Please check environment variables.');
        }

        this._client = new QdrantClient({
            url: process.env.VUE_APP_QDRANT_CLOUD_URL,
            apiKey: process.env.VUE_APP_QDRANT_APIKEY
        });
        this.query = query;
        this._embedder = null; // Lazy loading
        this._queryExpander = new QueryExpansion();
        this._metadataExtractor = new SelfQuery();
        this._reranker = new Reranker();
    }

    static COLLECTION_TYPES = [
        "edgar_fillings",
        "earnings_call_transcripts",
        "financial_news",
        "investopedia",
        "macro_economic_reports"
    ];

    _getVectorCollectionName(dataType) {
        return `vector_${dataType}`;
    }

    async _searchSingleQuery(generatedQuery, collectionType = null, additionalFilters = null, k = 3) {
        if (!generatedQuery || typeof generatedQuery !== 'string') {
            console.error('Invalid query in _searchSingleQuery:', generatedQuery);
            return [];
        }

        try {
            const queryVector = await embedder.embedSentence(generatedQuery);
            
            if (!queryVector || !Array.isArray(queryVector)) {
                throw new Error('Failed to generate query vector');
            }

            const searchFilter = this._constructSearchQuery(collectionType, additionalFilters);
            
            const allResults = [];
            for (const dataType of VectorRetriever.COLLECTION_TYPES) {
                const collectionName = this._getVectorCollectionName(dataType);
                try {
                    console.log(`🔍 Searching collection: ${collectionName}`);
                    const results = await this._client.search(collectionName, {
                        vector: queryVector,
                        filter: searchFilter,
                        limit: Math.floor(k / VectorRetriever.COLLECTION_TYPES.length)
                    });
                    console.log(`✅ Found ${results.length} results in ${collectionName}`);
                    allResults.push(...results);
                } catch (error) {
                    console.error(`❌ Error searching collection ${collectionName}:`, {
                        error: error.message,
                        query: generatedQuery
                    });
                    continue;
                }
            }
            return allResults;
        } catch (error) {
            console.error('❌ Error in _searchSingleQuery:', {
                error: error.message,
                query: generatedQuery,
            });
            return [];
        }
    }

    _constructSearchQuery(collectionType = null, additionalFilters = null) {
        const mustConditions = [];
        
        if (collectionType) {
            mustConditions.push({
                key: 'type',
                match: { value: collectionType }
            });
        }
        
        if (additionalFilters) {
            for (const [key, value] of Object.entries(additionalFilters)) {
                mustConditions.push({
                    key,
                    match: { value }
                });
            }
        }
        
        return mustConditions.length > 0 ? { must: mustConditions } : null;
    }

    async retrieveTopK(k = 3, toExpandToNQueries = 2, collectionType = null, additionalFilters = null) {
        try {
            console.log('🔄 Extracting metadata from query...');
            const metadata = await this._metadataExtractor.extractMetadata(this.query);
            this.query = metadata.modified_query;
            console.log('✅ Query modified:', this.query);
            
            console.log('🔄 Generating expanded queries...');
            const generatedQueries = await this._queryExpander.generateResponse(
                this.query,
                toExpandToNQueries
            );
            console.log(`✅ Generated ${generatedQueries.length} queries`);
            
            const allHits = [];
            for (const query of generatedQueries) {
                console.log(`🔍 Processing query: ${query}`);
                const hits = await this._searchSingleQuery(
                    query,
                    collectionType,
                    additionalFilters,
                    k
                );
                allHits.push(...hits);
            }

            allHits.sort((a, b) => b.score - a.score);
            const topHits = allHits.slice(0, k);
            console.log(`✅ Retrieved ${topHits.length} total hits`);
            return topHits;
        } catch (error) {
            console.error('❌ Error in retrieveTopK:', {
                error: error.message,
                query: this.query,
                stack: error.stack
            });
            return [];
        }
    }

    async rerank(hits, keepTopK = 3) {
        if (!hits || !Array.isArray(hits) || hits.length === 0) {
            console.warn('⚠️ No hits provided for reranking');
            return [];
        }

        try {
            console.log('🔄 Preparing content for reranking...');
            const contentList = hits.map(hit => hit.payload.content);
            console.log(`✅ Prepared ${contentList.length} passages for reranking`);
            
            const result = await this._reranker.generateResponse(
                this.query,
                contentList,
                keepTopK
            );
            console.log(`✅ Reranked into ${result.length} passages`);
            return result;
        } catch (error) {
            console.error('❌ Error in rerank:', {
                error: error.message,
                stack: error.stack
            });
            return [];
        }
    }

    setQuery(query) {
        this.query = query;
    }
}

export default VectorRetriever;