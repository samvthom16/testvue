<template>
  <ul role="list">
    <li v-for="group in groupedItems" :key="group.member?.id" class="py-3">
      <div class="flex gap-3">
        <!-- Avatar -->
        <div class="shrink-0">
          <img
            v-if="!isDefaultImage(group.member)"
            :src="group.member.featured_image"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :style="{ background: getGradient(group.member) }"
          >
            <span class="text-white font-bold text-sm select-none tracking-wide">
              {{ getInitials(group.member) }}
            </span>
          </div>
        </div>

        <!-- Right column -->
        <div class="flex-1 min-w-0">
          <div
            class="text-sm font-medium text-darkblack leading-snug"
            v-html="group.member?.title?.rendered || ''"
          ></div>
          <div class="mt-0.5 text-xs text-gray">
            {{ group.timeAgo }} · by
            <span class="uppercase tracking-wide">{{ group.user }}</span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Util from "@/lib/Util";
import { getGradient, getInitials } from "@/lib/Gradients";

export default {
  props: {
    items: Array,
  },
  computed: {
    groupedItems() {
      const groups = {};
      for (const comment of this.items || []) {
        const id = comment.member?.id || "unknown";
        if (!groups[id]) {
          groups[id] = {
            member: comment.member,
            count: 0,
            latestComment: "",
            latestDate: "",
            timeAgo: "",
            user: "",
          };
        }
        groups[id].count++;
        if (!groups[id].latestDate || comment.post_date > groups[id].latestDate) {
          groups[id].latestComment = comment.comment;
          groups[id].latestDate    = comment.post_date;
          groups[id].timeAgo       = Util.timeAgo(comment.post_date);
          groups[id].user          = comment.user?.name || "";
        }
      }
      return Object.values(groups).sort(
        (a, b) => new Date(b.latestDate) - new Date(a.latestDate)
      );
    },
  },
  methods: {
    isDefaultImage(member) {
      if (!member) return true;
      return !member.featured_image || member.featured_image.includes("default-profile.png");
    },
    getInitials(member) {
      if (!member?.title?.rendered) return "?";
      return getInitials(member.title.rendered.replace(/<[^>]+>/g, "").trim());
    },
    getGradient(member) {
      if (!member?.title?.rendered) return getGradient(null);
      return getGradient(member.title.rendered.replace(/<[^>]+>/g, "").trim());
    },
  },
};
</script>
