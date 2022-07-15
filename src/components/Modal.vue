<template>
  <div class='modal-container'>
    <div class="modal-backdrop" @click='close'></div>
    <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
      <header class="modal-header p-2 border-b border-lightgray" id="modalTitle">
        <h4 class='font-semibold text-black'>Add Comment</h4>
        <button class="btn-close" @click="close" aria-label="Close modal">&times;</button>
      </header>
      <section class="modal-body p-2" id="modalDescription">
        <slot name='modalcontent'></slot>
      </section>
    </div>
  </div>
</template>
<script>
export default{
  methods: {
    close() {
      this.$emit('close');
    },
  },
}
</script>
<style>
  .modal-backdrop, .modal{
    @apply fixed z-50;
  }
  .modal-backdrop {
    @apply w-full h-full top-0 left-0;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .modal{
    /*
    @apply w-full h-full lg:h-auto lg:w-11/12 lg:max-w-lg bg-white px-8 py-8;
    @apply top-1/2 left-1/2;

    */
    @apply w-full bg-white bottom-0 max-w-4xl left-1/2 rounded-t;
    box-shadow: 2px 2px 20px 1px;
    transform: translateX( -50%);
  }

  .btn-close {
    @apply absolute top-0 right-4 text-3xl text-gray cursor-pointer font-bold;
  }
  .modal-fade-enter,.modal-fade-leave-to { opacity: 0; }
  .modal-fade-enter-active,.modal-fade-leave-active { transition: opacity .5s ease;}
</style>
