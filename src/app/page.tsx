import Link from 'next/link'
import { SQUAD_TEMPLATES } from '@/lib/templates'
import {
  CipherAvatar, NovaAvatar, BoltAvatar, SageAvatar,
  RexAvatar, LunaAvatar, TitanAvatar, EchoAvatar,
} from '@/lib/agent-avatars'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* ── Header ── */}
      <header className="border-b-2 border-[#1e1e3a] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-700 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.6)]">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span
            className="font-['Press_Start_2P'] text-sm text-white tracking-wider"
            style={{ textShadow: '0 0 10px rgba(124,58,237,0.8), 2px 2px 0 #000' }}
          >
            VELO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-['Press_Start_2P'] text-[8px] text-[#8888aa] hover:text-[#00f5ff] transition-colors tracking-wide"
          >
            ENTRAR
          </Link>
          <Link
            href="/register"
            className="font-['Press_Start_2P'] text-[8px] bg-purple-700 border-2 border-purple-500 text-white px-3 py-2 hover:bg-purple-600 hover:shadow-[0_0_12px_rgba(124,58,237,0.6)] transition-all shadow-[2px_2px_0_#000]"
          >
            COMEÇAR GRÁTIS
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">

        {/* Arcade coin prompt */}
        <div
          className="inline-flex items-center gap-2 border border-[#00f5ff] px-5 py-2 font-['Press_Start_2P'] text-[8px] text-[#00f5ff] mb-10 animate-glow-cyan"
          style={{ boxShadow: '0 0 12px rgba(0,245,255,0.3)' }}
        >
          <span className="animate-blink">·</span>
          INSERIR FICHA PARA CONTINUAR
          <span className="animate-blink">·</span>
        </div>

        {/* Title */}
        <h1
          className="font-['Press_Start_2P'] text-4xl md:text-5xl leading-tight mb-6 animate-glitch uppercase"
          style={{ textShadow: '3px 3px #ff006e, -3px -3px #00f5ff' }}
        >
          SEU TIME DE
          <br />
          <span style={{ color: '#c084fc', textShadow: '3px 3px #ff006e, -3px -3px #00f5ff, 0 0 30px rgba(192,132,252,0.5)' }}>
            AGENTES IA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#8888aa] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Monte squads de agentes com personalidade própria.
          Automatize tarefas complexas com a plataforma mais
          visualmente única do mercado.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
          <Link
            href="/register"
            className="font-['Press_Start_2P'] text-[10px] bg-purple-600 border-2 border-purple-400 text-white px-8 py-4 hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.6),4px_4px_0_#000] hover:shadow-[0_0_30px_rgba(124,58,237,0.9),4px_4px_0_#000]"
          >
            ► INSERIR FICHA
          </Link>
          <Link
            href="/login"
            className="font-['Press_Start_2P'] text-[10px] border-2 border-[#333355] text-[#8888aa] px-8 py-4 hover:border-[#8888aa] hover:text-white transition-all shadow-[4px_4px_0_#000]"
          >
            VER DEMO
          </Link>
        </div>

        {/* Agent showcase */}
        <div className="flex items-end justify-center gap-4 flex-wrap mb-6">
          {[
            { A: CipherAvatar, name: 'CIPHER', color: '#00f5ff' },
            { A: NovaAvatar,   name: 'NOVA',   color: '#ff006e' },
            { A: BoltAvatar,   name: 'BOLT',   color: '#ffd700' },
            { A: SageAvatar,   name: 'SAGE',   color: '#00ff88' },
            { A: RexAvatar,    name: 'REX',    color: '#ff6b35' },
            { A: LunaAvatar,   name: 'LUNA',   color: '#c084fc' },
            { A: TitanAvatar,  name: 'TITAN',  color: '#3b82f6' },
            { A: EchoAvatar,   name: 'ECHO',   color: '#ff3366' },
          ].map(({ A, name, color }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="border-2 p-1.5 bg-[#0f0f1a]"
                style={{ borderColor: color, boxShadow: `0 0 10px ${color}44` }}
              >
                <A size={56} animated />
              </div>
              <span
                className="font-['Press_Start_2P'] text-[6px] tracking-widest"
                style={{ color }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Counter */}
        <div className="font-['Press_Start_2P'] text-[7px] text-[#44445a] tracking-widest">
          · 1.337 EXECUÇÕES REALIZADAS HOJE
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-6 border-y-2 border-[#1e1e3a] bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <p className="font-['Press_Start_2P'] text-[8px] text-[#44445a] text-center mb-10 tracking-widest">
            COMO FUNCIONA
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'MONTE O SQUAD',  desc: 'Escolha os agentes e defina o papel de cada um na missão.', color: '#00f5ff' },
              { step: '02', title: 'DÊ O INPUT',      desc: 'Descreva a missão. Quanto mais detalhada, melhor o resultado.', color: '#ffd700' },
              { step: '03', title: 'VEJA EXECUTAR',   desc: 'Acompanhe cada agente em tempo real completando sua tarefa.', color: '#00ff88' },
            ].map((item) => (
              <div
                key={item.step}
                className="border-2 border-[#1e1e3a] bg-[#0f0f1a] p-5 hover:border-purple-500 transition-colors"
                style={{ boxShadow: '4px 4px 0 #000' }}
              >
                <div
                  className="font-['Press_Start_2P'] text-2xl mb-3"
                  style={{ color: item.color, textShadow: `0 0 10px ${item.color}88` }}
                >
                  {item.step}
                </div>
                <div className="font-['Press_Start_2P'] text-[8px] text-white mb-3 tracking-wide leading-5">{item.title}</div>
                <p className="text-[#8888aa] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-['Press_Start_2P'] text-[8px] text-[#44445a] text-center mb-2 tracking-widest">TEMPLATES PRONTOS</p>
          <p className="text-[#44445a] text-xs text-center mb-10">Comece com um squad pré-configurado ou crie o seu.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SQUAD_TEMPLATES.map((t) => (
              <div
                key={t.id}
                className="border-2 border-[#1e1e3a] bg-[#0f0f1a] p-4 hover:border-[#7c3aed] transition-colors"
                style={{ boxShadow: '3px 3px 0 #000' }}
              >
                <div className="font-['Press_Start_2P'] text-[8px] text-[#00f5ff] mb-2">{t.name.toUpperCase()}</div>
                <p className="text-[#8888aa] text-xs mb-4 leading-relaxed">{t.description}</p>
                <div className="space-y-1.5 border-t border-[#1e1e3a] pt-3">
                  {t.agents.map((a) => (
                    <div key={a.order} className="flex items-center gap-2">
                      <span className="font-['Press_Start_2P'] text-[6px] text-[#44445a]">{String(a.order).padStart(2,'0')}</span>
                      <span className="text-[11px] text-[#8888aa]">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-16 px-6 text-center border-t-2 border-[#1e1e3a] bg-[#080810]">
        <div
          className="font-['Press_Start_2P'] text-[10px] text-[#00ff88] mb-6 animate-mission-complete"
          style={{ textShadow: '0 0 15px rgba(0,255,136,0.8), 2px 2px 0 #000' }}
        >
          PRONTO PARA A MISSÃO?
        </div>
        <Link
          href="/register"
          className="inline-block font-['Press_Start_2P'] text-[9px] bg-purple-700 border-2 border-purple-500 text-white px-8 py-4 hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(124,58,237,0.5),4px_4px_0_#000] hover:shadow-[0_0_30px_rgba(124,58,237,0.8),4px_4px_0_#000]"
        >
          ► CRIAR SQUAD GRÁTIS
        </Link>
      </section>

      <footer className="border-t-2 border-[#1e1e3a] py-6 px-6 text-center">
        <span className="font-['Press_Start_2P'] text-[7px] text-[#44445a]">© 2026 VELO — ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  )
}
