<template>
  <p class="text-xs text-gray mt-0.5">{{ total }} members</p>
</template>
<script>
export default {
  name: 'MembersCount',
  props: {
    posts: Array,
    total: Number,
  },
};
</script>
