<template>



  <PhoneUI :configUI='{ maintitle_classes : "py-16", hide_maintitle : true, colors: "bg-lightgray text-black" }' :title='getHeaderTitle()'>
    <template v-slot:headericon>
      <router-link :to="{ name: 'Members' }">
        <Icon type='Back' />
      </router-link>
    </template>
    <template v-slot:phonebody>

      <AddComment
        :id='id'
        :item='post'
        :showModal='showCommentModal'
        v-if='id'
        @close='closeCommentModal()'
        @postComment='forceHistoryRerender()'
      />

      <div class="pb-6 justify-center items-center mx-auto">

        <div class='pt-20 pb-4 relative bg-white rounded-sm -my-12'>
          <div
            class="bg-gray
              absolute -top-10 left-1/2
              transform -translate-x-1/2
              h-28 w-28
              overflow-hidden
              border-white border-4
              rounded-full
            "
          >
            <img class="object-cover w-full h-full" :src="post.featured_image" />
          </div>

          <div class=" px-2">
            <h1 class="text-xl text-center font-semibold" v-if="post.title">
              {{ post.title.rendered }}
            </h1>
            <div class="text-center mt-3">
              <UserTags :user="post" />
              <ul class='mt-4'>
                <li class='inline-block p-2'>
                  <Icon @click='showCommentModal = true' type='Comment' class='cursor-pointer block bg-lightergray text-black p-3 h-12 w-12 rounded-full' />
                  <p class='text-xs mt-2 text-black text-center block'>Add Comment</p>
                </li>
                <li class='inline-block p-2'>
                  <Icon @click='openScheduleLink()' type='Clock' class='cursor-pointer block bg-lightergray text-black p-3 h-12 w-12 rounded-full' />
                  <p class='text-xs mt-2 text-black text-center block'>Reminder</p>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div class="relative py-20" v-if="id">
          <HistoryList :id="id" :item="post" :key='historyKey' />
        </div>
      </div>
    </template>
  </PhoneUI>




</template>

<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'


import AddComment from '@/components/AddComment'
import UserTags from "../components/UserTags.vue";
import HistoryList from "@/components/HistoryList.vue";

import defaultMixin from "@/mixins/DefaultMixin.js";
import userMixin from "@/mixins/UserMixin.js";
import apiMixin from "@/mixins/APIMixin.js";



export default {
  name: "SingleMember",
  components: {
    PhoneUI,
    Icon,
    AddComment,
    UserTags,
    HistoryList,
  },
  mixins: [defaultMixin, userMixin, apiMixin],
  data() {
    return {
      id      : 0,
      post    : {},
      showCommentModal: false,
      historyKey      : 0
    };
  },


  methods: {

    forceHistoryRerender(){
      this.historyKey += 1
    },

    closeCommentModal(){
      this.showCommentModal = false;
    },

    openScheduleLink(){
      var link = 'http://www.google.com/calendar/render?action=TEMPLATE&trp=false&text=';
      var post = this.post;
      if( post.title && post.title.rendered ){
        link += 'Follow up with ' + post.title.rendered;
      }
      window.open( link, '_blank' )
      //return link;

    },

    getHeaderTitle(){
      var component = this;
      if( component.post && component.post.title && component.post.title.rendered ) {
        return component.post.title.rendered;
      }
      return 'Member';
    },

    /*
     * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
     * TRIGGERED FROM THE DEFAULT MIXIN
     */
    ready() {
      var post_id = this.$route.params.id;
      if (post_id) {
        this.id = parseInt(post_id);
      }
      //console.log( this.id );

      // CHECK IF POST INFORMATION HAS BEEN PASSED IN THE ROUTE
      if (this.$route.params.post != undefined) {
        this.post = JSON.parse(this.$route.params.post);
      } else {
        this.getPost();
      }
    },
    getPost() {
      var component = this;

      // SET PROCESSING
      component.$store.commit("setProcessing", true);

      component.requestUser(component.id).then(
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
      var title = "InPursuit - Single Member";
      return title;
    },
  },

};
</script>
