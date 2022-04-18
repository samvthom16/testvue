<template>
  <TextField
    :formValue="formValue.text"
    :field="formfield"
    v-model="formfield.value"
    v-for="(formfield, key) in form"
    :key="key"
  />
</template>


<script>
import TextField from "../TextField.vue";

export default {
  name: "UserName",
  components: { TextField },
  data() {
    return {
      form: {
        // account_url: {
        //   label: "Account URL",
        //   error_msg: "",
        //   value: "",
        //   type: "text",
        // },
        username: {
          label: "Username",
          error_msg: "",
          value: "",
          type: "text",
        },
        // password: {
        //   label: "Password",
        //   error_msg: "",
        //   value: "",
        //   type: "password",
        // },
      },
    };
  },
  props: {
    formValue: {
      text: String,
    },
  },
};
</script>

