<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    <router-link
      v-for="stat in statList"
      :key="stat.label"
      :to="stat.route"
      class="bg-white rounded-xl px-4 py-3 border border-lightgray flex flex-col"
    >
      <div class="text-3xl font-bold text-darkblack leading-none">
        <span
          v-if="stat.value === null"
          class="inline-block w-10 h-7 bg-lightgray rounded animate-pulse"
        ></span>
        <span v-else>{{ stat.value }}</span>
      </div>
      <div class="text-xs text-darkgray mt-1">{{ stat.label }}</div>
    </router-link>
  </div>
</template>

<script>
import API from "@/api";

export default {
  data() {
    return {
      counts: { members: null, events: null, comments: null, specialDates: null },
    };
  },
  computed: {
    statList() {
      return [
        { label: "Members",       value: this.counts.members,      route: "/members" },
        { label: "Events",        value: this.counts.events,       route: "/events" },
        { label: "Comments",      value: this.counts.comments,     route: "/comments" },
        { label: "Special Events",value: this.counts.specialDates, route: "/special-events" },
      ];
    },
  },
  async mounted() {
    try {
      const [membersRes, eventsRes, commentsRes, datesRes] = await Promise.all([
        API.requestPosts("inpursuit-members", { per_page: 1 }),
        API.requestPosts("inpursuit-events",  { per_page: 1 }),
        API.requestComments({ per_page: 1 }),
        API.requestSpecialDates({ per_page: 1 }),
      ]);
      this.counts.members      = parseInt(membersRes.headers["x-wp-total"])  || 0;
      this.counts.events       = parseInt(eventsRes.headers["x-wp-total"])   || 0;
      this.counts.comments     = parseInt(commentsRes.headers["x-wp-total"]) || 0;
      this.counts.specialDates = parseInt(datesRes.headers["x-wp-total"])    || 0;
    } catch (e) {
      // silently fail
    }
  },
};
</script>
