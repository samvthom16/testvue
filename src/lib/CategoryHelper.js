import {ref} from 'vue'

const categoryhelper = () => {

	const categories = ref( {
		'groups' : {
			label		: 'Groups',
			wp_type	: 'inpursuit-group',
			icon: 'Group'
		},
		'event-types': {
			label: 'Event Types',
			wp_type	: 'inpursuit-event-type',
			icon: 'Event'
		},
		'professions' : {
			label		: 'Professions',
			wp_type	: 'inpursuit-profession',
			icon: 'Profession'
		},
		'genders' : {
			label		: 'Genders',
			wp_type	: 'inpursuit-gender',
			icon: 'Gender'
		},
		'locations' : {
			label		: 'Locations',
			wp_type	: 'inpursuit-location',
			icon: 'Location'
		},
		'status' : {
			label		: 'Member Status',
			wp_type	: 'inpursuit-status',
			icon: 'Status'
		},
	} );

	const getWPType = ( type ) => categories.value[ type ].wp_type;

  return {
		categories,
		getWPType
  }
}

export default categoryhelper
