<template>
  <div class="orbit-posts" ref="scrollComponent">
    <slot name="title" v-if="items.length"></slot>
    <component
      v-bind="$attrs"
      :is="params.style"
      :posts="items"
      v-if="status == 'success'"
    ></component>
    <slot name="loadingAnimation" v-else></slot>
    <slot name="whenempty" v-if="!items.length && status == 'success'"></slot>
  </div>
</template>
<script>
import PostsAnimation from "@/components/ItemAnimation"

import OrbitQuery from "@/lib/OrbitQuery.js";

import Util from "@/lib/Util";

import { onMounted, onUnmounted, computed } from "vue";


import PostImagesSlider from '@/templates/PostImagesSlider'
import PostList from '@/templates/PostList'



import API from "@/api";
export default {
  props: {
    params: Object,
  },
  components: {
    PostList,
    PostImagesSlider,
    PostsAnimation,
  },
  setup( props ) {

    const params = computed(() => {
      var params = Util.removeEmptyParams(
        JSON.parse(JSON.stringify(props.params))
      );
      if (params.style == "TrendingPosts") {
        params.trending = 1;
      }
      delete params["style"];
      params.post_type = params.post_type ? params.post_type : "posts";
      return params;
    });


    const requestAPI = (params) => API.requestPosts(params.post_type, params);
    const { items, watchScroll, scrollComponent, status } = OrbitQuery(
      params.value,
      requestAPI
    );

    const handleScroll = () => {
      Util.debounceEvent(function () {
        watchScroll();
      }, 50);
    };

    onMounted( () => {
      if ( props.params.pagination ) {
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
      scrollComponent,
    };
  },
};
</script>
