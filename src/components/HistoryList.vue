<template>
  <div>
    <ul class="divide-y divide-lightgray space-y-4" ref="scrollComponent">
      <li class='pb-2 pt-6 relative' :item='item' v-for='item in items' :key='item.id'>
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-1">
            <Icon type="Event" class='bg-red text-white rounded p-3 w-12 h-12 inline mr-1' v-if="item.type == 'event'" />
            <Icon type="Comment" class='bg-orange text-white rounded p-3 w-12 h-12 inline mr-1' v-if="item.type == 'comment'" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg truncate" v-if="item.type == 'event'">{{ item.title.rendered }}</h2>
            <h2 class='text-lg' v-else>{{ item.author_name }} commented</h2>
            <div class="text-gray text-sm">
              {{ formatDate( item.date ) }}
            </div>
          </div>
        </div>
        <div class="card-desc whitespace-pre-line mt-3">{{ item.text }}</div>
        <button
          v-if="item.type == 'comment'"
          @click="deleteComment( item )"
          type="button"
          class="rounded-sm text-gray outline-none absolute right-2 top-4"
        >
          <Icon type="Delete" />
        </button>
      </li>
    </ul>
    <PaginationLoaderAnimation v-if="isFetchingNextPage" />
    <ItemAnimation v-if='$store.state.processing && !items.length' />
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import ItemAnimation from '@/components/ItemAnimation.vue'

import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader.vue'

import OrbitQuery from "@/lib/OrbitQuery";
import Util from '@/lib/Util'
import Helper from '@/lib/Helper'

import API from '@/api'

import {computed, onMounted, onUnmounted} from 'vue'

export default {
  name: 'HistoryList',
  components: {
    PaginationLoaderAnimation,
    ItemAnimation,
    Icon
  },
  props:{
    id  : Number,
    item: Object
  },
  setup( props, context ){

    const params = computed(() => {
      return {
        id: props.id
      };
    } );


    const requestAPI = ( params ) => API.requestHistory( params );
    const { items, watchScroll, scrollComponent, status, isFetchingNextPage } = OrbitQuery(
      params.value,
      requestAPI
    );

    const deleteComment = ( comment ) => context.emit( 'deleteComment', comment )

    const {debounceEvent} = Helper()

    const handleScroll = () => {
      debounceEvent(function () {
        watchScroll();
      }, 50);
    };

    onMounted( () => {
      window.addEventListener( "scroll", handleScroll );
    } );
    onUnmounted(() => {
      window.removeEventListener( "scroll", handleScroll );
    } );

    return {
      items,
      scrollComponent,
      status,
      isFetchingNextPage,
      deleteComment
    }

  },
  methods: {
    formatDate: ( dateString ) => Util.timeAgo( dateString ),
  },
}
</script>
