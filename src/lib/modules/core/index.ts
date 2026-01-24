import { defineModule } from '../defineModule'

export const coreModule = defineModule({
	id: 'core',
	attributes: {
		input: {
			label: 'Entrées (Inputs)',
			type: 'DEPENDENCY'
		}
	}
})
