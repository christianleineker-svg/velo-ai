import { Execution } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'

interface ExecutionCardProps {
  execution: Execution & { squad?: { id: string; name: string } | null }
}

const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  pending: { label: 'Pendente', variant: 'warning' },
  running: { label: 'Executando', variant: 'info' },
  completed: { label: 'Concluído', variant: 'success' },
  failed: { label: 'Falhou', variant: 'error' },
}

export default function ExecutionCard({ execution }: ExecutionCardProps) {
  const s = statusMap[execution.status] ?? { label: execution.status, variant: 'default' }

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-medium text-white">{execution.squad?.name ?? 'Squad'}</p>
          <p className="text-xs text-[#555555] mt-0.5">{formatDateTime(execution.createdAt)}</p>
        </div>
        <Badge variant={s.variant}>{s.label}</Badge>
      </div>

      <p className="text-xs text-[#888888] line-clamp-2 mb-2">{execution.input}</p>

      {execution.output && (
        <p className="text-xs text-[#555555] italic line-clamp-1">{execution.output}</p>
      )}
    </div>
  )
}
