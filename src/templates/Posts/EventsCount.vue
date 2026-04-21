<template>
  <p class="text-xs text-gray mt-0.5">{{ total }} events</p>
</template>
<script>
import Util from '@/lib/Util'

export default{
  props: {
    posts: Array,
    status: String,
    total: Number
  },

}
</script>
