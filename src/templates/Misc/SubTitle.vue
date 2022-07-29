<template>
  <p class='text-sm text-gray' v-html='title'></p>
</template>

<script>

export default{
  props: {
    title: String
  }
}
</script>
