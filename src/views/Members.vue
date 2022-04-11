<template>
  <div class="members">
    <UsersList
      v-on:applyFilterTags="filterTagData($event)"
      :users="items"
      :total="totalItems"
    />
  </div>
</template>

<script>
//import API from '../api.js'
import UsersList from "@/components/UsersList.vue";

import defaultMixin from "@/mixins/DefaultMixin.js";
import paginationMixin from "@/mixins/PaginationMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "Members",
  components: {
    UsersList,
  },
  mixins: [defaultMixin, paginationMixin, apiMixin],
  data() {
    return {
      search: "",
      filterData: {},
    };
  },
  watch: {
    search() {
      var component = this;
      component.debounceEvent(function () {
        component.refreshItems();
        //console.log( component.search );
      });
    },
  },
  methods: {
    filterTagData(e) {
      this.filterData = e;
    },
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI() {
      // var filterData = {};

      // var $form = document.getElementById("filterForm");

      // console.log("form ==", $form);

      // if ($form) {
      //   filterData = Object.fromEntries(new FormData($form).entries());
      // }

      // console.log(filterData);

      return this.requestUsers(this.page, this.search, this.filterData);
    },
    getPageTitle() {
      return "InPursuit - Members";
    },
  },
};
</script>
