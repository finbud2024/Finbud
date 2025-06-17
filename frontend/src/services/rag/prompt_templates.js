class BasePromptTemplate {
    createTemplate() {
        throw new Error('Method createTemplate() must be implemented');
    }
}

class QueryExpansionTemplate extends BasePromptTemplate {
    constructor() {
        super();
        this.prompt = `You are an AI language model assistant. Your task is to generate {to_expand_to_n}
    different versions of the given user question to retrieve relevant documents from a vector
    database. By generating multiple perspectives on the user question, your goal is to help
    the user overcome some of the limitations of the distance-based similarity search.
    Provide these alternative questions separated by '{separator}'.
    Original question: {question}`;
    }

    get separator() {
        return "#next-question#";
    }

    createTemplate(toExpandToN) {
        return {
            format: ({ question }) => {
                return this.prompt
                    .replace('{to_expand_to_n}', toExpandToN)
                    .replace('{separator}', this.separator)
                    .replace('{question}', question);
            }
        };
    }
}

class SelfQueryTemplate extends BasePromptTemplate {
    constructor() {
        super();
        this.prompt = `You are an AI language model assistant. Your task is to extract information from a user question.
    The required information that needs to be extracted is the user name or user id. 
    Your response should consists of only the extracted user name (e.g., John Doe) or id (e.g. 1345256), nothing else.
    If the user question does not contain any user name or id, you should return the following token: none.
    
    For example:
    QUESTION 1:
    My name is Paul Iusztin and I want a post about...
    RESPONSE 1:
    Paul Iusztin
    
    QUESTION 2:
    I want to write a post about...
    RESPONSE 2:
    none
    
    QUESTION 3:
    My user id is 1345256 and I want to write a post about...
    RESPONSE 3:
    1345256
    
    User question: {question}`;
    }

    createTemplate() {
        return {
            format: ({ question }) => {
                return this.prompt.replace('{question}', question);
            }
        };
    }
}

class RerankingTemplate extends BasePromptTemplate {
    constructor() {
        super();
        this.prompt = `You are an AI language model assistant. Your task is to rerank passages related to a query
    based on their relevance. 
    The most relevant passages should be put at the beginning. 
    You should only pick at max {keep_top_k} passages.
    The provided and reranked documents are separated by '{separator}'.
    
    The following are passages related to this query: {question}.
    
    Passages: 
    {passages}`;
    }

    get separator() {
        return "\n#next-document#\n";
    }

    createTemplate(keepTopK) {
        return {
            format: ({ question, passages }) => {
                return this.prompt
                    .replace('{keep_top_k}', keepTopK)
                    .replace('{separator}', this.separator)
                    .replace('{question}', question)
                    .replace('{passages}', passages);
            }
        };
    }
}

export {
    QueryExpansionTemplate,
    SelfQueryTemplate,
    RerankingTemplate
}; 