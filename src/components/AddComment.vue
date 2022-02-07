<template>
  <div :class="{ 'hidden': !openComment }" class="z-20 flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray">
    <div class="bg-white rounded-lg w-full md:w-1/2 mx-2">
      <div class="flex flex-col items-start p-4">
        <div class="flex items-center w-full">
          <div class="text-gray-900 font-medium text-lg">Add Comment</div>
          <svg @click='openComment = false' class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
          </svg>
        </div>
        <hr>
        <div class="w-full my-2">
          <textarea v-model='newComment' class='inline-block w-full p-2 border-2 border-solid rounded mb-1 border-black outline-white focus:border-red'></textarea>
          <div class='text-red text-xs'>{{ error_msg }}</div>
        </div>
        <hr>
        <div class="ml-auto">
          <button @click='saveComment' :disabled='processing' :class="{ 'cursor-not-allowed': processing }" class='bg-purple hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'>
            <svg :class="{ 'inline': processing, 'hidden': !processing }" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if='!processing'>Submit</span>
            <span v-if='processing'>Processing</span>
          </button>
          <button @click='openComment = false' class="bg-transparent hover:bg-gray font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-left items-baseline flex-wrap">
    <div class="flex mb-5">
      <button @click='openComment = true' class="text-base rounded-r-none  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer hover:bg-darkorange hover:text-white hover:border-black bg-orange border duration-200 ease-in-out transition">
        <div class="flex leading-5">
          Add Comment
        </div>
      </button>
      <a target='_blank' :href='getScheduleLink()' class="text-base  rounded-l-none border-l-0  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 hover:text-white hover:border-black rounded font-bold cursor-pointer hover:bg-darkorange bg-orange border duration-200 ease-in-out transition">
        <div class="flex leading-5">Set Reminder</div>
      </a>
    </div>
  </div>


  <div class='hidden bg-white fixed left-0 bottom-0 h-10 w-full z-10 shadow-vue text-center'>
    <button @click='openComment = true' class='m-auto -my-8 p-4 block h-14 w-14 content-center z-10 rounded-full hover:ring-2 text-left text-sm bg-darkorange border-darkorange  text-white mb-5'>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>


</template>

<script>
import apiMixin from '@/mixins/APIMixin.js'

export default{
  name: 'AddComment',
  props:{
    id : Number,
    item : Object
  },
  mixins: [ apiMixin ],
  data(){
    return {
      processing : false,
      openComment: false,
      newComment : '',
      error_msg  : ''
    }
  },
  methods: {

    getScheduleLink(){
      var link = 'http://www.google.com/calendar/render?action=TEMPLATE&trp=false&text=';
      var item = this.item;
      if( item.title && item.title.rendered ){
        link += 'Follow up with ' + item.title.rendered;
      }
      return link;
    },

    /*
    * SET PROCESSING
    */
    setProcessing( flag ){
      this.processing = flag;
      this.$store.commit( 'setProcessing', this.processing );
    },
    saveComment( ev ){
      ev.preventDefault();

      var component = this;

      if( !component.newComment ){
        component.error_msg = "This field cannot be left empty."
        return false;
      }

      // SET PROCESSING
      component.setProcessing( true );

      component.postComment( component.id, component.newComment ).then( () => {

        /*
        * RESET PROCESSING: THIS SHOULD BE IN THE BEGINNING SO THAT IT DOES NOT CONFLICT WITH ANY OTHER THAT IS FOLLOWING
        */
        component.setProcessing( false );

        //console.log( response );
        component.newComment = '';
        component.openComment = false;
        component.$parent.refreshItems();

      }, ( error ) => {

        // NOTIFY ERROR
        component.$store.commit( 'notifyError', error );
        component.setProcessing( false );

        component.error_msg = "" + error;
        return false;
      } );


    }
  }
}
</script>
