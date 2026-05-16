import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import { getGoogleCalendarConfig } from "@/lib/env";
import { upsertGoogleCalendarConnection } from "@/lib/google-calendar/data";
import { encryptText } from "@/lib/google-calendar/crypto";
import { exchangeGoogleCodeForTokens } from "@/lib/google-calendar/google";
import { GOOGLE_OAUTH_STATE_COOKIE } from "@/lib/google-calendar/oauth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectToApp(request: Request, status: string) {
  return NextResponse.redirect(new URL(`/app/settings?googleCalendar=${status}`, request.url));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");
  const authState = await getAuthState();

  if (!authState.supabaseConfigured) {
    return NextResponse.redirect(new URL("/login?missingEnv=1", request.url));
  }

  if (!authState.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const config = getGoogleCalendarConfig();

  if (!config) {
    return redirectToApp(request, "missing-config");
  }

  if (error) {
    return redirectToApp(request, "connect-canceled");
  }

  const storedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${GOOGLE_OAUTH_STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !storedState || state !== decodeURIComponent(storedState)) {
    return redirectToApp(request, "state-error");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(new URL("/login?missingEnv=1", request.url));
  }

  const tokenResult = await exchangeGoogleCodeForTokens(config, code);
  const refreshToken = tokenResult.data?.refresh_token;

  if (tokenResult.error || !refreshToken) {
    return redirectToApp(request, "token-error");
  }

  const encryptedToken = encryptText(refreshToken, config.tokenEncryptionKey);
  const saveResult = await upsertGoogleCalendarConnection(supabase, authState.user.id, {
    encryptedRefreshToken: encryptedToken.encryptedValue,
    tokenIv: encryptedToken.iv,
    tokenAuthTag: encryptedToken.authTag,
    calendarId: config.calendarId,
  });

  const response = saveResult.error
    ? redirectToApp(request, "save-error")
    : redirectToApp(request, "connected");

  response.cookies.delete({
    name: GOOGLE_OAUTH_STATE_COOKIE,
    path: "/app/integrations/google-calendar",
  });

  return response;
}
