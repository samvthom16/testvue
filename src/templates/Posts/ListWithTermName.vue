<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li
      class="py-3 sm:py-4 flex items-center justify-between"
      v-for="post in posts"
      :key="post"
    >
      <div>
        <router-link class="font-bold text-xl" :to="getEditLink(post, false)">
          {{ post.name }}
        </router-link>

        <OrbitPosts :params="getParams(post)">
          <template v-slot:loadingAnimation>
            <AvatarsStackedAnimation />
          </template>
        </OrbitPosts>
      </div>
      <router-link :to="getEditLink(post, true)">
        <Icon type="Edit" class="inline" />
      </router-link>
    </li>
  </ul>
</template>

<script>
import Util from "@/lib/Util.js";

import Icon from "@/components/Icon.vue";

import AvatarsStackedAnimation from "@/templates/Animation/AvatarsStacked.vue";

import CategoryHelper from "@/lib/CategoryHelper";

export default {
  props: {
    posts: Array,
  },
  components: {
    Icon,
    AvatarsStackedAnimation,
  },
  setup() {
    const getEditLink = (post, edit) => {
      if (post.taxonomy === "inpursuit-event-type" && !edit)
        return {
          name: "Events",
          query: { event_type: post.id },
        };
      return {
        name: "NewCategory",
        query: { id: post.id },
      };
    };

    const getParams = (post) => {
      var params = {
        per_page: 5,
        post_type: "inpursuit-members",
        style: "AvatarsStacked",
      };

      if (post.taxonomy == "inpursuit-event-type") {
        params.post_type = "inpursuit-events";
        params.style = "EventsCount";
      }

      const { getWPJsonType } = CategoryHelper();

      params[getWPJsonType(post.taxonomy)] = post.id;

      return params;
    };

    return {
      getEditLink,
      getParams,
    };
  },
};
</script>
