<template>
  <h4 class='font-semibold text-xl mb-3 relative'>
    <Icon :type='icon' class='inline h-6 w-6 mb-2' />
    {{ title }}
    <router-link class='absolute right-0 text-sm text-orange top-2' :to="route">View All</router-link>
  </h4>
</template>

<script>
import Icon from '@/components/Icon'

export default{
  components:{
    Icon
  },
  props: {
    icon: String,
    title: String,
    route: Object
  }
}
</script>
