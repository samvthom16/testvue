<template>
  <PhoneUI title="Home" :configUI="{ colors: 'bg-lightgray text-black' }">
    <template v-slot:phonebody>
      <h4 class='font-semibold text-lg mb-2'>Members</h4>
      <ul class='pb-4 mb-4 whitespace-nowrap overflow-auto'>
        <li class='inline-block mr-2' v-for='member in members' :key='member'>
          <router-link :to='getPostLink( member )'>
            <img class='h-12 w-12 rounded-full border border-gray' :src='member.featured_image' />
          </router-link>
        </li>
      </ul>
      <h4 class='font-semibold text-lg'>Recent Updates</h4>
      <ul class='divide-y divide-lightgray -mt-2'>
        <li v-for='update in updates' :key='update' class='py-3'>
          <h4 class='text-md' v-html='update.title.rendered'></h4>
          <p class='text-gray text-xs'>Last updated on {{ update.date }}</p>
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

    API.requestPosts( 'inpursuit-members', {
      'per_page'  : 10,
      'orderby' : 'title',
      'order'   : 'asc'
    } ).then( ( response ) => members.value = response.data )

    API.requestHistory( {
      'per_page'  : 10,
    } ).then( ( response ) => updates.value = response.data )


    return {
      members,
      updates
    }


  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post )


  },

};
</script>
