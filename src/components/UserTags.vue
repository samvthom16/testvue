<template>
  <ul class="text-sm dark:text-gray-400">
    <li class="inline-block truncate" v-if="getLocation(user)">
      <div class="mr-2 p-1 px-2 rounded bg-orange text-white">
        <Icon type="Location" />
        {{ getLocation(user) }}
      </div>
    </li>
    <li class="inline-block truncate" v-if="getGender(user)">
      <div class="p-1 px-2 rounded bg-lightpurple text-white mr-2">
        <Icon type="Gender" />
        {{ getGender(user) }}
      </div>
    </li>
    <li class="inline-block truncate" v-if="getGroup(user)">
      <div class="mr-2 p-1 px-2 rounded bg-lightred text-white">
        <Icon type="Group" />
        {{ getGroup(user) }}
      </div>
    </li>
    <li class="inline-block truncate" v-if="getProfession(user)">
      <div class="mr-2 p-1 px-2 rounded bg-gray text-white">
        <Icon type="Profession" />
        {{ getProfession(user) }}
      </div>
    </li>
    <li class="inline-block truncate" v-if="getStatus(user)">
      <div class="mr-2 p-1 px-2 rounded bg-gray text-white">
        <Icon type="Status" />
        {{ getStatus(user) }}
      </div>
    </li>
  </ul>
</template>

<script>
import userMixin from "@/mixins/UserMixin.js";
import Icon from "@/components/Icon.vue";

export default {
  name: "UserTags",
  components: { Icon },
  props: {
    user: Object,
  },
  mixins: [userMixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
