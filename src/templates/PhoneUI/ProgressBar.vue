<template>
  <div class="w-full relative h-1 overflow-hidden" :class="{ 'bg-lightergray': $store.state.processing }">
    <div :class="{ 'hidden': !$store.state.processing }" class="w-full inline-block fluentProgressBar-waiting"></div>
  </div>
</template>
