<template>
  <div v-if="$store.state.errors.length">
    <div
      class="
        text-xs
        fixed
        bottom-0
        left-0
        mx-auto
        max-w-xs
        px-2
        w-full
        text-white
      "
    >
      <div
        @click="removeError(key)"
        :key="key"
        v-for="(error, key) in $store.state.errors"
        class="
          mb-2
          flex
          items-center
          w-full
          max-w-xs
          bg-lightred
          text-white
          p-4
          rounded-lg
          shadow
        "
        role="alert"
      >
        <div
          class="
            inline-flex
            items-center
            justify-center
            flex-shrink-0
            text-white
          "
        >
          <Icon type="Error" />
        </div>
        <div class="ml-3 text-xs font-normal">{{ error }}</div>
        <button
          type="button"
          class="
            ml-auto
            -mx-1.5
            -my-1.5
            hover:text-white
            text-lightgray
            rounded-lg
            p-1.5
            inline-flex
            h-8
            w-8
          "
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <Icon type="Close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";

export default {
  name: "ErrorNotification",
  components: {
    Icon,
  },
  methods: {
    removeError(key) {
      this.$store.commit("flushError", key);
    },
  },
};
</script>
