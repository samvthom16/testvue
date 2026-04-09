<template>
  <PhoneUI title="Analytics" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-2xl font-bold text-darkblack">Analytics</h1>
          <p class="text-sm text-darkgray mt-0.5">Track growth and activity across your community.</p>
        </div>
      </div>

      <!-- Period chips -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="(label, value) in periods"
          :key="value"
          @click="selectPeriod(value)"
          class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="period === value
            ? 'bg-purple text-white'
            : 'bg-lightergray text-darkgray hover:bg-lightgray'"
        >
          {{ label }}
        </button>
      </div>

      <!-- Stats -->
      <Stats :period="period" :key="period" />

    </template>
  </PhoneUI>
</template>

<script>
import { ref } from "vue";
import Stats from "@/components/Stats.vue";
import PhoneUI from "@/components/PhoneUI.vue";

export default {
  components: {
    PhoneUI,
    Stats,
  },
  setup() {
    const period = ref(30);

    const periods = {
      30: "Month",
      90: "Quarter",
      180: "6 Months",
      365: "Year",
    };

    const selectPeriod = (value) => {
      period.value = parseInt(value);
    };

    return {
      period,
      periods,
      selectPeriod,
    };
  },
};
</script>
