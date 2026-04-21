<template>
  <!-- Mobile list -->
  <ul role="list" class="divide-y divide-lightgray md:hidden">
    <li class="py-4" v-for="post in posts" :key="post">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <PostFeaturedImage :post="post" />
        </div>
        <div class="flex-1 min-w-0">
          <PostTitle :post="post" />
          <SubTitle :title="getSubTitle(post)" />
        </div>
      </div>
    </li>
  </ul>

  <!-- Desktop table -->
  <div class="hidden md:block rounded-xl border border-lightgray overflow-hidden">
    <table class="w-full">
      <thead class="bg-lightergray">
        <tr>
          <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Member Name</th>
          <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Last Seen</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-lightgray">
        <tr v-for="post in posts" :key="post.id" class="hover:bg-lightergray transition-colors">
          <td class="py-3 px-5">
            <div class="flex items-center gap-3">
              <PostFeaturedImage :post="post" />
              <PostTitle :post="post" />
            </div>
          </td>
          <td class="py-3 px-5">
            <SubTitle :title="getSubTitle(post)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PostTitle from "@/templates/Post/Title.vue";
import PostFeaturedImage from "@/templates/Post/FeaturedImage.vue";
import SubTitle from "@/templates/Misc/SubTitle.vue";

import Util from "@/lib/Util.js";

export default {
  props: {
    posts: Array,
    total: Number,
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
