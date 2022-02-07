<template>
  <div class="single-member">
    <div class="bg-white pb-6  justify-center items-center overflow-hidden mx-auto">
      <div class="relative h-40 bg-purple">
        <!--router-link to='../members' class='text-xs text-white mt-2 p-2'>&#8592;&nbsp;List Of Members</router-link-->
      </div>
      <div class="bg-gray relative shadow mx-auto h-28 w-28 -my-12 border-white rounded-full overflow-hidden border-4">
        <img class="object-cover w-full h-full" :src="post.featured_image">
      </div>
      <div class="mt-16 px-2">
        <h1 class="text-xl text-center font-semibold" v-if='post.title'>{{ post.title.rendered }}</h1>
        <div class='text-center mt-3'>
          <UserTags :user='post' />
        </div>
      </div>

      <div class="w-10/12 md:w-7/12 lg:6/12 mx-auto relative py-20" v-if='id'>
        <HistoryList :id='id' />
      </div>

    </div>
  </div>
</template>

<script>
import UserTags from '../components/UserTags.vue'
import HistoryList from '@/components/HistoryList.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'
import userMixin from '@/mixins/UserMixin.js'
import apiMixin from '@/mixins/APIMixin.js'

export default {
  name: 'SingleMember',
  components: {
    UserTags,
    HistoryList
  },
  mixins: [ defaultMixin, userMixin, apiMixin ],
  data(){
    return {
      id        : 0,
      post      : {},
    }
  },
  methods: {
    /*
    * FUNCTION THAT IS FIRED FIRST AS SOON AS ALL THE DEFAULT INITILIZATION IS OVER
    * TRIGGERED FROM THE DEFAULT MIXIN
    */
    ready(){
      var post_id = this.$route.params.id;
      if( post_id ){
        this.id = parseInt( post_id );
      }
      //console.log( this.id );

      // CHECK IF POST INFORMATION HAS BEEN PASSED IN THE ROUTE
      if( this.$route.params.post != undefined ){
        this.post = JSON.parse( this.$route.params.post );
      }
      else{
        this.getPost();
      }
    },
    getPost(){
      var component = this;

      // SET PROCESSING
      component.$store.commit( 'setProcessing', true );

      component.requestUser( component.id ).then( ( response ) => {
        component.post = response.data;

        // RESET PROCESSING
        component.$store.commit( 'setProcessing', false );
      }, ( error ) => {
        component.$store.commit( 'notifyError', error );
      } );

    },
    getPageTitle(){
      var title = 'InPursuit - Single Member';
      return title;
    }
  }
}

</script>
