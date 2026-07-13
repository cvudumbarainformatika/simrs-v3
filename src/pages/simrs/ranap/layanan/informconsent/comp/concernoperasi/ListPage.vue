<template>
  <div class="q-pa-md">
    <q-card v-for="item in pasien?.informconcern" :key="item" class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle">
          INFORMED CONSENT
        </div>
        <div class="text-bold f-14">
          IC {{ mapJenis[item?.jenis] || item?.jenis }}
        </div>
        <q-separator class="q-my-sm" />
        <div class="flex items-center justify-between">
          <div>
            <q-btn flat icon="icon-mat-delete" padding="xs" size="sm" round color="negative"
              @click="emits('delete', item)" />
          </div>
          <div class="q-gutter-xs">
            <q-btn flat icon="icon-mat-edit" padding="xs" size="sm" round color="orange" @click="emits('edit', item)">
              <q-tooltip>Edit Form</q-tooltip>
            </q-btn>
            <q-btn flat icon="icon-mat-visibility" padding="xs" size="sm" round color="primary"
              @click="emits('preview', item)">
              <q-tooltip>Preview</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div style="margin-bottom: 100px;" />
  </div>
</template>

<script setup>
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})

console.log('list data : ', props.pasien?.informconcern)

const mapJenis = {
  OperasiInvasif: 'Operasi Invasif',
  Sedasi: 'Sedasi',
  Colonoscopy: 'Colonoscopy',
  TransfusiDarah: 'Transfusi Darah',
  PenandaanLokasiOperasi: 'Penandaan Lokasi Operasi',
  Resusitasi: 'Penolakan Resusitasi (DNR)',
  Restrain: 'Persetujuan Pemasangan Restrain'
}

const emits = defineEmits(['preview', 'delete', 'edit'])
</script>
