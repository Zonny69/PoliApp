<script setup>
import { computed, onMounted, onActivated, ref } from 'vue'
import { FilterMatchMode } from 'primevue/api'

import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

import { usePermission, useResetStore } from '../hooks/'
import { usePermissionStore } from '../context/usePermissionStore'

onMounted(() => {
  setInitialState()
})

onActivated(() => {
  setInitialState()
})

const permissionStore = usePermissionStore()
const resetStore = useResetStore()
const { savePermission } = usePermission()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const reasons = ['Cumpleaños', 'Jurado']
const minDate = ref(new Date())
minDate.value.setDate(new Date().getDate() + 1)

const permissions = computed(() => permissionStore.getPermissions)
const total = computed(() => permissionStore.getTotal)
const isLoading = computed(() => permissionStore.isLoading)

const validationSchema = toTypedSchema(
  zod.object({
    document: zod.number({
      required_error: 'Necesario para validar tu información',
      invalid_type_error: 'Solo se permiten números',
    }),
    name: zod
      .string({ required_error: 'Es necesario el nombre' })
      .min(3, { message: 'Al menos 3 caracteres' }),
    reason: zod.enum(reasons),
    date: zod.date({
      required_error: 'En que fecha solicita su día?',
      invalid_type_error: 'Esto no es una fecha!',
    }),
  })
)

const { handleSubmit, handleReset, setValues, errors } = useForm({
  validationSchema,
})

const { value: document } = useField('document')
const { value: name } = useField('name')
const { value: reason } = useField('reason')
const { value: date } = useField('date')

const setInitialState = () => {
  setValues({
    reason: reasons.at(0),
  })
}

const isEmptyObject = value =>
  Object.keys(value).length === 0 && value.constructor === Object

const handleSave = handleSubmit(data => {
  // TODO: Validar registros repetidos y días ya solicitados.
  const request = { ...data, date: new Date(data.date).toLocaleDateString() }

  savePermission(request)

  handleReset()
  setInitialState()
})

const onReset = () => resetStore.all()
</script>

<template>
  <div class="container">
    <section
      class="flex flex-column align-items-center justify-content-center gap-4 px-2"
    >
      <Toast />
      <h2 class="text-white text-6xl">
        Solicitud de <span class="text-gradient">Compensatorio</span> 🏝️🏖️
      </h2>
      <p class="text-color text-xl">
        Para solicitar su día compensatorio, ingrese su nombre, el motivo y la
        fecha en que desea disfrutarlo.
      </p>

      <div class="flex gap-2">
        <span class="p-float-label">
          <InputNumber
            inputId="document"
            v-model="document"
            :use-grouping="false"
            :class="{ 'p-invalid': errors.document }"
          />
          <label for="document">Cédula</label>
          <small class="block p-error">{{ errors.document }}</small>
        </span>

        <span class="p-float-label">
          <InputText
            type="text"
            inputId="name"
            v-model="name"
            :class="{ 'p-invalid': errors.name }"
          />
          <label for="name">Nombre</label>
          <small class="block p-error">{{ errors.name }}</small>
        </span>

        <div class="p-float-label">
          <Dropdown
            v-model="reason"
            inputId="dd-reason"
            :options="reasons"
            :class="{ 'p-invalid': errors.reason }"
            class="w-full md:w-14rem"
          />
          <label for="dd-reason">Motivo</label>
          <small class="block p-error">{{ errors.reason }}</small>
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
            :class="{ 'p-invalid': errors.date }"
          />
          <label for="permission_date">Fecha</label>
          <small class="block p-error">{{ errors.date }}</small>
        </span>

        <Button
          label="Guardar"
          icon="pi pi-save"
          :loading="isLoading"
          :disabled="!isEmptyObject(errors)"
          @click="handleSave"
        />
      </div>
    </section>

    <Card>
      <template #content>
        <DataTable
          data-key="document"
          :value="permissions"
          :filters="filters"
          :loading="isLoading"
          stripedRows
          paginator
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows="5"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Mostrar del {first} al {last} de {totalRecords} solicitudes"
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

          <Column field="document" header="Cédula" header-style="width:18%;">
            <template #body="{ data }">
              <Skeleton v-if="isLoading"></Skeleton>

              <span v-else>{{ data.document }}</span>
            </template>
          </Column>

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

    <section class="flex flex-row gap-4">
      <a href="/"><Button label="Volver" icon="pi pi-arrow-left" outlined /></a>

      <Button
        label="Resetear solicitudes"
        severity="danger"
        icon="pi pi-trash"
        @click="onReset"
      />
    </section>
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
