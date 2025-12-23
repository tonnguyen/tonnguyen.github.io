import { NextResponse } from 'next/server';

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
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get('id');

  if (!checkoutId) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
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
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        status: data.status,
        checkout: data
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Unable to fetch checkout status: ${error.message}` },
      { status: 500 }
    );
  }
}


