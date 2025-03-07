<template>
  <div class="orbit-posts" ref="scrollComponent">
    <slot name="title" v-if="items.length"></slot>
    <component
      v-bind="$attrs"
      :is="params.style"
      :items="items"
      :total="total"
      v-if="status == 'success'"
    ></component>
    <slot name="loadingAnimation" v-else></slot>
    <slot name="nextPageAnimation" v-if="isFetchingNextPage"></slot>
    <slot name="whenempty" v-if="!items.length && status == 'success'"></slot>
  </div>
</template>
<script>
import OrbitQuery from "@/lib/OrbitQuery.js";
import Util from "@/lib/Util.js";
import Helper from "@/lib/Helper.js";

import { onMounted, onUnmounted, computed } from "vue";

import UsersList from "@/templates/Comments/UsersList.vue";
import UsersListWithComment from "@/templates/Comments/UsersListWithComment.vue";
import CommentsCount from "@/templates/Comments/CommentsCount.vue";

import API from "@/api";

export default {
  props: {
    params: Object,
  },
  components: {
    UsersList,
    CommentsCount,
    UsersListWithComment,
  },
  setup(props) {
    const params = computed(() => {
      var params = Util.removeEmptyParams(
        JSON.parse(JSON.stringify(props.params))
      );

      delete params["style"];
      return params;
    });

    const requestAPI = (params) => API.requestComments(params);
    const {
      items,
      total,
      watchScroll,
      scrollComponent,
      status,
      isFetchingNextPage,
    } = OrbitQuery(params.value, requestAPI);

    const { debounceEvent } = Helper();

    const handleScroll = () => {
      debounceEvent(function () {
        watchScroll();
      }, 50);
    };

    onMounted(() => {
      if (props.params.pagination) {
        window.addEventListener("scroll", handleScroll);
      }
    });
    onUnmounted(() => {
      if (props.params.pagination) {
        window.removeEventListener("scroll", handleScroll);
      }
    });
    return {
      items,
      status,
      total,
      scrollComponent,
      isFetchingNextPage,
    };
  },
};
</script>
