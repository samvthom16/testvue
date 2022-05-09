<template>
  <div class="w-10/12 md:w-7/12 lg:6/12 relative pt-10 mx-auto">
    <h1 class="text-xl font-semibold ml-2 truncate dark:text-white">
      Attandance
    </h1>
    <!-- <h2 class="ml-6 pt-3 text-lg font-semibold">label</h2> -->

    <div class="flex flex-wrap py-2 mt-4 mx-">
      <base-progress
        :percentage="contentProgress"
        :color="color"
        class="mx-2 mb-2 h-5"
      >
        <span class="text-xs text-white w-full flex justify-end pr-2"
          >{{ contentProgress }}%</span
        >
      </base-progress>
    </div>
  </div>
</template>

<script>
import BaseProgress from "@/components/BaseProgress.vue";
export default {
  name: "ProgressBarItem",
  components: {
    BaseProgress,
  },
  props: {
    color: {
      type: String,
      default: "purple",
    },
    label: {
      type: String,
      default: "Attandance",
    },
    // label: String,
    contentProgress: Number,
  },
  //   data() {
  //     return {
  //       color: "purple",
  //       progressStart: 10,
  //       contentProgress: 37,
  //     };
  //   },
};
</script>