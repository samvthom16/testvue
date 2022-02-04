<template>
  <div class="hello">
    <form class='p-10 max-w-sm m-auto' @submit='submit'>
      <TextField :field='formfield' v-model='formfield.value' v-for='(formfield,key) in form' :key='key' />
      <button :disabled='$store.state.processing' :class="{ 'cursor-not-allowed': $store.state.processing }" class='bg-purple inline-block w-full text-white mb-5 border-purple p-2 border rounded' type='submit'>
        <svg :class="{ 'inline': $store.state.processing, 'hidden': !$store.state.processing }" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if='!$store.state.processing'>Submit</span>
        <span v-if='$store.state.processing'>Processing</span>
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
          value     : '',
          type      : 'text'
        },
        'username': {
          label     : 'Username',
          error_msg : '',
          value     : '',
          type      : 'text'
        },
        'password': {
          label     : 'Password',
          error_msg : '',
          value     : '',
          type      : 'password'
        },
      },
    }
  },
  mounted(){
    //console.log( 'test' );
    //this.signInRequest( 'http://localhost/wordpress', 'sam', '123123' );
    //this.signInRequest( 'https://admin.lighthousechurch.in', 'sam', '!l0v3J35u5&k0ch3' );
  },
  methods: {
    validateURL( url ){
      return url.replace(/\/$/, "");
    },
    setProcessing( flag ){
      this.processing = flag;
      this.$store.commit( 'setProcessing', this.processing );
    },
    signInRequest( base_url, username, password ){
      var ukey = btoa( username );
      var pkey = btoa( password );
      var account_url = this.validateURL( base_url );
      var url = account_url + '/wp-json/inpursuit/v1/auth';

      var request = API.makeRequest( {
        method : 'post',
        url : url,
        data: {
          username: ukey,
          password: pkey
        }
      } );

      return {
        'ukey'        : ukey,
        'account_url' : account_url,
        'request'      : request
      };
    },
    whenSignInSuccessful( username, new_password, account_url ){

      // SET PROCESSING SO THE LOADER IS OFF
      this.setProcessing( false );

      // SAVE TO LOCAL STORAGE
      this.$store.commit( 'saveLocalSettings', {
        username    : username,
        password    : new_password,
        account_url : account_url
      } );

      // REDIRECT TO MEMBERS LISTING
      this.$router.push( '/members' );
    },
    submit( e ){

      e.preventDefault();

      //console.log( e );

      if( this.$store.state.processing ) {
        console.log( 'Already processing something' );
        return false;
      }

      var component = this;

      // SET THE PROCESSING FLAG TO INDICATE FORM HAS BEEN SUBMITTED
      component.setProcessing( true );
      //component.$store.commit( 'setProcessing', true );

      var empty_flag = false;
      for( var key in component.form ){

        // RESET ERROR MESSAGE
        component.form[ key ].error_msg = '';

        // CHECK FOR EMPTY FIELD
        if( !component.form[ key ].value ){
          component.form[key].error_msg = 'This field cannot be left empty.';
          empty_flag = true;
        }
      }

      // IF ANY OF THE FIELDS IS EMPTY, SHOULD SHOW THE ERROR MESSAGE
      if( empty_flag ){
        component.setProcessing( false );
        return false;
      }

      // CHECK IF THE ACCOUNT URL IS RIGHT
      var signInData  = component.signInRequest(
        component.form.account_url.value, // THESE VALUES ARE TAKEN FROM THE CURRENT USER INPUT IN THE FORM
        component.form.username.value,
        component.form.password.value
      );

      signInData.request.then( ( response ) => {

        // ON SUCCESSFULL SIGN IN
        component.whenSignInSuccessful( signInData.ukey, response.data.new_password, signInData.account_url );

      }, ( error ) => {
        //console.log( '' + error );
        component.setProcessing( false );
        component.form.password.error_msg = 'Try again. ' + error;
        return false;
      } );

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
