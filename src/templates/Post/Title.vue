<template>
  <router-link
    class="text-lg leading-tight"
    v-bind="$attrs"
    :to="getPostLink(post)"
    v-html="post.title.rendered"
    @click="handleClick(post)"
    v-if="post.title && post.title.rendered"
  />
</template>

<script>
import Util from "@/lib/Util";
import store from "@/store";
import { ref } from "vue";

export default {
  props: {
    post: Object,
  },
  methods: {
    getPostLink: (post) => Util.getPostLink(post),
    handleClick: (post) => {
      const newPost = ref(post);
      store.commit("setCachedMember", newPost);
    },
  },
};
</script>
