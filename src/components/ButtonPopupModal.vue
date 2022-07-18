<template>
  <button @click='openModal' class='button-popup-modal' v-if='field.items[field.selected]'>
    {{ field.items[field.selected] }}
    <span v-if='field.badgeText' class='badge' v-html='field.badgeText'></span>
    <Icon type='Chevron-Down' class='inline' v-else />
  </button>

  <Modal @close="close()" :showModal='showModal'>
    <template v-slot:modaltitle>
      <h4 class='font-semibold' v-html='field.popupTitle'></h4>
    </template>
    <template v-slot:modalcontent>
      <ul class='dropdown-list text-md'>
        <li v-for='dropdownItem,key in field.items' :key='dropdownItem' @click='selectedItem( key )'>
          {{ dropdownItem }}
          <Icon v-if='key == field.selected' type='Check' class='absolute right-0 top-2 text-orange' />
        </li>
      </ul>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
import Icon from '@/components/Icon'

export default{
  components: {
    Modal,
    Icon
  },
  props: {
    field: Object,
    field_name: String,
  },
  emits: [ 'selectItem' ],
  data(){
    return {
      showModal: false
    }
  },
  methods:{
    close(){
      this.showModal = false
    },
    openModal(){
      this.showModal = true
    },
    selectedItem( key ){
      var data = {
        name  : this.field_name,
        value : key
      }
      this.$emit( 'selectItem', data )
    }
  }
}
</script>

<style scoped>
  .badge{
    @apply bg-lightpurple rounded-full text-purple font-bold text-xs py-1 px-2;
    --tw-bg-opacity: 0.5;
  }

  .button-popup-modal{
    @apply text-sm text-black border border-gray py-2 px-4 rounded-full
  }
  .dropdown-list{
    @apply my-2 px-4 bg-lightergray rounded-lg divide-y divide-lightgray bg-white;
  }
  .dropdown-list li{
    @apply py-3 cursor-pointer relative;
  }
</style>
