<template>
  <div>
    <ul class="divide-y divide-lightgray space-y-4" ref="scrollComponent">
      <li
        class="pb-2 pt-6 relative"
        :item="item"
        v-for="item in items"
        :key="item.id"
      >
        <EditComment
          :id="item.id"
          :item="item"
          :modalType="showModal.modalType"
          :showModal="showModal.isVisible && showModal.itemId === item.id"
          v-if="item.id"
          @close="closeCommentModal()"
          @itemComment="forceHistoryRerender()"
        />
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-1">
            <Icon
              type="Event"
              class="bg-red text-white rounded p-3 w-12 h-12 inline mr-1"
              v-if="item.type == 'event'"
            />
            <Icon
              type="Comment"
              class="bg-orange text-white rounded p-3 w-12 h-12 inline mr-1"
              v-if="item.type == 'comment'"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg truncate" v-if="item.type == 'event'">
              {{ item.title.rendered }}
            </h2>
            <h2 class="text-lg" v-else>{{ item.author_name }} commented</h2>
            <div class="text-gray text-sm">
              {{ formatDate(item.date) }}
            </div>
          </div>
        </div>
        <div class="card-desc whitespace-pre-line mt-3">{{ item.text }}</div>
        <div v-if="showCategories(item)" class="inline-block mt-3">
          <span
            v-for="category in getCommentCategories(item)"
            :key="category.term_id"
            v-html="category.name"
            class="inline-block py-1 px-2 mr-3 rounded bg-gray text-white text-sm"
          ></span>
        </div>
        <button
          v-if="item.type == 'comment'"
          type="button"
          class="rounded-sm text-gray outline-none absolute right-2 top-4"
          @click="toggleMenu(item.id)"
        >
          <Icon type="Ellipsis" class="w-4 h-4" />
        </button>

        <div
          v-if="showMenu[item.id]"
          class="absolute right-6 top-8 bg-white z-10 shadow-lg p-3 rounded-md"
        >
          <ul class="space-y-2">
            <li>
              <button
                type="button"
                class="flex items-center space-x-2 hover:text-darkgray transition-all"
                @click="openCommentModal(item.id, 'edit')"
              >
                <Icon type="Edit" />
                <span>Edit</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="flex items-center space-x-2 hover:text-darkgray transition-all"
                @click="openCommentModal(item.id, 'reschedule')"
              >
                <Icon type="Clock" />
                <span>Re-schedule</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="flex items-center space-x-2 text-red hover:text-lightred transition-all"
                @click="deleteComment(item)"
              >
                <Icon type="Delete" />
                <span>Delete</span>
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <PaginationLoaderAnimation v-if="isFetchingNextPage" />
    <ItemAnimation v-if="$store.state.processing && !items.length" />
  </div>
</template>

<script>
import API from "@/api";
import store from "@/store";
import Util from "@/lib/Util";
import Helper from "@/lib/Helper";
import OrbitQuery from "@/lib/OrbitQuery";
import { computed, onMounted, onUnmounted, reactive } from "vue";
import Icon from "@/components/Icon.vue";
import ItemAnimation from "@/components/ItemAnimation.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";
import EditComment from "./EditComment.vue";

export default {
  name: "HistoryList",
  components: {
    PaginationLoaderAnimation,
    ItemAnimation,
    Icon,
    EditComment,
  },
  props: {
    id: Number,
    item: Object,
  },
  setup(props, context) {
    const params = computed(() => {
      return {
        id: props.id,
      };
    });

    const requestAPI = (params) => API.requestHistory(params);
    var { items, watchScroll, scrollComponent, status, isFetchingNextPage } =
      OrbitQuery(params.value, requestAPI);

    const showMenu = reactive({});
    const showModal = reactive({});

    const forceHistoryRerender = () => {
      context.emit("updateComment");
    };

    const openCommentModal = (itemId, modalType) => {
      showModal.isVisible = true;
      showModal.itemId = itemId;
      showModal.modalType = modalType;
      toggleMenu(itemId);
    };

    const closeCommentModal = () => {
      showModal.isVisible = false;
      showModal.itemId = null;
      showModal.modalType = null;
    };

    const deleteComment = (comment) => context.emit("deleteComment", comment);

    const { debounceEvent } = Helper();

    const showCategories = (item) => {
      return (
        item.type === "comment" &&
        item?.comments_category &&
        item.comments_category.length
      );
    };

    const getCommentCategories = (comment) => {
      const termsArr = [];
      const terms = comment?.comments_category;

      for (const term_id of terms) {
        const term_name = store.state?.account?.comments_category[term_id];
        if (term_name) {
          termsArr.push({ term_id, name: term_name });
        }
      }

      return termsArr;
    };

    const handleScroll = () => {
      debounceEvent(function () {
        watchScroll();
      }, 50);
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    const toggleMenu = (itemId) => {
      Object.keys(showMenu).forEach((key) => {
        if (key !== String(itemId)) {
          showMenu[key] = false;
        }
      });

      showMenu[itemId] = !showMenu[itemId];
    };

    return {
      items,
      showMenu,
      scrollComponent,
      status,
      isFetchingNextPage,
      deleteComment,
      showCategories,
      getCommentCategories,
      toggleMenu,
      showModal,
      closeCommentModal,
      openCommentModal,
      forceHistoryRerender,
    };
  },
  methods: {
    formatDate: (dateString) => Util.timeAgo(dateString),
  },
};
</script>
