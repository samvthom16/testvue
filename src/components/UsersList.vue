<template>

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
              <h1 class="text-2xl font-semibold truncate dark:text-white">
                <router-link :to="getPostLink( user )">
                  {{ user.title.rendered }}
                </router-link>
              </h1>
              <p class='text-sm text-gray'>Last seen {{ formatDate(user.last_seen) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

</template>

<script>
import userMixin from "@/mixins/UserMixin.js";

//import store from "@/store";

//import API from "../api.js";

//import { ref } from "vue";

import Util from '@/lib/Util'

export default {
  name: "UsersList",
  components: {

  },
  mixins: [userMixin],
  props: {
    users: Array,
    total: Number,
  },
  data() {
    return {
      /*
      isModalVisible: false,
      filterdata: {},
      selectedFiltersData: {
        location: "",
        gender: "",
        group: "",
        profession: "",
      },
      */
    };
  },
  setup() {

    /*

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
    */
  },

  methods: {
    /*
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
    */
    getPostLink: ( post ) => Util.getPostLink( post ),
    formatDate: ( dateParam ) => Util.timeAgo( dateParam )
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
