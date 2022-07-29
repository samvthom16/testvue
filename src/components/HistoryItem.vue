<template>
  <div class="card"
    :class="{
      'event'   : item.type == 'event',
      'comment' : item.type == 'comment',
      hidden: deletedFlag,
      'opacity-80': processing,
    }"
  >
    <div class="card-dot"></div>

    <!-- Line that connecting the box with the vertical line -->
    <div class='card-line'></div>

    <!-- Content that showing in the box -->
    <div class="card-content">
      <div class="card-meta" v-if="item.type">
        <Icon type="History" v-if="item.type == 'event'" />
        <Icon type="Comment" v-if="item.type == 'comment'" />
        <span v-if="item.type == 'comment'">{{ item.author_name }}, </span>
        <span>{{ formatDate(item.date) }}</span>
      </div>
      <h2 class="card-title" v-if="item.type == 'event'">{{ item.title.rendered }}</h2>
      <p class="card-desc">{{ item.text }}</p>
      <button
        v-if="item.type == 'comment'"
        @click="deleteItem"
        type="button"
        class="rounded-sm text-white outline-none absolute right-2 top-2"
      >
        <Icon type="Delete" />
      </button>
    </div>
  </div>
</template>

<script>
import apiMixin from "@/mixins/APIMixin";
import Icon from "@/components/Icon";

import Util from '@/lib/Util'

export default {
  name: "HistoryItem",
  components: { Icon },
  props: {
    item: Object,
  },
  mixins: [apiMixin],
  data() {
    return {
      deletedFlag: false,
      processing: false,
    };
  },
  methods: {
    formatDate: ( dateString ) => Util.timeAgo( dateString ),
    deleteItem() {
      var component = this;

      // SET PROCESSING
      component.setProcessing(true);

      if (confirm("Are you sure you want to delete this?")) {
        component.deleteComment(this.item.id).then(
          () => {
            // HIDE THAT ITEM FROM THE VIEW
            component.deletedFlag = true;

            // RESET PROCESSING
            component.setProcessing(false);
          },
          (error) => {
            // NOTIFY ERROR
            component.$store.commit("notifyError", error);

            // RESET PROCESSING
            component.setProcessing(false);
          }
        );
      }
    },
    setProcessing(flag) {
      this.processing = flag;
      this.$store.commit("setProcessing", flag);
    },
  },
};
</script>

<style scoped>
  .card{
    @apply transform transition hover:-translate-y-2 ml-10 relative flex items-center;
    @apply p-4 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0;
  }
  .card-dot{
    @apply w-5 h-5 absolute -left-10 transform -translate-x-2/4 rounded-full;
    @apply z-10 mt-2 md:mt-0;
  }
  .card-line{
    @apply w-10 h-1 absolute opacity-70 -left-10 z-0;
  }
  .card-content{
    @apply w-full;
  }
  .card-meta{
    @apply uppercase text-xs mb-1 font-bold;
  }
  .card-meta svg{
    @apply inline mr-1;
  }
  .card-title{
    @apply text-xl font-bold;
  }
  .card-desc{
    @apply text-lg opacity-80;
  }

  .card.event,.event .card-dot, .event .card-line, .event .card-meta{
    @apply bg-lightgray text-black;
  }

  .card.comment,.comment .card-dot, .comment .card-line, .comment .card-meta{
    @apply bg-orange text-white;
  }

</style>
