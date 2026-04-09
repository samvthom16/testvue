<template>
  <div class="mb-5" v-if="!isHidden">
    <label class="block font-medium text-darkblack text-sm mb-1.5">{{ field.label }}</label>
    <textarea
      :id="field.id"
      :placeholder="field.placeholder ? field.placeholder : field.label"
      class="inline-block w-full p-3 border border-lightgray rounded-xl bg-lightergray mb-1 mt-1 outline-none text-darkblack placeholder-gray focus:border-purple focus:bg-white transition-colors h-32 resize-none"
      :value="field.value"
      :name="field.id"
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
};
</script>
