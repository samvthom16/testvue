<template>
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
    <router-link
      class="
        text-sm
        mt-10
        bg-purple
        inline-block
        px-4
        text-white
        mb-5
        border-purple
        py-2
        border
        rounded
      "
      to="/logout"
    >
      Logout
    </router-link>
  </div>
</template>

<script>
import defaultMixin from "@/mixins/DefaultMixin.js";
import apiMixin from "@/mixins/APIMixin.js";

import ItemAnimation from "@/components/ItemAnimation.vue";

export default {
  name: "Profile",
  components: {
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
