import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export type AppAccessState = {
  supabaseConfigured: boolean;
  isAuthenticated: boolean;
  userEmail?: string;
};

export async function getAppAccessState(): Promise<AppAccessState> {
  if (!hasSupabaseEnv()) {
    return {
      supabaseConfigured: false,
      isAuthenticated: false,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      supabaseConfigured: true,
      isAuthenticated: false,
    };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return {
      supabaseConfigured: true,
      isAuthenticated: Boolean(user),
      userEmail: user?.email,
    };
  } catch {
    return {
      supabaseConfigured: true,
      isAuthenticated: false,
    };
  }
}
