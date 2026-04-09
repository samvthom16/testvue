<template>

  <div class='phone-ui md:flex md:min-h-screen'>

    <!-- Desktop sidebar (hidden on mobile) -->
    <aside class='hidden md:flex md:flex-col md:w-56 md:min-h-screen sticky top-0 h-screen shrink-0 bg-lightergray border-r border-lightgray'>
      <div class='px-5 py-6 border-b border-lightgray'>
        <p class='text-darkblack font-bold text-xl tracking-wide'>InPursuit</p>
        <p class='text-gray text-xs uppercase tracking-widest mt-0.5'>Admin Console</p>
      </div>
      <nav class='flex-1 p-3 flex flex-col gap-1 overflow-y-auto'>
        <router-link
          v-for='item in navItems'
          :key='item.route.name'
          :to='item.route'
          class='flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors'
          :class="item.allowedRoutes.includes($route.name)
            ? 'bg-white text-purple font-semibold shadow-sm'
            : 'text-black hover:bg-white hover:text-darkblack'"
        >
          <Icon class='h-5 w-5 shrink-0' :type='item.icon' />
          <span class='text-sm font-medium'>{{ item.name }}</span>
        </router-link>
      </nav>
      <div class='p-3 border-t border-lightgray'>
        <router-link :to="{ name: 'NewMember' }" class='flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-purple text-white rounded-lg text-sm font-medium hover:bg-lightpurple transition-colors'>
          + New Entry
        </router-link>
      </div>
    </aside>

    <!-- Main content column -->
    <div class='flex-1 flex flex-col min-w-0'>
      <PhoneHeader
        :title='title'
        :colors='colors'
        :scrolled='scrolled'
        :move_sticky_up='move_sticky_up'
        :stickytitle_classes='stickytitle_classes'
      >
        <template v-for="(index, name) in $slots" v-slot:[name]>
          <slot :name="name" />
        </template>
      </PhoneHeader>

      <PhoneTitle
        :hide_maintitle='hide_maintitle'
        :maintitle_classes='maintitle_classes'
        :title='title'
        :colors='colors'
        :scrolled='scrolled'
        :move_sticky_up='move_sticky_up'
        :stickytitle_classes='stickytitle_classes'
      >
        <template v-for="(index, name) in $slots" v-slot:[name]>
          <slot :name="name" />
        </template>
      </PhoneTitle>

      <PhoneProgressBar />

      <!-- Desktop page header (hidden on mobile) -->
      <div class='desktop-page-header hidden md:block px-8 py-5 border-b border-lightgray bg-white' v-if='!hide_desktop_header'>
        <div class='flex items-center justify-between'>
          <h1 class='text-xl font-semibold text-darkblack' v-html='title'></h1>
          <div class='flex items-center gap-2'>
            <slot name="headerright"></slot>
          </div>
        </div>
        <div v-if='$slots["mainttitle_footer"]' class='mt-3'>
          <slot name="mainttitle_footer"></slot>
        </div>
      </div>

      <div
        class='p-4 md:p-8 bg-white min-h-screen'
        :class='`${body_classes}`'
      >
        <slot name="phonebody"></slot>
      </div>

      <PhoneFooter :hide_footer='hide_footer' />
    </div>

  </div>

</template>

<script>
import PhoneHeader from '@/templates/PhoneUI/Header.vue'
import PhoneTitle from '@/templates/PhoneUI/Title.vue'
import PhoneFooter from '@/templates/PhoneUI/Footer.vue'
import PhoneProgressBar from '@/templates/PhoneUI/ProgressBar.vue'
import Icon from '@/components/Icon.vue'

import Helper from '@/lib/Helper.js'

import {ref} from 'vue'

export default{
  props: {
    configUI: Object,
    title: String,
  },
  components: {
    PhoneHeader,
    PhoneTitle,
    PhoneProgressBar,
    PhoneFooter,
    Icon,
  },
  data(){
    return {
      scrolled  : false,
      move_sticky_up : false,
      navItems: [
        { route: { name: 'Home' },     icon: 'Home',    name: 'Dashboard', allowedRoutes: ['Home'] },
        { route: { name: 'Members' },  icon: 'Members', name: 'Members', allowedRoutes: ['Members', 'SingleMember'] },
        { route: { name: 'Events' },   icon: 'Event',   name: 'Events',  allowedRoutes: ['Events', 'SingleEvent'] },
        { route: { name: 'Comments' },      icon: 'Comment',       name: 'Comments',       allowedRoutes: ['Comments'] },
        { route: { name: 'SpecialEvents' }, icon: 'SpecialEvent',  name: 'Special Events', allowedRoutes: ['SpecialEvents'] },
        { route: { name: 'Profile' },       icon: 'Profile',       name: 'Profile',        allowedRoutes: ['Profile'] },
      ],
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
    colors.value = props.configUI && props.configUI.colors ? props.configUI.colors : "bg-white text-purple"

    const hide_maintitle = ref( null )
    hide_maintitle.value = props.configUI && props.configUI.hide_maintitle ? props.configUI.hide_maintitle : false

    const hide_footer = ref( null )
    hide_footer.value = props.configUI && props.configUI.hide_footer ? props.configUI.hide_footer : false

    const hide_desktop_header = ref( null )
    hide_desktop_header.value = props.configUI && props.configUI.hide_desktop_header ? props.configUI.hide_desktop_header : false

    return{
      maintitle_classes,
      stickytitle_classes,
      body_classes,
      hide_maintitle,
      hide_footer,
      hide_desktop_header,
      colors
    }
  },
  mounted(){

    var component = this;

    const {debounceEvent} = Helper()

    window.addEventListener('scroll', function(){
      debounceEvent( () => {
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
  /*@apply max-w-5xl mx-auto;*/
}
.header-list, .footer-list{
  @apply items-center flex;
}
.header-list li, .footer-list li{
  @apply flex-auto;
}

#phone-footer{
  @apply sticky z-10 bg-white bottom-0 w-full border-t border-lightgray;
}

.footer-list li{
  @apply p-2 pb-6 text-center;
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
  @apply text-2xl p-4 pt-4 border-b border-lightgray;
}

.maintitle .text-white,
.phone-sticky-header .text-white {
  color: #89558d;
}

@media (min-width: 768px) {
  .desktop-page-header .text-white {
    color: #89558d;
  }
  .desktop-page-header .text-white svg {
    color: #89558d;
  }
}


</style>
