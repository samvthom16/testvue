<template>
  <div
    class="
      flex
      mt-4
      w-full
      text-sm
    "
  >
    <div
      class="w-full p-2 relative border border-black bg-white rounded"
      :class="{ 'w-10/12': searchFocus }"
    >
      <input
        id="search"
        class="w-full outline-none focus:none align-middle text-black"
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
    <div
      class="w-2/12 text-center py-2"
      :class="{ 'hidden': !searchFocus }"
    >
      <button @click='searchFocus = false'>Cancel</button>
    </div>
  </div>
</template>
<script>
import Util from '@/lib/Util'

export default{
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
