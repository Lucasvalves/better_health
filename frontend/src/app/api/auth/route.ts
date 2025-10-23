import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const token = await req.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token não informado.' },
        { status: 400 }
      )
    }

    ;(await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message || 'Erro ao autenticar usuário' },
        { status: 400 }
      )
    }
  }
}
  