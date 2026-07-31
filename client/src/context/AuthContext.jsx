import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken, syncProfile, fetchProfile, updateProfile as updateProfileRequest, changePassword as changePasswordRequest } from '../api/api.js';
import { supabase } from '../config/supabase.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const splashTimerRef = { current: null };

  const triggerSplash = () => {
    if (splashTimerRef.current) {
      clearTimeout(splashTimerRef.current);
    }
    setShowSplash(true);
    splashTimerRef.current = setTimeout(() => {
      setShowSplash(false);
      splashTimerRef.current = null;
    }, 3800);
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session) => {
    if (session?.access_token) {
      setToken(session.access_token);
      setAuthToken(session.access_token);
      
      try {
        // Sync profile with backend
        await syncProfile();
        // Fetch full user profile
        const response = await fetchProfile();
        if (response?.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    } else {
      setUser(null);
      setToken('');
      setAuthToken(null);
    }
    setInitialized(true);
  };

  const register = async (payload) => {
    setLoading(true);
    setError('');
    const normalizedEmail = payload.email?.toLowerCase().trim();
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: payload.password,
        options: {
          data: {
            full_name: payload.name,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      triggerSplash();
      return data;
    } catch (err) {
      setError(err.message || 'Unable to register.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setError('');
    const normalizedEmail = payload.email?.toLowerCase().trim();
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: payload.password,
      });

      if (signInError) throw signInError;
      
      triggerSplash();
      return data;
    } catch (err) {
      setError(err.message || 'Unable to log in.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/app'
        }
      });
      if (signInError) throw signInError;
    } catch (err) {
      setError(err.message || 'Unable to sign in with Google.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error logging out:', err);
    }
    setToken('');
    setUser(null);
    setAuthToken(null);
    setError('');
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const response = await updateProfileRequest(payload);
      if (response?.data?.user) {
        setUser(response.data.user);
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
      // Supabase has its own updateUser method for passwords
      const { error: updateError } = await supabase.auth.updateUser({
        password: payload.newPassword
      });
      if (updateError) throw updateError;
      
      // We can also call the backend if there is specific sync logic
      if (typeof changePasswordRequest === 'function') {
        try {
          await changePasswordRequest(payload);
        } catch (e) {
          console.warn('Backend password sync error', e);
        }
      }

      setError('');
      return true;
    } catch (err) {
      setError(err.message || 'Unable to change password.');
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
      loginWithGoogle,
      logout,
      updateProfile,
      changePassword,
      setError,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false),
      isRegisterModalOpen,
      openRegisterModal: () => setIsRegisterModalOpen(true),
      closeRegisterModal: () => setIsRegisterModalOpen(false),
      showSplash,
      triggerSplash
    }),
    [user, token, loading, initialized, error, isLoginModalOpen, isRegisterModalOpen, showSplash]
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
