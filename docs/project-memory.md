# SafeBite AI Project Memory

## Current status
- Frontend: ✅ Complete MVP — all pages built, polished UI, accessibility modes, Zustand stores, builds successfully
- Backend: ✅ Complete MVP — FastAPI with /health, scans CRUD, profiles, allergen/concern services
- OCR: ⏳ PaddleOCR planned (backend uses mock results for now)
- Allergen rules: ✅ Rule JSON files + allergen_service.py + concern_service.py
- Database: ✅ localStorage via Zustand stores (profile + scans)
- Deployment: ✅ Vercel (frontend) + Render (backend) configured with docs

## Completed work
- [2026-09-25] Created project docs, Antigravity skills, repo files (README, LICENSE, CONTRIBUTING, SECURITY)
- [2026-09-25] Created backend rule JSON files (allergens, aliases, thresholds, templates)
- [2026-09-25] Initialized Vite React TypeScript frontend with all free dependencies
- [2026-09-25] Created complete design system CSS with CSS variables, animations, high-contrast, large-text modes
- [2026-09-25] Created accessibility store with document root class toggling
- [2026-09-25] Built premium LandingPage with gradient hero, feature cards, 3-step how-it-works
- [2026-09-25] Built 3-step OnboardingPage: allergies → conditions → preferences/accessibility
- [2026-09-25] Built DashboardPage with Zustand integration, stats cards, allergen watch list, recent scans
- [2026-09-25] Built NewScanPage with drag-drop, preview, validation, inline analyzing state
- [2026-09-25] Built ScanResultsPage with traffic-light, allergen alerts, concerns, nutrition, voice, share, save
- [2026-09-25] Built ScanHistoryPage and ProfilePage with full Zustand integration
- [2026-09-25] Built AppShell with accessibility toggles in header
- [2026-09-25] Created shared TypeScript types matching data-model.md
- [2026-09-25] Created Zustand stores: profile, scans, accessibility (all localStorage backed)
- [2026-09-25] Created FastAPI backend: main.py, config.py, api/router.py
- [2026-09-25] Created backend services: ingredient_service, allergen_service, concern_service
- [2026-09-25] Created Pydantic schemas: profile.py, scan.py
- [2026-09-25] Created backend tests: test_allergen_service, test_concern_service
- [2026-09-25] Created API client (frontend) using VITE_API_URL env var
- [2026-09-25] Created deployment config: vercel.json, render.yaml, deployment docs
- [2026-09-25] Frontend build passes: 366 KB JS, 26 KB CSS
- [2026-09-25] Browser verified: all pages render correctly, navigation works, Zustand state persists
- [2026-09-25] Added future-ready label-region detection architecture (NoOp default)
- [2026-09-25] Built Ingredient Evidence Cards feature to highlight exact matched words for allergens
- [2026-09-25] Built Label Confidence Map to show bounding boxes over the scanned image for read regions
- [2026-09-25] Built Privacy-first mode to analyze labels entirely in-memory without saving the image to disk or scan history
- [2026-09-25] Configured backend to use internal ML processing container via ML_CONTAINER_URL for PaddleOCR processing
- [2026-09-25] Added Offline Emergency Check page for manual label reading without internet access
- [2026-09-25] Added Admin Portal with login and dashboard to manage feature flags and monitor mock analytics
- [2026-09-25] Revamped application shell and admin portal for full desktop and mobile responsiveness (sidebars on desktop, bottom/top navs on mobile)
- [2026-09-25] Finalized deployment configurations (render.yaml, vercel.json, deployment.md) and exposed necessary environment variables for production

## Important decisions
- Use image upload first; add camera later
- Use rule-based allergen detection before ML
- Use Safe/Caution/Avoid/Uncertain not medical risk %
- Keep frontend and backend separate
- Use localStorage before Supabase
- CORS allowlist only (no wildcard)
- MIT License, copyright Ayush Narkhede

## Important files
- frontend/src/styles/globals.css: complete design system with CSS variables
- frontend/src/pages/LandingPage.tsx: premium landing page
- frontend/src/pages/OnboardingPage.tsx: 3-step onboarding with Zustand
- frontend/src/pages/DashboardPage.tsx: dashboard with Zustand integration
- frontend/src/pages/NewScanPage.tsx: upload with drag-drop and validation
- frontend/src/pages/ScanResultsPage.tsx: full results with voice/share/save
- frontend/src/features/accessibility/accessibility.store.ts: accessibility state
- frontend/src/features/profile/profile.store.ts: profile state
- frontend/src/features/scans/scans.store.ts: scan history state
- frontend/src/api/client.ts: API client using VITE_API_URL
- frontend/src/api/types.ts: shared TypeScript types
- backend/app/main.py: FastAPI entry with CORS + /health
- backend/app/services/allergen_service.py: allergen matching engine
- backend/app/services/concern_service.py: nutrition concern evaluation
- backend/app/services/ingredient_service.py: ingredient parsing
- backend/app/tests/test_allergen_service.py: allergen tests
- backend/app/tests/test_concern_service.py: concern tests

## Known limitations
- Backend returns mock scan results (no real OCR processing yet)
- PaddleOCR not in requirements.txt (Render free tier RAM limit)
- No real-time image analysis (simulated with setTimeout)
- No Supabase auth or cloud persistence yet

## Next task
- Push to GitHub and deploy to Vercel + Render
