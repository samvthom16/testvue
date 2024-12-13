<template>
  <PhoneUI
    :configUI="configUI"
    :title="
      $route.query && $route.query.id ? 'Update Member' : 'Create a Member'
    "
  >
    <template v-slot:headericon>
      <BackButton :defaultRoute="{ name: 'Members' }" />
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
        <div
          class="relative border border-black bg-gray w-36 h-36 mx-auto my-10 rounded-full"
        >
          <input
            ref="featured"
            type="file"
            @change="chooseUserProfile"
            class="hidden"
          />
          <img
            v-if="post.featured_image"
            :src="post.featured_image"
            width="100"
            height="100"
            class="w-full h-full rounded-full object-cover"
          />
          <button
            type="button"
            @click="$refs.featured.click"
            class="text-xs bg-orange p-2 px-4 rounded-full absolute border left-1/2 transform -translate-x-1/2 -bottom-2"
          >
            Upload
          </button>

          <div
            class="p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            :class="{ hidden: !imageUploadFlag }"
          >
            <Icon type="CircularLoader" class="mx-auto h-8 w-8" />
          </div>
        </div>

        {{ console.log(fields) }}

        <component
          v-for="field in fields"
          :is="field.component"
          :key="field"
          :field="field"
          v-model="field.value"
        >
        </component>
      </form>
      <button
        v-if="$route.query && $route.query.id"
        @click="deleteItem($route.query.id)"
        class="border border-red p-2 rounded text-red text-sm"
      >
        <Icon type="Delete" class="inline" />
        Delete this member
      </button>
    </template>
  </PhoneUI>
</template>
<script>
import PhoneUI from "@/components/PhoneUI.vue";
import BackButton from "@/templates/PhoneUI/BackButton.vue";
import Icon from "@/components/Icon.vue";
import TextField from "@/components/TextField.vue";
import DropDownField from "@/components/DropDownField.vue";

import router from "@/router";

import PostEdit from "@/lib/PostEdit";
import ImageUtil from "@/lib/ImageUtil";
import CheckboxGroupField from "@/components/CheckboxGroupField.vue";

import { ref } from "vue";

export default {
  components: {
    PhoneUI,
    BackButton,
    Icon,
    TextField,
    DropDownField,
    CheckboxGroupField,
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
    /*
     * IMAGE UTILITY
     */
    const { handleImageSelection } = ImageUtil();

    const imageUploadFlag = ref(false);

    /*
     * TAKES THE FOLLOWING PARAMETERS
     * POST TYPE, TEXTFIELDS, DROPDOWNFIELDS
     */
    const { fields, post, createOrUpdatePost, deletePost } = PostEdit(
      "inpursuit-members",
      // TEXTFIELDS
      {
        title: "Full Name",
        email: "Email Address",
        phone: "Phone",
      },
      // DROPDOWNFIELDS
      {
        gender: "Gender",
        location: "Location",
        member_status: "Status",
        profession: "Profession",
        // group: "Group",
      },

      // DEFAULT POST
      {
        featured_image: "",
        featured_media: 0,
      },
      // CHECKBOXES FIELDS
      {
        group: "Group",
      }
    );

    const chooseUserProfile = (ev) => {
      handleImageSelection(
        ev,
        (src) => {
          //console.log( src )
          //console.log( po)
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
      ev.preventDefault();

      createOrUpdatePost({
        featured_media: post.value.featured_media,
      });
    };

    const deleteItem = (post_id) => {
      if (confirm("Are you sure you want to delete this information?")) {
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
      submit,
      deleteItem,
      goBack,
      chooseUserProfile,
      imageUploadFlag,
    };
  },
};
</script>
