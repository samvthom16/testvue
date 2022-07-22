<template>
  <PhoneUI :configUI='configUI' :title='$route.query && $route.query.id ? "Update Admin" : "Create an Admin"'>
    <template v-slot:headericon>
      <button @click='goBack'><Icon type='Back' /></button>
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
        {{ team_member.first_name }}
        <TextField
          v-model='team_member.first_name'
          :field='field'
          v-if='field'
        />
        <!--component
          v-for='field in fields'
          :is='field.component'
          :key='field'
          :field='field'
          v-model="field.value"
        >
      </component-->
      </form>
      <button
        v-if='$route.query && $route.query.id'
        @click='deleteItem( $route.query.id )'
        class='border border-red p-2 rounded text-red text-sm'>
        <Icon type='Delete' class='inline' />
        Delete this member
      </button>
    </template>
  </PhoneUI>
</template>
<script>
import PhoneUI from '@/components/PhoneUI'
import Icon from '@/components/Icon'
import TextField from "@/components/TextField";
//import DropDownField from "@/components/DropDownField";

import router from '@/router'

import API from '@/api'

import {ref} from 'vue'

import { useRoute } from 'vue-router';


export default{
  components:{
    PhoneUI,
    Icon,
    TextField,
    //DropDownField
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

    const team_member = ref( {} )

    const field = ref( null )

    const route = useRoute()

    if( route.query && route.query.id ){
      API.requestUser( route.query.id ).then(
        ( response ) => {
          team_member.value = response.data
          field.value = {
            label: 'First Name',
            value: team_member.value.first_name,
            slug: 'first_name'
          }
        }
      )
    }




    const submit = ( ev ) => {
      ev.preventDefault();
      /*
      createOrUpdatePost( {
        featured_media: post.featured_media
      } )
      */
    }

    const deleteItem = ( post_id ) => {
      if( confirm( 'Are you sure you want to delete this information?' ) ){

        console.log( post_id )

        //deletePost( post_id )
      }
    }

    const goBack = () => {
      if( window.history.length > 2 ) router.go( -1 )
      else router.push( { name: 'Team' } )
    }

    return {
      team_member,
      field,
      submit,
      deleteItem,
      goBack,
    }

  },

}
</script>
