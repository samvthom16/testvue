<template>
  <div class="mb-5">
    <label class="block font-medium text-darkblack text-sm mb-1.5">{{ field.label }}</label>
    <div class="relative">
      <select
        :name="field.id"
        :value="field.value"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full p-3 pr-10 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack appearance-none focus:border-purple focus:bg-white transition-colors"
      >
        <option v-for="(label, value) in field.options" :key="value" :value="value">{{ label }}</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropDownField",
  props: {
    field: Object,
  },
};
</script>
