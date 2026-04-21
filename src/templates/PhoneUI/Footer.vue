<template>
  <div id='phone-footer' class='md:hidden' v-if='!hide_footer'>
    <ul class='footer-list'>

      <!-- Primary nav items -->
      <li v-for='item in primaryItems' :key='item.name'>
        <router-link :to="item.route" class="hover:opacity-80">
          <Icon
            class='h-5 w-5 text-darkgray'
            :type='item.icon'
            :class="{ 'text-purple': item.allowedRoutes.includes($route.name) }"
          />
          <p
            class='text-xs pt-1 text-darkgray font-medium'
            :class="{ 'text-purple': item.allowedRoutes.includes($route.name) }"
          >
            {{ item.name }}
          </p>
        </router-link>
      </li>

      <!-- More button -->
      <li>
        <button @click="showMore = true" class="w-full flex flex-col items-center hover:opacity-80">
          <Icon
            class='h-5 w-5 text-darkgray'
            type='EllipsisVertical'
            :class="{ 'text-purple': isMoreActive }"
          />
          <p
            class='text-xs pt-1 text-darkgray font-medium'
            :class="{ 'text-purple': isMoreActive }"
          >
            More
          </p>
        </button>
      </li>

    </ul>
  </div>

  <!-- More bottom sheet (teleported, always in DOM so transitions work) -->
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 md:hidden"
      :class="showMore ? 'pointer-events-auto' : 'pointer-events-none'"
    >
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="showMore"
          class="absolute inset-0 bg-black/40"
          @click="showMore = false"
        ></div>
      </Transition>

      <!-- Sheet panel -->
      <Transition name="slide-up">
        <div
          v-if="showMore"
          class="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-xl"
        >
          <!-- Drag handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-10 h-1 bg-lightgray rounded-full"></div>
          </div>

          <!-- Grid of more items -->
          <div class="px-4 pb-10 pt-1">
            <div class="grid grid-cols-4 gap-1">
              <router-link
                v-for="item in moreItems"
                :key="item.name"
                :to="item.route"
                @click="showMore = false"
                class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-colors"
                :class="item.allowedRoutes.includes($route.name)
                  ? 'text-purple bg-purple/5'
                  : 'text-darkgray hover:bg-lightergray'"
              >
                <Icon class='h-6 w-6' :type='item.icon' />
                <span class='text-xs font-medium text-center leading-tight'>{{ item.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'

export default {
  props: {
    hide_footer: Boolean,
  },
  components: {
    Icon,
  },
  setup() {
    const route    = useRoute()
    const store    = useStore()
    const showMore = ref(false)

    const primaryItems = [
      { route: { name: 'Home' },    icon: 'Home',    name: 'Home',      allowedRoutes: ['Home'] },
      { route: { name: 'Members' }, icon: 'Members', name: 'Members',   allowedRoutes: ['Members', 'SingleMember'] },
      { route: { name: 'Events' },  icon: 'Event',   name: 'Events',    allowedRoutes: ['Events', 'SingleEvent'] },
      { route: { name: 'Profile' }, icon: 'Profile', name: 'Profile',   allowedRoutes: ['Profile'] },
    ]

    const moreItemsBase = [
      { route: { name: 'Comments' },      icon: 'Comment',      name: 'Comments',       allowedRoutes: ['Comments'] },
      { route: { name: 'SpecialEvents' }, icon: 'SpecialEvent', name: 'Special Events', allowedRoutes: ['SpecialEvents'] },
      { route: { name: 'Team' },          icon: 'Team',         name: 'Team',           allowedRoutes: ['Team'] },
      { route: { name: 'Analytics' },     icon: 'Chart',        name: 'Analytics',      allowedRoutes: ['Analytics'] },
      { route: { name: 'Settings' },      icon: 'Settings',     name: 'Settings',       allowedRoutes: ['Settings', 'Categories', 'NewCategory', 'CommentsCategory', 'NewCommentsCategory'] },
    ]

    const moreItems = computed(() => {
      const userId = store.state.settings?.id
      if (!userId) return moreItemsBase
      return [
        ...moreItemsBase.slice(0, 2),
        { route: { name: 'SingleTeamMember', params: { id: userId } }, icon: 'History', name: 'History', allowedRoutes: ['SingleTeamMember'] },
        ...moreItemsBase.slice(2),
      ]
    })

    const isMoreActive = computed(() =>
      moreItems.value.some(item => item.allowedRoutes.includes(route.name))
    )

    return {
      primaryItems,
      moreItems,
      showMore,
      isMoreActive,
    }
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
