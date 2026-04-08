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
          :to="{ name: 'NewMember' }"
          class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-purple text-white rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
        >
          + New Entry
        </router-link>
      </div>
    </aside>

    <!-- ── MAIN CONTENT ─────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0">

    <AddComment
      :id="post.id"
      :item="post"
      :showModal="showCommentModal"
      v-if="post.id"
      @close="closeCommentModal()"
      @postComment="forceHistoryRerender()"
    />

    <div v-if="post.id">

      <!-- ── HERO ────────────────────────────────────────── -->
      <div class="bg-purple px-5 md:px-8 pt-5 pb-10">

        <!-- Top row: back + 3-dot menu -->
        <div class="flex items-center justify-between mb-6">
          <button
            @click="$router.back()"
            class="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <Icon type="Back" class="w-5 h-5" />
            <span class="text-sm font-medium">Back</span>
          </button>

          <!-- 3-dot menu trigger -->
          <button
            @click="showActionsMenu = true"
            class="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <Icon type="Ellipsis" class="w-5 h-5 rotate-90" />
          </button>
        </div>

        <!-- Avatar + name -->
        <div class="flex items-center gap-5">
          <div
            class="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-white/30 overflow-hidden flex items-center justify-center"
            :style="isDefaultImage ? { background: monogramBg } : {}"
          >
            <img v-if="!isDefaultImage" class="w-full h-full object-cover" :src="post.featured_image" />
            <span v-else class="text-2xl font-bold text-white select-none tracking-wide">{{ monogram }}</span>
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
              <span v-if="getStatus(post)" class="text-white/70 text-xs font-medium">{{ getStatus(post) }}</span>
              <span class="text-white/40 text-xs">#M-{{ post.id }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── BODY: 2-col on desktop ─────────────────────── -->
      <div class="md:grid md:grid-cols-[300px_1fr]">

        <!-- LEFT PANEL: actions + meta ─────────────────── -->
        <div class="md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:overflow-y-auto md:border-r md:border-lightgray">

          <!-- Actions -->
          <div v-if="post.phone" class="p-4 flex gap-2 border-b border-lightgray">
            <button
              @click="openWhatsapp"
              class="flex-1 flex flex-col items-center gap-1.5 py-3.5 bg-lightergray hover:bg-lightgray rounded-2xl transition-colors"
            >
              <Icon type="Phone" class="w-5 h-5 text-darkblack" />
              <span class="text-xs font-medium text-darkblack">WhatsApp</span>
            </button>
          </div>

          <!-- Meta fields -->
          <div class="bg-lightergray p-4 space-y-2 md:bg-white md:p-5">
            <div
              v-if="getLocation(post)"
              class="flex items-center gap-3 px-4 py-3 bg-white md:bg-lightergray rounded-xl"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:#FFF5EC">
                <Icon type="Location" class="w-3.5 h-3.5" style="color:#DB6933" />
              </div>
              <div>
                <p class="text-xs text-gray leading-none mb-0.5">Location</p>
                <p class="text-sm font-medium text-darkblack">{{ getLocation(post) }}</p>
              </div>
            </div>
            <div
              v-if="getGender(post)"
              class="flex items-center gap-3 px-4 py-3 bg-white md:bg-lightergray rounded-xl"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:#F5F0F6">
                <Icon type="Gender" class="w-3.5 h-3.5" style="color:#89558d" />
              </div>
              <div>
                <p class="text-xs text-gray leading-none mb-0.5">Gender & Age</p>
                <p class="text-sm font-medium text-darkblack">{{ getGender(post) }}</p>
              </div>
            </div>
            <div
              v-if="getProfession(post)"
              class="flex items-center gap-3 px-4 py-3 bg-white md:bg-lightergray rounded-xl"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:#EAF4FA">
                <Icon type="Profession" class="w-3.5 h-3.5" style="color:#006491" />
              </div>
              <div>
                <p class="text-xs text-gray leading-none mb-0.5">Profession</p>
                <p class="text-sm font-medium text-darkblack">{{ getProfession(post) }}</p>
              </div>
            </div>
            <div
              v-if="getGroup(post)"
              class="flex items-center gap-3 px-4 py-3 bg-white md:bg-lightergray rounded-xl"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:#FEF2F4">
                <Icon type="Group" class="w-3.5 h-3.5" style="color:#E16075" />
              </div>
              <div>
                <p class="text-xs text-gray leading-none mb-0.5">Group</p>
                <p class="text-sm font-medium text-darkblack">{{ getGroup(post) }}</p>
              </div>
            </div>
            <div
              v-if="post.phone"
              class="flex items-center gap-3 px-4 py-3 bg-white md:bg-lightergray rounded-xl"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:#EEF2F8">
                <Icon type="Phone" class="w-3.5 h-3.5" style="color:#006491" />
              </div>
              <div>
                <p class="text-xs text-gray leading-none mb-0.5">Phone</p>
                <p class="text-sm font-medium text-darkblack">{{ post.phone }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT PANEL: tabs + activity ────────────────── -->
        <div class="px-4 md:px-8 py-5">

          <!-- Tab bar -->
          <div class="border-b border-lightgray mb-4">
            <div class="flex items-end gap-6">
              <button
                @click="activeTab = 'event'"
                class="pb-3 text-sm font-medium transition-colors"
                :class="activeTab === 'event'
                  ? 'text-darkblack border-b-2 border-darkblack -mb-px'
                  : 'text-gray hover:text-darkgray'"
              >Events</button>
              <button
                @click="activeTab = 'comment'"
                class="pb-3 text-sm font-medium transition-colors"
                :class="activeTab === 'comment'
                  ? 'text-darkblack border-b-2 border-darkblack -mb-px'
                  : 'text-gray hover:text-darkgray'"
              >Comments</button>
              <div class="flex-1"></div>
              <button
                v-if="activeTab === 'comment'"
                @click="showCommentModal = true"
                class="pb-3 inline-flex items-center gap-1 text-xs font-medium text-purple"
              >
                <Icon type="Plus" class="w-3 h-3" />
                Add Note
              </button>
            </div>
          </div>

          <HistoryList
            v-if="activeTab === 'event'"
            type="event"
            @deleteComment="deleteComment"
            :id="getPostID()"
            :item="post"
            :key="'events-' + historyKey"
          />
          <HistoryList
            v-if="activeTab === 'comment'"
            type="comment"
            @deleteComment="deleteComment"
            :id="getPostID()"
            :item="post"
            :key="'comments-' + historyKey"
          />

        </div>

      </div>

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

    </div><!-- end main content -->

    <!-- ── ACTIONS BOTTOM SHEET ─────────────────────────── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showActionsMenu" class="fixed inset-0 z-50 flex flex-col justify-end">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40" @click="showActionsMenu = false"></div>
          <!-- Sheet -->
          <div class="relative bg-white rounded-t-3xl pb-10 shadow-2xl w-full max-w-lg mx-auto">
            <!-- Drag handle -->
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
                Edit Member
              </router-link>
              <button
                @click="archivePost(post); showActionsMenu = false"
                class="w-full flex items-center gap-4 px-2 py-4 text-sm font-medium text-darkblack border-b border-lightgray"
              >
                <Icon type="Archive" class="w-5 h-5 shrink-0 text-darkgray" />
                {{ post.status === 'draft' ? 'Unarchive' : 'Archive' }}
              </button>
              <button
                @click="deleteMember(); showActionsMenu = false"
                class="w-full flex items-center gap-4 px-2 py-4 text-sm font-medium text-darkblack"
              >
                <Icon type="Delete" class="w-5 h-5 shrink-0 text-darkgray" />
                Delete Member
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import AddComment from "@/components/AddComment.vue";
import HistoryList from "@/components/HistoryList.vue";

import Util from "@/lib/Util";
import API from "@/api";
import store from "@/store";
import userMixin from "@/mixins/UserMixin";

import { computed, onMounted, ref, watch } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";

const GRADIENTS = [
  ["#89558d", "#6d3f71"],
  ["#006491", "#004f73"],
  ["#DB6933", "#b85229"],
  ["#16a34a", "#0e7a38"],
  ["#9E81A0", "#7a617c"],
  ["#c2410c", "#9a3309"],
  ["#0369a1", "#025e8f"],
  ["#7c3aed", "#6427c4"],
];

export default {
  name: "SingleMember",
  components: { Icon, AddComment, HistoryList },
  mixins: [userMixin],

  data() {
    return {
      showCommentModal: false,
      showActionsMenu: false,
      historyKey: 0,
      navItems: [
        { route: { name: 'Home' },     icon: 'Home',    name: 'Home',     allowedRoutes: ['Home'] },
        { route: { name: 'Members' },  icon: 'Members', name: 'Members',  allowedRoutes: ['Members', 'SingleMember'] },
        { route: { name: 'Events' },   icon: 'Event',   name: 'Events',   allowedRoutes: ['Events', 'SingleEvent'] },
        { route: { name: 'Comments' }, icon: 'Comment', name: 'Comments', allowedRoutes: ['Comments'] },
        { route: { name: 'Profile' },  icon: 'Profile', name: 'Profile',  allowedRoutes: ['Profile'] },
      ],
    };
  },

  setup() {
    const route = useRoute();
    const post_id = route.params.id;
    const post = computed(() => store.state.cachedMember);

    const setPost = (post) => {
      const newPost = ref(post);
      store.commit("setPost", newPost);
      store.commit("setCachedMember", newPost);
    };

    const setPostFromServer = () => {
      const getPost = async () => await API.requestPost("inpursuit-members", post_id);
      const { data } = useQuery("postQuery" + post_id, getPost);
      watch(data, (data) => setPost(data.data));
    };

    if (route.params && route.params.post) {
      setPost(JSON.parse(route.params.post));
    } else {
      setPostFromServer();
    }

    const archivePost = (postObj) => {
      const updated = {
        ...postObj,
        status: postObj.status === "publish" ? "draft" : "publish",
        method: "post",
      };
      setPost(updated);
      API.requestPost("inpursuit-members", updated.id, updated).then((res) => setPost(res.data));
    };

    const getHeaderTitle = () => post.value?.title?.rendered || "Member";
    const getPostID = () => parseInt(route.params.id);

    const isDefaultImage = computed(() => {
      const img = post.value?.featured_image;
      return !img || img.includes("default-profile.png");
    });

    const monogram = computed(() => {
      if (!post.value?.title?.rendered) return "?";
      const name = post.value.title.rendered.replace(/<[^>]+>/g, "").trim();
      const parts = name.split(/\s+/);
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    });

    const monogramBg = computed(() => {
      if (!post.value?.title?.rendered) return GRADIENTS[0][1];
      const name = post.value.title.rendered.replace(/<[^>]+>/g, "").trim();
      const index = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % GRADIENTS.length;
      return GRADIENTS[index][1];
    });

    const activeTab = ref("event");

    onMounted(() => {
      if (!Object.keys(store.state.account).length) {
        store.commit("getAccountSettings");
      }
      if (!post.value.id) {
        setPostFromServer();
      }
    });

    return { getPostID, getHeaderTitle, archivePost, post, isDefaultImage, monogram, monogramBg, activeTab };
  },

  methods: {
    deleteComment(comment) {
      if (confirm("Are you sure you want to delete this?")) {
        API.requestComments({ id: comment.id, method: "delete" }).then(() =>
          this.forceHistoryRerender()
        );
      }
    },
    forceHistoryRerender() { this.historyKey += 1; },
    closeCommentModal() { this.showCommentModal = false; },
    openWhatsapp() {
      if (this.post.phone) window.open("https://wa.me/" + this.post.phone, "_blank");
    },
    getEditLink() { return Util.getPostEditLink(this.post); },
    deleteMember() {
      if (confirm("Are you sure you want to permanently delete this member? This cannot be undone.")) {
        API.requestPost("inpursuit-members", this.post.id, { method: "delete" }).then(() => {
          this.$router.push({ name: "Members" });
        });
      }
    },
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
