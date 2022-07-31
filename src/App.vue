<template>

  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <ErrorNotification />
</template>

<script>
//import HeaderMenu from '@/components/HeaderMenu.vue'
import ErrorNotification from '@/components/ErrorNotification'

import store from '@/store'

export default {
  name: 'App',
  components: {
    ErrorNotification
  },
  setup(){
    store.commit( 'getLocalSettings' )
    //store.commit( 'notifyError', 'Testing' )
  }
}
</script>

<style>
/*
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
*/
</style>
