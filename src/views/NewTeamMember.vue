<template>
  <PhoneUI
    :configUI="configUI"
    :title="$route.query && $route.query.id ? 'Edit Member' : 'Create Member'"
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
      <form @submit="submit">
        <div class="mb-5" v-for="(field, slug) in fields" :key="slug">
          <label class="block font-semibold text-black">{{
            field.label
          }}</label>
          <input
            v-if="field.type === 'text'"
            type="text"
            v-model.trim="data[slug]"
            :disabled="slug === 'email' && $route.name === 'EditTeamMember'"
            :class="[
              'inline-block w-full p-2 border-2 border-solid rounded mb-1 mt-2',
              slug === 'email' && $route.name === 'EditTeamMember'
                ? 'border-black opacity-60 cursor-not-allowed'
                : 'border-black outline-none focus:border-red',
            ]"
          />
          <div
            v-else-if="field.type === 'checkbox'"
            class="flex flex-wrap gap-2 mt-2"
          >
            <div
              v-for="option in field.options"
              :key="option.value"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="option.value"
                v-model="data.group"
                :value="option.value"
                class="mr-2 border-2 border-solid border-black rounded"
              />
              <label :for="option.value" class="text-black text-sm">
                {{ option.label }}
              </label>
            </div>
          </div>
          <span
            v-if="field['errorMsg']"
            class="py-1 inline-block text-purple text-sm font-medium"
          >
            {{ field["errorMsg"] }}
          </span>
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
import { onMounted, ref } from "vue";
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
    const fields = ref({
      first_name: {
        label: "First Name",
        type: "text",
        errorMsg: "",
      },
      last_name: {
        label: "Last Name",
        type: "text",
        errorMsg: "",
      },
      email: {
        label: "Email Address",
        type: "text",
        errorMsg: "",
      },
      group: {
        label: "Limit User Access",
        type: "checkbox",
        options: [],
        errorMsg: "",
      },
    });

    const getUserGroups = async () => {
      try {
        const response = await requestSettings();

        fields.value.group.options = Object.entries(response?.data?.group).map(
          ([id, name]) => ({
            label: name,
            value: id,
          })
        );
      } catch (error) {
        console.error("Error fetching user groups");
        console.log(error);
      }
    };

    const requestAPI = (params) => API.requestUsers(params);

    const requestSettings = () => API.requestSettings();

    const afterUpdate = () => router.replace({ name: "Team" });

    const { deleteData, createOrUpdateData, data } = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      {
        first_name: "",
        last_name: "",
        email: "",
        group: [],
      }
    );

    const route = useRoute();

    //console.log( route.query )

    const isEditor = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "editor" });

    const isValidEmail = (email) => {
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (email && email.match(validRegex)) return true;

      return false;
    };

    const resetErrors = () => {
      fields.value.first_name.errorMsg = "";
      fields.value.last_name.errorMsg = "";
      fields.value.email.errorMsg = "";
    };

    const handleSubmissionError = () => {
      resetErrors();

      let totalErrors = 0;

      const { first_name, last_name, email } = data.value;

      if (!first_name) {
        fields.value.first_name.errorMsg = "Cannot be empty";
        totalErrors++;
      }

      if (!last_name) {
        fields.value.last_name.errorMsg = "Cannot be empty";
        totalErrors++;
      }

      if (!isValidEmail(email)) {
        fields.value.email.errorMsg = "Invalid Email";

        totalErrors++;
      }

      if (!totalErrors) return true;

      return false;
    };

    const submit = (ev) => {
      if (!handleSubmissionError()) return false;

      data.value.name = data.value.first_name + " " + data.value.last_name;

      if (!(route.query && route.query.id)) {
        data.value.roles = ["editor"];
        data.value.username = data.value.email;
        data.value.password = Math.random().toString(36).slice(2, 10);
      }

      //console.log( data.value )

      createOrUpdateData(ev);
    };

    onMounted(async () => {
      await getUserGroups();
    });

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
