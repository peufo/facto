import { system } from '../src/lib/server/init'
import { prisma } from '../src/lib/server/db'

async function main() {
	await system.seed()
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
