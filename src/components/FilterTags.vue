<template>
  <li class="inline-block truncate">
    <div
      class="mr-2 p-1 px-2 rounded bg-orange text-white"
      @click="updateChipsList"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 inline"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      {{ tag }}
    </div>

    <div v-if="isChipListVisible" class="flex flex-wrap">
      <template v-for="subTag in tagData" :key="subTag">
        <div class="chip-style truncate">{{ subTag }}</div>
      </template>
    </div>
  </li>
</template>

<script>
export default {
  name: "FilterTags",
  data() {
    return {
      isChipListVisible: false,
    };
  },
  props: {
    tag: Object,
    tagData: Object,
  },
  methods: {
    updateChipsList() {
      this.isChipListVisible = !this.isChipListVisible;
    },
  },
};
</script>

<style scoped>
.chip-style {
  @apply mr-2 p-1 px-2 rounded bg-midorange text-white text-center;
}
</style>
