<template>
  <div class="min-h-screen bg-white md:flex">

    <!-- ── DESKTOP SIDEBAR ──────────────────────────────── -->
    <aside class="hidden md:flex md:flex-col md:w-56 sticky top-0 h-screen shrink-0 bg-lightergray border-r border-lightgray">
      <div class="px-5 py-6 border-b border-lightgray">
        <p class="text-darkblack font-bold text-xl tracking-wide">InPursuit</p>
        <p class="text-gray text-xs uppercase tracking-widest mt-0.5">Admin Console</p>
      </div>
      <nav class="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.route.name"
          :to="item.route"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          :class="item.allowedRoutes.includes($route.name)
            ? 'bg-white text-purple font-semibold shadow-sm'
            : 'text-black hover:bg-white hover:text-darkblack'"
        >
          <Icon class="h-5 w-5 shrink-0" :type="item.icon" />
          <span class="text-sm font-medium">{{ item.name }}</span>
        </router-link>
      </nav>
      <div class="p-3 border-t border-lightgray">
        <router-link
          :to="{ name: 'NewEvent' }"
          class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-purple text-white rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          + New Event
        </router-link>
      </div>
    </aside>

    <!-- ── MAIN CONTENT ─────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0">

      <div v-if="post.id">

        <!-- ── HERO ──────────────────────────────────────── -->
        <div class="bg-purple px-5 md:px-8 pt-5 pb-10">

          <!-- Top row: back + 3-dot -->
          <div class="flex items-center justify-between mb-6">
            <button
              @click="$router.back()"
              class="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <Icon type="Back" class="w-5 h-5" />
              <span class="text-sm font-medium">Back</span>
            </button>
            <button
              @click="showActionsMenu = true"
              class="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <Icon type="Ellipsis" class="w-5 h-5 rotate-90" />
            </button>
          </div>

          <!-- Event identity -->
          <div class="flex items-start gap-5">
            <div
              class="shrink-0 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center"
            >
              <span class="text-white font-bold text-2xl select-none tracking-wide">
                {{ getEventInitial(post) }}
              </span>
            </div>
            <div>
              <h1
                class="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight"
                v-html="post.title?.rendered"
              ></h1>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
                  <span class="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                  {{ post.status === 'publish' ? 'Active' : 'Archived' }}
                </span>
                <span v-if="getEventType(post)" class="text-white/70 text-xs font-medium">{{ getEventType(post) }}</span>
                <span class="text-white/40 text-xs">{{ getDate(post) }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- ── BODY ──────────────────────────────────────── -->
        <div class="px-4 md:px-8 py-5">

          <!-- Meta pills row -->
          <div class="flex flex-wrap items-center gap-2 mb-5">
            <div v-if="getEventType(post)" class="flex items-center gap-1.5 px-3 py-1.5 bg-lightergray rounded-full">
              <Icon type="Group" class="w-3.5 h-3.5 text-purple" />
              <span class="text-xs font-medium text-darkblack">{{ getEventType(post) }}</span>
            </div>
            <div v-if="post.date_gmt" class="flex items-center gap-1.5 px-3 py-1.5 bg-lightergray rounded-full">
              <Icon type="Clock" class="w-3.5 h-3.5 text-lightblue" />
              <span class="text-xs font-medium text-darkblack">{{ getDate(post) }}</span>
            </div>
            <div v-if="post.attendants_percentage != null" class="flex items-center gap-1.5 px-3 py-1.5 bg-lightergray rounded-full">
              <Icon type="Members" class="w-3.5 h-3.5 text-purple" />
              <span class="text-xs font-medium text-darkblack">{{ post.attendants_percentage || 0 }}% attended</span>
            </div>
          </div>

          <SearchField @searching="onSearch" />

          <div class="mt-3">
            <MembersDropdown :totalItems="totalItems" @selectItem="selectDropdownItem" />
          </div>

          <OrbitPosts
            :params="params"
            :key="params.unique_id"
            @totalChanged="totalChanged"
            @onAttendanceChange="onAttendanceChange"
          >
            <template v-slot:loadingAnimation>
              <ListWithImageAnimation :total="8" />
            </template>
            <template v-slot:nextPageAnimation>
              <PaginationLoaderAnimation />
            </template>
            <template v-slot:whenempty>
              <div class="flex flex-col items-center justify-center py-16 text-center">
                <div class="w-12 h-12 rounded-full bg-lightergray flex items-center justify-center mb-3">
                  <Icon type="Members" class="w-5 h-5 text-gray" />
                </div>
                <p class="text-sm font-medium text-darkgray">No members found</p>
                <p class="text-xs text-gray mt-1">Try adjusting your search or filters</p>
              </div>
            </template>
          </OrbitPosts>

        </div>

      </div>

      <!-- Loading state -->
      <div v-else class="flex-1 flex items-center justify-center py-24">
        <Icon type="CircularLoader" class="w-8 h-8 text-purple" />
      </div>

      <!-- ── MOBILE BOTTOM NAV ────────────────────────────── -->
      <nav class="md:hidden sticky bottom-0 z-20 bg-white border-t border-lightgray">
        <ul class="flex items-center">
          <li v-for="item in navItems" :key="item.route.name" class="flex-1">
            <router-link :to="item.route" class="flex flex-col items-center gap-1 p-2 pb-6 hover:opacity-80">
              <Icon
                class="h-5 w-5"
                :type="item.icon"
                :class="item.allowedRoutes.includes($route.name) ? 'text-purple' : 'text-darkgray'"
              />
              <p
                class="text-xs uppercase tracking-widest"
                :class="item.allowedRoutes.includes($route.name) ? 'text-purple' : 'text-darkgray'"
              >{{ item.name }}</p>
            </router-link>
          </li>
        </ul>
      </nav>

    </div>

    <!-- ── ACTIONS BOTTOM SHEET ─────────────────────────── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showActionsMenu" class="fixed inset-0 z-50 flex flex-col justify-end">
          <div class="absolute inset-0 bg-black/40" @click="showActionsMenu = false"></div>
          <div class="relative bg-white rounded-t-3xl pb-10 shadow-2xl w-full max-w-lg mx-auto">
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-lightgray"></div>
            </div>
            <div class="px-4 pt-2 pb-1">
              <router-link
                :to="getEditLink()"
                @click="showActionsMenu = false"
                class="flex items-center gap-4 px-2 py-4 text-sm font-medium text-darkblack border-b border-lightgray"
              >
                <Icon type="Edit" class="w-5 h-5 shrink-0 text-darkgray" />
                Edit Event
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script>
import Util from "@/lib/Util";
import API from "@/api";
import store from "@/store";

import Icon from "@/components/Icon.vue";
import SearchField from "@/components/SearchField.vue";
import MembersDropdown from "@/components/MembersDropdown.vue";
import ListWithImageAnimation from "@/templates/Animation/ListWithImage.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";

import apiMixin from "@/mixins/APIMixin";
import eventMixin from "@/mixins/EventMixin";
import userMixin from "@/mixins/UserMixin";

import MembersHelper from "@/lib/MembersHelper";
import { useRoute } from "vue-router";

export default {
  name: "SingleEvent",
  components: {
    Icon,
    SearchField,
    MembersDropdown,
    ListWithImageAnimation,
    PaginationLoaderAnimation,
  },
  mixins: [apiMixin, eventMixin, userMixin],

  data() {
    return {
      post: {},
      showActionsMenu: false,
      navItems: [
        { route: { name: "Home" },     icon: "Home",    name: "Home",     allowedRoutes: ["Home"] },
        { route: { name: "Members" },  icon: "Members", name: "Members",  allowedRoutes: ["Members", "SingleMember"] },
        { route: { name: "Events" },   icon: "Event",   name: "Events",   allowedRoutes: ["Events", "SingleEvent"] },
        { route: { name: "Comments" }, icon: "Comment", name: "Comments", allowedRoutes: ["Comments"] },
        { route: { name: "Profile" },  icon: "Profile", name: "Profile",  allowedRoutes: ["Profile"] },
      ],
    };
  },

  mounted() {
    const post_id = this.$route.params.id;
    if (post_id) this.id = parseInt(post_id);

    if (!store.state.account || !Object.keys(store.state.account).length) {
      store.commit("getAccountSettings");
    }

    if (this.$route.params.post) {
      this.post = JSON.parse(this.$route.params.post);
    } else {
      this.fetchPost();
    }
  },

  methods: {
    fetchPost() {
      const post_id = this.$route.params.id;
      this.requestEvent(post_id).then(
        (res) => { this.post = res.data; },
        (err) => { store.commit("notifyError", err); }
      );
    },

    getEventInitial(post) {
      const title = post.title?.rendered?.replace(/<[^>]+>/g, '').trim();
      return title ? title[0].toUpperCase() : 'E';
    },

    getEditLink() {
      return Util.getPostEditLink(this.post);
    },

    onAttendanceChange(data) {
      const post_id = this.$route.params.id;
      this.updateAttendance(data.user.id, post_id, data.flag).then(
        () => this.fetchPost(),
        (err) => console.log("" + err)
      );
    },
  },

  setup() {
    const route = useRoute();
    const post_id = route.params.id;
    const helper = MembersHelper("MemberListWithSwitch", post_id);
    helper.params.value.per_page = 20;
    return helper;
  },
};
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .relative,
.sheet-leave-to .relative {
  transform: translateY(100%);
}
</style>
