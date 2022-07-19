<template>
  <circle-progress
    :percent="contentProgress"
    :size="size"
    :border-width="8"
    :border-bg-width="9"
    :show-percent="true"
    :fill-color="'#F9AB70'"
    :empty-colo="'#9E81A0'"
  />
</template>


<script>
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";

export default {
  name: "CircularProgressBar",
  components: { CircleProgress },
  props: {
    contentProgress: Number,
    size: Number,
  },
};
</script>
