<template>
  <div class='sticky z-10 bg-white bottom-0 w-full border-t border-gray' v-if='!hide_footer'>
    <ul class='footer-list'>
      <li>
        <router-link :to="{ name: 'Home' }" class="hover:opacity-80">
          <Icon
            class='text-black'
            type='Home'
            :class="{'text-purple' : $route.name == 'Home' }"
          />
          <p
            class='text-xs pt-1'
            :class="{'text-purple' : $route.name == 'Home' }"
          >
            Home
          </p>
        </router-link>
      </li>
      <li>
        <router-link to="/members" class="hover:opacity-80">
          <Icon
            class='text-black'
            type='Members'
            :class="{'text-purple' : ['Members', 'SingleMember'].includes( $route.name ) }"
          />
          <p
            class='text-xs pt-1'
            :class="{'text-purple' : ['Members', 'SingleMember'].includes( $route.name ) }"
          >
            Members
          </p>
        </router-link>
      </li>
      <li class='text-black'>
        <router-link to="/events" class="hover:opacity-80">
          <Icon
            class='text-black'
            :class="{'text-purple' : ['Events', 'SingleEvent'].includes( $route.name ) }"
            type="Event"
          />
          <p
            class='text-xs pt-1'
            :class="{'text-purple' : ['Events', 'SingleEvent'].includes( $route.name ) }"
          >
            Events
          </p>
        </router-link>
      </li>
      <li>
        <router-link to="/profile" class="hover:opacity-80">
          <Icon
            class='text-black'
            :class="{'text-purple' : $route.name == 'Profile' }"
            type="Profile"
          />
          <p
            class='text-xs pt-1'
            :class="{'text-purple' : $route.name == 'Profile' }"
          >
            Profile
          </p>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>

import Icon from '@/components/Icon'

export default{
  props: {
    hide_footer: Boolean
  },
  components: {
    Icon
  },

}
</script>
