# MuhsinAI ✨

<div align="center">
  <img src="./assets/images/nobg.png" alt="MuhsinAI Logo" width="200" />
</div>

AI daily planner for students and young professionals with built-in prayer times, templates, and Pro tier subscription.

## Overview

MuhsinAI helps users quickly generate structured daily plans that respect prayer times and personal schedules through natural language commands. The app offers 3 free plans before requiring a subscription to the Pro tier.

### Features

- **Natural Language Planning**: Type what you want to do and get a structured, editable daily plan
- **Prayer Times Integration**: Automatically includes prayer times based on location
- **Polished UI with Animations**: Smooth, consistent animations throughout the app
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
    animations/       # Animation system for consistent UI animations
    components/       # Reusable UI components
    store.ts          # Zustand store with AsyncStorage persistence
    api.ts            # API wrapper for Edge Functions
  home.tsx            # Home screen
  plan.tsx            # Plan creation screen
  history.tsx         # Plan history screen
  plan-detail.tsx     # Plan detail view
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
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and fill in your Supabase credentials:
   
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   You can find these values in your Supabase dashboard under Project Settings > API.

3. Verify your environment variables:

   ```bash
   npm run check-env
   ```

   This will validate your environment configuration and highlight any issues.

4. Run the app using Expo:

   ```bash
   npm start
   ```
   
   **Important**: Environment variables in Expo are loaded through `app.config.js` and accessed via the `env.ts` utility. If you encounter "Missing SUPABASE_URL" errors, ensure your `.env` file exists and has the correct values.

5. Open the app in Expo Go or a simulator/emulator:
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - Press 'i' to open in iOS simulator
   - Press 'a' to open in Android emulator

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

## Documentation

The project includes comprehensive documentation to aid developers:

- `docs/sprint_2_feature_summary.md` - Summary of Sprint 2 features and implementations
- `docs/animation_system_guide.md` - Detailed guide on using the animation system
- `docs/sprint_2_completion.md` - Sprint 2 completion report and next steps

## Development Status

- Sprint 1: Completed (Core foundation and infrastructure)
- Sprint 2: Completed (UI Enhancements & Animation System)
- Sprint 3: Not Started (Polish and store preparation)

## License

Proprietary - All Rights Reserved
