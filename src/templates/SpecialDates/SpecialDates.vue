<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="py-3" v-for="item in items" :key="item?.member_id">
      <router-link
        :to="{ name: 'SingleMember', params: { id: item?.member_id } }"
        class="flex items-start space-x-4 w-full"
      >
        <!-- Thumbnail -->
        <div
          class="w-12 h-12 flex-shrink-0 rounded-full bg-lightorange flex items-center justify-center font-bold text-xl"
        >
          <img
            v-if="item.featured_image"
            :src="item.featured_image"
            alt="Thumbnail"
            class="w-full h-full rounded-full object-cover"
          />
          <template v-else>
            {{ item.member_name.charAt(0).toUpperCase() }}
          </template>
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
    getSubTitle: (event) => {
      let dateStr = "";

      const events = {
        wedding: "Wedding Anniversary",
        birthday: "Birthday",
      };

      const eventType = event.event_type ? events[event.event_type] : "Unknown";

      if (event.event_date) {
        const eventDate = new Date(event.event_date);
        dateStr += `${eventDate.getDate()} ${eventDate.toLocaleString("default", { month: "long" })} ${eventDate.getFullYear()}`;
      }

      return `${eventType} on ${dateStr}`;
    },
  },
};
</script>
