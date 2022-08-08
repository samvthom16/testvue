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
      <div class="text-center p-2 pt-10 hidden">
        <div v-if="$store.state.processing" class="max-w-sm mx-auto">
          <ItemAnimation />
        </div>
        <div v-if="!$store.state.processing">
          <h1 class="text-2xl" v-if="profile.name">{{ profile.name }}</h1>
        </div>
      </div>

      <div class="flex items-center justify-between bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm mb-10">
        <div class="">
          <h1 class="text-2xl" v-if="profile.name">{{ profile.name }}</h1>
          <ul>
            <li class="inline-block" v-if="profile.email">{{ profile.email }}</li>
            <li class="inline-block px-2" v-if="profile.roles && profile.email">|</li>
            <li class="capitalize inline-block" v-if="profile.roles">{{ profile.roles.join(", ") }}</li>
          </ul>
        </div>
        <!--div>
          <span class="inset-y-0 right-0 flex items-center pr-4">
            <Icon type='Right-Arrow' class='h-6 w-6' />
          </span>
        </div-->
      </div>
      <div class="text-sm text-black font-semibold" v-if='settings.length'>SETTINGS</div>
      <ul class="text-base focus:outline-none sm:text-sm w-full  bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm my-2 divide-y divide-lightgray" v-if='settings.length'>
        <li class="text-gray-900 cursor-default py-4" v-for='setting in settings' :key='setting'>
          <div class="flex items-center justify-between  ">
            <div class="flex items-center">
              <Icon
                :type='setting.icon'
                class='h-7 w-7 p-1 rounded-md text-white'
                :class='setting.icon_classes'
              />
              <router-link
                :to='setting.route'
                class="ml-3 block font-normal truncate text-lg"
                v-html='setting.name'
              />
            </div>
            <router-link
              :to='setting.route'
              class="inset-y-0 right-0 flex items-center pr-2"
            >
              <Icon type='Right-Arrow' class='h-6 w-6' />
            </router-link>
          </div>
        </li>
      </ul>


    </template>
  </PhoneUI>

</template>

<script>
import PhoneUI from '@/components/PhoneUI'

import Icon from '@/components/Icon'


import defaultMixin from "@/mixins/DefaultMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

import ItemAnimation from "@/components/ItemAnimation";

import {ref} from 'vue'

export default {
  name: "Profile",
  components: {
    PhoneUI,
    ItemAnimation,
    Icon
  },
  mixins: [defaultMixin, apiMixin],
  data() {
    return {
      profile: {},
    };
  },
  setup(){

    const settings = ref( [
      /*
      {
        name          : 'Group',
        icon          : 'Members',
        icon_classes  : 'bg-red',
        route         : { name: 'Team' }
      },
      {
        name: 'Locations',
        icon: 'Location',
        icon_classes  : 'bg-lightred',
        route         : { name: 'Team' }
      },
      {
        name: 'Profile Types',
        icon: 'Single-User',
        icon_classes  : 'bg-blue-100',
        route         : { name: 'Team' }
      },
      {
        name          : 'Profession',
        icon          : 'Profession',
        icon_classes  : 'bg-lightblue',
        route         : { name: 'Team' }
      },
      {
        name          : 'Event Types',
        icon          : 'Event',
        icon_classes  : 'bg-darkorange',
        route         : { name: 'Team' }
      },
      {
        name          : 'Team',
        icon          : 'Team',
        icon_classes  : 'bg-orange',
        route         : { name: 'Team' }
      },
      */
    ] )

    

    return {
      settings
    }


  },
  methods: {
    /*
     * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
     * TRIGGERED FROM THE DEFAULT MIXIN
     */
    ready() {
      this.getPost();
    },
    getPost() {
      var component = this;

      // SET PROCESSING
      component.$store.commit("setProcessing", true);

      component.requestProfile().then(
        (response) => {
          component.profile = response.data;

          // RESET PROCESSING
          component.$store.commit("setProcessing", false);
        },
        (error) => {
          this.$store.commit("notifyError", error);
        }
      );
    },
  },
};
</script>
