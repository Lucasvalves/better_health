import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'Logout realizado com sucesso.' })
  res.cookies.delete('token')
  return res
}
