import { AttributeType } from '@prisma/client'
import { Module, type CommitPayload, type Definitions } from '../Module'

const defs = {
	position_x: {
		label: 'Position X',
		type: AttributeType.LENGTH,
		typeOption: { unit: 'mm' }
	},
	position_y: {
		label: 'Position Y',
		type: AttributeType.LENGTH,
		typeOption: { unit: 'mm' }
	},
	dimension_x: {
		label: 'Largeur (Dim X)',
		type: AttributeType.LENGTH,
		typeOption: { unit: 'mm' }
	},
	dimension_y: {
		label: 'Profondeur (Dim Y)',
		type: AttributeType.LENGTH,
		typeOption: { unit: 'mm' }
	},
	rotation: {
		label: 'Rotation Z',
		type: AttributeType.CUSTOM,
		typeOption: { unit: 'deg' }
	},
	parent: {
		label: 'Parent (Conteneur)',
		type: AttributeType.REFERENCE
	}
} satisfies Record<string, Definitions>

export class ModuleLocation extends Module<typeof defs> {
	readonly id = 'location'
	readonly definitions = defs

	validateCommit(payload: CommitPayload): void {
		const posXKey = this.getKey('')

		if (payload.changes[posXKey] !== undefined) {
			const val = payload.changes[posXKey]
			if (typeof val !== 'number') {
				throw new Error(`[Module Core] ${posXKey} doit être un nombre.`)
			}
		}
	}

	getPosition(snapshot: Record<string, any>): { x: number; y: number } | null {
		const x = snapshot[this.getKey('position_x')]
		const y = snapshot[this.getKey('position_y')] // Supposons qu'il existe

		if (x === undefined && y === undefined) return null
		return { x: x ?? 0, y: y ?? 0 }
	}

	getParentId(snapshot: Record<string, any>): string | null {
		return snapshot[this.getKey('parent')] || null
	}
}
