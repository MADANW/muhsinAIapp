# MuhsinAI �✨

AI daily planner for students and young professionals with built-in prayer times, templates, and Pro tier subscription.

## Overview

MuhsinAI helps users quickly generate structured daily plans that respect prayer times and personal schedules through natural language commands. The app offers 3 free plans before requiring a subscription to the Pro tier.

### Features

- **Natural Language Planning**: Type what you want to do and get a structured, editable daily plan
- **Prayer Times Integration**: Automatically includes prayer times based on location
- **Free Tier**: 3 free AI-generated plans
- **Pro Subscription**: Unlimited plans, templates, export options, and more

## Tech Stack

- **Frontend**: Expo (React Native), Expo Router, Zustand for state management
- **Backend**: Supabase (Auth, DB, Edge Functions)
- **AI Integration**: OpenAI (via Edge Function)
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions

## Project Structure

```
app/                  # Main application code (Expo Router)
  lib/                # Core libraries
    store.ts          # Zustand store with AsyncStorage persistence
    api.ts            # API wrapper for Edge Functions
  home.tsx            # Home screen
  plan.tsx            # Plan creation screen
  paywall.tsx         # Subscription paywall
  profile.tsx         # User profile
supabase/             # Supabase configuration
  functions/          # Edge Functions
    plan-stub/        # Plan generation function
  migrations/         # Database migrations
    *_create_core_tables.sql
    *_consume_request_and_insert_plan.sql
    *_add_rls_policies.sql
__tests__/            # Unit tests
.github/workflows/    # CI configuration
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

2. Create `.env` file with Supabase credentials:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Open the app in Expo Go or a simulator/emulator

## Testing

Run the unit tests:

```bash
npm test
```

## Deployment

The app uses Supabase Edge Functions for backend logic. To deploy:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref <project-ref>`
3. Deploy functions: `supabase functions deploy plan-stub`

See `project_docs.txt` for detailed deployment instructions (not committed to repo).

## Development Status

- Sprint 1: In Progress (Core foundation and infrastructure)
- Sprint 2: Not Started (Core value and monetization)
- Sprint 3: Not Started (Polish and store preparation)

## License

Proprietary - All Rights Reserved
