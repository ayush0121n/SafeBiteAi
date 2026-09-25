# SafeBite AI
SafeBite AI is an accessible packaged-food-label scanner. Users can upload a food label image, extract ingredients and nutrition information, identify possible allergens, and receive profile-aware, plain-language guidance.

## MVP scope
- User health profile
- Image upload
- OCR ingredient extraction
- Rule-based allergen detection
- Nutrition concern flags
- Scan result history
- Accessibility modes

## Out of scope for MVP
- Medical diagnosis
- Camera capture
- Clinical risk prediction
- Paid APIs
- Barcode scanning
- Family profile management

## Tech stack
- Frontend: Vite, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- OCR: PaddleOCR
- Storage: localStorage initially, Supabase later

## Commands
```bash
npm install
npm run dev
npm run build
```

## Safety
SafeBite AI provides educational label guidance only. It does not replace a doctor, dietitian, pharmacist, or allergy plan.

## Deployment

**Frontend (Vercel):**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com`

**Backend (Render):**
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `CORS_ORIGINS=https://YOUR-VERCEL-APP.vercel.app`

See [docs/deployment.md](docs/deployment.md) for full steps.

## Copyright and license
Copyright © 2026 Ayush Narkhede. SafeBite AI is licensed under the MIT License. See the LICENSE file for details.
