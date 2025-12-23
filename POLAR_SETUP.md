# Polar.sh Product Configuration Guide

This guide explains how to set up products in Polar.sh sandbox for the skateboard store.

## Prerequisites

1. Access to Polar.sh sandbox: https://sandbox.polar.sh/
2. Your Organization Access Token (OAT): `polar_oat_nggb9MFzXDBI3s7hSxRZZgUxE5AuZdkhVmJgu3qq7Q6`
3. An organization created in Polar sandbox

## Setting Up One-Time Products (Skateboards)

### Step 1: Create Products

1. Log in to https://sandbox.polar.sh/
2. Navigate to **Products** in the sidebar
3. Click **"Create Product"** or **"New Product"**

### Step 2: Configure Each Skateboard Product

For each skateboard (Aurora Cruiser, Midnight Freestyle, Ember Downhill):

1. **Product Name**: Enter the skateboard name (e.g., "Aurora Cruiser")
2. **Description**: Add product description
3. **Price Type**: Select **"One-time"**
4. **Price**: 
   - Aurora Cruiser: $129.00 USD
   - Midnight Freestyle: $149.00 USD
   - Ember Downhill: $189.00 USD
5. **Currency**: USD
6. Click **"Create Product"** or **"Save"**

### Step 3: Copy Product IDs

1. After creating each product, you'll see the product details page
2. Find the **Product ID** (format: `polar_prod_...` or UUID)
3. Copy the Product ID
4. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_POLAR_PRODUCT_AURORA=<paste-product-id-here>
   NEXT_PUBLIC_POLAR_PRODUCT_MIDNIGHT=<paste-product-id-here>
   NEXT_PUBLIC_POLAR_PRODUCT_EMBER=<paste-product-id-here>
   ```

## Setting Up Subscription Products

### Monthly Subscription ($29/month)

1. Navigate to **Products** → **Create Product**
2. **Product Name**: "Skateboard Subscription - Monthly"
3. **Description**: "Get a new skateboard delivered every year. Cancel anytime."
4. **Price Type**: Select **"Recurring"** or **"Subscription"**
5. **Billing Period**: Select **"Monthly"**
6. **Price**: $29.00 USD
7. **Currency**: USD
8. Click **"Create Product"**
9. Copy the Product ID and add to `.env.local`:
   ```
   NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_MONTHLY=<paste-product-id-here>
   ```

### Yearly Subscription ($278.40/year - 20% discount)

1. Navigate to **Products** → **Create Product**
2. **Product Name**: "Skateboard Subscription - Yearly"
3. **Description**: "Get a new skateboard delivered every year. Save 20% with yearly billing."
4. **Price Type**: Select **"Recurring"** or **"Subscription"**
5. **Billing Period**: Select **"Yearly"** or **"Annual"**
6. **Price**: $278.40 USD (this is $29 × 12 × 0.8 = 20% discount)
7. **Currency**: USD
8. Click **"Create Product"**
9. Copy the Product ID and add to `.env.local`:
   ```
   NEXT_PUBLIC_POLAR_PRODUCT_SUBSCRIPTION_YEARLY=<paste-product-id-here>
   ```

## Alternative: Using Polar API to Create Products

You can also create products programmatically using the Polar API:

### Create One-Time Product

```bash
curl -X POST https://sandbox-api.polar.sh/v1/products \
  -H "Authorization: Bearer polar_oat_nggb9MFzXDBI3s7hSxRZZgUxE5AuZdkhVmJgu3qq7Q6" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aurora Cruiser",
    "description": "Lightweight maple cruiser built for smooth city rides.",
    "prices": [
      {
        "amount": 12900,
        "currency": "usd"
      }
    ]
  }'
```

### Create Monthly Subscription

```bash
curl -X POST https://sandbox-api.polar.sh/v1/products \
  -H "Authorization: Bearer polar_oat_nggb9MFzXDBI3s7hSxRZZgUxE5AuZdkhVmJgu3qq7Q6" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Skateboard Subscription - Monthly",
    "description": "Get a new skateboard delivered every year. Cancel anytime.",
    "prices": [
      {
        "amount": 2900,
        "currency": "usd",
        "recurring": {
          "interval": "month"
        }
      }
    ]
  }'
```

### Create Yearly Subscription

```bash
curl -X POST https://sandbox-api.polar.sh/v1/products \
  -H "Authorization: Bearer polar_oat_nggb9MFzXDBI3s7hSxRZZgUxE5AuZdkhVmJgu3qq7Q6" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Skateboard Subscription - Yearly",
    "description": "Get a new skateboard delivered every year. Save 20% with yearly billing.",
    "prices": [
      {
        "amount": 27840,
        "currency": "usd",
        "recurring": {
          "interval": "year"
        }
      }
    ]
  }'
```

**Note**: Prices in Polar API are in cents (e.g., $29.00 = 2900 cents)

## Testing Checkouts

### Test Cards (Sandbox)

Use these test card numbers in Polar sandbox checkout:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Testing Flow

1. Start your dev server: `npm run dev`
2. Run command: `skateboards` or `buy skateboard`
3. Click on a product to start checkout
4. Complete checkout in the Polar sandbox window
5. Check status updates in the terminal

## Verifying Configuration

After adding all product IDs to `.env.local`, restart your dev server:

```bash
npm run dev
```

Then test each product to ensure they're configured correctly.

## Troubleshooting

### Product ID Not Found
- Verify the Product ID is correct in `.env.local`
- Ensure you're using sandbox product IDs (not production)
- Check that the product exists in your Polar sandbox organization

### Checkout Creation Fails
- Verify `POLAR_ACCESS_TOKEN` is set correctly in `.env.local`
- Ensure the token has access to create checkouts
- Check browser console and server logs for detailed error messages

### Subscription Not Working
- Verify the product is created as a recurring/subscription product
- Check that billing interval is set correctly (month/year)
- Ensure the price matches the expected amount

## Additional Resources

- Polar API Documentation: https://polar.sh/docs/api-reference
- Polar Dashboard: https://sandbox.polar.sh/
- Checkout API Reference: https://polar.sh/docs/api-reference/checkouts


