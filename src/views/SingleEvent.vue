<template>

  <PhoneUI :configUI='configUI' :title='getHeaderTitle()'>
    <template v-slot:headericon>
      <router-link :to="{ name: 'Events' }">
        <Icon type='Back' />
      </router-link>
    </template>
    <template v-slot:headerright>
      <router-link :to="getEditLink()" v-if='post.id'>
        <Icon type='Edit' class='inline' />
      </router-link>
    </template>
    <template v-slot:phonebody>
      <div class="bg-lightergray pb-6 justify-center items-center mx-auto relative borde -my-12 pt-20 rounded-sm">
        <div class='absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full'>
          <CircularProgressBar
            :key='post.attendants_percentage'
            :contentProgress="post.attendants_percentage"
            :size="120"
            :border-width="8"
            :border-bg-width="9"
            class="
              shadow
              h-28
              w-28
              mx-auto
              border-white
              rounded-full
              overflow-hidden
              border-8"
          ></CircularProgressBar>
        </div>

        <div class="mt-8 px-2">
          <h1 class="text-2xl text-center font-semibold" v-if="post.title">
            {{ post.title.rendered }}
          </h1>
          <div class="text-center mt-3">
            <EventTags :event="post" />
          </div>
        </div>
      </div>


      <div class="event-details w-full py-20">

        <SearchField @searching='onSearch' />

        <div class='mb-6'></div>

        <MembersDropdown :totalItems='totalItems' @selectItem='selectDropdownItem' />

        <OrbitPosts
          :params="params"
          :key='params.unique_id'
          @totalChanged='totalChanged'
          @onAttendanceChange='onAttendanceChange'
        >
          <template v-slot:loadingAnimation>
            <ListWithImageAnimation :total='10' />
          </template>
          <template v-slot:nextPageAnimation>
            <PaginationLoaderAnimation />
          </template>
          <template v-slot:whenempty>
            <div class='text-xs text-red border border-red p-2 mt-4'>No members found for this query</div>
          </template>
        </OrbitPosts>



      </div>



    </template>
  </PhoneUI>




</template>

<script>
import Util from '@/lib/Util'

import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'
import SearchField from '@/components/SearchField'
import MembersDropdown from '@/components/MembersDropdown'

import userMixin from "@/mixins/UserMixin";
import defaultMixin from "@/mixins/DefaultMixin";
import paginationMixin from "@/mixins/PaginationMixin";
import apiMixin from "@/mixins/APIMixin";

import EventTags from "@/components/EventTags";
//import UserTags from "@/components/UserTags";
//import Switch from "@/components/switch";
// import ProgressBarItem from "@/components/ProgressBarItem.vue";
import CircularProgressBar from "@/components/CircularProgressBar";

import ListWithImageAnimation from '@/templates/Animation/ListWithImage'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader'

//import PostFeaturedImage from '@/templates/Post/FeaturedImage'
//import PostTitle from '@/templates/Post/Title'

import MembersHelper from '@/lib/MembersHelper'

import { useRoute } from 'vue-router'

export default {
  name: "SingleEvent",
  components: {
    PhoneUI,
    Icon,
    SearchField,
    EventTags,
    //UserTags,
    //Switch,
    MembersDropdown,
    CircularProgressBar,
    //PostFeaturedImage,
    //PostTitle,
    ListWithImageAnimation,
    PaginationLoaderAnimation
  },
  mixins: [defaultMixin, paginationMixin, apiMixin, userMixin],
  data() {
    return {
      id      : 0,
      post    : {},
      search  : '',
      configUI: {
        maintitle_classes : "py-16 hide-svg",
        hide_maintitle    : true,
        hide_footer       : true
      },
      filterData: {
        status: 'publish',
      },
    };
  },
  watch: {
    search() {
      var component = this;
      component.debounceEvent(function () {
        component.refreshItems();
        //console.log( component.search );
      });
    },
  },
  mounted() {
    var post_id = this.$route.params.id;

    if (post_id) {
      this.id = parseInt(post_id);
    }
    // CHECK IF POST INFORMATION HAS BEEN PASSED IN THE ROUTE
    if (this.$route.params.post != undefined) {
      this.post = JSON.parse(this.$route.params.post);
    } else {
      this.getPost();
    }
  },
  methods: {

    getHeaderTitle(){
      var component = this;
      if( component.post && component.post.title && component.post.title.rendered ) {
        return component.post.title.rendered;
      }
      return 'Event';
    },

    /* INHERITED FROM PAGINATION MIXIN */

    getAPI() {
      var post_id = this.$route.params.id;

      var params = Object.assign( this.filterData, {
        event_id: post_id,
      } )

      return this.requestUsers(this.page, this.search, params );
    },

    /*
     * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
     * TRIGGERED FROM THE DEFAULT MIXIN
     */
    getPost() {
      var component = this;

      // SET PROCESSING
      component.$store.commit("setProcessing", true);

      component.requestEvent(component.id).then(
        (response) => {
          component.post = response.data;
          // RESET PROCESSING
          component.$store.commit("setProcessing", false);
        },
        (error) => {
          component.$store.commit("notifyError", error);
        }
      );
    },

    getPageTitle() {
      var title = "InPursuit - Single Event";
      return title;
    },

    getEditLink(){
      return Util.getPostEditLink( this.post )
    },

    searching( searchText ){
      this.search = searchText;
    },



    selectDropdownItem( data ){

      this.filterData[ data.name ] = data.value

      if( data.name == 'orderby' && data.value == 'title' ) this.filterData.order = 'asc'
      if( data.name == 'orderby' && data.value == 'id' ) this.filterData.order = 'desc'

      if( data.name == 'member_status' && data.value == 'all' ) this.filterData.member_status = ''

      this.refreshItems()
    },

    // UPDATE IN ATTENDANCE DATABASE
    onAttendanceChange( data ) {

      var post_id = this.$route.params.id;

      var isAttended = data.flag;

      var user = data.user;

      this.updateAttendance(user.id, post_id, isAttended).then(
        () => this.getPost(),
        (error) => {
          console.log("" + error);
        }
      );


    },

  },
  setup(){
    const route = useRoute()
    var post_id = route.params.id;
    return MembersHelper( 'MemberListWithSwitch', post_id )
  }
};
</script>
<style>
  .event-details #search{
    @apply border border-gray;
  }
</style>
