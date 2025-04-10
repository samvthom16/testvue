<template>
  <Modal @close="close()">
    <template v-slot:modaltitle>
      <h4 class="font-semibold text-black capitalize">
        {{ modalType }} Comment
      </h4>
    </template>
    <template v-slot:modalcontent>
      <textarea
        v-if="modalType == 'edit'"
        placeholder="Type your comment"
        v-model="newComment"
        class="inline-block p-2 w-full border-black outline-none focus:border-red rounded"
      ></textarea>

      <div v-if="modalType == 'reschedule'">
        <label for="dateInput" class="block text-gray-700 mb-2"
          >Select Date:</label
        >
        <input
          type="date"
          id="dateInput"
          name="dateInput"
          class="inline-block w-full p-2 border-2 border-solid border-black rounded mb-1 mt-2 outline-none focus:border-red"
          v-model="selectedDate"
          :max="maxDate(new Date(item.date))"
          :min="minDate(new Date(item.date))"
        />
      </div>
      <div v-if="isDateWithinRange(item.date)" class="h-8 relative mt-4 mb-2">
        <button
          class="absolute right-0 bg-purple text-white p-2 text-sm rounded"
          @click="saveComment"
          :disabled="processing"
          :class="{ 'cursor-not-allowed': processing }"
        >
          Update Comment
        </button>
      </div>
      <div class="text-red text-xs">{{ error_msg }}</div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "EditComment",
  props: {
    id: String,
    item: Object,
    modalType: String,
  },
  components: {
    Modal,
  },
  mixins: [apiMixin],
  data() {
    return {
      processing: false,
      newComment: this.item.text,
      error_msg: "",
      selectedDate: this.formatDate(this.item.date),
    };
  },
  watch: {
    item(newItem) {
      this.newComment = newItem.text;
      this.selectedDate = this.formatDate(newItem.date);
    },
  },
  methods: {
    close() {
      this.$emit("close");
      this.error_msg = "";
      this.selectedDate = this.formatDate(this.item.date);
      this.newComment = this.item.text;
    },

    setProcessing(flag) {
      this.processing = flag;
      this.$store.commit("setProcessing", this.processing);
    },

    saveComment(ev) {
      ev.preventDefault();
      var component = this;
      let data = {};
      const time = this.item.date.split(" ")[1];

      let updatedDateStamp = `${this.selectedDate} ${time}`;

      const selectedDate = new Date(this.selectedDate);

      if (this.modalType == "reschedule") {
        if (!this.isValidDate(selectedDate)) {
          component.error_msg = `Invalid Date`;
          return;
        }
        data.modified_on = updatedDateStamp;
      } else if (this.modalType == "edit") {
        if (!component.newComment || component.newComment.trim() == "") {
          component.error_msg = "This field cannot be left empty.";
          return false;
        }
        data.comment = component.newComment;
      }
      data.post = this.item.post_id;

      component.setProcessing(true);

      component.putComment(component.id, data).then(
        () => {
          component.setProcessing(false);

          component.newComment = this.item.text;
          component.close();
          component.$emit("itemComment");
        },
        (error) => {
          component.$store.commit("notifyError", error);
          component.setProcessing(false);

          component.error_msg = "" + error;
          return false;
        }
      );
    },
    formatDate(dateString) {
      return dateString.split(" ")[0];
    },
    maxDate(dateString) {
      if (dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate());
        return date.toISOString().split("T")[0];
      }
      return "";
    },
    minDate(dateString) {
      if (dateString) {
        const oneMonthBefore = new Date(dateString);
        oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
        return oneMonthBefore.toISOString().split("T")[0];
      }
      return "";
    },
    isValidDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return false;
      }

      const year = date.getFullYear();
      if (year < 2000 || year > 3000) {
        return false;
      }

      return true;
    },
    isDateWithinRange(date) {
      return (
        (this.selectedDate < this.maxDate(new Date(date)) &&
          this.selectedDate > this.minDate(new Date(date))) ||
        this.modalType == "edit"
      );
    },
  },
};
</script>
