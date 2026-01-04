import type { JsonObject } from '@prisma/client/runtime/client'
import { prisma } from './prisma'

export async function getSnapshotFromCommitId(commitId: string): Promise<JsonObject | null> {
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
		const inputSnapshot = await getSnapshotFromCommitId(input.inputId)
		const snapshot = {
			...inputSnapshot,
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

	const parentSnapshot = commit.parentId ? await getSnapshotFromCommitId(commit.parentId) : {} // Si racine, état vide

	// On applique les changements actuels sur l'état du parent
	const currentState = {
		...parentSnapshot,
		...(commit.changes as object) // Casting du Json
	}

	// Optionnel : On sauvegarde le résultat pour la prochaine fois !
	// C'est ici que le "Lazy Snapshotting" opère.
	await prisma.state.update({
		where: { id: commitId },
		data: { snapshot: currentState }
	})

	return currentState
}
