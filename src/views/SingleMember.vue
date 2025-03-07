<template>
  <PhoneUI
    :configUI="{
      maintitle_classes: 'py-16 hide-svg',
      hide_maintitle: true,
      hide_footer: true,
    }"
    :title="getHeaderTitle()"
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute="{ name: 'Members' }" />
    </template>
    <template v-slot:headerright>
      <router-link :to="getEditLink()" v-if="post.id">
        <Icon type="Edit" class="inline" />
      </router-link>
    </template>
    <template v-slot:phonebody>
      <AddComment
        :id="post.id"
        :item="post"
        :showModal="showCommentModal"
        v-if="post.id"
        @close="closeCommentModal()"
        @postComment="forceHistoryRerender()"
      />

      <div class="pb-6 justify-center items-center mx-auto">
        <div
          class="pt-20 pb-4 relative bg-lightergray rounded-sm -my-12"
          v-if="post.id"
          :key="post.id"
        >
          <div
            class="bg-gray absolute -top-10 left-1/2 transform -translate-x-1/2 h-28 w-28 overflow-hidden border-white border-4 rounded-full"
          >
            <img
              class="object-cover w-full h-full"
              :src="post.featured_image"
            />
          </div>

          <div class="px-2">
            <h1 class="text-xl text-center font-semibold" v-if="post.title">
              {{ post.title.rendered }}
            </h1>
            <div class="text-center mt-3">
              <UserTags :user="post" />
              <ul class="mt-4">
                <li class="inline-block p-2">
                  <Icon
                    @click="showCommentModal = true"
                    type="Comment"
                    class="cursor-pointer block bg-white text-black p-3 h-12 w-12 rounded-full"
                  />
                  <p class="text-xs mt-2 text-black text-center block">
                    Comment
                  </p>
                </li>
                <li class="inline-block p-2" v-if="post.phone">
                  <Icon
                    @click="openWhatsapp"
                    type="Phone"
                    class="cursor-pointer block bg-white text-black p-3 h-12 w-12 rounded-full"
                  />
                  <p class="text-xs mt-2 text-black text-center block">
                    Whatsapp
                  </p>
                </li>
                <li class="inline-block p-2">
                  <Icon
                    @click="archivePost(post)"
                    type="Archive"
                    class="cursor-pointer block p-3 h-12 w-12 rounded-full"
                    :class="{
                      'bg-white text-black': post.status == 'publish',
                      'bg-orange text-white': post.status == 'draft',
                    }"
                  />
                  <p
                    class="text-xs mt-2 text-black text-center block"
                    v-html="post.status == 'draft' ? 'Unarchive' : 'Archive'"
                  ></p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="relative py-20" v-if="post.id">
          <HistoryList
            @deleteComment="deleteComment"
            :id="getPostID()"
            :item="post"
            :key="historyKey"
          />
        </div>
      </div>
    </template>
  </PhoneUI>
</template>

<script>
import BackButton from "@/templates/PhoneUI/BackButton.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";

import Util from "@/lib/Util";
import API from "@/api";

import AddComment from "@/components/AddComment.vue";
import UserTags from "@/components/UserTags.vue";
import HistoryList from "@/components/HistoryList.vue";

import store from "@/store";

import { computed, onMounted, ref, watch } from "vue";
import { useQuery } from "vue-query";
import { useRoute } from "vue-router";

export default {
  name: "SingleMember",
  components: {
    PhoneUI,
    BackButton,
    Icon,
    AddComment,
    UserTags,
    HistoryList,
  },

  data() {
    return {
      //id      : 0,
      //post    : {},
      showCommentModal: false,
      historyKey: 0,
    };
  },

  setup() {
    const route = useRoute();
    var post_id = route.params.id;
    const post = computed(() => store.state.cachedMember);

    // SAVE THE POST IN CLIENT STATE
    const setPost = (post) => {
      const newPost = ref(post);
      store.commit("setPost", newPost);
      store.commit("setCachedMember", newPost);
    };

    // GET POST FROM SERVER AND SET TO CLIENT STATE
    const setPostFromServer = () => {
      const getPost = async () =>
        await API.requestPost("inpursuit-members", post_id);
      const { data } = useQuery("postQuery" + post_id, getPost);
      watch(data, (data) => setPost(data.data));
    };

    if (route.params && route.params.post) {
      /* PRELOADED CONTENT FROM ROUTER */
      setPost(JSON.parse(route.params.post));
    } else {
      setPostFromServer();
    }

    /*
     * ARCHIVE OR UNARCHIVE POST
     */
    const archivePost = (post) => {
      // CHANGING POST STATUS TO TRASH & PUBLISH
      post.status = post.status === "publish" ? "draft" : "publish";

      post.method = "post";

      setPost(post);

      API.requestPost("inpursuit-members", post.id, post).then((res) =>
        setPost(res.data)
      );
    };

    const getHeaderTitle = () => {
      if (post && post.title && post.title.rendered) {
        return post.title.rendered;
      }
      return "Member";
    };

    const getPostID = () => parseInt(route.params.id);

    onMounted(() => {
      if (!Object.keys(store.state.account).length) {
        store.commit("getAccountSettings");
      }
      if (!post.value.id) {
        setPostFromServer();
      }
    });

    return {
      getPostID,
      getHeaderTitle,
      archivePost,
      post,
    };
  },

  methods: {
    deleteComment(comment) {
      if (confirm("Are you sure you want to delete this?")) {
        API.requestComments({
          id: comment.id,
          method: "delete",
        }).then(() => this.forceHistoryRerender());
      }
    },

    forceHistoryRerender() {
      this.historyKey += 1;
    },

    closeCommentModal() {
      this.showCommentModal = false;
    },

    openWhatsapp() {
      var phone_number = this.post.phone;

      if (phone_number) {
        var link = "https://wa.me/" + phone_number;
        window.open(link, "_blank");
      }

      /*var link = 'http://www.google.com/calendar/render?action=TEMPLATE&trp=false&text=';

      if( post.title && post.title.rendered ){
        link += 'Follow up with ' + post.title.rendered;
      }
      window.open( link, '_blank' )
      //return link;
      */
    },

    getEditLink() {
      return Util.getPostEditLink(this.post);
    },
  },
};
</script>
<style>
.hide-svg svg {
  @apply hidden;
}
</style>
