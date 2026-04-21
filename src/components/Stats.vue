<template>
  <!-- Skeleton -->
  <div v-if="!stats.length" class="grid grid-cols-2 gap-3">
    <div
      v-for="i in 4"
      :key="i"
      class="bg-lightergray rounded-2xl p-4 animate-pulse h-24"
    ></div>
  </div>

  <!-- Stat cards -->
  <div v-else class="grid grid-cols-2 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white border border-lightgray rounded-2xl p-4"
    >
      <p class="text-xs font-medium text-gray uppercase tracking-wider mb-2">{{ stat.label }}</p>
      <p class="text-3xl font-bold text-darkblack leading-none">{{ stat.total }}</p>
      <p v-if="stat.growth" class="text-xs font-medium mt-2" :class="isPositive(stat.growth) ? 'text-green' : 'text-gray'">
        {{ stat.growth }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import API from "@/api";

export default {
  props: {
    period: Number,
  },
  setup(props) {
    const stats = ref([]);

    API.requestAnalytics({ period: props.period }).then(
      (response) => (stats.value = response.data)
    );

    const isPositive = (growth) => {
      const num = parseFloat(growth);
      return !isNaN(num) && num >= 0;
    };

    return { stats, isPositive };
  },
};
</script>
