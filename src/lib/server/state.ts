import type { JsonObject, JsonValue } from '@prisma/client/runtime/client'
import { prisma } from './prisma'
import type { Commit } from './prisma/generated/browser'

export async function getState(commitId: string): Promise<JsonObject | null> {
	const commit = await prisma.commit.findUniqueOrThrow({
		where: { id: commitId },
		include: { inputs: true, output: true }
	})
	if (commit.output?.snapshot) {
		return commit.output.snapshot as JsonObject
	}
	if (commit.inputs.length === 0) {
		return null
	}
	if (commit.inputs.length === 1) {
		const input = commit.inputs[0]
		if (input.snapshot) {
			return input.snapshot as JsonObject // TODO: use prisma typed Json
		}
		const inputState = await getState(input.inputId)
		const snapshot = {
			...inputState,
			...(commit.changes as JsonObject)
		}
		// TODO: What if output state not exist ?
		await prisma.state.update({
			where: { id: commit.output?.id },
			data: { snapshot }
		})
		return snapshot
	}

	// TODO: handle multiple inputs ...
	// Create namespaces ? 0, 1, 2, ... you can define name with an attribute
	// Erase sames keys ?
	// Multiple inputs avoid updates ?
	// Snapshot as array ?

	const parentState = commit.parentId ? await getState(commit.parentId) : {} // Si racine, état vide

	// On applique les changements actuels sur l'état du parent
	const currentState = {
		...parentState,
		...(commit.changes as object) // Casting du Json
	}

	// Optionnel : On sauvegarde le résultat pour la prochaine fois !
	// C'est ici que le "Lazy Snapshotting" opère.
	await prisma.commit.update({
		where: { id: commitId },
		data: { snapshot: currentState }
	})

	return currentState
}
