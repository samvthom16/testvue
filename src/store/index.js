import { createStore } from 'vuex'
import API from '../api.js'

function request( url, headers = {}, callback ){
  API.request( url, headers ).then( ( response ) => {
    //console.log( response.data );
    callback( response.data, response.headers );
  }, ( error ) => {
    console.log( '' + error );
  } );
}

/*
function nonAuthRequest( state, url, callback ){
  return request( url, {}, callback );
}
*/

function authRequest( state, url, callback ){
  var username = state.settings.username;
  var password = state.settings.password;

  var headers = {};

  if( username && password ){
    headers = {
      'Authorization': 'Basic ' + btoa( atob( username ) + ':' + password ),
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    //console.log( headers );
  }
  return request( url, headers, callback );

}

export default createStore({
  state: {
    settings    : {},
    account     : {},
    processing  : false,
    posts       : [],
    totalPosts  : 0
  },
  mutations: {
    getLocalSettings( state ){
      if( localStorage.inpursuit_settings ){
        state.settings = JSON.parse( localStorage.inpursuit_settings )
      }
      return state.settings;
    },
    saveLocalSettings( state, payload ){
      localStorage.inpursuit_settings = JSON.stringify( payload );
    },

    /*
    * THIS FUNCTION MAKES A SERVER REQUEST TO GET ALL
    * THE ACCOUNT SETTINGS
    * IMPORTANT FUNCTION CALL THAT IS CALLED ONCE FOR EVERY BROWSER RELOAD
    * THIS FUNCTION SHOULD BE CALLED BEFORE PULLING ANY OTHER DATA
    */
    getAccountSettings( state ){
      var url = state.settings.account_url + '/wp-json/inpursuit/v1/settings';
      authRequest( state, url, function( response ){
        return state.account = response;
      } );
      return state.account;
    },
    /*
    testServer( state, url ){
      url += '/wp-json/inpursuit/v1/settings';
      nonAuthRequest( state, url, function( response ){
        console.log( response );
        return state.account = response;
      } );
      return {};
    },
    */
    getPosts( state, page ){

      state.processing = true;

      var url = state.settings.account_url + '/wp-json/wp/v2/inpursuit-members/?orderby=title&order=asc&page=' + page;
      authRequest( state, url, function( response, headers ){

        state.processing = false;

        state.totalUsers = parseInt( headers['x-wp-total'] );

        // APPEND EACH POST FROM THE RESULT SET TO THE LIST OF POSTS
        for( var key in response ){
          state.posts.push( response[ key ] );
        }

        return state.posts;
      } );
      return state.posts;
    },
    setProcessing( state, flag ){
      state.processing = flag;
      return state.processing;
    }
  },
  actions: {
    getLocalSettings( context ){
      context.commit( 'getLocalSettings' );
    },
    saveLocalSettings( context, payload ){
      context.commit( 'saveLocalSettings', payload)
    },
    getAccountSettings( context, url ){
      context.commit( 'getAccountSettings', url );
    },
    getPosts( context, page ){
      context.commit( 'getPosts', page );
    },
    setProcessing( context, flag ){
      context.commit( 'setProcessing', flag );
    },
    /*
    testServer( context, url ){
      context.commit( 'testServer', url );
    }
    */
  },
  modules: {
  }
})
