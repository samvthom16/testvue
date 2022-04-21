<template>
  <div :class="{ 'overflow-hidden': $store.state.processing, 'hidden': !$store.state.processing }" class="w-full"><div class="w-full inline-block fluentProgressBar-waiting"></div></div>
  <HeaderMenu />
  <router-view />
  <ErrorNotification />
</template>

<script>
import HeaderMenu from '@/components/HeaderMenu.vue'
import ErrorNotification from '@/components/ErrorNotification.vue'

export default {
  name: 'App',
  components: {
    HeaderMenu,
    ErrorNotification
  }
}
</script>

<style>
#nav{
  display: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
