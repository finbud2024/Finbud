import QueryExpansion from './query_expansion.js';
import SelfQuery from './self_query.js';
import Reranker from './reranking.js';
import embedder from './embedder.js';
import api from '@/utils/api.js'

class VectorRetriever {
    constructor(query) {
        if (!query || typeof query !== 'string') {
            throw new Error('Query must be a non-empty string');
        }
        this.query = query;
        this._embedder = null;
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
        try {
            const query_vector = await embedder.embedSentence(generatedQuery);
            if (!query_vector || !Array.isArray(query_vector)) {
                throw new Error('Failed to generate query vector');
            }

            const searchFilter = this._constructSearchQuery(collectionType, additionalFilters);
            const allResults = [];
            
            // Calculate limit per collection, ensuring it's at least 1
            const limitPerCollection = Math.max(k);
            
            for (const dataType of VectorRetriever.COLLECTION_TYPES) {
                const collectionName = this._getVectorCollectionName(dataType);
                try {
                    const response = await api.post(`/api/qdrant/search/${collectionName}`, {
                        query_vector: query_vector,
                        limit: limitPerCollection,
                        filter: searchFilter
                    });
                    
                    if (response.data && Array.isArray(response.data)) {
                        allResults.push(...response.data);
                    } else {
                        console.error(`Invalid response format from ${collectionName}:`, response.data);
                    }
                } catch (error) {
                    console.error(`Error searching ${collectionName}:`, {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status
                    });
                    continue;
                }
            }
            return allResults;
        } catch (error) {
            console.error('Search error:', error.message);
            return [];
        }
    }

    _constructSearchQuery(collectionType = null, additionalFilters = null) {
        const mustConditions = [];
        
        if (collectionType) {
            mustConditions.push({
                key: "type",
                match: { value: collectionType }
            });
        }
        
        return mustConditions.length > 0 ? { must: mustConditions } : null;
    }

    async retrieveTopK(k = 3, toExpandToNQueries = 5, collectionType = null, additionalFilters = null) {
        try {
            const metadata = await this._metadataExtractor.extractMetadata(this.query);
            this.query = metadata.modified_query;
            
            // Generate more expanded queries
            const generatedQueries = await this._queryExpander.generateResponse(
                this.query,
                toExpandToNQueries
            );
            
            console.log('Generated queries:', generatedQueries);
            
            // Search with each generated query
            const allHits = (await Promise.all(
                generatedQueries.map(query => 
                    this._searchSingleQuery(
                        query,
                        collectionType,
                        additionalFilters,
                        k * 2
                    )
            ))).flat();
            

            // Sort by score and keep more results for reranking
            allHits.sort((a, b) => b.score - a.score);
            const topHits = allHits.slice(0, k * 2); // Keep more results for reranking

            // Rerank the expanded set of results
            const rerankedResults = await this.rerank(topHits, k);
            return rerankedResults;
        } catch (error) {
            console.error('Retrieval error:', error.message);
            return [];
        }
    }

    async rerank(hits, keepTopK = 5) {
        if (!hits?.length) return [];
        
        try {
            console.log(`🔄 Starting reranking of ${hits.length} hits...`);
            const contentList = hits.map(hit => hit.payload.content);
            const rerankedIndices = await this._reranker.generateResponse(
                this.query,
                contentList,
                keepTopK
            );
            
            // Use the indices to get the corresponding hits
            const rerankedHits = rerankedIndices.map(index => hits[index]).filter(Boolean);
            console.log(`✅ Reranked ${rerankedHits.length} hits with full metadata`);
            return rerankedHits;
        } catch (error) {
            console.error('❌ Reranking failed, falling back to score-based ranking:', error.message);
            // Fallback to top k by score
            const fallbackHits = hits.slice(0, keepTopK);
            console.log(`🔄 Using fallback ranking for ${fallbackHits.length} hits`);
            return fallbackHits;
        }
    }

    setQuery(query) {
        this.query = query;
    }
}

export default VectorRetriever;