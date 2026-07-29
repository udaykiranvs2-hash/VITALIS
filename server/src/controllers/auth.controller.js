import { findUserById, createUser, updateUser } from '../utils/fallbackStore.js';

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profile: user.profile,
  role: user.role,
  reports: user.reports,
  appointments: user.appointments,
  notifications: user.notifications,
  history: user.history,
  authProvider: user.authProvider,
});

export const syncProfile = async (req, res) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let profile = await findUserById(authUser.id);

    if (!profile) {
      // Create new profile mapped to Supabase auth.users
      profile = await createUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        authProvider: authUser.app_metadata?.provider || 'email',
        profile: {
          fullName: authUser.user_metadata?.full_name || authUser.email.split('@')[0]
        }
      });
    } else {
      // Update any out-of-sync fields like email or name if they changed via OAuth
      const updates = {};
      let needsUpdate = false;
      
      if (profile.email !== authUser.email) {
        updates.email = authUser.email;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        profile = await updateUser(authUser.id, updates);
      }
    }

    return res.status(200).json({ user: sanitizeUser(profile) });
  } catch (error) {
    console.error('[AUTH ERROR] Sync profile failed:', error.message);
    return res.status(500).json({ message: 'Internal server error during profile synchronization.' });
  }
};
