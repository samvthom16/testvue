<template>

  <PhoneUI title='Demo'>

    <template v-slot:phonebody>

      <div class="text-sm text-black font-semibold">LAST 6 MONTHS</div>

      <div class="mb-4 text-base focus:outline-none sm:text-sm w-full  bg-lightergray rounded-lg drop-shadow-sm my-2 divide-y divide-lightgray">
        <div class='p-4 px-6'>
          <div class='relative'>
            <div class='text-darkgray text-sm'>Bible Study</div>
            <div class='absolute right-0 top-0 text-sm'>AVG</div>
          </div>
          <div class='font-bold text-3xl'>42</div>
        </div>
        <div class='p-4 px-6'>
          <div class='relative'>
            <div class='text-darkgray text-sm'>Bible Study</div>
            <div class='absolute right-0 top-0 text-sm'>TOP</div>
          </div>
          <div class='font-bold text-3xl'>52</div>
        </div>
      </div>
      <div class="text-base focus:outline-none sm:text-sm w-full  bg-lightergray rounded-lg drop-shadow-sm my-2 divide-y divide-lightgray">
        <div class='p-4 px-6'>
          <div class='relative'>
            <div class='text-darkgray text-sm'>Bible Study</div>
            <div class='absolute right-0 top-0 text-sm'>AVG</div>
          </div>
          <div class='font-bold text-3xl'>42</div>
        </div>
        <div class='p-4 px-6'>
          <div class='relative'>
            <div class='text-darkgray text-sm'>Bible Study</div>
            <div class='absolute right-0 top-0 text-sm'>TOP</div>
          </div>
          <div class='font-bold text-3xl'>52</div>
        </div>
      </div>
    </template>

  </PhoneUI>

</template>

<script>

  import PhoneUI from '@/components/PhoneUI.vue'

  export default{
    components : {
      PhoneUI
    },
  }
</script>
