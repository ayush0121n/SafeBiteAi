# Deployment Guide

## Deployment order
1. Push code to GitHub
2. Deploy backend on Render
3. Verify /health endpoint
4. Deploy frontend on Vercel
5. Connect the two with environment variables

## Vercel (Frontend)

1. Import the GitHub repository at https://vercel.com/new
2. Set **Root Directory** to `frontend`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `dist`
5. Deploy without VITE_API_URL first (it will use mocks)
6. After Render backend is live, add environment variable:
   - `VITE_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com`
7. Redeploy from Vercel dashboard

## Render (Backend)

1. Create a new **Web Service** at https://dashboard.render.com
2. Connect the GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `pip install -r requirements.txt`
5. Set **Start Command** to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `ENVIRONMENT` = `production`
   - `CORS_ORIGINS` = `https://safebiteai-ai.vercel.app`
   - `MAX_UPLOAD_SIZE_MB` = `10`
   - `ML_CONTAINER_URL` = `URL_OF_INTERNAL_ML_CONTAINER` (Optional, defaults to mock if unavailable)
   - `ML_CONTAINER_API_KEY` = `YOUR_SECRET_KEY`
   - `ENABLE_LABEL_REGION_DETECTION` = `true` or `false`
7. Confirm health check at `https://YOUR-RENDER-SERVICE.onrender.com/health`
8. Copy the Render URL into Vercel as `VITE_API_URL`
9. Redeploy Vercel

## Environment variable security
- Never commit `.env` files
- Never expose backend secrets in `VITE_` variables
- `VITE_` variables are public browser configuration
- Keep API keys, database passwords, and secrets only in Render environment variables

## Verification checklist
- [ ] Vercel frontend loads successfully
- [ ] React Router pages refresh without 404 errors
- [ ] Backend /health returns `{"status": "ok", "service": "safebite-ai-api"}`
- [ ] Frontend can call backend API
- [ ] CORS allows only localhost and deployed Vercel domain
- [ ] Image upload validates file type and size
- [ ] No secret keys are committed
- [ ] Medical disclaimer appears on scan result page
