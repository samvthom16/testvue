<template>
  <PhoneUI title="Members">

    <template v-slot:headerright>
      <router-link :to="{ name: 'NewMember' }">
        <Icon type="Plus" class="inline text-white" />
      </router-link>
    </template>

    <template v-slot:mainttitle_footer>
      <SearchField @searching="onSearch" />
    </template>

    <template v-slot:phonebody>

      <!-- Desktop stats bar -->
      <div class="hidden md:flex items-center justify-between mb-7 pb-6 border-b border-lightgray">
        <div class="flex items-center gap-8">
          <div>
            <p class="text-4xl font-bold text-darkblack tracking-tight">{{ totalItems || '—' }}</p>
            <p class="text-sm text-darkgray mt-1">Total members</p>
          </div>
          <div class="h-10 w-px bg-lightgray"></div>
          <div>
            <p class="text-sm font-medium text-darkblack">{{ lastSync }}</p>
            <p class="text-xs text-gray mt-0.5">Last synced</p>
          </div>
        </div>
        <router-link
          :to="{ name: 'NewMember' }"
          class="flex items-center gap-2 bg-purple text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          <Icon type="Plus" class="w-4 h-4" />
          New Member
        </router-link>
      </div>

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
    const now = new Date();
    const lastSync = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return { ...MembersHelper(), lastSync };
  },
};
</script>
