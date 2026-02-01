# RedCards WebApp - Improvement Workplan

**Version:** 1.0  
**Created:** January 31, 2026  
**Goal:** Transform RedCards into a production-grade, offline-first PWA with robust architecture, scalability, and Capacitor-ready mobile app foundation

---

## Overview

### Primary Objectives
1. 🎯 **Offline-First Architecture** - Complete functionality without internet connection
2. 🎯 **Restored State Management** - Redux persistence for shareable states and data caching
3. 🎯 **Professional Internationalization** - Proper i18n with JSON translations (Google Translate as supplement)
4. 🎯 **Centralized Configuration** - Scalable content management in JSON files
5. 🎯 **Production Reliability** - Error boundaries, accessibility, proper error handling
6. 🎯 **Capacitor-Ready** - Architecture compatible with future native mobile apps

### Technical Constraints
- Serverless static hosting (GitHub Pages)
- No backend/database
- Maintain current deployment workflow
- Preserve existing functionality

---

## Git Workflow & Branch Management

**For Copilot Agents and Contributors**

This section outlines the git workflow for implementing workplan tasks. Follow these conventions to maintain clean history and enable safe parallel development.

### Branch Naming Convention

Use descriptive branch names following this pattern:
```
<type>/<phase>-<short-description>
```

**Types:**
- `feature/` - New functionality
- `fix/` - Bug fixes
- `refactor/` - Code restructuring without behavior change
- `docs/` - Documentation only
- `test/` - Test additions/modifications
- `chore/` - Build, config, or tooling changes

**Examples:**
```bash
feature/phase1-restore-redux
fix/phase1-proptypes-bugs
refactor/phase3-centralize-config
docs/phase5-architecture-diagram
test/phase5-integration-tests
chore/phase2-vite-pwa-setup
```

---

### Starting Work on a Phase/Task

**1. Always start from latest main:**
```bash
# Ensure you're on main and have latest changes
git checkout main
git pull origin main
```

**2. Create a feature branch for the specific task:**
```bash
# For Phase 1.1 (PropTypes fixes)
git checkout -b fix/phase1-proptypes-bugs

# For Phase 1.2 (Redux restoration)
git checkout -b feature/phase1-restore-redux

# For Phase 3.4 (Config centralization)
git checkout -b refactor/phase3-centralize-config
```

**3. Make small, focused commits as you work:**
```bash
# Stage specific files
git add src/Components/Resources/ResourceBtn.jsx
git commit -m "fix: correct PropType typo in ResourceBtn"

git add src/Components/Share/ShareButton.jsx
git commit -m "fix: correct Proptypes typo in ShareButton"

git add src/Components/Translate/Translate.jsx
git commit -m "feat: add missing PropTypes to Translate component"
```

**4. Push your branch and CREATE A PULL REQUEST (never merge directly to main):**
```bash
# Push your feature branch to remote
git push origin fix/phase1-proptypes-bugs

# Create PR via GitHub web interface or CLI
gh pr create \
  --title "Phase 1.1: Fix PropTypes Typos" \
  --body "Fixes PropTypes typos in ResourceBtn and ShareButton components"

# ❌ NEVER DO THIS - Direct merge to main
# git checkout main
# git merge fix/phase1-proptypes-bugs  # WRONG!
# git push origin main                 # WRONG!

# ✅ CORRECT - Create PR and merge through GitHub
# This allows for code review, CI checks, and maintains clean history
```

**⚠️ LESSON LEARNED (February 1, 2026):**
During Phase 1.5 implementation, work was accidentally merged directly to main instead of creating a PR. This violated the documented workflow and required:
- Creating a backup branch from the merge commit
- Force-pushing main back to the previous state
- Creating a proper PR from the feature branch

**Always remember:** Work goes from `feature branch` → `PR` → `main`, never directly from branch to main.

---

### Commit Message Standards

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format:**
```
<type>(<scope>): <short description>

[optional body explaining what and why]

[optional footer with references]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code change that neither fixes bug nor adds feature
- `docs` - Documentation changes
- `test` - Adding or updating tests
- `chore` - Build process, tooling, dependencies
- `style` - Formatting, missing semicolons (not CSS)
- `perf` - Performance improvements

**Examples:**
```bash
# Simple fix
git commit -m "fix: correct PropTypes typo in ResourceBtn component"

# Feature with scope
git commit -m "feat(redux): restore Redux Toolkit with persistence"

# With body explanation
git commit -m "feat(i18n): add react-i18next configuration

- Configure language detection: URL → localStorage → browser
- Setup namespaces: common, rights, resources, footer
- Add loading skeleton for translation load

Relates to Phase 3.1"

# Breaking change
git commit -m "refactor(config)!: move phone numbers to JSON config

BREAKING CHANGE: Rights/content.jsx no longer exports phone data.
Import from src/config/regions.json instead.

Migration: Update imports from './content' to '../../config/regions.json'
Closes #42"
```

---

### Working Across Multiple Sessions

**Save progress frequently:**
```bash
# Commit work-in-progress (WIP) if needed
git add .
git commit -m "wip: partial implementation of Redux store setup"

# Push to remote to backup work
git push origin feature/phase1-restore-redux
```

**Resume work:**
```bash
# Pull any updates to your branch
git checkout feature/phase1-restore-redux
git pull origin feature/phase1-restore-redux

# If you committed WIP, you can amend or continue
git commit --amend -m "feat(redux): complete Redux store configuration"
```

**Clean up WIP commits before PR:**
```bash
# Interactive rebase to squash/reword commits
git rebase -i main

# Or reset and recommit cleanly
git reset --soft main
git add -A
git commit -m "feat(redux): restore Redux Toolkit with persistence"
```

---

### Syncing with Main Branch

**Before creating a PR, sync with latest main:**
```bash
# While on your feature branch
git fetch origin main
git rebase origin/main

# Or use merge if you prefer (though rebase keeps cleaner history)
git merge origin/main

# Push updated branch (force-push if rebased)
git push origin feature/phase1-restore-redux --force-with-lease
```

**Note:** `--force-with-lease` is safer than `--force` as it prevents overwriting others' work.

---

### Handling Merge Conflicts

**If conflicts occur during rebase/merge:**
```bash
# Git will mark conflicted files
git status

# Open conflicted files, resolve conflicts manually
# Look for <<<<<<< ======= >>>>>>> markers

# After resolving, stage the files
git add <resolved-files>

# Continue the rebase
git rebase --continue

# Or if merging
git commit

# If you need to abort and start over
git rebase --abort
# or
git merge --abort
```

---

### Creating Pull Requests

**1. Ensure branch is ready:**
```bash
# Run tests
npm test

# Run linter
npm run lint

# Build to verify no errors
npm run build

# Check git status
git status  # Should be clean
```

**2. Push branch to remote:**
```bash
git push origin feature/phase1-restore-redux
```

**3. Create PR via GitHub CLI or web interface:**
```bash
# Using GitHub CLI (if installed)
gh pr create \
  --title "Phase 1.2: Restore Redux Toolkit with Persistence" \
  --body "Implements Phase 1.2 of workplan

**Changes:**
- Uncommented Redux Provider in index.jsx
- Created store.js with redux-persist configuration
- Added userSlice, resourcesSlice, translationSlice
- Configured Redux DevTools for development
- Added tests for state persistence

**Testing:**
- [x] State persists across browser sessions
- [x] Shareable URLs work with Redux state
- [x] All existing tests pass
- [x] New tests for Redux slices pass

Closes #42
Part of #1 (Phase 1 tracking issue)"
```

**PR Checklist:**
- [ ] Branch is up-to-date with main
- [ ] All tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors/warnings
- [ ] Commits follow conventional commits format
- [ ] PR description explains changes clearly
- [ ] Related issue numbers referenced

---

### Branch Management Strategy

**For Large Phases (Phase 2, 3):**

Create a parent branch for the phase, then sub-branches for individual tasks:

```bash
# Create phase branch from main
git checkout -b feature/phase2-offline-architecture main

# Push phase branch
git push origin feature/phase2-offline-architecture

# Create sub-task branches from phase branch
git checkout -b feature/phase2.1-vite-pwa-plugin feature/phase2-offline-architecture
# Work on Phase 2.1...
# Push and create PR to merge into phase2-offline-architecture

git checkout feature/phase2-offline-architecture
git checkout -b feature/phase2.2-offline-caching feature/phase2-offline-architecture
# Work on Phase 2.2...
# Push and create PR to merge into phase2-offline-architecture

# Once all Phase 2 tasks complete, create PR to merge phase branch to main
```

**For Small Tasks (Phase 1 fixes):**

Create direct feature branches from main:
```bash
git checkout -b fix/phase1-proptypes-bugs main
# Work, commit, push
# Create PR directly to main
```

---

### Protecting Main Branch

**Never commit directly to main:**
```bash
# ❌ WRONG
git checkout main
git add .
git commit -m "changes"
git push origin main

# ✅ CORRECT
git checkout -b feature/my-feature main
git add .
git commit -m "feat: description"
git push origin feature/my-feature
# Create PR via GitHub
```

**All changes must go through pull requests with:**
- Code review (if team > 1 person)
- Passing CI checks (tests, linting)
- Up-to-date with main branch

---

### Post-Merge Cleanup

**After PR is merged, delete the branch:**
```bash
# Delete local branch
git checkout main
git pull origin main
git branch -d feature/phase1-restore-redux

# Delete remote branch (usually done automatically by GitHub)
git push origin --delete feature/phase1-restore-redux

# Or use GitHub CLI
gh pr close <PR-number> --delete-branch
```

---

### Emergency Hotfixes

**For critical production bugs:**
```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-service-worker-bug main

# Fix the issue with focused commits
git commit -m "fix: prevent service worker from breaking app on iOS"

# Push and create PR with "urgent" label
git push origin hotfix/critical-service-worker-bug

# After merge, ensure fix is in all active feature branches
git checkout feature/phase2-offline-architecture
git merge main  # Incorporate the hotfix
```

---

### Useful Git Commands Reference

```bash
# View branch history
git log --oneline --graph --decorate --all

# View current branch status
git status -sb

# See what changed
git diff
git diff --staged

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git restore <file>
git restore .

# Stash changes temporarily
git stash
git stash pop

# List all branches
git branch -a

# Switch branches
git checkout <branch-name>
git switch <branch-name>  # Newer syntax

# Rename current branch
git branch -m new-name

# View commit history for a file
git log --follow -- <filepath>

# Cherry-pick specific commit to current branch
git cherry-pick <commit-hash>

# Show what will be pushed
git diff origin/main..HEAD
```

---

### Git Configuration Recommendations

**Set up helpful aliases:**
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.unstage "restore --staged"

# Use these shortcuts
git st      # instead of git status
git co main # instead of git checkout main
git lg      # pretty log graph
```

**Configure commit signing (optional but recommended):**
```bash
# Setup GPG key signing for verified commits
git config --global commit.gpgsign true
git config --global user.signingkey <your-gpg-key-id>
```

---

## Phase 0: Security & Dependency Updates (Priority: URGENT)

**Goal:** Address critical security vulnerabilities before major refactoring

### 0.1 Dependency Security Audit
**Files:** `package.json`, `package-lock.json`

**Status:** ⚠️ **Identified January 31, 2026** - GitHub Dependabot found 11 vulnerabilities:
- 2 critical
- 1 high
- 7 moderate
- 1 low

**Tasks:**
- [ ] Run `npm audit` to identify vulnerable packages
- [ ] Run `npm audit fix` for automatic patches
- [ ] Review breaking changes from major version updates
- [ ] Manually update packages requiring major version bumps
- [ ] Test application after updates (`npm test`, `npm run build`)
- [ ] Verify no regressions in functionality
- [ ] Document any breaking changes or migration notes
- [ ] Commit updates separately from feature work

**Outcome:** All dependencies patched, no critical/high vulnerabilities

**Dependencies:** None - should be completed before Phase 1

**Note:** Scheduled for separate branch/PR to avoid mixing security fixes with feature work.

---

## Phase 1: Foundation & Critical Fixes (Priority: HIGH)

**Goal:** Fix critical bugs, establish error handling infrastructure

### 1.1 Fix PropTypes Bugs ✅ COMPLETED
**Files:** `src/Components/Resources/ResourceBtn.jsx`, `src/Components/Share/ShareButton.jsx`
- [x] Fix `PropType` → `PropTypes` typo in ResourceBtn.jsx (line 34)
- [x] Fix `Proptypes` → `PropTypes` typo in ShareButton.jsx (line 5)
- [x] Add missing PropTypes to `Translate.jsx` (already correct)
- [x] Run ESLint validation after fixes

**Outcome:** ✅ No PropTypes warnings in console
**PR:** #15 (merged)

---

### 1.2 ~~Restore Redux Toolkit with Persistence~~ REMOVED

**Decision:** Redux removed from architecture. Reasons:
- Current URL-based state management is sufficient for shareable states
- localStorage can be used directly for simple persistence needs
- Reduces complexity and bundle size
- React Context can handle any future state needs
- Capacitor has native storage plugins when needed

**Alternative Approach:**
- Use React Context for app-level state (Phase 3)
- Use localStorage directly for persistence (Phase 2)
- Keep URL params for shareable states (current)
- Defer state management complexity until proven necessary

---

### 1.3 Implement Error Boundaries ✅ COMPLETED
**Files:** Create `src/Components/ErrorBoundary/`, `src/App/App.jsx`

**Tasks:**
- [x] Create `ErrorBoundary.jsx` component with fallback UI
- [x] Add error logging (console + optional analytics)
- [x] Wrap `<App />` in ErrorBoundary in `index.jsx`
- [x] Add nested boundaries for critical sections (Header, Rights, Resources, Share, Footer)
- [x] Create user-friendly error messages (dev/prod modes)
- [x] Add "Report Issue" button linking to GitHub Issues
- [x] Add "Reload Page" and "Go Home" recovery actions
- [x] Add comprehensive tests (24 ErrorBoundary + 5 integration tests)
- [x] Test error handling, user actions, accessibility, nested boundaries

**Outcome:** ✅ App doesn't crash on errors; users see helpful recovery UI with isolated error boundaries
**PR:** #16 (merged)
**Branch:** `feature/phase1.3-error-boundaries`
**Commits:** 4 commits (component, root wrapper, nested boundaries, comprehensive tests)
**Tests:** 55 passing (29 new tests added)

**Dependencies:** None

---

### 1.4 Add Error Handling for Web APIs ✅ COMPLETED
**Files:** `src/Components/Share/Share.jsx`, `src/Components/Header/Header.jsx`, `src/utils.js`

**Tasks:**
- [x] Add try-catch to Clipboard API usage with fallback
- [x] Add feature detection for `navigator.share` and `navigator.clipboard`
- [x] Add loading/success/error states to Share component
- [x] Add error handling to Header Share button with user feedback
- [x] Handle AbortError (user cancellation) gracefully
- [x] Handle NotAllowedError (permission denied) with helpful messages
- [x] Refactor shareHandler to async/await with proper error handling
- [x] Add onSuccess and onError callbacks to shareHandler
- [x] Add visual feedback for share status (loading, success, error)
- [x] Add accessibility features (aria-live, role="alert")
- [x] Create comprehensive tests for all error scenarios (16 new tests)
- [x] Test feature detection, user actions, permissions, generic errors

**Outcome:** ✅ Share/clipboard features never silently fail; users get helpful error messages and visual feedback
**PR:** #20 (merged)
**Branch:** `feature/phase1.4-web-api-error-handling`
**Tests:** 71 passing (16 new tests added for error handling)

**Dependencies:** None

---

### 1.5 Establish Test Coverage Baseline ✅ COMPLETED
**Files:** All component test files, `vitest.config.js`
**Status:** ✅ **Completed February 1, 2026** - Exceeded all coverage targets
**Branch:** `test/phase1.5-test-coverage`

**Final Coverage (February 1, 2026):**
- **Overall:** 99.59% statements, 97.43% branches, 100% functions, 99.59% lines
- **All components 100% coverage:** `utils.js`, `App.jsx`, `ErrorBoundary.jsx`, `Footer.jsx`, `Header.jsx`, `Share.jsx`, `ShareButton.jsx`, `ResourceBtn.jsx`, `ResourceModal.jsx`, `Resources.jsx`, `Rights.jsx`, `Translate.jsx`
- **Remaining uncovered:**
  - `Header.jsx`: Lines 98-101 (8% branches - edge cases in PWA install prompt)
  - `Rights/content.jsx`: Lines 210-211 (66.67% branches - ternary in content data)

**Completed Tasks:**
- [x] Added 18 tests for `Header.jsx`: 43.24% → 96.39% branches
  - [x] Test scan/save/share buttons with proper mocking
  - [x] Test PWA install flow and matchMedia
  - [x] Test shareHandler integration
- [x] Created 9 tests for `ShareButton.jsx`: 41.66% → 100%
  - [x] Test button rendering and props
  - [x] Test shareHandler integration
  - [x] Test click behavior and preventDefault
- [x] Added 6 tests for `ResourceBtn.jsx`: 67.74% → 100%
  - [x] Test modal navigation logic
  - [x] Test useNavigate mocking
  - [x] Test links vs direct navigation
- [x] Created 13 tests for `ResourceModal.jsx`: 12.5% → 100% branches
  - [x] Test all conditional branches (show/hide, links, descriptions)
  - [x] Test component rendering variations
- [x] Added 9 tests for `Resources.jsx`: 25% → 100% branches
  - [x] Test hideDigitals and hidePrintables props
  - [x] Test modal display for digital and printable resources
  - [x] Test useEffect branches with route param changes
  - [x] Test invalid resource IDs and empty routes
- [x] Added 8 tests for `Rights.jsx`: 44.44% → 100% branches
  - [x] Test language tab switching
  - [x] Test modal display based on route params
  - [x] Test useEffect branches with route changes
- [x] Added 3 tests for `ErrorBoundary.jsx`: 76.47% → 100% branches
  - [x] Test missing error.message fallback
  - [x] Test missing error.stack fallback
  - [x] Test missing errorInfo.componentStack fallback
- [x] Configured coverage thresholds in `vitest.config.js`:
  - [x] Set minimum 85% for statements, branches, functions, lines
  - [x] Coverage check prevents regressions
- [ ] Add coverage badge to README.md (deferred to Phase 5)
- [ ] Document testing standards in CONTRIBUTING.md (deferred to Phase 5)

**Test Count:** 155 tests total (91 → 155, added 64 new tests)

**Achieved Coverage vs Target:**
- **Statements:** 99.59% (target ≥85%) ✅ **+14.59%**
- **Branches:** 97.43% (target ≥85%) ✅ **+12.43%**
- **Functions:** 100% (target ≥85%) ✅ **+15%**
- **Lines:** 99.59% (target ≥85%) ✅ **+14.59%**

**Outcome:** ✅ Professional test coverage established with thresholds preventing regression. All targets exceeded significantly.

**PR:** #26 (merged)

**Dependencies:** Phase 1.4 (completed)

---

## Phase 2: Offline-First Architecture (Priority: HIGH)

**Goal:** Enable complete offline functionality with service worker caching

### 2.1 Install and Configure Vite PWA Plugin ✅ COMPLETED
**Files:** `vite.config.js`, `package.json`, `public/offline.html`, `src/index.jsx`

**Tasks:**
- [x] Install `vite-plugin-pwa`, `workbox-build`, and `workbox-window` packages
- [x] Configure Vite plugin in `vite.config.js`:
  - Strategies: CacheFirst for assets, NetworkFirst for HTML
  - Runtime caching for external resources (fonts, Google APIs)
  - Precache all build artifacts
- [x] Generate service worker with workbox
- [x] Add offline fallback page (`offline.html`)
- [x] Configure manifest.json with proper icons and display mode
- [x] Test service worker registration and updates
- [x] Add PWA tests (10 tests covering cache strategies, offline support)
- [x] Register service worker in index.jsx with update handlers

**Outcome:** ✅ All static assets cached on first visit. Service worker enabled in dev and production. Update prompt ready for Phase 2.3.

**PR:** Ready for creation (branch: `feature/phase2.1-vite-pwa-plugin`)
**Tests:** 164 passing (10 new PWA tests added)
**Commit:** 4d360fe

**Dependencies:** None

---

### 2.2 Implement Offline Resource Caching
**Files:** `src/utils/storage.js`, service worker config

**Tasks:**
- [ ] Create localStorage utility wrapper for simple persistence
- [ ] Cache phone numbers and resource URLs on first load
- [ ] Add service worker cache for external PDFs/resources
- [ ] Implement cache versioning strategy
- [ ] Add "Download for Offline" button to trigger full cache
- [ ] Show offline indicator in UI when network unavailable
- [ ] Test complete offline functionality (airplane mode)
- [ ] Verify phone `tel:` links work offline

**Outcome:** App fully functional without internet after first load

**Dependencies:** Phase 2.1 (Service Worker)

---

### 2.3 Implement Update Strategy
**Files:** `src/Components/UpdatePrompt/`, service worker

**Tasks:**
- [ ] Create `UpdatePrompt.jsx` component for "New version available"
- [ ] Implement service worker skip-waiting on user acceptance
- [ ] Add force-update option for emergency changes
- [ ] Show changelog/update notes (from GitHub releases?)
- [ ] Test update flow: new version detection → prompt → reload → verify
- [ ] Add analytics for update acceptance rate

**Outcome:** Users notified of updates; can refresh to get latest

**Dependencies:** Phase 2.1 (Service Worker)

---

## Phase 3: Internationalization & Content Management (Priority: MEDIUM)

**Goal:** Professional translations, centralized config, scalable content management

### 3.1 Setup react-i18next
**Files:** `src/i18n/`, `package.json`, `src/index.jsx`

**Tasks:**
- [ ] Install `react-i18next`, `i18next`, `i18next-browser-languagedetector`
- [ ] Create `src/i18n/config.js` with i18next configuration
- [ ] Initialize i18next in `index.jsx`
- [ ] Configure language detection (URL → localStorage → browser → default)
- [ ] Setup namespace structure: `common`, `rights`, `resources`, `footer`
- [ ] Create loading skeleton for translation load

**Outcome:** i18n infrastructure ready for translation files

**Dependencies:** None

---

### 3.2 Create Translation JSON Files
**Files:** Create `public/locales/{lang}/`, extract strings from components

**Tasks:**
- [ ] Audit all user-facing strings in components
- [ ] Create folder structure: `public/locales/en/`, `es/`, `zh-CN/`, `zh-TW/`
- [ ] Extract strings from `Rights.jsx` → `rights.json`
- [ ] Extract strings from `Resources.jsx` → `resources.json`
- [ ] Extract strings from `Header.jsx`, `Footer.jsx` → `common.json`
- [ ] Start with English (source), Spanish (priority), Chinese (Simplified + Traditional)
- [ ] Use LibreTranslate API or DeepL API for initial machine translations
- [ ] Document translation workflow for future languages

**Initial Languages:**
- ✅ English (en) - complete
- ⏳ Spanish (es) - machine translate + manual review
- ⏳ Chinese Simplified (zh-CN) - machine translate + manual review
- ⏳ Chinese Traditional (zh-TW) - machine translate + manual review
- 📋 Remaining 12 languages - Phase 4

**Outcome:** Core app UI translated into 4 languages

**Dependencies:** Phase 3.1 (i18next setup)

---

### 3.3 Integrate i18n into Components
**Files:** All component files, especially `Rights.jsx`, `Resources.jsx`, `Header.jsx`

**Tasks:**
- [ ] Replace hardcoded strings with `useTranslation()` hook
- [ ] Update `Rights.jsx` to use i18n for instructions and messages
- [ ] Update `Resources.jsx` to use i18n for button labels
- [ ] Update `Header.jsx` to use i18n for action buttons
- [ ] Add language switcher component (dropdown or flags)
- [ ] Keep Google Translate widget as supplementary feature
- [ ] Test language switching updates all text
- [ ] Persist language selection in localStorage

**Outcome:** App UI fully translatable without Google Translate dependency

**Dependencies:** Phase 3.2 (Translation files)

---

### 3.4 Centralize Configuration Data
**Files:** Create `src/config/`, refactor `content.jsx`, `content.js`

**Tasks:**
- [ ] Create `src/config/regions.json` for Rapid Response Network data
  - Schema: `{ id, name, displayName, phoneNumber, coverage, url? }`
  - Extract all 18+ phone numbers from `Rights/content.jsx`
- [ ] Create `src/config/resources.json` for resource links
  - Schema: `{ id, category, titleKey, descriptionKey, url, type }`
  - Extract from `Resources/content.js`
- [ ] Create `src/config/constants.js` for app constants
  - Theme colors, GA ID, external URLs
- [ ] Create `src/config/schema.js` for JSON validation (Zod or similar)
- [ ] Update components to import from config files
- [ ] Add config validation on app startup
- [ ] Document config file formats in README

**Outcome:** All hardcoded data centralized and validated

**Dependencies:** None (can parallelize with Phase 3.1-3.3)

---

## Phase 4: Accessibility & UX Enhancements (Priority: MEDIUM)

**Goal:** WCAG 2.1 AA compliance, improved usability, better mobile experience

### 4.1 Accessibility Audit & Fixes
**Files:** All components, add `src/utils/a11y.js`

**Tasks:**
- [ ] Add skip-to-content link at top of page
- [ ] Add ARIA labels to icon-only buttons (Share, Scan, Save)
- [ ] Add ARIA labels to language tabs in Rights component
- [ ] Implement focus management for ResourceModal
- [ ] Add focus trap for modal dialogs
- [ ] Add keyboard navigation for all interactive elements
- [ ] Remove decorative emojis from screen reader text (phone buttons)
- [ ] Test with VoiceOver (macOS), NVDA (Windows), TalkBack (Android)
- [ ] Run axe DevTools audit and fix all issues
- [ ] Add focus visible styles (keyboard navigation indicators)

**Outcome:** App fully navigable by keyboard and screen readers

**Dependencies:** None

---

### 4.2 Loading States & UX Polish
**Files:** Create `src/Components/Loading/`, update all async components

**Tasks:**
- [ ] Create Loading spinner component
- [ ] Add loading states to Google Translate initialization
- [ ] Add loading states to QR code generation
- [ ] Add loading states to share/clipboard operations
- [ ] Add success/error toast notifications component
- [ ] Add smooth transitions between states
- [ ] Add skeleton screens for initial load
- [ ] Test on slow 3G network (Chrome DevTools throttling)

**Outcome:** Users always know what's happening; no mystery loading

**Dependencies:** None

---

### 4.3 Enhanced Mobile Experience
**Files:** `src/App/App.scss`, all component SCSS files

**Tasks:**
- [ ] Audit mobile touch targets (min 44x44px)
- [ ] Add haptic feedback for button presses (Capacitor-ready)
- [ ] Optimize font sizes for mobile readability
- [ ] Test safe area insets for notched devices
- [ ] Add pull-to-refresh hint (prepare for Capacitor)
- [ ] Optimize tab layout for small screens
- [ ] Test on iPhone SE (small), iPhone 14 Pro (notch), Android (various)
- [ ] Add landscape mode optimizations

**Outcome:** Excellent mobile experience on all devices

**Dependencies:** None

---

## Phase 5: Testing & Documentation (Priority: MEDIUM)

**Goal:** Comprehensive test coverage, documentation for maintainers and contributors

### 5.1 Expand Test Coverage
**Files:** Create `src/tests/integration/`, `e2e/`, update existing tests

**Tasks:**
- [ ] Add integration tests for localStorage persistence
- [ ] Add integration tests for modal navigation
- [ ] Add integration tests for language switching
- [ ] Install Playwright for E2E tests
- [ ] Create E2E tests for critical user flows:
  - View rights → switch language → share
  - Open resource modal → click external link
  - Install PWA prompt → offline functionality
- [ ] Add tests for service worker caching
- [ ] Mock service worker in Vitest for offline tests
- [ ] Achieve 80%+ code coverage
- [ ] Add CI/CD test pipeline (GitHub Actions)

**Outcome:** Confidence in deployments; catch regressions early

**Dependencies:** All previous phases (testing complete features)

---

### 5.2 Documentation
**Files:** Update `README.md`, create `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`

**Tasks:**
- [ ] Update README with offline functionality docs
- [ ] Document config file formats and editing process
- [ ] Document translation workflow for new languages
- [ ] Create architecture diagram (component + data flow)
- [ ] Document localStorage persistence strategy
- [ ] Document service worker caching strategy
- [ ] Create CONTRIBUTING.md with:
  - Development setup
  - Coding standards
  - Pull request process
  - Testing requirements
- [ ] Document Capacitor migration path
- [ ] Add JSDoc comments to utility functions

**Outcome:** Clear docs for contributors and future mobile app development

**Dependencies:** All previous phases (documenting complete system)

---

## Phase 6: Capacitor Preparation (Priority: LOW - Future)

**Goal:** Ensure codebase ready for seamless Capacitor conversion

### 6.1 Code Compatibility Audit
**Files:** All files using Web APIs

**Tasks:**
- [ ] Audit all `navigator.*` API usage
- [ ] Audit all `window.*` API usage
- [ ] Create abstraction layer for platform-specific APIs
- [ ] Document APIs that need Capacitor plugins:
  - Share API → `@capacitor/share`
  - Clipboard API → `@capacitor/clipboard`
  - `tel:` links (should work as-is)
- [ ] Ensure no hard dependencies on DOM globals
- [ ] Test routing works with `file://` protocol
- [ ] Verify all assets can be bundled (no external dependencies critical)

**Outcome:** Clear understanding of Capacitor migration scope

**Dependencies:** Phases 1-4 (stable codebase first)

---

### 6.2 Create Capacitor Setup Guide
**Files:** Create `docs/CAPACITOR.md`

**Tasks:**
- [ ] Document Capacitor installation steps
- [ ] Document required Capacitor plugins
- [ ] Document iOS-specific considerations (safe area, permissions)
- [ ] Document Android-specific considerations (permissions, back button)
- [ ] Create migration checklist
- [ ] Document app store submission process
- [ ] Estimate effort: 2-3 days for experienced dev

**Outcome:** Future developer can create mobile apps in <1 week

**Dependencies:** Phase 6.1 (compatibility audit complete)

---

## Technical Decisions & Rationale

### Why No Redux?
**Decision Date:** January 31, 2026

After initial implementation, Redux was removed in favor of simpler state management:

**Reasons for Removal:**
- **Simplicity**: Current URL-based routing handles shareable states effectively
- **Bundle Size**: Reduces dependencies and complexity
- **Sufficient Alternatives**: 
  - localStorage for simple persistence
  - React Context for app-wide state (when needed)
  - URL params for shareable/deep-linkable states
- **Maintenance**: Less boilerplate, easier onboarding
- **Capacitor-Ready**: Native storage plugins work directly with localStorage

**When We Might Reconsider:**
- Complex cross-component state synchronization needs
- Real-time collaborative features
- Complex undo/redo requirements
- Time-travel debugging becomes essential

**Current State Management Strategy:**
1. **Local Component State** - useState/useReducer for component-level
2. **URL Parameters** - React Router for shareable states
3. **localStorage** - Direct access for persistence
4. **React Context** - Future app-level state (Phase 3)

### Why react-i18next vs Google Translate Only?
- **Offline support**: Translations work without internet
- **Quality**: Professional translations vs machine translation
- **Performance**: No external script dependency, faster load
- **Accessibility**: Better screen reader support with proper HTML
- **Control**: Update translations without Google API changes
- **Google Translate**: Kept as supplementary feature for dynamic content

### Why JSON Config Files vs CMS?
- **Serverless**: No backend needed, GitHub Pages compatible
- **Git-based**: Changes tracked in version control
- **Type-safe**: Validate with schemas
- **Simple**: Non-technical contributors can edit JSON
- **Future-proof**: Easy to migrate to CMS if needed

### Why Vite PWA Plugin?
- **Battle-tested**: Workbox under the hood
- **Zero-config**: Sensible defaults for Vite projects
- **Flexible**: Customize caching strategies
- **Type-safe**: TypeScript support
- **Active maintenance**: Regular updates

---

## Success Metrics

### Technical Metrics
- [ ] **Offline Score**: 100% functionality offline after first load
- [ ] **Lighthouse PWA Score**: 100/100
- [ ] **Lighthouse Accessibility**: 100/100
- [ ] **Test Coverage**: >80%
- [ ] **Bundle Size**: <500KB (currently ~300KB)
- [ ] **First Load Time**: <2s on 3G

### User Metrics
- [ ] **Install Rate**: Track PWA install prompt acceptance
- [ ] **Offline Usage**: Track service worker cache hits
- [ ] **Language Distribution**: Track which languages used most
- [ ] **Share Usage**: Track share button success rate
- [ ] **Error Rate**: <0.1% of sessions encounter errors

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| **Phase 0**: Security Updates | 1 day | None |
| **Phase 1**: Foundation & Fixes | 2-3 days | Phase 0 (optional) |
| **Phase 1.5**: Test Coverage | 2-3 days | Phase 1.4 |
| **Phase 2**: Offline Architecture | 3-4 days | Phase 1.5 |
| **Phase 3**: i18n & Config | 4-5 days | None (parallel) |
| **Phase 4**: Accessibility | 3-4 days | None (parallel) |
| **Phase 5**: Testing & Docs | 3-4 days | Phases 1-4 |
| **Phase 6**: Capacitor Prep | 1-2 days | Phase 5 |
| **Total** | **19-26 days** | (with parallelization) |

**Aggressive**: 4-5 weeks full-time  
**Realistic**: 6-7 weeks part-time  
**Conservative**: 9-11 weeks with thorough testing

---

## Risk Assessment

### High Risk
- **Service worker bugs**: Can break entire app if misconfigured
  - *Mitigation*: Thorough testing, staged rollout, kill switch
- **Translation quality**: Machine translations may be inaccurate
  - *Mitigation*: Start with major languages, crowdsource review

### Medium Risk
- **Redux complexity**: May overcomplicate if not needed
  - *Mitigation*: Start simple, add complexity as needed
- **Breaking changes**: Major refactor may introduce bugs
  - *Mitigation*: Comprehensive tests, feature flags

### Low Risk
- **Config file maintenance**: JSON files may get out of sync
  - *Mitigation*: Schema validation, documentation
- **Capacitor migration**: May encounter unexpected issues
  - *Mitigation*: Phase 6 identifies issues early

---

## Next Steps

1. **Review and approve this workplan**
2. **Answer remaining questions** (see below)
3. **Begin Phase 1** (Foundation & Fixes)
4. **Schedule regular check-ins** after each phase

---

## Outstanding Questions

1. **Translation Budget**
   - Use free LibreTranslate (open source) or paid DeepL API (higher quality)?
   - Budget for professional review of critical content (Rights message)?

2. **Analytics & Monitoring**
   - Keep current Google Analytics or switch to privacy-focused alternative (Plausible, Fathom)?
   - Add error monitoring (Sentry free tier)?

3. **GitHub Repository**
   - Is repo public? Can we add GitHub Issues for bug reports?
   - Enable GitHub Discussions for community support?

4. **License & Legal**
   - Current license allows redistribution?
   - Any legal review needed for translations of rights content?

5. **Staging Environment**
   - Setup separate staging branch/deployment for testing before production?

---

**Document Status**: Draft v1.0  
**Last Updated**: January 31, 2026  
**Next Review**: After Phase 1 completion
