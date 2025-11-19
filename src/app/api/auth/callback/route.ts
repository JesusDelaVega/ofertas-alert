import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    const response = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.MERCADOLIBRE_APP_ID,
        client_secret: process.env.MERCADOLIBRE_SECRET_KEY,
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ofertas-alert-1u1dawcnq-corfihs-projects.vercel.app'}/api/auth/callback`
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    )

    // Show the token to copy to Vercel env vars
    return NextResponse.json({
      message: 'Success! Copy these values to your Vercel environment variables:',
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in
    })
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown } }
    console.error('OAuth error:', axiosError.response?.data || error)
    return NextResponse.json(
      { error: 'Failed to get token', details: axiosError.response?.data },
      { status: 500 }
    )
  }
}
