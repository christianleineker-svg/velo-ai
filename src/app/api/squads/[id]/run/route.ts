export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { runSquad } from '@/lib/squad-runner'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const squad = await prisma.squad.findFirst({
      where: { id, userId: session.user.id },
      include: { agents: true },
    })

    if (!squad) {
      return NextResponse.json({ error: 'Squad não encontrado' }, { status: 404 })
    }

    const body = (await request.json()) as { input: string }
    const { input } = body

    if (!input?.trim()) {
      return NextResponse.json({ error: 'Input é obrigatório' }, { status: 400 })
    }

    const execution = await prisma.execution.create({
      data: {
        squadId: id,
        userId: session.user.id,
        input,
        status: 'pending',
      },
    })

    runSquad(execution.id, id, input).catch((err: unknown) => {
      console.error('Squad runner error:', err)
    })

    return NextResponse.json({ data: { executionId: execution.id } })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
