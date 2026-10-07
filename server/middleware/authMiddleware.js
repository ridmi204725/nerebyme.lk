import jwt from 'jsonwebtoken';

// 1. Verifies token validity and extracts user information
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

    // Attach the verified user token profile payload to the request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// 2. Assumes req.user is already populated by verifyToken
export const verifyAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.userRole !== 'admin')) {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};
// Attaches req.user when a valid token exists, but keeps the route public when no token is supplied.
export const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'secret_key');
    }
  } catch (_) {}
  next();
};
