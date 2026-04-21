<template>
  <ul role="list">
    <li class="py-3" v-for="comment in items" :key="comment.id">
      <div class="flex gap-3">
        <!-- Avatar -->
        <div class="shrink-0">
          <img
            v-if="!isDefaultImage(comment.member)"
            :src="comment.member.featured_image"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :style="{ background: getGradient(comment.member) }"
          >
            <span class="text-white font-bold text-sm select-none tracking-wide">
              {{ getInitials(comment.member) }}
            </span>
          </div>
        </div>

        <!-- Right column -->
        <div class="flex-1 min-w-0">
          <!-- Name + Meta -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              class="text-xs text-gray"
              v-html="comment.member.title ? comment.member.title.rendered : ''"
            ></span>
            <span class="text-xs text-gray">
              · {{ formatDate(comment.post_date) }} by
              <span class="uppercase tracking-wide text-gray">{{ comment.user.name }}</span>
            </span>
          </div>
          <!-- Comment -->
          <div class="mt-1 text-sm font-medium text-darkblack whitespace-pre-line leading-snug">
            {{ comment.comment }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import Util from '@/lib/Util'
import { getGradient, getInitials } from '@/lib/Gradients'

export default {
  props: {
    items: Array
  },
  methods: {
    isDefaultImage(member) {
      if (!member) return true;
      return !member.featured_image || member.featured_image.includes("default-profile.png");
    },

    getInitials(member) {
      if (!member?.title?.rendered) return "?";
      return getInitials(member.title.rendered.replace(/<[^>]+>/g, "").trim());
    },

    getGradient(member) {
      if (!member?.title?.rendered) return getGradient(null);
      return getGradient(member.title.rendered.replace(/<[^>]+>/g, "").trim());
    },

    formatDate: (dateParam) => Util.timeAgo(dateParam),
  }
}
</script>
