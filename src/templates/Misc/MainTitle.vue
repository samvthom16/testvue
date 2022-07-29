<template>
  <h4 class='font-semibold text-2xl mb-3'>
    <Icon :type='icon' class='inline h-6 w-6 mb-2' />
    {{ title }}
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
    title: String
  }
}
</script>
