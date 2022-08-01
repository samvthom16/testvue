<template>

  <PhoneUI title='Events'>
    <template v-slot:phonebody>

      <OrbitPosts :params="params" :key='params.unique_id' @totalChanged='totalChanged'>
        <template v-slot:loadingAnimation>
          <SimpleListAnimation />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
      </OrbitPosts>


    </template>
    <template v-slot:headerright>
      <router-link :to="{ name: 'NewEvent' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
    </template>

    <template v-slot:mainttitle_footer>
      <SearchField @searching='onSearch' />
    </template>

  </PhoneUI>


</template>

<script>

import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'
import SearchField from '@/components/SearchField'

import SimpleListAnimation from '@/templates/Animation/SimpleList'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader'

import {ref} from 'vue'

//import EventList from "@/components/EventList.vue";

//import defaultMixin from "@/mixins/DefaultMixin.js";
//import paginationMixin from "@/mixins/PaginationMixin.js";
//import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "Events",
  components: {
    //EventList,
    PhoneUI,
    Icon,
    SearchField,
    SimpleListAnimation,
    PaginationLoaderAnimation
  },
  setup(){
    const totalItems = ref( 0 )

    const params = ref( {
      unique_id   : 1,
      per_page    : 10,
      post_type   : 'inpursuit-events',
      style       : 'EventList',
      orderby     : 'title',
      order       : 'asc',
      pagination  : 1,
      search      : ''
    } )

    const onSearch = ( searchText ) => {
      params.value.search = searchText
      params.value.unique_id++;
    }

    const selectDropdownItem = ( data ) => {

      params.value[ data.name ] = data.value

      if( data.name == 'orderby' && data.value == 'title' ) params.value.order = 'asc'
      if( data.name == 'orderby' && data.value == 'id' ) params.value.order = 'desc'

      if( data.name == 'member_status' && data.value == 'all' ) params.value.member_status = ''

      if( data.name == 'status' && data.value == 'all' ) params.value.status = 'publish,draft'

      params.value.unique_id++;
    }

    const totalChanged = ( total ) => totalItems.value = total

    return {
      params,
      onSearch,
      selectDropdownItem,
      totalChanged,
      totalItems
    }
  },
  /*
  //mixins: [defaultMixin, paginationMixin, apiMixin],
  data() {
    return {
      search: "",
      filterData: {},
    };
  },
  /*
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
    /* INHERITED FROM PAGINATION MIXIN
    getAPI() {
      return this.requestEvents(this.page, this.search, this.filterData);
    },
    getPageTitle() {
      return "InPursuit - Events";
    },

  },
  */
};
</script>
