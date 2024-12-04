<template>
  <PhoneUI
    title="Home"
    :configUI="{
      maintitle_classes: 'hidden',
      stickytitle_classes: 'opacity-100',
    }"
  >
    <template v-slot:phonebody>
      <OrbitPosts
        :params="{
          per_page: 10,
          post_type: 'inpursuit-members',
          style: 'PostImagesSlider',
        }"
      >
        <template v-slot:title>
          <MainTitle
            title="Members"
            icon="Members"
            :route="{ name: 'Members' }"
          />
        </template>
        <template v-slot:loadingAnimation>
          <MemberAvatarsAnimation />
        </template>
      </OrbitPosts>

      <div class="-ml-4 -mr-4 p-4 pt-6 bg-lightergray mb-6">
        <OrbitComments :params="{ per_page: 5, style: 'UsersList' }">
          <template v-slot:title>
            <MainTitle
              title="Comments"
              icon="Comment"
              :route="{ name: 'Comments' }"
            />
          </template>
          <template v-slot:loadingAnimation>
            <ListWithImageAnimation />
          </template>
        </OrbitComments>
      </div>

      <OrbitPosts
        :params="{
          per_page: 5,
          post_type: 'inpursuit-events',
          style: 'EventList',
        }"
      >
        <template v-slot:title>
          <MainTitle title="Events" icon="Event" :route="{ name: 'Events' }" />
        </template>
        <template v-slot:loadingAnimation>
          <SimpleListAnimation />
        </template>
      </OrbitPosts>

      <OrbitDates
        :params="{
          per_page: '5',
          style: 'SpecialDates',
        }"
      >
        <template v-slot:title>
          <MainTitle
            title="Special Events"
            :route="{ name: 'SpecialEvents' }"
          />
        </template>
        <template v-slot:loadingAnimation>
          <SimpleListAnimation />
        </template>
      </OrbitDates>

      <div class="mb-8"></div>
    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from "@/components/PhoneUI.vue";

import MainTitle from "@/templates/Misc/MainTitle.vue";

import Util from "@/lib/Util.js";
import OrbitPosts from "@/lib/OrbitPosts.vue";
import OrbitComments from "@/lib/OrbitComments.vue";

import API from "@/api.js";
import store from "@/store";
import router from "@/router";

import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import MemberAvatarsAnimation from "@/templates/Animation/MemberAvatars.vue";
import SimpleListAnimation from "@/templates/Animation/SimpleList.vue";

import { ref } from "vue";
import OrbitDates from "@/lib/OrbitDates.vue";

export default {
  name: "Home",
  components: {
    PhoneUI,
    OrbitPosts,
    OrbitComments,
    MemberAvatarsAnimation,
    SimpleListAnimation,
    ListWithImageAnimation,
    MainTitle,
    OrbitDates,
  },
  setup() {
    //const members = ref( null )

    //const updates = ref( null )

    const comments = ref(null);

    //store.commit( 'getLocalSettings' )

    if (!store.state.settings || !store.state.settings.account_url)
      router.push("/login");

    const fetchComments = () => {
      API.requestComments({
        per_page: 5,
      }).then((response) => {
        store.commit("setProcessing", false);
        comments.value = response.data;
      });
    };

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
      store.commit("setProcessing", true);

      fetchComments();

      //fetchLatestMembers()
      //fetchLatestUpdates()
    };

    init();

    return {
      comments,
      //members,
      //updates
    };
  },
  methods: {
    getPostLink: (post) => Util.getPostLink(post),
    formatDate: (datestring) => Util.timeAgo(datestring),
  },
};
</script>
