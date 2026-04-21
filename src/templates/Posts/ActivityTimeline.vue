<template>
  <ul role="list" class="mt-2">
    <li v-for="(item, i) in items" :key="i" class="flex gap-3 py-2.5">
      <!-- Monogram (single letter, rounded square like SingleEvent) -->
      <div
        class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
        :style="{ background: getBackground(item) }"
      >
        <span class="text-white font-bold text-sm select-none">{{ getInitial(item) }}</span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div
          class="text-sm font-semibold text-darkblack leading-snug"
          v-html="getTitle(item)"
        ></div>
        <div class="text-xs text-darkgray mt-0.5">{{ timeAgo(item._date) }}</div>
      </div>
    </li>

    <li v-if="!items.length" class="py-4 text-xs text-darkgray">
      No recent activity.
    </li>
  </ul>
</template>

<script>
import Util from "@/lib/Util";
import { getGradient } from "@/lib/Gradients";

export default {
  props: {
    items: { type: Array, default: () => [] },
  },
  methods: {
    getTitle(item) {
      if (item._type === "comment") return item.member?.title?.rendered || "";
      return item.title?.rendered || "";
    },
    getInitial(item) {
      const title = this.getTitle(item).replace(/<[^>]+>/g, "").trim();
      return title ? title[0].toUpperCase() : "?";
    },
    getBackground(item) {
      const title = this.getTitle(item).replace(/<[^>]+>/g, "").trim();
      return getGradient(title || null);
    },
    timeAgo: (d) => Util.timeAgo(d),
  },
};
</script>
