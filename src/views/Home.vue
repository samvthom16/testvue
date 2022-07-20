<template>
  <PhoneUI title="Home" :configUI="{ maintitle_classes : 'hidden', stickytitle_classes : 'opacity-100' }">
    <template v-slot:phonebody>
      <h4 class='font-semibold text-lg mb-2' v-if='members && members.length'>Members</h4>
      <ul class='border-b border-gray pb-4 mb-8 whitespace-nowrap overflow-auto' v-if='members && members.length'>
        <li class='inline-block w-16 h-16 mr-3' v-for='member in members' :key='member'>
          <router-link :to='getPostLink( member )'>
            <img class='w-full h-full object-cover rounded-full border border-gray' :src='member.featured_image' />
          </router-link>
        </li>
      </ul>
      <h4 class='font-semibold text-lg' v-if='updates && updates.length'>Recent Updates</h4>
      <ul class='divide-y divide-lightgray -mt-2'>
        <li v-for='update in updates' :key='update' class='py-3'>
          <h4 class='text-md truncate' v-html='update.title.rendered'></h4>
          <p class='text-gray text-xs' v-html='getLastUpdatedText( update.date )'></p>
        </li>
      </ul>

    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from '@/components/PhoneUI'

import API from '@/api'
import Util from '@/lib/Util'
import store from '@/store'
import router from '@/router'

import {ref} from 'vue'

export default {
  name: "Home",
  components: {
    PhoneUI
  },
  setup(){

    const members = ref( null )

    const updates = ref( null )

    store.commit( 'getLocalSettings' )

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

    getLastUpdatedText: ( datestring ) => {
      return Util.timeAgo( datestring )
    }

  },

};
</script>
