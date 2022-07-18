<template>

  <div class='phone-ui'>

    <div
      class='opacity-0 h-0'
      :class="[`${colors}`, {
        'border-b border-lightgray': scrolled,
        'opacity-100 p-4 sticky top-0 z-10 h-auto' : !move_sticky_up
      }]"
    >
      <ul class='header-list'>
        <li class=''>
          <slot name="headericon"></slot>
        </li>
        <li
          class='truncate opacity-0 transition-all'
          :class="[`${stickytitle_classes}`, { 'opacity-100': scrolled }]"
          v-html='title'>
        </li>
        <li
          class='opacity-0 transition-all text-right'
          :class="[`${stickytitle_classes}`, { 'opacity-100': scrolled }]"
        >
          <slot name="headerright"></slot>
        </li>
      </ul>
    </div>
    <div
      class='maintitle mt-0 transition-all duration-200 delay-50'
      :class="[ `${colors}`, `${maintitle_classes}`, {'transform -mt-12': move_sticky_up} ]"
    >
      <div class='flex'>
        <div class='flex-auto' v-html='title' v-if='!hide_maintitle'></div>
        <slot name="headerright"></slot>
      </div>
      <slot name="mainttitle_footer"></slot>
    </div>


    <div class='p-4 bg-lightergray min-h-screen'>
      <slot name="phonebody"></slot>
    </div>

    <div class='sticky z-10 bg-white bottom-0 w-full border-t border-gray' v-if='!hide_footer'>
      <ul class='footer-list'>
        <li>
          <router-link :to="{ name: 'Home' }" class="hover:opacity-80">
            <Icon
              class='text-black'
              type='Home'
              :class="{'text-orange' : $route.name == 'Home' }"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-orange' : $route.name == 'Home' }"
            >
              Home
            </p>
          </router-link>
        </li>
        <li>
          <router-link to="/members" class="hover:opacity-80">
            <Icon
              class='text-black'
              type='Members'
              :class="{'text-orange' : ['Members', 'SingleMember'].includes( $route.name ) }"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-orange' : ['Members', 'SingleMember'].includes( $route.name ) }"
            >
              Members
            </p>
          </router-link>
        </li>
        <li class='text-black'>
          <router-link to="/events" class="hover:opacity-80">
            <Icon
              class='text-black'
              :class="{'text-orange' : ['Events', 'SingleEvent'].includes( $route.name ) }"
              type="Event"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-orange' : ['Events', 'SingleEvent'].includes( $route.name ) }"
            >
              Events
            </p>
          </router-link>
        </li>
        <li>
          <router-link to="/profile" class="hover:opacity-80">
            <Icon
              class='text-black'
              :class="{'text-orange' : $route.name == 'Profile' }"
              type="Profile"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-orange' : $route.name == 'Profile' }"
            >
              Profile
            </p>
          </router-link>
        </li>
      </ul>
    </div>

  </div>



</template>

<script>

import Icon from '@/components/Icon'

import Util from '@/lib/Util'

import {ref} from 'vue'

export default{
  props: {
    configUI: Object,
    title: String,


  },
  components: {
    Icon
  },
  data(){
    return {

      scrolled  : false,
      move_sticky_up : false,
    }
  },
  setup( props ){

    const maintitle_classes = ref( null );
    maintitle_classes.value = props.configUI && props.configUI.maintitle_classes ? props.configUI.maintitle_classes : ""

    const stickytitle_classes = ref( null );
    stickytitle_classes.value = props.configUI && props.configUI.stickytitle_classes ? props.configUI.stickytitle_classes : ""

    const colors = ref( null );
    colors.value = props.configUI && props.configUI.colors ? props.configUI.colors : "bg-purple text-white"

    const hide_maintitle = ref( null )
    hide_maintitle.value = props.configUI && props.configUI.hide_maintitle ? props.configUI.hide_maintitle : false

    const hide_footer = ref( null )
    hide_footer.value = props.configUI && props.configUI.hide_footer ? props.configUI.hide_footer : false



    return{
      maintitle_classes,
      stickytitle_classes,
      hide_maintitle,
      hide_footer,
      colors
    }

    //console.log( props );
  },
  methods: {

  },
  mounted(){

    var component = this;

    window.addEventListener('scroll', function(){

      Util.debounceEvent( () => {
        if( window.scrollY > 34 ){
          component.scrolled = true;
        }
        else{
          component.scrolled = false;
        }
      }, 10 );
    } );

    var $input = this.$el.querySelector( '.maintitle input[type=text]' );
    //console.log( $input )
    if( $input ){
      $input.addEventListener('focus', () => {
        component.move_sticky_up = true
      } );
      $input.addEventListener('blur', () => {
        component.move_sticky_up = false
      } );
    }

  }
}
</script>

<style>
.phone-ui{
  @apply max-w-4xl mx-auto;
}
.header-list, .footer-list{
  @apply items-center flex;
}
.header-list li, .footer-list li{
  @apply flex-auto;
}
.footer-list li{
  @apply p-2 text-center;
}
.footer-list li svg{
  @apply inline-block;
}

.header-list li{
  @apply w-1/3;
}

.header-list li:nth-child(2){
  @apply text-center;
}

.maintitle{
  @apply text-2xl p-4 pt-4 bg-purple text-white border-b border-lightgray;
}
.maintitle svg{
  @apply mt-2;
}

</style>
