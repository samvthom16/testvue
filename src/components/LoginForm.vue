<template>
  <div class="hello">
    <form class='p-10 max-w-sm m-auto'>
      <div class='max-w-full mb-20'>
        <img src="../assets/logo.png">
      </div>
      <TextField :field='formfield' v-model='formfield.value' v-for='(formfield,key) in form' :key='key' />
      <button :disabled='processing' :class="{ 'cursor-not-allowed': processing }" class='bg-purple inline-block w-full text-white mb-5 border-purple p-2 border rounded' type='submit' @click='submit()'>
        <svg :class="{ 'inline': processing, 'hidden': !processing }" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if='!processing'>Submit</span>
        <span v-if='processing'>Processing</span>
      </button>
    </form>
  </div>
</template>

<script>
import API from '../api.js'

import TextField from './TextField.vue'

export default {
  name: 'LoginForm',
  props: {
    msg: String
  },
  components: {TextField},
  data(){
    return {
      processing: false,
      form:{
        'account_url': {
          label     : 'Account URL',
          error_msg : '',
          value     : ''
        },
        'username': {
          label     : 'Username',
          error_msg : '',
          value     : ''
        },
        'password': {
          label     : 'Password',
          error_msg : '',
          value     : ''
        },
      },
    }
  },
  methods: {
    submit(){

      var component = this;

      // SET THE PROCESSING FLAG TO INDICATE FORM HAS BEEN SUBMITTED
      component.processing = true;

      for( var key in component.form ){

        // RESET ERROR MESSAGE
        component.form[ key ].error_msg = '';

        if( !component.form[ key ].value ){
          component.form[key].error_msg = 'This field cannot be left empty.';
        }
      }

      // CHECK IF THE ACCOUNT URL IS RIGHT
      var base_url = component.form.account_url.value;
      var url = base_url + '/wp-json/inpursuit/v1/settings';
      API.request( url ).then( () => {

        var ukey = btoa( component.form.username.value );
        var pkey = btoa( component.form.password.value );

        var auth_url = base_url + '/wp-json/inpursuit/v1/auth';
        API.post( auth_url, { username: ukey, password: pkey } ).then( ( response ) => {
          component.processing = false;
          var account_url = base_url + '/wp-json/';

          component.$store.commit( 'saveLocalSettings', {
            username: ukey,
            password: response.data.new_password,
            account_url : account_url
          } );

          //component.saveLocally( ukey, response.data.new_password, account_url );
          //console.log( response.data.new_password );
        } );
      }, () => {
        component.processing = false;
        component.form.account_url.error_msg = 'Invalid URL. Contact your admin.'
      } );
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
