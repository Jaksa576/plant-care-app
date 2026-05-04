# Photo Identification + Reminder Sync Campaign

## Campaign recommendation

Use this campaign as the follow-on campaign after `docs/campaigns/plant-profile-watering-foundation.md` is complete through Slice 3.3.

This campaign should not begin as implementation work until the manual plant and watering loop is stable. Photos, AI assistance, reminders, and calendar sync all depend on durable plant ownership, plant profile surfaces, watering state, and watering history.

Recommended structure:

1. **Slice 4.1 — Plant photo upload**: make plant records visual and recognizable.
2. **Slice 4.2 — AI-assisted plant identification**: optionally suggest likely plant names from an owned photo.
3. **Slice 5.1 — Internal reminder model**: create app-owned watering reminders before any external sync.
4. **Slice 5.2 — Google Calendar sync**: reflect app-owned reminders to Google Calendar.
5. **Slice 5.3 — Reminder flexibility**: add focused watering reminder controls such as fixed schedule, last-watered based reminders, snooze, and watered-early behavior.

Keep each slice PR-sized. Codex should not combine slices unless the user explicitly approves the scope change after reviewing the proposal.

## Source-of-truth docs

Codex must inspect these before starting each slice:

- `AGENTS.md`
- `docs/product.md`
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/current-task.md`
- `docs/campaigns/plant-profile-watering-foundation.md`
- `docs/campaigns/photo-identification-reminder-sync.md`

If these docs disagree on active slice, implemented state, data model, storage model, provider configuration, reminder semantics, calendar sync direction, or product guardrails, Codex must stop and report the conflict before changing code.

## Current campaign context

This campaign covers the remaining planned v1 roadmap after the watering foundation campaign:

- Phase 4: photo upload and optional AI-assisted identification.
- Phase 5: app-owned watering reminders, Google Calendar sync, and reminder flexibility.

This is not a broad visual redesign, AI product expansion, diagnosis feature, generic task platform, notification platform, or bidirectional calendar integration.

### Campaign thesis

The app should become more visual and easier to maintain without losing its core identity as a calm, watering-first personal plant care app.

Photos should help users recognize their own plants. AI should reduce setup friction only when a user asks for help and should never become the source of care truth. Reminders should be owned by the app before they are reflected externally. Google Calendar should help users remember watering, not define what watering means.

## Campaign outcome

By the end of this campaign:

- Plants can have one primary user-owned photo.
- The plant profile and collection/dashboard surfaces feel more visual and personal.
- A user can optionally ask for AI identification from an owned plant photo.
- AI suggestions are uncertain, reviewable, editable, rejectable, and manually overrideable.
- Users have app-owned watering reminder state that works without Google Calendar.
- Google Calendar sync, when configured, reflects app-owned watering reminders.
- Reminder flexibility supports practical watering behavior without becoming a generic task manager.

## Product guardrails

Preserve:

- Watering-first UX.
- Personal plant collection.
- Editable care guidance.
- Manual plant setup and care tracking without AI.
- User-owned data and route protection.
- Conservative AI assistance.
- Mobile-first layouts.
- Clear empty, loading, and error states.
- Calm, trustworthy copy.
- App-owned reminder state.
- Google Calendar before Outlook.

Push back if a proposed implementation would:

- Make the app encyclopedia-first.
- Turn watering into a generic task system.
- Overclaim plant identification, diagnosis, or watering precision.
- Add AI before the manual plant/watering loop is useful.
- Add calendar sync before the in-app reminder model is stable.
- Introduce broad rewrites or unnecessary schema churn.
- Combine unrelated slices.
- Store unreviewed AI output as user care truth.
- Make Google Calendar the source of truth.

## UX quality bar

### Design tone

The campaign should feel:

- Calm, personal, and visual.
- Helpful without being pushy.
- Beginner-friendly and practical.
- Honest about uncertainty.
- Mobile-first.
- Low-friction.

Avoid:

- Clinical diagnosis language.
- High-confidence AI claims.
- Dense scheduler terminology.
- Calendar integration jargon in core plant screens.
- Dark-pattern prompts to use AI or connect Google.
- Configuration-heavy task-management UI.

### Visual direction

Use photos to add warmth, not clutter.

Recommended visual pattern:

- One primary plant image per plant for v1.
- Soft rounded image treatment.
- Calm fallback illustration or neutral card when no photo exists.
- Small status chips for watering/reminder state.
- Compact action groups on mobile.
- Progressive disclosure for advanced reminder or sync details.

Avoid:

- Gallery UI.
- Public sharing affordances.
- Social-media-style image treatment.
- Large AI banners.
- Calendar provider branding dominating plant care screens.

### Interaction principles

- Photos should be optional.
- AI identification should require deliberate user action.
- Accepted AI suggestions should be editable before or after save.
- Reminder setup should explain the next reminder in plain language.
- Calendar sync should be presented as an enhancement, not a requirement.
- Error states should keep the manual watering loop usable.
- Cross-user access must never be possible through plant records, storage paths, AI requests, reminders, provider linkage, or calendar sync.

## Design alignment checkpoints

This campaign has more product and architecture risk than the watering foundation campaign. These are the design choices worth aligning on before implementation.

### Recommended defaults

Use these unless the product owner changes them:

1. **Photo model:** one primary photo per plant for v1.
2. **Photo location:** show photo on plant profile hero and plant cards where useful.
3. **AI entry point:** user taps a clear action such as `Help identify this plant` from a plant with a photo.
4. **AI result shape:** show up to three likely names with uncertainty-aware copy.
5. **AI acceptance:** user can accept a suggestion into editable plant fields, then save.
6. **Unreviewed AI data:** do not store as care truth.
7. **Reminder model:** app-owned watering reminders exist before calendar sync.
8. **Reminder style:** date-first; time is optional or defaulted only when needed for calendar events.
9. **Calendar sync direction:** one-way from app reminders to Google Calendar for v1.
10. **Calendar event model:** prefer one upcoming event per active watering reminder unless the implemented reminder model clearly supports safe recurrence.
11. **Calendar source of truth:** app remains authoritative; Google events reflect app state.
12. **Outlook:** deferred.

### Decisions that may need product-owner approval

Codex should stop rather than invent answers for these if the repo docs do not already define them:

- AI provider, API shape, credentials, and data retention expectations.
- Google OAuth scopes, redirect URLs, token storage strategy, and environment variables.
- Whether users can remove a plant photo in Slice 4.1 or only replace it.
- Whether AI suggestions should populate only common/scientific name or also care basics.
- Whether reminders should have a user-selected time in Slice 5.1 or remain date-based until Slice 5.2.
- Whether Google Calendar sync should create single upcoming events or recurring events.
- Whether disconnecting Google should delete future synced events or only stop future sync.

## Suggested information architecture

This campaign should add capability without making the app feel like it has several unrelated systems.

Suggested surfaces:

- **Plant profile**
  - Primary photo or fallback.
  - Photo manage action.
  - Optional identify action after photo exists.
  - Watering status from previous campaign.
  - Reminder panel after Slice 5.1.
  - Calendar sync status only if relevant and compact.

- **Plant card / dashboard card**
  - Thumbnail image or fallback.
  - Plant name.
  - Watering due state.
  - Reminder indicator only if useful.

- **Setup/edit flow**
  - Optional photo step.
  - Optional AI assistance when photo exists.
  - Manual fields remain primary and editable.

- **Reminder settings panel**
  - Current next reminder explanation.
  - Enable/disable.
  - Basic reminder timing or mode.
  - Snooze once Slice 5.3 is implemented.

- **Calendar sync panel**
  - Connect/disconnect Google Calendar.
  - Sync status.
  - Last sync/failure messaging if available.
  - Plain-language explanation that app reminders remain the source of truth.

## Suggested plant profile design mock after Slice 4.1

```text
┌────────────────────────────────────────────┐
│ ← My plants                                │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │          [ large plant photo ]          │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Monstera Deliciosa                         │
│ Bright indirect light · Water every 7 days │
│                                            │
│ [Change photo]                             │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Watering                               │ │
│ │ Due tomorrow                           │ │
│ │ Last watered 6 days ago                │ │
│ │ [Mark watered]                         │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Care basics                            │ │
│ │ Light: Bright indirect                 │ │
│ │ Water: Every 7 days                    │ │
│ │ Notes: Likes to dry slightly           │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Profile design notes

- The image should improve recognition, not dominate the care loop.
- Watering remains immediately visible below the plant identity area.
- The photo action should be secondary to watering actions.
- If no photo exists, show a calm fallback and a small `Add photo` action.

## Suggested no-photo profile mock

```text
┌────────────────────────────────────────────┐
│ ← My plants                                │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │              leaf fallback              │ │
│ │          Add a photo to make            │ │
│ │          this plant easier to find      │ │
│ │              [Add photo]                │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Snake Plant                                │
│ Low light tolerant · Water every 14 days   │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Watering                               │ │
│ │ Due in 5 days                          │ │
│ │ [Mark watered]                         │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

## Suggested plant card mock after Slice 4.1

```text
┌────────────────────────────────────────────┐
│ [thumb]  Pothos                            │
│          Due today                         │
│          Last watered 7 days ago           │
│          [Mark watered]                    │
└────────────────────────────────────────────┘
```

### Card design notes

- Thumbnail should be useful but small.
- Due status should remain more prominent than photo metadata.
- Cards without photos should use the same fallback language and icon treatment consistently.

## Suggested AI identification review mock after Slice 4.2

```text
┌────────────────────────────────────────────┐
│ Help identify this plant                   │
│                                            │
│ [photo thumbnail]                          │
│                                            │
│ These are suggestions, not certainties.    │
│ You can edit anything before saving.       │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Likely match                           │ │
│ │ Monstera deliciosa                     │ │
│ │ Confidence: likely                     │ │
│ │ [Use this]                             │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ Possible match                         │ │
│ │ Rhaphidophora tetrasperma              │ │
│ │ Confidence: possible                   │ │
│ │ [Use this]                             │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ [Keep editing manually]                    │
└────────────────────────────────────────────┘
```

### AI review design notes

- Use uncertainty labels such as `likely`, `possible`, or `not sure` rather than precise overconfident percentages unless the approved provider returns meaningful confidence and docs approve displaying it.
- Never say `identified as` without caveat.
- Do not show diagnosis, health, pest, toxicity, or treatment advice.
- Accepted values should land in normal editable fields.
- Rejected suggestions should leave the manual flow intact.

## Suggested accepted AI suggestion mock

```text
┌────────────────────────────────────────────┐
│ Review suggested details                   │
│                                            │
│ Name                                       │
│ [Monstera deliciosa                    ]   │
│                                            │
│ Nickname                                   │
│ [Living room monstera                  ]   │
│                                            │
│ Care basics                                │
│ Light                                      │
│ [Bright indirect light                 ]   │
│                                            │
│ Watering interval                          │
│ [Every 7 days                          ]   │
│                                            │
│ These details are editable. Check them     │
│ against what works for your home.          │
│                                            │
│ [Save plant details] [Cancel]              │
└────────────────────────────────────────────┘
```

### Accepted suggestion notes

- If Slice 4.2 only scopes name suggestions, omit care basics from this review.
- If care basics are included, copy must emphasize that they are starting points, not precision advice.
- Do not automatically overwrite user-entered values without review.

## Suggested reminder panel mock after Slice 5.1

```text
┌────────────────────────────────────────────┐
│ Watering reminder                          │
│                                            │
│ Next reminder: Tomorrow morning            │
│ Based on: every 7 days after watering      │
│                                            │
│ [Reminder on   toggle]                     │
│                                            │
│ This reminder lives in Plant Care. You can │
│ connect Google Calendar later.             │
└────────────────────────────────────────────┘
```

### Reminder panel design notes

- Explain what will happen next.
- Avoid recurrence jargon.
- Keep calendar sync out of the core reminder model.
- If no time field exists yet, use date-first language such as `Tomorrow` or `May 12` instead of pretending exact notification behavior exists.

## Suggested Google Calendar sync mock after Slice 5.2

```text
┌────────────────────────────────────────────┐
│ Google Calendar                            │
│                                            │
│ Not connected                              │
│ Sync watering reminders to your calendar.  │
│ Plant Care still keeps the reminder rules. │
│                                            │
│ [Connect Google Calendar]                  │
└────────────────────────────────────────────┘
```

Connected state:

```text
┌────────────────────────────────────────────┐
│ Google Calendar                            │
│                                            │
│ Connected                                  │
│ Next synced event: Water Monstera          │
│ May 12, 9:00 AM                            │
│                                            │
│ [Sync now] [Disconnect]                    │
└────────────────────────────────────────────┘
```

Failure state:

```text
┌────────────────────────────────────────────┐
│ Google Calendar                            │
│                                            │
│ Sync needs attention                       │
│ We could not update your calendar. Your    │
│ Plant Care reminder is still saved.        │
│                                            │
│ [Try again]                                │
└────────────────────────────────────────────┘
```

### Calendar design notes

- Google Calendar is an enhancement.
- The app should remain usable if Google sync fails.
- The UI should not imply that Google Calendar is required to remember watering.
- Do not expose provider internals unless needed for troubleshooting.

## Suggested reminder flexibility mock after Slice 5.3

```text
┌────────────────────────────────────────────┐
│ Reminder settings                          │
│                                            │
│ How should Plant Care calculate reminders? │
│                                            │
│ ◉ After I water                            │
│   Remind me 7 days after I mark watered.   │
│                                            │
│ ○ Fixed schedule                           │
│   Remind me every 7 days on a set rhythm.  │
│                                            │
│ Next reminder                              │
│ Tuesday, May 12                            │
│                                            │
│ [Snooze 1 day] [Snooze 3 days]             │
│ [Save reminder settings]                   │
└────────────────────────────────────────────┘
```

### Reminder flexibility design notes

- Keep mode names plain.
- Show the resulting next reminder before saving when practical.
- Snooze should change the next reminder, not mutate plant identity or care basics.
- Watered-early behavior should be predictable and documented.

## Photo, AI, reminder, and calendar semantics

### Photo semantics

Recommended v1 model:

- Each plant has zero or one primary photo.
- The photo belongs to the signed-in user and the owned plant.
- Photo storage path should include user ownership context.
- The app should store a durable reference to the primary photo, not arbitrary public URLs unless architecture docs approve that.
- Missing photo is a valid state.
- Upload failure should not block plant care.

### AI identification semantics

AI identification should be treated as a suggestion workflow:

1. User has or adds a plant photo.
2. User explicitly requests identification.
3. App sends only the owned photo or approved derived image data to the approved provider.
4. Provider returns candidates.
5. App displays candidates with uncertainty-aware copy.
6. User accepts, edits, or rejects.
7. Only user-reviewed accepted data becomes plant record data.

Do not implement passive/background identification in this campaign unless explicitly approved.

### Reminder semantics

Recommended v1 mental model:

- A watering reminder tells the user when to check or water a specific plant.
- It is tied to plant ownership and watering state.
- It can exist without Google Calendar.
- It should explain its next reminder date in plain language.
- It is not a generic task.
- It is not health diagnosis.

### Reminder calculation direction

Codex should inspect the existing watering data model before choosing exact fields.

Preferred behavior:

- If reminder mode is last-watered based, next reminder updates after `Mark watered`.
- If reminder mode is fixed schedule, next reminder follows the configured schedule and is not fully reset by early watering unless docs explicitly say so.
- If user waters early and last-watered based mode is active, the next reminder should move relative to the early watering date.
- Snooze should defer the current reminder without rewriting plant care basics.
- Calendar sync, if present, should update from the changed app reminder.

If existing watering semantics make this ambiguous, Codex must stop and report options.

### Calendar sync semantics

Recommended v1 sync model:

- One-way sync from app reminders to Google Calendar.
- App owns reminder truth.
- Google Calendar event is a reflection of app reminder state.
- Provider event IDs are linkage metadata, not source-of-truth reminders.
- Sync failure does not delete or invalidate app reminders.
- Disconnecting Google should preserve app reminders.

Codex should not implement bidirectional sync unless explicitly approved.

## Data and ownership principles

Preserve these across all slices:

- Route protection for signed-in user flows.
- Server-derived ownership checks for user-owned mutations.
- Supabase RLS alignment with all new tables and storage objects.
- Additive migrations where possible.
- No unnecessary schema churn.
- No public access to private plant photos unless explicitly approved by architecture docs.
- No cross-user access to photos, AI requests, reminders, provider tokens, provider event IDs, or sync state.
- No provider secrets exposed to the browser.

### Recommended data model direction

The exact schema should be chosen after inspecting the current repo, but the following boundaries should guide implementation.

#### Plant photos

Prefer either:

- a `primary_photo_path` or `primary_photo_id` on the existing plant record, if one-photo v1 is sufficient and migration-safe; or
- a small `plant_photos` table if the existing architecture prefers normalized owned media records.

Do not create a gallery model unless explicitly approved.

#### AI identification

Prefer a small provider boundary rather than scattering provider-specific logic through UI components.

Potential data approaches:

- No persistent AI request table for v1 if accepted suggestions are directly reviewed and saved.
- A small `plant_identification_suggestions` or `ai_identification_requests` table only if needed for audit, retry, or provider response handling.

Do not store unreviewed provider output as plant truth.

#### Reminders

Prefer an app-owned reminder record that can support future provider linkage.

Reasonable concepts:

- reminder ID
- user ID
- plant ID
- reminder type constrained to watering for v1
- enabled state
- mode such as last-watered based or fixed schedule, once Slice 5.3 is reached
- next reminder date or datetime
- optional reminder time
- snooze-until value if Slice 5.3 implements snooze
- created/updated timestamps

#### Calendar provider linkage

Prefer provider linkage that is clearly scoped to the signed-in user and the app-owned reminder.

Reasonable concepts:

- user provider connection
- provider name, constrained to Google for v1
- token storage or reference, depending on approved architecture
- calendar ID if needed
- provider event ID linked to an app reminder
- last sync status and timestamp if useful

Do not store credentials or refresh tokens in insecure browser-accessible locations.

## Copy guidance

### AI copy examples

Use:

- `This looks like it may be...`
- `Possible match`
- `Likely match`
- `Not sure? Keep editing manually.`
- `Plant identification can be imperfect. You can edit these details anytime.`

Avoid:

- `We identified your plant as...`
- `Guaranteed match`
- `Diagnosis`
- `Treatment`
- `This plant needs...` unless the user has accepted editable care guidance and the copy is conservative.

### Reminder copy examples

Use:

- `Next reminder: Tomorrow`
- `Based on your 7-day watering interval.`
- `Plant Care keeps the reminder. Google Calendar can mirror it later.`
- `Snooze this reminder without changing the plant's care basics.`

Avoid:

- `Task recurrence rule`
- `Automation engine`
- `Calendar owns this reminder`
- `We will notify you` unless an actual notification channel exists.

### Calendar copy examples

Use:

- `Sync watering reminders to Google Calendar.`
- `Plant Care remains the source of truth.`
- `Your reminder is still saved even if calendar sync fails.`

Avoid:

- `Manage watering in Google Calendar`
- `Calendar schedule controls watering`
- `Connect Outlook`

## Campaign slice plan

## Slice 4.1 — Plant photo upload

### Recommendation

Implement one secure primary photo per plant. Display it in the profile hero and plant cards where useful. Keep upload optional and secondary to watering.

### User story

As a plant owner, I want to add a photo to a plant so I can recognize it quickly in my collection.

### Product intent

Make the app feel more personal and visual without turning it into a media manager.

### Design target

The user can add, view, replace, and possibly remove a primary plant photo without disrupting the care loop.

Suggested UI:

```text
Plant profile
┌────────────────────────────────────────────┐
│ [Photo or fallback]                        │
│ [Add photo] / [Change photo]               │
│                                            │
│ Plant name                                 │
│ Watering panel                             │
│ Care basics                                │
└────────────────────────────────────────────┘
```

### Interaction details

- If no photo exists, show a calm fallback and `Add photo` action.
- If a photo exists, show it as the primary profile image.
- On plant cards, show a thumbnail only if it improves recognition and does not crowd watering state.
- Upload should show progress or clear loading state.
- Failed upload should show a plain-language error and preserve the current plant state.
- Replace/remove behavior should be included only if it fits cleanly; if not, implement add/display and document replace/remove as follow-up.

### Empty/loading/error states

- **No photo:** `Add a photo to make this plant easier to find.`
- **Uploading:** `Uploading photo...`
- **Upload failed:** `We couldn't upload this photo. Try a different image or try again.`
- **Storage unavailable:** `Photo upload is unavailable right now. Your plant details are still saved.`

### Data and ownership expectations

- Store photos in Supabase Storage or the documented storage system.
- Storage paths and policies must preserve user ownership.
- A user must not be able to view, update, replace, or delete another user's plant photo.
- Do not expose broad public buckets unless architecture docs explicitly approve.
- Store only the minimal durable reference needed to render the primary photo.

### Scope

Included:

- Primary photo upload/capture where supported by browser/device.
- Secure storage of the photo.
- Association to owned plant.
- Display on plant profile.
- Display on plant card/dashboard where useful.
- Fallback for no photo.
- Basic replace/remove only if low-risk and within slice.
- Architecture docs for storage conventions.

Excluded:

- AI identification.
- Provider integrations.
- Image analysis.
- Diagnosis.
- Galleries.
- Multiple photos.
- Public sharing.
- Photo captions/tags/albums.
- Reminders.
- Calendar sync.
- Broad redesign.

### Likely files or areas

Codex should inspect the repo before deciding exact files. Likely areas include:

- Supabase migration or storage setup notes.
- Storage policy definitions or setup docs.
- Plant schema/types.
- Plant profile route/component.
- Plant card/dashboard components.
- Plant create/edit form if photo upload belongs there.
- Server actions or API routes for upload/update.
- Image rendering helper.
- `docs/architecture.md`.
- `docs/roadmap.md`.
- `docs/current-task.md`.
- This campaign file.

### Acceptance criteria

- Signed-in user can add a primary photo to a plant they own.
- Photo persists after refresh.
- Photo displays on the plant profile.
- Photo displays in plant collection/dashboard card if the UI supports it cleanly.
- Plant without a photo has a calm fallback.
- Failed upload has a clear error state.
- Another user cannot access or mutate the photo.
- Manual plant care works without a photo.
- No AI, reminders, calendar sync, gallery, or diagnosis behavior is introduced.

### Manual QA checklist

- Create or open a plant with no photo.
- Add a photo from mobile-sized viewport.
- Refresh and confirm persistence.
- Confirm profile display.
- Confirm card/dashboard display if included.
- Try a failed upload scenario if feasible.
- Replace/remove if implemented.
- Confirm no-photo fallback.
- Confirm signed-out access is blocked.
- Confirm cross-user access is blocked or reasoned through with RLS/policies.
- Confirm mobile layout is not crowded.

### Validation expectations

Run:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.

If a validation command is unavailable, Codex must report that clearly.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move the active slice to Slice 4.2 after completion.
- `docs/roadmap.md` to mark Slice 4.1 implemented and Slice 4.2 active.
- `docs/architecture.md` to document photo storage, path convention, access model, and photo reference model.
- This campaign file to mark Slice 4.1 complete.

### Stop conditions

Stop and report if:

- Storage bucket/policy design is unclear.
- Upload requires making private photos public without explicit approval.
- Cross-user photo access cannot be prevented.
- Implementation requires AI provider work.
- The slice expands into gallery/media management.
- Build/typecheck/test validation fails.

---

## Slice 4.2 — AI-assisted plant identification

### Recommendation

Add an optional, conservative identification workflow from an owned plant photo. Do not start this slice until the AI provider, credentials, request shape, and data-handling expectations are documented or explicitly approved.

### User story

As a plant owner, I want optional help identifying a plant from its photo so I can fill in plant details faster while still reviewing and editing the result.

### Product intent

Reduce setup friction without making the app an authority on plant identity, care precision, health, pests, or diagnosis.

### Design target

AI assistance should feel like a helper, not a decision-maker.

Suggested flow:

```text
Plant profile with photo
  ↓ user taps Help identify this plant
Loading state
  ↓ provider returns candidates
Suggestion review
  ↓ user chooses Use this / Keep editing manually
Editable plant detail form
  ↓ user saves reviewed values
Plant profile
```

### Interaction details

- AI request requires deliberate user action.
- Show a loading state that does not block normal navigation.
- Show a small number of suggestions.
- Use conservative confidence language.
- Let user accept one suggestion, edit values, or reject all suggestions.
- Manual flow remains available before, during, and after AI flow.
- Missing provider config should show an admin/developer-facing error in dev or stop implementation before runtime code if provider decisions are absent.

### Empty/loading/error states

- **No photo:** `Add a photo before asking for identification help.`
- **Identifying:** `Checking possible matches...`
- **No confident suggestion:** `We are not sure about this one. You can keep editing manually.`
- **Provider failure:** `Identification is unavailable right now. Your plant details are still editable.`
- **Rejected suggestions:** return to manual edit state.

### AI provider rule

Codex must not invent provider-specific integration details.

If the repo docs and environment do not identify the AI provider, API, credentials, request shape, allowed data handling, and expected response shape, Codex must stop and report that Slice 4.2 needs a provider decision.

If provider setup is documented, implement the smallest provider boundary needed for this slice and document it in `docs/architecture.md`.

### Data and ownership expectations

- User can request identification only for a plant/photo they own.
- Provider call must not expose another user's data.
- Provider response must not become plant truth until user accepts/reviews it.
- Accepted values remain editable plant fields.
- If provider response persistence is needed, it must be scoped to the user and plant.
- Do not store unnecessary image/provider data.

### Scope

Included:

- Identification request action for an owned photo.
- Provider adapter/service boundary if provider is approved.
- Loading/success/failure UI.
- Candidate review UI.
- Accept/edit/reject behavior.
- Conservative copy.
- Manual override path.
- Architecture docs for AI provider boundary.

Excluded:

- Authoritative identification.
- Diagnosis.
- Pest/disease analysis.
- Treatment recommendations.
- Toxicity claims unless explicitly scoped and sourced.
- AI-generated watering schedules unless explicitly reviewed as editable care guidance and already approved.
- Background/batch identification.
- Multiple providers.
- AI chat.
- Encyclopedia pages.
- Reminders or calendar sync.

### Likely files or areas

- Plant profile photo area.
- Identification action/API route.
- Provider adapter/service.
- Environment validation.
- Suggestion review component.
- Plant update action/form.
- Types for provider result/candidates.
- `docs/architecture.md`.
- `docs/roadmap.md`.
- `docs/current-task.md`.
- This campaign file.

### Acceptance criteria

- Signed-in user can request identification for their own plant photo.
- User cannot request identification for another user's plant/photo.
- UI shows loading, success, and failure states.
- UI shows suggestions with uncertainty-aware copy.
- User can accept a suggestion into editable fields.
- User can edit before or after saving.
- User can reject suggestions and continue manually.
- Manual plant setup still works without AI.
- Feature does not claim certainty, diagnose health, or prescribe treatment.
- Provider boundary and environment expectations are documented.

### Manual QA checklist

- Start from a plant with no photo and confirm AI action is unavailable or explains photo prerequisite.
- Start from a plant with a photo and request identification.
- Verify loading state.
- Verify candidate display.
- Accept a candidate.
- Edit accepted values before save if the flow supports it.
- Reject candidates and continue manually.
- Simulate provider failure or missing config if feasible.
- Confirm copy is conservative.
- Confirm mobile layout.
- Confirm cross-user access is blocked or reasoned through with RLS/server checks.

### Validation expectations

Run:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.

If provider credentials are required for manual end-to-end testing and unavailable, Codex must report what was and was not tested.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move the active slice to Slice 5.1 after completion.
- `docs/roadmap.md` to mark Slice 4.2 implemented and Slice 5.1 active.
- `docs/architecture.md` to document AI provider boundary, env vars, data handling, failure behavior, and review/override rules.
- This campaign file to mark Slice 4.2 complete.

### Stop conditions

Stop and report if:

- AI provider/config/data-handling expectations are missing.
- Provider requirements require broad architecture changes.
- Implementation would store unreviewed AI output as plant truth.
- The feature drifts into diagnosis, health advice, pest advice, or encyclopedia content.
- Cross-user protection is unclear.
- Build/typecheck/test validation fails.

---

## Slice 5.1 — Internal reminder model

### Recommendation

Create app-owned watering reminders before any external sync. Keep the model watering-specific, simple, and provider-neutral.

### User story

As a plant owner, I want Plant Care to remember when a plant should be watered next so I can review upcoming watering without relying on an external calendar.

### Product intent

Make the watering loop more durable while preserving the app as the source of truth.

### Design target

Users should understand the next reminder and whether it is enabled without learning scheduling jargon.

Suggested UI:

```text
Plant profile
┌────────────────────────────────────────────┐
│ Watering reminder                          │
│ Next reminder: Tuesday, May 12             │
│ Based on: every 7 days after watering      │
│ [On toggle]                                │
└────────────────────────────────────────────┘
```

### Interaction details

- Reminder state should be visible on the plant profile.
- Dashboard can show reminder state only if it helps the watering loop and does not clutter existing due groups.
- Reminder enable/disable should be simple.
- If time-of-day is included, use plain language such as `Morning` or `9:00 AM`; otherwise keep date-first.
- Reminder state should update predictably after watering.

### Empty/loading/error states

- **No reminder:** `No reminder set yet.`
- **Reminder disabled:** `Reminder off. Watering status still updates in Plant Care.`
- **Cannot calculate:** `Add a watering interval to calculate a reminder.`
- **Save failed:** `We couldn't save the reminder. Your plant details were not changed.`

### Data and ownership expectations

- Reminder records belong to the signed-in user.
- Reminder records attach to owned plants.
- RLS must prevent cross-user access.
- Reminder model should not require Google Calendar fields to work.
- Provider linkage fields may be deferred to Slice 5.2 unless adding placeholders is clearly simpler and documented.

### Scope

Included:

- App-owned watering reminder model.
- Migration/schema/RLS for reminders.
- Reminder query/mutation utilities.
- Reminder panel or status UI.
- Enable/disable if low-risk.
- Basic next-reminder calculation aligned with existing watering state.
- Architecture docs for reminder model.

Excluded:

- Google Calendar sync.
- Outlook.
- Push notifications.
- Email/SMS.
- Generic tasks.
- Arbitrary recurrence rules.
- AI-generated reminders.
- Broad automation.
- Calendar-defined reminders.

### Likely files or areas

- Supabase migration/schema.
- Reminder table/types.
- RLS policies.
- Reminder server actions/API routes.
- Date calculation helpers.
- Plant profile reminder UI.
- Dashboard reminder display if useful.
- Tests for reminder calculation if test patterns exist.
- `docs/architecture.md`.
- `docs/roadmap.md`.
- `docs/current-task.md`.
- This campaign file.

### Acceptance criteria

- Signed-in user can have watering reminder state for owned plants.
- Reminder state exists without Google Calendar.
- Reminder state aligns with existing watering due behavior.
- Reminder UI is understandable and mobile-friendly.
- Reminder data remains scoped to the signed-in user.
- Reminder model can support future Google linkage without being defined by Google.
- The slice does not introduce external sync, generic tasks, or notification channels.

### Manual QA checklist

- Open plant profile after reminder model exists.
- Confirm next reminder explanation.
- Enable/disable reminder if included.
- Mark watered and confirm reminder state updates as expected.
- Confirm plant with missing watering interval has clear fallback.
- Confirm dashboard behavior if included.
- Confirm signed-out access is blocked.
- Confirm cross-user reminder access is blocked or reasoned through with RLS/server checks.
- Confirm mobile layout.

### Validation expectations

Run:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move the active slice to Slice 5.2 after completion.
- `docs/roadmap.md` to mark Slice 5.1 implemented and Slice 5.2 active.
- `docs/architecture.md` to document the reminder model, RLS, reminder calculation, and rule that reminders are app-owned before provider sync.
- This campaign file to mark Slice 5.1 complete.

### Stop conditions

Stop and report if:

- Reminder semantics conflict with watering state.
- Exact reminder calculation cannot be determined from existing docs/code.
- Implementation requires Google Calendar to work.
- The model becomes a generic task scheduler.
- RLS or ownership boundaries are unclear.
- Build/typecheck/test validation fails.

---

## Slice 5.2 — Google Calendar sync

### Recommendation

Implement Google Calendar as a one-way reflection of app-owned watering reminders. Do not start provider-specific code until OAuth scopes, redirect URLs, environment variables, and token storage expectations are documented or explicitly approved.

### User story

As a plant owner, I want my Plant Care watering reminders to appear on Google Calendar so I can notice them in my normal calendar routine.

### Product intent

Extend reminder visibility outside the app without making Google Calendar the source of watering truth.

### Design target

Calendar sync should feel like a small integration setting, not a new way to manage plants.

Suggested flow:

```text
Reminder exists in Plant Care
  ↓ user connects Google Calendar
App stores provider connection securely
  ↓ app creates/updates calendar event from reminder
Plant Care shows sync status
  ↓ app reminder changes
Linked calendar event updates
```

### Interaction details

- Show connection state: not connected, connected, sync failed.
- Explain that Plant Care remains the source of truth.
- Let users retry sync when failure occurs if feasible.
- Let users disconnect if the provider model supports it.
- Missing provider config should not break the core app.
- Provider errors should not delete app reminders.

### Empty/loading/error states

- **Not connected:** `Connect Google Calendar to mirror watering reminders.`
- **Connecting:** `Connecting Google Calendar...`
- **Connected:** `Google Calendar connected.`
- **Syncing:** `Updating your calendar...`
- **Sync failed:** `We couldn't update Google Calendar. Your Plant Care reminder is still saved.`
- **Missing config:** development/admin stop condition; do not ship broken user-facing provider flow.

### Google provider rule

Codex must not invent OAuth configuration.

If Google provider setup is not documented or explicitly approved, Codex must stop and report missing decisions for:

- OAuth client setup.
- Redirect/callback URLs.
- Required scopes.
- Token storage strategy.
- Calendar ID strategy.
- Environment variable names.
- Disconnect behavior.
- Event deletion behavior.

If provider setup is documented, implement the smallest secure v1 integration and document it in `docs/architecture.md`.

### Data and ownership expectations

- Provider connection is scoped to the signed-in user.
- Provider event linkage is scoped to app-owned reminders.
- Provider tokens/secrets must not be exposed to the browser.
- Sync mutations must verify user ownership.
- Google event IDs must not be treated as reminder truth.

### Scope

Included:

- Google connection flow if provider config is approved.
- Provider service/adapter.
- Secure connection/linkage model.
- Create/update Google Calendar event from app-owned reminder.
- Sync status UI.
- Retry/disconnect if low-risk and compatible with provider model.
- Architecture docs for provider boundary.

Excluded:

- Outlook.
- Bidirectional sync.
- Calendar-defined reminder state.
- Non-watering events.
- Generic calendar task platform.
- Push/email/SMS notifications.
- AI scheduling.
- Complex recurrence unless clearly justified by the reminder model.

### Recommended event behavior

Prefer one of these, in order:

1. **Single upcoming event per active reminder** if the reminder model is date-based and changes after watering.
2. **Simple recurring event** only if Slice 5.1/5.3 data model clearly supports recurrence without making Google authoritative.

Event title examples:

- `Water Monstera`
- `Water Snake Plant`

Event description should stay plain and may include:

- `Created from Plant Care.`
- `Plant Care remains the source of truth for this reminder.`
- A link back to the plant profile if routing supports it.

### Likely files or areas

- Google OAuth route/action.
- Provider callback route.
- Provider connection schema/migration.
- Reminder-provider linkage schema/migration.
- Google Calendar service adapter.
- Reminder sync action.
- Environment validation.
- Calendar sync UI.
- `docs/architecture.md`.
- `docs/roadmap.md`.
- `docs/current-task.md`.
- This campaign file.

### Acceptance criteria

- Signed-in user can connect Google Calendar when provider configuration is present.
- App-owned watering reminder can create a corresponding Google Calendar event.
- App reminder changes update the linked calendar event.
- Sync status is visible and understandable.
- Provider failure does not break app reminders.
- App remains usable with Google disconnected.
- Provider linkage is secure and user-scoped.
- Calendar events do not define watering or reminder truth.
- Outlook remains deferred.

### Manual QA checklist

- Confirm provider config is present in the test/preview environment.
- Connect Google Calendar.
- Sync an existing watering reminder.
- Confirm event appears in Google Calendar if available for QA.
- Change app reminder/watering state and confirm synced event updates.
- Test provider failure or expired connection if feasible.
- Disconnect if implemented.
- Confirm app reminder remains after disconnect/failure.
- Confirm mobile layout.
- Confirm cross-user access is blocked or reasoned through.

### Validation expectations

Run:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.

If Google credentials are unavailable, Codex must still validate local/build behavior and clearly report which provider QA could not be completed.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move the active slice to Slice 5.3 after completion.
- `docs/roadmap.md` to mark Slice 5.2 implemented and Slice 5.3 active.
- `docs/architecture.md` to document Google Calendar provider boundary, env vars, token/linkage model, sync direction, event behavior, and failure behavior.
- This campaign file to mark Slice 5.2 complete.

### Stop conditions

Stop and report if:

- Google provider configuration is missing or ambiguous.
- Token storage/security expectations are unclear.
- Implementation would make Google Calendar the source of truth.
- Work expands into Outlook, bidirectional sync, generic tasks, or unrelated notifications.
- Provider security is unclear.
- Build/typecheck/test validation fails.

---

## Slice 5.3 — Reminder flexibility

### Recommendation

Add focused flexibility only after the reminder model and any approved Google sync are stable. Keep controls beginner-friendly and watering-specific.

### User story

As a plant owner, I want small adjustments like fixed schedule, after-watering reminders, snooze, and watered-early behavior so reminders match how I actually care for plants.

### Product intent

Make reminders useful in real home routines without creating a generic scheduler.

### Design target

Users should be able to answer: `When will Plant Care remind me next, and why?`

Suggested UI:

```text
Reminder settings
┌────────────────────────────────────────────┐
│ How should reminders work?                 │
│                                            │
│ ◉ After I water                            │
│   Remind me 7 days after I mark watered.   │
│                                            │
│ ○ Fixed schedule                           │
│   Keep a steady every-7-days rhythm.       │
│                                            │
│ Next reminder: Tuesday, May 12             │
│                                            │
│ [Snooze 1 day] [Snooze 3 days]             │
│ [Save]                                     │
└────────────────────────────────────────────┘
```

### Interaction details

- Show the next reminder result in plain language.
- Keep mode choices minimal.
- Snooze should affect the current reminder instance/next reminder, not rewrite core care basics.
- Watered-early behavior should be predictable and consistent with selected mode.
- If Google sync exists, app reminder changes should update the calendar event.

### Empty/loading/error states

- **No interval:** `Add a watering interval before choosing reminder timing.`
- **Snoozed:** `Snoozed until Thursday.`
- **Save failed:** `We couldn't save these reminder settings. Your previous reminder is unchanged.`
- **Sync lag/failure:** `Reminder saved in Plant Care. Google Calendar will need another sync attempt.`

### Reminder behavior recommendations

Use these defaults unless repo docs or product owner override them:

- **After I water:** next reminder is based on the most recent watering date plus the plant's watering interval.
- **Fixed schedule:** next reminder follows a stable cadence and is not necessarily reset by early watering.
- **Snooze:** moves the next reminder later by the chosen amount without changing plant care interval.
- **Watered early in after-watering mode:** recalculates next reminder from the early watering date.
- **Watered early in fixed schedule mode:** either keep the fixed next reminder or ask product owner; Codex should not guess if docs are unclear.

### Data and ownership expectations

- Reminder flexibility remains user-owned and plant-scoped.
- Any new fields must be additive and migration-safe.
- Date calculation should be centralized enough to avoid inconsistent UI states.
- Calendar linkage, if present, updates from app reminder state.

### Scope

Included:

- Fixed schedule vs last-watered/after-watering mode if supported by model.
- Snooze.
- Watered-early semantics.
- UI explanation of next reminder.
- Calendar sync update path if Slice 5.2 is implemented.
- Tests for date calculation if repo test patterns exist.
- Documentation updates.

Excluded:

- Generic recurring task engine.
- Arbitrary task creation.
- Outlook.
- Health diagnosis scheduling.
- AI-generated schedule changes.
- Advanced automation rules.
- Push/email/SMS notifications.
- Gamification/streaks.
- Complex RRULE builder.

### Likely files or areas

- Reminder schema/migration if needed.
- Reminder calculation helpers.
- Reminder settings component.
- Plant profile reminder panel.
- Dashboard reminder display.
- Calendar sync update action if implemented.
- Tests around date calculations.
- `docs/architecture.md` if behavior/data model changes.
- `docs/roadmap.md`.
- `docs/current-task.md`.
- This campaign file.

### Acceptance criteria

- User can understand or choose reminder mode if mode selection is included.
- User can snooze a watering reminder.
- Watered-early behavior updates the next reminder predictably.
- Next reminder explanation is visible and plain-language.
- Reminder state remains app-owned.
- Calendar sync, if present, updates from app reminder changes.
- UI remains calm and beginner-friendly.
- Feature does not become a generic task manager or automation engine.

### Manual QA checklist

- Verify after-watering mode.
- Verify fixed schedule mode if included.
- Mark watered early and confirm expected next reminder behavior.
- Snooze by each supported amount.
- Confirm next reminder explanation after each action.
- Confirm calendar event update if Google sync exists.
- Confirm failure state if calendar update fails.
- Confirm mobile layout.
- Confirm cross-user access is blocked or reasoned through.

### Validation expectations

Run:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.

### Documentation delta expectations

Update:

- `docs/current-task.md` to identify the next recommended roadmap action after v1 reminder flexibility.
- `docs/roadmap.md` to mark Slice 5.3 implemented and keep Outlook, health support, richer plant knowledge, and smarter automation deferred unless explicitly reprioritized.
- `docs/architecture.md` if reminder calculation, sync update behavior, or data model changes.
- This campaign file to mark Slice 5.3 complete and the campaign complete.

### Stop conditions

Stop and report if:

- Reminder flexibility requires broad scheduler architecture.
- UI becomes too complex for beginner watering workflows.
- Calendar sync cannot stay aligned with reminder changes.
- Work drifts into Outlook, AI scheduling, notifications, generic tasks, or diagnosis.
- Build/typecheck/test validation fails.

## Campaign-level QA matrix

| Area | QA expectation |
| --- | --- |
| Photo upload | Add, persist, display, fallback, failed upload |
| Storage ownership | No cross-user photo access or mutation |
| Plant profile | Photo and reminder additions do not hide watering state |
| Plant card/dashboard | Visual additions do not crowd due/overdue status |
| AI entry | AI is optional and requires deliberate action |
| AI review | Suggestions are uncertain, editable, rejectable |
| AI failure | Manual care remains available |
| Reminder model | App-owned reminder works without Google Calendar |
| Reminder calculation | Next reminder is explainable and consistent |
| Google sync | Calendar mirrors app reminder state only |
| Provider failure | App reminders survive failure/disconnect |
| Reminder flexibility | Snooze and watered-early behavior are predictable |
| Mobile | All new controls work on narrow screens |
| Docs | Current task, roadmap, architecture, and campaign stay consistent |

## Campaign exit criteria

The campaign is complete when:

- Slice 4.1 is implemented and documented.
- Slice 4.2 is implemented and documented, or explicitly deferred by roadmap update.
- Slice 5.1 is implemented and documented.
- Slice 5.2 is implemented and documented, or explicitly deferred by roadmap update.
- Slice 5.3 is implemented and documented.
- Users can add and view plant photos.
- Users can optionally use conservative AI identification from owned photos.
- Users can manage app-owned watering reminders.
- Google Calendar, if configured, mirrors reminders without becoming source of truth.
- Reminder flexibility is useful but not generic.
- RLS, route protection, storage access, provider linkage, and ownership checks remain intact.

## Campaign-level non-goals

This campaign must not introduce:

- Outlook Calendar sync.
- Bidirectional calendar sync unless explicitly approved.
- Calendar-defined reminder truth.
- Health diagnosis.
- Pest or disease suggestions.
- Treatment recommendations.
- Authoritative AI claims.
- AI-controlled care truth.
- Generic task management.
- Broad plant encyclopedia content.
- Adaptive automation beyond scoped reminder behavior.
- Gamification/streaks/scoring.
- Public sharing or social features.
- Multi-photo galleries.
- Notification channels beyond already-scoped calendar behavior.

## Campaign-level stop conditions

Codex must stop and report before changing code if:

- The watering foundation campaign is not complete through Slice 3.3.
- Current docs do not identify the correct active or approved next slice.
- Source-of-truth docs conflict.
- AI provider decisions are missing for Slice 4.2.
- Google provider decisions are missing for Slice 5.2.
- Proposed changes require broad architecture rewrites.
- RLS/ownership/storage/provider security is unclear.
- The proposed implementation combines unrelated slices.
- The proposed implementation drifts away from watering-first UX.

## Codex handoff template for each slice

Use this template when starting a slice from this campaign.

```markdown
# Codex handoff — [Slice name]

## Goal

[One-sentence goal for this slice.]

## Docs to inspect first

- AGENTS.md
- docs/product.md
- docs/architecture.md
- docs/roadmap.md
- docs/current-task.md
- docs/campaigns/plant-profile-watering-foundation.md
- docs/campaigns/photo-identification-reminder-sync.md

## Readiness gate

Before changing code, confirm:

- The preceding slice is complete or explicitly deferred.
- docs/current-task.md identifies this slice as active or approved next.
- The repo docs do not conflict.
- The worktree state is safe.
- Required provider/storage/reminder decisions for this slice are documented.

Stop and report any conflict or missing decision.

## Context

[Brief slice-specific context from this campaign.]

## Scope

[Included work only.]

## Non-goals

[Explicit exclusions.]

## Likely files

[Likely areas to inspect/change after repo inspection.]

## Acceptance criteria

[Copy/adapt acceptance criteria from this campaign slice.]

## Validation

Run:

- npm run typecheck, if present
- npm test, if present
- npm run build

Report unavailable commands clearly.

## Documentation delta

Update:

- docs/current-task.md
- docs/roadmap.md
- docs/architecture.md if architecture/data/provider behavior changes
- docs/campaigns/photo-identification-reminder-sync.md

## Stop conditions

[Copy/adapt stop conditions from this campaign slice.]

## Final report

Include:

- Summary of changes
- Files changed
- Validation results
- Manual QA performed or still needed
- Documentation delta
- Risks/follow-ups
- Compact state packet
```

## Documentation update rules

For each implementation slice, Codex should update docs as part of the same PR-sized work:

- `docs/current-task.md`: active slice, completed work, next recommended action, QA notes.
- `docs/roadmap.md`: slice status and sequencing.
- `docs/architecture.md`: only when data model, storage, provider boundary, sync behavior, routes, services, or deployment/env expectations change.
- This campaign file: mark slice status and update notes.

Docs-only updates should verify internal consistency and report that build validation was skipped because no code changed.

## State packet expectation

Every Codex final report for this campaign must include a compact state packet:

```text
Project: Plant Care App
Branch: [branch]
Commit: [commit]
Merged to main: yes/no
Active campaign: Photo Identification + Reminder Sync Campaign
Completed work: [slice/status]
Current status: [plain-language status]
Next recommended action: [next slice/QA/patch/merge]
Docs updated: [yes/no + list]
Manual QA needed: [list]
Known risks: [list]
```

## Final reporting expectations

At the end of each slice, Codex should report:

- What changed.
- What files changed.
- Validation commands run and results.
- Manual QA performed or still needed.
- Documentation delta.
- Any risks, follow-ups, or stop-condition concerns.
- The compact state packet.
