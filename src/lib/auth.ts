import type { User } from "@supabase/supabase-js";

import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = {
  supabaseConfigured: boolean;
  user: User | null;
};

export async function getAuthState(): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return {
      supabaseConfigured: false,
      user: null,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      supabaseConfigured: true,
      user: null,
    };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return {
      supabaseConfigured: true,
      user,
    };
  } catch {
    return {
      supabaseConfigured: true,
      user: null,
    };
  }
}
