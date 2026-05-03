import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SquadRunner from './SquadRunner'
import { Squad } from '@/types'

export default async function SquadPage(props: PageProps<'/squads/[id]'>) {
  const { id } = await props.params
  const session = await getServerSession(authOptions)

  const squad = await prisma.squad.findFirst({
    where: { id, userId: session!.user!.id as string },
    include: { agents: { orderBy: { order: 'asc' } } },
  })

  if (!squad) notFound()

  return <SquadRunner squad={squad as Squad} />
}
