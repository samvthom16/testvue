<template>
  <div class="team-member-actions relative">
    <button v-if="showActionsBtn" @click="handleClick">
      <Icon type="Ellipsis" class="inline" />
    </button>
    <template v-if="show">
      <div class="dropdown-container mt-3 absolute right-0 z-10">
        <div class="dropdown-content" id="dropdown-content">
          <ul class="dropdown-list text-md">
            <li>
              <router-link
                :to="{ name: 'EditTeamMember', query: { id: user.id } }"
              >
                Edit
              </router-link>
            </li>
            <li>
              <button @click="handleAccountStatus">
                {{ isAccountActive({ user }) ? "Deactivate" : "Activate" }} user
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div @click="close" class="dropdown-backdrop"></div>
    </template>
  </div>
</template>
<script>
import API from "@/api";
import store from "@/store";
import { computed, ref } from "vue";
import Icon from "@/components/Icon.vue";

export default {
  name: "TeamMemberProfileActions",
  components: {
    Icon,
  },
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  setup(props, { emit }) {
    const show = ref(false);

    const handleClick = () => {
      show.value = true;
    };

    const close = () => {
      show.value = false;
    };

    const getCurrentUserID = computed(() => store.state.settings?.id ?? 0);

    const showActionsBtn = computed(() =>
      parseInt(getCurrentUserID.value) != props.user.id ? true : false
    );

    const isAccountActive = ({ user } = {}) => {
      return user.roles && user.roles.length;
    };

    const handleAccountStatus = () => {
      const params = {
        method: "post",
        id: props.user.id,
        roles: isAccountActive({ user: props.user }) ? [] : ["editor"],
      };

      store.commit("setProcessing", true);

      API.requestUsers(params).then(
        (response) => {
          store.commit("setProcessing", false);

          close();

          emit("accountStatus", { user: response.data });
        },
        (error) => {
          store.commit("setProcessing", false);

          close();

          console.log("Error: ");
          console.log(error);

          store.commit(
            "notifyError",
            error?.response?.data?.message ??
              "Something went wrong, please try again later!"
          );
        }
      );
    };

    return {
      show,
      close,
      handleClick,
      showActionsBtn,
      isAccountActive,
      handleAccountStatus,
    };
  },
};
</script>

<style scoped>
.dropdown-content {
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 0px 4px,
    rgba(0, 0, 0, 0.15) 0px 2px 8px;

  @apply p-1 border border-lightgray bg-white rounded-md w-52;
}

.dropdown-backdrop {
  z-index: 1;
  @apply fixed top-0 left-0 right-0 bottom-0;
}

.dropdown-list {
  @apply my-2 px-4 bg-lightergray rounded-lg divide-y divide-lightgray bg-white;
}

.dropdown-list li {
  @apply py-3 cursor-pointer relative;
}
</style>
