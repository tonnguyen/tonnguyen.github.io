# Hybrid Deployment: GitHub Pages + Vercel API

This guide explains how to deploy your site with:
- **Frontend**: Hosted on GitHub Pages at `https://tonnguyen.github.io/`
- **API Routes**: Hosted on Vercel (separate domain)
- **Frontend calls**: API routes on Vercel via CORS

## Architecture

```
┌─────────────────────┐
│  GitHub Pages       │
│  tonnguyen.github.io│
│  (Static Frontend)  │
└──────────┬──────────┘
           │
           │ API Calls (CORS)
           ▼
┌─────────────────────┐
│  Vercel             │
│  your-app.vercel.app│
│  (API Routes)       │
└─────────────────────┘
```

## Setup Steps

### 1. Deploy API Routes to Vercel

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy (this will deploy the full Next.js app)

2. **Get Your Vercel URL**
   - After deployment, you'll get a URL like: `https://your-project.vercel.app`
   - Copy this URL - you'll need it for the next step

### 2. Configure GitHub Pages Frontend

1. **Set Environment Variable for GitHub Pages**
   - Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
   - Add a new secret:
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-project.vercel.app` (your Vercel URL)

2. **Update GitHub Actions Workflow**
   The workflow is already configured to use `NEXT_PUBLIC_API_URL` if set.

3. **Rebuild GitHub Pages**
   - Push a commit or manually trigger the workflow
   - The frontend will now call Vercel API routes

### 3. Configure Vercel Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**, add:

**Required:**
- `NEXT_PUBLIC_SITE_URL` = `https://tonnguyen.github.io` (your GitHub Pages URL)
- `POLAR_ACCESS_TOKEN` = (your Polar API token)
- `POLAR_SANDBOX_KEY` = (if using sandbox)
- `POLAR_API_BASE` = `https://api.polar.sh` (or sandbox URL)

**Product IDs (if needed):**
- `NEXT_PUBLIC_POLAR_PRODUCT_AURORA`
- `NEXT_PUBLIC_POLAR_PRODUCT_MIDNIGHT`
- `NEXT_PUBLIC_POLAR_PRODUCT_EMBER`
- `NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_MONTHLY`
- `NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_YEARLY`

**Important**: Set `NEXT_PUBLIC_SITE_URL` to `https://tonnguyen.github.io` in Vercel so CORS allows requests from GitHub Pages.

### 4. How It Works

The `lib/api.js` utility function automatically:
- Uses `NEXT_PUBLIC_API_URL` if set (points to Vercel)
- Falls back to relative paths if not set (for same-origin)

When deployed:
- **GitHub Pages**: Sets `NEXT_PUBLIC_API_URL=https://your-project.vercel.app`
- **Frontend calls**: `https://your-project.vercel.app/api/polar/checkout`
- **CORS**: Vercel API routes allow requests from `https://tonnguyen.github.io`

## Testing

### Local Development
1. **Without `NEXT_PUBLIC_API_URL`**: Uses relative paths (works if running full Next.js)
2. **With `NEXT_PUBLIC_API_URL`**: Points to Vercel (for testing GitHub Pages behavior)

### Production
1. **GitHub Pages**: Frontend at `https://tonnguyen.github.io`
2. **Vercel**: API routes at `https://your-project.vercel.app/api/polar/*`
3. **CORS**: Configured to allow cross-origin requests

## Troubleshooting

### CORS Errors
- **Symptom**: Browser console shows CORS errors
- **Fix**: Ensure `NEXT_PUBLIC_SITE_URL` in Vercel matches your GitHub Pages URL exactly
- **Check**: Vercel API routes return CORS headers (already configured)

### API Routes Not Found
- **Symptom**: 404 errors when calling API routes
- **Fix**: Verify `NEXT_PUBLIC_API_URL` is set correctly in GitHub Secrets
- **Check**: Rebuild GitHub Pages after setting the secret

### Environment Variables Not Working
- **Symptom**: API calls fail with missing token errors
- **Fix**: Add all required environment variables in Vercel dashboard
- **Note**: `NEXT_PUBLIC_*` variables are embedded at build time

## Benefits

✅ **Keep GitHub Pages URL**: Your site stays at `https://tonnguyen.github.io/`  
✅ **API Routes Work**: Full serverless function support on Vercel  
✅ **Best of Both**: Static hosting + dynamic API capabilities  
✅ **Easy Updates**: Deploy frontend and API independently  

## Alternative: Full Vercel Deployment

If you prefer to use Vercel for everything:
1. Deploy full app to Vercel
2. Configure custom domain `tonnguyen.github.io` in Vercel
3. Update DNS settings (Vercel will provide instructions)
4. Remove GitHub Pages deployment

This hybrid approach gives you the GitHub Pages URL while still having working API routes!

