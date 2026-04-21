<template>
  <div>
    <div
      v-for="i in total"
      :key="i"
      class="flex gap-4 animate-pulse"
    >
      <!-- Dot + vertical line -->
      <div class="flex flex-col items-center shrink-0 pt-1">
        <div class="w-3 h-3 rounded-full bg-lightgray shrink-0"></div>
        <div class="w-px flex-1 mt-1.5 bg-lightgray" style="min-height: 1.5rem;"></div>
      </div>
      <!-- Content -->
      <div class="flex-1 pb-5 min-w-0 space-y-1.5">
        <div class="h-3 bg-lightgray rounded-full" :style="{ width: titleWidths[i % titleWidths.length] }"></div>
        <div class="h-2 bg-lightergray rounded-full w-20"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: { type: Number, default: 10 },
  },
  setup() {
    const titleWidths = ['65%', '50%', '75%', '55%', '70%', '45%', '60%', '80%', '52%', '68%'];
    return { titleWidths };
  },
};
</script>
