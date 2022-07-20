<template>
  <PhoneUI :configUI='configUI' :title='$route.query && $route.query.id ? "Update Event" : "Create an Event"'>
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
        <component
          v-for='field in fields'
          :is='field.component'
          :key='field'
          :field='field'
          v-model="field.value"
        >
        </component>
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
import DropDownField from "@/components/DropDownField";

import router from '@/router'

import PostEdit from '@/lib/PostEdit'




export default{
  components:{
    PhoneUI,
    Icon,
    TextField,
    DropDownField
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

    /*
    * TAKES THE FOLLOWING PARAMETERS
    * POST TYPE, TEXTFIELDS, DROPDOWNFIELDS
    */
    const { fields, post, createOrUpdatePost, deletePost } = PostEdit(
      // POST TYPE
      'inpursuit-events',
      // TEXTFIELDS
      {
        'title' : 'Event Title',
        'date' : 'Event Date',
      },
      // DROPDOWNFIELDS
      {
        'event_type' : 'Event Type',
        'location'   : 'Location',
      },
    )

    const submit = ( ev ) => {
      ev.preventDefault();
      createOrUpdatePost( {
        featured_media: post.featured_media
      } )
    }

    const deleteItem = ( post_id ) => {
      if( confirm( 'Are you sure you want to delete this information?' ) ){
        deletePost( post_id )
      }
    }

    const goBack = () => {
      if( window.history.length > 2 ) router.go( -1 )
      else router.push( { name: 'Events' } )
    }

    return {
      post,
      fields,
      submit,
      deleteItem,
      goBack,
    }

  },

}
</script>
