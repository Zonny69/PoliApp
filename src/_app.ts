import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import PrimeVue from 'primevue/config'
import Skeleton from 'primevue/skeleton'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/lara-dark-teal/theme.css'
import 'primeflex/primeflex.css'

const pinia = createPinia()
pinia.use(createPersistedState())

export default (app: App) => {
  app.use(pinia)
  app.use(PrimeVue)
  app.use(ToastService)

  app.component('Button', Button)
  app.component('Calendar', Calendar)
  app.component('Card', Card)
  app.component('Column', Column)
  app.component('DataTable', DataTable)
  app.component('Dropdown', Dropdown)
  app.component('InputText', InputText)
  app.component('Skeleton', Skeleton)
  app.component('Toast', Toast)
}
