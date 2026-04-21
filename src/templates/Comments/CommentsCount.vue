<template>
  <p class="text-xs text-gray mt-0.5">{{ total }} comments</p>
</template>
<script>
export default {
  name: "CommentsCount",
  props: {
    total: Number,
  },
};
</script>
