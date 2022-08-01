<template>
  <div class="flex -space-x-2 items-center mt-4">
      <router-link :to="getPostLink( post )" v-for='post in posts' :key='post'>
          <img
            class="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-white"
            :src="post.featured_image"
            :alt="post.title.rendered"
          />
      </router-link>
      <div class="px-5 text-sm text-gray" v-html='moreHtml()'></div>
  </div>
</template>
<script>
import Util from '@/lib/Util'

export default{
  props: {
    posts: Array,
    status: String,
    total: Number
  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    getLastUpdatedText: ( datestring ) => Util.timeAgo( datestring ),
    moreHtml(){
      var newTotal = 0;
      if( this.total > 4 ) newTotal = this.total - 4;
      if( newTotal ) return "+ " + newTotal + " More";
      return ""
    }
  }
}
</script>
