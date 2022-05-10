<template>
  <div class="mb-5 mt-5">
    <label class="block font-semibold text-black">{{ field.label }}</label>

    <div>
      <select
        v-model="value"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-for="(item, id) in options" :key="id" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropDownField",
  props: {
    field: Object,
    options: Object,
  },
  data() {
    return {
      value: "",
    };
  },
};
</script>