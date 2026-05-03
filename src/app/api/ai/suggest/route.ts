import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { suggestAgentsForSquad } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = (await request.json()) as { name: string; description: string }
    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json({ error: 'Nome e descrição são obrigatórios' }, { status: 400 })
    }

    const agents = await suggestAgentsForSquad(name, description)
    return NextResponse.json({ data: agents })
  } catch {
    return NextResponse.json({ error: 'Erro ao sugerir agentes' }, { status: 500 })
  }
}
