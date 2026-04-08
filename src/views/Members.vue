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

      <!-- FAB (mobile only) -->
      <router-link
        :to="{ name: 'NewMember' }"
        class='md:hidden fixed bottom-24 right-5 z-20 bg-purple text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-lightpurple transition-colors'
      >
        <Icon type='Plus' class='w-6 h-6' />
      </router-link>

    </template>

    <template v-slot:mainttitle_footer>
      <SearchField @searching='onSearch' />
    </template>

  </PhoneUI>

</template>

<script>
import PhoneUI from '@/components/PhoneUI.vue'
import Icon from '@/components/Icon.vue'
import SearchField from '@/components/SearchField.vue'
import MembersDropdown from '@/components/MembersDropdown.vue'

import ListWithImageAnimation from '@/templates/Animation/ListWithImage.vue'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader.vue'

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
