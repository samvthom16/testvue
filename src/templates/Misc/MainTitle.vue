<template>
  <h4 class='font-semibold text-xl mb-4'>
    <Icon :type='icon' class='inline h-6 w-6' />
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
