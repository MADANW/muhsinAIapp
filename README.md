# MuhsinAI ✨

<div align="center">
  <img src="./assets/images/png/logo.png" alt="MuhsinAI Logo" width="200" />
</div>

**AI-Powered Islamic Prayer Plans** - Transform your spiritual practice with personalized, AI-generated Islamic prayer plans that adapt to your daily life.

## 🌟 Vision

MuhsinAI bridges technology and spirituality, helping Muslims worldwide deepen their connection with Allah through structured, personalized prayer plans powered by artificial intelligence.

## 📱 Platform Status

### Mobile App (Sprint 2 - Completed ✅)
- **Status**: Feature-complete, ready for testing
- **Platform**: iOS/Android via Expo
- **Authentication**: Magic link email authentication  
- **Payments**: RevenueCat integration
- **Theme**: Full dark/light mode support
- **Assets**: Optimized PNG asset system

### Web Platform (Current Development 🚀)
- **Status**: In development (Sprint Web)
- **Goal**: Public web version for user acquisition and testing
- **Benefits**: No app store barriers, easier deployment, broader accessibility
- **Timeline**: Current sprint focus

## ✨ Core Features

- **🤖 AI Prayer Plan Generation**: Natural language input creates personalized Islamic prayer schedules
- **⏰ Prayer Time Integration**: Automatically respects prayer times and Islamic calendar
- **📊 Progress Tracking**: Monitor your spiritual journey with detailed analytics
- **🎨 Beautiful UI**: Polished interface with smooth animations and themes
- **💳 Flexible Pricing**: Free tier (3 plans) + Pro subscription for unlimited access
- **🔒 Secure Authentication**: Magic link email authentication via Supabase

## 🛠 Tech Stack

**Frontend**
- **Mobile**: Expo (React Native) with Expo Router
- **Web**: Expo Web with responsive design
- **State**: Zustand with AsyncStorage persistence
- **Styling**: React Native with theme system

**Backend & Services**
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth with magic links
- **AI Integration**: OpenAI GPT via Supabase Edge Functions
- **Payments**: RevenueCat (mobile) / Stripe (web)

**Development & Deployment**
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel/Netlify (web), Expo (mobile)

## 📁 Project Structure

```
app/                     # Main application code (Expo Router)
├── lib/                 # Core libraries and utilities
│   ├── auth/           # Authentication system (Supabase)
│   ├── analytics/      # Event tracking and analytics
│   ├── purchases/      # Payment integration (RevenueCat)
│   ├── assetRegistry.ts # Centralized asset management
│   └── store.ts        # Global state management (Zustand)
├── theme/              # Design system and theming
│   ├── ThemeProvider.tsx # Theme context and provider
│   ├── ImageRegistry.ts  # Image asset registry
│   └── constants.ts     # Colors, typography, spacing
├── auth/               # Authentication screens
│   ├── signin.tsx      # Magic link sign-in
│   └── magic-link-sent.tsx # Confirmation screen
├── home.tsx            # Main dashboard
├── plan.tsx            # Prayer plan creation
├── history.tsx         # Plan history and analytics
├── paywall.tsx         # Subscription management
└── _layout.tsx         # Root layout with providers

assets/
├── images/png/         # Optimized PNG assets
│   ├── logo.png        # Main logo
│   ├── nobg.png        # Transparent background
│   └── inverse.png     # Dark theme variant
└── images/             # Additional images

supabase/               # Backend configuration
├── functions/          # Edge Functions (AI integration)
└── migrations/         # Database schema

docs/                   # Comprehensive documentation
└── [various guides and sprint reports]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Git for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MADANW/muhsinAIapp.git
   cd muhsinAIapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```bash
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # RevenueCat (Mobile Payments)
   REVENUECAT_TEST_KEY=test_your-test-key
   # Production keys (add when deploying)
   # REVENUECAT_APPLE_API_KEY=appl_your-apple-key
   # REVENUECAT_GOOGLE_API_KEY=goog_your-google-key
   ```

4. **Verify configuration:**
   ```bash
   npm run check-env  # Validates environment setup
   ```

### Development

**Mobile Development:**
```bash
npm start           # Start Expo development server
# Then scan QR code or press 'i' for iOS, 'a' for Android
```

**Web Development:**
```bash
npm run web         # Start web development server
# Opens at http://localhost:8081
```

**Testing:**
```bash
npm test           # Run unit tests
npm run test:watch # Run tests in watch mode
```

## 🌐 Web Deployment

The web version is optimized for production deployment:

1. **Build for production:**
   ```bash
   npm run build:web
   ```

2. **Deploy to Vercel/Netlify:**
   ```bash
   # Vercel
   vercel --prod
   
   # Netlify
   netlify deploy --prod --dir=dist
   ```

3. **Configure domain and SSL** through your hosting provider

## 📱 Mobile Deployment

**Development builds:**
```bash
npx expo build:ios     # iOS build
npx expo build:android # Android build
```

**Production:** Configure app store accounts and follow Expo's deployment guides.

## 📋 Development Status & Roadmap

### ✅ Sprint 2 (Mobile Foundation) - Completed
- **Authentication**: Magic link email authentication
- **UI/UX**: Dark/light theme system with smooth animations  
- **Assets**: Converted to optimized PNG asset system
- **Payments**: RevenueCat integration with test keys
- **Performance**: Fixed asset loading and bundle optimization
- **Code Quality**: Removed hardcoded values, improved TypeScript types

### 🚀 Sprint Web (Current) - In Progress
**Goal**: Launch public web version for user acquisition

**Phase 1: Web Adaptation**
- [ ] Configure responsive design for desktop/tablet
- [ ] Adapt authentication for web URLs
- [ ] Implement web-compatible payment system
- [ ] Optimize performance and SEO

**Phase 2: Production Ready**
- [ ] Set up hosting and domain
- [ ] Create landing page with demos
- [ ] Analytics and conversion tracking
- [ ] User testing and feedback integration

### 🔮 Future Sprints
- **Sprint 3**: Mobile App Store submission (when resources allow)
- **Sprint 4**: Advanced features (custom templates, sharing, etc.)
- **Sprint 5**: Internationalization and accessibility

## 🧪 Testing Strategy

**Automated Testing:**
- Unit tests for core logic and utilities
- Integration tests for authentication flows
- Component testing for UI interactions

**Manual Testing:**
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Payment flow validation
- Performance testing on various devices

## 📊 Analytics & Monitoring

**Key Metrics:**
- User conversion rates (free → pro)
- Prayer plan completion rates
- Feature usage analytics
- Performance monitoring

**Tools:**
- Supabase Analytics for backend metrics
- Custom event tracking for user behavior
- Error monitoring and crash reporting

## 🤝 Contributing

This is a proprietary project. For development team members:

1. Create feature branches from `main`
2. Follow the established code style and TypeScript patterns
3. Add tests for new features
4. Update documentation for significant changes
5. Request code review before merging

## 📝 Documentation

**For Developers:**
- `docs/` - Comprehensive guides and sprint reports
- Inline code documentation for complex logic
- API documentation for backend functions

**For Users:**
- In-app onboarding and help system
- Web landing page with feature explanations
- Prayer plan templates and examples

## 📄 License

**Proprietary Software** - All Rights Reserved

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

---

<div align="center">

**Built with ❤️ for the Muslim community**

[Website](https://muhsinai.com) • [Support](mailto:support@muhsinai.com) • [Privacy](https://muhsinai.com/privacy)

</div>
