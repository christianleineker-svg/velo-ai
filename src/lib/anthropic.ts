import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function runAgentWithClaude(
  agentName: string,
  role: string,
  instructions: string,
  input: string,
  previousOutputs: string
): Promise<string> {
  const message = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Você é ${agentName}, um agente especializado com o seguinte papel: ${role}

Suas instruções específicas:
${instructions}

${previousOutputs ? `Contexto dos agentes anteriores:\n${previousOutputs}\n` : ''}

Input do usuário:
${input}

Execute sua tarefa com precisão e profundidade. Entregue um resultado completo.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') return content.text
  return ''
}
