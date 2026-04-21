<template>
  <div class="relative mb-2">
    <ul class="whitespace-nowrap pb-4 overflow-x-auto scrollbar-hide">
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
    <!-- Right fade -->
    <div class="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent"></div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<script>
import ButtonPopupModal from "@/components/ButtonPopupModal.vue";

import { ref } from "vue";

import FiltersHelper from "@/lib/FiltersHelper.js";

export default {
  props: {
    totalItems: Number,
  },
  components: {
    ButtonPopupModal,
  },
  watch: {
    totalItems() {
      this.dropdownButtons.status.badgeText = this.totalItems;
    },
  },
  setup(props, context) {
    const dropdownButtons = ref({
      status: {
        popupTitle: "View Members",
        badgeText: props.totalItems,
        items: {
          all: "All Members",
          publish: "Active Members",
          draft: "Archived Members",
        },
        selected: "publish",
      },
      orderby: {
        popupTitle: "Sort By",
        badgeText: "",
        items: {
          title: "Alphabetical",
          id: "Newest Members",
        },
        selected: "title",
      },
      member_status: {
        popupTitle: "Profile Type",
        badgeText: "",
        items: {
          all: "All Profile Types",
        },
        selected: "all",
      },
      group: {
        popupTitle: "Groups",
        badgeText: "",
        items: {
          all: "All Groups",
        },
        selected: "all",
      },
      gender: {
        popupTitle: "Gender",
        badgeText: "",
        items: {
          all: "All Genders",
        },
        selected: "all",
      },
      location: {
        popupTitle: "Location",
        badgeText: "",
        items: {
          all: "All Locations",
        },
        selected: "all",
      },
      profession: {
        popupTitle: "Profession",
        badgeText: "",
        items: {
          all: "All Professions",
        },
        selected: "all",
      },
    });

    const { syncTabWithUrl, selectItem } = FiltersHelper(
      dropdownButtons,
      context,
      ["member_status", "group", "gender", "location", "profession"]
    );

    return {
      dropdownButtons,
      selectItem,
    };
  },
};
</script>
