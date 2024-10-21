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
              <li
                class="inline-block mx-2 mb-0.5 w-1 h-1 bg-gray rounded-full"
                v-if="user.roles && user.roles.length"
              ></li>
              <li
                class="inline-block capitalize"
                v-if="user.roles && user.roles.length"
                v-html="user.roles[0]"
              ></li>
            </ul>
          </div>
          <router-link
            v-if="isEditor({ user })"
            :to="{ name: 'EditTeamMember', query: { id: user.id } }"
          >
            <Icon type="Edit" class="inline" />
          </router-link>
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

export default {
  components: {
    Icon,
    PhoneUI,
    BackButton,
  },

  setup() {
    const users = ref([]);

    API.requestUsers().then((response) => (users.value = response.data));

    const joinedText = (datestring) => "Joined " + Util.timeAgo(datestring);

    const getUserEditLink = (user) => Util.getUserLink(user);

    const isEditor = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "editor" });

    return {
      users,
      isEditor,
      joinedText,
      getUserEditLink,
    };
  },
};
</script>
