# GitHub Secrets Setup Guide

This guide explains how to configure environment variables (secrets) in GitHub for your GitHub Actions workflow.

## How to Add Secrets in GitHub

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/tonnguyen/tonnguyen.github.io`

2. **Open Settings**
   - Click on the **Settings** tab (top menu bar)

3. **Navigate to Secrets**
   - In the left sidebar, click on **Secrets and variables** → **Actions**

4. **Add a New Secret**
   - Click the **New repository secret** button
   - Enter the **Name** (exactly as shown below)
   - Enter the **Value** (your actual secret value)
   - Click **Add secret**

## Required Secrets

### Public Environment Variables (Required for Build)
These are embedded into your static build and are needed at build time:

- **`NEXT_PUBLIC_SITE_URL`**
  - Example: `https://tonnguyen.github.io`
  - Your GitHub Pages site URL

- **`NEXT_PUBLIC_POLAR_PRODUCT_AURORA`**
  - Your Polar product ID for Aurora Cruiser

- **`NEXT_PUBLIC_POLAR_PRODUCT_MIDNIGHT`**
  - Your Polar product ID for Midnight Freestyle

- **`NEXT_PUBLIC_POLAR_PRODUCT_EMBER`**
  - Your Polar product ID for Ember Downhill

- **`NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_MONTHLY`**
  - Your Polar product ID for monthly subscription

- **`NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_YEARLY`**
  - Your Polar product ID for yearly subscription

### Server-Side Secrets (Optional for Static Export)
These are not used in static export but included for completeness:

- **`POLAR_ACCESS_TOKEN`** (or `POLAR_SANDBOX_KEY`)
  - Your Polar API access token
  - Note: API routes don't work with static export, so this won't be used on GitHub Pages

- **`POLAR_API_BASE`** (optional)
  - Defaults to `https://sandbox-api.polar.sh` if not set
  - Use `https://api.polar.sh` for production

## Important Notes

⚠️ **API Routes Limitation**: GitHub Pages only serves static files. Your API routes (`/api/polar/checkout/*`) will **not work** on GitHub Pages because they require a server. They are included in the build for compatibility but won't function.

✅ **Public Variables**: Variables prefixed with `NEXT_PUBLIC_` are embedded into your JavaScript bundle and are visible to anyone who views your site's source code. Only use them for non-sensitive values.

🔒 **Secrets**: Never commit secrets to your repository. Always use GitHub Secrets for sensitive values.

## Verification

After adding secrets:
1. Push a commit to trigger the workflow
2. Go to **Actions** tab in your repository
3. Check the workflow logs to verify the build succeeds
4. The secrets will be available as environment variables during the build process

