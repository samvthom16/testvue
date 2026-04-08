<template>
  <PhoneUI :configUI="configUI" title="Login">
    <template v-slot:headericon>
      <button v-if="currentStep !== 0" @click="openPreviousForm()">
        <Icon type="Back" />
      </button>
    </template>
    <template v-slot:headerright>
      <button
        class="text-white text-sm"
        @click="submit"
        v-if="!$store.state.processing"
      >
        Next
      </button>
      <Icon
        type="CircularLoader"
        class="ml-2"
        :class="{
          inline: $store.state.processing,
          hidden: !$store.state.processing,
        }"
      />
    </template>
    <template v-slot:phonebody>
      <form class="p-4 max-w-lg m-auto" @submit="submit">
        <TextField
          class="mt-10"
          :field="formfield"
          :isHidden="formSteps[currentStep] !== key"
          v-model="formfield.value"
          v-for="(formfield, key) in form"
          :key="key"
        />
      </form>
    </template>
  </PhoneUI>
</template>

<script>
import { onMounted } from "vue";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import TextField from "@/components/TextField.vue";
import { useLoginFlow } from "@/lib/useLoginFlow";

export default {
  name: "Login",
  components: { PhoneUI, Icon, TextField },
  setup() {
    const configUI = { hide_footer: true };
    const login = useLoginFlow();

    onMounted(() => login.focusInput("account_url"));

    return { configUI, ...login };
  },
};
</script>

<style scoped>
#header-icons-menu {
  display: none;
}
</style>
