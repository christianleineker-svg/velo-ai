import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getClient(): PrismaClient {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
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
