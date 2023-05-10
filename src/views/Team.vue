<template>
  <PhoneUI
    title='Team'
    :configUI="{ 'hide_footer' : true, 'maintitle_classes' : 'hidden', 'stickytitle_classes' : 'opacity-100'}"
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute='{ name: "Profile" }' />
    </template>
    <template v-slot:headerright>

    </template>
    <template v-slot:phonebody>
      <ul role="list" class="divide-y divide-lightgray">
        <li class="py-3 sm:py-4" v-for="user in users" :key="user.id">
          <router-link class='font-bold text-xl' :to="getUserEditLink( user )">
            {{ user.name }}
          </router-link>

          <p class='text-black'>{{ user.email }}</p>

          <ul class='text-xs text-gray'>
            <li class='inline-block' v-html='joinedText( user.registered_date )'></li>
            <li class='inline-block mx-2 mb-0.5 w-1 h-1 bg-gray rounded-full' v-if='user.roles && user.roles.length'></li>
            <li class='inline-block capitalize' v-if='user.roles && user.roles.length' v-html='user.roles[0]'></li>
          </ul>
        </li>
      </ul>
    </template>
  </PhoneUI>

</template>

<script>
import PhoneUI from '@/components/PhoneUI'
import BackButton from '@/templates/PhoneUI/BackButton'

import API from '@/api'

import Util from '@/lib/Util'

import {ref} from 'vue'

export default {
  components: {
    PhoneUI,
    BackButton
  },

  setup(){

    const users = ref( [] )

    API.requestUsers().then( ( response ) => users.value = response.data )

    const joinedText = ( datestring ) => 'Joined ' + Util.timeAgo( datestring )

    const getUserEditLink = ( user ) => Util.getUserLink( user )

    return {
      users,
      joinedText,
      getUserEditLink
    }

  },
};
</script>
