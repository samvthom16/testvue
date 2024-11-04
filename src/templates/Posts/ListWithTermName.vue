<template>
	<ul role="list" class="divide-y divide-lightgray">
    <li class="py-3 sm:py-4" v-for="post in posts" :key="post">
      <div class="flex items-center space-x-4">
				<div class='text-lg leading-tight'>{{ post.name }}</div>
			</div>
    </li>
  </ul>
</template>

<script>

import Util from "@/lib/Util.js";

export default {
  props: {
    posts: Array,
  },
  components: {

  },
  
};
</script>
