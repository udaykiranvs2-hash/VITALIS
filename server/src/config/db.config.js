import supabase from './supabase.js';

const connectDB = async () => {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase credentials not set. Operating with fallback storage.');
      return false;
    }

    // Ping Supabase DB
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log(`⚡ Connected to Supabase Project: ${process.env.SUPABASE_URL}`);
      console.log(`ℹ️  Supabase Table Note: ${error.message}`);
    } else {
      console.log(`⚡ Supabase Database Connected successfully: ${process.env.SUPABASE_URL}`);
    }

    return true;
  } catch (error) {
    console.warn(`Supabase Connection Warning: ${error.message}`);
    return false;
  }
};

export default connectDB;
