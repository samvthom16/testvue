<template>
  <div class="cursor-default py-4">
    <div class="flex items-center justify-between  ">
      <div class="flex items-center">
        <Icon
          :type='icon'
          class='h-7 w-7 p-1 rounded-md text-white'
          :class='icon_classes'
        />
        <router-link
          :to='route'
          class="ml-3 block font-normal truncate text-lg"
          v-html='label'
        />
      </div>
      <router-link
        :to='route'
        class="inset-y-0 right-0 flex items-center pr-2"
      >
        <Icon type='Right-Arrow' class='h-6 w-6' />
      </router-link>
    </div>
  </div>
</template>
<script>

import Icon from '@/components/Icon'

export default{
  components:{
    Icon
  },
  props:{
    label        : String,
    icon        : String,
    icon_classes: String,
    route       : Object
  }

}
</script>
