<template>
  <div class="hello">
    
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
          id        : 'account_url',
          label     : "Account URL",
          error_msg : "",
          value     : "",
          type      : "text",
          placeholder: 'https://',
        },
        email_address: {
          id        : 'email_address',
          label     : "Email Address",
          error_msg : "",
          value     : "",
          type      : "text",
        },
        otp: {
          id        : 'otp',
          label     : "OTP",
          error_msg : "",
          value     : "",
          type      : "text",
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
    getAccountURL() {
      return this.validateURL(this.form.account_url.value.trim());
    },

    previous() {
      this.currentStep -= 1;
    },
    isValidHttpUrl(string) {
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
      return OTP;
    },

    testAccountURL(account_url) {
      var component = this;

      component.$store.state.processing = true;

      API.makeRequest({ url: account_url + "/wp-json/inpursuit/v1" }).then(
        () => component.openNextForm(),
        (error) => {
          console.log(error);
          component.$store.state.processing = false;
          component.form.account_url.error_msg =
            "URL does not support the application.";
        }
      );
    },

    delay( time ) {
      return new Promise( resolve => setTimeout( resolve, time ) );
    },

    /*
    * FORM WITH THE NEXT STEP HAS TO BE OPENED
    * STOP THE LOADER
    * INCREASE THE CURRENT STEP
    * FOCUS ON THE NEXT INPUT
    */
    _openNextPreviousForm(){
      this.$store.state.processing = false;
      this.delay( 200 ).then( () => this.focusInput( this.formSteps[this.currentStep] ) );
    },
    openNextForm(){
      this.currentStep += 1;
      this._openNextPreviousForm();
    },
    openPreviousForm(){
      this.currentStep -= 1;
      this._openNextPreviousForm();
    },

    sendEmailOTP() {
      var component = this;

      var account_url = this.getAccountURL();

      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      var email_address = component.form.email_address.value.trim();

      if (email_address && email_address.match(validRegex)) {
        component.form.email_address.error_msg = "";
        this.sent_otp = this.generateOTP();

        component.$store.state.processing = true;

        API.makeRequest({
          url: account_url + "/wp-json/inpursuit/v1/verify/",
          data: {
            email_address: btoa(email_address),
            email_otp: btoa(this.sent_otp),
          },
          method: "post",
        }).then(
          () => component.openNextForm(),
          (error) => {
            console.log(error);
            component.form.email_address.error_msg =
              "Email Address does not exist";
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

      if (
        !component.form.otp.value ||
        component.form.otp.value != this.sent_otp
      ) {
        component.form.otp.error_msg = "Invalid OTP";
        return false;
      }
      component.form.otp.error_msg = "";

      component.$store.state.processing = true;
      API.makeRequest({
        url: this.getAccountURL() + "/wp-json/inpursuit/v1/authentication/",
        data: {
          email_address: btoa(component.form.email_address.value.trim()),
        },
        method: "post",
      }).then(
        (response) => {
          component.$store.state.processing = false;
          component.afterAuthentication(response);
        },
        (error) => {
          component.$store.state.processing = false;
          alert(error.response.data.message);
        }
      );
      return true;
    },

    afterAuthentication(response) {
      var component = this;

      //STORING THE USER DATA AND URL
      if (response.data && response.data.password && response.data.user) {
        this.$store.commit("saveLocalSettings", {
          username: response.data.user.user_login,
          password: response.data.password,
          account_url: component.getAccountURL(),
        });

        // REDIRECT TO MEMBERS LISTING
        this.$router.push("/members");
      }
    },

    submit(e) {
      e.preventDefault();

      if (!this.form[this.formSteps[this.currentStep]].value) {
        this.form[this.formSteps[this.currentStep]].error_msg =
          "This field cannot be left empty.";
      } else {
        this.form[this.formSteps[this.currentStep]].error_msg = "";

        // FIRST STEP - ACCOUNT URL
        if (!this.currentStep) {
          var account_url = this.getAccountURL();
          if (this.isValidHttpUrl(account_url)) {
            this.testAccountURL(account_url);
          } else {
            this.form.account_url.error_msg = "Invalid URL";
          }
        }
        // SECOND STEP - SEND EMAIL OTP
        else if (this.currentStep === 1) {
          this.sendEmailOTP();
        } else if (this.currentStep === 2) {
          this.verifyOTP();
        }
      }
    },

    focusInput( element_id ){
      const input = document.getElementById( element_id );

      //document.dispatchEvent(new KeyboardEvent("keypress", { key: "H" }));

      // create invisible dummy input to receive the focus first
      const fakeInput = document.createElement('input')
      fakeInput.setAttribute('type', 'text')
      fakeInput.style.position = 'absolute'
      fakeInput.style.opacity = 0
      fakeInput.style.height = 0
      fakeInput.style.fontSize = '16px' // disable auto zoom

      // you may need to append to another element depending on the browser's auto
      // zoom/scroll behavior
      document.body.prepend(fakeInput)

      // focus so that subsequent async focus will work
      fakeInput.focus()

      this.delay( 1000 ).then( () => {
        input.focus();
        //input.click();
        fakeInput.remove();
      } );


    }
  },
  mounted(){
    this.focusInput( 'account_url' );
  }
};
</script>
