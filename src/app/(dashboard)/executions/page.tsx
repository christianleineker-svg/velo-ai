import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ExecutionCard from '@/components/squad/ExecutionCard'
import { Execution } from '@/types'

export default async function ExecutionsPage() {
  const session = await getServerSession(authOptions)

  const executions = await prisma.execution.findMany({
    where: { userId: session!.user!.id as string },
    include: { squad: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Execuções</h1>
        <p className="text-sm text-[#888888] mt-1">{executions.length} execuçõe{executions.length !== 1 ? 's' : ''} no total</p>
      </div>

      {executions.length === 0 ? (
        <div className="bg-[#111111] border border-dashed border-[#333333] rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⚡</div>
          <h3 className="text-white font-semibold mb-2">Nenhuma execução ainda</h3>
          <p className="text-[#555555] text-sm">Execute um squad para ver o histórico aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {executions.map((exec) => (
            <ExecutionCard
              key={exec.id}
              execution={exec as Execution & { squad: { id: string; name: string } }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
