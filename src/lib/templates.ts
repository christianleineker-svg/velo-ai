import { SquadTemplate } from '@/types'

export const SQUAD_TEMPLATES: SquadTemplate[] = [
  {
    id: 'content',
    name: 'Squad de Conteúdo',
    description: 'Cria conteúdo completo do planejamento à publicação',
    category: 'Conteúdo',
    agents: [
      {
        name: 'Pesquisador',
        role: 'Especialista em pesquisa e estruturação de informações',
        instructions:
          'Pesquise profundamente sobre o tema fornecido. Identifique os pontos mais relevantes, dados, estatísticas e ângulos interessantes. Estruture suas descobertas de forma clara e organizada. Foque em informações precisas e úteis que embasarão o conteúdo.',
        order: 1,
        model: 'claude',
      },
      {
        name: 'Redator',
        role: 'Escritor especialista em criar conteúdo envolvente',
        instructions:
          'Com base na pesquisa fornecida, escreva um conteúdo completo, fluido e envolvente. Use linguagem adequada ao público, parágrafos bem estruturados, títulos e subtítulos quando necessário. O conteúdo deve ser informativo, original e de alta qualidade.',
        order: 2,
        model: 'claude',
      },
      {
        name: 'Revisor',
        role: 'Editor especialista em qualidade e otimização de conteúdo',
        instructions:
          'Revise o conteúdo produzido corrigindo erros gramaticais, melhorando a fluidez, eliminando repetições e garantindo coerência. Adicione melhorias de SEO se pertinente. Entregue a versão final polida e pronta para publicação.',
        order: 3,
        model: 'claude',
      },
    ],
  },
  {
    id: 'development',
    name: 'Squad de Desenvolvimento',
    description: 'Planeja, codifica e revisa software com qualidade',
    category: 'Desenvolvimento',
    agents: [
      {
        name: 'Arquiteto',
        role: 'Arquiteto de software especialista em design de sistemas',
        instructions:
          'Analise o problema técnico descrito e defina a melhor solução arquitetural. Descreva: stack recomendada, estrutura de arquivos, padrões de design a usar, fluxo de dados, e principais componentes a implementar. Seja específico e pragmático.',
        order: 1,
        model: 'claude',
      },
      {
        name: 'Desenvolvedor',
        role: 'Desenvolvedor sênior especialista em implementação',
        instructions:
          'Com base na arquitetura definida, implemente o código completo e funcional. Escreva código limpo, bem comentado e seguindo boas práticas. Inclua tratamento de erros, tipagem adequada e siga os padrões definidos pelo arquiteto.',
        order: 2,
        model: 'claude',
      },
      {
        name: 'QA Engineer',
        role: 'Especialista em qualidade e revisão de código',
        instructions:
          'Revise o código implementado identificando: bugs potenciais, problemas de segurança, oportunidades de melhoria de performance, e falta de casos extremos. Sugira melhorias concretas e escreva testes unitários para as funções principais.',
        order: 3,
        model: 'claude',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Squad de Marketing',
    description: 'Cria estratégias e copies de marketing completos',
    category: 'Marketing',
    agents: [
      {
        name: 'Estrategista',
        role: 'Especialista em estratégia de marketing digital',
        instructions:
          'Analise o produto, serviço ou campanha descrita. Defina: público-alvo ideal, proposta de valor única, canais recomendados, tom de comunicação e ângulos de abordagem mais eficazes. Embase suas recomendações em boas práticas de marketing.',
        order: 1,
        model: 'claude',
      },
      {
        name: 'Copywriter',
        role: 'Especialista em escrita persuasiva e copywriting',
        instructions:
          'Com base na estratégia definida, escreva copies completos: headline principal, subheadline, body copy, CTAs, e variações para testes A/B. Use técnicas de copywriting como AIDA, PAS e prova social. O copy deve converter e engajar.',
        order: 2,
        model: 'claude',
      },
      {
        name: 'Analista',
        role: 'Analista de métricas e otimização de campanhas',
        instructions:
          'Revise toda a estratégia e copies produzidos. Sugira KPIs para medir o sucesso, possíveis melhorias, pontos fracos da abordagem e oportunidades não exploradas. Entregue um plano de ação prioritizado para implementação.',
        order: 3,
        model: 'claude',
      },
    ],
  },
]
