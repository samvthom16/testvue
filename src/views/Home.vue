<template>
  <PhoneUI title="Home" :configUI="{ maintitle_classes : 'hidden', stickytitle_classes : 'opacity-100' }">
    <template v-slot:phonebody>

      <OrbitPosts :params="{ per_page: 10, post_type: 'inpursuit-members', style: 'PostImagesSlider' }">
        <template v-slot:title>
          <h4 class='font-semibold text-lg mb-2'>Latest Members</h4>
        </template>
        <template v-slot:loadingAnimation>
          <MemberAvatarsAnimation />
        </template>
      </OrbitPosts>

      <div class='mb-8'></div>

      <OrbitPosts :params="{ per_page: 8, post_type: 'inpursuit-events', style: 'PostList' }">
        <template v-slot:title>
          <h4 class='font-semibold text-lg mb-2'>Latest Events</h4>
        </template>
        <template v-slot:loadingAnimation>
          <SimpleListAnimation />
        </template>
      </OrbitPosts>

      <div class='mb-8'></div>



    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from '@/components/PhoneUI'

import API from '@/api'
import Util from '@/lib/Util'
import OrbitPosts from '@/lib/OrbitPosts'
import store from '@/store'
import router from '@/router'

import MemberAvatarsAnimation from '@/templates/Animation/MemberAvatars'
import SimpleListAnimation from '@/templates/Animation/SimpleList'

import {ref} from 'vue'

export default {
  name: "Home",
  components: {
    PhoneUI,
    OrbitPosts,
    MemberAvatarsAnimation,
    SimpleListAnimation
  },
  setup(){

    const members = ref( null )

    const updates = ref( null )

    //store.commit( 'getLocalSettings' )

    if ( !store.state.settings || !store.state.settings.account_url ) router.push( "/login" )

    const fetchLatestMembers = () => {
      API.requestPosts( 'inpursuit-members', {
        'per_page'  : 10,
        'orderby' : 'id',
        'order'   : 'desc'
      } ).then(
      ( response ) => {
        store.commit( 'setProcessing', false )
        members.value = response.data
      } )
    }

    const fetchLatestUpdates = () => {
      API.requestHistory( {
        'per_page'  : 10,
      } ).then(
      ( response ) => {
        store.commit( 'setProcessing', false )
        updates.value = response.data
      } )
    }

    const init = () => {

      // ENABLE THE LOADER
      store.commit( 'setProcessing', true )

      fetchLatestMembers()
      fetchLatestUpdates()
    }


    init()

    return {
      members,
      updates
    }

  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    getLastUpdatedText: ( datestring ) => Util.timeAgo( datestring )
  },

};
</script>
