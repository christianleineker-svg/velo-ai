import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SquadCard from '@/components/squad/SquadCard'
import { Squad } from '@/types'

export default async function SquadsPage() {
  const session = await getServerSession(authOptions)
  const squads = await prisma.squad.findMany({
    where: { userId: session!.user!.id as string },
    include: { agents: { orderBy: { order: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Squads</h1>
          <p className="text-sm text-[#888888] mt-1">{squads.length} squad{squads.length !== 1 ? 's' : ''} no total</p>
        </div>
        <Link
          href="/squads/new"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Novo Squad
        </Link>
      </div>

      {squads.length === 0 ? (
        <div className="bg-[#111111] border border-dashed border-[#333333] rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
          <h3 className="text-white font-semibold mb-2">Nenhum squad ainda</h3>
          <p className="text-[#555555] text-sm mb-6">Crie seu primeiro squad ou comece com um template.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/squads/new" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Criar Squad
            </Link>
            <Link href="/templates" className="border border-[#333333] hover:border-[#444444] text-[#888888] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Ver Templates
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squads.map((squad) => (
            <SquadCard key={squad.id} squad={squad as Squad} />
          ))}
        </div>
      )}
    </div>
  )
}
