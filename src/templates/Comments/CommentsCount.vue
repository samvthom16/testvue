<template>
  <div class="mt-4 mb-1">
    <div class="text-sm text-gray">{{ total }} Comments</div>
  </div>
</template>
<script>
export default {
  name: "CommentsCount",
  props: {
    total: Number,
  },
};
</script>
