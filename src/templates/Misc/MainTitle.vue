<template>
  <h4 class='font-semibold text-xl mb-3 relative'>
    {{ title }}
    <router-link class='absolute right-0 top-1.5 text-sm text-orange' :to="route">View All</router-link>
  </h4>
</template>

<script>
//import Icon from '@/components/Icon'

export default{
  components:{
    //Icon
  },
  props: {
    //icon: String,
    title: String,
    route: Object
  }
}
</script>
