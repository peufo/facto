import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('Environment variable DATABASE_URL is not defined')

const adapter = new PrismaMariaDb(databaseUrl)
export const prisma = new PrismaClient({ adapter })
