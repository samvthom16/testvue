<template>
  <router-link
    :to="getPostLink( post )"
    class="p-0.5 inline-block"
  >
    <img
      class="bg-lightgray w-12 h-12 object-cover rounded-full ring-2 inline-block ring-white"
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
