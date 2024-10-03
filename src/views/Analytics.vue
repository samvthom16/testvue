<template>
  <PhoneUI
    title="Analytics"
    :configUI="{
      hide_footer: true,
      maintitle_classes: 'hidden',
      stickytitle_classes: 'opacity-100',
    }"
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute="{ name: 'Profile' }" />
    </template>

    <template v-slot:phonebody>
      <ul
        class="whitespace-nowrap border-b border-lightgray pb-4 mb-4 overflow-auto"
      >
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

      <Stats :period="period" :key="period" />
    </template>
  </PhoneUI>
</template>

<script>
import { ref } from "vue";
import Stats from "@/components/Stats.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import BackButton from "@/templates/PhoneUI/BackButton.vue";
import ButtonPopupModal from "@/components/ButtonPopupModal.vue";

export default {
  components: {
    PhoneUI,
    BackButton,
    ButtonPopupModal,
    Stats,
  },
  setup() {
    const period = ref(30);

    const dropdownButtons = ref({
      period: {
        popupTitle: "Select Period",
        items: {
          30: "Month",
          90: "Quarter",
          180: "6 Months",
          365: "Year",
        },
        selected: "30",
      },
    });

    const selectItem = (data) => {
      dropdownButtons.value[data.name].selected = data.value;
      period.value = parseInt(data.value);
    };

    return {
      dropdownButtons,
      selectItem,
      period,
    };
  },
};
</script>
