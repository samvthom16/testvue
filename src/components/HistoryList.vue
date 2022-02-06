<template>
  <AddComment :id='id' v-if='id' />
  <div class="border-l-2 border-gray mt-3">
    <HistoryItem :item='item' v-for='item in items' :key='item.id' />
  </div>
  <HistoryItem :item='item' v-for='item in items' :key='item.id' />
  <!--div class='border border-red' v-for='item in items' :key='item.id'>{{ item.text }}</div-->
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
    /*
    * THIS FUNCTION IS CALLED BY THE CHILD COMPONENT INCASE ANY NEW COMMENT IS ADDED
    * AND IT FETCHES NEW COMMENTS
    */
    refreshItems(){
      //console.log( 'refresh' );

      var component = this;
      component.items = [];
      component.page = 1;
      component.getItems();
    }
  },
}
</script>
