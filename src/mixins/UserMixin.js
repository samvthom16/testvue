export default {
  methods: {
    subtitleHTML( post ){
      return this.getTermName( 'member_status', post.member_status );
		},
    locationHTML( user ){
      return this.getTermName( 'location', user.location );
		},
    genderHTML( user ){
      return this.getTermName( 'gender', user.gender );
    },
    groupHTML( user ){
      var terms = this.listTermNames( 'group', user.group );
      return terms.join( ', ' );
    },
    professionHTML( user ){
      var terms = this.listTermNames( 'profession', user.group );
      return terms.join( ', ' );
    },
    getTermName( field, term_id ){
      var settings = this.$store.state.account;
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
