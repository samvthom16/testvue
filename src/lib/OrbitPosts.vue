<template>
  <div class="orbit-posts" ref="scrollComponent">
    <slot name="title" v-if="items.length"></slot>
    <component
      v-bind="$attrs"
      :is="params.style"
      :posts="items"
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

import Util from "@/lib/Util.js"
import Helper from '@/lib/Helper.js'

import { onMounted, onUnmounted, computed, watch } from "vue";


import PostImagesSlider from '@/templates/Posts/PostImagesSlider.vue'
import EventList from '@/templates/Posts/EventList.vue'
import AvatarsStacked from '@/templates/Posts/AvatarsStacked.vue'
import ListWithImage from '@/templates/Posts/ListWithImage.vue'
import MemberListWithSwitch from '@/templates/Posts/MemberListWithSwitch.vue'


import API from "@/api";
export default {
  props: {
    params: Object,
  },
  components: {
    EventList,
    PostImagesSlider,
    AvatarsStacked,
    ListWithImage,
    MemberListWithSwitch
  },
  setup( props, context ) {

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


    const requestAPI = ( params ) => API.requestPosts(params.post_type, params);
    const { items, total, watchScroll, scrollComponent, status, isFetchingNextPage } = OrbitQuery(
      params.value,
      requestAPI
    );

    const {debounceEvent} = Helper()

    const handleScroll = () => {
      debounceEvent(function () {
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
    } );

    watch( total, () => context.emit( 'totalChanged', total.value ) )

    // FOR THE FIRST API CALL
    context.emit( 'totalChanged', total.value )

    return {
      items,
      total,
      status,
      scrollComponent,
      isFetchingNextPage
    };
  },
};
</script>
