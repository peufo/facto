import { useAdapter } from './adapter'
import { PrismaClient } from './generated/client'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	console.error(new Error('environment variable DATABASE_URL is not defined'))
	process.exit(1)
}

const prisma = new PrismaClient({ adapter: useAdapter(databaseUrl) })

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
