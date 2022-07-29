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
          <button class='bg-orange p-2 px-8 my-4 rounded text-white text-center mx-auto block'>
            Loading
            <Icon
              type='CircularLoader'
              class='inline h-4 w-4'
            />
          </button>
        </template>
      </OrbitComments>
    </template>



  </PhoneUI>




</template>

<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'

import ListWithImageAnimation from '@/templates/Animation/ListWithImage'

import OrbitComments from '@/lib/OrbitComments'

export default {
  components: {
    PhoneUI,
    Icon,
    ListWithImageAnimation,
    OrbitComments
  },
  setup(){

  },
  methods: {

  },
};
</script>
