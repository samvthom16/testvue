<template>
  <!-- Card 1 -->
  <div :class="{ 'bg-purple': item.type == 'event', 'bg-orange': item.type == 'comment' }" class="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
    <!-- Dot Follwing the Left Vertical Line -->
    <div :class="{ 'bg-purple': item.type == 'event', 'bg-orange': item.type == 'comment' }" class="w-5 h-5 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>
    <!-- Line that connecting the box with the vertical line -->
    <div :class="{ 'bg-purple': item.type == 'event', 'bg-orange': item.type == 'comment' }" class="w-10 h-1 absolute opacity-70 -left-10 z-0"></div>

    <!-- Content that showing in the box -->
    <div class="flex-auto">
      <h1 class="text-md" v-html='formatDate( item.date )'></h1>
      <h1 class="text-xl font-bold">{{ item.title.rendered }}</h1>
      <h3>{{ item.text }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryItem',
  props: {
    item: Object
  },
  methods: {
    formatDate( dateString ) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
    }
  }
}
</script>
