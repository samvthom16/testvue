<template>
  <div class="mb-5 mt-5">
    <label class="block font-semibold text-black">{{ field.label }}</label>
    <select
      class="
        w-full
        p-1
        mt-2
        border-2 border-lightpurple
        focus:border-purple
        outline-none
      "
      v-model="value"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">choose</option>
      <option v-for="(item, id) in options" :key="id" :value="item">
        {{ item }}
      </option>
    </select>
    <div class="text-red text-xs">{{ field.error_msg }}</div>
  </div>
</template>

<script>
export default {
  name: "DropDownField",
  props: {
    field: Object,
    options: Object,
  },
  mounted() {
    if (this.field.value) {
      this.value = this.field.value;
    }
  },
  data() {
    return {
      value: "",
    };
  },
};
</script>
