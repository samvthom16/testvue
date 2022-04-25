<template>
  <div class="homeScreen">
    <button
      type="button"
      @click="switchScreens"
      class="mt-6 text-sm underline text-center w-full"
    >
      Switch to {{ selectedField }}
    </button>

    <Members v-if="isMembers" />
    <Events v-if="!isMembers" />
  </div>
</template>

<script>
import Members from "./Members.vue";
import Events from "./Events.vue";

export default {
  name: "HomeScreen",
  components: {
    Members,
    Events,
  },
  data() {
    return {
      isMembers: true,
      selectedField: "Events",
    };
  },
  methods: {
    switchScreens() {
      this.isMembers = !this.isMembers;
      if (this.isMembers) {
        this.selectedField = "Events";
      } else {
        this.selectedField = "Members";
      }
    },
  },
};
</script>
