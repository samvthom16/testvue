<template>

  <!-- ── MOBILE: list rows ─────────────────────────────── -->
  <ul class="md:hidden -mx-4">
    <li v-for="post in posts" :key="post.id">
      <router-link
        :to="getPostLink(post)"
        class="flex items-center gap-4 px-4 py-3.5 border-b border-lightgray active:bg-lightergray transition-colors border-l-4"
        :style="{ borderLeftColor: getBadgeColor(post) }"
      >
        <!-- Icon badge -->
        <div
          class="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
          :style="{ background: getBadgeBg(post) }"
        >
          <svg class="w-5 h-5" :style="{ color: getBadgeColor(post) }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-darkblack text-sm truncate" v-html="post.title.rendered"></p>
          <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span class="text-xs text-gray">{{ timeAgo(post.date) }}</span>
            <template v-if="getEventType(post)">
              <span class="text-xs text-gray/50">·</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :style="{ background: getBadgeBg(post), color: getBadgeColor(post) }">
                {{ getEventType(post) }}
              </span>
            </template>
          </div>
        </div>

        <svg class="w-4 h-4 text-lightgray shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </router-link>
    </li>
  </ul>

  <!-- ── DESKTOP: table ────────────────────────────────── -->
  <div class="hidden md:block rounded-2xl border border-lightgray overflow-x-auto">
    <table class="w-full min-w-max">
      <thead>
        <tr class="bg-lightergray border-b border-lightgray">
          <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Event</th>
          <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Type</th>
          <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Status</th>
          <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Date</th>
          <th class="py-3 px-5"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-lightgray bg-white">
        <tr
          v-for="post in posts"
          :key="post.id"
          class="hover:bg-lightergray transition-colors group border-l-4"
          :style="{ borderLeftColor: getBadgeColor(post) }"
        >
          <!-- Event name -->
          <td class="py-3.5 px-5">
            <div class="flex items-center gap-3">
              <div
                class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                :style="{ background: getBadgeBg(post) }"
              >
                <svg class="w-4 h-4" :style="{ color: getBadgeColor(post) }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="font-semibold text-darkblack text-sm whitespace-nowrap" v-html="post.title.rendered"></p>
            </div>
          </td>

          <!-- Type -->
          <td class="py-3.5 px-5">
            <span
              v-if="getEventType(post)"
              class="inline-block text-xs font-medium px-2.5 py-1 rounded-full"
              :style="{ background: getBadgeBg(post), color: getBadgeColor(post) }"
            >{{ getEventType(post) }}</span>
            <span v-else class="text-sm text-gray">—</span>
          </td>

          <!-- Status -->
          <td class="py-3.5 px-5">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-lightergray whitespace-nowrap"
              :class="post.status === 'publish' ? 'text-green' : 'text-darkgray'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="post.status === 'publish' ? 'bg-green' : 'bg-gray'"></span>
              {{ post.status === 'publish' ? 'Active' : 'Archived' }}
            </span>
          </td>

          <!-- Date -->
          <td class="py-3.5 px-5 text-sm text-darkgray whitespace-nowrap">
            {{ timeAgo(post.date) }}
          </td>

          <!-- Actions -->
          <td class="py-3.5 px-5 text-right">
            <router-link
              :to="getPostLink(post)"
              class="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-xs font-medium text-purple border border-purple rounded-lg px-3 py-1.5 hover:bg-purple hover:text-white whitespace-nowrap"
            >
              View
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
import Util from "@/lib/Util.js";
import store from "@/store";

const TYPE_PALETTES = [
  { bg: '#F5F0F6', color: '#89558d' },   // purple
  { bg: '#EAF4FA', color: '#006491' },   // blue
  { bg: '#FFF5EC', color: '#DB6933' },   // orange
  { bg: '#EEF2FF', color: '#4338CA' },   // indigo
  { bg: '#E0F2FE', color: '#0369a1' },   // sky blue
  { bg: '#FFFBEB', color: '#B45309' },   // amber
  { bg: '#F5F3FF', color: '#7C3AED' },   // violet
  { bg: '#FEF3EE', color: '#C2410C' },   // deep orange
];

export default {
  name: "EventsGrid",
  props: {
    posts: Array,
    total: Number,
  },
  methods: {
    getPostLink: (post) => Util.getPostLink(post),
    timeAgo: (date) => Util.timeAgo(date),

    getEventType(post) {
      const settings = store.state?.account;
      if (settings?.event_type && post.event_type) {
        return settings.event_type[post.event_type] || '';
      }
      return '';
    },

    _paletteForPost(post) {
      const type = post.event_type;
      if (!type) return TYPE_PALETTES[0];
      const keys = Object.keys(store.state?.account?.event_type || {});
      const idx = keys.indexOf(String(type));
      return TYPE_PALETTES[(idx === -1 ? Number(type) : idx) % TYPE_PALETTES.length];
    },

    getBadgeBg(post)    { return this._paletteForPost(post).bg; },
    getBadgeColor(post) { return this._paletteForPost(post).color; },
  },
};
</script>
