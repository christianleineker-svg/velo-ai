import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SquadRunner from './SquadRunner'
import { Squad } from '@/types'

export default async function SquadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const squadRaw = await prisma.squad.findFirst({
    where: { id, userId: session!.user!.id as string },
    include: { agents: { orderBy: { order: 'asc' } } },
  })

  if (!squadRaw) notFound()

  return <SquadRunner squad={squadRaw as unknown as Squad} />
}
