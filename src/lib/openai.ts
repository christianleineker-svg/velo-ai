import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function suggestAgentsForSquad(
  squadName: string,
  description: string
): Promise<Array<{ name: string; role: string; instructions: string }>> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Você é um especialista em criar squads de agentes de IA. Responda sempre em JSON válido.',
      },
      {
        role: 'user',
        content: `Crie 3 agentes ideais para um squad chamado "${squadName}" com descrição: "${description}".

Retorne um JSON array com objetos contendo: name (nome do agente), role (papel em uma linha), instructions (instruções detalhadas de como o agente deve agir).

Exemplo de formato:
{"agents":[{"name":"Pesquisador","role":"Especialista em pesquisa e análise de dados","instructions":"Você pesquisa e estrutura informações..."}]}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0].message.content
  if (!content) return []

  try {
    const parsed = JSON.parse(content) as { agents?: Array<{ name: string; role: string; instructions: string }> }
    return parsed.agents ?? []
  } catch {
    return []
  }
}
