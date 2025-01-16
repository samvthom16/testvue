<template>
  <PhoneUI title="Comments">
    <template v-slot:phonebody>
      <div
        v-if="isLoadingDropdown"
        class="animate-pulse flex md:w-1/6 w-1/2 mb-5"
      >
        <div class="flex-1">
          <div class="border border-lightgray shadow rounded-xl">
            <div class="h-4 bg-lightgray rounded"></div>
          </div>
        </div>
      </div>
      <ul
        class="whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto"
        v-if="isAdmin({ user: userProfile })"
      >
        <li
          class="inline-block mr-2"
          v-for="(dropdownButton, field_name) in dropdownButtons"
          :key="dropdownButton"
        >
          <ButtonPopupModal
            :field_name="field_name"
            :field="dropdownButton"
            @selectItem="selectItem"
          />
        </li>
      </ul>

      <OrbitComments :params="params" :key="params.unique_id">
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total="10" />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>

        <template v-slot:whenempty>
          <div class="text-xs text-red border border-red p-2 mt-4">
            No Comments found for this query
          </div>
        </template>
      </OrbitComments>
    </template>

    <template v-slot:mainttitle_footer>
      <SearchField @searching="onSearch" />
    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import SearchField from "@/components/SearchField.vue";
import MembersDropdown from "@/components/MembersDropdown.vue";
import OrbitComments from "@/lib/OrbitComments.vue";

import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

import { computed, onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import ButtonPopupModal from "@/components/ButtonPopupModal.vue";
import API from "@/api";
import Util from "@/lib/Util";
import { useQuery } from "vue-query";
import store from "@/store";

export default {
  name: "Comments",
  components: {
    PhoneUI,
    Icon,
    SearchField,
    MembersDropdown,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
    OrbitComments,
    ButtonPopupModal,
  },

  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const team_member = ref(route.query.team_member || "all");
    const isLoadingDropdown = ref(true);

    const params = ref({
      unique_id: 1,
      per_page: 10,
      style: "UsersListWithComment",
      pagination: 1,
      search: "",
      user_id: team_member.value === "all" ? "" : team_member.value,
    });

    const dropdownButtons = ref({
      member: {
        popupTitle: "Team Member",
        badgeText: "",
        items: {
          all: "All Team Members",
        },
        // selected: team_member.value,
      },
    });

    const onSearch = (searchText) => {
      params.value.search = searchText;
      params.value.unique_id++;
    };

    const getProfile = () => API.requestProfile();

    const { data } = useQuery("profileQuery", getProfile, {
      onSuccess: () => {
        isLoadingDropdown.value = false;
      },
      onError: () => {
        isLoadingDropdown.value = false;
      },
    });

    const userProfile = computed(() =>
      data.value ? data.value.data : ref({ id: 0 })
    );

    const isAdmin = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "administrator" });

    const selectItem = (data) => {
      if (data.value) {
        if (data.value === "all") {
          params.value = {
            ...params.value,
            user_id: "",
            unique_id: params.value.unique_id + 1,
          };
        } else {
          params.value = {
            ...params.value,
            user_id: data.value,
            unique_id: params.value.unique_id + 1,
          };
        }
        router.push({ path: "/comments", query: { team_member: data.value } });
        dropdownButtons.value[data.name].selected = data.value;
        context.emit("selectItem", data);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await API.requestUsers();
        const users = response.data;

        const userItems = {};
        users.map((user) => {
          userItems[user.id] = user.name;
        });

        dropdownButtons.value.member = {
          popupTitle: "Team Member",
          badgeText: "",
          items: {
            all: "All Team Members",
            ...userItems,
          },
          selected: team_member.value,
        };
      } catch (error) {
        store.commit(
          "notifyError",
          "Something went wrong, please try again later!"
        );
      }
    };

    watchEffect(() => {
      if (isAdmin({ user: userProfile.value })) {
        fetchUsers();
      }
    });

    return {
      params,
      onSearch,
      dropdownButtons,
      selectItem,
      isAdmin,
      userProfile,
      isLoadingDropdown,
    };
  },
};
</script>
