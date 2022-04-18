<template>
  <!-- <div class="text-4xl">Account Url</div> -->
  <!-- <TextField
    :field="formfield"
    v-model="formfield.value"
    v-for="(formfield, key) in form"
    :key="key"
  /> -->

  <div class="mb-5">
    <label class="block font-light text-black my-5" for="accountUrl">
      Account URL
    </label>

    <input
      class="
        inline-block
        w-full
        p-2
        border-2 border-solid
        rounded
        mb-1
        border-black
        outline-white
        focus:border-red
      "
      type="text"
      name="accountUrl"
      id="accountUrl"
      v-model="value"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- <div class="text-red text-xs">{{ form.account_url.error_msg }}</div> -->
  </div>
</template>


<script>
// import TextField from "../TextField.vue";

export default {
  name: "Account URL",
  // components: { TextField },
  data() {
    // return {
    //   form: {
    //     account_url: {
    //       label: "Account URL",
    //       error_msg: "",
    //       value: "",
    //       type: "text",
    //     },
    //   },
    // };
    return {
      value: "",
    };
  },
  props: {
    formValue: {
      url: String,
    },
  },
  // emits: ["formValueChange"],
  // methods: {
  //   onChange(e) {

  //     console.warn("ee =="+e);
  //     this.$emit("formValueChange", {
  //       label: "accountUrl",
  //       data: {
  //         ...this.formValue,
  //         [e.target.name]: e.target.value,
  //       },
  //     });
  //   },
  //   // onChange() {
  //   //   $emit("update:modelValue", $event.target.value);
  //   // },
  // },
};
</script>

