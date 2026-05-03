import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, ctx: RouteContext<'/api/squads/[id]/duplicate'>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await ctx.params

    const original = await prisma.squad.findFirst({
      where: { id, userId: session.user.id },
      include: { agents: { orderBy: { order: 'asc' } } },
    })

    if (!original) {
      return NextResponse.json({ error: 'Squad não encontrado' }, { status: 404 })
    }

    const duplicate = await prisma.squad.create({
      data: {
        name: `${original.name} (cópia)`,
        description: original.description,
        category: original.category,
        userId: session.user.id,
        agents: {
          create: original.agents.map((a) => ({
            name: a.name,
            role: a.role,
            instructions: a.instructions,
            model: a.model,
            order: a.order,
          })),
        },
      },
      include: { agents: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json({ data: duplicate }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
