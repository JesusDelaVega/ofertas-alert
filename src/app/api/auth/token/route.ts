import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// GET: Muestra el link para autorizar
export async function GET() {
  const clientId = process.env.MERCADOLIBRE_APP_ID || '4505376518344863'
  const redirectUri = 'https://ofertas-alert-45zmtdtge-corfihs-projects.vercel.app/api/auth/callback'

  const authUrl = `https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`

  return NextResponse.json({
    message: 'Visita este link para autorizar:',
    authUrl,
    instructions: 'Después de autorizar, copia el CODE de la URL y haz POST a este endpoint con { "code": "TU_CODE" }'
  })
}

// POST: Intercambia el code por token
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Falta el code' }, { status: 400 })
    }

    const response = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.MERCADOLIBRE_APP_ID || '4505376518344863',
        client_secret: process.env.MERCADOLIBRE_SECRET_KEY || 'gLloFJLOdh3MJXxpn512uU4XpaRa8Js8',
        code: code,
        redirect_uri: 'https://ofertas-alert-45zmtdtge-corfihs-projects.vercel.app/api/auth/callback'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Agrega MERCADOLIBRE_ACCESS_TOKEN a Vercel con este valor:',
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in
    })
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown } }
    return NextResponse.json(
      { error: 'Error obteniendo token', details: axiosError.response?.data },
      { status: 500 }
    )
  }
}
