import crypto from 'crypto';
import mongoose from 'mongoose';

const memoryUsers = globalThis.__vitalisMemoryUsers ?? (globalThis.__vitalisMemoryUsers = new Map());

const normalizeEmail = (email) => (email || '').toLowerCase().trim();

const createMemoryUser = (data) => {
  const user = {
    _id: data._id || crypto.randomUUID(),
    id: data._id || crypto.randomUUID(),
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
    resetTokenExpires: data.resetTokenExpires,
    save: async function save() {
      memoryUsers.set(this._id, this);
      return this;
    }
  };

  memoryUsers.set(user._id, user);
  return user;
};

export const isMongoConnected = () => mongoose.connection.readyState === 1;

export const findUserByEmail = async (email) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.findOne({ email: normalizeEmail(email) });
  }

  return Array.from(memoryUsers.values()).find((user) => user.email === normalizeEmail(email)) || null;
};

export const findUserById = async (id) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.findById(id);
  }

  return memoryUsers.get(id) || null;
};

export const findUserByResetToken = async (token) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.findOne({ resetToken: token });
  }

  return Array.from(memoryUsers.values()).find((user) => user.resetToken === token) || null;
};

export const createUser = async (data) => {
  if (isMongoConnected()) {
    return (await import('../models/User.model.js')).default.create(data);
  }

  return createMemoryUser({ ...data, email: normalizeEmail(data.email) });
};
