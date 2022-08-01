<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="py-6" v-for='comment in items' :key='comment'>
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-1">
          <PostFeaturedImage :post='comment.member' />
        </div>
        <div class="flex-1 min-w-0">
          <PostTitle :post='comment.member' />
          <SubTitle :title='getTitle( comment )' />
        </div>
      </div>
      <div class='pt-2 text-black whitespace-pre-line'>{{ comment.comment }}</div>
    </li>
  </ul>
</template>
<script>
import Util from '@/lib/Util'

import PostTitle from '@/templates/Post/Title'
import PostFeaturedImage from '@/templates/Post/FeaturedImage'
import SubTitle from '@/templates/Misc/SubTitle'

export default{
  props: {
    items: Array
  },
  components:{
    PostTitle,
    PostFeaturedImage,
    SubTitle
  },
  methods: {
    getTitle( comment ){
      return this.formatDate( comment.post_date ) + ' by ' + comment.user.name;
    },
    formatDate: ( dateParam ) => Util.timeAgo( dateParam ),
    getPostLink: ( post ) => Util.getPostLink( post )
  }
}
</script>
