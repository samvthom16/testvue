<template>
  <div class="orbit-posts" ref="scrollComponent">
    <slot name="title" v-if="items.length"></slot>
    <component
      v-bind="$attrs"
      :is="resolvedStyle"
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
import Util from "@/lib/Util.js";
import Helper from "@/lib/Helper.js";
import { onMounted, onUnmounted, computed, watch } from "vue";

import PostImagesSlider from "@/templates/Posts/PostImagesSlider.vue";
import EventList from "@/templates/Posts/EventList.vue";
import AvatarsStacked from "@/templates/Posts/AvatarsStacked.vue";
import EventsCount from "@/templates/Posts/EventsCount.vue";
import MembersCount from "@/templates/Posts/MembersCount.vue";
import ListWithImage from "@/templates/Posts/ListWithImage.vue";
import PostsListWithTermName from "@/templates/Posts/ListWithTermName.vue";
import MemberListWithSwitch from "@/templates/Posts/MemberListWithSwitch.vue";
import MembersGrid from "@/templates/Posts/MembersGrid.vue";
import EventsGrid from "@/templates/Posts/EventsGrid.vue";
import InpursuitListWithTermName from "@/templates/InpursuitPosts/ListWithTermName.vue";

import API from "@/api";

export default {
  props: {
    params: Object,
    apiType: {
      type: String,
      default: "posts",
    },
  },
  emits: ['totalChanged'],
  components: {
    EventList,
    PostImagesSlider,
    AvatarsStacked,
    ListWithImage,
    PostsListWithTermName,
    MemberListWithSwitch,
    MembersGrid,
    EventsGrid,
    EventsCount,
    MembersCount,
    InpursuitListWithTermName,
  },
  setup(props, context) {
    const isInpursuit = computed(() => props.apiType === "inpursuit");

    const cleanedParams = computed(() => {
      var params = Util.removeEmptyParams(
        JSON.parse(JSON.stringify(props.params))
      );
      if (!isInpursuit.value && params.style === "TrendingPosts") {
        params.trending = 1;
      }
      delete params["style"];
      params.post_type = params.post_type
        ? params.post_type
        : isInpursuit.value ? "" : "posts";
      return params;
    });

    // Resolve ListWithTermName to the correct version based on apiType.
    // All other style strings pass through to their globally/locally registered names.
    const resolvedStyle = computed(() => {
      const style = props.params.style;
      if (style === "ListWithTermName") {
        return isInpursuit.value ? "InpursuitListWithTermName" : "PostsListWithTermName";
      }
      return style;
    });

    const requestAPI = (params) =>
      isInpursuit.value
        ? API.requestInpursuitPosts(params.post_type, params)
        : API.requestPosts(params.post_type, params);

    const { items, total, watchScroll, scrollComponent, status, isFetchingNextPage } =
      OrbitQuery(cleanedParams.value, requestAPI);

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

    watch(total, () => context.emit("totalChanged", total.value));
    context.emit("totalChanged", total.value);

    return {
      items,
      total,
      status,
      scrollComponent,
      isFetchingNextPage,
      resolvedStyle,
    };
  },
};
</script>
