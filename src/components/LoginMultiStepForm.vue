<template>
  <div class="p-10 max-w-sm m-auto">
    <component
      :is="steps[currentStep].component"
      :formValue="formValue[steps[currentStep].label]"
      @formValueChange="updateFormValue"
    ></component>

    <div class="flex flex-row justify-between">
      <button
        v-if="currentStep !== 0"
        type="button"
        @click="previous"
        class="
          my-2
          border-purple
          p-2
          font-semibold
          px-4
          rounded-lg
          bg-purple
          text-sm text-white
        "
      >
        Previous
      </button>

      <button
        v-if="currentStep < steps.length - 1"
        type="button"
        @click="next"
        class="
          my-2
          border-purple
          p-2
          font-semibold
          px-4
          rounded-lg
          bg-purple
          text-sm text-white
        "
      >
        Next
      </button>
    </div>

    <button
      v-if="currentStep === steps.length - 1"
      @click="submit"
      :disabled="$store.state.processing"
      :class="{ 'cursor-not-allowed': $store.state.processing }"
      class="
        bg-purple
        inline-block
        w-full
        text-white
        border-purple
        p-2
        px-4
        mt-8
        border
        rounded-lg
        text-md
        font-semibold
      "
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
      <span v-if="!$store.state.processing">Submit</span>
      <span v-if="$store.state.processing">Processing</span>
    </button>
  </div>
</template>


<script>
import AccountUrl from "./Steps/AccountUrl.vue";
import UserName from "./Steps/UserName.vue";
import Password from "./Steps/Password.vue";

export default {
  name: "LoginMultiStepForm",
  data() {
    return {
      currentStep: 0,
      formValue: {
        accountUrl: {
          url: "",
        },
        userName: {
          text: "",
        },
        password: {
          text: "",
        },
      },
      steps: [
        {
          component: AccountUrl,
          label: "accountUrl",
        },
        {
          component: UserName,
          label: "userName",
        },
        {
          component: Password,
          label: "password",
        },
      ],
    };
  },
  methods: {
    next() {
      this.currentStep += 1;
    },
    previous() {
      this.currentStep -= 1;
    },
    updateFormValue(payload) {
      console.warn("payload" + payload.label);
      console.warn("payload data" + payload.data);

      this.formValue = {
        ...this.formValue,
        [payload.label]: payload.data,
      };
    },
    submit() {
      console.log(this.formValue);
    },
  },
  props: {
    msg: String,
  },
  components: [AccountUrl, UserName, Password],
};
</script>
