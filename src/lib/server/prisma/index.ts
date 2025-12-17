import { PrismaClient } from './generated/client'
import { env } from '$env/dynamic/private'
import { useAdapter } from './adapter'

const prisma = new PrismaClient({ adapter: useAdapter(env.DATABASE_URL) })

export * from './generated/client'
export { prisma }
