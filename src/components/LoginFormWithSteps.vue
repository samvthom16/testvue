<template>
  <div class="hello">
    <form class="p-10 max-w-sm m-auto">
      <TextField
        class="mt-10"
        :field="formfield"
        :isHidden="formSteps[currentStep] !== key"
        v-model="formfield.value"
        v-for="(formfield, key) in form"
        :key="key"
      />

      <div class="flex flex-row justify-between">
        <button
          v-if="currentStep !== 0"
          type="button"
          @click="previous"
          class="
            my-2
            border-purple
            p-2
            font-semibold
            px-4
            rounded-lg
            bg-purple
            text-sm text-white
          "
        >
          Previous
        </button>

        <button
          v-if="currentStep < formSteps.length - 1"
          type="button"
          @click="next"
          class="
            my-2
            border-purple
            p-2
            font-semibold
            px-4
            rounded-lg
            bg-purple
            text-sm text-white
          "
        >
          Next
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
        // username: {
        //   label: "Username",
        //   error_msg: "",
        //   value: "",
        //   type: "text",
        // },
        // password: {
        //   label: "Password",
        //   error_msg: "",
        //   value: "",
        //   type: "password",
        // },
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
      // formSteps: ["account_url", "username", "password"],
      formSteps: ["account_url", "email_address", "otp"],
      sent_otp: "",
    };
  },
  mounted() {
    //console.log( 'test' );
    //this.signInRequest( 'http://localhost/wordpress', 'sam', '123123' );
    //this.signInRequest( 'https://admin.lighthousechurch.in', 'sam', '!l0v3J35u5&k0ch3' );
  },

  methods: {
    getBoolValue() {
      if (this.currentStep == 0) return true;
    },
    next() {
      if (!this.form[this.formSteps[this.currentStep]].value) {
        this.form[this.formSteps[this.currentStep]].error_msg =
          "This field cannot be left empty.";
      } else {
        this.form[this.formSteps[this.currentStep]].error_msg = "";

        if (this.currentStep === 1) {
          this.sendEmailOTP();
        } else {
          this.currentStep += 1;
        }
      }
    },
    previous() {
      this.currentStep -= 1;
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

    sendEmailOTP() {
      var component = this;

      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      var email_address = component.form.email_address.value.trim();

      if (email_address && email_address.match(validRegex)) {
        component.form.email_address.error_msg = "";
        this.sent_otp = this.generateOTP();

        console.warn("btoa email add:" + btoa(email_address));
        console.warn("btoa otp:" + btoa(this.sent_otp));

        API.requestVerifyMail(component.form.account_url.value.trim(), {
          email_address: btoa(email_address),
          email_otp: btoa(this.sent_otp),
        }).then(() => (this.currentStep += 1));
        return true;
      }
      component.form.email_address.error_msg =
        "Please type your email ID above instead of copying it to avoid error.";
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

      API.requestAuthenticateEmailAddress(
        component.form.account_url.value.trim(),
        {
          email_address: btoa(component.form.email_address.value.trim()),
        }
      ).then((response) => this.afterAuthentication(response));

      return true;
    },

    afterAuthentication(response) {
      var component = this;
      // this.processing = false;
      if (response.data && response.data.password && response.data.user) {
        this.$store.commit("saveLocalSettings", {
          username: response.data.user.user_login,
          password: response.data.password,
          account_url: component.form.account_url.value,
        });

        // REDIRECT TO MEMBERS LISTING
        this.$router.push("/members");
      }
    },

    submit(e) {
      e.preventDefault();

      // var component = this;

      this.verifyOTP();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
