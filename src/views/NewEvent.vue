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
          {{ $route.query && $route.query.id ? 'Update Event' : 'New Event' }}
        </h1>
        <p class="text-sm text-darkgray mt-0.5">
          {{ $route.query && $route.query.id ? 'Edit this event\'s details.' : 'Fill in the details to create a new event.' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-8">

        <!-- Event Details -->
        <section v-if="textFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Event Details</h2>
          <div class="md:grid md:grid-cols-2 md:gap-x-6">
            <component
              v-for="field in textFields"
              :is="field.component"
              :key="field.id"
              :field="field"
              v-model="field.value"
            />
          </div>
        </section>

        <!-- Description -->
        <section v-if="textareaFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Description</h2>
          <component
            v-for="field in textareaFields"
            :is="field.component"
            :key="field.id"
            :field="field"
            v-model="field.value"
          />
        </section>

        <!-- Categorization -->
        <section v-if="dropdownFields.length">
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">Categorization</h2>
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

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-3.5 bg-purple text-white rounded-2xl text-sm font-semibold hover:bg-lightpurple transition-colors"
        >
          {{ $route.query && $route.query.id ? 'Update Event' : 'Create Event' }}
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
            Delete this event
          </button>
        </section>

      </form>

    </template>
  </PhoneUI>
</template>

<script>
import { computed } from "vue";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import TextField from "@/components/TextField.vue";
import TextAreaField from "@/components/TextAreaField.vue";
import DropDownField from "@/components/DropDownField.vue";
import router from "@/router";
import PostEdit from "@/lib/PostEdit";

export default {
  components: {
    PhoneUI,
    Icon,
    TextField,
    TextAreaField,
    DropDownField,
  },
  setup() {
    const { fields, post, createOrUpdatePost, deletePost } = PostEdit(
      "inpursuit-events",
      { title: "Event Title", date: "Event Date", content: "Event Description" },
      { event_type: "Event Type", location: "Location" }
    );

    const textFields = computed(() =>
      fields.value.filter((f) => f.component === "TextField")
    );
    const textareaFields = computed(() =>
      fields.value.filter((f) => f.component === "TextAreaField")
    );
    const dropdownFields = computed(() =>
      fields.value.filter((f) => f.component === "DropDownField")
    );

    const submit = (ev) => {
      if (ev && ev.preventDefault) ev.preventDefault();
      createOrUpdatePost({ featured_media: post.featured_media });
    };

    const deleteItem = (post_id) => {
      if (confirm("Are you sure you want to delete this event?")) {
        deletePost(post_id);
      }
    };

    const goBack = () => {
      if (window.history.length > 2) router.go(-1);
      else router.push({ name: "Events" });
    };

    return {
      post,
      fields,
      textFields,
      textareaFields,
      dropdownFields,
      submit,
      deleteItem,
      goBack,
    };
  },
};
</script>
