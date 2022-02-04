export default {
  mounted(){
    this.init();
  },
  data(){
    return {
      account_url: ''
    };
  },
  methods: {
    init(){
      this.$store.commit( 'getLocalSettings' );

      if( this.$store.state.settings && this.$store.state.settings.account_url ){
        this.account_url = this.$store.state.settings.account_url;
        if( this.account_url.length ){

          // NEEDS TO BE CALLED ATLEAST ONCE FOR EVERY SESSION
          this.setupAccountSettings();
          this.ready();
        }
      }
      else{
        console.log( 'Account URL is not valid' );
        this.$router.push( '/login' );
      }
    },
    ready(){

    },
    setupAccountSettings(){
      this.$store.commit( 'getAccountSettings' );
    },
    getPostLink( post ){
			var route = {
				name		: "",
				params 	: { id : post.id, post: JSON.stringify( post ) }
			};

      //console.log( route );

      if( post.type != undefined && post.type == 'inpursuit-members' ){
				route.name = "SingleMember";
			}
			else if( post.type != undefined && post.type == 'inpursuit-events' ){
				route.name = "SingleEvent";
			}
			return route;
		}
  }
};
