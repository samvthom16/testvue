<template>
  <div class="events">
    <EventList :events="items" :total="totalItems" />
  </div>
</template>

<script>
import EventList from "@/components/EventList.vue";

import defaultMixin from "@/mixins/DefaultMixin.js";
import paginationMixin from "@/mixins/PaginationMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "Events",
  components: {
    EventList,
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
      return this.requestEvents(this.page, this.search, this.filterData);
    },
    getPageTitle() {
      return "InPursuit - Events";
    },
  },
};
</script>
