<template>
  <PhoneUI
    title="Team"
    :configUI="{
      hide_footer: true,
      maintitle_classes: 'hidden',
      stickytitle_classes: 'opacity-100',
    }"
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute="{ name: 'Profile' }" />
    </template>
    <template v-slot:headerright>
      <router-link :to="{ name: 'NewTeamMember' }">
        <Icon type="Plus" class="inline text-white" />
      </router-link>
    </template>
    <template v-slot:phonebody>
      <ul role="list" class="divide-y divide-lightgray">
        <li
          class="py-3 sm:py-4 flex items-center justify-between"
          v-for="user in users"
          :key="user.id"
        >
          <div>
            <router-link class="font-bold text-xl" :to="getUserEditLink(user)">
              {{ user.name }}
            </router-link>

            <p class="text-black">{{ user.email }}</p>

            <ul class="text-xs text-gray">
              <li
                class="inline-block"
                v-html="joinedText(user.registered_date)"
              ></li>
              <template v-if="isAccountActive({ user })">
                <li
                  class="inline-block mx-2 mb-0.5 w-1 h-1 bg-gray rounded-full"
                ></li>
                <li class="inline-block capitalize" v-html="user.roles[0]"></li>
              </template>
            </ul>
            <span
              :class="[
                'account-status',
                isAccountActive({ user }) ? 'bg-purple' : 'bg-red',
              ]"
            >
              {{ isAccountActive({ user }) ? "Active" : "Inactive" }}
            </span>
          </div>
          <TeamMemberProfileActions
            :user="user"
            @accountStatus="fetchTeamMembers"
          />
        </li>
      </ul>
    </template>
  </PhoneUI>
</template>

<script>
import { ref } from "vue";
import API from "@/api";
import Util from "@/lib/Util";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import BackButton from "@/templates/PhoneUI/BackButton.vue";
import TeamMemberProfileActions from "@/components/TeamMemberProfileActions.vue";

export default {
  components: {
    Icon,
    PhoneUI,
    BackButton,
    TeamMemberProfileActions,
  },

  setup() {
    const users = ref([]);

    const fetchTeamMembers = () =>
      API.requestUsers().then((response) => (users.value = response.data));

    fetchTeamMembers();

    const joinedText = (datestring) => "Joined " + Util.timeAgo(datestring);

    const getUserEditLink = (user) => Util.getUserLink(user);

    const isAccountActive = ({ user }) => user.roles && user.roles.length;

    return {
      users,
      joinedText,
      getUserEditLink,
      isAccountActive,
      fetchTeamMembers,
    };
  },
};
</script>
<style scoped>
.account-status {
  @apply inline-block rounded-full py-1 px-2 mt-2 text-xs text-white font-medium;
}
</style>
