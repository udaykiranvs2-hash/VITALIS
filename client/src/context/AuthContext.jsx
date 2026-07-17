import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken, registerUser, loginUser, fetchProfile, updateProfile as updateProfileRequest, changePassword as changePasswordRequest } from '../api/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vitalis_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vitalis_token') || '');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        setInitialized(true);
        return;
      }
      try {
        const response = await fetchProfile();
        if (response?.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('vitalis_user', JSON.stringify(response.data.user));
        }
      } catch {
        logout();
      } finally {
        setInitialized(true);
      }
    };
    initialize();
  }, []);

  const saveSession = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    setInitialized(true);
    localStorage.setItem('vitalis_token', tokenValue);
    localStorage.setItem('vitalis_user', JSON.stringify(userValue));
    setAuthToken(tokenValue);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('vitalis_token');
    localStorage.removeItem('vitalis_user');
    setAuthToken(null);
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await registerUser(payload);
      saveSession(response.data.token, response.data.user);
      setError('');
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to register.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginUser(payload);
      saveSession(response.data.token, response.data.user);
      setError('');
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to log in.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const response = await updateProfileRequest(payload);
      if (response?.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('vitalis_user', JSON.stringify(response.data.user));
      }
      setError('');
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update profile.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (payload) => {
    setLoading(true);
    try {
      const response = await changePasswordRequest(payload);
      setError('');
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to change password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initialized,
      error,
      register,
      login,
      logout,
      updateProfile,
      changePassword,
      setError
    }),
    [user, token, loading, initialized, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
