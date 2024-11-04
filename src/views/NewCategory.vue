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
        v-if="
          $route.name === 'EditTeamMember' ? isEditor({ user: data }) : true
        "
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
            disabled
            type="text"
            :value="data[slug]"
            v-if="$route.name === 'EditTeamMember' && slug === 'email'"
            class="inline-block w-full p-2 border-2 border-solid border-black rounded mb-1 mt-2 opacity-60 cursor-not-allowed"
          />
          <input
            v-else
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
        v-if="$route.query && $route.query.id && isEditor({ user: data })"
        @click="deleteData"
        class="border border-red p-2 rounded text-red text-sm"
      >
        <Icon type="Delete" class="inline" />
        Delete Team Member
      </button>
    </template>
  </PhoneUI>
</template>
<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import API from "@/api";
import Util from "@/lib/Util";
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

    const fields = ref( {
      name: {
        label: "Name",
        type: "text",
        errorMsg: "",
      },
    } );

    const requestAPI = (params) => API.requestUsers( params );

    const afterUpdate = () => router.replace({ name: "Team" });

    const { deleteData, createOrUpdateData, data } = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      {
        name: "",
      }
    );

    const route = useRoute();

    //console.log( route.query )

    const isEditor = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "editor" });



    const resetErrors = () => {
      fields.value.name.errorMsg = "";
    };

    const handleSubmissionError = () => {
      resetErrors();

      let totalErrors = 0;

      const { name } = data.value;

      if ( !name ) {
        fields.value.name.errorMsg = "Cannot be empty";
        totalErrors++;
      }

      if (!totalErrors) return true;

      return false;
    };

    const submit = (ev) => {
      if ( !handleSubmissionError() ) return false;

      createOrUpdateData(ev);
    };

    return {
      data,
      fields,
      submit,
      isEditor,
      deleteData,
    };
  },
};
</script>
