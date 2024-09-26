<template>

  <router-view />

  <ErrorNotification />
</template>

<script>

import ErrorNotification from '@/components/ErrorNotification.vue'

import router from '@/router'
import store from '@/store'

export default {
  name: 'App',
  components: {
    ErrorNotification
  },
  setup(){

    store.commit( 'getLocalSettings' )

    /*
    * IF THE STORE DOES NOT HAVE LOCAL SETTINGS THEN IT SHOULD SUCCESSFULLY
    * REDIRECT TO THE LOGIN PAGE
    */
    if( !( store.state.settings && store.state.settings.account_url ) ){
      router.push( '/login' );
    }
  }
}
</script>
