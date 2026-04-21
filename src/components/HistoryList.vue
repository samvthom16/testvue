<template>
  <div>
    <ul ref="scrollComponent">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        v-show="!type || item.type === type"
      >

        <!-- ── EVENT: timeline row ──────────────────────── -->
        <div v-if="item.type === 'event'" class="flex gap-4">
          <!-- Dot + vertical line -->
          <div class="flex flex-col items-center shrink-0 pt-1">
            <div
              class="w-3 h-3 rounded-full shrink-0"
              :style="{ background: dotColor(index) }"
            ></div>
            <div class="w-px flex-1 mt-1.5" style="background: #e5e7eb; min-height: 1.5rem;"></div>
          </div>
          <!-- Content -->
          <div class="flex-1 pb-5 min-w-0">
            <p class="font-semibold text-darkblack text-sm leading-snug" v-html="item.title?.rendered"></p>
            <p v-if="item.text" class="text-xs text-darkgray mt-1.5 leading-relaxed">{{ item.text }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-1.5">
              <p class="text-xs text-gray">{{ formatDate(item.date) }}</p>
              <template v-if="item.author_name">
                <span class="text-xs text-gray/50">·</span>
                <span class="text-xs text-gray">by {{ item.author_name }}</span>
              </template>
              <template v-if="getEventTypeName(item)">
                <span class="text-xs text-gray/50">·</span>
                <span
                  class="text-xs font-medium px-2 py-0.5 rounded-full"
                  :style="eventTypePill(item)"
                >{{ getEventTypeName(item) }}</span>
              </template>
            </div>
          </div>
        </div>

        <!-- ── COMMENT: card row ────────────────────────── -->
        <div v-else class="flex items-start gap-3 mb-5">
            <!-- Author monogram -->
            <div
              class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5 text-white text-xs font-bold select-none tracking-wide"
              :style="{ background: monogramColor(item.author_name) }"
            >{{ monogram(item.author_name) }}</div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p
                v-if="item.text"
                class="text-sm font-medium text-darkblack leading-relaxed whitespace-pre-line"
              >{{ item.text }}</p>
              <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span class="text-xs text-gray uppercase tracking-wide">{{ item.author_name }}</span>
                <template v-if="showCategories(item)">
                  <span class="text-xs text-gray/50">·</span>
                  <span
                    v-for="category in getCommentCategories(item)"
                    :key="category.term_id"
                    class="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                    :style="pillStyle(category.term_id)"
                  >{{ category.name }}</span>
                </template>
                <span class="text-xs text-gray/50">·</span>
                <span class="text-xs text-gray">{{ formatDate(item.date) }}</span>
              </div>
            </div>
            <!-- Delete -->
            <button
              @click="deleteComment(item)"
              type="button"
              class="shrink-0 text-lightgray hover:text-red transition-colors mt-0.5"
            >
              <Icon type="Delete" class="w-4 h-4" />
            </button>
        </div>

      </li>
    </ul>
    <PaginationLoaderAnimation v-if="isFetchingNextPage" />
    <HistoryEventListAnimation v-if="status === 'loading' && type === 'event'" />
    <HistoryCommentListAnimation v-if="status === 'loading' && type === 'comment'" />

    <!-- Empty state -->
    <div
      v-if="!$store.state.processing && !isFetchingNextPage && visibleCount === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="w-12 h-12 rounded-full bg-lightergray flex items-center justify-center mb-3">
        <Icon :type="type === 'event' ? 'Event' : 'Comment'" class="w-5 h-5 text-gray" />
      </div>
      <p class="text-sm font-medium text-darkgray">{{ type === 'event' ? 'No events recorded' : 'No comments yet' }}</p>
      <p class="text-xs text-gray mt-1">{{ type === 'event' ? 'Events this member attends will appear here' : 'Notes added for this member will appear here' }}</p>
    </div>
  </div>
</template>

<script>
import API from "@/api";
import store from "@/store";
import Util from "@/lib/Util";
import Helper from "@/lib/Helper";
import OrbitQuery from "@/lib/OrbitQuery";
import { computed, onMounted, onUnmounted } from "vue";
import Icon from "@/components/Icon.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";
import HistoryEventListAnimation from "@/templates/Animation/HistoryEventList.vue";
import HistoryCommentListAnimation from "@/templates/Animation/HistoryCommentList.vue";

export default {
  name: "HistoryList",
  components: {
    PaginationLoaderAnimation,
    HistoryEventListAnimation,
    HistoryCommentListAnimation,
    Icon,
  },
  props: {
    id: Number,
    item: Object,
    type: { type: String, default: null },
  },
  setup(props, context) {
    const params = computed(() => {
      const p = { id: props.id, per_page: 10 };
      if (props.type) p.type = props.type;
      return p;
    });

    const requestAPI = (params) => API.requestHistory(params);
    const { items, watchScroll, scrollComponent, status, isFetchingNextPage } =
      OrbitQuery(params.value, requestAPI);

    const deleteComment = (comment) => context.emit("deleteComment", comment);

    const { debounceEvent } = Helper();

    const normaliseTerms = (raw) => {
      if (!raw && raw !== 0) return [];
      return Array.isArray(raw) ? raw : [raw];
    };

    const showCategories = (item) => {
      if (item.type !== "comment") return false;
      return getCommentCategories(item).length > 0;
    };

    const getCommentCategories = (comment) => {
      const termsArr = [];
      const terms = normaliseTerms(comment?.comments_category);

      for (const term_id of terms) {
        const term_name = store.state?.account?.comments_category?.[term_id];
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

    const visibleCount = computed(() =>
      props.type ? items.value.filter((i) => i.type === props.type).length : items.value.length
    );

    return {
      items,
      visibleCount,
      scrollComponent,
      status,
      isFetchingNextPage,
      deleteComment,
      showCategories,
      getCommentCategories,
    };
  },
  methods: {
    formatDate: (dateString) => Util.timeAgo(dateString),

    getEventTypeName(item) {
      const settings = store.state?.account;
      if (settings?.event_type && item.event_type) {
        return settings.event_type[item.event_type] || '';
      }
      return '';
    },

    eventTypePill(item) {
      const palettes = [
        { bg: '#F5F0F6', color: '#89558d' },
        { bg: '#EAF4FA', color: '#006491' },
        { bg: '#FFF5EC', color: '#DB6933' },
        { bg: '#EEF2FF', color: '#4338CA' },
        { bg: '#E0F2FE', color: '#0369a1' },
        { bg: '#FFFBEB', color: '#B45309' },
        { bg: '#F5F3FF', color: '#7C3AED' },
        { bg: '#FEF3EE', color: '#C2410C' },
      ];
      const keys = Object.keys(store.state?.account?.event_type || {});
      const idx = keys.indexOf(String(item.event_type));
      const p = palettes[(idx === -1 ? Number(item.event_type) : idx) % palettes.length];
      return { background: p.bg, color: p.color };
    },
    pillStyle(term_id) {
      const palettes = [
        { bg: '#F5F0F6', color: '#89558d' },
        { bg: '#EAF4FA', color: '#006491' },
        { bg: '#FFF5EC', color: '#DB6933' },
        { bg: '#ECFDF5', color: '#16a34a' },
        { bg: '#FEF2F4', color: '#E16075' },
        { bg: '#EEF2F8', color: '#0369a1' },
        { bg: '#FEF3EE', color: '#c2410c' },
        { bg: '#F3F0F5', color: '#9E81A0' },
      ];
      const p = palettes[Number(term_id) % palettes.length];
      return { background: p.bg, color: p.color };
    },
    dotColor(index) {
      const colors = ['#89558d', '#DB6933', '#006491', '#16a34a', '#E16075', '#0369a1', '#c2410c', '#9E81A0'];
      return colors[index % colors.length];
    },
    monogram(name) {
      if (!name) return '?';
      const parts = name.trim().split(/\s+/);
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    },
    monogramColor(name) {
      const colors = ['#89558d', '#006491', '#DB6933', '#16a34a', '#E16075', '#c2410c', '#0369a1', '#9E81A0'];
      if (!name) return colors[0];
      const seed = name.charCodeAt(0) + (name.charCodeAt(1) || 0) + (name.charCodeAt(2) || 0);
      return colors[seed % colors.length];
    },
  },
};
</script>
