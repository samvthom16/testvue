<template>
  <PhoneUI title="Events" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-2xl font-bold text-darkblack">Events</h1>
          <p class="text-sm text-darkgray mt-0.5">Track attendance and manage your events.</p>
        </div>
        <router-link
          :to="{ name: 'NewEvent' }"
          class="hidden md:inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          <Icon type="Plus" class="w-4 h-4" />
          New Event
        </router-link>
      </div>

      <SearchField @searching="onSearch" class="mb-4" />

      <!-- Filters -->
      <EventsDropdown :totalItems="totalItems" @selectItem="selectDropdownItem" />

      <!-- Event data -->
      <OrbitPosts
        :params="{ ...params, style: 'EventsGrid' }"
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
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 rounded-3xl bg-lightergray flex items-center justify-center mb-5">
              <Icon type="Event" class="w-9 h-9 text-lightgray" />
            </div>
            <p class="font-semibold text-darkblack text-lg">No events found</p>
            <p class="text-sm text-gray mt-2 max-w-xs">
              Try adjusting your search or filters, or create your first event.
            </p>
            <router-link
              :to="{ name: 'NewEvent' }"
              class="mt-6 inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
            >
              <Icon type="Plus" class="w-4 h-4" />
              Add First Event
            </router-link>
          </div>
        </template>
      </OrbitPosts>

      <!-- FAB (mobile only) -->
      <router-link
        :to="{ name: 'NewEvent' }"
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
import EventsDropdown from "@/components/EventsDropdown.vue";
import SimpleListAnimation from "@/templates/Animation/SimpleList.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";
import { ref } from "vue";

export default {
  name: "Events",
  components: {
    PhoneUI,
    Icon,
    SearchField,
    EventsDropdown,
    SimpleListAnimation,
    PaginationLoaderAnimation,
  },
  setup() {
    const totalItems = ref(0);

    const currentYear = new Date().getFullYear();

    const params = ref({
      unique_id: 1,
      per_page: 10,
      post_type: "inpursuit-events",
      pagination: 1,
      search: "",
      after:  `${currentYear - 1}-12-31T23:59:59`,
      before: `${currentYear}-12-31T23:59:59`,
    });

    const onSearch = (searchText) => {
      params.value.search = searchText;
      params.value.unique_id++;
    };

    const selectDropdownItem = (data) => {
      if (data.name === "year") {
        if (data.value) {
          params.value.after  = `${data.value - 1}-12-31T23:59:59`;
          params.value.before = `${data.value}-12-31T23:59:59`;
        } else {
          delete params.value.after;
          delete params.value.before;
        }
      } else {
        params.value[data.name] = data.value;
        if (data.name === "orderby" && data.value === "title") params.value.order = "asc";
        if (data.name === "orderby" && data.value === "id")    params.value.order = "desc";
        if (data.name === "event_type" && data.value === "all") params.value.event_type = "";
        if (data.name === "status" && data.value === "all")     params.value.status = "publish,draft";
      }

      params.value.unique_id++;
    };

    const totalChanged = (total) => (totalItems.value = total);

    return { params, onSearch, selectDropdownItem, totalChanged, totalItems };
  },
};
</script>
