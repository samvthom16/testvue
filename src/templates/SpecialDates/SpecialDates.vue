<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="py-3" v-for="item in items" :key="item?.member_id">
      <router-link
        :to="{ name: 'SingleMember', params: { id: item?.member_id } }"
        class="flex items-center space-x-4 w-full"
      >
        <!-- Thumbnail -->
        <div
          class="w-16 h-16 flex-shrink-0 rounded-full bg-lightorange flex items-center justify-center font-bold text-xl"
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
          <h3 class="text-lg font-semibold text-gray-900 capitalize">
            {{ item.member_name }}
          </h3>
          <p class="text-darkgray capitalize">
            {{
              item.event_type.toLowerCase() === "wedding" &&
              new Date(item.event_date).getFullYear() < new Date().getFullYear()
                ? "Anniversary"
                : item.event_type
            }}
            on {{ formatDate(item.event_date) }}
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
    viewDetails(item) {
      console.log("Viewing details for:", item);
    },
    formatDate(date) {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.toLocaleString("default", { month: "long" });

      const getOrdinalSuffix = (day) => {
        if (day % 10 === 1 && day % 100 !== 11) return "st";
        if (day % 10 === 2 && day % 100 !== 12) return "nd";
        if (day % 10 === 3 && day % 100 !== 13) return "rd";
        return "th";
      };

      const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

      return `${dayWithSuffix} ${month}`;
    },
  },
};
</script>
