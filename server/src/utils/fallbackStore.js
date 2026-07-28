import crypto from 'crypto';
import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const memoryUsers = globalThis.__vitalisMemoryUsers ?? (globalThis.__vitalisMemoryUsers = new Map());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storageFile = path.join(__dirname, '../data/local-users.json');

const normalizeEmail = (email) => (email || '').toLowerCase().trim();

const demoUserSeed = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  passwordHash: '$2b$10$NwrZlb/vYqG5gfcRFCdrMOoaYP2Ffsc0A7twme/P6Zn02Va2RsUoi',
  role: 'user',
  profile: { fullName: 'Demo User' },
  reports: [],
  appointments: [],
  notifications: [],
  history: [],
  resetToken: null,
  resetTokenExpires: null
};

const toUserRecord = (data) => ({
  _id: data._id || data.id || crypto.randomUUID(),
  id: data.id || data._id || crypto.randomUUID(),
  name: data.name || '',
  email: normalizeEmail(data.email),
  passwordHash: data.passwordHash,
  role: data.role || 'user',
  profile: data.profile || {},
  reports: data.reports || [],
  appointments: data.appointments || [],
  notifications: data.notifications || [],
  history: data.history || [],
  resetToken: data.resetToken,
  resetTokenExpires: data.resetTokenExpires
});

const createMemoryUser = async (data) => {
  const user = toUserRecord(data);
  memoryUsers.set(user._id, user);
  await persistUsers();
  return user;
};

const persistUsers = async () => {
  const users = Array.from(memoryUsers.values()).map((user) => ({
    _id: user._id,
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    profile: user.profile || {},
    reports: user.reports || [],
    appointments: user.appointments || [],
    notifications: user.notifications || [],
    history: user.history || [],
    resetToken: user.resetToken,
    resetTokenExpires: user.resetTokenExpires
  }));

  await fs.mkdir(path.dirname(storageFile), { recursive: true });
  await fs.writeFile(storageFile, JSON.stringify(users, null, 2), 'utf8');
};

const loadUsersFromDisk = async () => {
  try {
    const raw = await fs.readFile(storageFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore and fall back to seeded data below.
  }

  return [];
};

const getUserById = (id) => Array.from(memoryUsers.values()).find((user) => user.id === id || user._id === id) || null;

export const isMongoConnected = () => mongoose.connection.readyState === 1;

const ensureSeedUsers = async () => {
  if (memoryUsers.size > 0) {
    return;
  }

  const storedUsers = await loadUsersFromDisk();
  if (storedUsers.length > 0) {
    storedUsers.forEach((userData) => {
      memoryUsers.set(userData._id || userData.id, toUserRecord(userData));
    });
    return;
  }

  await createMemoryUser(demoUserSeed);
};

export const findUserByEmail = async (email) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.findOne({ email: normalizeEmail(email) });
  }

  await ensureSeedUsers();
  return Array.from(memoryUsers.values()).find((user) => user.email === normalizeEmail(email)) || null;
};

export const findUserById = async (id) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.findById(id);
  }

  await ensureSeedUsers();
  return getUserById(id);
};

export const findUserByResetToken = async (token) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.findOne({ resetToken: token });
  }

  await ensureSeedUsers();
  return Array.from(memoryUsers.values()).find((user) => user.resetToken === token) || null;
};

export const createUser = async (data) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.create(data);
  }

  await ensureSeedUsers();
  return createMemoryUser({ ...data, email: normalizeEmail(data.email) });
};

export const updateUser = async (id, updates) => {
  if (isMongoConnected()) {
    const UserModel = (await import('../models/User.model.js')).default;
    return UserModel.findByIdAndUpdate(id, updates, { new: true });
  }

  await ensureSeedUsers();
  const existingUser = getUserById(id);
  if (!existingUser) {
    return null;
  }

  const updatedUser = { ...existingUser, ...updates, _id: existingUser._id, id: existingUser.id, email: normalizeEmail(updates.email || existingUser.email) };
  memoryUsers.set(existingUser._id, updatedUser);
  await persistUsers();
  return updatedUser;
};
