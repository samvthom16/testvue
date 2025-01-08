<template>
  <PhoneUI
    :configUI="configUI"
    :title="$route.query && $route.query.id ? 'Edit Term' : 'Create Term'"
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute="{ name: 'Team' }" />
    </template>
    <template v-slot:headerright>
      <button
        class="text-white text-sm"
        @click="submit"
        v-html="$route.query && $route.query.id ? 'Update' : 'Create'"
      ></button>
    </template>
    <template v-slot:phonebody>
      <form class="" @submit="submit">
        <div class="mb-5" v-for="(field, slug) in fields" :key="field">
          <label class="block font-semibold text-black">{{
            field.label
          }}</label>
          <input
            type="text"
            v-model.trim="data[slug]"
            class="inline-block w-full p-2 border-2 border-solid border-black rounded mb-1 mt-2 outline-none focus:border-red"
          />
          <span
            v-if="field['errorMsg']"
            class="py-1 inline-block text-purple text-sm font-medium"
            >{{ field["errorMsg"] }}</span
          >
        </div>
      </form>
      <button
        @click="handleDelete"
        v-if="$route.query && $route.query.id"
        class="border border-red p-2 rounded text-red text-sm"
      >
        <Icon type="Delete" class="inline" />
        Delete Term
      </button>
    </template>
  </PhoneUI>
</template>
<script>
import API from "@/api";
import { ref } from "vue";
import router from "@/router";
import FormEdit from "@/lib/FormEdit";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import BackButton from "@/templates/PhoneUI/BackButton.vue";

export default {
  components: {
    Icon,
    PhoneUI,
    BackButton,
  },
  data() {
    return {
      configUI: {
        hide_footer: true,
        maintitle_classes: "hidden",
        stickytitle_classes: "opacity-100",
      },
    };
  },
  setup() {
    const fields = ref({
      name: {
        label: "Name",
        type: "text",
        errorMsg: "",
      },
    });

    const requestAPI = (params) => {
      // FOR UPDATE ONLY
      if (params?.term_id) {
        params.id = params.term_id;
        delete params["term_id"];
      }

      return API.requestInpursuitPosts("comments-category", params);
    };
    const afterUpdate = () => router.replace({ name: "CommentsCategory" });

    const handleDelete = () => {
      data.value = {
        ...data.value,
        ...(data.value?.term_id ? { id: data.value?.term_id } : {}),
      };

      deleteData();
    };

    const { deleteData, createOrUpdateData, data } = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      {
        name: "",
      }
    );

    const resetErrors = () => {
      fields.value.name.errorMsg = "";
    };

    const handleSubmissionError = () => {
      resetErrors();

      let totalErrors = 0;

      const { name } = data.value;

      if (!name) {
        fields.value.name.errorMsg = "Cannot be empty";
        totalErrors++;
      }

      if (!totalErrors) return true;

      return false;
    };

    const submit = (ev) => {
      if (!handleSubmissionError()) return false;
      createOrUpdateData(ev);
    };

    return {
      data,
      fields,
      submit,
      handleDelete,
    };
  },
};
</script>
