<template>
  <router-link
    class='text-lg leading-tight'
    v-bind="$attrs"
    :to="getPostLink( post )"
    v-html='post.title.rendered'
    v-if='post.title && post.title.rendered'
  />
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
