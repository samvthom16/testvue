<template>
  <ul class="mt-2 md:grid md:grid-cols-2 md:gap-x-8">
    <li
      v-for="user in posts"
      :key="user.id"
      class="flex items-center gap-3 py-2.5 border-b border-lightgray"
    >
      <!-- Avatar -->
      <img
        v-if="!isDefaultImage(user)"
        :src="user.featured_image"
        class="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <div
        v-else
        class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        :style="{ background: getGradient(user) }"
      >
        <span class="text-white font-bold text-sm select-none tracking-wide">
          {{ getInitials(user) }}
        </span>
      </div>

      <!-- Name -->
      <div class="flex-1 min-w-0 font-semibold text-darkblack text-sm" v-html="user.title.rendered"></div>

      <!-- Toggle -->
      <div class="shrink-0">
        <Switch
          v-model:checked="user.attended"
          @click="onAttendanceChange($event, user)"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import Switch from "@/components/switch.vue";

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
  name: "MemberListWithSwitch",
  props: {
    posts: Array,
  },
  components: {
    Switch,
  },
  methods: {
    isDefaultImage(post) {
      return !post.featured_image || post.featured_image.includes("default-profile.png");
    },

    getInitials(post) {
      if (!post.title || !post.title.rendered) return "?";
      const name = post.title.rendered.replace(/<[^>]+>/g, "").trim();
      const parts = name.split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    },

    getGradient(post) {
      if (!post.title || !post.title.rendered) {
        return `linear-gradient(135deg, ${GRADIENTS[0][0]}, ${GRADIENTS[0][1]})`;
      }
      const name = post.title.rendered.replace(/<[^>]+>/g, "").trim();
      const index = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % GRADIENTS.length;
      const [from, to] = GRADIENTS[index];
      return `linear-gradient(135deg, ${from}, ${to})`;
    },

    getName(user) {
      if (user.title?.rendered) return user.title.rendered.replace(/<[^>]+>/g, '').trim();
      if (typeof user.title === 'string') return user.title;
      return '';
    },

    onAttendanceChange(ev, user) {
      this.$emit("onAttendanceChange", { flag: ev.target.checked, user });
    },
  },
};
</script>
