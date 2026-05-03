import SquadBuilder from '@/components/squad/SquadBuilder'

export default function NewSquadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Novo Squad</h1>
        <p className="text-sm text-[#888888] mt-1">Configure seu time de agentes IA</p>
      </div>
      <SquadBuilder />
    </div>
  )
}
