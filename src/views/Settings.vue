<template>
  <PhoneUI title="Settings" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-2xl font-bold text-darkblack">Settings</h1>
          <p class="text-sm text-darkgray mt-0.5">Manage categories and taxonomy options.</p>
        </div>
      </div>

      <!-- Categories -->
      <div class="space-y-4">
        <div class="bg-white border border-lightgray rounded-2xl divide-y divide-lightgray overflow-hidden">

          <router-link
            v-for="(category, type) in categories"
            :key="type"
            :to="{ name: 'Categories', params: { type: type } }"
            class="flex items-center gap-3 px-4 py-3.5 hover:bg-lightergray transition-colors"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-darkgray">
              <Icon :type="category.icon" class="w-4 h-4 text-white" />
            </div>
            <span class="flex-1 text-sm font-medium text-darkblack">{{ category.label }}</span>
            <Icon type="Right-Arrow" class="w-4 h-4 text-gray" />
          </router-link>

          <router-link
            :to="{ name: 'CommentsCategory' }"
            class="flex items-center gap-3 px-4 py-3.5 hover:bg-lightergray transition-colors"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-darkgray">
              <Icon type="Comment" class="w-4 h-4 text-white" />
            </div>
            <span class="flex-1 text-sm font-medium text-darkblack">Comment Types</span>
            <Icon type="Right-Arrow" class="w-4 h-4 text-gray" />
          </router-link>

        </div>
      </div>

    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import CategoryHelper from "@/lib/CategoryHelper";

export default {
  name: "Settings",
  components: { PhoneUI, Icon },
  setup() {
    const { categories } = CategoryHelper();
    return { categories };
  },
};
</script>
