<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="py-3 sm:py-4" v-for="post in posts" :key="post">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-1">
          <PostFeaturedImage :post='post' />
        </div>
        <div class="flex-1 min-w-0">
          <PostTitle :post='post' />
          <SubTitle :title='getSubTitle( post )' />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import PostTitle from '@/templates/Post/Title'
import PostFeaturedImage from '@/templates/Post/FeaturedImage'
import SubTitle from '@/templates/Misc/SubTitle'

import Util from '@/lib/Util'

export default {
  props: {
    posts: Array
  },
  components: {
    PostTitle,
    PostFeaturedImage,
    SubTitle
  },
  methods: {
    getSubTitle: ( user ) => "Last seen " + Util.timeAgo( user.last_seen ),
  },
}
</script>
