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
          {{ $route.query && $route.query.id ? 'Edit Comment Type' : 'New Comment Type' }}
        </h1>
        <p class="text-sm text-darkgray mt-0.5">
          {{ $route.query && $route.query.id ? 'Update this comment type.' : 'Add a new comment type to the list.' }}
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
          {{ $route.query && $route.query.id ? 'Update Comment Type' : 'Create Comment Type' }}
        </button>

        <!-- Danger zone -->
        <section v-if="$route.query && $route.query.id">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-3">Danger Zone</h2>
          <button
            type="button"
            @click="handleDelete"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-red text-red text-sm font-medium hover:bg-red/5 transition-colors"
          >
            <Icon type="Delete" class="w-4 h-4" />
            Delete Comment Type
          </button>
        </section>

      </form>

    </template>
  </PhoneUI>
</template>

<script>
import { ref } from "vue";
import router from "@/router";
import API from "@/api";
import FormEdit from "@/lib/FormEdit";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";

export default {
  components: {
    Icon,
    PhoneUI,
  },
  setup() {
    const fields = ref({
      name: { label: "Name", type: "text", errorMsg: "" },
    });

    const requestAPI = (params) => {
      if (params?.term_id) {
        params.id = params.term_id;
        delete params["term_id"];
      }
      return API.requestInpursuitPosts("comments-category", params);
    };

    const afterUpdate = () => router.replace({ name: "CommentsCategory" });

    const { deleteData, createOrUpdateData, data } = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      { name: "" }
    );

    const handleDelete = () => {
      data.value = {
        ...data.value,
        ...(data.value?.term_id ? { id: data.value.term_id } : {}),
      };
      deleteData();
    };

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

    const goBack = () => router.replace({ name: "CommentsCategory" });

    return {
      data,
      fields,
      submit,
      handleDelete,
      goBack,
    };
  },
};
</script>
