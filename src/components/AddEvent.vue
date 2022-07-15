<template>
  <div class="add_event">
    <form @submit="submit">
      <TextField
        class="mt-4"
        :field="formfield"
        v-model="formfield.value"
        v-for="(formfield, key) in form"
        :key="key"
        :isHidden="false"
        :isDropDown="false"
      />

      <DropDownField
        :field="formDropDown.type"
        v-model="formDropDown.type.value"
        :options="eventTypeData"
      />

      <DropDownField
        :field="formDropDown.location"
        v-model="formDropDown.location.value"
        :options="locationData"
      />

      <button
        :disabled="$store.state.processing"
        :class="{ 'cursor-not-allowed': $store.state.processing }"
        class="
          bg-purple
          inline-block
          w-full
          text-white
          mb-2
          border-purple
          p-2
          border
          rounded
        "
        type="submit"
      >
        <svg
          :class="{
            inline: $store.state.processing,
            hidden: !$store.state.processing,
          }"
          class="animate-spin h-5 w-5 text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span v-if="!$store.state.processing">Add Event</span>
        <span v-if="$store.state.processing">Processing</span>
      </button>
    </form>
  </div>
</template>

<script>
import TextField from "./TextField.vue";
import DropDownField from "./DropDownField.vue";
import apiMixin from "@/mixins/APIMixin.js";

export default {
  name: "AddEvent",
  components: { TextField, DropDownField },
  mixins: [apiMixin],
  props: {
    eventTypeData: Object,
    locationData: Object,
  },
  data() {
    return {
      processing: false,
      formSteps: ["title", "date", "description", "type", "location"],
      form: {
        title: {
          label: "Event Title",
          error_msg: "",
          value: "",
          type: "text",
        },
        date: {
          label: "Event Date",
          error_msg: "",
          value: "",
          type: "date",
        },
        description: {
          label: "Event Description",
          error_msg: "",
          value: "",
          type: "text",
        },
      },
      formDropDown: {
        type: {
          label: "Event Type",
          error_msg: "",
          value: "",
          type: "text",
        },
        location: {
          label: "Event Location",
          error_msg: "",
          value: "",
          type: "password",
        },
      },
    };
  },
  methods: {
    setProcessing(flag) {
      this.processing = flag;
      this.$store.commit("setProcessing", this.processing);
    },
    submit(e) {
      e.preventDefault();

      if (this.$store.state.processing) {
        console.log("Already processing something");
        return false;
      }

      var component = this;

      // SET THE PROCESSING FLAG TO INDICATE FORM HAS BEEN SUBMITTED
      component.setProcessing(true);

      var empty_flag = false;
      for (var key in component.form) {
        // RESET ERROR MESSAGE
        component.form[key].error_msg = "";
        // CHECK FOR EMPTY FIELD
        if (!component.form[key].value) {
          component.form[key].error_msg = "This field cannot be left empty.";
          empty_flag = true;
        }
      }

      //TODO: validation for dropdown fields if mandatory

      // IF ANY OF THE FIELDS IS EMPTY, SHOULD SHOW THE ERROR MESSAGE
      if (empty_flag) {
        component.setProcessing(false);
        return false;
      }
      //CONVERT DATE
      var dateEntered = new Date(component.form.date.value);
      var eventDate = dateEntered.toISOString();

      component
        .addEvent(
          component.form.title.value,
          eventDate,
          component.form.description.value,
          component.formDropDown.type.value,
          component.formDropDown.location.value,
          "publish"
        )
        .then(
          (respone) => {
            this.setProcessing(false);
            this.closeModal(respone.data.id);
          },
          (error) => {
            console.log("" + error);
            component.setProcessing(false);
            return false;
          }
        );
    },
    closeModal(id) {
      this.$emit("close", { modal: false, id: id });
    },
  },
};
</script>

<style scoped>
.button {
  @apply border border-purple font-semibold p-2 px-4 rounded-lg bg-purple text-sm text-white;
}
.title {
  @apply text-xl font-bold leading-none;
}
</style>
