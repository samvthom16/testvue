<template>
  <PhoneUI :configUI="configUI">
    <template v-slot:phonebody>
      <div class="w-full max-w-md">

      <!-- Page header -->
      <div class="mb-6">
        <button
          v-if="currentStep !== 0"
          type="button"
          @click="openPreviousForm"
          class="flex items-center gap-1.5 text-darkgray hover:text-darkblack transition-colors mb-4"
        >
          <Icon type="Back" class="w-5 h-5" />
          <span class="text-sm font-medium">Back</span>
        </button>
        <h1 class="text-2xl font-bold text-darkblack">{{ stepTitle }}</h1>
        <p class="text-sm text-darkgray mt-0.5">{{ stepSubtitle }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="space-y-8">

        <section>
          <h2 class="text-xs font-semibold text-gray uppercase tracking-wider mb-4">
            {{ stepSection }}
          </h2>

          <!-- Account URL -->
          <div v-if="currentStep === 0" class="mb-5">
            <label class="block font-medium text-darkblack text-sm mb-1.5">Account URL</label>
            <input
              id="account_url"
              type="text"
              v-model="form.account_url.value"
              placeholder="https://"
              class="inline-block w-full p-3 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
            />
            <div v-if="form.account_url.error_msg" class="text-red text-xs mt-1">{{ form.account_url.error_msg }}</div>
          </div>

          <!-- Email Address -->
          <div v-if="currentStep === 1" class="mb-5">
            <label class="block font-medium text-darkblack text-sm mb-1.5">Email Address</label>
            <input
              id="email_address"
              type="text"
              v-model="form.email_address.value"
              placeholder="you@example.com"
              class="inline-block w-full p-3 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
            />
            <div v-if="form.email_address.error_msg" class="text-red text-xs mt-1">{{ form.email_address.error_msg }}</div>
          </div>

          <!-- OTP -->
          <div v-if="currentStep === 2" class="mb-5">
            <label class="block font-medium text-darkblack text-sm mb-1.5">One-Time Password</label>
            <input
              id="otp"
              type="text"
              v-model="form.otp.value"
              placeholder="6-digit code"
              class="inline-block w-full p-3 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors"
            />
            <div v-if="form.otp.error_msg" class="text-red text-xs mt-1">{{ form.otp.error_msg }}</div>
          </div>
        </section>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="$store.state.processing"
          class="w-full py-3.5 bg-purple text-white rounded-2xl text-sm font-semibold hover:bg-lightpurple transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Icon v-if="$store.state.processing" type="CircularLoader" class="w-4 h-4" />
          <span v-else>{{ currentStep === 2 ? 'Verify & Sign In' : 'Continue' }}</span>
        </button>

      </form>

      </div>
    </template>
  </PhoneUI>
</template>

<script>
import { onMounted, computed } from "vue";
import PhoneUI from "@/components/PhoneUI.vue";
import Icon from "@/components/Icon.vue";
import { useLoginFlow } from "@/lib/useLoginFlow";

export default {
  name: "Login",
  components: { PhoneUI, Icon },
  setup() {
    const configUI = { hide_footer: true, hide_sidebar: true, hide_desktop_header: true, body_classes: 'flex items-center justify-center' };
    const login = useLoginFlow();

    const stepTitle = computed(() => {
      const titles = ['Welcome Back', 'Verify Your Identity', 'Enter Your OTP'];
      return titles[login.currentStep.value] ?? 'Sign In';
    });

    const stepSubtitle = computed(() => {
      const subtitles = [
        'Enter your account URL to get started.',
        'Enter the email address linked to your account.',
        'We sent a code to your email. Enter it below.',
      ];
      return subtitles[login.currentStep.value] ?? '';
    });

    const stepSection = computed(() => {
      const sections = ['Account', 'Email Address', 'Verification'];
      return sections[login.currentStep.value] ?? '';
    });

    onMounted(() => login.focusInput("account_url"));

    return { configUI, stepTitle, stepSubtitle, stepSection, ...login };
  },
};
</script>
