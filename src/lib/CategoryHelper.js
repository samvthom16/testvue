import { ref } from 'vue';

import { useRoute } from "vue-router";

const categoryhelper = () => {

	const route = useRoute();

	const getType = () => route.params.type;

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

	const getWPType = () => categories.value[ getType() ].wp_type;

	const getWPJsonType = ( wptype ) => {
		var type = wptype.split( "inpursuit-" ).pop();
		if( type == 'status' ) return 'member_status';
		if( type == 'event-type' ) return 'event_type';
		return type;
	}

  return {
		categories,
		getWPType,
		getType,
		getWPJsonType
  }
}

export default categoryhelper
