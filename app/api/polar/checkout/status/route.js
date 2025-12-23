import { NextResponse } from 'next/server';

// Required for static export - API routes are skipped during static generation
export const dynamic = 'force-static';

// CORS headers for cross-origin requests from GitHub Pages
function corsHeaders(origin) {
  // Use specific origin if provided, otherwise fallback to env var or wildcard
  const allowedOrigin = origin || process.env.NEXT_PUBLIC_SITE_URL || '*';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
  };
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

const POLAR_BASE_URL = process.env.POLAR_API_BASE || 'https://sandbox-api.polar.sh';
const POLAR_KEY =
  process.env.POLAR_ACCESS_TOKEN ||
  process.env.POLAR_SANDBOX_KEY ||
  process.env.POLAR_KEY ||
  process.env.POLAR_OAT ||
  process.env.POLAR_TOKEN;

export async function GET(req) {
  const origin = req.headers.get('origin');
  
  if (!POLAR_KEY) {
    return NextResponse.json(
      {
        error:
          'Missing Polar access token. Set POLAR_ACCESS_TOKEN (or POLAR_SANDBOX_KEY) in .env.local.'
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }

  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get('id');

  if (!checkoutId) {
    return NextResponse.json(
      { error: 'id is required' },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  try {
    const response = await fetch(`${POLAR_BASE_URL}/v1/checkouts/${checkoutId}`, {
      headers: {
        Authorization: `Bearer ${POLAR_KEY}`
      },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Failed to load checkout', details: data },
        { status: response.status, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(
      {
        status: data.status,
        checkout: data
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Unable to fetch checkout status: ${error.message}` },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}


