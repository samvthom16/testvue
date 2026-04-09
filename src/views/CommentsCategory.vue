<template>
  <PhoneUI title="Comment Types" :configUI="{ hide_desktop_header: true }">
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
            <h1 class="text-2xl font-bold text-darkblack">Comment Types</h1>
            <p class="text-sm text-darkgray mt-0.5">Manage categories for member comments and notes.</p>
          </div>
          <router-link
            :to="{ name: 'NewCommentsCategory' }"
            class="hidden md:inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
          >
            <Icon type="Plus" class="w-4 h-4" />
            New Type
          </router-link>
        </div>
      </div>

      <!-- Comment types list -->
      <OrbitPosts apiType="inpursuit" :params="params" :key="params.unique_id">
        <template v-slot:loadingAnimation>
          <SimpleList :total="10" />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
        <template v-slot:whenempty>
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 rounded-3xl bg-lightergray flex items-center justify-center mb-5">
              <Icon type="Comments" class="w-9 h-9 text-lightgray" />
            </div>
            <p class="font-semibold text-darkblack text-lg">No comment types found</p>
            <p class="text-sm text-gray mt-2 max-w-xs">Add your first comment type to start categorising member notes.</p>
            <router-link
              :to="{ name: 'NewCommentsCategory' }"
              class="mt-6 inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
            >
              <Icon type="Plus" class="w-4 h-4" />
              Add First Type
            </router-link>
          </div>
        </template>
      </OrbitPosts>

      <!-- FAB (mobile only) -->
      <router-link
        :to="{ name: 'NewCommentsCategory' }"
        class="md:hidden fixed bottom-24 right-5 z-20 bg-purple text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-lightpurple transition-colors"
      >
        <Icon type="Plus" class="w-6 h-6" />
      </router-link>

    </template>
  </PhoneUI>
</template>

<script>
import { ref } from "vue";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import SimpleList from "@/templates/Animation/SimpleList.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

export default {
  name: "CommentsCategory",
  components: {
    Icon,
    PhoneUI,
    SimpleList,
    PaginationLoaderAnimation,
  },

  setup() {
    const params = ref({
      unique_id:  1,
      per_page:   10,
      post_type:  "comments-category",
      style:      "ListWithTermName",
      pagination: 1,
    });

    return {
      params,
    };
  },
};
</script>
