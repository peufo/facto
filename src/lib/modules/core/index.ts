import { defineModule } from '../defineModule'

export const coreModule = defineModule({
	id: 'core',
	attributes: {
		input: {
			label: 'Input',
			type: 'DEPENDENCY'
		},
		merge: {
			label: 'Merge',
			type: 'DEPENDENCY'
		}
	}
})
