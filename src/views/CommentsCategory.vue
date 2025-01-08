<template>
  <PhoneUI
    title="Comments Category"
    :configUI="{
      hide_footer: true,
      maintitle_classes: 'hidden',
      stickytitle_classes: 'opacity-100',
    }"
  >
    <template v-slot:headericon>
      <router-link :to="{ name: 'Profile' }">
        <Icon type="Back" class="inline mt-1" />
      </router-link>
    </template>
    <template v-slot:headerright>
      <router-link
        :to="{
          name: 'NewCommentsCategory',
        }"
      >
        <Icon type="Plus" class="inline text-white" />
      </router-link>
    </template>
    <template v-slot:phonebody>
      <OrbitInpursuitPosts :params="params" :key="params.unique_id">
        <template v-slot:loadingAnimation>
          <SimpleList :total="10" />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
        <template v-slot:whenempty>
          <div class="text-xs text-red border border-red p-2 mt-4">
            No comment categories found
          </div>
        </template>
      </OrbitInpursuitPosts>
    </template>
  </PhoneUI>
</template>
<script>
import { ref } from "vue";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import SearchField from "@/components/SearchField.vue";
import BackButton from "@/templates/PhoneUI/BackButton.vue";
import MembersDropdown from "@/components/MembersDropdown.vue";
import SimpleList from "@/templates/Animation/SimpleList.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

export default {
  name: "CommentsCategory",
  components: {
    Icon,
    PhoneUI,
    BackButton,
    SearchField,
    MembersDropdown,
    SimpleList,
    PaginationLoaderAnimation,
  },

  setup() {
    const params = ref({
      unique_id: 1,
      per_page: 10,
      post_type: "comments-category",
      style: "ListWithTermName",
      pagination: 1,
    });

    return {
      params,
    };
  },
};
</script>
