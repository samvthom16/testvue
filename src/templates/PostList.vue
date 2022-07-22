<template>
  <ul class='divide-y divide-lightgray -mt-2' v-if='posts && posts.length'>
    <li v-for='post in posts' :key='post' class='py-3'>
      <router-link
        class='text-lg'
        :to="getPostLink( post )"
        v-html='post.title.rendered'
        v-if='post.title && post.title.rendered'
      ></router-link>
      <p class='text-gray text-xs' v-html='getLastUpdatedText( post.date )'></p>
    </li>
  </ul>
</template>

<script>
import Util from '@/lib/Util'

export default{
  props: {
    posts: Array,
    status: String
  },
  methods:{
    getPostLink: ( post ) => Util.getPostLink( post ),
    getLastUpdatedText: ( datestring ) => Util.timeAgo( datestring )
  }
}
</script>
