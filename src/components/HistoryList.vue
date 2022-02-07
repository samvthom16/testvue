<template>
  <AddComment :id='id' v-if='id' />
  <div class="border-l-2 border-gray mt-3">
    <HistoryItem :item='item' v-for='item in items' :key='item.id' />
  </div>
  <ItemAnimation v-if='$store.state.processing && !items.length' />
</template>

<script>
import HistoryItem from '@/components/HistoryItem.vue'

import AddComment from '@/components/AddComment.vue'
import ItemAnimation from '@/components/ItemAnimation.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'
import paginationMixin from '@/mixins/PaginationMixin.js'
import apiMixin from '@/mixins/APIMixin.js'


export default {
  name: 'HistoryList',
  components: {
    HistoryItem,
    AddComment,
    ItemAnimation
  },
  props:{
    id : Number
  },
  mixins: [ defaultMixin, paginationMixin, apiMixin ],
  methods: {
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI(){
      return this.requestHistory( {
        id     : this.id,
        page   : this.page
      } );
    },
    
  },
}
</script>
