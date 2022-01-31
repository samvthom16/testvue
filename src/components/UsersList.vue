<template>
  <!-- This is an example component -->
  <div class="max-w-2xl mx-auto">
    <div class="p-4 max-w-md bg-white rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Members</h3>
        <span class="text-sm font-medium text-gray dark:text-blue-500">
            Total of {{ total }} items
        </span>
      </div>
      <div class="flow-root">
        <ul role="list" class="divide-y divide-lightgray dark:divide-gray-700">
          <li class="py-3 sm:py-4" v-for='user in users' :key='user.id'>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full" :src="user.featured_image" :alt="user.title.rendered">
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-lg font-normal text-purple truncate dark:text-white">
                  <router-link :to='$parent.getPostLink( user )'>{{ user.title.rendered }}</router-link>
                </p>
                <ul class='text-xs dark:text-gray-400'>
                  <li class='inline text-white mr-2 p-1 rounded bg-orange text-white' v-if='locationHTML( user )'>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span v-html='locationHTML( user )'></span>
                  </li>
                  <li class='inline text-gray truncate p-1 rounded bg-gray text-white' v-html='subtitleHTML( user )'></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>

        <ButtonAnimation v-if='$store.state.processing' />


      </div>




    </div>

	</div>
</template>

<script>
import ButtonAnimation from './ButtonAnimation.vue'

import userMixin from '@/mixins/UserMixin.js'

export default {
  name: 'UsersList',
  components: { ButtonAnimation },
  mixins: [ userMixin ],
  props:{
    users: Array,
    total: String
  },
  data(){
    return {

    }
  },
  methods: {
    

  },
}
</script>
