<template>
  <router-link
    :to="getPostLink( post )"
    class="bg-lightgray w-12 h-12 rounded-full overflow-hidden inline-block"
  >
    <img
      class="w-full h-full object-cover rounded-full"
      :src="post.featured_image"
      :alt="post.title.rendered"
      v-if='post.title && post.title.rendered'
    />
  </router-link>
</template>

<script>
import Util from '@/lib/Util'

export default{
  props: {
    post: Object
  },
  methods: {
    getPostLink: ( post ) => Util.getPostLink( post ),
  }
}
</script>
