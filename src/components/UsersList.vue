<template>
  <!-- This is an example component -->
  <div class="mx-auto max-w-2xl">
    <div class="p-4 bg-white sm:p-8 dark:bg-gray">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Members ({{ users.length }})</h3>
        <span class="text-sm font-medium text-gray dark:text-white">
            Total of {{ total }} items
        </span>
      </div>
      <div class='mb-3'>
        <input type='text' class='border-black rounded w-full p-2 outline-none focus:border-red border-2' placeholder="Search" v-model='$parent.search' />
      </div>
      <div class="flow-root">
        <ul role="list" class="divide-y divide-lightgray dark:divide-gray-700">
          <li class="py-3 sm:py-4" v-for='user in users' :key='user.id'>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-1">
                <router-link :to='$parent.getPostLink( user )' class='bg-lightgray w-16 h-16 rounded-full overflow-hidden inline-block'>
                  <img class="w-16 rounded-full" :src="user.featured_image" :alt="user.title.rendered" />
                </router-link>
              </div>
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-semibold truncate dark:text-white">
                  <router-link :to='$parent.getPostLink( user )'>{{ user.title.rendered }}</router-link>
                </h1>
                <UserTags :user='user' class='mt-1' />
              </div>
            </div>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>

import UserTags from './UserTags.vue'

import userMixin from '@/mixins/UserMixin.js'

export default {
  name: 'UsersList',
  components: { UserTags },
  mixins: [ userMixin ],
  props:{
    users: Array,
    total: Number
  },
  data(){
    return {

    }
  },
  methods: {


  },
}
</script>
