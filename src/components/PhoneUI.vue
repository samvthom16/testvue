<template>

  <div class='phone-ui'>
    <div
      class='opacity-0 h-0'
      :class="[`${colors}`, {
        'border-b border-lightgray': scrolled,
        'opacity-100 py-4 px-2 sticky top-0 z-10 h-auto' : !move_sticky_up
      }]">
      <ul class='header-list'>
        <li><slot name="headericon"></slot></li>
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
      class='maintitle mt-0 transition-all duration-200 delay-50 relative'
      :class="[ `${colors}`, `${maintitle_classes}`, {'transform -mt-12': move_sticky_up} ]"
    >
      <div class='flex'>
        <div class='flex-auto' v-html='title' v-if='!hide_maintitle'></div>
        <slot name="headerright"></slot>
      </div>
      <slot name="mainttitle_footer"></slot>
    </div>

    <div class="w-full bg-lightergray relative h-1 overflow-hidden">
      <div :class="{ 'hidden': !$store.state.processing }" class="w-full inline-block fluentProgressBar-waiting"></div>
    </div>

    <div
      class='p-4 bg-lightergray min-h-screen'
      :class='`${body_classes}`'
    >
      <slot name="phonebody"></slot>
    </div>

    <div class='sticky z-10 bg-white bottom-0 w-full border-t border-gray' v-if='!hide_footer'>
      <ul class='footer-list'>
        <li>
          <router-link :to="{ name: 'Home' }" class="hover:opacity-80">
            <Icon
              class='text-black'
              type='Home'
              :class="{'text-purple' : $route.name == 'Home' }"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-purple' : $route.name == 'Home' }"
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
              :class="{'text-purple' : ['Members', 'SingleMember'].includes( $route.name ) }"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-purple' : ['Members', 'SingleMember'].includes( $route.name ) }"
            >
              Members
            </p>
          </router-link>
        </li>
        <li class='text-black'>
          <router-link to="/events" class="hover:opacity-80">
            <Icon
              class='text-black'
              :class="{'text-purple' : ['Events', 'SingleEvent'].includes( $route.name ) }"
              type="Event"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-purple' : ['Events', 'SingleEvent'].includes( $route.name ) }"
            >
              Events
            </p>
          </router-link>
        </li>
        <li>
          <router-link to="/profile" class="hover:opacity-80">
            <Icon
              class='text-black'
              :class="{'text-purple' : $route.name == 'Profile' }"
              type="Profile"
            />
            <p
              class='text-xs pt-1'
              :class="{'text-purple' : $route.name == 'Profile' }"
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

    const body_classes = ref( null );
    body_classes.value = props.configUI && props.configUI.body_classes ? props.configUI.body_classes : ""

    const colors = ref( null );
    colors.value = props.configUI && props.configUI.colors ? props.configUI.colors : "bg-purple text-white"

    const hide_maintitle = ref( null )
    hide_maintitle.value = props.configUI && props.configUI.hide_maintitle ? props.configUI.hide_maintitle : false

    const hide_footer = ref( null )
    hide_footer.value = props.configUI && props.configUI.hide_footer ? props.configUI.hide_footer : false



    return{
      maintitle_classes,
      stickytitle_classes,
      body_classes,
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
  @apply p-2 pb-4 text-center;
}
.footer-list li svg{
  @apply inline-block;
}

.header-list li{

}

.header-list li:nth-child(1),
.header-list li:nth-child(3){
  @apply w-8;
}

.header-list li:nth-child(1){
  @apply pl-1;
}

.header-list li:nth-child(2){
  @apply text-center px-2;
}

.header-list li:nth-child(3){
  @apply pr-1;
}

.maintitle{
  @apply text-2xl p-4 pt-4 bg-purple text-white border-b border-lightgray;
}


</style>
