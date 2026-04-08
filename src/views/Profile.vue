<template>
  <PhoneUI
    title="Profile"
    :configUI="{
      maintitle_classes: 'hidden',
      stickytitle_classes: 'opacity-100',
    }"
  >
    <template v-slot:headerright>
      <router-link :to="{ name: 'Logout' }" class="text-xs text-white">
        Logout
      </router-link>
    </template>
    <template v-slot:phonebody>
      <div
        class="flex items-center justify-between bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm mb-10"
      >
        <div class="">
          <h1 class="text-2xl" v-if="newTeamMember.name">
            {{ newTeamMember.name }}
          </h1>
          <ul>
            <li class="inline-block" v-if="newTeamMember.email">
              {{ newTeamMember.email }}
            </li>
            <li
              class="inline-block px-2"
              v-if="newTeamMember.roles && newTeamMember.email"
            >
              |
            </li>
            <li class="capitalize inline-block" v-if="newTeamMember.roles">
              {{ newTeamMember.roles.join(", ") }}
            </li>
          </ul>
        </div>
      </div>
      <div class="text-sm text-black font-semibold">MORE OPTIONS</div>

      <div
        class="text-base focus:outline-none sm:text-sm w-full bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm my-2 divide-y divide-lightgray"
        :key="newTeamMember.id"
      >
        <SettingItem
          label="History"
          icon="Comment"
          icon_classes="bg-darkorange"
          :route="{
            name: 'SingleTeamMember',
            params: { id: newTeamMember.id },
          }"
          v-if="newTeamMember.id"
        />

        <SettingItem
          label="Team"
          icon="Members"
          icon_classes="bg-orange"
          :route="{ name: 'Team' }"
          v-if="isAdmin({ user: newTeamMember })"
        />

        <SettingItem
          label="Analytics"
          icon="Chart"
          icon_classes="bg-purple"
          :route="{ name: 'Analytics' }"
        />
        <SettingItem
          label="Special Events"
          icon="SpecialEvent"
          icon_classes="bg-red"
          :route="{ name: 'SpecialEvents' }"
        />

        <div class="cursor-pointer py-4" @click="toggleNotifications" v-if="isSupported">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon type="Bell" class="h-7 w-7 p-1 rounded-md text-white bg-blue-500" />
              <span class="ml-3 block font-normal truncate text-lg" :class="{ 'opacity-50': isProcessing }">
                <template v-if="isProcessing">
                  {{ isSubscribed ? 'Disabling...' : 'Enabling...' }}
                </template>
                <template v-else-if="successMessage">
                  {{ successMessage }}
                </template>
                <template v-else>
                  {{ isSubscribed ? 'Disable Notifications' : 'Enable Notifications' }}
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isAdmin({ user: newTeamMember })">
        <div class="mt-8 text-sm text-black font-semibold">CATEGORIES</div>
        <div
          class="text-base focus:outline-none sm:text-sm w-full bg-lightergray rounded-lg py-2 px-4 drop-shadow-sm my-2 divide-y divide-lightgray"
          :key="newTeamMember.id"
        >
          <SettingItem
            v-for="(category, type) in categories"
            :label="category.label"
            :icon="category.icon"
            icon_classes="bg-gray"
            :route="{ name: 'Categories', params: { type: type } }"
          />
          <SettingItem
            label="Comment Types"
            icon="Comment"
            icon_classes="bg-gray"
            :route="{
              name: 'CommentsCategory',
            }"
          />
        </div>
      </div>
    </template>
  </PhoneUI>
</template>

<script>
import { ref, computed } from "vue";
import { useQuery } from "vue-query";
import API from "@/api";
import Util from "@/lib/Util";
import PhoneUI from "@/components/PhoneUI.vue";
import SettingItem from "@/components/SettingItem.vue";
import Icon from "@/components/Icon.vue";

import CategoryHelper from "@/lib/CategoryHelper";
import { usePushNotifications } from "@/lib/usePushNotifications";

export default {
  name: "Profile",
  components: {
    PhoneUI,
    SettingItem,
    Icon,
  },

  setup() {
    const getProfile = () => API.requestProfile();

    const { data } = useQuery("profileQuery", getProfile);

    const newTeamMember = computed(() =>
      data.value ? data.value.data : ref({ id: 0 })
    );

    const { categories } = CategoryHelper();

    const isAdmin = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "administrator" });

    const { isSubscribed, isProcessing, successMessage, isSupported, toggleNotifications } = usePushNotifications();

    return {
      categories,
      isAdmin,
      newTeamMember,
      isSubscribed,
      isProcessing,
      successMessage,
      isSupported,
      toggleNotifications,
    };
  },
};
</script>
