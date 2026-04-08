<template>
  <div class="flex items-center gap-4 my-8 px-2">
    <div class="flex-1 h-px bg-lightgray"></div>
    <div class="flex items-center gap-2 text-darkgray">
      <Icon type="CircularLoader" class="h-3.5 w-3.5 text-purple" />
      <span class="text-xs font-medium tracking-wide uppercase">Loading more</span>
    </div>
    <div class="flex-1 h-px bg-lightgray"></div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

export default {
  components: { Icon }
}
</script>
