import bcrypt from 'bcryptjs';
import { findUserById, updateUser } from '../utils/fallbackStore.js';

const sanitizeProfile = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profile: user.profile,
  reports: user.reports,
  appointments: user.appointments,
  notifications: user.notifications,
  history: user.history
});

export const getProfile = async (req, res) => {
  const user = await findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.status(200).json({ user: sanitizeProfile(user) });
};

export const updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  const updatedUser = await updateUser(req.userId, { profile: { ...user.profile, ...updates } });
  return res.status(200).json({ user: sanitizeProfile(updatedUser), message: 'Profile updated successfully.' });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required.' });
  }

  const user = await findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUser(req.userId, { passwordHash });

  return res.status(200).json({ message: 'Password changed successfully.' });
};

export const getNotifications = async (req, res) => {
  const user = await findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.status(200).json({ notifications: user.notifications.slice(-10).reverse() });
};
