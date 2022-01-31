import { createStore } from 'vuex'
import API from '../api.js'

export default createStore({
  state: {
    settings    : {},
    account     : {},
    processing  : false
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
    getAccountSettings( state, url ){
      API.request( url ).then( ( response ) => {
        //console.log( response.data );
        return state.account = response.data;
      } );
      return state.account;
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
    setProcessing( context, flag ){
      context.commit( 'setProcessing', flag );
    }
  },
  modules: {
  }
})
