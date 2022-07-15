<template>
  <PhoneUI :configUI='configUI' title='Create an Event'>
    <template v-slot:headericon>
      <router-link :to="{ name: 'Events' }">
        <Icon type='Back' />
      </router-link>
    </template>
    <template v-slot:headerright>
      <button
        class='text-white text-sm'
        @click="submit"

      >
        Create
      </button>
    </template>
    <template v-slot:phonebody>

    </template>
  </PhoneUI>
</template>
<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'

//import TextField from "@/components/TextField";
//import DropDownField from "@/components//DropDownField";

export default{
  components:{
    PhoneUI,
    Icon,
    //TextField,
    //DropDownField
  },
  data(){
    return {
      configUI:{
        hide_footer         : true,
        maintitle_classes   : 'hidden',
        stickytitle_classes : 'opacity-100'
      }
    }
  }
}
</script>
