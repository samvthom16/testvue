<template>
  <div class="hello">
    <form class="p-10 max-w-sm m-auto" @submit='submit'>
      <TextField
        class="mt-10"
        :field="formfield"
        :isHidden="formSteps[currentStep] !== key"
        v-model="formfield.value"
        v-for="(formfield, key) in form"
        :key="key"
      />

      <div class="" v-if="currentStep < formSteps.length - 1">
        <button
          :disabled="$store.state.processing"
          :class="{ 'cursor-not-allowed': $store.state.processing }"
          v-if="currentStep < formSteps.length - 1"
          type="button"
          @click="submit"
          class="my-2 border-purple p-2 font-semibold px-4 rounded-lg bg-purple text-sm text-white w-full"
        >
          Next
        </button>
        <button
          v-if="currentStep !== 0"
          type="button"
          @click="currentStep -= 1"
          class="mt-6 text-sm underline text-center w-full"
        >
          Go Back
        </button>
      </div>

      <button
        v-if="currentStep === formSteps.length - 1"
        :disabled="$store.state.processing"
        :class="{ 'cursor-not-allowed': $store.state.processing }"
        class="
          bg-purple
          inline-block
          w-full
          text-white
          mb-5
          mt-5
          border-purple
          p-2
          border
          rounded
        "
        type="button"
        @click="submit"
      >
        <svg
          :class="{
            inline: $store.state.processing,
            hidden: !$store.state.processing,
          }"
          class="animate-spin h-5 w-5 text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span v-if="!$store.state.processing">Submit</span>
        <span v-if="$store.state.processing">Processing</span>
      </button>
    </form>
  </div>
</template>

<script>
import API from "../api.js";

import TextField from "./TextField.vue";

export default {
  name: "LoginFormWithSteps",
  props: {
    msg: String,
  },
  components: { TextField },
  data() {
    return {
      currentStep: 0,
      processing: false,
      form: {
        account_url: {
          label: "Account URL",
          error_msg: "",
          value: "",
          type: "text",
        },
        email_address: {
          label: "Email Address",
          error_msg: "",
          value: "",
          type: "text",
        },
        otp: {
          label: "OTP",
          error_msg: "",
          value: "",
          type: "text",
        },
      },
      formSteps: ["account_url", "email_address", "otp"],
      sent_otp: "",
    };
  },


  methods: {
    getBoolValue() {
      if (this.currentStep == 0) return true;
    },
    getAccountURL(){
      return this.validateURL( this.form.account_url.value.trim() );
    },

    previous() {
      this.currentStep -= 1;
    },
    isValidHttpUrl( string ) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    },
    validateURL(url) {
      return url.replace(/\/$/, "");
    },

    generateOTP() {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      console.warn("OTP :::" + OTP);
      return OTP;
    },

    testAccountURL( account_url ){

      var component = this;

      component.$store.state.processing = true;

      API.makeRequest( { url: account_url + '/wp-json/inpursuit/v1' } ).then(
        () => {
          component.$store.state.processing = false;
          component.currentStep += 1
        },
        ( error ) => {
          console.log( error );
          component.$store.state.processing = false;
          component.form.account_url.error_msg = "URL does not support the application.";
        }
      )


    },

    sendEmailOTP() {
      var component = this;

      var account_url = this.getAccountURL();

      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      var email_address = component.form.email_address.value.trim();

      if ( email_address && email_address.match( validRegex ) ) {
        component.form.email_address.error_msg = "";
        this.sent_otp = this.generateOTP();

        component.$store.state.processing = true;

        API.makeRequest( {
          url   : account_url + '/wp-json/inpursuit/v1/verify/',
          data  : {
            email_address : btoa( email_address ),
            email_otp     : btoa( this.sent_otp ),
          },
          method: 'post'
        } ).then(
          () => {
            component.$store.state.processing = false;
            component.currentStep += 1
          },
          ( error ) => {
            console.log( error );
            component.form.email_address.error_msg = "Email Address does not exist";
            component.$store.state.processing = false;
          }
        );

        return true;
      }

      component.form.email_address.error_msg =
        "Please type your email ID above instead of copying to avoid error.";

      return false;
    },

    verifyOTP() {
      var component = this;

      if ( !component.form.otp.value || component.form.otp.value != this.sent_otp ) {
        component.form.otp.error_msg = "Invalid OTP";
        return false;
      }
      component.form.otp.error_msg = "";

      component.$store.state.processing = true;
      API.makeRequest( {
        url   : this.getAccountURL() + '/wp-json/inpursuit/v1/authentication/',
        data  : {
          email_address: btoa( component.form.email_address.value.trim() ),
        },
        method : 'post'
      } ).then(
        ( response ) => {
          component.$store.state.processing = false;
          component.afterAuthentication( response );
        },
        ( error ) => {
          component.$store.state.processing = false;
          alert( error.response.data.message );
        }
      );
      return true;
    },

    afterAuthentication(response) {
      var component = this;
      // this.processing = false;

      if (response.data && response.data.password && response.data.user) {
        //console.warn("uname = " + response.data.user.user_login);
        //console.warn("pass = " + response.data.password);
        //console.warn("url = " + component.form.account_url.value);

        this.$store.commit( "saveLocalSettings", {
          username    : response.data.user.user_login,
          password    : response.data.password,
          account_url : component.getAccountURL(),
        } );

        // REDIRECT TO MEMBERS LISTING
        this.$router.push("/members");
      }
    },

    submit(e) {
      e.preventDefault();

      //console.log( 'submit' );

      if (!this.form[this.formSteps[this.currentStep]].value) {
        this.form[this.formSteps[this.currentStep]].error_msg =
          "This field cannot be left empty.";
      } else {
        this.form[this.formSteps[this.currentStep]].error_msg = "";

        // FIRST STEP - ACCOUNT URL
        if( !this.currentStep ){

          var account_url = this.getAccountURL();
          if( this.isValidHttpUrl( account_url ) ){
            this.testAccountURL( account_url );
          }
          else{
            this.form.account_url.error_msg = "Invalid URL";
          }
        }
        // SECOND STEP - SEND EMAIL OTP
        else if ( this.currentStep === 1 ) {
          this.sendEmailOTP();
        }
        else if( this.currentStep ===2 ){
          this.verifyOTP();
        }
      }

    },
  },
};
</script>
