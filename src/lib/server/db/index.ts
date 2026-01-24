import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	console.error(new Error('Environment variable DATABASE_URL is not defined'))
	process.exit(1)
}

const adapter = new PrismaMariaDb(databaseUrl)

export const prisma = new PrismaClient({ adapter })
