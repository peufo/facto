import { createSystem } from './createSystem'
import { coreModule, locationModule } from '$lib/modules'

const modules = [
	coreModule,
	locationModule
	// financeModule,
	// qualityModule,
	// invoiceModule,
	// userModule <-- core ?
	// I have some work ^^
]

export const system = createSystem(modules)
