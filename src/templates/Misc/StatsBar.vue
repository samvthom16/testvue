<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    <router-link
      v-for="stat in statList"
      :key="stat.label"
      :to="stat.route"
      class="bg-white rounded-2xl px-4 py-3.5 border border-lightgray flex items-center gap-3 active:bg-lightergray transition-colors"
    >
      <!-- Icon badge -->
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        :style="{ background: stat.iconBg }"
      >
        <svg class="w-4 h-4" :style="{ color: stat.iconColor }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="stat.iconPath" />
        </svg>
      </div>
      <!-- Number + label -->
      <div class="min-w-0">
        <div class="text-xl font-bold text-darkblack leading-none">
          <span
            v-if="stat.value === null"
            class="inline-block w-8 h-5 bg-lightgray rounded animate-pulse"
          ></span>
          <span v-else>{{ stat.value }}</span>
        </div>
        <div class="text-xs text-gray mt-0.5 truncate">{{ stat.label }}</div>
      </div>
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
        {
          label: "Members",
          value: this.counts.members,
          route: "/members",
          iconBg: '#F5F0F6',
          iconColor: '#89558d',
          iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
        },
        {
          label: "Events",
          value: this.counts.events,
          route: "/events",
          iconBg: '#EAF4FA',
          iconColor: '#006491',
          iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        },
        {
          label: "Comments",
          value: this.counts.comments,
          route: "/comments",
          iconBg: '#FFF5EC',
          iconColor: '#DB6933',
          iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        },
        {
          label: "Special Events",
          value: this.counts.specialDates,
          route: "/special-events",
          iconBg: '#EEF2FF',
          iconColor: '#4338CA',
          iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
        },
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
