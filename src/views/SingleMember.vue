<template>
  <PhoneUI :configUI="{ hide_desktop_header: true, body_classes: '!p-0' }">
    <template v-slot:phonebody>

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
        <div class="relative">
          <!-- Neutral top band -->
          <div class="h-24 w-full bg-lightergray"></div>

          <!-- Back + menu -->
          <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
            <button
              @click="$router.back()"
              class="flex items-center gap-1.5 text-darkgray hover:text-darkblack transition-colors"
            >
              <Icon type="Back" class="w-5 h-5" />
              <span class="text-sm font-medium">Back</span>
            </button>
            <button
              @click="showActionsMenu = true"
              class="p-2 rounded-full hover:bg-lightgray transition-colors text-darkgray hover:text-darkblack"
            >
              <Icon type="Ellipsis" class="w-5 h-5 rotate-90" />
            </button>
          </div>

          <!-- Avatar + name row -->
          <div class="px-5 pb-5 bg-white border-b border-lightgray">
            <div class="flex items-end gap-4 -mt-10 mb-3">
              <div
                class="shrink-0 w-20 h-20 rounded-2xl ring-4 ring-white overflow-hidden flex items-center justify-center shadow-md"
                :style="isDefaultImage ? { background: monogramBg } : {}"
              >
                <img v-if="!isDefaultImage" class="w-full h-full object-cover" :src="post.featured_image" />
                <span v-else class="text-2xl font-bold text-white select-none tracking-wide">{{ monogram }}</span>
              </div>
              <!-- Action buttons (top right of avatar row) -->
              <div class="flex gap-2 ml-auto">
                <button
                  v-if="post.phone"
                  @click="openWhatsapp"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                  style="background: #25D366"
                >
                  <Icon type="Phone" class="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>

            <h1 class="text-xl font-bold text-darkblack tracking-tight leading-tight" v-html="post.title?.rendered"></h1>
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-lightergray text-darkblack">
                <span class="w-1.5 h-1.5 rounded-full" :class="post.status === 'publish' ? 'bg-green' : 'bg-gray'"></span>
                {{ post.status === 'publish' ? 'Active' : 'Archived' }}
              </span>
              <span v-if="getStatus(post)" class="text-darkgray text-xs font-medium">{{ getStatus(post) }}</span>
              <span class="text-gray text-xs">#M-{{ post.id }}</span>
            </div>
          </div>
        </div>

        <!-- ── BODY: 2-col on desktop ─────────────────────── -->
        <div class="md:grid md:grid-cols-[300px_1fr]">

          <!-- LEFT PANEL: meta grid ──────────────────────── -->
          <div class="md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-r md:border-lightgray">
            <div class="p-4 md:p-5">
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-if="getLocation(post)"
                  class="flex items-center gap-2.5 px-3 py-3 bg-white border border-lightgray rounded-xl"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: META_PALETTES.location.bg }">
                    <Icon type="Location" class="w-3.5 h-3.5" :style="{ color: META_PALETTES.location.color }" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray leading-none mb-0.5">Location</p>
                    <p class="text-xs font-semibold text-darkblack truncate">{{ getLocation(post) }}</p>
                  </div>
                </div>
                <div
                  v-if="getTermName('gender', post.gender)"
                  class="flex items-center gap-2.5 px-3 py-3 bg-white border border-lightgray rounded-xl"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: META_PALETTES.gender.bg }">
                    <Icon type="Gender" class="w-3.5 h-3.5" :style="{ color: META_PALETTES.gender.color }" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray leading-none mb-0.5">Gender</p>
                    <p class="text-xs font-semibold text-darkblack truncate">{{ getTermName('gender', post.gender) }}</p>
                  </div>
                </div>
                <div
                  v-if="post.age"
                  class="flex items-center gap-2.5 px-3 py-3 bg-white border border-lightgray rounded-xl"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: META_PALETTES.age.bg }">
                    <Icon type="Clock" class="!w-3.5 !h-3.5" :style="{ color: META_PALETTES.age.color }" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray leading-none mb-0.5">Age</p>
                    <p class="text-xs font-semibold text-darkblack truncate">{{ post.age }} Years</p>
                  </div>
                </div>
                <div
                  v-if="getProfession(post)"
                  class="flex items-center gap-2.5 px-3 py-3 bg-white border border-lightgray rounded-xl"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: META_PALETTES.profession.bg }">
                    <Icon type="Profession" class="w-3.5 h-3.5" :style="{ color: META_PALETTES.profession.color }" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray leading-none mb-0.5">Profession</p>
                    <p class="text-xs font-semibold text-darkblack truncate">{{ getProfession(post) }}</p>
                  </div>
                </div>
                <div
                  v-if="getGroup(post)"
                  class="flex items-center gap-2.5 px-3 py-3 bg-white border border-lightgray rounded-xl"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: META_PALETTES.group.bg }">
                    <Icon type="Group" class="w-3.5 h-3.5" :style="{ color: META_PALETTES.group.color }" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray leading-none mb-0.5">Group</p>
                    <p class="text-xs font-semibold text-darkblack truncate">{{ getGroup(post) }}</p>
                  </div>
                </div>
                <div
                  v-if="post.phone"
                  class="col-span-2 flex items-center gap-2.5 px-3 py-3 bg-white border border-lightgray rounded-xl"
                >
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: META_PALETTES.phone.bg }">
                    <Icon type="Phone" class="w-3.5 h-3.5" :style="{ color: META_PALETTES.phone.color }" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray leading-none mb-0.5">Phone</p>
                    <p class="text-xs font-semibold text-darkblack truncate">{{ post.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: tabs + activity ────────────────── -->
          <div class="px-4 md:px-8 py-5">

            <!-- Tab bar -->
            <div class="flex items-center gap-2 mb-5">
              <div class="flex items-center gap-1 bg-lightergray rounded-xl p-1 flex-1">
                <button
                  @click="activeTab = 'event'"
                  class="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
                  :class="activeTab === 'event'
                    ? 'bg-white text-darkblack shadow-sm'
                    : 'text-gray hover:text-darkgray'"
                >Events</button>
                <button
                  @click="activeTab = 'comment'"
                  class="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
                  :class="activeTab === 'comment'
                    ? 'bg-white text-darkblack shadow-sm'
                    : 'text-gray hover:text-darkgray'"
                >Comments</button>
              </div>
              <button
                v-if="activeTab === 'comment'"
                @click="showCommentModal = true"
                class="shrink-0 w-10 h-10 flex items-center justify-center bg-purple text-white rounded-xl hover:bg-lightpurple transition-colors"
              >
                <Icon type="Plus" class="w-4 h-4" />
              </button>
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

    </template>
  </PhoneUI>
</template>

<script>
import PhoneUI from "@/components/PhoneUI.vue";
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
import { getGradient, getInitials } from "@/lib/Gradients";

const META_PALETTES = {
  location:   { bg: '#FFF5EC', color: '#DB6933' },
  gender:     { bg: '#F5F0F6', color: '#89558d' },
  age:        { bg: '#EEF2FF', color: '#4338CA' },
  profession: { bg: '#EAF4FA', color: '#006491' },
  group:      { bg: '#FEF2F4', color: '#E16075' },
  phone:      { bg: '#EEF2F8', color: '#006491' },
};

export default {
  name: "SingleMember",
  components: { PhoneUI, Icon, AddComment, HistoryList },
  mixins: [userMixin],

  data() {
    return {
      showCommentModal: false,
      showActionsMenu: false,
      historyKey: 0,
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
      return getInitials(post.value.title.rendered.replace(/<[^>]+>/g, "").trim());
    });

    const monogramBg = computed(() => {
      if (!post.value?.title?.rendered) return getGradient(null);
      return getGradient(post.value.title.rendered.replace(/<[^>]+>/g, "").trim());
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

    return { getPostID, getHeaderTitle, archivePost, post, isDefaultImage, monogram, monogramBg, activeTab, META_PALETTES };
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
