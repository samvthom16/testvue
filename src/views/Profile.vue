<template>
  <PhoneUI
    title='Profile'
    :configUI="{ maintitle_classes   : 'hidden', stickytitle_classes : 'opacity-100'}"
  >
    <template v-slot:headerright>
      <router-link :to="{ name: 'Logout' }" class='text-xs text-white'>
        Logout
      </router-link>
    </template>
    <template v-slot:phonebody>

      <div class="flex items-center justify-between bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm mb-10">
        <div class="">
          <h1 class="text-2xl" v-if="newTeamMember.name">{{ newTeamMember.name }}</h1>
          <ul>
            <li class="inline-block" v-if="newTeamMember.email">{{ newTeamMember.email }}</li>
            <li class="inline-block px-2" v-if="newTeamMember.roles && newTeamMember.email">|</li>
            <li class="capitalize inline-block" v-if="newTeamMember.roles">{{ newTeamMember.roles.join(", ") }}</li>
          </ul>
        </div>

      </div>
      <div class="text-sm text-black font-semibold">MORE OPTIONS</div>

      <div
        class="text-base focus:outline-none sm:text-sm w-full  bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm my-2 divide-y divide-lightgray"
        :key='newTeamMember.id'
      >
        <SettingItem
          label='Your Comments'
          icon='Comment'
          icon_classes='bg-darkorange'
          :route="{ 'name' : 'SingleTeamMember', 'params': { 'id': newTeamMember.id } }"
          v-if='newTeamMember.id'
        />

        <SettingItem
          label='Team'
          icon='Members'
          icon_classes='bg-orange'
          :route="{ 'name' : 'Team' }"
        />

        <SettingItem
          label='Analytics'
          icon='Chart'
          icon_classes='bg-purple'
          :route="{ 'name' : 'Analytics' }"
        />

      </div>


    </template>
  </PhoneUI>

</template>

<script>
import PhoneUI from '@/components/PhoneUI'



import API from '@/api'

import { useQuery } from "vue-query"

import SettingItem from '@/components/SettingItem'


import { ref, computed } from 'vue'



export default {
  name: "Profile",
  components: {
    PhoneUI,

    SettingItem
  },

  setup(){

    const getProfile = () => API.requestProfile()
    const { data } = useQuery( "profileQuery", getProfile )

    const newTeamMember = computed( () => data.value ? data.value.data : ref( { id: 0 } ) )

    return {
      newTeamMember
    }

  },

};
</script>
