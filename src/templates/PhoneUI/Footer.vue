<template>
  <div class='sticky z-10 bg-lightergray bottom-0 w-full border-t border-gray' v-if='!hide_footer'>
    <ul class='footer-list'>
      <li v-for='item in items' :key='item'>
        <router-link :to="item.route" class="hover:opacity-80">
          <Icon
            class='text-black h-5 w-5'
            :type=item.icon
            :class="{'text-purple' : item.allowedRoutes.includes( $route.name ) }"
          />
          <p
            class='text-xs pt-1'
            :class="{'text-purple' : item.allowedRoutes.includes( $route.name ) }"
          >
            {{ item.name }}
          </p>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>

import Icon from '@/components/Icon'

import {ref} from 'vue'

export default{
  props: {
    hide_footer: Boolean
  },
  components: {
    Icon
  },
  setup(){

    const items = ref( [
      {
        route : { name: 'Home' },
        icon  : 'Home',
        name  : 'Home',
        allowedRoutes: ['Home']
      },

      {
        route : { name: 'Members' },
        icon  : 'Members',
        name  : 'Members',
        allowedRoutes: ['Members', 'SingleMember']
      },
      {
        route : { name: 'Events' },
        icon  : 'Event',
        name  : 'Events',
        allowedRoutes: ['Events', 'SingleEvent']
      },
      {
        route : { name: 'Comments' },
        icon  : 'Comment',
        name  : 'Comments',
        allowedRoutes: ['Comments']
      },
      {
        route : { name: 'Profile' },
        icon  : 'Profile',
        name  : 'Profile',
        allowedRoutes: ['Profile']
      },
    ] )

    return {
      items
    }

  }

}
</script>
