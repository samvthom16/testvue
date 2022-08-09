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
        <template v-slot:whenempty>
          <div class='text-xs text-red border border-red p-2 mt-4'>No members found for this query</div>
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

import MembersHelper from '@/lib/MembersHelper'

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

    return MembersHelper()

  },
};
</script>
