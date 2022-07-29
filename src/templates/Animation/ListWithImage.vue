<template>
  <div class='space-y-6'>
    <div class="animate-pulse flex space-x-4" v-for='i in total' :key='i'>
      <div class="rounded-full bg-lightgray h-10 w-10"></div>
      <div class="flex-1 space-y-3 py-1">
        <div class="h-2 bg-lightgray rounded"></div>
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-lightgray rounded col-span-2"></div>
            <div class="h-2 bg-lightgray rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  props:{
    total:{
      type    : Number,
      default : 5
    }
  }
}
</script>
