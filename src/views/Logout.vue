<script>
import { unsubscribeFromNotifications } from '@/lib/usePushNotifications'

export default {
  name: 'Logout',
  mounted(){
    unsubscribeFromNotifications().catch(() => {})

    // FLUSH LOCAL SETTINGS FROM THE BROWSER
    this.$store.commit( 'flushLocalSettings' );

    // REDIRECT TO LOGIN PAGE
    this.$router.push( '/login' );
  }
}
</script>
