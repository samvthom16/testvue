<template>
  <div>
    <Modal :showModal='isModalVisible' @close="closeModal()">
      <template v-slot:modaltitle>
        <h4 class='font-semibold text-black'>Create Event</h4>
      </template>
      <template v-slot:modalcontent>
        <AddEvent
          v-on:close="closeAddEvent($event)"
          :eventTypeData="eventTypeData"
          :locationData="locationData"
        />
      </template>
    </Modal>

    <!--button
      class="inline-block whitespace-nowrap button mb-4"
      @click="showModal"
      type="button"
    >
      ADD EVENT
    </button-->

    <div class="flow-root">
      <ul role="list" class="divide-y divide-lightgray">
        <li class="py-3 sm:py-4" v-for="event in events" :key="event.id">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-1">
              <router-link :to="getPostLink(event)">
                <CircularProgressBar
                  :contentProgress="event.attendants_percentage"
                  :size="50"
                  :border-width="6"
                  :border-bg-width="7"
                ></CircularProgressBar>
              </router-link>
            </div>
            <div class="flex-1 min-w-0">
              <PostTitle :post='event' />
              <SubTitle :title='formatDate( event.date )' />
            </div>
          </div>
        </li>
      </ul>
    </div>


  </div>
</template>

<script>
import AddEvent from "./AddEvent.vue";

import Modal from "@/components/Modal";
import CircularProgressBar from "@/components/CircularProgressBar.vue";

import PostTitle from '@/templates/Post/Title'
import SubTitle from '@/templates/Misc/SubTitle'

import store from "@/store";
import API from "../api.js";
import Util from '@/lib/Util'
import { ref } from "vue";
import apiMixin from "@/mixins/APIMixin.js";


export default {
  name: "EventList",
  components: {
    AddEvent,

    CircularProgressBar,
    Modal,
    PostTitle,
    SubTitle
  },
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
      this.isModalVisible = e.modal;
      this.$parent.refreshItems();
      this.$router.push("/events/" + e.id);
    },
    formatDate: ( dateParam ) => Util.timeAgo( dateParam ),
    getPostLink: ( post ) => Util.getPostLink( post )
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
