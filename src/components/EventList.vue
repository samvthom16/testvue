<template>
  <div>
    <Modal v-if="isModalVisible" @close="closeModal()">
      <template v-slot:modalcontent>
        <AddEvent
          v-on:close="closeAddEvent($event)"
          :eventTypeData="eventTypeData"
          :locationData="locationData"
          :eventPost="eventPost"
          :isEditEvent="isEditEvent"
        />
      </template>
    </Modal>

    <div class="mx-auto max-w-2xl">
      <div class="p-4 bg-white sm:p-8 dark:bg-gray">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <h3 class="title">Events ({{ events.length }})</h3>
            <button
              class="inline-block whitespace-nowrap button ml-3"
              @click="showModal(false, {})"
              type="button"
            >
              ADD EVENT
            </button>
          </div>
          <span class="text-sm font-medium text-gray dark:text-white">
            Total of {{ total }} items
          </span>
        </div>

        <!-- <div class="flex justify-between items-center mb-5"> -->
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

        <!-- </div> -->

        <div class="flow-root">
          <ul
            role="list"
            class="divide-y divide-lightgray dark:divide-gray-700"
          >
            <li class="py-3 sm:py-4" v-for="event in events" :key="event.id">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-1">
                  <!-- <router-link
                    :to="$parent.getPostLink(event)"
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
                  </router-link> -->
                  <router-link :to="$parent.getPostLink(event)">
                    <CircularProgressBar
                      :contentProgress="event.attendants_percentage"
                      :size="70"
                    ></CircularProgressBar>
                  </router-link>
                </div>
                <div class="flex-1 min-w-0">
                  <h1 class="text-xl font-semibold truncate dark:text-white">
                    <router-link :to="$parent.getPostLink(event)">{{
                      event.title.rendered
                    }}</router-link>
                  </h1>
                  <EventTags :event="event" class="mt-1" />
                </div>
                <div>
                  <button
                    type="button"
                    @click="showModal(true, event)"
                    class="mt-6 text-sm underline text-center w-full"
                  >
                    Edit
                  </button>
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
import CircularProgressBar from "@/components/CircularProgressBar.vue";

import store from "@/store";
import API from "../api.js";
import { ref } from "vue";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "EventList",
  components: { AddEvent, EventTags, CircularProgressBar, Modal },
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
      isEditEvent: false,
      eventPost: {},
    };
  },
  props: {
    events: Array,
    total: Number,
  },
  methods: {
    showModal(isEdit, event) {
      if (isEdit) {
        this.eventPost = event;
        this.isEditEvent = true;
      } else {
        this.eventPost = {};
        this.isEditEvent = false;
      }
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    closeAddEvent(e) {
      this.isModalVisible = e.modal;
      this.$parent.refreshItems();
      this.$router.push("/events/" + e.id);
    },
  },
};
</script>
<style scoped>
.button {
  @apply border-2 border-purple  py-1 px-2 rounded-md bg-white text-sm text-purple;
}
.title {
  @apply text-xl font-bold leading-none;
}
</style>
