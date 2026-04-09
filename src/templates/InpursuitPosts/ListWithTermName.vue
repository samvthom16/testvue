<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li
      v-for="post in posts"
      :key="post.term_id"
      class="flex items-center gap-4 py-3"
    >
      <!-- Icon badge -->
      <div class="shrink-0 w-10 h-10 rounded-2xl bg-lightergray flex items-center justify-center">
        <Icon type="Comment" class="w-5 h-5 text-purple" />
      </div>

      <!-- Name + count -->
      <div class="flex-1 min-w-0">
        <router-link
          :to="getUserRedirectionLink(post)"
          class="font-semibold text-sm text-darkblack hover:text-purple transition-colors"
        >
          {{ post.name }}
        </router-link>
        <OrbitComments :params="getParams(post)">
          <template v-slot:loadingAnimation>
            <div class="h-3 w-16 bg-lightergray rounded animate-pulse mt-1"></div>
          </template>
        </OrbitComments>
      </div>

      <!-- Edit button -->
      <button
        @click="$emit('edit-item', post)"
        class="shrink-0 p-2 rounded-full hover:bg-lightergray transition-colors text-darkgray hover:text-darkblack"
      >
        <Icon type="Edit" class="w-4 h-4" />
      </button>
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
  emits: ['edit-item'],
  components: {
    Icon,
    OrbitComments,
  },
  setup() {
    const getUserRedirectionLink = (post) => ({
      name: "Comments",
      query: { comment_type: post?.term_id },
    });

    const getParams = (post) => ({
      per_page:          1,
      style:             "CommentsCount",
      comments_category: post?.term_id,
    });

    return {
      getParams,
      getUserRedirectionLink,
    };
  },
};
</script>
