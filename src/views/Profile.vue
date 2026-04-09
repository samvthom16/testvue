<template>
  <PhoneUI title="Profile" :configUI="{ hide_desktop_header: true, body_classes: '!p-0' }">
    <template v-slot:phonebody>

      <!-- ── HERO ───────────────────────────────────────────── -->
      <div class="bg-white px-5 md:px-8 pt-5 pb-8 border-b border-lightgray">

        <!-- Avatar + identity -->
        <div class="flex items-center gap-5">
          <div
            class="shrink-0 w-20 h-20 rounded-full ring-4 ring-lightgray flex items-center justify-center"
            :style="{ background: monogramBg }"
          >
            <span class="text-2xl font-bold text-white select-none tracking-wide">{{ monogram }}</span>
          </div>
          <div>
            <h1
              class="text-2xl font-bold text-darkblack tracking-tight leading-tight"
              v-if="newTeamMember.name"
            >
              {{ newTeamMember.name }}
            </h1>
            <p class="text-sm text-darkgray mt-0.5" v-if="newTeamMember.email">
              {{ newTeamMember.email }}
            </p>
            <div
              class="flex flex-wrap items-center gap-2 mt-2"
              v-if="newTeamMember.roles && newTeamMember.roles.length"
            >
              <span
                v-for="role in newTeamMember.roles"
                :key="role"
                class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-lightergray text-darkblack capitalize"
              >
                {{ role }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── BODY ───────────────────────────────────────────── -->
      <div class="px-4 md:px-8 py-6 space-y-6">

        <!-- Notifications -->
        <div v-if="isSupported">
          <p class="text-xs font-semibold text-gray uppercase tracking-widest mb-3">Notifications</p>
          <div class="bg-white border border-lightgray rounded-2xl overflow-hidden">
            <button
              @click="toggleNotifications"
              class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-lightergray transition-colors"
              :class="{ 'opacity-50': isProcessing }"
            >
              <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-lightblue">
                <Icon type="Bell" class="w-4 h-4 text-white" />
              </div>
              <span class="flex-1 text-left text-sm font-medium text-darkblack">
                <template v-if="isProcessing">{{ isSubscribed ? 'Disabling...' : 'Enabling...' }}</template>
                <template v-else-if="successMessage">{{ successMessage }}</template>
                <template v-else>{{ isSubscribed ? 'Disable Notifications' : 'Enable Notifications' }}</template>
              </span>
            </button>
          </div>
        </div>

        <!-- Logout -->
        <div>
          <p class="text-xs font-semibold text-gray uppercase tracking-widest mb-3">Account</p>
          <div class="bg-white border border-lightgray rounded-2xl overflow-hidden">
            <router-link
              :to="{ name: 'Logout' }"
              class="flex items-center gap-3 px-4 py-3.5 hover:bg-lightergray transition-colors"
            >
              <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-red">
                <Icon type="Profile" class="w-4 h-4 text-white" />
              </div>
              <span class="flex-1 text-sm font-medium text-darkblack">Logout</span>
            </router-link>
          </div>
        </div>

      </div>

    </template>
  </PhoneUI>
</template>

<script>
import { ref, computed } from "vue";
import { useQuery } from "vue-query";
import API from "@/api";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import { usePushNotifications } from "@/lib/usePushNotifications";
import { getGradient, getInitials } from "@/lib/Gradients";

export default {
  name: "Profile",
  components: {
    PhoneUI,
    Icon,
  },

  setup() {
    const getProfile = () => API.requestProfile();
    const { data } = useQuery("profileQuery", getProfile);

    const newTeamMember = computed(() =>
      data.value ? data.value.data : ref({ id: 0 })
    );

    const monogram = computed(() => {
      const name = newTeamMember.value?.name;
      return name ? getInitials(name) : "?";
    });

    const monogramBg = computed(() =>
      getGradient(newTeamMember.value?.name || null)
    );

    const { isSubscribed, isProcessing, successMessage, isSupported, toggleNotifications } =
      usePushNotifications();

    return {
      newTeamMember,
      monogram,
      monogramBg,
      isSubscribed,
      isProcessing,
      successMessage,
      isSupported,
      toggleNotifications,
    };
  },
};
</script>
