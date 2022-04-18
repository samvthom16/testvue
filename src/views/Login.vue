<template>
  <div class="login">
    <!-- <LoginForm /> -->
    <!-- <LoginMultiStepForm /> -->
    <LoginFormWithSteps />
  </div>
</template>

<script>
// import LoginForm from "@/components/LoginForm.vue";
// import LoginMultiStepForm from "@/components/LoginMultiStepForm.vue";
import LoginFormWithSteps from "@/components/LoginFormWithSteps.vue";

export default {
  name: "Login",
  components: {
    // LoginForm,
    // LoginMultiStepForm,
    LoginFormWithSteps,
  },
};
</script>

<style scoped>
#header-icons-menu {
  display: none;
}
</style>
