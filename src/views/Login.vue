<template>
  <div class="login">
    <!-- <LoginForm /> -->
    <LoginFormWithSteps />
  </div>
</template>

<script>
// import LoginForm from "@/components/LoginForm.vue";
import LoginFormWithSteps from "@/components/LoginFormWithSteps.vue";

export default {
  name: "Login",
  components: {
    // LoginForm,
    LoginFormWithSteps,
  },
};
</script>

<style scoped>
#header-icons-menu {
  display: none;
}
</style>
