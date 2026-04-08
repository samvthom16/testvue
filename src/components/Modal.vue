<template>
  <div class='modal-container'>
    <div class="modal-backdrop" @click='close' v-if='showModal'></div>
    <Transition name='slideup'>
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription" v-if='showModal'>
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 bg-lightgray rounded-full"></div>
        </div>
        <header class="modal-header px-5 py-4 border-b border-lightgray text-darkblack" id="modalTitle">
          <slot name='modaltitle'></slot>
          <button class="btn-close" @click="close" aria-label="Close modal">&times;</button>
        </header>
        <section class="modal-body px-5 py-4 bg-white" id="modalDescription">
          <slot name='modalcontent'></slot>
        </section>
      </div>
    </Transition>
  </div>
</template>
<script>
export default{
  props: {
    showModal: Boolean
  },
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
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal{
    @apply w-full bg-white bottom-0 max-w-4xl left-1/2 rounded-t-2xl;
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.12);
    transform: translateX(-50%);
  }

  .btn-close {
    @apply absolute top-3 right-4 text-2xl text-gray cursor-pointer;
  }
  .modal-fade-enter,.modal-fade-leave-to { opacity: 0; }
  .modal-fade-enter-active,.modal-fade-leave-active { transition: opacity .5s ease;}
</style>
