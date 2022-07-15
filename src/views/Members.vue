<template>

  <PhoneUI title="Members">

    <template v-slot:headerright>
      <router-link :to="{ name: 'NewEvent' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
    </template>

    <template v-slot:phonebody>
      <UsersList
        v-on:applyFilterTags="filterTagData($event)"
        :users="items"
        :total="totalItems"
      />
    </template>

    <template v-slot:mainttitle_footer>
      <SearchField @searching='searching' />
    </template>

  </PhoneUI>




</template>

<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'

import SearchField from '@/components/SearchField'


import UsersList from "@/components/UsersList.vue";

import defaultMixin from "@/mixins/DefaultMixin.js";
import paginationMixin from "@/mixins/PaginationMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "Members",
  components: {
    UsersList,
    PhoneUI,
    Icon,
    SearchField
  },
  mixins: [defaultMixin, paginationMixin, apiMixin],
  data() {
    return {
      search: "",
      filterData: {},
      searchFocus: false,
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
    searching( searchText ){
      this.search = searchText;
    },
    filterTagData(e) {
      this.filterData = e;
    },
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI() {
      return this.requestUsers(this.page, this.search, this.filterData);
    },
    getPageTitle() {
      return "InPursuit - Members";
    },
  },

};
</script>
