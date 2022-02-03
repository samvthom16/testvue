<template>
  <div class="members">
    <UsersList :users='items' :total='totalItems' />
    <div class='triggerLoadMore'></div>
  </div>
</template>

<script>
import API from '../api.js'

import UsersList from '@/components/UsersList.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'
import paginationMixin from '@/mixins/PaginationMixin.js'

export default {
  name: 'Members',
  components: {
    UsersList
  },
  mixins: [ defaultMixin, paginationMixin ],
  methods: {
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI(){
      return API.requestUsers( this.account_url, this.page );
    },
  }
}

</script>
