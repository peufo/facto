import { defineModule } from '../defineModule'

export const locationModule = defineModule({
	id: 'location',
	attributes: {
		position_x: {
			label: 'Position X',
			type: 'LENGTH'
		},
		position_y: {
			label: 'Position Y',
			type: 'LENGTH'
		},
		dimension_x: {
			label: 'Largeur (Dim X)',
			type: 'LENGTH'
		},
		dimension_y: {
			label: 'Profondeur (Dim Y)',
			type: 'LENGTH'
		},
		rotation: {
			label: 'Rotation Z',
			type: 'CUSTOM'
		},
		parent: {
			label: 'Parent (Conteneur)',
			type: 'REFERENCE'
		}
	}
})
