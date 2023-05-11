<template>

  <PhoneUI
    title='Analytics'
    :configUI="{ 'hide_footer' : true, 'maintitle_classes' : 'hidden', 'stickytitle_classes' : 'opacity-100'}"
  >

    <template v-slot:headericon>
      <BackButton :defaultRoute='{ name: "Profile" }' />
    </template>

    <template v-slot:phonebody>

      <div class="text-sm text-black font-semibold">LAST 6 MONTHS (AVERAGE)</div>

      <div class="mb-4 text-base focus:outline-none sm:text-sm w-full  bg-lightergray rounded-lg drop-shadow-sm my-2 divide-y divide-lightgray">
        <div class='p-4 px-6' v-for='stat in stats' :key='stat'>
          <div class='relative'>
            <div class='text-darkgray text-sm'>{{ stat.label }}</div>
            <div class='absolute right-0 top-0 text-md text-darkorange font-bold'>{{ stat.growth }}</div>
          </div>
          <div class='font-bold text-4xl'>{{ stat.total_average }}</div>
        </div>
      </div>
    </template>

  </PhoneUI>

</template>

<script>

  import PhoneUI from '@/components/PhoneUI'
  import BackButton from '@/templates/PhoneUI/BackButton'

  import {ref} from 'vue'

  import API from '@/api'

  export default{
    components : {
      PhoneUI,
      BackButton
    },
    setup(){

      const stats = ref( [] )

      API.requestAnalytics().then( ( response ) => stats.value = response.data )

      return {
        stats
      }

    }
  }
</script>
