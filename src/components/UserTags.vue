<template>
  <ul class="user-tags">
    <li class="bg-orange" v-if="getLocation(user)">
      <Icon type="Location" />
      {{ getLocation(user) }}
    </li>
    <li class="bg-lightpurple" v-if="getGender(user)">
      <Icon type="Gender" />
      {{ getGender(user) }}
    </li>
    <li class="bg-lightred" v-if="getGroup(user)">
      <Icon type="Group" />
      {{ getGroup(user) }}
    </li>
    <li class="bg-gray" v-if="getProfession(user)">
      <Icon type="Profession" />
      {{ getProfession(user) }}
    </li>
    <li class="bg-gray" v-if="getStatus(user)">
      <Icon type="Status" />
      {{ getStatus(user) }}
    </li>
  </ul>
</template>

<script>
import userMixin from "@/mixins/UserMixin";
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

<style scoped>
  .user-tags{
    @apply text-xs text-white;
  }
  .user-tags li{
    @apply inline-block truncate mr-2 p-1 rounded;
  }
  .user-tags li svg{
    @apply w-3 h-3;
  }
</style>
