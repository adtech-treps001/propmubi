# 🧪 Playwright Testing - Quick Reference

## 📦 Installation Complete ✅

Playwright has been installed and configured for the PropMubi Trust OS web application.

---

## 🚀 Running Tests

### Basic Commands

```bash
cd apps/web

# Run all tests (headless)
npm run test:e2e

# Run with UI (interactive debugging)
npm run test:e2e:ui

# Run with browser visible
npm run test:e2e:headed

# View last test report
npm run test:e2e:report
```

### Run Specific Test File

```bash
# Navigation tests only
npx playwright test navigation.spec.ts

# Builder dashboard tests only
npx playwright test builder-dashboard.spec.ts

# Agent CRM tests only
npx playwright test agent-crm.spec.ts
```

### Debug Mode

```bash
# Debug specific test
npx playwright test --debug navigation.spec.ts

# Debug with inspector
PWDEBUG=1 npx playwright test
```

---

## 📊 Test Results (Latest Run)

**Total Tests**: 51  
**Passed**: 42 ✅  
**Failed**: 9 ⚠️  
**Pass Rate**: 82%  
**Execution Time**: 51.9s  

---

## 📁 Test Files Structure

```
apps/web/e2e/
├── navigation.spec.ts              (4 tests) ✅
├── builder-dashboard.spec.ts       (8 tests) ⚠️ 2 failures
├── agent-crm.spec.ts               (8 tests) ⚠️ 1 failure
├── consumer-view.spec.ts           (8 tests) ⚠️ 1 failure
├── microsite.spec.ts               (12 tests) ⚠️ 2 failures
└── routing-and-performance.spec.ts (11 tests) ⚠️ 3 failures
```

---

## ✅ What's Tested

### Navigation Component ✅ 100%
- Visibility on different pages
- Active state highlighting
- Page transitions
- Logo redirect

### Builder Dashboard ✅ 75%
- Metric cards display
- Trust score visibility
- Charts rendering
- Activity feed
- Real-time polling (needs API mock)

### Agent CRM ✅ 88%
- Stat cards
- Lead queue table
- Supply sensors panel
- Polling mechanism
- Button interactivity (needs sample data)

### Consumer View ✅ 88%
- Property card
- Trust score badge
- Price display
- Book button
- Mobile responsiveness

### Agent Microsite ✅ 83%
- Profile display
- Verified badge
- WhatsApp CTA
- Standalone layout (no nav)
- Listings section

### Routing & Performance ✅ 73%
- Root redirect
- 404 handling
- Browser navigation
- Load performance
- Accessibility

---

## ⚠️ Known Issues (9 failures)

### Quick Fixes Needed:
1. Add API mocking for real-time data
2. Increase async wait times for Chart.js
3. Loosen CSS color assertions
4. Fix 404 test to check content, not status

### See Full Details:
`docs/PLAYWRIGHT_TEST_RESULTS.md`

---

## 🎯 Next Steps

### Immediate (Sprint 1)
- [x] Install Playwright
- [x] Create test suite
- [x] Run initial tests
- [ ] Fix timing-related failures
- [ ] Add API mocking

### Future (Sprint 2)
- [ ] Visual regression testing
- [ ] Accessibility audits (axe-core)
- [ ] Mobile device testing
- [ ] CI/CD integration

---

## 📚 Resources

- Playwright Docs: https://playwright.dev
- Test Report: Run `npm run test:e2e:report`
- Config File: `playwright.config.ts`
- Full Results: `docs/PLAYWRIGHT_TEST_RESULTS.md`

---

**Quick Win**: 82% pass rate with zero setup! 🎉
