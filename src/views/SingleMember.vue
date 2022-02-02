<template>
  <div class="single-member">
    <ItemAnimation class="mt-5" v-if='$store.state.processing' />
    <div class="bg-white pb-6 w-full justify-center items-center overflow-hidden md:max-w-sm md:mt-5 lg:rounded lg:shadow mx-auto">
      <div class="relative h-40 bg-purple">
        <router-link to='../members' class='text-xs text-white mt-2 p-2'>&#8592;&nbsp;List Of Members</router-link>
      </div>
      <div class="relative shadow mx-auto h-28 w-28 -my-12 border-white rounded-full overflow-hidden border-4">
        <img class="object-cover w-full h-full" :src="post.featured_image">
      </div>
      <div class="mt-16">
        <h1 class="text-lg text-center font-semibold" v-if='post.title'>{{ post.title.rendered }}</h1>
        <p class="text-sm text-gray text-center" v-html='getStatus( post )'></p>
      </div>

      <UserTags :user='post' />

      <!--div class="mt-6 pt-3 flex flex-wrap mx-6 border-t">
        <div v-if='getLocation( post )' class="text-xs mr-2 my-1 uppercase tracking-wider border px-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-indigo-100 cursor-default">
          <span v-html='locationHTML( post )'></span>
        </div>
        <div v-if='genderHTML( post )' class="text-xs mr-2 my-1 uppercase tracking-wider border px-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-indigo-100 cursor-default">
          <span v-html='genderHTML( post )'></span>
        </div>
        <div v-if='groupHTML( post )' class="text-xs mr-2 my-1 uppercase tracking-wider border px-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-indigo-100 cursor-default">
          <span v-html='groupHTML( post )'></span>
        </div>
        <div v-if='professionHTML( post )' class="text-xs mr-2 my-1 uppercase tracking-wider border px-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-indigo-100 cursor-default">
          <span v-html='professionHTML( post )'></span>
        </div>
      </div-->
    </div>
  </div>
</template>

<script>
import API from '../api.js'

import ItemAnimation from '../components/ItemAnimation.vue'
import UserTags from '../components/UserTags.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'
import userMixin from '@/mixins/UserMixin.js'

export default {
  name: 'SingleMember',
  components: {
    ItemAnimation,
    UserTags
  },
  mixins: [ defaultMixin, userMixin ],
  data(){
    return {
      id  : 0,
      post: {}
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
        this.id = post_id;
      }

      console.log('hello');
      console.log( this.$route.params );

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

      API.requestUser( this.account_url, component.id ).then( ( response ) => {
        component.post = response.data;

        // RESET PROCESSING
        component.$store.commit( 'setProcessing', false );
      } );

    }
  }
}

</script>
