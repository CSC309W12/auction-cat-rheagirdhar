// app/api/payment/route.ts
import { NextResponse } from 'next/server';

// CORS Preflight Handler
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}

// Main POST Handler with Third-Party API Call (includes API key)
export async function POST(request: Request) {
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json();

    // Get third-party payment API URL and API key from environment variables
    const api_url = `${process.env.THIRDPARTY_PAYMENT_URL}`
    const api_key = `${process.env.THIRDPARTY_API_KEY}`

    // Call the third-party payment API with the API key in the headers
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': api_key
      },
      body: JSON.stringify(body)
    })

    // Return response based on third-party API result
    const ret = await response.json()

    return NextResponse.json({message: "Payment processed successfully", details: ret}, {status:200, headers: responseHeaders});
    
  } catch (error) {
    return NextResponse.json({"error": error}, {status: 500})
  }
}