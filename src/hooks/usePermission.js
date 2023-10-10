import { useToast } from 'primevue/usetoast'
import { usePermissionStore } from '../context/usePermissionStore'

export const usePermission = () => {
  const toast = useToast()
  const { setPermission, setLoading } = usePermissionStore()

  const savePermission = permission => {
    setLoading(true)

    try {
      // FIXME: Permisos mutados al momento de guardar
      setPermission(permission)
      toast.add({
        severity: 'success',
        summary: 'Guardado con éxito',
        life: 3000,
      })
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Ups..',
        detail: 'Hubo un error al guardar la solicitud',
        life: 3000,
      })
      toastMsg({ tipo: 'error', titulo: 'Ups!', mensaje: useErrors(err) })
    } finally {
      setLoading(false)
    }
  }

  return {
    savePermission,
  }
}
