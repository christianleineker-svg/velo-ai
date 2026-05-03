import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const squads = await prisma.squad.findMany({
      where: { userId: session.user.id },
      include: { agents: { orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ data: squads })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = (await request.json()) as {
      name: string
      description?: string
      category?: string
      agents: Array<{ name: string; role: string; instructions: string; model?: string; order: number }>
    }
    const { name, description, category, agents } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome do squad é obrigatório' }, { status: 400 })
    }

    const squad = await prisma.squad.create({
      data: {
        name,
        description,
        category: category ?? 'custom',
        userId: session.user.id,
        agents: {
          create: agents.map((a: { name: string; role: string; instructions: string; model?: string; order: number }) => ({
            name: a.name,
            role: a.role,
            instructions: a.instructions,
            model: a.model ?? 'claude',
            order: a.order,
          })),
        },
      },
      include: { agents: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json({ data: squad }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
