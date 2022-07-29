<template>
  <ul class='pb-4 mb-8 space-x-3 whitespace-nowrap overflow-auto' v-if='posts && posts.length'>
    <li class='inline-block' v-for='post in posts' :key='post'>
      <PostFeaturedImage :post='post' />
    </li>
  </ul>
</template>

<script>
import Util from '@/lib/Util'

import PostFeaturedImage from '@/templates/Post/FeaturedImage'

export default{
  props: {
    posts: Array,
    status: String
  },
  components:{
    PostFeaturedImage
  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post )
  }
}
</script>
