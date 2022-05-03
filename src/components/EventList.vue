<template>
  <div>
    <Modal v-show="isModalVisible" @close="closeModal()">
      <template v-slot:modalcontent>
        <AddEvent
          v-on:close="closeAddEvent($event)"
          :eventTypeData="eventTypeData"
          :locationData="locationData"
        />
        <!-- <form @submit="filterFormSubmit" id="filterForm">
          <div>yohohoho</div>
          <div class="my-4">
            <button class="button" @click="filterFormSubmit" type="submit">
              Apply
            </button>
            <span class="mx-4 text-sm">or</span>
            <button
              type="button"
              @click="clearFilters"
              class="text-sm underline"
            >
              Clear
            </button>
          </div>
        </form> -->
      </template>
    </Modal>

    <div class="mx-auto max-w-2xl">
      <div class="p-4 bg-white sm:p-8 dark:bg-gray">
        <div class="flex justify-between items-center mb-4">
          <h3 class="title">Events ({{ events.length }})</h3>
          <span class="text-sm font-medium text-gray dark:text-white">
            Total of {{ total }} items
          </span>
        </div>

        <div class="flex justify-between items-center mb-5">
          <div
            class="
              flex
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

          <button
            class="ml-2 inline-block whitespace-nowrap button"
            @click="showModal"
            type="button"
          >
            ADD EVENT
          </button>
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
import AddEvent from "./AddEvent.vue";
import EventTags from "./EventTags.vue";
import Modal from "@/components/Modal";

import store from "@/store";
import API from "../api.js";
import { ref } from "vue";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "EventList",
  components: { AddEvent, EventTags, Modal },
  mixins: [apiMixin],
  setup() {
    const eventTypeData = ref({});
    const locationData = ref({});

    store.commit("getLocalSettings");

    var account_url = store.state.settings.account_url;

    API.makeRequest({
      method: "get",
      url: account_url + "/wp-json/inpursuit/v1/settings",
    }).then((response) => {
      eventTypeData.value = response.data["event_type"];
      locationData.value = response.data["location"];
    });
    return {
      eventTypeData,
      locationData,
    };
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  props: {
    events: Array,
    total: Number,
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    closeAddEvent(e) {
      this.isModalVisible = e;
      this.$parent.refreshItems();
    },
  },
};
</script>
<style scoped>
.button {
  @apply border border-purple font-semibold p-2 px-4 rounded-lg bg-purple text-sm text-white;
}
.title {
  @apply text-xl font-bold leading-none;
}
</style>