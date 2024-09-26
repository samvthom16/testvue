<template>

    <div class="mt-4 w-full relative">
      <Icon
        type="Search"
        class="cursor-pointer absolute left-2 top-3 text-gray w-6 h-6"
      />
      <input
        id="search"
        class="w-full text-2xl bg-white outline-none focus:none align-middle text-black p-2 px-9 rounded"
        type="text"
        placeholder="Search"
        @keyup='returnSearchText'
      />
      <Icon
        @click='searchFocus == false'
        type="Close"
        class="cursor-pointer absolute right-2 top-3 text-white bg-black p-1 rounded-full"
        v-if='searchFocus'
      />
    </div>

</template>
<script>

import Helper from '@/lib/Helper'

const {debounceEvent} = Helper()

import Icon from '@/components/Icon.vue'

export default{
  components:{
    Icon
  },
  data(){
    return {
      searchFocus: false,
    }
  },

  methods:{

    returnSearchText( ev ){
      var component = this;
      debounceEvent( () => {
        component.$emit( 'searching', ev.target.value );
      }, 100 )
    }

  },
  mounted(){
    var $search = document.getElementById( 'search' );
    var component = this;
    $search.addEventListener( 'focus', () => {
      component.searchFocus = true
    } );
    $search.addEventListener( 'blur', () => {
      component.searchFocus = false
    } );
  }
}
</script>
