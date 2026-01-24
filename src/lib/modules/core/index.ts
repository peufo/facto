import { AttributeType } from '@prisma/client'
import { Module, type CommitPayload } from '../Module'

export class ModuleCore extends Module {
	readonly id = 'core'
	readonly definitions = {
		input: {
			label: 'Entrées (Inputs)',
			type: AttributeType.DEPENDENCY
		}
	}

	validateCommit(payload: CommitPayload): void {
		const posXKey = this.getKey('no typesafe')

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
