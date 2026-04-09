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
          {{ $route.name === 'EditTeamMember' ? 'Edit Team Member' : 'New Team Member' }}
        </h1>
        <p class="text-sm text-darkgray mt-0.5">
          {{ $route.name === 'EditTeamMember' ? 'Update this team member\'s details.' : 'Fill in the details to invite a new team member.' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-8">

        <!-- Account Details -->
        <section>
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Account Details</h2>
          <div class="md:grid md:grid-cols-2 md:gap-x-6">

            <div class="mb-5">
              <label class="block font-medium text-darkblack text-sm mb-1.5">First Name</label>
              <input
                type="text"
                v-model.trim="data.first_name"
                placeholder="First Name"
                class="inline-block w-full p-3 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
              />
              <div v-if="errors.first_name" class="text-red text-xs">{{ errors.first_name }}</div>
            </div>

            <div class="mb-5">
              <label class="block font-medium text-darkblack text-sm mb-1.5">Last Name</label>
              <input
                type="text"
                v-model.trim="data.last_name"
                placeholder="Last Name"
                class="inline-block w-full p-3 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
              />
              <div v-if="errors.last_name" class="text-red text-xs">{{ errors.last_name }}</div>
            </div>

            <div class="mb-5 md:col-span-2">
              <label class="block font-medium text-darkblack text-sm mb-1.5">Email Address</label>
              <input
                type="text"
                v-model.trim="data.email"
                placeholder="Email Address"
                :disabled="$route.name === 'EditTeamMember'"
                :class="[
                  'inline-block w-full p-3 border rounded-xl mb-1 mt-1 outline-none text-darkblack placeholder-gray transition-colors',
                  $route.name === 'EditTeamMember'
                    ? 'border-lightgray bg-lightergray opacity-60 cursor-not-allowed'
                    : 'border-lightgray bg-lightergray focus:border-purple focus:bg-white'
                ]"
              />
              <div v-if="errors.email" class="text-red text-xs">{{ errors.email }}</div>
            </div>

          </div>
        </section>

        <!-- Access & Permissions -->
        <section v-if="groupOptions.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Access &amp; Permissions</h2>
          <div class="mb-5">
            <label class="block font-medium text-darkblack text-sm mb-2">Limit User Access</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in groupOptions"
                :key="option.value"
                type="button"
                @click="toggleGroup(option.value)"
                class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
                :class="data.group.includes(option.value)
                  ? 'bg-purple text-white'
                  : 'bg-lightergray text-darkgray hover:bg-lightgray'"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </section>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3.5 bg-purple text-white rounded-2xl text-sm font-semibold hover:bg-lightpurple transition-colors"
        >
          {{ $route.name === 'EditTeamMember' ? 'Update Team Member' : 'Create Team Member' }}
        </button>

        <!-- Danger Zone -->
        <section v-if="$route.name === 'EditTeamMember' && isEditor({ user: data })">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-3">Danger Zone</h2>
          <button
            type="button"
            @click="deleteData"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-red text-red text-sm font-medium hover:bg-red/5 transition-colors"
          >
            <Icon type="Delete" class="w-4 h-4" />
            Delete this team member
          </button>
        </section>

      </form>

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

export default {
  components: {
    Icon,
    PhoneUI,
  },
  setup() {
    const route = useRoute();
    const groupOptions = ref([]);
    const errors = ref({ first_name: "", last_name: "", email: "" });

    const requestAPI = (params) => API.requestUsers(params);
    const afterUpdate = () => router.replace({ name: "Team" });

    const { deleteData, createOrUpdateData, data } = FormEdit(
      requestAPI,
      afterUpdate,
      afterUpdate,
      { first_name: "", last_name: "", email: "", group: [] }
    );

    const getUserGroups = async () => {
      try {
        const response = await API.requestSettings();
        groupOptions.value = Object.entries(response?.data?.group || {}).map(
          ([id, name]) => ({ label: name, value: id })
        );
      } catch (error) {
        console.error("Error fetching user groups", error);
      }
    };

    const toggleGroup = (value) => {
      const idx = data.value.group.indexOf(value);
      if (idx === -1) data.value.group.push(value);
      else data.value.group.splice(idx, 1);
    };

    const isEditor = ({ user }) =>
      Util.hasUserRole({ user, searchRole: "editor" });

    const isValidEmail = (email) =>
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

    const submit = (ev) => {
      errors.value = { first_name: "", last_name: "", email: "" };
      let valid = true;

      if (!data.value.first_name) {
        errors.value.first_name = "Cannot be empty";
        valid = false;
      }
      if (!data.value.last_name) {
        errors.value.last_name = "Cannot be empty";
        valid = false;
      }
      if (!isValidEmail(data.value.email)) {
        errors.value.email = "Invalid email address";
        valid = false;
      }

      if (!valid) return;

      data.value.name = data.value.first_name + " " + data.value.last_name;

      if (route.name !== "EditTeamMember") {
        data.value.roles = ["editor"];
        data.value.username = data.value.email;
        data.value.password = Math.random().toString(36).slice(2, 10);
      }

      createOrUpdateData(ev);
    };

    const goBack = () => {
      if (window.history.length > 2) router.go(-1);
      else router.push({ name: "Team" });
    };

    onMounted(async () => {
      await getUserGroups();
    });

    return {
      data,
      errors,
      groupOptions,
      toggleGroup,
      submit,
      deleteData,
      isEditor,
      goBack,
    };
  },
};
</script>
