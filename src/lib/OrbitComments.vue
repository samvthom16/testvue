<template>
  <div class="orbit-posts" ref="scrollComponent">
    <slot name="title" v-if="items.length"></slot>
    <component
      v-bind="$attrs"
      :is="params.style"
      :items="items"
      v-if="status == 'success'"
    ></component>
    <slot name="loadingAnimation" v-else></slot>
    <slot name="whenempty" v-if="!items.length && status == 'success'"></slot>
  </div>
</template>
<script>
import OrbitQuery from "@/lib/OrbitQuery.js";
import Util from "@/lib/Util";

import { onMounted, onUnmounted, computed } from "vue";

import UsersList from '@/templates/Comments/UsersList'

import API from "@/api";

export default {
  props: {
    params: Object,
  },
  components: {
    UsersList
  },
  setup( props ) {

    const params = computed(() => {
      var params = Util.removeEmptyParams(
        JSON.parse(JSON.stringify(props.params))
      );

      delete params["style"];
      return params;
    } );

    const requestAPI = ( params ) => API.requestComments( params );
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
        window.addEventListener( "scroll", handleScroll );
      }
    });
    onUnmounted(() => {
      if (props.params.pagination) {
        window.removeEventListener( "scroll", handleScroll );
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
