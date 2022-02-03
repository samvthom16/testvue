<template>
  <ul class='text-sm dark:text-gray-400'>
    <li class='inline text-white mr-2 p-1 rounded bg-orange text-white' v-if='getLocation( user )'>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span v-html='getLocation( user )'></span>
    </li>
    <li class='inline text-gray mr-2 truncate p-1 rounded bg-gray text-white' v-if='getGender( user )' v-html='getGender( user )'></li>
    <li class='inline text-gray mr-2 truncate p-1 rounded bg-gray text-white' v-if='getGroup( user )' v-html='getGroup( user )'></li>
    <li class='inline text-gray mr-2 truncate p-1 rounded bg-gray text-white' v-if='getProfession( user )' v-html='getProfession( user )'></li>
    <li class='inline text-gray mr-2 truncate p-1 rounded bg-gray text-white' v-if='getStatus( user )' v-html='getStatus( user )'></li>
  </ul>
</template>

<script>
import userMixin from '@/mixins/UserMixin.js'

export default {
  name: 'UserTags',
  props:{
    user: Object,
  },
  mixins: [ userMixin ],
  data(){
    return {

    }
  },
  methods: {


  },
}
</script>
