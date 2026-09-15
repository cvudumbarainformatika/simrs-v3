<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emits('update:modelValue', $event)">
    <q-card style="width: 520px; max-width: 94vw;">
      <q-card-section class="row items-center bg-primary text-white">
        <div class="text-subtitle1">Download List Resep Excel</div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="icon-mat-close" />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <app-input-date :model="form.from" label="Dari Tanggal" outlined valid @set-model="form.from = $event" />
          </div>
          <div class="col-12 col-sm-6">
            <app-input-date :model="form.to" label="Sampai Tanggal" outlined valid @set-model="form.to = $event" />
          </div>
        </div>

        <q-select v-model="form.flag" outlined :options="flagOptions" emit-value map-options label="Status Resep" />
        <q-select v-model="form.format" outlined :options="formatOptions" emit-value map-options label="Format Data" />

        <div class="text-caption text-grey-7">
          Format header menghasilkan satu baris per resep. Format rincian menghasilkan satu baris per obat, termasuk komponen racikan dan status pemberiannya.
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn v-close-popup flat label="Batal" :disable="loading" />
        <q-btn color="green" icon="icon-mat-download" label="Download Excel" :loading="loading" :disable="!valid" @click="download" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { dateDbFormat } from 'src/modules/formatter'
import { api } from 'src/boot/axios'
import { notifErrVue } from 'src/modules/utils'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  kddepo: { type: String, default: '' }
})
const emits = defineEmits(['update:modelValue'])

const today = dateDbFormat(new Date())
const loading = ref(false)
const form = reactive({ from: today, to: today, flag: 'semua', format: 'header' })
const flagOptions = [
  { label: 'Semua Status', value: 'semua' },
  { label: 'Belum Dikirimkan', value: '' },
  { label: 'Belum Diterima', value: '1' },
  { label: 'Siap Dikerjakan', value: '2' },
  { label: 'Selesai', value: '3' },
  { label: 'Tidak Diberikan Semua', value: 'tidak_diberikan_semua' },
  { label: 'Returned', value: '4' },
  { label: 'Ditolak', value: '5' }
]
const formatOptions = [
  { label: 'Header Resep', value: 'header' },
  { label: 'Rincian Obat', value: 'rincian' }
]
const valid = computed(() => props.kddepo && form.from && form.to && form.from <= form.to)

async function download () {
  if (!valid.value) return

  loading.value = true
  try {
    const response = await api.get('v1/simrs/farmasinew/depo/download-list-resep', {
      params: { ...form, kddepo: props.kddepo },
      responseType: 'blob'
    })
    const disposition = response.headers['content-disposition'] || ''
    const fileName = disposition.match(/filename="?([^";]+)"?/)?.[1] || `list-e-resep-${form.format}.xlsx`
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    emits('update:modelValue', false)
  }
  catch (error) {
    let message = error?.response?.data?.message || 'Gagal membuat file Excel'
    if (error?.response?.data instanceof Blob) {
      const body = await error.response.data.text()
      try {
        message = JSON.parse(body)?.message || message
      }
      catch {
        if (body && !body.startsWith('<!DOCTYPE')) message = body
      }
    }
    notifErrVue(message)
  }
  finally {
    loading.value = false
  }
}
</script>
