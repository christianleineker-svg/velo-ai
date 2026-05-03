import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Badge from '@/components/ui/Badge'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id as string },
    select: { id: true, email: true, name: true, plan: true, createdAt: true },
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-[#888888] mt-1">Informações da sua conta</p>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Perfil</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Nome', value: user?.name ?? '—' },
            { label: 'Email', value: user?.email },
            { label: 'Plano', value: <Badge variant="purple">{user?.plan ?? 'free'}</Badge> },
            {
              label: 'Membro desde',
              value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                : '—',
            },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-xs text-[#555555] mb-1">{field.label}</p>
              <p className="text-sm text-white">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white">Chaves de API</h2>
        <p className="text-sm text-[#888888]">
          Configure as chaves de API no arquivo <code className="text-purple-400 text-xs">.env.local</code> na raiz do projeto.
        </p>
        <div className="space-y-2 text-xs font-mono bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
          <p className="text-[#888888]">ANTHROPIC_API_KEY=sk-ant-...</p>
          <p className="text-[#888888]">OPENAI_API_KEY=sk-proj-...</p>
        </div>
      </div>
    </div>
  )
}
