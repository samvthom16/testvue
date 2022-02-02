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
                <UserTags :user='user' />
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
import UserTags from './UserTags.vue'

import userMixin from '@/mixins/UserMixin.js'

export default {
  name: 'UsersList',
  components: { ButtonAnimation, UserTags },
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
