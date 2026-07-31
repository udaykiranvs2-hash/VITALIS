import { supabase } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw error || new Error('Invalid token');
    }
    req.userId = user.id;
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Please log in again.' });
  }
};
