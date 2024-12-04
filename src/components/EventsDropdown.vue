<template>
  <ul class='whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto'>
    <li class='inline-block mr-2' v-for='dropdownButton,field_name in dropdownButtons' :key='dropdownButton'>
      <ButtonPopupModal :field_name='field_name' :field='dropdownButton' @selectItem='selectItem' />
    </li>
  </ul>
</template>

<script>
import ButtonPopupModal from '@/components/ButtonPopupModal.vue';

import FiltersHelper from "@/lib/FiltersHelper.js";

import { ref } from 'vue';

export default{
  props:{
    totalItems: Number
  },
  components:{
    ButtonPopupModal
  },
  watch: {
    totalItems(){
      this.dropdownButtons.event_type.badgeText = this.totalItems
    }
  },
  setup( props, context ){

    const dropdownButtons = ref( {
      event_type : {
        popupTitle: 'Event Type',
        badgeText : props.totalItems,
        items: {
          all  : 'All Events',
        },
        selected: 'all'
      }
    } );

    const { syncTabWithUrl, selectItem } = FiltersHelper( dropdownButtons, context, [ 'event_type' ] );

    return {
      dropdownButtons,
      selectItem
    }
  }
}
</script>
