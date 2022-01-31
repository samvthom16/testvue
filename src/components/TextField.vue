<template>
  <div class='mb-5'>
    <label class='block font-light text-black'>{{ field.label }}</label>
    <input class='inline-block w-full p-2 border-2 border-solid rounded mb-1 border-black outline-white focus:border-red' :placeholder='field.label' type='text' v-model='value' @input="$emit('update:modelValue', $event.target.value)" />
    <div class='text-red text-xs'>{{ field.error_msg }}</div>
  </div>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    field: Object
  },
  data(){
    return {
      value: ''
    }
  },  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
