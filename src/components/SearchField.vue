<template>

    <div class="mt-4 w-full text-sm relative">
      <Icon
        type="Search"
        class="cursor-pointer absolute left-2 top-2.5 text-gray w-4 h-4"
      />
      <input
        id="search"
        class="w-full bg-white outline-none focus:none align-middle text-black p-2 pl-7 rounded"
        type="text"
        placeholder="Search"
        @keyup='returnSearchText'
      />
      <!--Icon
        type="filter"
        class="cursor-pointer absolute right-0 -top-1"
        @click="showModal"
      /-->
    </div>

</template>
<script>
import Util from '@/lib/Util'

import Icon from '@/components/Icon'

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
      Util.debounceEvent( () => {
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
