// CommonJS wrapper for ES Module server.mjs
// This file uses dynamic import to load the ES Module

module.exports.handler = async (event, context) => {
  try {
    // Dynamic import of the ES Module
    const { handler } = await import('./server.mjs');
    return await handler(event, context);
  } catch (error) {
    console.error('Error loading ES Module:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      })
    };
  }
}; 