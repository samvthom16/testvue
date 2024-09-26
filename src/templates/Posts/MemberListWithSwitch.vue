<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li class="items-center justify-between py-4 flex flex-row" v-for="user in posts" :key="user.id">
      <div class="flex-shrink-1">
        <PostFeaturedImage :post='user' />
      </div>

      <div class="ml-4 flex-1">
        <PostTitle :post='user' />
        <div class='my-2'></div>
        <Switch
          v-model:checked="user.attended"
          @click="onAttendanceChange( $event, user )"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import PostTitle from '@/templates/Post/Title.vue'
import PostFeaturedImage from '@/templates/Post/FeaturedImage.vue'

import Switch from "@/components/switch.vue"

export default {
  props: {
    posts: Array
  },
  components: {
    PostTitle,
    PostFeaturedImage,
    Switch
  },
  methods:{
    onAttendanceChange( ev, user ){
      var data = {
        flag: ev.target.checked,
        user: user
      }
      this.$emit( 'onAttendanceChange', data );
    }
  }
}
</script>
