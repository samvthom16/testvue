<template>

  <PhoneUI title="Comments">

    <!--template v-slot:headerright>
      <router-link :to="{ name: 'NewMember' }">
        <Icon type='Plus' class='inline text-white' />
      </router-link>
    </template-->

    <template v-slot:phonebody>
      <OrbitComments :params="{ per_page: 10, style: 'UsersListWithComment', pagination: 1 }">
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total='10' />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
      </OrbitComments>
    </template>



  </PhoneUI>




</template>

<script>
import PhoneUI from '@/components/PhoneUI'

import ListWithImageAnimation from '@/templates/Animation/ListWithImage'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader'

import OrbitComments from '@/lib/OrbitComments'

export default {
  components: {
    PhoneUI,

    ListWithImageAnimation,
    OrbitComments,
    PaginationLoaderAnimation
  },
};
</script>
