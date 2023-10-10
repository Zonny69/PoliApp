import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    loading: false,
  }),

  persist: true,

  getters: {
    getPermissions: state => state.permissions,
    getTotal: state => state.permissions?.length ?? 0,
    isLoading: state => state.loading,
  },

  actions: {
    setPermission(permission) {
      this.permissions.push(permission)
    },

    setLoading(loading) {
      this.loading = loading
    },
  },
})
