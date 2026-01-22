import { env } from '$env/dynamic/private'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaMariaDb(env.DATABASE_URL)

export const prisma = new PrismaClient({ adapter })
