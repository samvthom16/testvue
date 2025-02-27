<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li
      class="py-3 sm:py-4 flex items-center justify-between"
      v-for="post in posts"
      :key="post"
    >
      <div>
        <router-link
          class="font-bold text-xl"
          :to="getUserRedirectionLink(post)"
        >
          {{ post.name }}
        </router-link>
        <OrbitComments :params="getParams(post)">
          <template v-slot:loadingAnimation>
            <div class="animate-pulse mt-4 mb-1">
              <div class="h-2 bg-lightgray rounded"></div>
            </div>
          </template>
        </OrbitComments>
      </div>
      <router-link :to="getEditLink(post)">
        <Icon type="Edit" class="inline" />
      </router-link>
    </li>
  </ul>
</template>
<script>
import Icon from "@/components/Icon.vue";
import OrbitComments from "@/lib/OrbitComments.vue";

export default {
  props: {
    posts: Array,
  },
  components: {
    Icon,
    OrbitComments,
  },
  setup() {
    const getEditLink = (post) => {
      return {
        name: "NewCommentsCategory",
        query: { id: post?.term_id },
      };
    };

    const getUserRedirectionLink = (user) => {
      return {
        name: "Comments",
        query: { comment_type: user?.term_id },
      };
    };

    const getParams = (post) => {
      var params = {
        per_page: 5,
        style: "CommentsCount",
        comments_category: post?.term_id,
      };

      return params;
    };

    return {
      getParams,
      getEditLink,
      getUserRedirectionLink,
    };
  },
};
</script>
