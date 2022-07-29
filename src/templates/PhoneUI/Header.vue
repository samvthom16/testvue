<template>
  <div
    class='opacity-0 h-0'
    :class="[`${colors}`, {
      'border-b border-lightgray': scrolled,
      'opacity-100 py-4 px-2 sticky top-0 z-10 h-auto' : !move_sticky_up
    }]">
    <ul class='header-list'>
      <li><slot name="headericon"></slot></li>
      <li
        class='truncate opacity-0 transition-all'
        :class="[`${stickytitle_classes}`, { 'opacity-100': scrolled }]"
        v-html='title'>
      </li>
      <li
        class='opacity-0 transition-all text-right'
        :class="[`${stickytitle_classes}`, { 'opacity-100': scrolled }]"
      >
        <slot name="headerright"></slot>
      </li>
    </ul>
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
