<template>
  <div class="members">
    <UsersList :users='users' :total='totalUsers' />
  </div>
</template>

<script>
import API from '../api.js'

import UsersList from '@/components/UsersList.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'

export default {
  name: 'Members',
  components: {
    UsersList
  },
  mixins: [ defaultMixin ],
  data(){
    return {
      account_url : '',
      totalUsers  : 0,
      users       : [],
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
      this.getUsers();

      // HANDLE SCROLL EVENTS
      this.scroll();
    },
    getUsers(){

      //console.log( 'getUsers' );

      var component = this;

      // SET PROCESSING
      component.$store.commit( 'setProcessing', true );

      var url = this.account_url + 'wp/v2/inpursuit-members/?orderby=title&order=asc&page=' + component.page;
      API.request( url ).then( ( response ) => {

        component.totalUsers = response.headers['x-wp-total'];

        // APPEND EACH USER FROM THE RESULT SET TO THE LIST OF USERS
        for( var key in response.data ){
          component.users.push( response.data[ key ] );
        }

        // RESET PROCESSING
        component.$store.commit( 'setProcessing', false );
      } );
    },
    scroll(){
      var component = this;
      window.onscroll = () => {
        let bottomOfWindow = Math.max( window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop ) + window.innerHeight === document.documentElement.offsetHeight;
        //console.log( bottomOfWindow );
        if ( bottomOfWindow && !component.$store.state.processing ) {
          component.page++;
          component.getUsers();
        }
      }
    },
  }
}

</script>
