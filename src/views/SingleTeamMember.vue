<template>
  <PhoneUI :configUI="{ hide_desktop_header: true, body_classes: '!p-0' }">
    <template v-slot:phonebody>

      <!-- ── HERO ──────────────────────────────────────────── -->
      <div class="bg-white px-5 md:px-8 pt-5 pb-10 border-b border-lightgray">

        <!-- Top row: back button -->
        <div class="flex items-center justify-between mb-6">
          <button
            @click="$router.back()"
            class="flex items-center gap-1.5 text-darkgray hover:text-darkblack transition-colors"
          >
            <Icon type="Back" class="w-5 h-5" />
            <span class="text-sm font-medium">Back</span>
          </button>
          <router-link
            :to="{ name: 'EditTeamMember', query: { id: member.id } }"
            v-if="member.id"
            class="p-2 rounded-full hover:bg-lightergray transition-colors text-darkgray hover:text-darkblack"
          >
            <Icon type="Edit" class="w-5 h-5" />
          </router-link>
        </div>

        <!-- Identity -->
        <div class="flex items-center gap-5">
          <div
            class="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-lightgray flex items-center justify-center text-white text-2xl font-bold select-none tracking-wide"
            :style="{ background: getGradient(member.name) }"
          >
            {{ getInitials(member.name) }}
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-darkblack tracking-tight leading-tight">
              {{ member.name || 'Team Member' }}
            </h1>
            <p v-if="member.email" class="text-sm text-darkgray mt-0.5">{{ member.email }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <span
                class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                :class="isActive ? 'bg-green/10 text-green' : 'bg-lightergray text-gray'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="isActive ? 'bg-green' : 'bg-gray'"></span>
                {{ isActive ? 'Active' : 'Inactive' }}
              </span>
              <span v-if="isActive && member.roles && member.roles[0]" class="text-xs text-darkgray font-medium capitalize">
                {{ member.roles[0] }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── BODY ───────────────────────────────────────────── -->
      <div class="px-4 md:px-8 py-5">

        <h2 class="text-sm font-semibold text-darkgray uppercase tracking-wider mb-4">Comments</h2>

        <OrbitComments :params="params" :key="params.unique_id">
          <template v-slot:loadingAnimation>
            <ListWithImageAnimation :total="10" />
          </template>
          <template v-slot:nextPageAnimation>
            <PaginationLoaderAnimation />
          </template>
          <template v-slot:whenempty>
            <div class="flex flex-col items-center justify-center py-16 text-center">
              <div class="w-16 h-16 rounded-3xl bg-lightergray flex items-center justify-center mb-4">
                <Icon type="Comment" class="w-7 h-7 text-lightgray" />
              </div>
              <p class="font-semibold text-darkblack">No comments yet</p>
              <p class="text-sm text-gray mt-1">Comments added for this team member will appear here.</p>
            </div>
          </template>
        </OrbitComments>

      </div>

    </template>
  </PhoneUI>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "vue-query";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import OrbitComments from "@/lib/OrbitComments.vue";
import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";
import API from "@/api";
import store from "@/store";
import { getGradient, getInitials } from "@/lib/Gradients";

export default {
  name: "SingleTeamMember",
  components: {
    PhoneUI,
    Icon,
    OrbitComments,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
  },
  setup() {
    const route = useRoute();

    const setTeamMember = (teamMember) => {
      const newTeamMember = ref(teamMember);
      store.commit("setTeamMember", newTeamMember);
    };

    if (route.params && route.params.teamMember) {
      setTeamMember(JSON.parse(route.params.teamMember));
    } else {
      const getTeamMember = () => API.requestUsers({ id: route.params.id });
      const { data } = useQuery("teamMemberQuery" + route.params.id, getTeamMember);
      watch(data, (data) => setTeamMember(data.data));
    }

    const member = computed(() => store.state.teamMember || {});
    const isActive = computed(() => member.value.roles && member.value.roles.length);

    const params = ref({
      unique_id: 1,
      per_page: 10,
      style: "UsersListWithComment",
      pagination: 1,
      user_id: route.params.id,
    });

    return {
      member,
      isActive,
      params,
      getGradient,
      getInitials,
    };
  },
};
</script>
