export interface User {
  id: string
  email: string
  name?: string | null
  plan: string
  createdAt: Date
}

export interface Agent {
  id: string
  name: string
  role: string
  instructions: string
  model: string
  order: number
  squadId: string
}

export interface Squad {
  id: string
  name: string
  description?: string | null
  category: string
  userId: string
  agents: Agent[]
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Execution {
  id: string
  squadId: string
  userId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  input: string
  output?: string | null
  logs: string
  tokensUsed: number
  createdAt: Date
  updatedAt: Date
  squad?: Squad
}

export interface ExecutionLog {
  agentName: string
  role: string
  status: 'thinking' | 'writing' | 'done' | 'error'
  content: string
  timestamp: number
}

export interface SSEEvent {
  type: 'agent_start' | 'agent_output' | 'agent_done' | 'squad_done' | 'error'
  agentName?: string
  role?: string
  status?: string
  content?: string
  output?: string
  error?: string
}

export interface SquadTemplate {
  id: string
  name: string
  description: string
  category: string
  agents: Array<{
    name: string
    role: string
    instructions: string
    order: number
    model: string
  }>
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}
