import { NextResponse } from 'next/server';

// Required for static export - API routes are skipped during static generation
export const dynamic = 'force-static';

const POLAR_BASE_URL = process.env.POLAR_API_BASE || 'https://sandbox-api.polar.sh';
const POLAR_KEY =
  process.env.POLAR_ACCESS_TOKEN ||
  process.env.POLAR_SANDBOX_KEY ||
  process.env.POLAR_KEY ||
  process.env.POLAR_OAT ||
  process.env.POLAR_TOKEN;

export async function POST(req) {
  if (!POLAR_KEY) {
    return NextResponse.json(
      {
        error:
          'Missing Polar access token. Set POLAR_ACCESS_TOKEN (or POLAR_SANDBOX_KEY) in .env.local.'
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const {
      productId,
      quantity = 1,
      successUrl,
      cancelUrl,
      metadata = {}
    } = body || {};

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    // Polar API expects products as an array
    const requestBody = {
      products: [productId],
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?checkout=success`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?checkout=cancelled`,
      metadata
    };

    const response = await fetch(`${POLAR_BASE_URL}/v1/checkouts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${POLAR_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      // Enhanced error logging for 403 errors
      const errorMessage = data?.message || data?.detail || 'Failed to create checkout';
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        polarResponse: data,
        requestBody: {
          products: [productId],
          success_url: requestBody.success_url,
          cancel_url: requestBody.cancel_url
        },
        apiUrl: `${POLAR_BASE_URL}/v1/checkouts`,
        troubleshooting: response.status === 403 
          ? '403 Forbidden: Check that your Polar token has permission to create checkouts and that the product belongs to your organization.'
          : response.status === 401
          ? '401 Unauthorized: Check that your Polar token is valid and correctly set in .env.local'
          : null
      };

      return NextResponse.json(
        errorDetails,
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        checkoutId: data.id,
        checkoutUrl: data.url,
        status: data.status,
        checkout: data
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Unexpected error creating checkout: ${error.message}` },
      { status: 500 }
    );
  }
}


