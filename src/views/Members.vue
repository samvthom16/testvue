<template>

  <PhoneUI title="Members">

    <template v-slot:headerright>
      <router-link :to="{ name: 'NewMember' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
    </template>

    <template v-slot:phonebody>

      <MembersDropdown :totalItems='totalItems' @selectItem='selectDropdownItem' />

      <OrbitPosts :params="params" :key='params.unique_id' @totalChanged='totalChanged'>
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total='10' />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
      </OrbitPosts>



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
import MembersDropdown from '@/components/MembersDropdown'

import ListWithImageAnimation from '@/templates/Animation/ListWithImage'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader'

import {ref} from 'vue'

export default {
  name: "Members",
  components: {
    PhoneUI,
    Icon,
    SearchField,
    MembersDropdown,
    ListWithImageAnimation,
    PaginationLoaderAnimation
  },

  setup(){

    const totalItems = ref( 0 )

    const params = ref( {
      unique_id   : 1,
      per_page    : 10,
      post_type   : 'inpursuit-members',
      style       : 'ListWithImage',
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
};
</script>
