<template>
  <div class="mb-5" v-if="!isHidden">
    <label class="block font-semibold text-black">{{ field.label }}</label>
    <textarea
      :id="field.id"
      :placeholder="field.placeholder ? field.placeholder : field.label"
      class="
        inline-block
        w-full
        p-2
        border-2 border-solid border-black
        rounded
        mb-1 mt-2
        outline-none
        focus:border-red
        h-32
      "
      :value="field.value"
      :name='field.id'
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <div class="text-red text-xs">{{ field.error_msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    field: Object,
    isHidden: Boolean,
  },
  data() {
    return {
      value: "",
    };
  },
};
</script>
