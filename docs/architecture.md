# Architecture

This document describes implemented technical shape and architectural boundaries. Product direction lives in [Product](product.md).

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel

## Implemented App Shape

- `/` is a public landing page.
- `/login` provides Supabase email sign-in and sign-up.
- `/app` is the protected signed-in app area.
- `/app/onboarding` is the protected, skippable setup route for signed-in users who have no plants and have not completed onboarding. It can also be revisited from Settings.
- `/app/plants` is the protected redesigned Plants tab for browsing the full active collection by room.
- `/app/plants/[plantId]` is the protected redesigned plant detail/profile inspector for a single user-owned plant.
- `/app/plants/[plantId]/edit` is the protected plant edit route.
- `/app/settings` is a protected settings route for account and app-level controls, including setup review, room management, reminders, and Google Calendar connect/disconnect/status.
- The signed-in shell includes the Home / Plants / Settings bottom app bar, persistent Add Plant access, and sign-out where appropriate.
- Manual plant create, profile, edit, list, and archive flows are implemented.
- Add Plant is a sequential, skippable photo-first flow with progress through photo and plant name, room, watering basics, and review. Selected initial photos preview immediately, can be used for pre-save identification, and upload only after the owned plant record is created. Manual creation remains available by skipping the photo and identification controls.
- The Plants tab groups active plants by managed room name first, then legacy `location`, then `Unassigned`, and preserves user-owned collection scoping.
- Managed room records are implemented in `plant_rooms`; `plants.room_id` is nullable and legacy `plants.location` is preserved for compatibility.
- Settings room management can list, add, rename, and archive active rooms.
- Add/Edit Plant can assign an owned active managed room, leave the plant Unassigned, add a room inline, and keep a legacy location note for transition compatibility.
- Plant-profile watering state and mark-watered behavior are implemented.
- Plant-profile next watering status uses enabled app-owned reminder dates first, then falls back to watering interval calculations.
- The signed-in dashboard groups active plants by watering status: overdue, due today, upcoming, and recently watered.
- The signed-in Home route presents the redesigned Today surface with Needs water, By room, Recent care, and an optional state-derived Getting Started checklist when setup is incomplete.
- Dashboard urgency uses enabled app-owned reminder dates first, then falls back to watering interval calculations.
- Plant profiles show watering history from watering events.
- Plant profiles present a photo/identity hero, primary Water now action, secondary Snooze/Reminder actions, care basics rows, watering history, photo/identification, app reminder, lightweight Google Calendar status when relevant, edit, and archive surfaces.
- Plant profiles support one optional primary photo per owned plant.
- Dashboard cards show a small plant thumbnail or calm fallback.
- Plant profiles include an optional Pl@ntNet-backed identification helper when a primary photo exists.
- Plant profiles include an app-owned watering reminder panel.
- Settings includes Google Calendar connection status, last sync/status metadata where available, connect, and disconnect controls.
- Google Calendar sync is implemented as a one-way reflection of app-owned reminders; setup and disconnect are app-level Settings controls.
- First-run onboarding is implemented with per-user completion state. Signed-in users with no plants and no completed onboarding state are routed from Today to onboarding; users with plants are not redirected, and Settings can revisit setup without creating a loop. Onboarding can optionally create initial user-owned rooms, then route to Today, manual Add Plant, or photo-first Add Plant.

## Auth And Session Pattern

- Client components use the browser Supabase helper for sign-in, sign-up, and sign-out.
- Middleware refreshes Supabase auth cookies for auth-sensitive routes before route decisions.
- Server components use the server Supabase helper plus `supabase.auth.getUser()` before rendering user-specific UI.
- Protected routes should keep middleware redirects plus server-side user checks.
- Missing client environment values should degrade to a guided setup state instead of a blank page or crash.

## Ownership And RLS Rules

- User-owned data must derive `user_id` from the authenticated Supabase user on the server.
- Client input must not be trusted for ownership.
- Plant profile fetches and plant mutations filter by the authenticated user's ID on the server.
- Watering event reads and inserts filter by the authenticated user's ID on the server and are backed by RLS policies.
- Plant photo upload, replace, remove, and display first verify the signed-in user's plant ownership on the server.
- Plant photo storage paths include the authenticated user ID and plant ID, and Storage RLS policies check that path against an owned plant.
- AI identification first verifies the signed-in user's ownership of the plant and primary photo before reading Storage or calling the provider.
- Watering reminder reads and mutations filter by the authenticated user's ID on the server and are backed by RLS policies tied to owned plants.
- Google Calendar connection and event-link reads/mutations filter by the authenticated user's ID on the server and are backed by RLS policies.
- User app preference reads and mutations filter by the authenticated user's ID on the server and are backed by RLS policies.
- Plant room reads and mutations filter by the authenticated user's ID on the server and are backed by RLS policies.
- Plant room assignment is enforced in the database: a plant can only reference an active room with the same `user_id`.
- Care profile reference data is app-owned, not user-owned. Authenticated users can read `care_profiles` and `care_profile_aliases`; browser clients do not have insert, update, or delete policies for these tables.
- RLS must stay enabled on user-owned tables.
- App queries and database policies should agree on ownership boundaries.
- Cross-user access checks are required whenever routes, queries, mutations, or schema touch user-owned data.

## Data Model Direction

### Users

- Account identity comes from Supabase Auth.
- Product data is scoped to the signed-in user.

### User App Preferences

Per-user setup state is implemented in `user_app_preferences`:

- `id`
- `user_id`
- optional `onboarding_completed_at`
- optional `setup_checklist_dismissed_at`
- `created_at`
- `updated_at`

Onboarding completion is optional and user-scoped. Existing users with plants are not redirected into onboarding when no preference row exists. Completing or skipping onboarding writes `onboarding_completed_at`; it does not require room setup, plant creation, photo upload, AI identification, reminders, or calendar sync. If optional room names are submitted during onboarding, the server creates them for the signed-in user before marking onboarding complete; duplicate active room names are skipped.

### Plants

The implemented `plants` model stores:

- `id`
- `user_id`
- `nickname`
- `common_name`
- optional `scientific_name`
- optional `location`
- optional `room_id`
- optional `notes`
- optional `watering_interval_days`
- optional `watering_guidance`
- optional `primary_photo_path`
- optional `primary_photo_uploaded_at`
- optional `archived_at`
- `created_at`
- `updated_at`

Application validation requires `nickname` for Add/Edit Plant. `common_name` and `scientific_name` remain optional editable fields. The existing database check still accepts `nickname` or `common_name` for backward compatibility with older data.

Watering interval and watering guidance are user-entered guidance only. The interval drives app date calculations, but it must not be treated as botanical truth.

Archived plants are soft-hidden from the default collection by filtering `archived_at is null`. Restore UX is not implemented.

`plants.location` remains in place for compatibility. Room migration backfills managed rooms from distinct non-empty legacy location values per user, then assigns matching `plants.room_id` values without clearing or rewriting `plants.location`.

Add/Edit Plant writes nullable `plants.room_id` from a room choice step after server-side ownership verification. The room step lets the user leave a plant Unassigned, choose an existing room, or add a new room without showing all room controls at once. Inline room creation derives `user_id` from the signed-in session and uses the newly created room id for the plant save. `plants.location` is not user-facing in Add/Edit Plant, but existing legacy values are submitted as hidden state so editing does not clear them accidentally. Display and grouping use this precedence during the transition: active managed room name, then non-empty legacy `plants.location`, then `Unassigned`.

### Care Profiles

Internal care profile reference data is implemented in `care_profiles` and `care_profile_aliases`.

`care_profiles` stores app-owned watering starting-point metadata:

- `id`
- `profile_key`
- `profile_level`, constrained to `species`, `genus`, `care_group`, or `fallback`
- `display_name`
- optional `accepted_scientific_name`
- `accepted_common_name`
- optional `taxon_rank`
- default and optional min/max watering check cadence fields
- controlled `dryness_preference`
- concise `watering_guidance`
- optional light, soil/pot/drainage, humidity, seasonal, beginner, and toxicity notes
- `match_confidence`, constrained to `high`, `medium`, or `low`
- `review_status`, constrained to `draft`, `reviewed`, or `needs_review`
- optional source/review metadata
- `created_at`
- `updated_at`

`care_profile_aliases` stores auditable names used for matching:

- `id`
- `care_profile_id`
- `alias`
- `normalized_alias`
- `alias_type`, constrained to `scientific`, `synonym`, `common`, `normalized_common`, `genus`, or `group`
- `priority`
- `created_at`

Aliases are unique per profile, normalized alias, and alias type. The same normalized alias may intentionally appear on multiple profiles so the app can return an ambiguous match instead of choosing an unsafe care profile.

Care profile helpers live in `src/lib/care-profiles`. They normalize names, derive genus fallback keys, load profile records with aliases, and match accepted identity in a conservative order: exact scientific name, scientific alias, synonym, common-name alias, genus profile, and explicit care-group alias. Ambiguous aliases return an `ambiguous` result and no plant fields are changed.

Slice 1 adds only foundation data and helpers. It does not change `plants`, expose care suggestions in the UI, apply watering fields, create reminders, or call a live care provider in the setup path.

### Rooms

Managed rooms are implemented in `plant_rooms`:

- `id`
- `user_id`
- `name`
- optional `sort_order`
- optional `archived_at`
- `created_at`
- `updated_at`

Active room names are unique per user using case-insensitive trimmed comparison. Rooms are user-owned and protected by RLS. A database trigger on `plants` prevents cross-user room assignment and prevents assignment to archived rooms.

Renaming a room preserves plant assignments because plants reference the room id. Archiving a room soft-archives the room record with `archived_at` and moves assigned plants to Unassigned by setting `plants.room_id` to null. Plant records and legacy `plants.location` values are preserved.

Rooms can be created from Settings, inline Add Plant, or optional onboarding room setup. All room creation derives `user_id` from the signed-in server session.

### Care Events

Watering events are implemented in `watering_events`:

- `id`
- `plant_id`
- `user_id`
- `watered_at`
- `created_at`

The mark-watered action inserts a watering event for an active plant owned by the signed-in user. Latest watering state is derived from the newest event for the plant. Next watering display is derived from the latest watering event plus the plant's user-entered watering interval. Missing intervals still allow watering to be recorded, but no next date is claimed.

Watering date display uses simple local-day semantics in app helpers: due today is the current local calendar day, overdue is before today, and upcoming is after today.

The dashboard and plant-profile top watering card reuse the same reminder-aware date helpers. If a plant has an enabled watering reminder with `next_reminder_date`, that date drives profile next-watering status plus dashboard overdue, due today, and upcoming grouping. If no enabled reminder date exists, both surfaces fall back to the latest watering event plus the plant's editable watering interval. Recently watered always comes from watering events. Upcoming and recently watered sections use a conservative 7-day window. Plant-level watering history reads the same event model newest first, so last-watered, dashboard state, and history all derive from one source.

### Reminders

Watering reminders are implemented in `watering_reminders`:

- `id`
- `user_id`
- `plant_id`
- `reminder_type`, constrained to `watering`
- `reminder_mode`, constrained to `after_watering` or `fixed_schedule`
- `enabled`
- optional `next_reminder_date`
- optional `reminder_time`
- `created_at`
- `updated_at`

Reminders are app-owned and work without Google Calendar. The profile panel shows the next reminder date in plain language and avoids notification delivery claims. Users can turn a watering reminder on with a chosen date and turn it off without changing plant details or watering history. Fixed schedule reminders require only a next reminder date; after-watering reminders require a watering interval because they recalculate from watering history.

Reminder modes are watering-specific:

- `after_watering`: next reminder is based on the latest watering date plus the plant's user-entered watering interval.
- `fixed_schedule`: next reminder follows the saved date; watering early records care but does not reset the reminder date.

When a signed-in user marks a plant watered, the action still creates a watering event first. If an enabled `after_watering` reminder exists and the plant has a watering interval, the app updates `next_reminder_date` from the new watering event plus the interval. Fixed schedule reminders are not reset by early watering.

Snooze actions move the current `next_reminder_date` later by a small number of days without changing plant care basics or watering interval. Reminder mode changes, snoozes, and mark-watered reminder updates ask Google Calendar sync to mirror the app reminder when a Google connection exists.

The dashboard and plant profile read watering reminders scoped to the signed-in user. Enabled reminders with a next date are treated as the active schedule for their plant, so fixed schedule reminders remain visible after watering and after-watering reminders update visible urgency after mark-watered recalculates the reminder date.

### Calendar Linkage

Google Calendar sync is implemented for active watering reminders as a one-way reflection from Plant Care to Google Calendar. App reminders remain the source of truth. Google Calendar events do not define reminder state, watering state, or care guidance.

Google OAuth routes:

- `/app/integrations/google-calendar/connect`
- `/app/integrations/google-calendar/callback`

OAuth success, cancellation, missing-config, and error statuses redirect back to `/app/settings` because calendar setup is account/app-level behavior.

Server-only Google configuration:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALENDAR_REDIRECT_URI`
- `GOOGLE_TOKEN_ENCRYPTION_KEY`

The OAuth scope is `https://www.googleapis.com/auth/calendar.events`. V1 uses the user's primary calendar and stores `calendar_id` as `primary`.

Google refresh tokens are encrypted with AES-256-GCM before storage in `google_calendar_connections`. Tokens, client secret, and refresh token values are never exposed to browser code or stored in browser storage. Provider connection records are scoped to `user_id`.

Reminder-to-event linkage lives in `google_calendar_event_links`:

- `user_id`
- `reminder_id`
- `google_event_id`
- `calendar_id`
- sync status/error/timestamp metadata

The app creates or updates one upcoming all-day Google Calendar event per active watering reminder. The event title uses `Water [plant label]`, and the description says it was created from Plant Care and that Plant Care remains the source of truth. Recurring Google events, bidirectional sync, Outlook sync, and non-watering calendar events are not implemented.

If Google sync fails, the Plant Care reminder remains saved and authoritative. Disconnecting Google preserves app reminders, stops future sync, and attempts to delete known app-managed Google Calendar events. If provider cleanup fails, the app still disconnects and reports a recoverable cleanup warning.

Plant detail keeps plant-level reminder editing and only shows lightweight calendar status when relevant: reminder on/off, whether an event has been mirrored, last sync/status metadata where available, and a link to manage the integration in Settings. Plant detail does not own Google Calendar connect/disconnect setup.

### Photos And AI

Plant photos use a private Supabase Storage bucket named `plant-photos`. V1 supports one primary photo per plant by storing a durable object path on `plants.primary_photo_path`; `primary_photo_uploaded_at` records when the current reference was saved.

Photo object paths use `{user_id}/{plant_id}/primary-{uuid}.{extension}`. Storage policies allow select, insert, update, and delete only when the first path segment matches `auth.uid()` and the second path segment maps to a plant owned by that user. Inserts and updates require the plant to be active. Server actions still verify plant ownership before upload, replace, or remove.

The bucket is private. Server-rendered app surfaces create short-lived signed URLs for display on plant profiles and dashboard cards. Missing or unavailable photos fall back to calm local UI; photos are optional and user-owned.

Photo-first Add Plant does not use public storage or staged photo records. The user may choose a photo before save and sees an immediate browser-local preview. The same selected file can be sent to Pl@ntNet for optional pre-save identification and is reattached to the final plant save, avoiding a second upload. The server first creates an owned plant record, then uploads the optional photo to the existing owner-scoped `{user_id}/{plant_id}/...` private Storage path and stores it as the primary photo. If the optional photo upload fails, the plant remains saved and the user can add the photo from the plant profile. Abandoning Add Plant before save leaves no staged object to clean up.

AI-assisted identification uses Pl@ntNet for optional plant name suggestions. Required server-only environment:

- `PLANTNET_API_KEY`
- optional `PLANTNET_PROJECT`, defaulting to `all`

The provider boundary lives in `src/lib/plant-identification/plantnet.ts`. Server actions verify plant ownership, download the owned private photo bytes from Supabase Storage, and send those bytes to `POST /v2/identify/{project}` as multipart form data with `images` and `organs=auto`. The app does not expose the API key to browser code and does not send Pl@ntNet public or signed Supabase URLs.

Add Plant also supports optional pre-save Pl@ntNet identification from the selected initial photo. That flow verifies a signed-in user, validates the submitted image, sends the transient file bytes to Pl@ntNet server-side, and returns only normalized candidate names to the client. It does not upload a staged object, create a draft plant, persist raw provider responses, or expose provider credentials. A user must choose a suggestion before common/scientific name fields are filled, and those fields remain editable before final plant save.

Pl@ntNet responses are normalized into transient candidates with:

- provider
- scientific name
- optional common name
- confidence score
- uncertainty label: `likely`, `possible`, or `not_sure`

The UI displays up to three names-only suggestions with the note `Plant suggestions powered by Pl@ntNet.` Raw provider responses are not persisted by default. Unreviewed suggestions are not plant truth. A user must review and save a candidate before accepted common/scientific names update the existing editable `plants` fields. Care basics, watering intervals, diagnosis, disease, pest, toxicity, and treatment suggestions are excluded from Slice 4.2.

## Integration Boundaries

- Calendar sync follows the in-app reminder model; it does not define the core data model.
- AI suggestions are assistive and editable.
- Health diagnosis is a later phase and should not influence v1 data shape unless explicitly scoped.
- Avoid premature generalization into an encyclopedia, generic task engine, or automation platform.

## Implementation Guidance

- Prefer additive, migration-safe schema changes.
- Keep slices small and reviewable.
- Keep auth/session concerns separate from plant-domain changes where practical.
- Preserve route protection and RLS together.
- Keep mobile-first watering workflows fast and clear as product complexity grows.
- UI redesign foundation uses CSS custom properties for warm natural palette roles, `Nunito Sans` through `next/font/google`, and local inline SVG icon primitives rather than adding an icon dependency.
