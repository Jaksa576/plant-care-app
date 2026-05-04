const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  plantNetApiKey: process.env.PLANTNET_API_KEY,
  plantNetProject: process.env.PLANTNET_PROJECT,
};

export function hasSupabaseEnv() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function getSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error(
      "Missing Supabase environment variables. Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    url: env.supabaseUrl as string,
    anonKey: env.supabaseAnonKey as string,
  };
}

export function getOptionalServiceRoleKey() {
  return env.supabaseServiceRoleKey;
}

export function getPlantNetConfig() {
  const apiKey = env.plantNetApiKey?.trim();

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    project: env.plantNetProject?.trim() || "all",
  };
}
