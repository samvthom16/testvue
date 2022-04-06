<template>
  <!-- Modal Box -->
  <div
    v-if="isModalVisible"
    class="w-full h-screen fixed bg-black bg-opacity-60"
  >
    <div class="relative w-2/4 h-2/4 my-16 m-auto rounded-xl bg-white p-20">
      <button
        @click="closeModal"
        class="
          absolute
          right-2
          top-0
          text-2xl
          font-bold
          leading-none
          text-darkorange
          dark:text-white
        "
      >
        &times;
      </button>
      <h3
        class="
          text-xl
          py-4
          font-bold
          leading-none
          text-gray-900
          dark:text-white
        "
      >
        Filter By
      </h3>
      <ul class="text-sm dark:text-gray-400">
        <FilterTags :tag="`Location`" :tagData="locationdata" />
        <FilterTags :tag="`Gender`" :tagData="genderData" />
        <FilterTags :tag="`Group`" :tagData="groupData" />
        <FilterTags :tag="`Profession`" :tagData="professionData" />

        <!-- <li class="inline-block truncate">
          <div class="mr-2 p-1 px-2 rounded bg-lightpurple text-white">
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
            Gender
          </div>
        </li>
        <li class="inline-block truncate">
          <div class="mr-2 p-1 px-2 rounded bg-lightred text-white">
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
            Group
          </div>
        </li>
        <li class="inline-block truncate">
          <div class="mr-2 p-1 px-2 rounded bg-gray text-white">
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
            Profession
          </div>
        </li> -->
      </ul>
    </div>
  </div>

  <!-- This is an example component -->
  <div class="mx-auto max-w-2xl">
    <div class="p-4 bg-white sm:p-8 dark:bg-gray">
      <div class="flex justify-between items-center mb-4">
        <h3
          class="text-xl font-bold leading-none text-gray-900 dark:text-white"
        >
          Members ({{ users.length }})
        </h3>
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
        <div class="w-1/12 text-red">
          <button class="float-right" @click="showModal">
            <svg
              version="1.1"
              class="w-8"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              style="enable-background: new 0 0 100 100"
              xml:space="preserve"
            >
              <g id="Layer_1"></g>
              <g id="Layer_2">
                <path
                  d="M59.5,61.5v15c0,1.3-1.1,2.4-2.4,2.4h-0.1c-1.3,0-2.4-1.1-2.4-2.4v-15c0-1.3,1.1-2.4,2.4-2.4h0.1
                C58.4,59.1,59.5,60.2,59.5,61.5z"
                />
                <path
                  d="M30.5,42.6v15c0,1.3-1.1,2.4-2.4,2.4H28c-1.3,0-2.4-1.1-2.4-2.4v-15c0-1.3,1.1-2.4,2.4-2.4h0.1
                C29.4,40.2,30.5,41.2,30.5,42.6z"
                />
                <path
                  d="M65.9,23.5v15c0,1.3-1.1,2.4-2.4,2.4h-0.1c-1.3,0-2.4-1.1-2.4-2.4v-15c0-1.3,1.1-2.4,2.4-2.4h0.1
                C64.9,21.2,65.9,22.2,65.9,23.5z"
                />
                <path
                  d="M63.1,33.5H23.2c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h39.9c1.2,0,2.1,0.9,2.1,2.1v0.7
                C65.2,32.5,64.3,33.5,63.1,33.5z"
                />
                <path
                  d="M76.8,52.5H36.9c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h39.9c1.2,0,2.1,0.9,2.1,2.1v0.7
                C78.9,51.6,78,52.5,76.8,52.5z"
                />
                <path
                  d="M55.6,71.4H23.2c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h32.4c1.2,0,2.1,0.9,2.1,2.1v0.7
                C57.7,70.5,56.7,71.4,55.6,71.4z"
                />
                <path
                  d="M76.5,71.4H65.9c-1.4,0-2.4-1.1-2.4-2.4v0c0-1.4,1.1-2.4,2.4-2.4h10.6c1.4,0,2.4,1.1,2.4,2.4v0
                C78.9,70.3,77.8,71.4,76.5,71.4z"
                />
                <path
                  d="M28,52.5h-4.8c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1H28c1.2,0,2.1,0.9,2.1,2.1v0.7
                C30.1,51.6,29.2,52.5,28,52.5z"
                />
                <path
                  d="M76.8,33.5h-4.1c-1.2,0-2.1-0.9-2.1-2.1v-0.7c0-1.2,0.9-2.1,2.1-2.1h4.1c1.2,0,2.1,0.9,2.1,2.1v0.7
                C78.9,32.5,78,33.5,76.8,33.5z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div class="flow-root">
        <ul role="list" class="divide-y divide-lightgray dark:divide-gray-700">
          <li class="py-3 sm:py-4" v-for="user in users" :key="user.id">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-1">
                <router-link
                  :to="$parent.getPostLink(user)"
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
                    class="w-16 rounded-full"
                    :src="user.featured_image"
                    :alt="user.title.rendered"
                  />
                </router-link>
              </div>
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-semibold truncate dark:text-white">
                  <router-link :to="$parent.getPostLink(user)">{{
                    user.title.rendered
                  }}</router-link>
                </h1>
                <UserTags :user="user" class="mt-1" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import UserTags from "./UserTags.vue";
import FilterTags from "./FilterTags.vue";

import userMixin from "@/mixins/UserMixin.js";

import API from "../api.js";

export default {
  name: "UsersList",
  components: { UserTags, FilterTags },
  mixins: [userMixin],
  props: {
    users: Array,
    total: Number,
  },
  data() {
    return {
      isModalVisible: false,
      filterdata: {},
      locationdata: {},
      genderData: {},
      groupData: {},
      professionData: {},
    };
  },
  async created() {
    try {
      var request = await API.makeRequest({
        method: "get",
        url: "https://admin.lighthousechurch.in/wp-json/inpursuit/v1/settings",
      });

      this.filterdata = request.data;
      this.locationdata = request.data["location"];
      this.genderData = request.data["gender"];
      this.groupData = request.data["group"];
      this.professionData = request.data["profession"];

      console.log(request.data);
      console.log(location);
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>