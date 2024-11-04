<template>
  <button @click='goBack'><Icon type='Back' class='inline mt-1' /></button>
</template>

<script>
import Icon from '@/components/Icon.vue'

import router from '@/router'

export default{
  props: {
    defaultRoute: Object,
    defaultRouteOnly: {
      type    : Boolean,
      required: false,
      default : false
    }
  },
  components:{
    Icon
  },
  setup( props ){

    const goBack = () => {
      if( window.history.length > 2 && !props.defaultRouteOnly ) router.go( -1 )
      else router.push( props.defaultRoute )
    }

    return {
      goBack
    }
  }
}
</script>
