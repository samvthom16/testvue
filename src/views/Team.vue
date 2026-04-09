<template>
  <PhoneUI title="Team" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-2xl font-bold text-darkblack">Team</h1>
          <p class="text-sm text-darkgray mt-0.5">Manage admin and team member access.</p>
        </div>
        <router-link
          :to="{ name: 'NewTeamMember' }"
          class="hidden md:inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          <Icon type="Plus" class="w-4 h-4" />
          New Member
        </router-link>
      </div>

      <!-- Loading skeleton -->
      <TeamList v-if="loading && !users.length" />

      <!-- Team list -->
      <div v-if="users.length" class="divide-y divide-lightgray">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center gap-4 py-3"
        >
          <!-- Monogram avatar -->
          <div
            class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold select-none"
            :style="{ background: getGradient(user.name) }"
          >
            {{ getInitials(user.name) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <router-link
              :to="getUserEditLink(user)"
              class="font-semibold text-darkblack hover:text-purple transition-colors text-sm"
            >
              {{ user.name }}
            </router-link>
            <p class="text-xs text-darkgray truncate">{{ user.email }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-1">
              <span
                class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                :class="isAccountActive({ user }) ? 'bg-green/10 text-green' : 'bg-lightgray text-gray'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="isAccountActive({ user }) ? 'bg-green' : 'bg-gray'"></span>
                {{ isAccountActive({ user }) ? 'Active' : 'Inactive' }}
              </span>
              <span v-if="isAccountActive({ user })" class="text-xs text-gray capitalize">{{ user.roles[0] }}</span>
              <span class="text-xs text-gray" v-html="joinedText(user.registered_date)"></span>
            </div>
          </div>

          <!-- Actions -->
          <TeamMemberProfileActions :user="user" @accountStatus="fetchTeamMembers" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!loading" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-20 h-20 rounded-3xl bg-lightergray flex items-center justify-center mb-5">
          <Icon type="Members" class="w-9 h-9 text-lightgray" />
        </div>
        <p class="font-semibold text-darkblack text-lg">No team members</p>
        <p class="text-sm text-gray mt-2 max-w-xs">Add a team member to grant admin access.</p>
        <router-link
          :to="{ name: 'NewTeamMember' }"
          class="mt-6 inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          <Icon type="Plus" class="w-4 h-4" />
          Add First Member
        </router-link>
      </div>

      <!-- FAB (mobile only) -->
      <router-link
        :to="{ name: 'NewTeamMember' }"
        class="md:hidden fixed bottom-24 right-5 z-20 bg-purple text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-lightpurple transition-colors"
      >
        <Icon type="Plus" class="w-6 h-6" />
      </router-link>

    </template>
  </PhoneUI>
</template>

<script>
import { computed } from "vue";
import { useQuery } from "vue-query";
import API from "@/api";
import Util from "@/lib/Util";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import TeamMemberProfileActions from "@/components/TeamMemberProfileActions.vue";
import TeamList from "@/templates/Animation/TeamList.vue";
import { getGradient, getInitials } from "@/lib/Gradients";

export default {
  components: {
    Icon,
    PhoneUI,
    TeamMemberProfileActions,
    TeamList,
  },

  setup() {
    const { data, status, refetch } = useQuery(
      "teamMembers",
      () => API.requestUsers().then((r) => r.data),
    );

    const users   = computed(() => data.value ?? []);
    const loading = computed(() => status.value === "loading");

    const fetchTeamMembers = () => refetch.value();

    const joinedText     = (datestring) => "Joined " + Util.timeAgo(datestring);
    const getUserEditLink = (user)      => Util.getUserLink(user);
    const isAccountActive = ({ user })  => user.roles && user.roles.length;

    return {
      users,
      loading,
      joinedText,
      getUserEditLink,
      isAccountActive,
      fetchTeamMembers,
      getGradient,
      getInitials,
    };
  },
};
</script>
