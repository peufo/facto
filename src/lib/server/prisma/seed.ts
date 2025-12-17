import { useAdapter } from './adapter'
import { FieldType, PrismaClient } from './generated/client'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	console.error(new Error('environment variable DATABASE_URL is not defined'))
	process.exit(1)
}

const prisma = new PrismaClient({ adapter: useAdapter(databaseUrl) })

async function main() {
	const fields = [
		{ name: 'name', type: FieldType.text },
		{ name: 'width', type: FieldType.number },
		{ name: 'height', type: FieldType.number },
		{ name: 'x', type: FieldType.number },
		{ name: 'y', type: FieldType.number }
	]

	for (const field of fields) {
		const result = await prisma.field.upsert({
			where: { name: field.name },
			update: {},
			create: {
				name: field.name,
				type: field.type
			}
		})
		console.log(`Created field: ${result.name} (${result.type})`)
	}
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
