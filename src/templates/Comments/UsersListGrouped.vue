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
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              class="text-xs text-gray-500"
              v-html="group.member?.title?.rendered || ''"
            ></span>
            <span
              v-if="group.count > 1"
              class="text-xs bg-gray-100 text-gray-400 rounded-full px-1.5 py-0.5 leading-none"
            >{{ group.count }}</span>
            <span class="text-xs text-gray-400">
              · {{ group.timeAgo }} by
              <span class="uppercase tracking-wide text-gray-400/70">{{ group.user }}</span>
            </span>
          </div>
          <div class="mt-1 text-sm font-medium text-darkblack leading-snug line-clamp-2">
            {{ group.latestComment }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Util from "@/lib/Util";

const GRADIENTS = [
  ["#89558d", "#6d3f71"],
  ["#006491", "#004f73"],
  ["#DB6933", "#b85229"],
  ["#16a34a", "#0e7a38"],
  ["#9E81A0", "#7a617c"],
  ["#c2410c", "#9a3309"],
  ["#0369a1", "#025e8f"],
  ["#7c3aed", "#6427c4"],
];

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
      const name  = member.title.rendered.replace(/<[^>]+>/g, "").trim();
      const parts = name.split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    },
    getGradient(member) {
      if (!member?.title?.rendered) {
        return `linear-gradient(135deg, ${GRADIENTS[0][0]}, ${GRADIENTS[0][1]})`;
      }
      const name  = member.title.rendered.replace(/<[^>]+>/g, "").trim();
      const index = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % GRADIENTS.length;
      const [from, to] = GRADIENTS[index];
      return `linear-gradient(135deg, ${from}, ${to})`;
    },
  },
};
</script>
