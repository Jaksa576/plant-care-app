import { randomBytes } from "crypto";

import type { getGoogleCalendarConfig } from "@/lib/env";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API_URL = "https://www.googleapis.com/calendar/v3";

export type GoogleCalendarConfig = NonNullable<ReturnType<typeof getGoogleCalendarConfig>>;

export type GoogleTokenResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

export type GoogleCalendarEventInput = {
  eventId?: string;
  title: string;
  description: string;
  date: string;
};

export type GoogleCalendarResult<T> = {
  data: T | null;
  error: string | null;
};

export function createGoogleOAuthState() {
  return randomBytes(24).toString("base64url");
}

export function createGoogleOAuthUrl(config: GoogleCalendarConfig, state: string) {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scope,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function parseGoogleResponse<T>(response: Response): Promise<GoogleCalendarResult<T>> {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error_description" in payload
        ? String(payload.error_description)
        : typeof payload === "object" && payload && "error" in payload
          ? String(payload.error)
          : "Google Calendar is unavailable right now.";

    return {
      data: null,
      error: message,
    };
  }

  return {
    data: payload as T,
    error: null,
  };
}

export async function exchangeGoogleCodeForTokens(
  config: GoogleCalendarConfig,
  code: string,
): Promise<GoogleCalendarResult<GoogleTokenResponse>> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  return parseGoogleResponse<GoogleTokenResponse>(response);
}

export async function refreshGoogleAccessToken(
  config: GoogleCalendarConfig,
  refreshToken: string,
): Promise<GoogleCalendarResult<GoogleTokenResponse>> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  return parseGoogleResponse<GoogleTokenResponse>(response);
}

function addOneDay(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function getCalendarEventPayload(input: GoogleCalendarEventInput) {
  return {
    summary: input.title,
    description: input.description,
    start: {
      date: input.date,
    },
    end: {
      date: addOneDay(input.date),
    },
  };
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  input: GoogleCalendarEventInput,
): Promise<GoogleCalendarResult<{ id: string }>> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API_URL}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getCalendarEventPayload(input)),
    },
  );

  return parseGoogleResponse<{ id: string }>(response);
}

export async function updateGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  input: GoogleCalendarEventInput,
): Promise<GoogleCalendarResult<{ id: string }>> {
  if (!input.eventId) {
    return {
      data: null,
      error: "Missing Google Calendar event link.",
    };
  }

  const response = await fetch(
    `${GOOGLE_CALENDAR_API_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
      input.eventId,
    )}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getCalendarEventPayload(input)),
    },
  );

  return parseGoogleResponse<{ id: string }>(response);
}

export async function deleteGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
): Promise<GoogleCalendarResult<null>> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(
      eventId,
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 204 || response.status === 410 || response.status === 404) {
    return {
      data: null,
      error: null,
    };
  }

  return parseGoogleResponse<null>(response);
}
