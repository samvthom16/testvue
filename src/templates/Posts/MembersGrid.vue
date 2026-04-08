<template>

  <!-- ── MOBILE: contact list with extra info chips ─── -->
  <ul class="md:hidden -mx-4">
    <li v-for="post in posts" :key="post.id">
      <router-link
        :to="getPostLink(post)"
        @click="cachePost(post)"
        class="flex items-center gap-4 px-4 py-3.5 border-b border-lightgray active:bg-lightergray transition-colors"
      >
        <!-- Avatar: real photo or monogram -->
        <img
          v-if="!isDefaultImage(post)"
          :src="post.featured_image"
          class="shrink-0 w-12 h-12 rounded-full object-cover"
        />
        <div
          v-else
          class="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          :style="{ background: getGradient(post) }"
        >
          <span class="text-white font-bold text-base select-none tracking-wide">
            {{ getInitials(post) }}
          </span>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-semibold text-darkblack text-sm truncate" v-html="post.title.rendered"></p>
            <span
              class="shrink-0 w-1.5 h-1.5 rounded-full"
              :class="post.status === 'publish' ? 'bg-green' : 'bg-lightgray'"
            ></span>
          </div>
          <p class="text-xs text-darkgray mt-0.5">{{ getLastSeen(post) }}</p>
          <!-- Extra field chips -->
          <div class="flex flex-wrap gap-1 mt-1.5" v-if="hasExtra(post)">
            <span v-if="post.gender"       class="inline-block bg-lightergray text-darkgray text-xs px-2 py-0.5 rounded-full">{{ post.gender }}</span>
            <span v-if="post.member_status" class="inline-block bg-lightergray text-darkgray text-xs px-2 py-0.5 rounded-full">{{ post.member_status }}</span>
            <span v-if="post.location"     class="inline-block bg-lightergray text-darkgray text-xs px-2 py-0.5 rounded-full">{{ post.location }}</span>
            <span v-if="post.profession"   class="inline-block bg-lightergray text-darkgray text-xs px-2 py-0.5 rounded-full">{{ post.profession }}</span>
          </div>
        </div>

        <svg class="w-4 h-4 text-lightgray shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </router-link>
    </li>
  </ul>

  <!-- ── DESKTOP: table ─────────────────────────────── -->
  <div class="hidden md:block rounded-2xl border border-lightgray overflow-x-auto">
    <table class="w-full min-w-max">
        <thead>
          <tr class="bg-lightergray border-b border-lightgray">
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Member</th>
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Status</th>
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Gender</th>
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Profile Type</th>
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Location</th>
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Profession</th>
            <th class="text-left py-3 px-5 text-xs font-semibold text-gray uppercase tracking-wider">Last Seen</th>
            <th class="py-3 px-5"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-lightgray bg-white">
          <tr
            v-for="post in posts"
            :key="post.id"
            class="hover:bg-lightergray transition-colors group"
          >
            <!-- Member -->
            <td class="py-3.5 px-5">
              <div class="flex items-center gap-3">
                <img
                  v-if="!isDefaultImage(post)"
                  :src="post.featured_image"
                  class="shrink-0 w-9 h-9 rounded-full object-cover"
                />
                <div
                  v-else
                  class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  :style="{ background: getGradient(post) }"
                >
                  <span class="text-white font-bold text-xs select-none tracking-wide">
                    {{ getInitials(post) }}
                  </span>
                </div>
                <div>
                  <p class="font-semibold text-darkblack text-sm whitespace-nowrap" v-html="post.title.rendered"></p>
                  <p class="text-xs text-gray">#M-{{ post.id }}</p>
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="py-3.5 px-5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-lightergray whitespace-nowrap"
                :class="post.status === 'publish' ? 'text-green' : 'text-darkgray'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="post.status === 'publish' ? 'bg-green' : 'bg-gray'"></span>
                {{ post.status === 'publish' ? 'Active' : 'Archived' }}
              </span>
            </td>

            <!-- Gender -->
            <td class="py-3.5 px-5 text-sm text-darkblack whitespace-nowrap">
              {{ formatField(post.gender) }}
            </td>

            <!-- Profile Type -->
            <td class="py-3.5 px-5 text-sm text-darkblack whitespace-nowrap">
              {{ formatField(post.member_status) }}
            </td>

            <!-- Location -->
            <td class="py-3.5 px-5 text-sm text-darkblack whitespace-nowrap">
              {{ formatField(post.location) }}
            </td>

            <!-- Profession -->
            <td class="py-3.5 px-5 text-sm text-darkblack whitespace-nowrap">
              {{ formatField(post.profession) }}
            </td>

            <!-- Last seen -->
            <td class="py-3.5 px-5 text-sm text-darkgray whitespace-nowrap">
              {{ getLastSeen(post) }}
            </td>

            <!-- Actions -->
            <td class="py-3.5 px-5 text-right">
              <router-link
                :to="getPostLink(post)"
                @click="cachePost(post)"
                class="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-xs font-medium text-purple border border-purple rounded-lg px-3 py-1.5 hover:bg-purple hover:text-white transition-colors whitespace-nowrap"
              >
                View
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
  </div>

</template>

<script>
import Util from "@/lib/Util.js";
import store from "@/store";
import { ref } from "vue";

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
  name: "MembersGrid",
  props: {
    posts: Array,
  },
  methods: {
    getPostLink: (post) => Util.getPostLink(post),

    isDefaultImage(post) {
      return !post.featured_image || post.featured_image.includes("default-profile.png");
    },

    getLastSeen(post) {
      return post.last_seen
        ? `Last seen ${Util.timeAgo(post.last_seen)}`
        : "Last seen never";
    },

    getInitials(post) {
      if (!post.title || !post.title.rendered) return "?";
      const name = post.title.rendered.replace(/<[^>]+>/g, "").trim();
      const parts = name.split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    },

    getGradient(post) {
      if (!post.title || !post.title.rendered) {
        return `linear-gradient(135deg, ${GRADIENTS[0][0]}, ${GRADIENTS[0][1]})`;
      }
      const name = post.title.rendered.replace(/<[^>]+>/g, "").trim();
      const index = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % GRADIENTS.length;
      const [from, to] = GRADIENTS[index];
      return `linear-gradient(135deg, ${from}, ${to})`;
    },

    hasExtra(post) {
      return post.gender || post.member_status || post.location || post.profession;
    },

    formatField(value) {
      if (!value) return '—';
      if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
      if (typeof value === 'number') return '—';
      return value;
    },

    cachePost(post) {
      store.commit("setCachedMember", ref(post));
    },
  },
};
</script>
