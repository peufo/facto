import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { AttributeType, PrismaClient, type Prisma } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	console.error(new Error('environment variable DATABASE_URL is not defined'))
	process.exit(1)
}

const adapter = new PrismaMariaDb(databaseUrl)

export const prisma = new PrismaClient({ adapter })

async function main() {
	const coreAttributes: Prisma.AttributeCreateInput[] = [
		{
			key: 'core.position_x',
			label: 'Position X',
			type: AttributeType.LENGTH,
			typeOption: { unit: 'mm' }
		},
		{
			key: 'core.position_y',
			label: 'Position Y',
			type: AttributeType.LENGTH,
			typeOption: { unit: 'mm' }
		},
		{
			key: 'core.dimension_x',
			label: 'Largeur (Dim X)',
			type: AttributeType.LENGTH,
			typeOption: { unit: 'mm' }
		},
		{
			key: 'core.dimension_y',
			label: 'Profondeur (Dim Y)',
			type: AttributeType.LENGTH,
			typeOption: { unit: 'mm' }
		},
		{
			key: 'core.rotation',
			label: 'Rotation Z',
			type: AttributeType.CUSTOM,
			typeOption: { unit: 'deg', range: [0, 360] }
		},
		{
			key: 'core.parent',
			label: 'Parent (Conteneur)',
			type: AttributeType.REFERENCE,
			typeOption: {
				description: "Définit le repère spatial et logique de l'objet."
			}
		},
		{
			key: 'core.component', // Pas certain que ca soit util ca
			label: 'Composant / Sous-ensemble',
			type: AttributeType.DEPENDENCY,
			typeOption: {
				description: "Partie intégrante de l'objet (Composition)."
			}
		},
		{
			key: 'core.input',
			label: 'Entrée (Input)',
			type: AttributeType.DEPENDENCY,
			typeOption: {
				description: 'Source de données ou de matière nécessaire au process.'
			}
		}
	]

	for (const attr of coreAttributes) {
		const record = await prisma.attribute.upsert({
			where: { key: attr.key },
			update: {
				label: attr.label,
				type: attr.type,
				typeOption: attr.typeOption
			},
			create: {
				key: attr.key,
				label: attr.label,
				type: attr.type,
				typeOption: attr.typeOption
			}
		})
		console.log(`Attribut synchronisé : ${record.key}`)
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
