<template>
  <div class='text-center p-2 pt-10'>
    <h1 class='text-2xl' v-if='profile.name'>{{ profile.name }}</h1>
    <ul class='text-gray'>
      <li class='inline-block' v-if='profile.email'>{{ profile.email }}</li>
      <li class='inline-block p-2' v-if='profile.roles && profile.email'>|</li>
      <li class="capitalize inline-block" v-if='profile.roles'>{{ profile.roles.join(', ') }}</li>
    </ul>
    <router-link class='text-sm mt-10 bg-purple inline-block px-4 text-white mb-5 border-purple py-2 border rounded' to='/logout'>
      Logout
    </router-link>
  </div>
</template>

<script>
import API from '../api.js'

import defaultMixin from '@/mixins/DefaultMixin.js'


export default {
  name: 'Profile',
  components: {

  },
  mixins: [ defaultMixin ],
  data(){
    return {
      profile: {}
    }
  },
  methods: {
    /*
    * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
    * TRIGGERED FROM THE DEFAULT MIXIN
    */
    ready(){

      this.getPost();

    },
    getPost(){
      var component = this;

      // SET PROCESSING
      component.$store.commit( 'setProcessing', component.processing );

      var username = component.$store.state.settings.username;
      var password = component.$store.state.settings.password;

      var headers = {};

      if( username && password ){
        headers = {
          'Authorization': 'Basic ' + btoa( atob( username ) + ':' + password ),
          'Content-Type': 'application/x-www-form-urlencoded'
        };
      }

      //console.log( component.account_url );

      API.requestProfile( {
        account_url: component.account_url,
        headers: headers
      } ).then( ( response ) => {

        console.log( response.data );

        component.profile = response.data;

        // RESET PROCESSING
        component.$store.commit( 'setProcessing', component.processing );
      } );

    }
  }
}

</script>
