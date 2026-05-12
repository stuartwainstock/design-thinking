import {createClient, type SupabaseClient} from '@supabase/supabase-js'

function readEnv(name: string): string | undefined {
  const v = process.env[name]
  return v && v.length > 0 ? v : undefined
}

/**
 * Browser or public API: uses the anon key. Enforce access with RLS policies.
 */
export function createSupabaseAnonClient(): SupabaseClient {
  const url =
    readEnv('NEXT_PUBLIC_SUPABASE_URL') ?? readEnv('SUPABASE_URL')
  const anonKey =
    readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? readEnv('SUPABASE_ANON_KEY')
  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase URL or anon key. Set SUPABASE_URL + SUPABASE_ANON_KEY (or NEXT_PUBLIC_*). See .env.example.',
    )
  }
  return createClient(url, anonKey)
}

/**
 * Trusted server-side only: bypasses RLS. Never import this from client bundles.
 */
export function createSupabaseServiceClient(): SupabaseClient {
  const url = readEnv('SUPABASE_URL')
  const serviceKey = readEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See .env.example.',
    )
  }
  return createClient(url, serviceKey, {
    auth: {autoRefreshToken: false, persistSession: false},
  })
}
