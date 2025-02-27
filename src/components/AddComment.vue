<template>
  <Modal @close="close()">
    <template v-slot:modaltitle>
      <h4 class="font-semibold text-black">Add Comment</h4>
    </template>
    <template v-slot:modalcontent>
      <textarea
        placeholder="Type your comment"
        v-model="newComment"
        class="inline-block p-2 w-full border-black outline-none focus:border-red rounded"
      ></textarea>
      <div class="mt-2 mb-5">
        <label class="block font-semibold text-black">{{
          comments_category.label
        }}</label>
        <select
          :name="comments_category.id"
          v-model="comments_category.value"
          class="border-2 border-solid border-black p-2 w-full rounded mb-1 mt-2 bg-white"
        >
          <option
            v-for="(termName, termId) in commentsCategoryOptions"
            :key="termId"
            v-html="termName"
            :value="termId"
          ></option>
        </select>
      </div>
      <div class="h-8 relative mt-4 mb-2">
        <button
          class="absolute right-0 bg-purple text-white p-2 text-sm rounded"
          @click="saveComment"
          :disabled="processing"
          :class="{ 'cursor-not-allowed': processing }"
        >
          Post Comment
        </button>
      </div>
    </template>
  </Modal>
</template>

<script>
import apiMixin from "@/mixins/APIMixin.js";
import Modal from "@/components/Modal.vue";

export default {
  name: "AddComment",
  props: {
    id: Number,
    item: Object,
  },
  components: {
    Modal,
  },
  mixins: [apiMixin],
  data() {
    return {
      processing: false,
      openComment: false,
      newComment: "",
      error_msg: "",
      comments_category: {
        id: "comments_category",
        label: "Categories",
        value: 0,
      },
    };
  },
  computed: {
    commentsCategoryOptions() {
      return {
        0: "Select",
        ...this.$store.state.account?.comments_category,
      };
    },
  },
  methods: {
    getScheduleLink() {
      var link =
        "http://www.google.com/calendar/render?action=TEMPLATE&trp=false&text=";
      var item = this.item;
      if (item.title && item.title.rendered) {
        link += "Follow up with " + item.title.rendered;
      }
      return link;
    },

    /*
     * SET PROCESSING
     */
    setProcessing(flag) {
      this.processing = flag;
      this.$store.commit("setProcessing", this.processing);
    },

    close() {
      this.$emit("close");
    },

    saveComment(ev) {
      ev.preventDefault();

      var component = this;

      if (!component.newComment) {
        component.error_msg = "This field cannot be left empty.";
        return false;
      }

      // SET PROCESSING
      component.setProcessing(true);

      component
        .postComment(
          component.id,
          component.newComment,
          component.comments_category.value
        )
        .then(
          () => {
            /*
             * RESET PROCESSING: THIS SHOULD BE IN THE BEGINNING SO THAT IT DOES NOT CONFLICT WITH ANY OTHER THAT IS FOLLOWING
             */
            component.setProcessing(false);

            //console.log( response );
            component.newComment = "";
            component.comments_category.value = 0;
            component.close();
            component.$emit("postComment");
          },
          (error) => {
            // NOTIFY ERROR
            component.$store.commit("notifyError", error);
            component.setProcessing(false);

            component.error_msg = "" + error;
            return false;
          }
        );
    },
  },
};
</script>
