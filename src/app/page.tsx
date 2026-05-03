import Link from 'next/link'
import { SQUAD_TEMPLATES } from '@/lib/templates'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#222222] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-lg">Velo</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#888888] hover:text-white transition-colors">
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-600/20 rounded-full px-4 py-1.5 text-sm text-purple-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Plataforma de Agentes IA
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-br from-white to-[#888888] bg-clip-text text-transparent">
            Seu time de agentes IA
            <br />
            trabalhando por você
          </h1>
          <p className="text-xl text-[#888888] mb-10 max-w-2xl mx-auto">
            Crie squads de agentes especializados que executam tarefas em sequência. Pesquisador, redator, revisor, dev, QA — todos trabalhando juntos em tempo real.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Começar grátis
            </Link>
            <Link
              href="/login"
              className="border border-[#333333] hover:border-[#444444] text-[#888888] hover:text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-[#080808] border-y border-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Escolha um template',
                  desc: 'Use um dos nossos squads pré-configurados ou crie o seu do zero com os agentes que precisar.',
                },
                {
                  step: '02',
                  title: 'Configure o input',
                  desc: 'Descreva o que os agentes devem fazer. Quanto mais detalhado, melhor o resultado.',
                },
                {
                  step: '03',
                  title: 'Veja os agentes trabalhando',
                  desc: 'Acompanhe em tempo real cada agente executando sua tarefa em sequência.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-purple-600/10 border border-purple-600/20 rounded-xl flex items-center justify-center text-purple-400 font-bold text-sm mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[#888888] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Templates prontos</h2>
          <p className="text-[#888888] text-center mb-12">Comece com um squad pré-configurado ou crie o seu.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SQUAD_TEMPLATES.map((t) => (
              <div key={t.id} className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-purple-600/40 transition-colors">
                <h3 className="text-base font-semibold text-white mb-2">{t.name}</h3>
                <p className="text-sm text-[#888888] mb-4">{t.description}</p>
                <div className="space-y-1.5">
                  {t.agents.map((a) => (
                    <div key={a.order} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-purple-600/10 rounded flex items-center justify-center text-xs text-purple-400 font-bold">
                        {a.order}
                      </div>
                      <span className="text-xs text-[#888888]">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-[#888888] mb-8">Crie seu squad gratuito agora e veja seus agentes trabalhando.</p>
          <Link
            href="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg inline-block"
          >
            Criar conta grátis
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#1a1a1a] py-8 px-6 text-center text-[#555555] text-sm">
        <p>© 2026 Velo. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
