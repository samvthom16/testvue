<template>
  <div class="mb-5" v-if="!isHidden">
    <label class="block font-semibold text-black">{{ field.label }}</label>
    <input
      class="
        inline-block
        w-full
        p-2
        border-2 border-solid
        rounded
        mb-1 mt-5
        border-black
        outline-white
        focus:border-red
      "
      :placeholder="field.label"
      :type="field.type"
      v-model="value"
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