<template>
  <div class="mb-5">
    <label class="block font-medium text-darkblack text-sm mb-2">{{ field.label }}</label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(optionLabel, optionValue) in field.options"
        :key="optionValue"
        type="button"
        @click="toggleOption(String(optionValue))"
        class="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="internalValue.includes(String(optionValue))
          ? 'bg-purple text-white'
          : 'bg-lightergray text-darkgray hover:bg-lightgray'"
      >
        {{ optionLabel }}
      </button>
    </div>
    <!-- Hidden inputs preserve values for FormData collection -->
    <input
      v-for="val in internalValue"
      :key="val"
      type="hidden"
      name="inpursuit-group"
      :value="val"
    />
  </div>
</template>

<script>
export default {
  name: "CheckboxGroupField",
  props: {
    field: Object,
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      internalValue: (this.modelValue || []).map(String),
    };
  },
  methods: {
    toggleOption(value) {
      const idx = this.internalValue.indexOf(value);
      if (idx === -1) {
        this.internalValue.push(value);
      } else {
        this.internalValue.splice(idx, 1);
      }
      this.$emit("update:modelValue", this.internalValue);
    },
  },
  watch: {
    modelValue(newValue) {
      this.internalValue = (newValue || []).map(String);
    },
  },
};
</script>
