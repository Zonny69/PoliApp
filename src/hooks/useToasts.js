import { useToast } from 'primevue/usetoast'

export const useToasts = () => {
  const toast = useToast()

  const toastMsg = ({
    type = 'success',
    title = '',
    message = '',
    time = 4000,
  }) => {
    toast.add({
      severity: type,
      summary: title,
      detail: message,
      life: time,
    })
  }

  return { toastMsg }
}
