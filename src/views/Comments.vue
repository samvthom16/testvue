<template>

  <PhoneUI title="Comments">

    <template v-slot:phonebody>
      <OrbitComments :params="params" :key='params.unique_id'>
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total='10' />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
      </OrbitComments>
    </template>

    <template v-slot:mainttitle_footer>
      <SearchField @searching='onSearch' />
    </template>


  </PhoneUI>


</template>

<script>
import PhoneUI from '@/components/PhoneUI.vue'
import SearchField from '@/components/SearchField.vue'

import ListWithImageAnimation from '@/templates/Animation/ListWithImage.vue'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader.vue'

import OrbitComments from '@/lib/OrbitComments.vue'

import {ref} from 'vue'

export default {
  components: {
    PhoneUI,
    SearchField,
    ListWithImageAnimation,
    OrbitComments,
    PaginationLoaderAnimation
  },
  setup(){

    const params = ref( {
      unique_id   : 1,
      per_page    : 10,
      style       : 'UsersListWithComment',
      pagination  : 1,
      search      : ''
    } )

    const onSearch = ( searchText ) => {
      params.value.search = searchText
      params.value.unique_id++;
    }

    return {
      params,
      onSearch
    }


  }
};
</script>
