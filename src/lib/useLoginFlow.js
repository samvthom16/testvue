import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import API from '@/api'

export function useLoginFlow(options = {}) {
  const { addMode = false } = options
  const router = useRouter()
  const store = useStore()

  const currentStep = ref(0)
  const sent_otp = ref('')

  const form = ref({
    account_url: {
      id: 'account_url',
      label: 'Account URL',
      error_msg: '',
      value: '',
      type: 'text',
      placeholder: 'https://',
    },
    email_address: {
      id: 'email_address',
      label: 'Email Address',
      error_msg: '',
      value: '',
      type: 'text',
    },
    otp: {
      id: 'otp',
      label: 'OTP',
      error_msg: '',
      value: '',
      type: 'text',
    },
  })

  const formSteps = ['account_url', 'email_address', 'otp']

  const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

  const validateURL = (url) => {
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    return url.replace(/\/$/, '')
  }

  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const generateOTP = () => {
    let OTP = ''
    for (let i = 0; i < 6; i++) OTP += Math.floor(Math.random() * 10)
    return OTP
  }

  const getAccountURL = () => validateURL(form.value.account_url.value.trim())

  const focusInput = (element_id) => {
    const input = document.getElementById(element_id)
    const fakeInput = document.createElement('input')
    fakeInput.setAttribute('type', 'text')
    fakeInput.style.position = 'absolute'
    fakeInput.style.opacity = 0
    fakeInput.style.height = 0
    fakeInput.style.fontSize = '16px' // disable auto zoom
    document.body.prepend(fakeInput)
    fakeInput.focus()
    delay(1000).then(() => {
      input.focus()
      fakeInput.remove()
    })
  }

  const _openNextPreviousForm = () => {
    store.state.processing = false
    delay(200).then(() => focusInput(formSteps[currentStep.value]))
  }

  const openNextForm = () => {
    currentStep.value += 1
    _openNextPreviousForm()
  }

  const openPreviousForm = () => {
    currentStep.value -= 1
    _openNextPreviousForm()
  }

  const testAccountURL = (account_url) => {
    store.state.processing = true
    API.makeRequest({ url: account_url + '/wp-json/inpursuit/v1' }).then(
      () => openNextForm(),
      (error) => {
        console.log(error)
        store.state.processing = false
        form.value.account_url.error_msg = 'URL does not support the application.'
      }
    )
  }

  const sendEmailOTP = () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const account_url = getAccountURL()
    const email_address = form.value.email_address.value.trim()

    if (email_address && email_address.match(validRegex)) {
      form.value.email_address.error_msg = ''
      sent_otp.value = generateOTP()
      store.state.processing = true

      API.makeRequest({
        url: account_url + '/wp-json/inpursuit/v1/verify/',
        data: {
          email_address: btoa(email_address),
          email_otp: btoa(sent_otp.value),
        },
        method: 'post',
      }).then(
        () => openNextForm(),
        (error) => {
          console.log(error)
          form.value.email_address.error_msg =
            error?.response?.data?.message ?? 'Email Address does not exist'
          store.state.processing = false
        }
      )
      return true
    }

    form.value.email_address.error_msg =
      'Please type your email ID above instead of copying to avoid error.'
    return false
  }

  const verifyOTP = () => {
    if (!form.value.otp.value) {
      form.value.otp.error_msg = 'Please enter the OTP'
      return false
    }
    form.value.otp.error_msg = ''
    store.state.processing = true

    API.makeRequest({
      url: getAccountURL() + '/wp-json/inpursuit/v1/authentication/',
      data: {
        email_address: btoa(form.value.email_address.value.trim()),
        email_otp: btoa(form.value.otp.value.trim()),
      },
      method: 'post',
    }).then(
      (response) => {
        store.state.processing = false
        afterAuthentication(response)
      },
      (error) => {
        store.state.processing = false
        alert(error.response.data.message)
      }
    )
    return true
  }

  const afterAuthentication = (response) => {
    if (response.data?.password && response.data?.user) {
      const credentials = {
        id: response.data.user.ID,
        username: response.data.user.user_login,
        password: response.data.password,
        account_url: getAccountURL(),
      }

      if (addMode) {
        // Save to workspaces array without switching the active session
        store.commit('addWorkspace', credentials)
        router.push('/profile')
      } else {
        store.commit('saveLocalSettings', credentials)
        store.commit('addWorkspace', credentials)
        router.push('/members')
      }
    }
  }

  const submit = (e) => {
    e.preventDefault()
    const currentField = form.value[formSteps[currentStep.value]]

    if (!currentField.value) {
      currentField.error_msg = 'This field cannot be left empty.'
      return
    }
    currentField.error_msg = ''

    if (currentStep.value === 0) {
      const account_url = getAccountURL()
      if (isValidHttpUrl(account_url)) testAccountURL(account_url)
      else form.value.account_url.error_msg = 'Invalid URL'
    } else if (currentStep.value === 1) {
      sendEmailOTP()
    } else if (currentStep.value === 2) {
      verifyOTP()
    }
  }

  return {
    form,
    formSteps,
    currentStep,
    openNextForm,
    openPreviousForm,
    focusInput,
    submit,
    addMode,
  }
}
