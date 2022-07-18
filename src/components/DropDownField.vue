<template>
  <div class="mb-5">
    <label class="block font-semibold text-black">{{ field.label }}</label>
    
    <select
      :name='field.id'
      :value="field.value"
      @change="$emit('update:modelValue', $event.target.value)"
      class='
        border-2 border-solid border-black
        p-2 w-full rounded
        mb-1 mt-2
        bg-white
      '
    >
      <option v-for="item in field.options" :key="item" v-html='item'></option>
    </select>
  </div>
</template>

<script>
export default {
  name: "DropDownField",
  props: {
    field: Object,
    //options: Object,
  },
  data() {
    return {
      value: "",
    };
  },
};
</script>
