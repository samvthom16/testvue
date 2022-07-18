<template>

  <PhoneUI title="Members">

    <template v-slot:headerright>
      <router-link :to="{ name: 'NewMember' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
    </template>

    <template v-slot:phonebody>
      <!--ul class='whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto'>
        <li class='inline-block mr-2' v-for='dropdownButton,field_name in dropdownButtons' :key='dropdownButton'>
          <ButtonPopupModal :field_name='field_name' :field='dropdownButton' @selectItem='selectDropdownItem' />
        </li>
      </ul-->
      <MembersDropdown :totalItems='totalItems' @selectItem='selectDropdownItem' />
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
//import ButtonPopupModal from '@/components/ButtonPopupModal'
import UsersList from "@/components/UsersList";
import MembersDropdown from '@/components/MembersDropdown'



import defaultMixin from "@/mixins/DefaultMixin";
import paginationMixin from "@/mixins/PaginationMixin";
import apiMixin from "@/mixins/APIMixin";



export default {
  name: "Members",
  components: {
    UsersList,
    PhoneUI,
    Icon,
    SearchField,
    //ButtonPopupModal,
    MembersDropdown
  },
  mixins: [defaultMixin, paginationMixin, apiMixin],
  data() {
    return {
      search: "",
      filterData: {
        status: 'publish',
      },
    };
  },
  setup(){

  },
  watch: {
    search() {
      var component = this;
      component.debounceEvent(function () {
        component.refreshItems();
      } );
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
    selectDropdownItem( data ){

      this.filterData[ data.name ] = data.value

      if( data.name == 'orderby' && data.value == 'title' ) this.filterData.order = 'asc'
      if( data.name == 'orderby' && data.value == 'id' ) this.filterData.order = 'desc'

      if( data.name == 'member_status' && data.value == 'all' ) this.filterData.member_status = ''

      this.refreshItems()
    }
  },

};
</script>
