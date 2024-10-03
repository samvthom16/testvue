<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="py-3 sm:py-4" v-for="post in posts" :key="post">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-1">
          <PostFeaturedImage :post="post" />
        </div>
        <div class="flex-1 min-w-0">
          <PostTitle :post="post" />
          <SubTitle :title="getSubTitle(post)" />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import PostTitle from "@/templates/Post/Title.vue";
import PostFeaturedImage from "@/templates/Post/FeaturedImage.vue";
import SubTitle from "@/templates/Misc/SubTitle.vue";

import Util from "@/lib/Util.js";

export default {
  props: {
    posts: Array,
  },
  components: {
    PostTitle,
    PostFeaturedImage,
    SubTitle,
  },
  methods: {
    getSubTitle: (user) => {
      const prefix = "Last seen";
      const lastSeen = user.last_seen;

      return lastSeen
        ? `${prefix} ${Util.timeAgo(user.last_seen)}`
        : `${prefix} never`;
    },
  },
};
</script>
