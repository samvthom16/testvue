import { ref, onMounted } from 'vue';

import { useRoute, useRouter } from "vue-router";

import Util from '@/lib/Util';

const filtershelper = ( dropdownButtons, context, dropdown_slugs ) => {

	const route = useRoute();
	const router = useRouter();

	const selectItem = ( data ) => {
		dropdownButtons.value[ data.name ].selected = data.value;
		context.emit( 'selectItem', data );
		pushQueriesToUrl( data );
	}

	/*
	* IF FILTER PARAMS PASSED IN URL
	* THEN SET THE FILTERS ACCORDINGLY
	*/
	const syncTabWithUrl = () => {
		for( const [key, item] of Object.entries( dropdownButtons.value ) ){
			if( route.query[ key ] ){
				var value = route.query[ key ];
				selectItem( { name: key, value: value } );
			}
		}
	};

	// UPDATE THE ROUTE QUERY
	const pushQueriesToUrl = ( data ) => {
		var routeQuery = { query: { ...route.query } };
		routeQuery.query[ data.name ] = data.value;
		router.push( routeQuery );
	}

	/*
	* FETCH SETTINGS FROM THE SERVER
	*/
	Util.fetchSettings( ( data ) => {
		for( var i=0; i<dropdown_slugs.length; i++ ){
			var slug = dropdown_slugs[ i ]
			for( var id in data[ slug ] ){
				dropdownButtons.value[ slug ].items[ id ] = data[ slug ][ id ]
			}
		}
	} );

	onMounted( () => syncTabWithUrl() );


  return {
		syncTabWithUrl,
		pushQueriesToUrl,
		selectItem
  }
}

export default filtershelper
