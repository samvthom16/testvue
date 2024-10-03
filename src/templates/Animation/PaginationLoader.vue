<template>
  <button class='bg-orange p-2 px-8 my-4 rounded text-white text-center mx-auto block'>
    Loading
    <Icon
      type='CircularLoader'
      class='inline h-4 w-4'
    />
  </button>
</template>

<script>

import Icon from '@/components/Icon.vue'

export default{
  components:{
    Icon
  }
}
</script>
