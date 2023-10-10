import { useToasts } from './'
import { usePermissionStore } from '../context/usePermissionStore'

export const usePermission = () => {
  const { toastMsg } = useToasts()
  const { setPermission, setLoading } = usePermissionStore()

  const savePermission = permission => {
    setLoading(true)

    try {
      setPermission(permission)
      toastMsg({ title: 'Guardado con éxito' })
    } catch (err) {
      toastMsg({
        type: 'error',
        title: 'Ups..',
        message: 'Hubo un error al guardar la solicitud',
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    savePermission,
  }
}
