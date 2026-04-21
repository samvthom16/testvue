<template>
  <ul role="list" class="divide-y divide-lightgray">
    <li
      v-for="post in posts"
      :key="post.id"
      class="flex items-center gap-4 py-3"
    >
      <!-- Icon badge -->
      <div class="shrink-0 w-10 h-10 rounded-2xl bg-lightergray flex items-center justify-center">
        <Icon :type="getTaxonomyIcon(post.taxonomy)" class="w-5 h-5 text-purple" />
      </div>

      <!-- Name + count -->
      <div class="flex-1 min-w-0">
        <router-link
          :to="getRedirectionLink(post)"
          class="font-semibold text-sm text-darkblack hover:text-purple transition-colors"
        >
          {{ post.name }}
        </router-link>
        <OrbitPosts :params="getParams(post)">
          <template v-slot:loadingAnimation>
            <div class="h-3 w-16 bg-lightergray rounded animate-pulse mt-1"></div>
          </template>
        </OrbitPosts>
      </div>

      <!-- Edit button -->
      <button
        @click="$emit('edit-item', post)"
        class="shrink-0 p-2 rounded-full hover:bg-lightergray transition-colors text-darkgray hover:text-darkblack"
      >
        <Icon type="Edit" class="w-4 h-4" />
      </button>
    </li>
  </ul>
</template>

<script>
import Icon from "@/components/Icon.vue";
import CategoryHelper from "@/lib/CategoryHelper";

export default {
  props: {
    posts: Array,
    total: Number,
  },
  emits: ['edit-item'],
  components: {
    Icon,
  },
  setup() {
    const taxonomyIconMap = {
      'inpursuit-group':      'Group',
      'inpursuit-event-type': 'Event',
      'inpursuit-profession': 'Profession',
      'inpursuit-gender':     'Gender',
      'inpursuit-location':   'Location',
      'inpursuit-status':     'Status',
    };
    const getTaxonomyIcon = (taxonomy) => taxonomyIconMap[taxonomy] ?? 'Group';

    const getRedirectionLink = (post) => {
      const taxonomyToQueryMap = {
        "inpursuit-event-type": { name: "Events",  queryKey: "event_type"    },
        "inpursuit-group":      { name: "Members", queryKey: "group"         },
        "inpursuit-profession": { name: "Members", queryKey: "profession"    },
        "inpursuit-gender":     { name: "Members", queryKey: "gender"        },
        "inpursuit-location":   { name: "Members", queryKey: "location"      },
        "inpursuit-status":     { name: "Members", queryKey: "member_status" },
      };

      const match = taxonomyToQueryMap[post.taxonomy];
      if (match) {
        return { name: match.name, query: { [match.queryKey]: post.id } };
      }
      return { name: "NewCategory", query: { id: post.id } };
    };

    const getParams = (post) => {
      const params = {
        per_page:  1,
        post_type: 'inpursuit-members',
        style:     'MembersCount',
      };

      if (post.taxonomy === 'inpursuit-event-type') {
        params.post_type = 'inpursuit-events';
        params.style     = 'EventsCount';
      }

      const { getWPJsonType } = CategoryHelper();
      params[getWPJsonType(post.taxonomy)] = post.id;

      return params;
    };

    return {
      getTaxonomyIcon,
      getParams,
      getRedirectionLink,
    };
  },
};
</script>
