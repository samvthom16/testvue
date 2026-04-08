import { ref, onMounted } from 'vue'
import store from '@/store'
import API from '@/api'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

const isSupported = 'serviceWorker' in navigator && 'PushManager' in window

async function getExistingSubscription() {
  if (!isSupported) return null
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
}

export async function unsubscribeFromNotifications() {
  const sub = await getExistingSubscription()
  if (!sub) return

  const accountUrl = store.state.settings.account_url
  await API.makeRequest({
    url: accountUrl + '/wp-json/inpursuit/v1/push/unsubscribe',
    method: 'post',
    data: { endpoint: sub.endpoint },
    headers: API.getAuthHeaders(),
  })

  await sub.unsubscribe()
}

export function usePushNotifications() {
  const isSubscribed = ref(false)

  onMounted(async () => {
    const sub = await getExistingSubscription()
    isSubscribed.value = !!sub
  })

  const subscribeToNotifications = async () => {
    const reg = await navigator.serviceWorker.ready
    const accountUrl = store.state.settings.account_url

    const { data } = await API.makeRequest({
      url: accountUrl + '/wp-json/inpursuit/v1/push/vapid-public-key',
    })

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    })

    const subJson = sub.toJSON()
    await API.makeRequest({
      url: accountUrl + '/wp-json/inpursuit/v1/push/subscribe',
      method: 'post',
      data: { endpoint: subJson.endpoint, keys: subJson.keys },
      headers: API.getAuthHeaders(),
    })

    isSubscribed.value = true
  }

  const toggleNotifications = async () => {
    if (!isSupported) return

    if (!isSubscribed.value) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
      await subscribeToNotifications()
    } else {
      await unsubscribeFromNotifications()
      isSubscribed.value = false
    }
  }

  return {
    isSubscribed,
    isSupported,
    toggleNotifications,
  }
}
