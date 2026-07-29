import crypto from 'crypto';
import supabase from '../config/supabase.js';

const memoryUsers = globalThis.__vitalisMemoryUsers ?? (globalThis.__vitalisMemoryUsers = new Map());

const normalizeEmail = (email) => (email || '').toLowerCase().trim();

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');

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
  const row = {
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
  return row;
};

const createMemoryUser = (data) => {
  const idStr = data.id ? String(data.id) : (data._id ? String(data._id) : generateId());
  const user = {
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
    resetToken: data.resetToken,
    resetTokenExpires: data.resetTokenExpires,
    save: async function save() {
      memoryUsers.set(this.id, this);
      return this;
    }
  };

  memoryUsers.set(user.id, user);
  return user;
};

export const isSupabaseConnected = () => !!supabase;
export const isMongoConnected = isSupabaseConnected;

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

  const memUser = memoryUsers.get(targetId);
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

  const existingUser = memoryUsers.get(targetId);
  if (!existingUser) {
    return null;
  }

  const updatedUser = { ...existingUser, ...updates, email: normalizeEmail(updates.email || existingUser.email) };
  memoryUsers.set(targetId, updatedUser);
  return mapSupabaseUser(updatedUser);
};
