<template>
  <PhoneUI
    title="Dashboard"
    :configUI="{ hide_desktop_header: true }"
  >
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="mb-5">
        <h1 class="text-2xl font-bold text-darkblack">Dashboard</h1>
        <p class="text-sm text-darkgray mt-0.5">An overview of your members, activity, and upcoming events.</p>
      </div>

      <!-- 1. Stats Bar -->
      <StatsBar />

      <!-- 2. Upcoming Special Events -->
      <div v-if="hasUpcoming" class="border-t border-lightgray pt-5 mb-5">
        <OrbitDates :params="{ per_page: 3, style: 'SpecialDates' }">
          <template v-slot:title>
            <MainTitle title="Coming Up" :route="{ name: 'SpecialEvents' }" />
          </template>
          <template v-slot:loadingAnimation>
            <SimpleListAnimation />
          </template>
        </OrbitDates>
      </div>

      <!-- 4. Comments grouped by member -->
      <div class="border-t border-lightgray pt-5 mb-5">
        <OrbitComments :params="{ per_page: 15, style: 'UsersListGrouped' }">
          <template v-slot:title>
            <MainTitle title="Comments" :route="{ name: 'Comments' }" />
          </template>
          <template v-slot:loadingAnimation>
            <ListWithImageAnimation />
          </template>
          <template v-slot:whenempty>
            <div class="text-xs text-darkgray py-2">No comments yet.</div>
          </template>
        </OrbitComments>
      </div>

      <!-- 6. Recent Activity (events) -->
      <div class="border-t border-lightgray pt-5 mb-5">
        <MainTitle title="Recent Activity" :route="{ name: 'Events' }" />
        <div v-if="activityLoading" class="py-4">
          <SimpleListAnimation />
        </div>
        <ActivityTimeline v-else :items="activityItems" />
      </div>

      <div class="mb-8"></div>
    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from "@/components/PhoneUI.vue";
import MainTitle from "@/templates/Misc/MainTitle.vue";
import StatsBar from "@/templates/Misc/StatsBar.vue";
import ActivityTimeline from "@/templates/Posts/ActivityTimeline.vue";

import OrbitComments from "@/lib/OrbitComments.vue";
import OrbitDates from "@/lib/OrbitDates.vue";

import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import SimpleListAnimation from "@/templates/Animation/SimpleList.vue";

import API from "@/api.js";
import store from "@/store";
import router from "@/router";

import { ref } from "vue";

export default {
  name: "Home",
  components: {
    PhoneUI,
    MainTitle,
    StatsBar,
    ActivityTimeline,
    OrbitComments,
    OrbitDates,
    ListWithImageAnimation,
    SimpleListAnimation,
  },
  setup() {
    if (!store.state.settings || !store.state.settings.account_url)
      router.push("/login");

    const hasUpcoming    = ref(false);
    const activityItems  = ref([]);
    const activityLoading = ref(true);

    const init = async () => {
      try {
        const [datesRes, eventsRes] = await Promise.all([
          API.requestSpecialDates({ per_page: 1 }),
          API.requestPosts("inpursuit-events", { per_page: 8 }),
        ]);
        hasUpcoming.value = (parseInt(datesRes.headers["x-wp-total"]) || 0) > 0;
        activityItems.value = (eventsRes.data || []).map((e) => ({
          ...e,
          _type: "event",
          _date: e.date,
        }));
      } catch (e) {
        // silently fail
      } finally {
        activityLoading.value = false;
      }
    };

    init();

    return {
      hasUpcoming,
      activityItems,
      activityLoading,
    };
  },
};
</script>
