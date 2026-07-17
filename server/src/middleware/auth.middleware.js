import { verifyToken } from '../utils/jwt.utils.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Please log in again.' });
  }
};
