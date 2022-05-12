<template>
  <ul class="text-sm dark:text-gray-400">
    <li class="inline-block truncate" v-if="getLocation(event)">
      <div class="mr-2 p-1 px-2 rounded bg-orange text-white">
        <Icon type="Location" />
        {{ getLocation(event) }}
      </div>
    </li>
    <li class="inline-block truncate" v-if="getEventType(event)">
      <div class="mr-2 p-1 px-2 rounded bg-purple text-white">
        <Icon type="Group" />
        {{ getEventType(event) }}
      </div>
    </li>

    <li class="inline-block truncate" v-if="getDate(event)">
      <div class="mr-2 p-1 px-2 rounded bg-lightred  text-white">
        <Icon type="Status" />
        {{ getDate(event) }}
      </div>
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
