<template>
  <PhoneUI title="Special Events" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="mb-5">
        <h1 class="text-2xl font-bold text-darkblack">Special Events</h1>
        <p class="text-sm text-darkgray mt-0.5">Upcoming birthdays, anniversaries, and special dates.</p>
      </div>

      <OrbitDates :params="params">
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total="10" />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
      </OrbitDates>
    </template>
  </PhoneUI>
</template>

<script>
import { ref } from "vue";
import PhoneUI from "@/components/PhoneUI.vue";
import OrbitDates from "@/lib/OrbitDates.vue";
import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

export default {
  components: {
    PhoneUI,
    OrbitDates,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
  },
  setup() {
    const params = ref({
      per_page: 10,
      style: "SpecialDates",
      pagination: 1,
    });

    return {
      params,
    };
  },
};
</script>
