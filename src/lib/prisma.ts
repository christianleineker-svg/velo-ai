import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getClient(): PrismaClient {
  if (!global.prisma) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL não está definida')
    global.prisma = new PrismaClient({ datasourceUrl: url })
  }
  return global.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') {
      return (value as Function).bind(client)
    }
    return value
  },
})
