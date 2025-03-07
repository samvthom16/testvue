<template>
  <PhoneUI title="Comments">
    <template v-slot:phonebody>
      <div v-if="isLoadingDropdown" class="flex flex-wrap">
        <div
          v-for="(dropdownButton, index) in dropdownButtons"
          :key="index"
          class="animate-pulse flex md:w-1/6 w-1/3 mb-5 mr-3"
        >
          <div class="flex-1">
            <div class="border border-lightgray shadow rounded-xl">
              <div class="h-5 bg-lightgray rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <ul
        class="whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto"
        v-if="isAdmin({ user: userProfile }) && !isLoadingDropdown"
      >
        <li
          class="inline-block mr-2"
          v-for="(dropdownButton, field_name) in dropdownButtons"
          :key="dropdownButton"
        >
          <ButtonPopupModal
            :field_name="field_name"
            :field="dropdownButton"
            @selectItem="selectDropdownItem"
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
import SearchField from "@/components/SearchField.vue";
import OrbitComments from "@/lib/OrbitComments.vue";

import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import ButtonPopupModal from "@/components/ButtonPopupModal.vue";
import API from "@/api";
import Util from "@/lib/Util";
import { useQuery } from "vue-query";
import store from "@/store";
import filtershelper from "@/lib/FiltersHelper";

export default {
  name: "Comments",
  components: {
    PhoneUI,
    SearchField,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
    OrbitComments,
    ButtonPopupModal,
  },

  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const team_member = ref(route.query.team_member || "all");
    const comment_type = ref(route.query.comment_type || "all");
    const isLoadingDropdown = ref(true);

    const params = ref({
      unique_id: 1,
      per_page: 10,
      style: "UsersListWithComment",
      pagination: 1,
      search: "",
      user_id: team_member.value === "all" ? "" : team_member.value,
      comments_category: comment_type.value === "all" ? "" : comment_type.value,
    });

    const dropdownButtons = ref({
      member: {
        popupTitle: "Team Member",
        badgeText: "",
        items: {
          all: "All Team Members",
        },
        selected: team_member.value,
      },
      comments_category: {
        popupTitle: "Comment Types",
        badgeText: "",
        items: {
          all: "All Comment Types",
        },
        selected: comment_type.value,
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

    const selectDropdownItem = (data) => {
      const dropdownMapping = {
        member: { queryParam: "team_member", paramName: "user_id" },
        comments_category: {
          queryParam: "comment_type",
          paramName: "comments_category",
        },
      };

      const mapping = dropdownMapping[data.name];

      const { queryParam, paramName } = mapping;
      const currentQuery = { ...router.currentRoute.value.query };

      const isAllSelected = data.value === "all";

      params.value = {
        ...params.value,
        [paramName]: isAllSelected ? "" : data.value,
        unique_id: params.value.unique_id + 1,
      };

      router.push({
        path: "/comments",
        query: {
          ...currentQuery,
          [queryParam]: isAllSelected ? "all" : data.value,
        },
      });

      dropdownButtons.value[data.name].selected = data.value;
      context.emit("selectDropdownItem", data);
    };

    const { selectItem } = filtershelper(dropdownButtons, context, [
      "comments_category",
    ]);

    const fetchUsers = async () => {
      try {
        const response = await API.requestUsers();
        const users = response.data;

        const userItems = {};
        users.map((user) => {
          userItems[user.id] = user.name;
        });

        dropdownButtons.value.member.items = {
          ...dropdownButtons.value.member.items,
          ...userItems,
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
      selectDropdownItem,
    };
  },
};
</script>
