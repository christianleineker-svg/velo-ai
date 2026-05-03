'use client'

export type AvatarStatus = 'idle' | 'thinking' | 'writing' | 'done' | 'error'

interface AvatarProps {
  size?: number
  animated?: boolean
  status?: AvatarStatus
}

/* ─────────────────────────────────────────
   STATUS OVERLAY HELPERS
───────────────────────────────────────── */

function ThinkingBubble() {
  return (
    <g className="animate-blink">
      <rect x="11" y="0" width="5" height="4" fill="#ffd700" />
      <text x="12" y="3.5" fontSize="3" fill="#000" fontFamily="monospace" fontWeight="bold">?</text>
    </g>
  )
}

function WritingDots() {
  return (
    <g>
      <rect x="13" y="5" width="2" height="2" fill="#00f5ff" className="animate-blink" style={{ animationDelay: '0ms' }} />
      <rect x="13" y="8" width="2" height="2" fill="#00f5ff" className="animate-blink" style={{ animationDelay: '200ms' }} />
      <rect x="13" y="11" width="2" height="2" fill="#00f5ff" className="animate-blink" style={{ animationDelay: '400ms' }} />
    </g>
  )
}

function DoneStars() {
  return (
    <g className="animate-star">
      <rect x="0" y="0" width="2" height="2" fill="#ffd700" />
      <rect x="14" y="1" width="2" height="2" fill="#ffd700" />
      <rect x="1" y="13" width="2" height="2" fill="#ffd700" />
      <rect x="13" y="12" width="2" height="2" fill="#ffd700" />
    </g>
  )
}

function AvatarWrapper({
  size, animated, status, color, children,
}: AvatarProps & { color: string; children: React.ReactNode }) {
  const isIdle = !status || status === 'idle'
  const isError = status === 'error'

  return (
    <div
      style={{ width: size, height: size, display: 'inline-block', flexShrink: 0 }}
      className={
        animated && isIdle ? 'animate-idle' :
        isError ? 'animate-blink' : ''
      }
    >
      <svg
        width={size} height={size}
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated', display: 'block' }}
        shapeRendering="crispEdges"
      >
        {isError && <rect x="0" y="0" width="16" height="16" fill="#ff336622" />}
        {children}
        {status === 'thinking' && <ThinkingBubble />}
        {status === 'writing' && <WritingDots />}
        {status === 'done' && <DoneStars />}
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────
   1. CIPHER — Hacker/Pesquisador — Cyan
───────────────────────────────────────── */
export function CipherAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#00f5ff'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Capuz esquerdo */}
      <rect x="2" y="1" width="2" height="5" fill="#334155" />
      {/* Capuz direito */}
      <rect x="12" y="1" width="2" height="5" fill="#334155" />
      {/* Cabeça */}
      <rect x="4" y="1" width="8" height="7" fill={c} />
      {/* Óculos esquerdo */}
      <rect x="4" y="3" width="3" height="2" fill="#000" />
      {/* Óculos direito */}
      <rect x="9" y="3" width="3" height="2" fill="#000" />
      {/* Ponte dos óculos */}
      <rect x="7" y="4" width="2" height="1" fill={c} />
      {/* Boca */}
      <rect x="6" y="7" width="4" height="1" fill="#003344" />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill={c} />
      {/* Corpo */}
      <rect x="3" y="9" width="10" height="5" fill="#1a1a2e" />
      {/* Logo no peito */}
      <rect x="6" y="10" width="4" height="1" fill={c} />
      <rect x="6" y="12" width="4" height="1" fill={c} />
      {/* Braço esquerdo */}
      <rect x="1" y="9" width="2" height="4" fill="#1a1a2e" />
      {/* Braço direito */}
      <rect x="13" y="9" width="2" height="4" fill="#1a1a2e" />
      {/* Mão direita (teclando) */}
      <rect x="14" y="12" width="2" height="2" fill={c} />
      {/* Pernas */}
      <rect x="4" y="14" width="3" height="2" fill="#334155" />
      <rect x="9" y="14" width="3" height="2" fill="#334155" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   2. NOVA — Redatora/Escritora — Pink
───────────────────────────────────────── */
export function NovaAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#ff006e'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Cabelo topo */}
      <rect x="3" y="0" width="10" height="2" fill={c} />
      {/* Cabelo lateral */}
      <rect x="2" y="2" width="2" height="6" fill={c} />
      <rect x="12" y="2" width="2" height="8" fill={c} />
      {/* Cabeça */}
      <rect x="4" y="2" width="8" height="6" fill="#ffe0d0" />
      {/* Olhos */}
      <rect x="5" y="4" width="2" height="1" fill="#3d0021" />
      <rect x="9" y="4" width="2" height="1" fill="#3d0021" />
      {/* Bochecha */}
      <rect x="5" y="6" width="1" height="1" fill="#ffb3cc" />
      <rect x="10" y="6" width="1" height="1" fill="#ffb3cc" />
      {/* Boca sorriso */}
      <rect x="6" y="7" width="4" height="1" fill={c} />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill="#ffe0d0" />
      {/* Corpo */}
      <rect x="3" y="9" width="10" height="5" fill="#cc0057" />
      {/* Caneta na mão dir */}
      <rect x="14" y="8" width="1" height="6" fill="#ffd700" />
      <rect x="14" y="7" width="1" height="1" fill="#fff" />
      {/* Braço esquerdo */}
      <rect x="1" y="9" width="2" height="4" fill="#cc0057" />
      {/* Braço direito */}
      <rect x="13" y="9" width="2" height="4" fill="#cc0057" />
      {/* Saia */}
      <rect x="2" y="14" width="12" height="2" fill="#ff3399" />
      {/* Sapatos */}
      <rect x="3" y="15" width="3" height="1" fill="#000" />
      <rect x="10" y="15" width="3" height="1" fill="#000" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   3. BOLT — Desenvolvedor — Yellow
───────────────────────────────────────── */
export function BoltAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#ffd700'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Capacete */}
      <rect x="3" y="0" width="10" height="3" fill={c} />
      <rect x="2" y="1" width="2" height="3" fill={c} />
      <rect x="12" y="1" width="2" height="3" fill={c} />
      {/* Viseira */}
      <rect x="3" y="3" width="10" height="2" fill="#00aaff" />
      {/* Cabeça */}
      <rect x="4" y="3" width="8" height="5" fill="#d4a574" />
      {/* Olhos */}
      <rect x="5" y="4" width="2" height="2" fill="#003366" />
      <rect x="9" y="4" width="2" height="2" fill="#003366" />
      {/* Boca */}
      <rect x="6" y="7" width="4" height="1" fill="#8b5e3c" />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill="#d4a574" />
      {/* Corpo */}
      <rect x="3" y="9" width="10" height="5" fill="#1a3a5c" />
      {/* Raio no peito */}
      <rect x="7" y="10" width="2" height="3" fill={c} />
      <rect x="6" y="11" width="4" height="1" fill={c} />
      {/* Braços */}
      <rect x="1" y="9" width="2" height="4" fill="#1a3a5c" />
      <rect x="13" y="9" width="2" height="4" fill="#1a3a5c" />
      {/* Luvas */}
      <rect x="0" y="12" width="2" height="2" fill={c} />
      <rect x="14" y="12" width="2" height="2" fill={c} />
      {/* Pernas */}
      <rect x="4" y="14" width="3" height="2" fill="#0d2136" />
      <rect x="9" y="14" width="3" height="2" fill="#0d2136" />
      {/* Botas */}
      <rect x="3" y="15" width="4" height="1" fill={c} />
      <rect x="9" y="15" width="4" height="1" fill={c} />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   4. SAGE — Estrategista/Analista — Green
───────────────────────────────────────── */
export function SageAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#00ff88'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Chapéu/cabelo */}
      <rect x="3" y="0" width="10" height="2" fill="#2d6a4f" />
      {/* Cabeça */}
      <rect x="4" y="2" width="8" height="6" fill="#c8a882" />
      {/* Barba */}
      <rect x="4" y="6" width="8" height="2" fill="#eee" />
      <rect x="3" y="5" width="2" height="3" fill="#eee" />
      <rect x="11" y="5" width="2" height="3" fill="#eee" />
      {/* Olhos */}
      <rect x="5" y="3" width="2" height="2" fill="#1a0a00" />
      <rect x="9" y="3" width="2" height="2" fill="#1a0a00" />
      {/* Sobrancelha */}
      <rect x="5" y="2" width="2" height="1" fill="#555" />
      <rect x="9" y="2" width="2" height="1" fill="#555" />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill="#c8a882" />
      {/* Corpo (veste) */}
      <rect x="3" y="9" width="10" height="5" fill="#1b4332" />
      {/* Detalhe gola */}
      <rect x="6" y="9" width="4" height="2" fill={c} />
      {/* Livro na mão esquerda */}
      <rect x="0" y="9" width="3" height="4" fill={c} />
      <rect x="1" y="10" width="1" height="2" fill="#003322" />
      {/* Braço esquerdo */}
      <rect x="1" y="9" width="2" height="4" fill="#1b4332" />
      {/* Braço direito */}
      <rect x="13" y="9" width="2" height="4" fill="#1b4332" />
      {/* Pernas */}
      <rect x="4" y="14" width="3" height="2" fill="#0d2118" />
      <rect x="9" y="14" width="3" height="2" fill="#0d2118" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   5. REX — Revisor/QA — Orange
───────────────────────────────────────── */
export function RexAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#ff6b35'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Cabeça */}
      <rect x="4" y="1" width="8" height="7" fill="#d4a574" />
      {/* Cabelo curto */}
      <rect x="4" y="1" width="8" height="2" fill="#3d2b1f" />
      {/* Sobrancelha franzida */}
      <rect x="5" y="3" width="2" height="1" fill="#1a0a00" />
      <rect x="9" y="3" width="2" height="1" fill="#1a0a00" />
      {/* Olhos sérios */}
      <rect x="5" y="4" width="2" height="1" fill="#1a0a00" />
      <rect x="9" y="4" width="2" height="1" fill="#1a0a00" />
      {/* Linha fronha (expressão séria) */}
      <rect x="6" y="3" width="2" height="1" fill="#d4a574" />
      <rect x="8" y="3" width="2" height="1" fill="#d4a574" />
      {/* Boca reta */}
      <rect x="6" y="7" width="4" height="1" fill="#8b5e3c" />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill="#d4a574" />
      {/* Corpo */}
      <rect x="3" y="9" width="10" height="5" fill="#cc4400" />
      {/* Distintivo */}
      <rect x="5" y="10" width="2" height="2" fill={c} />
      <rect x="6" y="11" width="1" height="1" fill="#fff" />
      {/* Lupa mão dir */}
      <rect x="13" y="8" width="3" height="3" fill="none" stroke={c} strokeWidth="1" />
      <rect x="13" y="8" width="3" height="3" fill="transparent" />
      <rect x="14" y="9" width="1" height="1" fill="#fff2" />
      <rect x="15" y="11" width="1" height="2" fill={c} />
      {/* Braços */}
      <rect x="1" y="9" width="2" height="4" fill="#cc4400" />
      <rect x="13" y="9" width="2" height="4" fill="#cc4400" />
      {/* Pernas */}
      <rect x="4" y="14" width="3" height="2" fill="#661a00" />
      <rect x="9" y="14" width="3" height="2" fill="#661a00" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   6. LUNA — Criativa/Designer — Lilac
───────────────────────────────────────── */
export function LunaAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#c084fc'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Estrelas flutuantes */}
      <rect x="0" y="2" width="2" height="2" fill={c} className="animate-blink" />
      <rect x="14" y="4" width="2" height="2" fill={c} className="animate-blink" style={{ animationDelay: '400ms' }} />
      <rect x="1" y="12" width="1" height="1" fill={c} className="animate-blink" style={{ animationDelay: '200ms' }} />
      {/* Cabelo mágico */}
      <rect x="3" y="0" width="10" height="3" fill="#7c3aed" />
      <rect x="2" y="1" width="2" height="5" fill="#7c3aed" />
      <rect x="12" y="1" width="2" height="7" fill={c} />
      {/* Cabeça */}
      <rect x="4" y="3" width="8" height="5" fill="#f0e0ff" />
      {/* Olhos brilhantes */}
      <rect x="5" y="4" width="2" height="2" fill="#7c3aed" />
      <rect x="9" y="4" width="2" height="2" fill="#7c3aed" />
      <rect x="5" y="4" width="1" height="1" fill="#fff" />
      <rect x="9" y="4" width="1" height="1" fill="#fff" />
      {/* Sorriso */}
      <rect x="6" y="7" width="4" height="1" fill={c} />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill="#f0e0ff" />
      {/* Corpo vestido */}
      <rect x="3" y="9" width="10" height="5" fill="#7c3aed" />
      {/* Detalhe vestido */}
      <rect x="5" y="10" width="6" height="1" fill={c} />
      <rect x="6" y="12" width="4" height="1" fill={c} />
      {/* Braços */}
      <rect x="1" y="9" width="2" height="4" fill="#7c3aed" />
      <rect x="13" y="9" width="2" height="4" fill="#7c3aed" />
      {/* Varinha mágica */}
      <rect x="14" y="7" width="1" height="5" fill="#ffd700" />
      <rect x="14" y="6" width="2" height="2" fill="#fff" />
      {/* Saia */}
      <rect x="2" y="14" width="12" height="2" fill="#9d4edd" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   7. TITAN — Arquiteto — Blue
───────────────────────────────────────── */
export function TitanAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#3b82f6'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Cabeça grande */}
      <rect x="4" y="1" width="8" height="7" fill="#d4a574" />
      {/* Cabelo curto */}
      <rect x="4" y="1" width="8" height="2" fill="#2c3e50" />
      {/* Olhos determinados */}
      <rect x="5" y="3" width="3" height="2" fill="#1a3a6e" />
      <rect x="9" y="3" width="3" height="2" fill="#1a3a6e" />
      <rect x="5" y="3" width="1" height="1" fill="#6ab0ff" />
      <rect x="9" y="3" width="1" height="1" fill="#6ab0ff" />
      {/* Boca confiante */}
      <rect x="6" y="7" width="5" height="1" fill="#8b5e3c" />
      {/* Pescoço largo */}
      <rect x="5" y="8" width="6" height="1" fill="#d4a574" />
      {/* Ombros largos */}
      <rect x="0" y="9" width="16" height="2" fill={c} />
      {/* Corpo robusto */}
      <rect x="2" y="11" width="12" height="3" fill={c} />
      {/* Planta/blueprint */}
      <rect x="1" y="10" width="3" height="4" fill="#fff" />
      <rect x="2" y="11" width="1" height="2" fill={c} />
      <rect x="1" y="10" width="3" height="1" fill="#eee" />
      {/* Cinturão */}
      <rect x="2" y="13" width="12" height="1" fill="#ffd700" />
      {/* Pernas */}
      <rect x="4" y="14" width="3" height="2" fill="#1d4ed8" />
      <rect x="9" y="14" width="3" height="2" fill="#1d4ed8" />
      {/* Botas */}
      <rect x="3" y="15" width="5" height="1" fill="#0f2d6e" />
      <rect x="8" y="15" width="5" height="1" fill="#0f2d6e" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   8. ECHO — Marketing/Copywriter — Red
───────────────────────────────────────── */
export function EchoAvatar({ size = 48, animated = false, status = 'idle' }: AvatarProps) {
  const c = '#ff3366'
  return (
    <AvatarWrapper size={size} animated={animated} status={status} color={c}>
      {/* Cabelo estiloso */}
      <rect x="3" y="0" width="10" height="3" fill={c} />
      <rect x="2" y="1" width="2" height="3" fill={c} />
      <rect x="11" y="0" width="3" height="5" fill={c} />
      {/* Cabeça */}
      <rect x="4" y="3" width="8" height="5" fill="#d4a574" />
      {/* Óculos de sol */}
      <rect x="4" y="4" width="3" height="2" fill="#000" />
      <rect x="9" y="4" width="3" height="2" fill="#000" />
      <rect x="7" y="5" width="2" height="1" fill="#222" />
      {/* Sorriso confiante */}
      <rect x="5" y="7" width="6" height="1" fill={c} />
      {/* Pescoço */}
      <rect x="6" y="8" width="4" height="1" fill="#d4a574" />
      {/* Corpo */}
      <rect x="3" y="9" width="10" height="5" fill="#9a0027" />
      {/* Gravata */}
      <rect x="7" y="9" width="2" height="4" fill={c} />
      {/* Megafone */}
      <rect x="0" y="8" width="2" height="2" fill={c} />
      <rect x="0" y="7" width="3" height="1" fill={c} />
      <rect x="0" y="10" width="3" height="1" fill={c} />
      <rect x="0" y="8" width="1" height="2" fill="#ffd700" />
      {/* Ondas de som */}
      <rect x="0" y="6" width="1" height="1" fill={c} className="animate-blink" />
      {/* Braços */}
      <rect x="1" y="9" width="2" height="4" fill="#9a0027" />
      <rect x="13" y="9" width="2" height="4" fill="#9a0027" />
      {/* Pernas */}
      <rect x="4" y="14" width="3" height="2" fill="#5a0015" />
      <rect x="9" y="14" width="3" height="2" fill="#5a0015" />
    </AvatarWrapper>
  )
}

/* ─────────────────────────────────────────
   CHARACTER REGISTRY
───────────────────────────────────────── */

export interface AgentCharacter {
  id: number
  name: string
  color: string
  role: string
  AvatarComponent: React.ComponentType<AvatarProps>
}

export const AGENT_CHARACTERS: AgentCharacter[] = [
  { id: 0, name: 'CIPHER', color: '#00f5ff', role: 'Hacker / Pesquisador', AvatarComponent: CipherAvatar },
  { id: 1, name: 'NOVA',   color: '#ff006e', role: 'Redatora / Escritora',  AvatarComponent: NovaAvatar   },
  { id: 2, name: 'BOLT',   color: '#ffd700', role: 'Desenvolvedor',          AvatarComponent: BoltAvatar   },
  { id: 3, name: 'SAGE',   color: '#00ff88', role: 'Estrategista / Analista', AvatarComponent: SageAvatar  },
  { id: 4, name: 'REX',    color: '#ff6b35', role: 'Revisor / QA',           AvatarComponent: RexAvatar    },
  { id: 5, name: 'LUNA',   color: '#c084fc', role: 'Criativa / Designer',    AvatarComponent: LunaAvatar   },
  { id: 6, name: 'TITAN',  color: '#3b82f6', role: 'Arquiteto',              AvatarComponent: TitanAvatar  },
  { id: 7, name: 'ECHO',   color: '#ff3366', role: 'Marketing / Copywriter', AvatarComponent: EchoAvatar   },
]

const EXTRA_NAMES = ['ZERO', 'APEX', 'FLUX', 'GRID', 'AXIS', 'CORE', 'PIKE', 'ZETA']

export function getAvatarByName(name: string): AgentCharacter {
  const upper = name.toUpperCase().trim()
  const found = AGENT_CHARACTERS.find((c) => c.name === upper)
  if (found) return found
  // Hash name to deterministic character
  let hash = 0
  for (let i = 0; i < upper.length; i++) hash = (hash * 31 + upper.charCodeAt(i)) & 0xffff
  return AGENT_CHARACTERS[hash % AGENT_CHARACTERS.length]
}

export function getAvatarById(id: number): AgentCharacter {
  return AGENT_CHARACTERS[Math.abs(id) % AGENT_CHARACTERS.length]
}

export const SUGGESTED_NAMES = [
  ...AGENT_CHARACTERS.map((c) => c.name),
  ...EXTRA_NAMES,
]
