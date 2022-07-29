<template>
  <PhoneUI title="Home" :configUI="{ maintitle_classes : 'hidden', stickytitle_classes : 'opacity-100' }">
    <template v-slot:phonebody>

      <OrbitPosts :params="{ per_page: 10, post_type: 'inpursuit-members', style: 'PostImagesSlider' }">
        <template v-slot:title>
          <MainTitle title='Latest Members' icon='Members' />
        </template>
        <template v-slot:loadingAnimation>
          <MemberAvatarsAnimation />
        </template>
      </OrbitPosts>

      <div class='mb-10'></div>

      <OrbitComments :params="{ per_page: 5, style: 'UsersList' }">
        <template v-slot:title>
          <MainTitle title='Latest Comments' icon='Comment' />
        </template>
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation />
        </template>
      </OrbitComments>

      <div class='mb-10'></div>

      <OrbitPosts :params="{ per_page: 8, post_type: 'inpursuit-events', style: 'PostList' }">
        <template v-slot:title>
          <MainTitle title='Latest Events' icon='Event' />
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

import MainTitle from '@/templates/Misc/MainTitle'

import Util from '@/lib/Util'
import OrbitPosts from '@/lib/OrbitPosts'
import OrbitComments from '@/lib/OrbitComments'

import API from '@/api'
import store from '@/store'
import router from '@/router'


import ListWithImageAnimation from '@/templates/Animation/ListWithImage'
import MemberAvatarsAnimation from '@/templates/Animation/MemberAvatars'
import SimpleListAnimation from '@/templates/Animation/SimpleList'

import {ref} from 'vue'

export default {
  name: "Home",
  components: {
    PhoneUI,
    OrbitPosts,
    OrbitComments,
    MemberAvatarsAnimation,
    SimpleListAnimation,
    ListWithImageAnimation,
    MainTitle
  },
  setup(){

    //const members = ref( null )

    //const updates = ref( null )

    const comments = ref( null )

    //store.commit( 'getLocalSettings' )

    if ( !store.state.settings || !store.state.settings.account_url ) router.push( "/login" )

    const fetchComments = () => {
      API.requestComments( {
        'per_page'  : 5,
      } ).then(
      ( response ) => {

        store.commit( 'setProcessing', false )
        comments.value = response.data

      } )
    }

    /*
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
    */

    const init = () => {

      // ENABLE THE LOADER
      store.commit( 'setProcessing', true )

      fetchComments()

      //fetchLatestMembers()
      //fetchLatestUpdates()
    }


    init()

    return {
      comments
      //members,
      //updates
    }

  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    formatDate: ( datestring ) => Util.timeAgo( datestring )
  },

};
</script>
