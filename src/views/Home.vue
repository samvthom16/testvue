<template>
  <PhoneUI title="Home" :configUI="{ maintitle_classes : 'hidden', stickytitle_classes : 'opacity-100' }">
    <template v-slot:phonebody>

      <OrbitPosts :params="{ per_page: 10, post_type: 'inpursuit-members', style: 'PostImagesSlider' }">
        <template v-slot:title>
          <h4 class='font-semibold text-xl mb-4'>
            <Icon type='Members' class='inline h-6 w-6' />
            Latest Members
          </h4>
        </template>
        <template v-slot:loadingAnimation>
          <MemberAvatarsAnimation />
        </template>
      </OrbitPosts>

      <div class='mb-8'></div>

      <div class='flow-root'>
        <h4 class='font-semibold text-xl mb-2'>
          <Icon type='Comment' class='inline h-6 w-6' />
          Latest Comments
        </h4>
        <ul role="list" class="divide-y divide-lightgray">
          <li class="py-3 sm:py-4" v-for='comment in comments' :key='comment'>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-1">
                <div
                  class="bg-lightgray w-16 h-16 rounded-full overflow-hidden inline-block"
                >
                  <img
                    class="w-full h-full object-cover rounded-full"
                    :src="comment.member.featured_image"
                    :alt="comment.member.title"
                  />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-semibold truncate dark:text-white">
                  {{ comment.member.title }}
                </h1>
                <p class='text-sm text-gray'>{{ formatDate(comment.post_date) }} by {{ comment.user.name }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class='mb-8'></div>

      <OrbitPosts :params="{ per_page: 8, post_type: 'inpursuit-events', style: 'PostList' }">
        <template v-slot:title>
          <h4 class='font-semibold text-xl mb-2'>
            <Icon type='Event' class='inline h-6 w-6' />
            Latest Events
          </h4>
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

import Icon from '@/components/Icon'

import MemberAvatarsAnimation from '@/templates/Animation/MemberAvatars'
import SimpleListAnimation from '@/templates/Animation/SimpleList'

import {ref} from 'vue'

export default {
  name: "Home",
  components: {
    PhoneUI,
    OrbitPosts,
    MemberAvatarsAnimation,
    SimpleListAnimation,
    Icon
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
