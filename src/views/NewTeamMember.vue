<template>
  <PhoneUI :configUI='configUI' :title='$route.query && $route.query.id ? "Update Admin" : "Create an Admin"'>
    <template v-slot:headericon>
      <BackButton :defaultRoute='{ name: "Team" }' />
    </template>
    <template v-slot:headerright>
      <button
        class='text-white text-sm'
        @click="submit"
        v-html='$route.query && $route.query.id ? "Update" : "Create"'
      ></button>
    </template>
    <template v-slot:phonebody>

      <form class="" @submit="submit">

        <div class='mb-5' v-for='field,slug in fields' :key='field'>
          <label class='block font-semibold text-black'>{{ field.label }}</label>
          <input class='inline-block w-full p-2 border-2 border-solid border-black rounded mb-1 mt-2 outline-none focus:border-red' type='text' v-model='data[slug]' />
        </div>

      </form>
      <button
        v-if='$route.query && $route.query.id'
        @click='deleteData'
        class='border border-red p-2 rounded text-red text-sm'>
        <Icon type='Delete' class='inline' />
        Delete Team Member
      </button>
    </template>
  </PhoneUI>
</template>
<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'

import BackButton from '@/templates/PhoneUI/BackButton'

import FormEdit from '@/lib/FormEdit'

import router from '@/router'
import API from '@/api'

import {ref} from 'vue'
import { useRoute } from 'vue-router';

export default{
  components:{
    PhoneUI,
    Icon,

    BackButton
  },
  data(){
    return {
      configUI:{
        hide_footer         : true,
        maintitle_classes   : 'hidden',
        stickytitle_classes : 'opacity-100',
      },
    }
  },
  setup(){

    const fields = ref( {
      first_name: {
        label : 'First Name',
        type  : 'text',
      },
      last_name: {
        label : 'Last Name',
        type  : 'text',
      },
      email: {
        label : 'Email Address',
        type  : 'text',
      }
    } )

    const requestAPI = ( params ) => API.requestUsers( params );

    const afterUpdate = () => router.push( { name: 'Team' } )

    const {deleteData, createOrUpdateData, data} = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      {
        first_name: '',
        last_name : '',
        email     : ''
      }
    )

    const route = useRoute()

    //console.log( route.query )

    const submit = ( ev ) => {
      data.value.name = data.value.first_name.trim() + ' ' + data.value.last_name.trim();

      if( !( route.query && route.query.id ) ){
        data.value.username = data.value.email;
        data.value.password = Math.random().toString( 36 ).slice( 2, 10 )
        data.value.roles = ['editor'];
      }

      //console.log( data.value )

      createOrUpdateData( ev );
    }



    return {
      fields,
      submit,
      deleteData,
      data
    }

  },



}
</script>
