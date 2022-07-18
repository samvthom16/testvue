import store from '@/store'
import API from '@/api'

export default{

  debounce  : null,

  getPostLink: function( post ){
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
  },

  getPostEditLink: function( post ){
    var route = {
      name		: "",
      params 	: { post: JSON.stringify( post ) },
      query   : { id: post.id }
    };

    //console.log( route );

    if( post.type != undefined && post.type == 'inpursuit-members' ){
      route.name = "NewMember";
    }
    else if( post.type != undefined && post.type == 'inpursuit-events' ){
      route.name = "NewEvent";
    }
    return route;
  },

  debounceEvent: function( callback, timeout = 600 ){
    clearTimeout( this.debounce );
    this.debounce = setTimeout(() => {
      callback();
    }, timeout);
  },

  fetchSettings: function( callback ){

    // ENABLE LOADING
    store.commit( 'setProcessing', true )

    API.requestSettings().then( ( response ) => {

      // DISABLE LOADING
      store.commit( 'setProcessing', false )

      // CALLBACK FUNCTION
      callback( response.data )

    } )
  }

}
