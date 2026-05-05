import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import { getGoogleCalendarConfig } from "@/lib/env";
import { createGoogleOAuthState, createGoogleOAuthUrl } from "@/lib/google-calendar/google";
import { GOOGLE_OAUTH_STATE_COOKIE } from "@/lib/google-calendar/oauth";

export async function GET(request: Request) {
  const appUrl = new URL(request.url);
  const authState = await getAuthState();

  if (!authState.supabaseConfigured) {
    return NextResponse.redirect(new URL("/login?missingEnv=1", appUrl));
  }

  if (!authState.user) {
    return NextResponse.redirect(new URL("/login", appUrl));
  }

  const config = getGoogleCalendarConfig();

  if (!config) {
    return NextResponse.redirect(new URL("/app?googleCalendar=missing-config", appUrl));
  }

  const state = createGoogleOAuthState();
  const response = NextResponse.redirect(createGoogleOAuthUrl(config, state));
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/app/integrations/google-calendar",
    sameSite: "lax",
    secure: config.redirectUri.startsWith("https://"),
  });

  return response;
}
