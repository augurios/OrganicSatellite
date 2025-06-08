import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createGtag } from 'vue-gtag'

import App from './App.vue'
import router from './router'
import { addFeatureClasses } from './utils/browserDetection.js'

// Add feature detection classes to document
addFeatureClasses()

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Google Analytics configuration
app.use(createGtag({
  tagId: 'G-3GRSMH66EW',
  config: {
    send_page_view: false
  },
  pageTracker: {
    router,
    sendPageView: true
  }
}))

app.mount('#app')
