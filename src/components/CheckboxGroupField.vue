<template>
  <div class="mb-5">
    <label class="block font-semibold text-black mb-2">{{ field.label }}</label>
    <div class="flex flex-wrap gap-4 items-center">
      <div
        v-for="(optionLabel, optionValue) in field.options"
        :key="optionValue"
        class="flex items-center"
      >
        <input
          name="inpursuit-group"
          type="checkbox"
          :id="`${field.id}-${optionValue}`"
          :value="optionValue"
          v-model="internalValue"
          class="mr-2 border-2 border-solid border-black rounded"
        />
        <label :for="`${field.id}-${optionValue}`">{{ optionLabel }}</label>
      </div>
    </div>
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
      internalValue: this.modelValue || [],
    };
  },
  watch: {
    internalValue: {
      handler(newValue) {
        this.$emit("update:modelValue", newValue);
      },
      deep: true,
    },
    modelValue: {
      handler(newValue) {
        this.internalValue = newValue || [];
      },
      immediate: true,
    },
  },
};
</script>
