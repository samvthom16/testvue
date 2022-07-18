<template>
  <div class='modal-container'>
    <div class="modal-backdrop" @click='close' v-if='showModal'></div>
    <Transition name='slideup'>
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription" v-if='showModal'>
        <header class="bg-lightergray modal-header p-4 border-b border-lightgray text-darkblack rounded-t-xl" id="modalTitle">
          <slot name='modaltitle'></slot>
          <button class="btn-close" @click="close" aria-label="Close modal">&times;</button>
        </header>
        <section class="modal-body p-4 bg-lightergray" id="modalDescription">
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
    background-color: rgba(0, 0, 0, 0.8);
  }
  .modal{
    @apply w-full bg-white bottom-0 max-w-4xl left-1/2 rounded-t-xl;
    box-shadow: 2px 2px 20px 1px;
    transform: translateX( -50%);
  }

  .btn-close {
    @apply absolute top-1 right-3 text-3xl text-gray cursor-pointer font-bold;
  }
  .modal-fade-enter,.modal-fade-leave-to { opacity: 0; }
  .modal-fade-enter-active,.modal-fade-leave-active { transition: opacity .5s ease;}
</style>
