<template>
  <div class='home'>
    <ItemAnimation class="mt-5" />
    <ItemAnimation class="mt-5" />
    <ItemAnimation class="mt-5" />
  </div>
</template>

<script>
import ItemAnimation from '../components/ItemAnimation.vue'

export default {
  name: 'Home',
  components: {
    ItemAnimation
  },
  mounted(){
    //var component = this;
    this.$store.commit( 'getLocalSettings' );

    if( this.$store.settings && this.$store.state.settings.account_url ){
      this.$router.push( '/members' );
    }
    else{
      this.$router.push( '/login' );
    }
  }
}
</script>
