import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { assistantRequestSchema } from '@/domain/validations/assistant-validation'
import { extractAssistantReply } from '@/shared/utils/helpers/assistantReply'

const ASSISTANT_TIMEOUT_MS = 60_000
const DEFAULT_ASSISTANT_URL = 'http://localhost:3001'

const GENERIC_ERROR = 'Não foi possível falar com o assistente agora.'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json(
      { message: 'Sessão expirada. Faça login novamente.' },
      { status: 401 }
    )
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: 'Mensagem inválida.' }, { status: 400 })
  }

  const parsed = assistantRequestSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Mensagem inválida.' }, { status: 400 })
  }

  const assistantUrl =
    process.env.NEXT_PUBLIC_ASSISTANT_API_URL ?? DEFAULT_ASSISTANT_URL

  try {
    const response = await fetch(`${assistantUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...parsed.data, token }),
      signal: AbortSignal.timeout(ASSISTANT_TIMEOUT_MS),
      cache: 'no-store'
    })

    if (response.status === 401) {
      return NextResponse.json(
        { message: 'Sessão expirada. Faça login novamente.' },
        { status: 401 }
      )
    }

    if (!response.ok) {
      return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 })
    }

    const data = await response.json()
    const reply = extractAssistantReply(data?.messages)

    if (!reply) {
      return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 })
    }

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 })
  }
}
