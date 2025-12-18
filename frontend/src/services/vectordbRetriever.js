// core/qdrantDatabaseConnector.js
import { QdrantClient, Distance } from '@qdrant/js-client-rest';

class QdrantDatabaseConnector {
  static instance = null;

  constructor() {
    if (!QdrantDatabaseConnector.instance) {
      QdrantDatabaseConnector.instance = new QdrantClient({
        url: process.env.QDRANT_CLOUD_URL,
        apiKey: process.env.QDRANT_APIKEY
      });
    }
  }

  getClient() {
    return QdrantDatabaseConnector.instance;
  }

  async getCollection(collectionName) {
    return await this.getClient().getCollection({ collectionName });
  }

  async createNonVectorCollection(collectionName) {
    await this.getClient().createCollection({
      collectionName,
      vectors: {
        dummy: {
          size: 1,
          distance: Distance.Cosine
        }
      }
    });
  }

  async createVectorCollection(collectionName) {
    await this.getClient().createCollection({
      collectionName,
      vectors: {
        size: settings.EMBEDDING_SIZE,
        distance: Distance.Cosine
      }
    });
  }

  async writeData(collectionName, points) {
    try {
      await this.getClient().upsert({
        collectionName,
        points
      });
    } catch (err) {
      logger.error("An error occurred while inserting data.", err);
      throw err;
    }
  }

  async search(collectionName, queryVector, queryFilter = null, limit = 3) {
    return await this.getClient().search({
      collectionName,
      vector: queryVector,
      filter: queryFilter,
      limit
    });
  }

  async scroll(collectionName, limit = 10) {
    return await this.getClient().scroll({
      collectionName,
      limit
    });
  }

  close() {
    // Not strictly needed in JS; placeholder for symmetry
    logger.info("Connected to database has been closed.");
  }
}

module.exports = QdrantDatabaseConnector;
