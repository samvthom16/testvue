<template>
  <ul class="divide-y divide-lightgray">
    <li
      v-for="i in total"
      :key="i"
      class="flex items-center gap-4 py-3 animate-pulse"
    >
      <!-- Icon badge -->
      <div class="shrink-0 w-10 h-10 rounded-2xl bg-lightgray"></div>

      <!-- Name + count -->
      <div class="flex-1 min-w-0 space-y-2">
        <div class="h-3 bg-lightgray rounded-full" :style="{ width: lineWidths[i % lineWidths.length] }"></div>
        <div class="h-2 bg-lightergray rounded-full w-16"></div>
      </div>

      <!-- Edit button placeholder -->
      <div class="shrink-0 w-8 h-8 rounded-full bg-lightergray"></div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    total: {
      type:    Number,
      default: 8,
    },
  },
  setup() {
    const lineWidths = ['55%', '70%', '45%', '65%', '50%', '75%', '60%', '48%'];
    return { lineWidths };
  },
};
</script>
