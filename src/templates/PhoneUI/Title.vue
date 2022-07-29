<template>
  <div
    class='maintitle mt-0 transition-all duration-200 delay-50 relative'
    :class="[ `${colors}`, `${maintitle_classes}`, {'transform -mt-12': move_sticky_up} ]"
  >
    <div class='flex'>
      <div class='flex-auto' v-html='title' v-if='!hide_maintitle'></div>
      <slot name="headerright"></slot>
    </div>
    <slot name="mainttitle_footer"></slot>
  </div>
</template>

<script>

export default{
  props: {
    title: String,
    colors: String,
    scrolled: Boolean,
    move_sticky_up: Boolean,
    stickytitle_classes: String,
    maintitle_classes: String,
    hide_maintitle: Boolean
  },

}
</script>
