<template>
  <ul class='divide-y divide-lightgray -mt-2' v-if='posts && posts.length'>
    <li v-for='post in posts' :key='post' class='py-3'>
      <PostTitle :post='post' />
      <SubTitle :title='getLastUpdatedText( post.date )' />
      <OrbitPosts :params="getParamsForMembers( post )">
        <template v-slot:loadingAnimation>
          <AvatarsStackedAnimation />
        </template>
      </OrbitPosts>
    </li>
  </ul>
</template>

<script>
import Util from '@/lib/Util'

import PostTitle from '@/templates/Post/Title'
import SubTitle from '@/templates/Misc/SubTitle'

import AvatarsStackedAnimation from '@/templates/Animation/AvatarsStacked'

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

  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    getLastUpdatedText: ( datestring ) => Util.timeAgo( datestring ),
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
