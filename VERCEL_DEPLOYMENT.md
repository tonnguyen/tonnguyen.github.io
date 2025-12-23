# Deploying to Vercel

Vercel is the recommended platform for this Next.js project because it:
- ✅ Supports API routes (`/api/polar/checkout/*`)
- ✅ Has native Next.js optimization
- ✅ Makes environment variables easy to configure
- ✅ Provides automatic deployments on every push

## Quick Setup

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Import `tonnguyen/tonnguyen.github.io`
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the project settings, go to **Settings** → **Environment Variables**
   - Add all your environment variables:

   **Required:**
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app` (or your custom domain)
   - `NEXT_PUBLIC_POLAR_PRODUCT_AURORA` = `67232ea2-efae-42a8-b887-13afeb23ebe8`
   - `NEXT_PUBLIC_POLAR_PRODUCT_MIDNIGHT` = (your product ID)
   - `NEXT_PUBLIC_POLAR_PRODUCT_EMBER` = (your product ID)
   - `NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_MONTHLY` = (your product ID)
   - `NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_YEARLY` = (your product ID)

   **For API Routes:**
   - `POLAR_ACCESS_TOKEN` = (your Polar API token)
   - `POLAR_SANDBOX_KEY` = (if using sandbox)
   - `POLAR_API_BASE` = `https://api.polar.sh` (or `https://sandbox-api.polar.sh` for sandbox)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   # or
   bun add -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL
   vercel env add POLAR_ACCESS_TOKEN
   # ... repeat for each variable
   ```

## Environment Variables Setup

Copy all variables from your `.env.local` file to Vercel:

1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development** environments
3. Variables prefixed with `NEXT_PUBLIC_` will be available in the browser
4. Server-side variables (like `POLAR_ACCESS_TOKEN`) are only available in API routes

## Custom Domain (Optional)

If you want to use `tonnguyen.github.io` or a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` to match your domain

## API Routes

Unlike GitHub Pages, your API routes will work on Vercel:
- `/api/polar/checkout` - Create checkout session
- `/api/polar/checkout/session` - Get checkout session
- `/api/polar/checkout/status` - Check checkout status

These routes will have access to server-side environment variables like `POLAR_ACCESS_TOKEN`.

## Removing Static Export Config

The current `next.config.js` is set up for both GitHub Pages (static export) and Vercel. When deploying to Vercel, the `BUILD_EXPORT` environment variable won't be set, so it will use the default Next.js behavior with API routes support.

If you want to remove the static export config entirely (only use Vercel), you can remove the static export section from `next.config.js`.

## Continuous Deployment

Once connected to GitHub, Vercel will:
- Automatically deploy on every push to `main`
- Create preview deployments for pull requests
- Show build logs and deployment status

## Benefits Over GitHub Pages

| Feature | GitHub Pages | Vercel |
|---------|--------------|--------|
| API Routes | ❌ No | ✅ Yes |
| Image Optimization | ❌ No | ✅ Yes |
| Serverless Functions | ❌ No | ✅ Yes |
| Environment Variables | ⚠️ Manual | ✅ Easy UI |
| Automatic Deployments | ⚠️ Manual | ✅ Automatic |
| Preview Deployments | ❌ No | ✅ Yes |

## Keeping Both (Optional)

You can deploy to both:
- **Vercel**: Full functionality with API routes
- **GitHub Pages**: Static fallback (without API routes)

Just keep both deployment workflows active!

