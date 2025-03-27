// Authentication middleware
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: Please log in' });
};

// Authorization middleware for admin-only routes
export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.accountData.priviledge === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admin access required' });
};

// Authorization middleware that checks if the user is accessing their own data or is an admin
export const isOwnerOrAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }

  // Allow access if user is an admin
  if (req.user.accountData.priviledge === 'admin') {
    return next();
  }

  // Allow access if user is accessing their own data
  const requestedUserId = req.params.userId || req.params.id;
  if (requestedUserId && req.user._id.toString() === requestedUserId) {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden: You can only access your own data' });
}; 