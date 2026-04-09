<template>
  <div class="flex items-center justify-between mb-3">
    <h4 class="font-semibold text-xl">{{ title }}</h4>
    <router-link
      :to="route"
      class="text-xs font-medium text-purple border border-purple rounded-md px-2.5 py-1 hover:bg-purple hover:text-white transition-colors"
    >View All</router-link>
  </div>
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
