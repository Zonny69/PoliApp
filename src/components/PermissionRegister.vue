<script setup>
import { computed, reactive, ref } from 'vue'
import { FilterMatchMode } from 'primevue/api'

import { usePermission } from '../hooks/usePermission'
import { usePermissionStore } from '../context/usePermissionStore'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/lara-dark-teal/theme.css'
import 'primeflex/primeflex.css'

const permissionStore = usePermissionStore()
const { savePermission } = usePermission()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const request = reactive({})
const reasons = ref(['Cumpleaños', 'Jurado'])
const name = ref(null)
const reason = ref(reasons.value.at(0))
const date = ref(null)
const minDate = ref(new Date())
minDate.value.setDate(new Date().getDate() + 1)

const permissions = computed(() => permissionStore.getPermissions)
const total = computed(() => permissionStore.getTotal)
const isLoading = computed(() => permissionStore.isLoading)

const handleSave = () => {
  // TODO: Validar formato y campos vacíos, registros repetidos y días ya solicitados.
  Object.assign(request, {
    name: name.value,
    reason: reason.value,
    date: date.value,
  })
  savePermission(request)
}
</script>

<template>
  <div class="container">
    <section
      class="flex flex-column align-items-center justify-content-center gap-4 px-2"
    >
      <Toast />
      <h2 class="text-white text-5xl">
        Solicitud de <span class="text-gradient">Compensatorio</span> 🏝️🏖️
      </h2>
      <p class="text-color">
        Para solicitar su día compensatorio, ingrese su nombre, el motivo y la
        fecha en que desea disfrutarlo.
      </p>

      <div class="flex gap-2">
        <span class="p-float-label">
          <InputText type="text" v-model="name" />
          <label for="name">Nombre</label>
        </span>

        <div class="p-float-label">
          <Dropdown
            v-model="reason"
            inputId="dd-reason"
            :options="reasons"
            placeholder="Motivo"
            class="w-full md:w-14rem"
          />
          <label for="dd-reason">Motivo</label>
        </div>

        <span class="p-float-label">
          <Calendar
            v-model="date"
            inputId="permission_date"
            showWeek
            showIcon
            dateFormat="dd/mm/yy"
            :minDate="minDate"
            :manualInput="false"
          />
          <label for="permission_date">Fecha</label>
        </span>
        <Button @click="handleSave" type="Save" label="Guardar" />
      </div>
    </section>

    <Card>
      <template #content>
        <DataTable
          ref="dt"
          data-key="id"
          :value="permissions"
          :filters="filters"
          :loading="isLoading"
          stripedRows
          paginator
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows="5"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Mostrar del {first} al {last} de {totalRecords} permisos"
          responsive-layout="scroll"
        >
          <template #header>
            <div
              class="flex flex-row justify-content-between align-items-center gap-4"
            >
              <span class="block p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Buscar..."
                />
              </span>

              <code>Solicitados {{ total }}</code>
            </div>
          </template>

          <Column field="name" header="Empleado" header-style="width:18%;">
            <template #body="{ data }">
              <Skeleton v-if="isLoading"></Skeleton>

              <span v-else>{{ data.name }}</span>
            </template>
          </Column>

          <Column
            field="reason"
            header="Motivo"
            sortable
            header-style="width:10%;"
          >
            <template #body="{ data }">
              <Skeleton v-if="isLoading"></Skeleton>

              <span v-else>{{ data.reason }}</span>
            </template>
          </Column>

          <Column
            field="date"
            header="Fecha"
            sortable
            header-style="width:10%;"
          >
            <template #body="{ data }">
              <Skeleton v-if="isLoading"></Skeleton>

              <span v-else>{{ data.date }}</span>
            </template>
          </Column>

          <template #empty> No hay permisos solicitados. </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style>
.container {
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}
.text-gradient {
  background-image: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 400%;
  background-position: 0%;
}
code {
  font-size: 0.8em;
  font-weight: bold;
  background: rgba(var(--secondary-light), 12%);
  color: rgb(var(--secondary-light));
  border-radius: 4px;
  padding: 0.3em 0.4em;
}
</style>
