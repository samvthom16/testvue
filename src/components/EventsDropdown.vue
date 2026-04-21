<template>
  <ul class='whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto'>
    <li class='inline-block mr-2' v-for='dropdownButton,field_name in dropdownButtons' :key='dropdownButton'>
      <ButtonPopupModal :field_name='field_name' :field='dropdownButton' @selectItem='selectItem' />
    </li>

    <!-- Year filter -->
    <li class='inline-block mr-2'>
      <button
        @click="showYearModal = true"
        class="text-xs border py-1.5 px-4 rounded-full bg-white transition-colors border-purple text-purple"
      >
        {{ yearLabel }}
        <Icon type="Chevron-Down" class="inline w-3 h-3 ml-1" />
      </button>
    </li>
  </ul>

  <Modal @close="showYearModal = false" :showModal="showYearModal">
    <template v-slot:modaltitle>
      <h4 class="font-semibold">Filter by Year</h4>
    </template>
    <template v-slot:modalcontent>
      <ul class="my-2 px-4 bg-white rounded-lg divide-y divide-lightgray">
        <li
          v-for="year in availableYears"
          :key="year"
          @click="selectYear(year)"
          class="py-3 cursor-pointer relative text-md"
        >
          {{ year === currentYear ? `This Year (${year})` : year === currentYear - 1 ? `Last Year (${year})` : year }}
          <Icon v-if="selectedYear === year" type="Check" class="absolute right-0 top-2 text-orange" />
        </li>
        <li
          @click="selectYear(null)"
          class="py-3 cursor-pointer relative text-md"
        >
          All Time
          <Icon v-if="selectedYear === null" type="Check" class="absolute right-0 top-2 text-orange" />
        </li>
      </ul>
    </template>
  </Modal>
</template>

<script>
import ButtonPopupModal from '@/components/ButtonPopupModal.vue';
import Modal from '@/components/Modal.vue';
import Icon from '@/components/Icon.vue';
import FiltersHelper from "@/lib/FiltersHelper.js";
import API from "@/api";
import { ref, onMounted } from 'vue';

export default {
  props: {
    totalItems: Number,
  },
  emits: ['selectItem'],
  components: {
    ButtonPopupModal,
    Modal,
    Icon,
  },
  watch: {
    totalItems() {
      this.dropdownButtons.event_type.badgeText = this.totalItems;
    },
  },
  setup(props, context) {
    const currentYear = new Date().getFullYear();

    const dropdownButtons = ref({
      event_type: {
        popupTitle: 'Event Type',
        badgeText: props.totalItems,
        items: { all: 'All Events' },
        selected: 'all',
      },
    });

    const { syncTabWithUrl, selectItem } = FiltersHelper(dropdownButtons, context, ['event_type']);

    const showYearModal = ref(false);
    const selectedYear = ref(currentYear);
    const yearLabel = ref(String(currentYear));
    const availableYears = ref([currentYear]);

    onMounted(async () => {
      try {
        const res = await API.requestPosts("inpursuit-events", { per_page: 100, _fields: "date" });
        const years = [...new Set(
          (res.data || []).map(e => new Date(e.date).getFullYear())
        )].sort((a, b) => b - a);
        if (years.length) availableYears.value = years;
      } catch (_) {}
    });

    const selectYear = (year) => {
      selectedYear.value = year;
      yearLabel.value = year ? String(year) : 'All Time';
      context.emit('selectItem', { name: 'year', value: year });
      showYearModal.value = false;
    };

    return {
      dropdownButtons,
      selectItem,
      currentYear,
      showYearModal,
      selectedYear,
      yearLabel,
      availableYears,
      selectYear,
    };
  },
};
</script>
