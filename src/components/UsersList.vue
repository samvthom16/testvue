<template>
  <!-- Modal Box -->
  <div
    v-if="isModalVisible"
    class="w-full h-screen fixed bg-black bg-opacity-60"
  >
    <div class="absolute w-full h-full bg-black" @click="closeModal"></div>
    <div
      class="
        relative
        w-2/4
        h-3/4
        overflow-y-scroll
        my-8
        m-auto
        bg-white
        p-4
        px-6
      "
    >
      <button
        type="button"
        @click="closeModal"
        class="
          absolute
          right-2
          top-4
          text-3xl
          font-bold
          leading-none
          text-darkorange
          dark:text-white
        "
      >
        &times;
      </button>
      <form @submit="filterFormSubmit" id="filterForm">
        <div class="text-sm dark:text-gray-400">
          <FilterTags
            v-on:filterTags="getFilterTagData($event)"
            tagkey="location"
            tag="Location"
            :tagData="locationdata"
            :selectedFilterData="this.selectedFiltersData.location"
          />
          <FilterTags
            v-on:filterTags="getFilterTagData($event)"
            tagkey="gender"
            tag="Gender"
            :tagData="genderData"
            :selectedFilterData="this.selectedFiltersData.gender"
          />
          <FilterTags
            v-on:filterTags="getFilterTagData($event)"
            tagkey="group"
            tag="Group Leader"
            :tagData="groupData"
            :selectedFilterData="this.selectedFiltersData.group"
          />
          <FilterTags
            v-on:filterTags="getFilterTagData($event)"
            tagkey="profession"
            tag="Profession"
            :tagData="professionData"
            :selectedFilterData="this.selectedFiltersData.profession"
          />
        </div>
        <input
          class="
            my-4
            border border-orange
            font-semibold
            p-2
            px-4
            rounded-lg
            bg-orange
            text-sm
            btn btn-block
          "
          @click="filterFormSubmit"
          type="submit"
          value="Apply"
        />

        <button
          type="button"
          @click="clearFilters"
          class="
            my-4
            ml-4
            border
            p-2
            font-semibold
            px-4
            rounded-lg
            bg-transparent
            text-sm
          "
        >
          Clear
        </button>
        <button
          type="button"
          @click="closeModal"
          class="
            my-4
            ml-4
            border
            p-2
            font-semibold
            px-4
            rounded-lg
            bg-transparent
            text-sm
          "
        >
          Cancel
        </button>
      </form>
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
                    class="w-full h-full object-cover rounded-full"
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
      selectedFiltersData: {
        location: "",
        gender: "",
        group: "",
        profession: "",
      },
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

    clearFilters() {
      this.selectedFiltersData = {
        location: "",
        gender: "",
        group: "",
        profession: "",
      };
      this.setFilterData();

      this.$parent.refreshItems();
      this.isModalVisible = false;
    },

    getFilterTagData(e) {
      this.selectedFiltersData[e["tag"]] = e["filterIds"];
    },

    setFilterData() {
      this.$emit("applyFilterTags", this.selectedFiltersData);
    },

    filterFormSubmit(ev) {
      // console.log("ev == ", ev);
      ev.preventDefault();

      this.setFilterData();
      // var $form = document.getElementById("filterForm");

      // console.log("form == ", $form);

      // var selectedFilters = Object.fromEntries(new FormData($form).entries());

      // console.log("selectedFilters == ", selectedFilters);
      this.$parent.refreshItems();

      this.isModalVisible = false;
    },
  },
};
</script>
