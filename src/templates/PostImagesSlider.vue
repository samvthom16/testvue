<template>
  <ul class='pb-4 mb-8 whitespace-nowrap overflow-auto' v-if='posts && posts.length'>
    <li class='inline-block w-16 h-16 mr-3' v-for='post in posts' :key='post'>
      <router-link :to='getPostLink( post )'>
        <img
          class='w-full h-full object-cover rounded-full border border-gray'
          :src='post.featured_image'
        />
      </router-link>
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
    getPostLink: ( post ) => Util.getPostLink( post )
  }
}
</script>
