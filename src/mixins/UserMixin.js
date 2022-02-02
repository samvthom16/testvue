export default {
  methods: {
    getStatus( post ){
      return this.getTermName( 'member_status', post.member_status );
		},
    getLocation( post ){
      return this.getTermName( 'location', post.location );
		},
    getGender( user ){
      return this.getTermName( 'gender', user.gender );
    },
    getGroup( user ){
      var terms = this.listTermNames( 'group', user.group );
      return terms.join( ', ' );
    },
    getProfession( user ){
      var terms = this.listTermNames( 'profession', user.group );
      return terms.join( ', ' );
    },
    getTermName( field, term_id ){
      var settings = this.$store.state.account;

      //console.log( settings );
      //console.log( field );
      //console.log( settings[ field ][ term_id ] );

      if( settings != undefined && settings[ field ] && settings[ field ][ term_id ] ){
        return settings[ field ][ term_id ];
			}
			return '';
    },
    listTermNames( field, term_id_arr ){
			var names = [];
			for( var index in term_id_arr ){
				var term_name = this.getTermName( field, term_id_arr[index] );
				names.push( term_name );
			}
			return names;
		},
  }
};
