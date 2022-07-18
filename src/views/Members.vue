<template>

  <PhoneUI title="Members">

    <template v-slot:headerright>
      <router-link :to="{ name: 'NewMember' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
    </template>

    <template v-slot:phonebody>
      <ul class='whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto'>
        <li class='inline-block mr-2' v-for='dropdownButton,field_name in dropdownButtons' :key='dropdownButton'>
          <ButtonPopupModal :field_name='field_name' :field='dropdownButton' @selectItem='selectDropdownItem' />
        </li>
      </ul>
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
import ButtonPopupModal from '@/components/ButtonPopupModal'
import UsersList from "@/components/UsersList";

import Util from '@/lib/Util'
import store from '@/store'


import defaultMixin from "@/mixins/DefaultMixin";
import paginationMixin from "@/mixins/PaginationMixin";
import apiMixin from "@/mixins/APIMixin";

import { ref } from 'vue'

export default {
  name: "Members",
  components: {
    UsersList,
    PhoneUI,
    Icon,
    SearchField,
    ButtonPopupModal
  },
  mixins: [defaultMixin, paginationMixin, apiMixin],
  data() {
    return {
      search: "",
      filterData: {
        status: 'publish',
      },
      searchFocus: false,
    };
  },
  setup(){

    store.commit( 'getLocalSettings' )

    const dropdownButtons = ref( {
      status : {
        popupTitle: 'View Members',
        badgeText : '',
        items: {
          all     : 'All Members',
          publish : 'Active Members',
          draft   : 'Archived Members'
        },
        selected: 'publish'
      },
      orderby:{
        popupTitle: 'Sort By',
        badgeText : '',
        items: {
          title  : 'Alphabetical',
          id     : 'Newest Members',
        },
        selected: 'title'
      },
      member_status : {
        popupTitle: 'Profile Type',
        badgeText : '',
        items: {
          all  : 'All Profile Types',
        },
        selected: 'all'
      }
    } )

    /*
    * FETCH SETTINGS FROM THE SERVER
    */
    Util.fetchSettings( ( data ) => {
      var dropdown_slugs = [ 'member_status' ]
      for( var i=0; i<dropdown_slugs.length; i++ ){
        var slug = dropdown_slugs[ i ]
        for( var id in data[ slug ] ){
          dropdownButtons.value[ slug ].items[ id ] = data[ slug ][ id ]
        }
      }
    } )

    return {
      dropdownButtons
    }

  },
  watch: {
    search() {
      var component = this;
      component.debounceEvent(function () {
        component.refreshItems();
        //console.log( component.search );
      } );
    },
    totalItems(){
      this.dropdownButtons.status.badgeText = this.totalItems
    }
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
    selectDropdownItem( data ){
      this.dropdownButtons[ data.name ].selected = data.value
      if( data.name == 'status' ) this.dropdownButtons.status.badgeText = ''
      this.filterData[ data.name ] = data.value

      if( data.name == 'orderby' && data.value == 'title' ) this.filterData.order = 'asc'
      if( data.name == 'orderby' && data.value == 'id' ) this.filterData.order = 'desc'

      if( data.name == 'member_status' && data.value == 'all' ) this.filterData.member_status = ''

      this.refreshItems()
    }
  },

};
</script>
