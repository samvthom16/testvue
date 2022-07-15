<template>

  <PhoneUI title='Events' :configUI='{ colors: "bg-orange text-white" }'>
    <template v-slot:phonebody>
      <EventList :events="items" :total="totalItems" />
    </template>
    <template v-slot:headerright>
      <router-link :to="{ name: 'NewEvent' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
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


import EventList from "@/components/EventList.vue";

import defaultMixin from "@/mixins/DefaultMixin.js";
import paginationMixin from "@/mixins/PaginationMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "Events",
  components: {
    EventList,
    PhoneUI,
    Icon,
    SearchField
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
    searching( searchText ){
      this.search = searchText;
    },
    filterTagData(e) {
      this.filterData = e;
    },
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI() {
      return this.requestEvents(this.page, this.search, this.filterData);
    },
    getPageTitle() {
      return "InPursuit - Events";
    },

  },
};
</script>
