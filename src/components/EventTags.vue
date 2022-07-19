<template>
  <ul class="event-tags">
    <!--li class="inline-block truncate" v-if="getLocation(event)">
      <div class="mr-2 p-1 px-2 rounded bg-orange text-white">
        <Icon type="Location" />
        {{ getLocation(event) }}
      </div>
    </li-->
    <li class="bg-purple" v-if="getEventType(event)">
      <Icon type="Group" />
      {{ getEventType(event) }}
    </li>

    <li class="bg-lightred" v-if="getDate(event)">
      <Icon type="Status" />
      {{ getDate(event) }}
    </li>
  </ul>
</template>

<script>
import eventMixin from "@/mixins/EventMixin.js";
import Icon from "@/components/Icon.vue";

export default {
  name: "EventTags",
  components: { Icon },

  props: {
    event: Object,
  },
  mixins: [eventMixin],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
  .event-tags{
    @apply text-xs text-white;
  }
  .event-tags li{
    @apply inline-block truncate mr-2 p-1 rounded;
  }
  .event-tags li svg{
    @apply w-3 h-3;
  }
</style>
