<template>
	<ul role="list" class="divide-y divide-lightgray">
		<li
			class="py-3 sm:py-4 flex items-center justify-between"
			v-for="post in posts"
			:key="post"
		>
			<div>
				<router-link class="font-bold text-xl" :to="getEditLink( post )">
					{{ post.name }}
				</router-link>

			</div>
			<router-link :to="getEditLink( post )">
				<Icon type="Edit" class="inline" />
			</router-link>
		</li>
	</ul>

</template>

<script>

import Util from "@/lib/Util.js";

import Icon from "@/components/Icon.vue";

export default {
  props: {
    posts: Array,
  },
  components: {
		Icon
  },
	setup(){

		const getEditLink = ( post ) => {
			return {
				name: "NewCategory",
	      query: { id: post.id },
			}
    };

		return{
			getEditLink
		}

	}
};
</script>
