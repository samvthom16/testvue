<template>
  <PhoneUI title="Comment Types" :configUI="{ hide_desktop_header: true }">
    <template v-slot:phonebody>

      <!-- Page header -->
      <div class="mb-5">
        <router-link
          :to="{ name: 'Settings' }"
          class="inline-flex items-center gap-1.5 text-darkgray hover:text-darkblack transition-colors mb-4"
        >
          <Icon type="Back" class="w-5 h-5" />
          <span class="text-sm font-medium">Settings</span>
        </router-link>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-darkblack">Comment Types</h1>
            <p class="text-sm text-darkgray mt-0.5">Manage categories for member comments and notes.</p>
          </div>
          <button
            @click="openModal()"
            class="hidden md:inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors"
          >
            <Icon type="Plus" class="w-4 h-4" />
            New Type
          </button>
        </div>
      </div>

      <!-- Comment types list -->
      <OrbitPosts apiType="inpursuit" :params="params" :key="params.unique_id" @edit-item="openModal">
        <template v-slot:loadingAnimation>
          <CategoryListAnimation :total="8" />
        </template>
        <template v-slot:nextPageAnimation>
          <PaginationLoaderAnimation />
        </template>
        <template v-slot:whenempty>
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 rounded-3xl bg-lightergray flex items-center justify-center mb-5">
              <Icon type="Comments" class="w-9 h-9 text-lightgray" />
            </div>
            <p class="font-semibold text-darkblack text-lg">No comment types found</p>
            <p class="text-sm text-gray mt-2 max-w-xs">Add your first comment type to start categorising member notes.</p>
            <button
              @click="openModal()"
              class="mt-6 inline-flex items-center gap-2 bg-purple text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-lightpurple transition-colors"
            >
              <Icon type="Plus" class="w-4 h-4" />
              Add First Type
            </button>
          </div>
        </template>
      </OrbitPosts>

      <!-- FAB (mobile only) -->
      <button
        @click="openModal()"
        class="md:hidden fixed bottom-24 right-5 z-20 bg-purple text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:bg-lightpurple transition-colors"
      >
        <Icon type="Plus" class="w-6 h-6" />
      </button>

      <!-- Modal -->
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
          <div class="relative bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-xl p-6">
            <h2 class="text-lg font-bold text-darkblack mb-1">
              {{ modalId ? 'Edit Comment Type' : 'New Comment Type' }}
            </h2>
            <p class="text-sm text-darkgray mb-5">
              {{ modalId ? 'Update this comment type.' : 'Add a new comment type to the list.' }}
            </p>
            <form @submit.prevent="submitModal">
              <label class="block text-sm font-medium text-darkblack mb-1.5">Name</label>
              <input
                ref="modalInput"
                type="text"
                v-model.trim="modalName"
                placeholder="Name"
                class="w-full p-3 border border-lightgray rounded-xl bg-lightergray outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
              />
              <p v-if="modalError" class="mt-1.5 text-xs text-red">{{ modalError }}</p>

              <button
                type="submit"
                class="mt-5 w-full py-3.5 bg-purple text-white rounded-2xl text-sm font-semibold hover:bg-lightpurple transition-colors"
              >
                {{ modalId ? 'Update Comment Type' : 'Create Comment Type' }}
              </button>

              <section v-if="modalId" class="mt-4">
                <h3 class="text-xs font-semibold text-gray uppercase tracking-wider mb-3">Danger Zone</h3>
                <button
                  type="button"
                  @click="deleteModal"
                  class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-red text-red text-sm font-medium hover:bg-red/5 transition-colors"
                >
                  <Icon type="Delete" class="w-4 h-4" />
                  Delete Comment Type
                </button>
              </section>
            </form>
          </div>
        </div>
      </Teleport>

    </template>
  </PhoneUI>
</template>

<script>
import { ref, nextTick } from "vue";
import Icon from "@/components/Icon.vue";
import PhoneUI from "@/components/PhoneUI.vue";
import CategoryListAnimation from "@/templates/Animation/CategoryList.vue";
import PaginationLoaderAnimation from "@/templates/Animation/PaginationLoader.vue";
import API from "@/api";
import store from "@/store";

export default {
  name: "CommentsCategory",
  components: {
    Icon,
    PhoneUI,
    CategoryListAnimation,
    PaginationLoaderAnimation,
  },

  setup() {
    const params = ref({
      unique_id:  1,
      per_page:   10,
      post_type:  "comments-category",
      style:      "ListWithTermName",
      pagination: 1,
    });

    // Modal state
    const showModal  = ref(false);
    const modalId    = ref(null);
    const modalName  = ref('');
    const modalError = ref('');
    const modalInput = ref(null);

    const openModal = (post = null) => {
      modalId.value    = post?.term_id ?? null;
      modalName.value  = post?.name ?? '';
      modalError.value = '';
      showModal.value  = true;
      nextTick(() => modalInput.value?.focus());
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const withProcessing = (apiCall, onSuccess) => {
      store.commit('setProcessing', true);
      apiCall().then(
        () => { store.commit('setProcessing', false); onSuccess(); },
        () => { store.commit('setProcessing', false); }
      );
    };

    const submitModal = () => {
      if (!modalName.value) {
        modalError.value = 'Cannot be empty';
        return;
      }
      const apiParams = { name: modalName.value, method: 'post' };
      if (modalId.value) apiParams.id = modalId.value;
      withProcessing(
        () => API.requestInpursuitPosts("comments-category", apiParams),
        () => { closeModal(); params.value.unique_id++; }
      );
    };

    const deleteModal = () => {
      if (!confirm('Are you sure you want to delete this information?')) return;
      withProcessing(
        () => API.requestInpursuitPosts("comments-category", {
          method:   'delete',
          id:       modalId.value,
          reassign: store.state.settings.id,
        }),
        () => { closeModal(); params.value.unique_id++; }
      );
    };

    return {
      params,
      showModal,
      modalId,
      modalName,
      modalError,
      modalInput,
      openModal,
      closeModal,
      submitModal,
      deleteModal,
    };
  },
};
</script>
