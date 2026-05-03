import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const execution = await prisma.execution.findFirst({
      where: { id, userId: session.user.id },
      include: { squad: { include: { agents: { orderBy: { order: 'asc' } } } } },
    })

    if (!execution) {
      return NextResponse.json({ error: 'Execução não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ data: execution })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
