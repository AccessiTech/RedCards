# Red Cards

This is a digital version of the "Red Cards" created by [the Immigration Legal Resource Center](https://www.ilrc.org/red-cards).

## 📱 About

Red Cards are informational cards that help individuals exercise their constitutional rights during immigration enforcement encounters. This Progressive Web App (PWA) provides:

- Digital version of the physical red cards
- Constitutional rights information in English and Spanish
- California Rapid Response Network contact information
- Downloadable resources in 16 languages
- Offline functionality for emergency situations
- Easy sharing via QR code or web share

## 🏗️ Architecture

### Configuration System

The application uses a centralized configuration system located in `src/config/`:

#### **`src/config/constants.js`**
Single source of truth for all application constants:
- **Theme Colors**: Brand colors used consistently across SCSS, PWA manifest, and components
- **URLs**: External links (ILRC, Informed Immigrant, GitHub) and internal URLs
- **App Metadata**: Name, version, description, copyright information
- **PWA Settings**: Display mode, start URL, scope
- **Analytics**: Google Analytics configuration (placeholder)

```javascript
import { theme, urls, app, pwa, analytics } from './config';
```

#### **`src/config/regions.json`**
California Rapid Response Network data:
- 19 rapid response networks across California
- Phone numbers, coverage areas, and website URLs
- Organized by region (Northern, Central, Southern California)
- Runtime validated for data integrity

```javascript
import { regions, getSacramentoPhoneNumber, getNetworkById } from './config';
```

#### **`src/config/resources.json`**
Digital and printable resource links:
- Know Your Rights materials
- Red Cards PDFs in 16 languages
- Printable flyers and QR codes
- ILRC and Informed Immigrant resources

```javascript
import { getDigitalResources, getPrintableResources } from './config';
```

#### **`src/config/index.js`**
Central export point providing:
- All configuration data
- Helper functions for backward compatibility
- Single import location for components

#### **`src/config/validators.js`**
Runtime validation for configuration data:
- Phone number format validation
- URL validation
- Network data completeness checks
- Development warnings and production errors

### Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: SCSS + React Bootstrap
- **Routing**: React Router v7
- **PWA**: vite-plugin-pwa + Workbox
- **Testing**: Vitest + Testing Library
- **State Management**: URL params + localStorage (Redux removed)

### Key Features

1. **Progressive Web App**: Installable, offline-capable, fullscreen mode
2. **Responsive Design**: Mobile-first, works on all device sizes
3. **Offline Support**: Service worker caches resources for offline access
4. **Multilingual Resources**: 16 language PDFs available
5. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
6. **Share Functionality**: Web Share API with fallback to clipboard

## 🚀 Development

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm test           # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Deploy

```bash
npm run deploy     # Build and deploy to GitHub Pages
```

## 📂 Project Structure

```
src/
├── config/                 # Centralized configuration
│   ├── constants.js       # Theme, URLs, app metadata
│   ├── regions.json       # Rapid response networks
│   ├── resources.json     # Digital/printable resources
│   ├── validators.js      # Config validation
│   └── index.js           # Central export point
├── Components/            # React components
│   ├── ErrorBoundary/    # Error handling
│   ├── Footer/           # Footer with links
│   ├── Header/           # Header with navigation
│   ├── Resources/        # Resources section
│   ├── Rights/           # Rights information
│   ├── Share/            # Share functionality
│   ├── Translate/        # Google Translate widget
│   └── UpdatePrompt/     # PWA update notification
├── App/                   # Main App component
├── Root/                  # Root component with router
├── utils/                 # Utility functions
│   ├── cache.js          # PWA caching utilities
│   ├── network.js        # Network utilities
│   └── storage.js        # localStorage utilities
└── scss/                  # Global styles
```

## 🧪 Testing

The project maintains 239 tests covering:
- Component rendering and interaction
- Configuration validation
- Utility functions
- PWA functionality
- Error boundaries
- Accessibility

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Immigration Legal Resource Center (ILRC)](https://www.ilrc.org) - Original Red Cards creators
- [Informed Immigrant](https://www.informedimmigrant.com) - Know Your Rights resources
- California Rapid Response Network organizations

## 🤝 Contributing

1. Report issues: [GitHub Issues](https://github.com/AccessiTech/RedCards/issues/new?template=Blank+issue)
2. Join discussion: [GitHub Discussions](https://github.com/AccessiTech/RedCards/discussions/2)
3. View source: [GitHub Repository](https://github.com/AccessiTech/RedCards)

---

© 2026 AccessiTech LLC
