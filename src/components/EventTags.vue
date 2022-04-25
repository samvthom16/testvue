<template>
  <ul class="text-sm dark:text-gray-400">
    <li class="inline-block truncate" v-if="getLocation(event)">
      <div class="mr-2 p-1 px-2 rounded bg-orange text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 inline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {{ getLocation(user) }}
      </div>
    </li>
    <li class="inline-block truncate" v-if="getEventType(event)">
      <div class="mr-2 p-1 px-2 rounded bg-purple text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 inline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {{ getEventType(event) }}
      </div>
    </li>
  </ul>
</template>

<script>
import eventMixin from "@/mixins/EventMixin.js";

export default {
  name: "EventTags",
  props: {
    event: Object,
  },
  mixins: [eventMixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
