export default {
  data(){
    return {
      totalItems  : 0,
      totalPages  : 1,
      items       : [],
      page        : 1
    }
  },
  methods: {
    /*
    * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
    * TRIGGERED FROM THE DEFAULT MIXIN
    */
    ready(){
      // GET USERS FROM THE CLOUD
      this.getItems();

      // HANDLE SCROLL EVENTS
      this.scroll();
    },

    /*
    * HAS TO BE INHERITED BY THE CHILD COMPONENTS
    * IS USED IN THE FUNCTION getItems()
    */
    getAPI(){

    },
    getItems(){
      var component = this;

      // SET PROCESSING
      component.$store.commit( 'setProcessing', true );

      component.getAPI().then( ( response ) => {

        component.$store.commit( 'notifyError', response.data.length );

        //console.log( response.data );

        component.totalItems = parseInt( response.headers['x-wp-total'] );
        component.totalPages = parseInt( response.headers['x-wp-totalpages'] );

        // APPEND EACH USER FROM THE RESULT SET TO THE LIST OF USERS
        for( var key in response.data ){
          component.items.push( response.data[ key ] );
        }

        // RESET PROCESSING
        component.$store.commit( 'setProcessing', false );
      }, ( error ) => {

        // NOTIFY ERROR
        component.$store.commit( 'notifyError', error );

        // RESET PROCESSING
        component.$store.commit( 'setProcessing', false );

      } );
    },
    /*
    * EVENT HANDLE ON SCROLL OF DOCUMENT
    */
    scroll(){
      var component = this;
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight > document.documentElement.offsetHeight-100;
        if ( bottomOfWindow && !component.$store.state.processing && component.page < component.totalPages ) {
          component.page++;
          component.getItems();
        }
      }
    }
  }
};
