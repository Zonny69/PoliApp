import { getActivePinia } from 'pinia'

export const useResetStore = () => {
  const pinia = getActivePinia()

  if (!pinia) {
    throw new Error('There is no active Pinia instance')
  }

  const resetStores = {}

  pinia._s.forEach((store, name) => {
    resetStores[name] = () => store.$reset()
  })

  resetStores.all = () => pinia._s.forEach(store => store.$reset())

  return resetStores
}
