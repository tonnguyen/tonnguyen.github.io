import { NextResponse } from 'next/server';

// Required for static export - API routes are skipped during static generation
export const dynamic = 'force-static';

// CORS headers for cross-origin requests from GitHub Pages
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const POLAR_BASE_URL = process.env.POLAR_API_BASE || 'https://sandbox-api.polar.sh';
const POLAR_KEY =
  process.env.POLAR_ACCESS_TOKEN ||
  process.env.POLAR_SANDBOX_KEY ||
  process.env.POLAR_KEY ||
  process.env.POLAR_OAT ||
  process.env.POLAR_TOKEN;

export async function GET(req) {
  if (!POLAR_KEY) {
    return NextResponse.json(
      {
        error:
          'Missing Polar access token. Set POLAR_ACCESS_TOKEN (or POLAR_SANDBOX_KEY) in .env.local.'
      },
      { status: 500, headers: corsHeaders() }
    );
  }

  const { searchParams } = new URL(req.url);
  const customerSessionToken = searchParams.get('customer_session_token');

  if (!customerSessionToken) {
    return NextResponse.json(
      { error: 'customer_session_token is required' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    // Try multiple possible endpoints for customer session token
    const endpoints = [
      `/v1/checkouts/session/${customerSessionToken}`,
      `/v1/customer_sessions/${customerSessionToken}`,
      `/v1/customer_sessions/${customerSessionToken}/checkout`
    ];

    let lastError = null;
    let lastResponse = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${POLAR_BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${POLAR_KEY}`
          },
          cache: 'no-store'
        });

        const data = await response.json();

        if (response.ok) {
          return NextResponse.json(
            {
              checkout: data.checkout || data
            },
            { status: 200, headers: corsHeaders() }
          );
        }

        lastError = data;
        lastResponse = response;
      } catch (err) {
        // Try next endpoint
        continue;
      }
    }

    // If all endpoints failed, return error
    return NextResponse.json(
      { 
        error: lastError?.message || 'Failed to load checkout session', 
        details: lastError,
        note: 'Tried multiple endpoints. Customer session token may need to be used differently.'
      },
      { status: lastResponse?.status || 404, headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Unable to fetch checkout session: ${error.message}` },
      { status: 500, headers: corsHeaders() }
    );
  }
}

