<template>
  <div class="flex -space-x-2 items-center mt-4 mb-1">
    <div class="text-sm text-gray">{{ total }} Events</div>
  </div>
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
