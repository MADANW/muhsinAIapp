# COPILOT_INSTRUCTIONS.md

## Project Context

* App: **MuhsinAI Mobile** (Expo + RN + NativeWind)
* Backend: **Supabase** (Auth/DB/RLS + Edge Functions)
* Payments: **RevenueCat** (entitlement `pro`)
* AI: **OpenAI** via Supabase Edge Function `plan` returning JSON plan
* Free users: **3 total** generations; after that show **/paywall**

## Code Style

* TypeScript everywhere; functional React components; hooks > classes
* Keep UI minimal, high contrast; use NativeWind utility classes
* State with **Zustand**; server data via **supabase-js**; navigation via **Expo Router**
* No inline `any`; create `types.ts` for Plan/Task

## Important Files

* `apps/mobile/app/index.tsx` → Home (CTA) + prayer card
* `apps/mobile/app/paywall.tsx` → RevenueCat purchase flow
* `apps/mobile/lib/api.ts` → calls `supabase.functions.invoke('plan')`
* `apps/mobile/lib/store.ts` → `{ isPro, usageCount }`

## Guardrails for Suggestions

* Never put API keys in the client. All OpenAI calls go through the `plan` Edge Function
* Before generating a plan, **check**: if `!isPro && usageCount >= 3` → navigate `/paywall`
* After successful plan response, `incUsage()` and route to `/plan`
* When purchase completes, set `isPro=true` (check RC entitlement `pro`)

## Tasks Copilot Should Help With

1. **Scaffold screens**: Home, Plan (render JSON as checklist), Paywall, Profile
2. **Build `PlanView`**: accepts `{ tasks }` JSON and renders cards with checkboxes
3. **Implement `usePurchase()` hook** with RevenueCat APIs (get offerings, purchase package, restore)
4. **Implement `usePrayerTimes()`** hook consuming Aladhan (cache per day)
5. **Telemetry helper**: `track(event, props)` for PostHog
6. **Error UI**: toast/banner components for network or entitlement errors
7. **Export (Markdown)**: convert plan to `.md` string and share via `Sharing.shareAsync`

## Snippets Copilot Can Reuse

* Zustand store with `isPro`, `usageCount`, `setPro`, `incUsage`
* Supabase function invoke wrapper with typed result `{ plan, isPro }`
* RevenueCat purchase flow that activates `pro` on success and navigates back

## PR/Commit Guidance

* Use small PRs; include a short demo video/gif in PR description
* Commit prefixes: `feat:`, `fix:`, `chore:`, `ui:`, `docs:`

## Don’t Suggest

* Direct OpenAI calls from the client
* Complex native modules that break Expo EAS
* New dependencies unless necessary; prefer Expo‑compatible libs
