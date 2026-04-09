<template>
  <div class="divide-y divide-lightgray">
    <div
      v-for="i in total"
      :key="i"
      class="flex items-center gap-4 py-3 animate-pulse"
    >
      <!-- Monogram avatar -->
      <div class="shrink-0 w-10 h-10 rounded-full bg-lightgray"></div>

      <!-- Name + email + status row -->
      <div class="flex-1 min-w-0 space-y-2">
        <div class="h-3 bg-lightgray rounded-full" :style="{ width: nameWidths[i % nameWidths.length] }"></div>
        <div class="h-2 bg-lightergray rounded-full" :style="{ width: emailWidths[i % emailWidths.length] }"></div>
        <div class="flex items-center gap-2 mt-1">
          <div class="h-4 w-14 bg-lightergray rounded-full"></div>
          <div class="h-2 w-10 bg-lightergray rounded-full"></div>
        </div>
      </div>

      <!-- Action button placeholder -->
      <div class="shrink-0 w-8 h-8 rounded-full bg-lightergray"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type:    Number,
      default: 5,
    },
  },
  setup() {
    const nameWidths  = ['45%', '60%', '50%', '65%', '40%'];
    const emailWidths = ['60%', '75%', '55%', '70%', '65%'];
    return { nameWidths, emailWidths };
  },
};
</script>
