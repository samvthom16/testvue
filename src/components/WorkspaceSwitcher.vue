<template>
  <div>
    <p class="text-xs font-semibold text-gray uppercase tracking-widest mb-3">Workspaces</p>

    <div class="bg-white border border-lightgray rounded-2xl overflow-hidden divide-y divide-lightgray">
      <div
        v-for="workspace in workspaces"
        :key="workspace.account_url"
        class="flex items-center gap-3 px-4 py-3.5"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
          :class="isActive(workspace) ? 'bg-purple text-white' : 'bg-lightergray text-darkgray'"
        >
          {{ getDomainInitial(workspace.account_url) }}
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-darkblack truncate">{{ getDomain(workspace.account_url) }}</p>
          <p class="text-xs text-gray truncate">{{ workspace.account_url }}</p>
        </div>

        <span
          v-if="isActive(workspace)"
          class="text-xs font-medium text-purple px-2.5 py-1 rounded-full bg-lightergray shrink-0"
        >
          Active
        </span>
        <button
          v-else
          @click="switchWorkspace(workspace.account_url)"
          class="text-xs font-medium text-purple px-2.5 py-1 rounded-full bg-lightergray hover:bg-purple hover:text-white transition-colors shrink-0"
        >
          Switch
        </button>
      </div>
    </div>

    <router-link
      to="/add-workspace"
      class="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-lightgray hover:border-purple hover:text-purple transition-colors text-sm font-medium text-gray"
    >
      <Icon type="Plus" class="w-4 h-4" />
      Add Workspace
    </router-link>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'

export default {
  name: 'WorkspaceSwitcher',
  components: { Icon },
  setup() {
    const store = useStore()

    const workspaces = computed(() => store.state.workspaces)
    const activeUrl = computed(() => store.state.settings?.account_url)

    const isActive = (workspace) => workspace.account_url === activeUrl.value

    const getDomain = (url) => {
      try {
        return new URL(url).hostname
      } catch {
        return url
      }
    }

    const getDomainInitial = (url) => {
      return getDomain(url).charAt(0).toUpperCase()
    }

    const switchWorkspace = (account_url) => {
      store.commit('switchWorkspace', account_url)
    }

    return { workspaces, isActive, getDomain, getDomainInitial, switchWorkspace }
  },
}
</script>
