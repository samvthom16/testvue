<template>
  <!-- Card 1 -->
  <div
    :class="{
      'bg-purple': item.type == 'event',
      'bg-orange': item.type == 'comment',
      hidden: deletedFlag,
      'opacity-80': processing,
    }"
    class="
      transform
      transition
      cursor-pointer
      hover:-translate-y-2
      ml-10
      relative
      flex
      items-center
      px-6
      py-4
      text-white
      rounded
      mb-10
      flex-col
      md:flex-row
      space-y-4
      md:space-y-0
    "
  >
    <!-- Dot Follwing the Left Vertical Line -->
    <div
      :class="{
        'bg-purple': item.type == 'event',
        'bg-orange': item.type == 'comment',
      }"
      class="
        w-5
        h-5
        absolute
        -left-10
        transform
        -translate-x-2/4
        rounded-full
        z-10
        mt-2
        md:mt-0
      "
    ></div>

    <!-- Line that connecting the box with the vertical line -->
    <div
      :class="{
        'bg-purple': item.type == 'event',
        'bg-orange': item.type == 'comment',
      }"
      class="w-10 h-1 absolute opacity-70 -left-10 z-0"
    ></div>

    <!-- Content that showing in the box -->
    <div class="flex-auto w-full">
      <div
        class="uppercase text-xs text-lightgray mb-1 font-bold"
        v-if="item.type"
      >
        <div class="inline" v-if="item.type == 'event'">
          <Icon type="History" />
        </div>
        <div class="inline" v-if="item.type == 'comment'">
          <Icon type="Comment" />
        </div>
        {{ item.type }}
        <div class="inline" v-if="item.type == 'comment'">
          by {{ item.author_name }}
        </div>
      </div>
      <h1 class="text-md font-thin text-sm mb-2">
        {{ formatDate(item.date) }}
      </h1>
      <h1 class="text-xl font-bold">{{ item.title.rendered }}</h1>
      <p contenteditable class="opacity-85 text-md">{{ item.text }}</p>
      <div class="absolute right-2 top-2" v-if="item.type == 'comment'">
        <button
          @click="deleteItem"
          type="button"
          class="rounded-sm text-white outline-none"
        >
          <Icon type="Delete" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiMixin from "@/mixins/APIMixin.js";
import Icon from "@/components/Icon.vue";

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
    formatDate(dateString) {
      //return dateString;
      return new Date(dateString.replace(" ", "T")).toLocaleString();
      //return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
    },
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
