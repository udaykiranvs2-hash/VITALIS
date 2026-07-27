import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createToken } from '../utils/jwt.utils.js';
import {
  createUser,
  findUserByEmail,
  findUserByResetToken,
  isMongoConnected,
  updateUser
} from '../utils/fallbackStore.js';

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profile: user.profile,
  role: user.role,
  reports: user.reports,
  appointments: user.appointments,
  notifications: user.notifications,
  history: user.history
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, passwordHash, profile: { fullName: name } });
  const token = createToken({ id: user.id });

  return res.status(201).json({ token, user: sanitizeUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = createToken({ id: user.id });
  return res.status(200).json({ token, user: sanitizeUser(user) });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(200).json({ message: 'If this email is registered, instructions have been sent.' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  await updateUser(user.id, { resetToken, resetTokenExpires: Date.now() + 3600000 });

  return res.status(200).json({
    message: 'Password reset token generated.',
    resetToken
  });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Reset token and new password are required.' });
  }

  const user = await findUserByResetToken(token);
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token.' });
  }

  if (user.resetTokenExpires && user.resetTokenExpires <= Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired reset token.' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUser(user.id, { passwordHash, resetToken: null, resetTokenExpires: null });

  return res.status(200).json({ message: 'Password has been reset. You may now log in with your new password.' });
};
