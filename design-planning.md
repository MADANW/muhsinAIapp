# UI Design Planning for Sprint 2

## Design System

### Color Palette
- Primary: #007BFF (Blue)
- Secondary: #6C757D (Gray)
- Accent: #17A2B8 (Teal)
- Success: #28A745 (Green)
- Warning: #FFC107 (Yellow)
- Danger: #DC3545 (Red)
- Light: #F8F9FA (Off-white)
- Dark: #343A40 (Dark gray)

### Typography
- Heading Font: SF Pro Display / Roboto (Platform specific)
- Body Font: SF Pro Text / Roboto (Platform specific)
- Font Sizes:
  - Heading 1: 28px
  - Heading 2: 24px
  - Heading 3: 20px
  - Body: 16px
  - Caption: 14px

### Components
1. **Buttons**
   - Primary: Filled blue with white text
   - Secondary: Outlined with colored text
   - Text: No background, just colored text
   - Icon: Circle or square with icon

2. **Cards**
   - Plan Card: Shows plan summary with actions
   - Profile Card: Shows user info and stats
   - Prayer Time Card: Shows prayer times for today

3. **Inputs**
   - Text Input: Outlined or underlined
   - Selection Controls: Checkboxes, Radio buttons, Switches
   - Prompt Input: Large area for plan generation prompt

4. **Navigation**
   - Tab Bar: Bottom navigation with icons and labels
   - Header: App title and actions
   - Back Button: Standard platform back button

## Screen Designs

### Authentication Screens
1. **Sign In**
   - Email input for magic link
   - Social sign-in buttons (Google, Apple)
   - Clear call-to-action
   - Branding elements

2. **Magic Link Sent**
   - Confirmation message
   - Animation or illustration
   - Option to resend or use different email

### Main Flow Screens
1. **Home**
   - Welcome message with user's name
   - Quick action button to create plan
   - Recent plans preview
   - Prayer times card

2. **Plan Creation**
   - Prompt input field
   - Template suggestions
   - Clear submission button
   - Loading state design

3. **Plan Viewing**
   - Formatted plan with sections
   - Action buttons (Save, Edit, Share)
   - Prayer times integrated in schedule

4. **Plan History**
   - List view of saved plans
   - Search and filter options
   - Card design for plan previews

### Monetization Screens
1. **Paywall**
   - Feature comparison table
   - Subscription options with pricing
   - Clear benefits visualization
   - Call-to-action button

2. **Profile & Settings**
   - User info and picture
   - Subscription status
   - Usage statistics
   - Settings options

## Animation & Interaction
- Subtle transitions between screens
- Loading animations for plan generation
- Haptic feedback for important actions
- Pull-to-refresh for content updates

## Accessibility Considerations
- Support for dynamic text sizes
- Color contrast compliance
- VoiceOver/TalkBack support
- Alternative text for images

## Branding Elements
- App icon with prayer/planning theme
- Splash screen design
- Consistent use of logo throughout app
- Custom illustrations for empty states