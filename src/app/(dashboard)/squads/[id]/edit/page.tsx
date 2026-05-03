import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SquadBuilder from '@/components/squad/SquadBuilder'
import { Agent } from '@/types'

export default async function EditSquadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const squad = await prisma.squad.findFirst({
    where: { id, userId: session!.user!.id as string },
    include: { agents: { orderBy: { order: 'asc' } } },
  })

  if (!squad) notFound()

  const agents = squad.agents as unknown as Agent[]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Editar Squad</h1>
        <p className="text-sm text-[#888888] mt-1">{squad.name}</p>
      </div>
      <SquadBuilder
        initialData={{
          id: squad.id,
          name: squad.name,
          description: squad.description ?? undefined,
          category: squad.category,
          agents: agents.map((a) => ({
            id: a.id,
            name: a.name,
            role: a.role,
            instructions: a.instructions,
            model: a.model,
            order: a.order,
          })),
        }}
      />
    </div>
  )
}
