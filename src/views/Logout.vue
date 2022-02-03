<script>
export default {
  name: 'Logout',
  mounted(){
    //console.log('mounted');

    // FLUSH LOCAL SETTINGS FROM THE BROWSER
    this.$store.commit( 'flushLocalSettings' );

    // REDIRECT TO LOGIN PAGE
    this.$router.push( '/login' );
  }
}
</script>
