import crypto from 'crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import supabase from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageFile = path.join(__dirname, '../../data/users.json');

const memoryUsers = globalThis.__vitalisMemoryUsers ?? (globalThis.__vitalisMemoryUsers = new Map());

const normalizeEmail = (email) => (email || '').toLowerCase().trim();
const generateId = () => (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));

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

const mapSupabaseUser = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: String(row.id),
    id: String(row.id),
    name: row.name || '',
    email: normalizeEmail(row.email),
    passwordHash: row.password_hash || row.passwordHash,
    role: row.role || 'user',
    profile: row.profile || {},
    reports: row.reports || [],
    appointments: row.appointments || [],
    notifications: row.notifications || [],
    history: row.history || [],
    resetToken: row.reset_token || row.resetToken,
    resetTokenExpires: row.reset_token_expires || row.resetTokenExpires,
    save: async function save() {
      return updateUser(this.id, this);
    }
  };
};

const mapToSupabaseRow = (data) => {
  return {
    id: data.id ? String(data.id) : (data._id ? String(data._id) : generateId()),
    name: data.name || '',
    email: normalizeEmail(data.email),
    password_hash: data.passwordHash || data.password_hash,
    role: data.role || 'user',
    profile: data.profile || {},
    reports: data.reports || [],
    appointments: data.appointments || [],
    notifications: data.notifications || [],
    history: data.history || [],
    reset_token: data.resetToken !== undefined ? data.resetToken : data.reset_token,
    reset_token_expires: data.resetTokenExpires !== undefined ? data.resetTokenExpires : data.reset_token_expires
  };
};

const toUserRecord = (data) => {
  const idStr = data.id ? String(data.id) : (data._id ? String(data._id) : generateId());
  return {
    _id: idStr,
    id: idStr,
    name: data.name || '',
    email: normalizeEmail(data.email),
    passwordHash: data.passwordHash || data.password_hash,
    role: data.role || 'user',
    profile: data.profile || {},
    reports: data.reports || [],
    appointments: data.appointments || [],
    notifications: data.notifications || [],
    history: data.history || [],
    resetToken: data.resetToken !== undefined ? data.resetToken : data.reset_token,
    resetTokenExpires: data.resetTokenExpires !== undefined ? data.resetTokenExpires : data.reset_token_expires,
    save: async function save() {
      return updateUser(this.id, this);
    }
  };
};

const createMemoryUser = async (data) => {
  const user = toUserRecord(data);
  memoryUsers.set(user.id, user);
  await persistUsers();
  return mapSupabaseUser(user);
};

const persistUsers = async () => {
  try {
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
  } catch (err) {
    console.warn('[STORAGE PERSIST WARN]', err.message);
  }
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

const getUserById = (id) => {
  const targetId = String(id);
  return memoryUsers.get(targetId) || Array.from(memoryUsers.values()).find((u) => u.id === targetId || u._id === targetId) || null;
};

export const isSupabaseConnected = () => !!supabase;
export const isMongoConnected = isSupabaseConnected;

const ensureSeedUsers = async () => {
  if (memoryUsers.size > 0) {
    return;
  }

  const storedUsers = await loadUsersFromDisk();
  if (storedUsers.length > 0) {
    storedUsers.forEach((userData) => {
      const rec = toUserRecord(userData);
      memoryUsers.set(rec.id, rec);
    });
    return;
  }

  await createMemoryUser(demoUserSeed);
};

export const findUserByEmail = async (email) => {
  const targetEmail = normalizeEmail(email);
  if (isSupabaseConnected()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', targetEmail)
        .maybeSingle();

      if (error) {
        console.warn('[SUPABASE STORE] findUserByEmail query note:', error.message);
      } else if (data) {
        return mapSupabaseUser(data);
      }
    } catch (err) {
      console.warn('[SUPABASE STORE] findUserByEmail error:', err.message);
    }
  }

  await ensureSeedUsers();
  const memUser = Array.from(memoryUsers.values()).find((user) => user.email === targetEmail);
  return memUser ? mapSupabaseUser(memUser) : null;
};

export const findUserById = async (id) => {
  if (!id) return null;
  const targetId = String(id);

  if (isSupabaseConnected()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

      if (error) {
        console.warn('[SUPABASE STORE] findUserById query note:', error.message);
      } else if (data) {
        return mapSupabaseUser(data);
      }
    } catch (err) {
      console.warn('[SUPABASE STORE] findUserById error:', err.message);
    }
  }

  await ensureSeedUsers();
  const memUser = getUserById(targetId);
  return memUser ? mapSupabaseUser(memUser) : null;
};

export const findUserByResetToken = async (token) => {
  if (!token) return null;

  if (isSupabaseConnected()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('reset_token', token)
        .maybeSingle();

      if (error) {
        console.warn('[SUPABASE STORE] findUserByResetToken query note:', error.message);
      } else if (data) {
        return mapSupabaseUser(data);
      }
    } catch (err) {
      console.warn('[SUPABASE STORE] findUserByResetToken error:', err.message);
    }
  }

  await ensureSeedUsers();
  const memUser = Array.from(memoryUsers.values()).find((user) => user.resetToken === token);
  return memUser ? mapSupabaseUser(memUser) : null;
};

export const createUser = async (data) => {
  const row = mapToSupabaseRow(data);

  if (isSupabaseConnected()) {
    try {
      const { data: created, error } = await supabase
        .from('users')
        .insert([row])
        .select()
        .single();

      if (error) {
        console.warn('[SUPABASE STORE] createUser insert note:', error.message);
      } else if (created) {
        const user = mapSupabaseUser(created);
        memoryUsers.set(user.id, user);
        return user;
      }
    } catch (err) {
      console.warn('[SUPABASE STORE] createUser error:', err.message);
    }
  }

  await ensureSeedUsers();
  return createMemoryUser(data);
};

export const updateUser = async (id, updates) => {
  if (!id) return null;
  const targetId = String(id);
  const patchData = mapToSupabaseRow({ ...updates, id: targetId });

  if (isSupabaseConnected()) {
    try {
      const { data: updated, error } = await supabase
        .from('users')
        .update(patchData)
        .eq('id', targetId)
        .select()
        .maybeSingle();

      if (error) {
        console.warn('[SUPABASE STORE] updateUser patch note:', error.message);
      } else if (updated) {
        const user = mapSupabaseUser(updated);
        memoryUsers.set(user.id, user);
        return user;
      }
    } catch (err) {
      console.warn('[SUPABASE STORE] updateUser error:', err.message);
    }
  }

  await ensureSeedUsers();
  const existingUser = getUserById(targetId);
  if (!existingUser) {
    return null;
  }

  const updatedUser = {
    ...existingUser,
    ...updates,
    id: existingUser.id,
    _id: existingUser._id,
    email: normalizeEmail(updates.email || existingUser.email)
  };
  memoryUsers.set(targetId, updatedUser);
  await persistUsers();
  return mapSupabaseUser(updatedUser);
};
