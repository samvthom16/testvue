<template>
  <PhoneUI :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="mb-6">
        <button
          type="button"
          @click="goBack"
          class="flex items-center gap-1.5 text-darkgray hover:text-darkblack transition-colors mb-4"
        >
          <Icon type="Back" class="w-5 h-5" />
          <span class="text-sm font-medium">Back</span>
        </button>
        <h1 class="text-2xl font-bold text-darkblack">
          {{ $route.query && $route.query.id ? `Edit ${categoryLabel}` : `New ${categoryLabel}` }}
        </h1>
        <p class="text-sm text-darkgray mt-0.5">
          {{ $route.query && $route.query.id ? `Update this ${categoryLabel.toLowerCase()}.` : `Add a new ${categoryLabel.toLowerCase()} to the list.` }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-8">

        <section>
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Details</h2>
          <div v-for="(field, slug) in fields" :key="slug" class="mb-5">
            <label class="block font-medium text-darkblack text-sm mb-1.5">{{ field.label }}</label>
            <input
              type="text"
              v-model.trim="data[slug]"
              :placeholder="field.label"
              class="w-full p-3 border border-lightgray rounded-xl bg-lightergray outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
            />
            <p v-if="field.errorMsg" class="mt-1 text-xs text-red">{{ field.errorMsg }}</p>
          </div>
        </section>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3.5 bg-purple text-white rounded-2xl text-sm font-semibold hover:bg-lightpurple transition-colors"
        >
          {{ $route.query && $route.query.id ? `Update ${categoryLabel}` : `Create ${categoryLabel}` }}
        </button>

        <!-- Danger zone -->
        <section v-if="$route.query && $route.query.id">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-3">Danger Zone</h2>
          <button
            type="button"
            @click="deleteData"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-red text-red text-sm font-medium hover:bg-red/5 transition-colors"
          >
            <Icon type="Delete" class="w-4 h-4" />
            Delete {{ categoryLabel }}
          </button>
        </section>

      </form>

    </template>
  </PhoneUI>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import API from "@/api";
import FormEdit from "@/lib/FormEdit";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import CategoryHelper from "@/lib/CategoryHelper";

export default {
  components: {
    Icon,
    PhoneUI,
  },
  setup() {
    const route = useRoute();
    const { categories, getWPType, getType } = CategoryHelper();

    const categoryLabel = computed(
      () => categories.value[getType()]?.label || "Category"
    );

    const fields = ref({
      name: { label: "Name", type: "text", errorMsg: "" },
    });

    const requestAPI = (params) => API.requestPosts(getWPType(getType()), params);
    const afterUpdate = () =>
      router.replace({ name: "Categories", params: { type: getType() } });

    const { deleteData, createOrUpdateData, data } = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      { name: "" }
    );

    const resetErrors = () => {
      fields.value.name.errorMsg = "";
    };

    const handleSubmissionError = () => {
      resetErrors();
      if (!data.value.name) {
        fields.value.name.errorMsg = "Cannot be empty";
        return false;
      }
      return true;
    };

    const submit = (ev) => {
      if (!handleSubmissionError()) return;
      createOrUpdateData(ev);
    };

    const goBack = () => {
      router.replace({ name: "Categories", params: { type: getType() } });
    };

    return {
      data,
      fields,
      submit,
      deleteData,
      categoryLabel,
      goBack,
    };
  },
};
</script>
