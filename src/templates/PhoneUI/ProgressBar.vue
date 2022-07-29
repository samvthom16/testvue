<template>
  <div class="w-full bg-lightergray relative h-1 overflow-hidden">
    <div :class="{ 'hidden': !$store.state.processing }" class="w-full inline-block fluentProgressBar-waiting"></div>
  </div>
</template>
