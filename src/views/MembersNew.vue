<template>
  <PhoneUI title="Members" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-2xl font-bold text-darkblack">Members</h1>
          <p class="text-sm text-darkgray mt-0.5">Manage and review your community members.</p>
        </div>
        <router-link
          :to="{ name: 'NewMember' }"
          class="hidden md:inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          <Icon type="Plus" class="w-4 h-4" />
          New Member
        </router-link>
      </div>

      <SearchField @searching="onSearch" class="mb-4" />

      <!-- Filters -->
      <MembersDropdown :totalItems="totalItems" @selectItem="selectDropdownItem" />

      <!-- Member data -->
      <OrbitPosts
        :params="{ ...params, style: 'MembersGrid' }"
        :key="params.unique_id"
        @totalChanged="totalChanged"
      >
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total="8" />
        </template>

        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>

        <template v-slot:whenempty>
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 rounded-3xl bg-lightergray flex items-center justify-center mb-5">
              <Icon type="Members" class="w-9 h-9 text-lightgray" />
            </div>
            <p class="font-semibold text-darkblack text-lg">No members found</p>
            <p class="text-sm text-gray mt-2 max-w-xs">
              Try adjusting your search or filters, or add your first member.
            </p>
            <router-link
              :to="{ name: 'NewMember' }"
              class="mt-6 inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
            >
              <Icon type="Plus" class="w-4 h-4" />
              Add First Member
            </router-link>
          </div>
        </template>
      </OrbitPosts>

      <!-- FAB (mobile only) -->
      <router-link
        :to="{ name: 'NewMember' }"
        class="md:hidden fixed bottom-24 right-5 z-20 bg-purple text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-lightpurple transition-colors"
      >
        <Icon type="Plus" class="w-6 h-6" />
      </router-link>

    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import SearchField from "@/components/SearchField.vue";
import MembersDropdown from "@/components/MembersDropdown.vue";
import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";
import MembersHelper from "@/lib/MembersHelper";

export default {
  name: "MembersNew",
  components: {
    PhoneUI,
    Icon,
    SearchField,
    MembersDropdown,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
  },
  setup() {
    return { ...MembersHelper() };
  },
};
</script>
