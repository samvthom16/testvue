<script>
import { unsubscribeFromNotifications } from '@/lib/usePushNotifications'

export default {
  name: 'Logout',
  mounted() {
    unsubscribeFromNotifications().catch(() => {})

    // Remove the active workspace; flushLocalSettings switches to the next
    // workspace if one exists, or clears credentials if none remain
    this.$store.commit('flushLocalSettings')

    if (this.$store.state.workspaces.length > 0) {
      // Another workspace was made active — reload to start fresh session
      window.location.href = '/'
    } else {
      this.$router.push('/login')
    }
  },
}
</script>
