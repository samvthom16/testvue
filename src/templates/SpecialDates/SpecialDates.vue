<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="py-3" v-for="item in items" :key="item?.member_id">
      <router-link
        :to="{ name: 'SingleMember', params: { id: item?.member_id } }"
        class="flex items-start space-x-4 w-full"
      >
        <!-- Thumbnail -->
        <div
          class="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm"
          :style="item.featured_image ? '' : getGradient(item.member_name)"
        >
          <img
            v-if="item.featured_image"
            :src="item.featured_image"
            alt="Thumbnail"
            class="w-full h-full rounded-full object-cover"
          />
          <span v-else class="text-white tracking-wide select-none">
            {{ getInitials(item.member_name) }}
          </span>
        </div>

        <!-- Event Details -->
        <div class="flex-1">
          <h3 class="text-lg leading-tight">
            {{ item.member_name }}
          </h3>
          <p class="text-darkgray">
            {{ getSubTitle(item) }}
          </p>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getInitials(name) {
      if (!name) return "?";
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    },
    getGradient(name) {
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
      if (!name) return `background: linear-gradient(135deg, ${GRADIENTS[0][0]}, ${GRADIENTS[0][1]})`;
      const index = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % GRADIENTS.length;
      return `background: linear-gradient(135deg, ${GRADIENTS[index][0]}, ${GRADIENTS[index][1]})`;
    },
    getSubTitle: (event) => {
      let dateStr = "";

      const events = {
        wedding: "Wedding Anniversary",
        birthday: "Birthday",
      };

      const eventType = event.event_type ? events[event.event_type] : "Unknown";

      if (event.event_date) {
        const eventDate = new Date(event.event_date);
        dateStr += `${eventDate.getDate()} ${eventDate.toLocaleString("default", { month: "long" })}`;
      }

      return `${eventType} on ${dateStr}`;
    },
  },
};
</script>
