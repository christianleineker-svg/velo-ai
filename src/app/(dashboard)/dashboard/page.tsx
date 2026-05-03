import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SquadCard from '@/components/squad/SquadCard'
import ExecutionCard from '@/components/squad/ExecutionCard'
import { Squad, Execution } from '@/types'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user!.id as string

  const [squads, executions] = await Promise.all([
    prisma.squad.findMany({
      where: { userId },
      include: { agents: { orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.execution.findMany({
      where: { userId },
      include: { squad: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const todayExecs = executions.filter((e: { createdAt: Date }) => {
    const d = new Date(e.createdAt)
    const now = new Date()
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
  })

  const totalAgents = squads.reduce((sum: number, s) => sum + s.agents.length, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Olá, {session?.user?.name?.split(' ')[0] ?? 'Usuário'} 👋
        </h1>
        <p className="text-[#888888] text-sm mt-1">Bem-vindo ao Velo. Seus agentes estão prontos para trabalhar.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de squads', value: squads.length, icon: '🤖' },
          { label: 'Execuções hoje', value: todayExecs.length, icon: '⚡' },
          { label: 'Agentes criados', value: totalAgents, icon: '🧠' },
        ].map((m) => (
          <div key={m.label} className="bg-[#111111] border border-[#222222] rounded-xl p-4">
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className="text-2xl font-bold text-white">{m.value}</div>
            <div className="text-xs text-[#888888]">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Squads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Seus Squads</h2>
          <Link href="/squads" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Ver todos →
          </Link>
        </div>
        {squads.length === 0 ? (
          <div className="bg-[#111111] border border-dashed border-[#333333] rounded-xl p-8 text-center">
            <p className="text-[#555555] text-sm mb-4">Você ainda não tem squads. Crie o seu primeiro!</p>
            <Link
              href="/squads/new"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Criar Squad
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {squads.map((squad) => (
              <SquadCard key={squad.id} squad={squad as Squad} />
            ))}
          </div>
        )}
      </div>

      {/* Executions */}
      {executions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Execuções Recentes</h2>
            <Link href="/executions" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {executions.slice(0, 4).map((exec) => (
              <ExecutionCard key={exec.id} execution={exec as Execution & { squad: { id: string; name: string } }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
