// middleware/validateRequest.js
const validateRequest = (schema) => (req, res, next) => {
    const validKeys = Object.keys(schema.paths);
    const requestKeys = Object.keys(req.body);
    
    const invalidKeys = requestKeys.filter(key => !validKeys.includes(key));
  
    if (invalidKeys.length > 0) {
      return res.status(400).json({ 
        error: `Invalid keys in request: ${invalidKeys.join(', ')}` 
      });
    }
  
    next();
  };
  
  export default validateRequest;
  