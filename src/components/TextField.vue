<template>
  <div class="mb-5" v-if="!isHidden">
    <label class="block font-medium text-darkblack text-sm mb-1.5">{{ field.label }}</label>
    <input
      :id="field.id"
      :placeholder="field.placeholder ? field.placeholder : field.label"
      class="
        inline-block
        w-full
        p-3
        border border-lightgray
        rounded-xl
        bg-lightergray
        mb-1 mt-1
        outline-none
        text-darkblack
        placeholder-gray
        focus:border-purple focus:bg-white
        transition-colors
      "
      :type="field.type"
      :value="field.value"
      :name='field.id'
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="text-red text-xs">{{ field.error_msg }}</div>
  </div>
</template>

<script>
export default {
  name: "TextField",
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
