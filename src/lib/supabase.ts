import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lyreegaeymsldxlbpfpi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eN3GWDS4BoGIiqThU3BHfg_ZQlBRdio';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cmVlZ2FleW1zbGR4bGJwZnBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMxMjY2NiwiZXhwIjoyMDg4ODg4NjY2fQ.58dnuKWKLilQ5297IWM_xUHvzkDlODhe-PgaK0uY1C4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database connection (for server-side operations if needed)
export const databaseUrl = 'postgresql://postgres:1CgWo4EtFuVtYYcQ@db.lyreegaeymsldxlbpfpi.supabase.co:5432/postgres';
