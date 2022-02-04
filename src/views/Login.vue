<template>
  <div class="login">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm
  }
}

</script>

<style scoped>
  #header-icons-menu{ display: none; }
</style>
