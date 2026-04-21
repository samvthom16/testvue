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
          {{ $route.query && $route.query.id ? 'Update Member' : 'New Member' }}
        </h1>
        <p class="text-sm text-darkgray mt-0.5">
          {{ $route.query && $route.query.id ? 'Edit this member\'s profile information.' : 'Fill in the details to add a new member.' }}
        </p>
      </div>

      <!-- Avatar upload -->
      <div class="flex flex-col items-center py-6 mb-6 bg-lightergray rounded-2xl">
        <div class="relative w-24 h-24">
          <div class="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-white shadow-sm flex items-center justify-center">
            <img
              v-if="post.featured_image"
              :src="post.featured_image"
              class="w-full h-full object-cover"
            />
            <Icon v-else type="Members" class="w-10 h-10 text-lightgray" />
          </div>
          <button
            type="button"
            @click="$refs.featured.click()"
            class="absolute -bottom-1 -right-1 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center shadow-md hover:bg-lightpurple transition-colors"
          >
            <Icon type="Plus" class="w-4 h-4" />
          </button>
          <div
            v-if="imageUploadFlag"
            class="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center"
          >
            <Icon type="CircularLoader" class="w-6 h-6 text-white" />
          </div>
        </div>
        <input ref="featured" type="file" @change="chooseUserProfile" class="hidden" />
        <p class="mt-3 text-xs text-gray">Tap + to upload a photo</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-8">

        <!-- Personal Information -->
        <section v-if="personalFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Personal Information</h2>
          <div class="md:grid md:grid-cols-2 md:gap-x-6">
            <component
              v-for="field in personalFields"
              :is="field.component"
              :key="field.id"
              :field="field"
              v-model="field.value"
            />
          </div>
        </section>

        <!-- Special Dates -->
        <section v-if="dateFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Special Dates</h2>
          <div class="md:grid md:grid-cols-2 md:gap-x-6">
            <component
              v-for="field in dateFields"
              :is="field.component"
              :key="field.id"
              :field="field"
              v-model="field.value"
            />
          </div>
        </section>

        <!-- Profile Details -->
        <section v-if="dropdownFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Profile Details</h2>
          <div class="md:grid md:grid-cols-2 md:gap-x-6">
            <component
              v-for="field in dropdownFields"
              :is="field.component"
              :key="field.id"
              :field="field"
              v-model="field.value"
            />
          </div>
        </section>

        <!-- Group Membership -->
        <section v-if="checkboxGroupFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Group Membership</h2>
          <component
            v-for="field in checkboxGroupFields"
            :is="field.component"
            :key="field.id"
            :field="field"
            v-model="field.value"
          />
        </section>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3.5 bg-purple text-white rounded-2xl text-sm font-semibold hover:bg-lightpurple transition-colors"
        >
          {{ $route.query && $route.query.id ? 'Update Member' : 'Create Member' }}
        </button>

        <!-- Danger zone -->
        <section v-if="$route.query && $route.query.id">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-3">Danger Zone</h2>
          <button
            type="button"
            @click="deleteItem($route.query.id)"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-red text-red text-sm font-medium hover:bg-red/5 transition-colors"
          >
            <Icon type="Delete" class="w-4 h-4" />
            Delete this member
          </button>
        </section>

      </form>

    </template>
  </PhoneUI>
</template>

<script>
import { ref, computed } from "vue";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import TextField from "@/components/TextField.vue";
import DropDownField from "@/components/DropDownField.vue";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";
import router from "@/router";
import PostEdit from "@/lib/PostEdit";
import ImageUtil from "@/lib/ImageUtil";

export default {
  components: {
    PhoneUI,
    Icon,
    TextField,
    DropDownField,
    CheckboxGroupField,
  },
  setup() {
    const { handleImageSelection } = ImageUtil();
    const imageUploadFlag = ref(false);

    const { fields, post, createOrUpdatePost, deletePost } = PostEdit(
      "inpursuit-members",
      { title: "Full Name", email: "Email Address", phone: "Phone", birthday: "Birthday", wedding: "Wedding" },
      { gender: "Gender", location: "Location", member_status: "Status", profession: "Profession" },
      { featured_image: "", featured_media: 0 },
      { group: "Group" }
    );

    const personalFields = computed(() =>
      fields.value.filter(
        (f) => (f.component === "TextField" || f.component === "TextAreaField") && f.type !== "date"
      )
    );
    const dateFields = computed(() =>
      fields.value.filter((f) => f.component === "TextField" && f.type === "date")
    );
    const dropdownFields = computed(() =>
      fields.value.filter((f) => f.component === "DropDownField")
    );
    const checkboxGroupFields = computed(() =>
      fields.value.filter((f) => f.component === "CheckboxGroupField")
    );

    const chooseUserProfile = (ev) => {
      handleImageSelection(
        ev,
        (src) => {
          post.value.featured_image = src;
          imageUploadFlag.value = true;
        },
        (serverImageUrl, image_id) => {
          post.value.featured_image = serverImageUrl;
          post.value.featured_media = image_id;
          imageUploadFlag.value = false;
        }
      );
    };

    const submit = (ev) => {
      if (ev && ev.preventDefault) ev.preventDefault();
      createOrUpdatePost({ featured_media: post.value.featured_media });
    };

    const deleteItem = (post_id) => {
      if (confirm("Are you sure you want to delete this member?")) {
        deletePost(post_id);
      }
    };

    const goBack = () => {
      if (window.history.length > 2) router.go(-1);
      else router.push({ name: "Members" });
    };

    return {
      post,
      fields,
      personalFields,
      dateFields,
      dropdownFields,
      checkboxGroupFields,
      submit,
      deleteItem,
      goBack,
      chooseUserProfile,
      imageUploadFlag,
    };
  },
};
</script>
