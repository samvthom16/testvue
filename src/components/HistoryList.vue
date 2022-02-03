<template>
  <div class="w-10/12 md:w-7/12 lg:6/12 mx-auto relative py-20">
    <div class="border-l-2 border-gray mt-3">
      <HistoryItem :item='item' v-for='item in items' :key='item.id' />
    </div>
  </div>
</template>

<script>
import HistoryItem from './HistoryItem.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'
import paginationMixin from '@/mixins/PaginationMixin.js'

import API from '@/api.js'

export default {
  name: 'HistoryList',
  components: {
    HistoryItem
  },
  props:{
    id : Number
  },
  mixins: [ defaultMixin, paginationMixin ],
  methods: {
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI(){
      return API.requestHistory( {
        account_url : this.account_url,
        id          : this.id,
        page        : this.page
      } );
    },
  },
}
</script>
