<template>
  <!-- Card 1 -->
  <div :class="{ 'bg-purple': item.type == 'event', 'bg-orange': item.type == 'comment', 'hidden': deletedFlag, 'opacity-80': processing }" class="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
    <!-- Dot Follwing the Left Vertical Line -->
    <div :class="{ 'bg-purple': item.type == 'event', 'bg-orange': item.type == 'comment' }" class="w-5 h-5 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

    <!-- Line that connecting the box with the vertical line -->
    <div :class="{ 'bg-purple': item.type == 'event', 'bg-orange': item.type == 'comment' }" class="w-10 h-1 absolute opacity-70 -left-10 z-0"></div>

    <!-- Content that showing in the box -->
    <div class="flex-auto w-full">
      <div class='uppercase text-xs text-lightgray mb-1 font-bold' v-if='item.type'>
        <div class='inline' v-if='item.type == "event"'>
          <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class='inline' v-if='item.type == "comment"'>
          <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        {{ item.type }}
        <div class='inline' v-if='item.type == "comment"'>by {{ item.author_name }}</div>
      </div>
      <h1 class="text-md font-thin text-sm mb-2">{{ formatDate( item.date ) }}</h1>
      <h1 class="text-xl font-bold">{{ item.title.rendered }}</h1>
      <p contenteditable class='opacity-85 text-md'>{{ item.text }}</p>
      <div class='absolute right-2 top-2' v-if='item.type == "comment"'>
        <button @click='deleteItem' type="button" class="rounded-sm text-white outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiMixin from '@/mixins/APIMixin.js'

export default {
  name: 'HistoryItem',
  props: {
    item: Object
  },
  mixins: [ apiMixin ],
  data(){
    return {
      deletedFlag : false,
      processing  : false
    };
  },
  methods: {
    formatDate( dateString ) {
      //return dateString;
      return new Date( dateString.replace(" ", "T") ).toLocaleString();
      //return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
    },
    deleteItem(){
			var component = this;

      // SET PROCESSING
      component.setProcessing( true );

			if( confirm( "Are you sure you want to delete this?" ) ){

        component.deleteComment( this.item.id ).then( () => {

          // HIDE THAT ITEM FROM THE VIEW
          component.deletedFlag = true;

          // RESET PROCESSING
          component.setProcessing( false );

        }, ( error ) => {

          // NOTIFY ERROR
          component.$store.commit( 'notifyError', error );

          // RESET PROCESSING
          component.setProcessing( false );
        } );


			}
		},
    setProcessing( flag ){
      this.processing = flag;
      this.$store.commit( 'setProcessing', flag );
    }
  }
}
</script>
