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
          :style="item.featured_image ? {} : { background: getGradient(item.member_name) }"
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
          <p class="text-sm font-medium text-darkblack leading-tight">
            {{ item.member_name }}
          </p>
          <p class="text-xs text-darkgray mt-0.5">
            {{ getSubTitle(item) }}
          </p>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
import { getGradient, getInitials } from "@/lib/Gradients";

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getInitials(name) {
      return getInitials(name);
    },
    getGradient(name) {
      return getGradient(name);
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
