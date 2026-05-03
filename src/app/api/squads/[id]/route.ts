import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/squads/[id]'>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await ctx.params

    const squad = await prisma.squad.findFirst({
      where: { id, userId: session.user.id },
      include: { agents: { orderBy: { order: 'asc' } } },
    })

    if (!squad) {
      return NextResponse.json({ error: 'Squad não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ data: squad })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/squads/[id]'>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await ctx.params

    const existing = await prisma.squad.findFirst({ where: { id, userId: session.user.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Squad não encontrado' }, { status: 404 })
    }

    const body = (await request.json()) as {
      name?: string
      description?: string
      category?: string
      agents?: Array<{ name: string; role: string; instructions: string; model?: string; order: number }>
    }
    const { name, description, category, agents } = body

    await prisma.agent.deleteMany({ where: { squadId: id } })

    const squad = await prisma.squad.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        category: category ?? existing.category,
        agents: agents
          ? {
              create: agents.map((a) => ({
                name: a.name,
                role: a.role,
                instructions: a.instructions,
                model: a.model ?? 'claude',
                order: a.order,
              })),
            }
          : undefined,
      },
      include: { agents: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json({ data: squad })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/squads/[id]'>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await ctx.params

    const existing = await prisma.squad.findFirst({ where: { id, userId: session.user.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Squad não encontrado' }, { status: 404 })
    }

    await prisma.squad.delete({ where: { id } })

    return NextResponse.json({ message: 'Squad deletado com sucesso' })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
