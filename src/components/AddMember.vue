<template>
  <div class="add_member">
    <form class="p-10 max-w-sm m-auto" @submit="submit">
      <h1 class="font-semibold mb-5 text-lg">Add New Member</h1>
      <TextField
        class="mt-5"
        :field="formfield"
        v-model="formfield.value"
        v-for="(formfield, key) in form"
        :key="key"
        :isHidden="false"
        :isDropDown="false"
      />

      <DropDownField
        :field="formDropDown.gender"
        v-model="formDropDown.gender.value"
        :options="genderData"
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
          mb-5
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
  name: "AddMember",
  components: { TextField, DropDownField },
  mixins: [apiMixin],
  props: {
    locationData: Object,
    genderData: Object,
  },
  data() {
    return {
      processing: false,
      form: {
        title: {
          label: "Full Name",
          error_msg: "",
          value: "",
          type: "text",
        },
        emailAddress: {
          label: "Email Address",
          error_msg: "",
          value: "",
          type: "text",
        },
        phoneNumber: {
          label: "Phone Number",
          error_msg: "",
          value: "",
          type: "text",
        },
        dateOfBirth: {
          label: "Date of Birth",
          error_msg: "",
          value: "",
          type: "date",
        },
        dateOfWedding: {
          label: "Date of Wedding",
          error_msg: "",
          value: "",
          type: "date",
        },
      },
      formDropDown: {
        gender: {
          label: "Gender",
          error_msg: "",
          value: "",
          type: "",
        },
        location: {
          label: "Event Location",
          error_msg: "",
          value: "",
          type: "",
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

      //VALIDATE NAME FIELD
      if (!component.form.title.value) {
        component.form.title.error_msg = "This field cannot be left empty.";
        empty_flag = true;
      } else {
        component.form.title.error_msg = "";
      }

      //VALIDATE GENDER FIELD
      if (!component.formDropDown.gender.value) {
        component.formDropDown.gender.error_msg =
          "This field cannot be left empty.";
        empty_flag = true;
      } else {
        component.formDropDown.gender.error_msg = "";
      }

      //VALIDATE EMAIL-ID
      var email_address = component.form.emailAddress.value.trim();
      if (email_address) {
        var validRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email_address.match(validRegex)) {
          component.form.emailAddress.error_msg = "Invalid Email Address";
          empty_flag = true;
        } else {
          component.form.emailAddress.error_msg = "";
        }
      }

      //VALIDATE PHONE NUMBER
      var phone_number = component.form.phoneNumber.value.trim();
      if (phone_number) {
        var validPhoneRegex = /^[6-9]\d{9}$/gi;

        if (!phone_number.match(validPhoneRegex)) {
          component.form.phoneNumber.error_msg = "Invalid phone Address";
          empty_flag = true;
        } else {
          component.form.phoneNumber.error_msg = "";
        }
      }

      // IF ANY OF THE FIELDS IS EMPTY, SHOULD SHOW THE ERROR MESSAGE
      if (empty_flag) {
        component.setProcessing(false);
        return false;
      }

      //CONVERT DATES
      var dateOfBirth = "";
      var dateOfWedding = "";

      if (component.form.dateOfBirth.value) {
        dateOfBirth = component.convertDate(component.form.dateOfBirth.value);
      }
      if (component.form.dateOfWedding.value) {
        dateOfWedding = component.convertDate(
          component.form.dateOfWedding.value
        );
      }

      component
        .addMember(
          component.form.title.value,
          component.form.emailAddress.value,
          component.form.phoneNumber.value,
          dateOfBirth,
          dateOfWedding,
          component.formDropDown.gender.value,
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
    convertDate(dateString) {
      var date = new Date(dateString),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
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