import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://knxwytgfcmlbodejhikl.supabase.co";

const supabaseAnonKey =
  "sb_publishable_xWk9MJ2wcqJ8S4lWT7ujAg_R1VzsvL6";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);