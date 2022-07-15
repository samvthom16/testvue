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
      <div class="text-center p-2 pt-10">
        <div v-if="$store.state.processing" class="max-w-sm mx-auto">
          <ItemAnimation />
        </div>
        <div v-if="!$store.state.processing">
          <h1 class="text-2xl" v-if="profile.name">{{ profile.name }}</h1>
          <ul class="text-gray">
            <li class="inline-block" v-if="profile.email">{{ profile.email }}</li>
            <li class="inline-block p-2" v-if="profile.roles && profile.email">
              |
            </li>
            <li class="capitalize inline-block" v-if="profile.roles">
              {{ profile.roles.join(", ") }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </PhoneUI>

</template>

<script>
import PhoneUI from '@/components/PhoneUI'


import defaultMixin from "@/mixins/DefaultMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

import ItemAnimation from "@/components/ItemAnimation.vue";

export default {
  name: "Profile",
  components: {
    PhoneUI,
    ItemAnimation,
  },
  mixins: [defaultMixin, apiMixin],
  data() {
    return {
      profile: {},
    };
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
