<template>
  <PhoneUI :configUI='configUI' :title='$route.query && $route.query.id ? "Update Member" : "Create a Member"'>
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
        <div
          class='relative border border-black w-48 h-48 mx-auto my-10 rounded-full bg-white'>
          <input ref='featured' type='file' @change='chooseUserProfile' class='hidden' />
          <img
            v-if='post.featured_image'
            :src='post.featured_image'
            width='100'
            height='100'
            class='w-full h-full rounded-full'
          />
          <button
            type='button'
            @click='$refs.featured.click'
            class='text-sm bg-orange p-2 px-8 rounded-full absolute border left-1/2 transform -translate-x-1/2 -bottom-2'>
            Upload
          </button>
        </div>

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
import ImageUtil from '@/lib/ImageUtil'



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
        stickytitle_classes : 'opacity-100'
      },

    }
  },
  setup(){

    /*
    * IMAGE UTILITY
    */
    const { handleImageSelection } = ImageUtil()



    /*
    * TAKES THE FOLLOWING PARAMETERS
    * POST TYPE, TEXTFIELDS, DROPDOWNFIELDS
    */
    const { fields, post, createOrUpdatePost, deletePost } = PostEdit( 'inpursuit-members',
      // TEXTFIELDS
      {
        'title' : 'Full Name',
        'email' : 'Email Address',
        'phone' : 'Phone'
      },
      // DROPDOWNFIELDS
      {
        'gender'        : 'Gender',
        'location'      : 'Location',
        'member_status' : 'Status',
        'profession'    : 'Profession',
        'group'         : 'Group'
      },
      // DEFAULT POST
      {
        featured_image: '',
        featured_media: 0
      }
    )

    const chooseUserProfile = ( ev ) => {
      handleImageSelection(
        ev,
        ( src ) => {
          //console.log( src )
          //console.log( po)
          post.value.featured_image = src
        },
        ( serverImageUrl, image_id ) => {
          post.value.featured_image = serverImageUrl
          post.value.featured_media = image_id
        }
      )
    }

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
      else router.push( { name: 'Members' } )
    }

    return {
      post,
      fields,
      submit,
      deleteItem,
      goBack,
      chooseUserProfile
    }

  },

}
</script>
