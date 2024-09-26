<template>

  <PhoneUI
    :configUI="{ 'hide_footer' : true, 'maintitle_classes' : 'hidden', 'stickytitle_classes' : 'opacity-100'}"
    :title='getHeaderTitle()'
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute='{ name: "Team" }' />
    </template>
    <template v-slot:headerright>
      <!--router-link :to="getEditLink()" v-if='$store.state.post.id'>
        <Icon type='Edit' class='inline' />
      </router-link-->
    </template>
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
  </PhoneUI>




</template>

<script>
import BackButton from '@/templates/PhoneUI/BackButton.vue'
import PhoneUI from '@/components/PhoneUI.vue'

import OrbitComments from '@/lib/OrbitComments.vue'
import ListWithImageAnimation from '@/templates/Animation/ListWithImage.vue'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader.vue'


import API from '@/api'

import store from '@/store'

import { ref, watch } from 'vue'
import { useQuery } from "vue-query"
import { useRoute } from 'vue-router'

export default {
  name: "SingleTeamMember",
  components: {
    PhoneUI,
    BackButton,
    //Icon,
    OrbitComments,
    ListWithImageAnimation,
    PaginationLoaderAnimation
  },
  setup(){

    const route = useRoute()
    //var team_member_id = route.params.id;

    // SAVE THE POST IN CLIENT STATE
    const setTeamMember = ( teamMember ) => {
      const newTeamMember = ref( teamMember )
      store.commit( 'setTeamMember', newTeamMember );
    }

    // GET POST FROM SERVER AND SET TO CLIENT STATE
    const setTeamMemberFromServer = () => {
      const getTeamMember = () => API.requestUsers( { id: route.params.id } )
      const { data } = useQuery( "teamMemberQuery" + route.params.id, getTeamMember )
      watch( data, ( data ) => setTeamMember( data.data ) )
    }


    if( route.params && route.params.teamMember ){
      /* PRELOADED CONTENT FROM ROUTER */
      setTeamMember( JSON.parse( route.params.teamMember) )
    }
    else{
      setTeamMemberFromServer()
    }

    const getHeaderTitle = () => {

      var teamMember = store.state.teamMember;
      if( teamMember && teamMember.name ) {
        return teamMember.name;
      }

      return 'Team Member';
    }

    const params = ref( {
      unique_id   : 1,
      per_page    : 10,
      style       : 'UsersListWithComment',
      pagination  : 1,
      user_id     : route.params.id
    } )

    return{
      getHeaderTitle,
      params
    }
  },
};
</script>
<style>
  .hide-svg svg{
    @apply hidden;
  }
</style>
