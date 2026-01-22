import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	console.error(new Error('environment variable DATABASE_URL is not defined'))
	process.exit(1)
}

const adapter = new PrismaMariaDb(databaseUrl)

export const prisma = new PrismaClient({ adapter })

async function main() {
	console.log('Noting to seed yet...')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
