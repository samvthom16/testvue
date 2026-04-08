<template>

    <div class="mt-3 w-full relative">
      <Icon
        type="Search"
        class="pointer-events-none absolute left-3 top-2.5 text-gray w-5 h-5"
      />
      <input
        id="search"
        class="w-full text-sm bg-lightergray outline-none text-black py-2.5 pl-10 pr-9 rounded-full placeholder-gray border border-lightgray focus:border-lightpurple transition-colors"
        type="text"
        placeholder="Search"
        @keyup='returnSearchText'
      />
      <Icon
        @click='searchFocus == false'
        type="Close"
        class="cursor-pointer absolute right-3 top-2.5 text-gray w-5 h-5"
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

    if( $search ){
      $search.addEventListener( 'focus', () => {
        component.searchFocus = true
      } );
      $search.addEventListener( 'blur', () => {
        component.searchFocus = false
      } );  
    }


  }
}
</script>
