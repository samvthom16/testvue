<template>
  <ul class='divide-y divide-lightgray -mt-2' v-if='posts && posts.length'>
    <li v-for='post in posts' :key='post' class='py-3'>
      <PostTitle :post='post' />
      <SubTitle :title='getLastUpdatedText( post.date )' />
    </li>
  </ul>
</template>

<script>
import Util from '@/lib/Util'

import PostTitle from '@/templates/Post/Title'
import SubTitle from '@/templates/Misc/SubTitle'

export default{
  props: {
    posts: Array,
    status: String
  },
  components: {
    PostTitle,
    SubTitle
  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    getLastUpdatedText: ( datestring ) => Util.timeAgo( datestring )
  }
}
</script>
