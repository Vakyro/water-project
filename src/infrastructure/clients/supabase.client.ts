import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '@/src/core/config'

class SupabaseClientSingleton {
  private static instance: SupabaseClient

  static getInstance(): SupabaseClient {
    if (!SupabaseClientSingleton.instance) {
      const { url, key } = config.get('supabase')
      SupabaseClientSingleton.instance = createClient(url, key)
    }
    return SupabaseClientSingleton.instance
  }
}

export const supabaseClient = SupabaseClientSingleton.getInstance()
