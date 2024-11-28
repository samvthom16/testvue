<template>
  <ul class='whitespace-nowrap border-b border-lightgray pb-4 mb-2 overflow-auto'>
    <li class='inline-block mr-2' v-for='dropdownButton,field_name in dropdownButtons' :key='dropdownButton'>
      <ButtonPopupModal :field_name='field_name' :field='dropdownButton' @selectItem='selectItem' />
    </li>
  </ul>
</template>

<script>
import ButtonPopupModal from '@/components/ButtonPopupModal.vue';

import { ref } from 'vue';

import FiltersHelper from "@/lib/FiltersHelper.js";

export default{
  props:{
    totalItems: Number
  },
  components:{
    ButtonPopupModal
  },
  watch: {
    totalItems(){
      this.dropdownButtons.status.badgeText = this.totalItems
    }
  },
  setup( props, context ){

    const dropdownButtons = ref( {
      status : {
        popupTitle: 'View Members',
        badgeText : props.totalItems,
        items: {
          all     : 'All Members',
          publish : 'Active Members',
          draft   : 'Archived Members'
        },
        selected: 'publish'
      },
      orderby:{
        popupTitle: 'Sort By',
        badgeText : '',
        items: {
          title  : 'Alphabetical',
          id     : 'Newest Members',
        },
        selected: 'title'
      },
      member_status : {
        popupTitle: 'Profile Type',
        badgeText : '',
        items: {
          all  : 'All Profile Types',
        },
        selected: 'all'
      },
      /*
      group : {
        popupTitle: 'Groups',
        badgeText : '',
        items: {
          all  : 'All Groups',
        },
        selected: 'all'
      }
      */
    } );

    const { syncTabWithUrl, selectItem } =
      FiltersHelper( dropdownButtons, context, [ 'member_status', /*'group'*/ ] );

    return {
      dropdownButtons,
      selectItem
    }
  }
}
</script>
