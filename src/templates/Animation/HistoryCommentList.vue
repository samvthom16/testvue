<template>
  <div>
    <div
      v-for="i in total"
      :key="i"
      class="flex items-start gap-3 mb-5 animate-pulse"
    >
      <!-- Monogram avatar placeholder -->
      <div class="shrink-0 w-9 h-9 rounded-full bg-lightgray mt-0.5"></div>
      <!-- Content -->
      <div class="flex-1 min-w-0 space-y-2">
        <!-- Text body: 1–2 lines -->
        <div class="h-3 bg-lightgray rounded-full" :style="{ width: textWidths[i % textWidths.length] }"></div>
        <div
          v-if="i % 3 !== 0"
          class="h-3 bg-lightgray rounded-full"
          :style="{ width: textWidths2[i % textWidths2.length] }"
        ></div>
        <!-- Meta row: author · date -->
        <div class="flex items-center gap-2 mt-1">
          <div class="h-2 bg-lightergray rounded-full w-16"></div>
          <div class="h-2 bg-lightergray rounded-full w-1.5"></div>
          <div class="h-2 bg-lightergray rounded-full w-12"></div>
        </div>
      </div>
      <!-- Delete button placeholder -->
      <div class="shrink-0 w-4 h-4 rounded bg-lightergray mt-0.5"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: { type: Number, default: 10 },
  },
  setup() {
    const textWidths  = ['80%', '65%', '90%', '70%', '85%', '60%', '75%', '95%', '68%', '78%'];
    const textWidths2 = ['55%', '40%', '70%', '45%', '60%', '35%', '50%', '65%', '42%', '58%'];
    return { textWidths, textWidths2 };
  },
};
</script>
