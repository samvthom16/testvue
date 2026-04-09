<template>
  <PhoneUI :title="getCategoryName()" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="mb-5">
        <router-link
          :to="{ name: 'Settings' }"
          class="inline-flex items-center gap-1.5 text-darkgray hover:text-darkblack transition-colors mb-4"
        >
          <Icon type="Back" class="w-5 h-5" />
          <span class="text-sm font-medium">Settings</span>
        </router-link>
        <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-darkblack">{{ getCategoryName() }}</h1>
          <p class="text-sm text-darkgray mt-0.5">Manage and organise your {{ getCategoryName().toLowerCase() }}.</p>
        </div>
        <router-link
          :to="{ name: 'NewCategory', params: { type: getType() } }"
          class="hidden md:inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          <Icon type="Plus" class="w-4 h-4" />
          New {{ getCategorySingular() }}
        </router-link>
        </div>
      </div>

      <!-- Category list -->
      <OrbitPosts :params="params" :key="params.unique_id">
        <template v-slot:loadingAnimation>
          <ListWithImageAnimation :total="10" />
        </template>

        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>

        <template v-slot:whenempty>
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 rounded-3xl bg-lightergray flex items-center justify-center mb-5">
              <Icon :type="getCategoryIcon()" class="w-9 h-9 text-lightgray" />
            </div>
            <p class="font-semibold text-darkblack text-lg">No {{ getCategoryName().toLowerCase() }} found</p>
            <p class="text-sm text-gray mt-2 max-w-xs">Add your first {{ getCategorySingular().toLowerCase() }} to get started.</p>
            <router-link
              :to="{ name: 'NewCategory', params: { type: getType() } }"
              class="mt-6 inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
            >
              <Icon type="Plus" class="w-4 h-4" />
              Add First {{ getCategorySingular() }}
            </router-link>
          </div>
        </template>
      </OrbitPosts>

      <!-- FAB (mobile only) -->
      <router-link
        :to="{ name: 'NewCategory', params: { type: getType() } }"
        class="md:hidden fixed bottom-24 right-5 z-20 bg-purple text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-lightpurple transition-colors"
      >
        <Icon type="Plus" class="w-6 h-6" />
      </router-link>

    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from '@/components/PhoneUI.vue'
import Icon from '@/components/Icon.vue'
import ListWithImageAnimation from '@/templates/Animation/ListWithImage.vue'
import PaginationLoaderAnimation from '@/templates/Animation/PaginationLoader.vue'
import CategoryHelper from '@/lib/CategoryHelper';
import { ref } from 'vue';

export default {
  components: {
    PhoneUI,
    Icon,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
  },

  setup() {
    const { categories, getWPType, getType } = CategoryHelper();

    const getCategoryName = () => categories.value[getType()]?.label ?? 'Categories';
    const getCategoryIcon = () => categories.value[getType()]?.icon ?? 'Plus';

    const singularMap = {
      'groups': 'Group',
      'event-types': 'Event Type',
      'professions': 'Profession',
      'genders': 'Gender',
      'locations': 'Location',
      'status': 'Status',
    };
    const getCategorySingular = () => singularMap[getType()] ?? getCategoryName();

    const params = ref({
      unique_id:  1,
      per_page:   10,
      post_type:  getWPType(),
      style:      'ListWithTermName',
      pagination: 1,
      search:     '',
    });

    return {
      params,
      getCategoryName,
      getCategoryIcon,
      getCategorySingular,
      getType,
    };
  },
};
</script>
