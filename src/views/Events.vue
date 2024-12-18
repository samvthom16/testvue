<template>
  <PhoneUI title="Events">
    <template v-slot:phonebody>
      <EventsDropdown
        :totalItems="totalItems"
        @selectItem="selectDropdownItem"
      />

      <OrbitPosts
        :params="params"
        :key="params.unique_id"
        @totalChanged="totalChanged"
      >
        <template v-slot:loadingAnimation>
          <SimpleListAnimation />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
        <template v-slot:whenempty>
          <div class="text-xs text-red border border-red p-2 mt-4">
            No Events found for this query
          </div>
        </template>
      </OrbitPosts>
    </template>
    <template v-slot:headerright>
      <router-link :to="{ name: 'NewEvent' }">
        <Icon type="Plus" class="inline text-white" />
      </router-link>
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

import EventsDropdown from "@/components/EventsDropdown.vue";

import SimpleListAnimation from "@/templates/Animation/SimpleList.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

import { ref } from "vue";

export default {
  name: "Events",
  components: {
    EventsDropdown,
    PhoneUI,
    Icon,
    SearchField,
    SimpleListAnimation,
    PaginationLoaderAnimation,
  },
  setup() {
    const totalItems = ref(0);

    const params = ref({
      unique_id: 1,
      per_page: 10,
      post_type: "inpursuit-events",
      style: "EventList",
      //orderby     : 'title',
      //order       : 'asc',
      pagination: 1,
      search: "",
    });

    const onSearch = (searchText) => {
      params.value.search = searchText;
      params.value.unique_id++;
    };

    const selectDropdownItem = (data) => {
      params.value[data.name] = data.value;

      if (data.name == "orderby" && data.value == "title")
        params.value.order = "asc";
      if (data.name == "orderby" && data.value == "id")
        params.value.order = "desc";

      if (data.name == "event_type" && data.value == "all")
        params.value.event_type = "";

      if (data.name == "status" && data.value == "all")
        params.value.status = "publish,draft";

      params.value.unique_id++;
    };

    const totalChanged = (total) => (totalItems.value = total);

    return {
      params,
      onSearch,
      selectDropdownItem,
      totalChanged,
      totalItems,
    };
  },
};
</script>
