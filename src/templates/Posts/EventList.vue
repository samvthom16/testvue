<template>
  <ul class='divide-y divide-lightgray -mt-2' v-if='posts && posts.length'>
    <li v-for='post in posts' :key='post' class='py-3'>
      <PostTitle :post='post' />
      <SubTitle :title='getLastUpdatedText( post )' />
      <OrbitPosts :params="getParamsForMembers( post )">
        <template v-slot:loadingAnimation>
          <AvatarsStackedAnimation />
        </template>
      </OrbitPosts>
    </li>
  </ul>
</template>

<script>
import store from '@/store'
import Util from '@/lib/Util.js'

import PostTitle from '@/templates/Post/Title.vue'
import SubTitle from '@/templates/Misc/SubTitle.vue'

import AvatarsStackedAnimation from '@/templates/Animation/AvatarsStacked.vue'

export default{
  props: {
    posts: Array,
    status: String
  },
  components: {
    PostTitle,
    SubTitle,
    AvatarsStackedAnimation
  },
  setup(){

    store.commit( 'getAccountSettings' );

  },

  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    getLastUpdatedText( post ){
      var event_type = this.getEventType( post );
      var text = Util.timeAgo( post.date );
      if( event_type ){
        text += ', ' + event_type;
      }
      return  text;
    },
    getEventType(post) {
      return this.getTermName( 'event_type', post.event_type );
    },
    getTermName(field, term_id) {
        var settings = this.$store.state.account;
        //console.log( settings );
        if (settings != undefined && settings[field] && settings[field][term_id]) {
            return settings[field][term_id];
        }
        return '';
    },
    getParamsForMembers: ( post ) => {
      return {
        per_page              : 5,
        post_type             : 'inpursuit-members',
        style                 : 'AvatarsStacked',
        event_id              : post.id,
        show_event_attendants : 1
      }
    }
  }
}
</script>
