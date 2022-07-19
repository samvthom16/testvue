<template>
  <div class="mb-5" v-if="!isHidden">
    <label class="block font-semibold text-black">{{ field.label }}</label>
    <input
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
