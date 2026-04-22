# Plant Care App Roadmap

This roadmap reflects the current repo truth and the agreed product direction. The project is still at the very beginning: the app has a working Next.js scaffold, placeholder routes, and Supabase-ready helpers, but no completed product workflows yet.

## Status vocabulary

- `implemented`: present in the repo today
- `in progress`: partially built and actively underway
- `planned`: agreed direction, not started yet
- `deferred`: intentionally pushed later
- `out of scope for v1`: not part of the first shippable product

## Foundation

### Current baseline

- `implemented`: Next.js + TypeScript + Tailwind scaffold
- `implemented`: basic route structure for `/`, `/login`, and `/app`
- `implemented`: initial docs set for roadmap, current task, architecture, and handoff
- `implemented`: Supabase environment handling plus browser/server session helper groundwork
- `implemented`: placeholder public landing page
- `implemented`: placeholder login route
- `implemented`: placeholder app area shell
- `in progress`: none

### What is not built yet

- `planned`: real Supabase Auth flow
- `planned`: protected app access
- `planned`: persisted product data model
- `planned`: plant CRUD
- `planned`: image upload flow
- `planned`: AI identification
- `planned`: watering workflow
- `planned`: reminder system
- `planned`: calendar sync

## V1 MVP

### MVP goal

Help the user identify each houseplant, know when it needs water, and track whether they watered it.

### Slice order

#### Slice 1: Auth and protected app access

- `planned`: real Supabase Auth entry flow
- `planned`: protected `/app` access for signed-in users only
- `planned`: signed-in app shell
- `planned`: minimal onboarding state for the account owner

#### Slice 2: Personal plant collection

- `planned`: user account tied to a personal plant collection
- `planned`: add plant flow with photo
- `planned`: nickname plus real plant name support
- `planned`: room or location in house
- `planned`: notes field per plant

#### Slice 3: Identification and editable plant profile

- `planned`: attempt plant identification from photo
- `planned`: identification confidence score
- `planned`: user override of AI identification
- `planned`: plant profile with name, photo, room/location, and basic watering guidance
- `planned`: editable care guidance so the user stays in control

#### Slice 4: Watering workflow

- `planned`: last watered date
- `planned`: next watering date
- `planned`: watering task tracking
- `planned`: mark as watered
- `planned`: automatic next reminder update after watering
- `planned`: watered-early support

#### Slice 5: Dashboard visibility

- `planned`: plants needing water today
- `planned`: upcoming watering tasks
- `planned`: recently completed tasks
- `planned`: basic care history visibility for recent activity

### V1 boundaries

- `out of scope for v1`: generic plant encyclopedia behavior
- `out of scope for v1`: generic task manager behavior
- `out of scope for v1`: overclaimed health diagnosis

## Post-v1 phases

### Phase 2: Plant health support

- `planned`: quick health check mode separate from normal setup
- `planned`: upload a plant health photo
- `planned`: detect likely issues such as underwatering, overwatering, yellowing leaves, browning tips, drooping, and pest suspicion
- `planned`: show likely causes and suggested next actions

### Phase 3: Richer plant knowledge

- `planned`: light preference
- `planned`: humidity preference
- `planned`: temperature range
- `planned`: soil and repotting notes
- `planned`: toxicity for pets
- `planned`: fertilizing schedule
- `planned`: fun facts and plant background

### Phase 4: Smarter automation

- `planned`: adaptive watering schedule based on user check-ins
- `planned`: seasonal watering adjustments
- `planned`: care streaks and habit tracking
- `planned`: notifications based on plant risk or missed care

## Future and nice-to-have ideas

- `planned`: room-based organization views
- `planned`: windows or light-exposure grouping later
- `planned`: expanded care history log for watered, issue detected, treatment applied, and repotted
- `planned`: smart reminder flexibility for fixed schedules, reminders based on last watering, snooze support, and watered-early support
- `deferred`: Google Calendar sync after in-app reminders are stable
- `deferred`: Outlook calendar sync after Google Calendar support
- `deferred`: broader automation workflows beyond the core watering loop

## Sequencing rationale

- Auth comes before plant CRUD because the plant collection is personal and should belong to a signed-in user from the start.
- The core plant and watering loop comes before advanced AI and richer knowledge because the MVP is: identify the plant, know when it needs water, and record that watering happened.
- Calendar sync comes after in-app reminders because external calendar events should reflect a reminder model that already works inside the app.
- Health support and richer plant knowledge stay post-v1 so the product does not drift into diagnosis claims or encyclopedia scope before the watering-first core is dependable.
