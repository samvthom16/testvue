<template>
  <div class="flow-root">
    <ListWithImage :posts='users' />
  </div>
</template>

<script>
import userMixin from "@/mixins/UserMixin.js";

import ListWithImage from '@/templates/Posts/ListWithImage.vue'

export default {
  name: "UsersList",
  components: {
    ListWithImage
  },
  mixins: [userMixin],
  props: {
    users: Array,
    total: Number,
  },

};
</script>
<style scoped>
.button {
  @apply border border-orange font-semibold p-2 px-4 rounded-lg bg-orange text-sm;
}
.title {
  @apply text-sm font-thin;
}
</style>
