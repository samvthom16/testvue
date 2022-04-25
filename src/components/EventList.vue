<template>
  <div>
    <div class="mx-auto max-w-2xl">
      <div class="p-4 bg-white sm:p-8 dark:bg-gray">
        <div class="flex justify-between items-center mb-4">
          <h3 class="title">Events ({{ events.length }})</h3>
          <span class="text-sm font-medium text-gray dark:text-white">
            Total of {{ total }} items
          </span>
        </div>
        <div
          class="
            flex
            mb-3
            border-black
            rounded
            w-full
            p-2
            outline-none
            focus:border-red
            border-2
          "
        >
          <div class="w-11/12">
            <input
              class="w-full outline-none focus:none align-middle"
              type="text"
              placeholder="Search"
              v-model="$parent.search"
            />
          </div>
        </div>
        <div class="flow-root">
          <ul
            role="list"
            class="divide-y divide-lightgray dark:divide-gray-700"
          >
            <li class="py-3 sm:py-4" v-for="event in events" :key="event.id">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-1">
                  <div
                    class="
                      bg-lightgray
                      w-16
                      h-16
                      rounded-full
                      overflow-hidden
                      inline-block
                    "
                  >
                    <img
                      class="w-full h-full object-cover rounded-full"
                      :src="event.featured_image"
                      :alt="event.title.rendered"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h1 class="text-xl font-semibold truncate dark:text-white">
                    {{ event.title.rendered }}
                  </h1>
                  <EventTags :event="event" class="mt-1" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventTags from "./EventTags.vue";

export default {
  name: "EventList",
  components: { EventTags },

  props: {
    events: Array,
    total: Number,
  },
};
</script>
<style scoped>
.button {
  @apply border border-orange font-semibold p-2 px-4 rounded-lg bg-orange text-sm;
}
.title {
  @apply text-xl font-bold leading-none;
}
</style>
