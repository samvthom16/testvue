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
  <button @click='openComment = true' class='hover:bg-red text-left text-sm bg-lightred text-white inline-block mb-5 border-red p-2 px-4 border rounded'>
    <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
    Add Comment
  </button>
</template>

<script>
import apiMixin from '@/mixins/APIMixin.js'

export default{
  name: 'AddComment',
  props:{
    id : Number
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
