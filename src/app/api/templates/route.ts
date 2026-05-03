import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SQUAD_TEMPLATES } from '@/lib/templates'

export async function GET() {
  return NextResponse.json({ data: SQUAD_TEMPLATES })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = (await request.json()) as { templateId: string }
    const template = SQUAD_TEMPLATES.find((t) => t.id === body.templateId)

    if (!template) {
      return NextResponse.json({ error: 'Template não encontrado' }, { status: 404 })
    }

    const squad = await prisma.squad.create({
      data: {
        name: template.name,
        description: template.description,
        category: template.category,
        userId: session.user.id,
        agents: {
          create: template.agents.map((a: { name: string; role: string; instructions: string; model: string; order: number }) => ({
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

    return NextResponse.json({ data: squad }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
