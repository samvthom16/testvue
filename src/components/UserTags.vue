<template>
  <ul class='text-sm dark:text-gray-400'>
    <li class='inline-block truncate' v-if='getLocation( user )'>
      <div class='mr-2 p-1 px-2 rounded bg-orange text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ getLocation( user ) }}
      </div>
    </li>
    <li class='inline-block truncate' v-if='getGender( user )'>
      <div class='p-1 px-2 rounded bg-lightpurple text-white mr-2'>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ getGender( user ) }}
      </div>
    </li>
    <li class='inline-block truncate' v-if='getGroup( user )'>
      <div class='mr-2 p-1 px-2 rounded bg-lightred text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {{ getGroup( user ) }}
      </div>
    </li>
    <li class='inline-block truncate' v-if='getProfession( user )'>
      <div class='mr-2 p-1 px-2 rounded bg-gray text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {{ getProfession( user ) }}
      </div>
    </li>
    <li class='inline-block truncate' v-if='getStatus( user )'>
      <div class='mr-2 p-1 px-2 rounded bg-gray text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {{ getStatus( user ) }}
      </div>
    </li>



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
