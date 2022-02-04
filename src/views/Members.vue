<template>
  <div class="members">
    <UsersList :users='items' :total='totalItems' />
  </div>
</template>

<script>
//import API from '../api.js'

import UsersList from '@/components/UsersList.vue'

import defaultMixin from '@/mixins/DefaultMixin.js'
import paginationMixin from '@/mixins/PaginationMixin.js'
import apiMixin from '@/mixins/APIMixin.js'

export default {
  name: 'Members',
  components: {
    UsersList
  },
  mixins: [ defaultMixin, paginationMixin, apiMixin ],
  methods: {
    /* INHERITED FROM PAGINATION MIXIN */
    getAPI(){
      return this.requestUsers( this.page );
    },
  }
}

</script>
