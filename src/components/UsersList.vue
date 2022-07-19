<template>
  <div>
    <Modal v-show="isModalVisible" @close="closeModal()">
      <template v-slot:modalcontent>
        <form @submit="filterFormSubmit" id="filterForm">
          <div class="text-xs dark:text-gray-400">
            <FilterTags
              v-on:filterTags="getFilterTagData($event)"
              tagkey="location"
              tag="Location"
              :tagData="locationData"
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
        </form>
      </template>
    </Modal>

    <div class="flow-root">
      <ul role="list" class="divide-y divide-lightgray">
        <li class="py-3 sm:py-4" v-for="user in users" :key="user.id">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-1">
              <router-link
                :to="getPostLink(user)"
                class="bg-lightgray w-16 h-16 rounded-full overflow-hidden inline-block"
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
                <router-link :to="getPostLink( user )">
                  {{ user.title.rendered }}
                </router-link>
              </h1>
              <UserTags :user="user" class="mt-1" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import UserTags from "./UserTags.vue";
import FilterTags from "./FilterTags.vue";
//import Icon from "@/components/Icon";
import Modal from "@/components/Modal";

import userMixin from "@/mixins/UserMixin.js";

import store from "@/store";

import API from "../api.js";

import { ref } from "vue";

import Util from '@/lib/Util'

export default {
  name: "UsersList",
  components: {
    UserTags,
    FilterTags,
    //Icon,
    Modal
  },
  mixins: [userMixin],
  props: {
    users: Array,
    total: Number,
  },
  data() {
    return {
      isModalVisible: false,
      filterdata: {},
      //locationdata: {},
      //genderData: {},
      //groupData: {},
      //professionData: {},
      selectedFiltersData: {
        location: "",
        gender: "",
        group: "",
        profession: "",
      },
    };
  },
  setup() {
    const locationData = ref({});
    const genderData = ref({});
    const groupData = ref({});
    const professionData = ref({});

    store.commit("getLocalSettings");

    var account_url = store.state.settings.account_url;

    API.makeRequest({
      method: "get",
      url: account_url + "/wp-json/inpursuit/v1/settings",
    }).then((response) => {
      locationData.value = response.data["location"];
      genderData.value = response.data["gender"];
      groupData.value = response.data["group"];
      professionData.value = response.data["profession"];
    });
    return {
      locationData,
      genderData,
      groupData,
      professionData,
    };
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
      ev.preventDefault();

      this.setFilterData();

      this.$parent.refreshItems();

      this.isModalVisible = false;
    },
    getPostLink: ( post ) => Util.getPostLink( post )
  },
};
</script>
<style scoped>
.button {
  @apply border border-orange font-semibold p-2 px-4 rounded-lg bg-orange text-sm;
}
.title {
  @apply text-sm font-thin;
}
</style>
