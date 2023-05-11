<template>
  <div class="text-sm text-black font-semibold">AVERAGE COUNT</div>

  <div class="mb-4 text-base focus:outline-none sm:text-sm w-full  bg-lightergray rounded-lg drop-shadow-sm my-2 divide-y divide-lightgray">
    <div class='p-4 px-6' v-for='stat in stats' :key='stat'>
      <div class='relative'>
        <div class='text-darkgray text-sm'>{{ stat.label }}</div>
        <div class='absolute right-0 top-0 text-md text-darkorange font-bold'>{{ stat.growth }}</div>
      </div>
      <div class='font-bold text-4xl'>{{ stat.total }}</div>
    </div>
  </div>
</template>
<script>

import {ref} from 'vue'

import API from '@/api'

export default{
  props: {
    period: Number
  },
  setup( props ){

    const stats = ref( [] )

    API.requestAnalytics( { period: props.period } ).then( ( response ) => stats.value = response.data )

    return {
      stats
    }

  }
}
</script>
