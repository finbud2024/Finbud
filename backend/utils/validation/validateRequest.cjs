// Universal validation request wrapper for environment compatibility
// CommonJS version to avoid module conflicts

const validateRequest = (schema) => (req, res, next) => {
  const validKeys = Object.keys(schema.paths);
  //using breadth first search to get all keys in request body
  const requestBody = req.body;
  let requestKeys = [];
  let queue = [{current: requestBody, path: ''}];
  while(queue.length > 0){
    let {current, path} = queue.shift();
    for(let key in current){
      if(current.hasOwnProperty(key)){
        let newPath = path? `${path}.${key}`: key
        if(typeof current[key] === 'object' && current[key] !== null && !Array.isArray(current[key])){
          queue.push({current: current[key], path: newPath});
        }
        else{
          requestKeys.push(newPath);
        }
      }
    }
  }
  //check invalid keys
  const invalidKeys = requestKeys.filter(key => !validKeys.includes(key));
  if (invalidKeys.length > 0) {
    return res.status(400).json({ 
      error: `Invalid keys in request: ${invalidKeys.join(', ')}` 
    });
  }
  next();
};

// CommonJS export
module.exports = validateRequest; 