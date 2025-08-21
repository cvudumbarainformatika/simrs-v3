<template>
  <q-card flat dark style="width:400px">
    <q-card-section class="q-py-sm">
      Keterangan
    </q-card-section>
    <q-separator class="bg-white" />
    <q-card-section>
      <q-select v-model="store.dialogForm.anatomy" outlined standout="bg-yellow-2 text-black" bg-color="white"
        color="orange" use-input input-debounce="0" label="Nama Anatomy" :options="options" dense class="q-mb-sm"
        :rules="[val => !!val || 'Pilih Data Terlebih dahulu']" :disable="store.templateActive !== 'Body'"
        @filter="filterFn">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Tidak ditemukan
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- MATA ========================================================================================================================= MATA-->
      <div v-if="store.templateActive === 'Mata' || store.dialogForm.anatomy === 'Mata'"
        class="row q-col-gutter-sm q-mb-sm">
        <q-input v-model="store.formMata.vodawal" standout="bg-yellow-2" outlined label="VOD AWAL" dense
          bg-color="white" :rules="[val => !!val || 'Harap diisi']" color="orange" hide-bottom-space
          style="width:50%" />
        <q-input v-model="store.formMata.vodrefraksi" standout="bg-yellow-2" outlined dense label="VOD REFRAKSI"
          bg-color="white" color="orange" style="width:50%" />
        <q-input v-model="store.formMata.vodakhir" standout="bg-yellow-2" outlined dense label="VOD AKHIR"
          bg-color="white" color="orange" style="width:50%" />
        <q-input v-model="store.formMata.tod" standout="bg-yellow-2" outlined label="TOD" dense bg-color="white"
          :rules="[val => !!val || 'Harap diisi']" color="orange" hide-bottom-space style="width:50%" />

        <q-input v-model="store.formMata.fondosod" standout="bg-yellow-2" outlined dense label="FONDOS OD"
          bg-color="white" color="orange" style="width:100%" />

        <q-input v-model="store.formMata.vosawal" standout="bg-yellow-2" outlined label="VOS AWAL" dense
          bg-color="white" :rules="[val => !!val || 'Harap diisi']" color="orange" hide-bottom-space
          style="width:50%" />
        <q-input v-model="store.formMata.vosrefraksi" standout="bg-yellow-2" outlined dense label="VOS REFRAKSI"
          bg-color="white" color="orange" style="width:50%" />
        <q-input v-model="store.formMata.vosakhir" standout="bg-yellow-2" outlined dense label="VOS AKHIR"
          bg-color="white" color="orange" style="width:50%" />

        <q-input v-model="store.formMata.tos" standout="bg-yellow-2" outlined dense label="TOS" bg-color="white"
          color="orange" style="width:50%" />

        <q-input v-model="store.formMata.fondosos" standout="bg-yellow-2" outlined dense label="FONDOS OS"
          bg-color="white" color="orange" style="width:100%" />
      </div>

      <!-- PARU ========================================================================================================================= PARU-->
      <div v-if="store.templateActive === 'Dada dan Paru' || store.dialogForm.anatomy === 'Dada dan Paru'"
        class="row q-col-gutter-sm q-mb-sm">
        <q-select v-model="store.formParu.statuslokalis" filled label="Status Lokalis" :options="props.lokalisparus"
          behavior="menu" standout="bg-yellow-2" bg-color="white" style="width:100%" outlined dense
          @update:model-value="(val) => store.dialogForm.ket = val" />
      </div>
      <q-input v-model="store.dialogForm.ket" standout="bg-yellow-2" outlined autogrow label="keterangan"
        bg-color="white" color="orange" />
    </q-card-section>
    <q-separator dark />
    <div class="row">
      <q-btn class="col q-pa-md" color="primary" square size="md" icon="icon-mat-check" @click="saveShape" />
      <q-btn class="col" color="negative" icon="icon-mat-close" square size="md" @click="cancelShape" />
    </div>
  </q-card>
</template>

<script setup>
import { usePemeriksaanFisik } from 'src/stores/simrs/pelayanan/poli/pemeriksaanfisik'
const store = usePemeriksaanFisik()


const props = defineProps({
  lokalisparus: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  }
})


const emits = defineEmits(['saveShape', 'cancelShape', 'filterFn'])
function cancelShape() {
  emits('cancelShape')
}

function saveShape() {
  emits('saveShape')
}


function filterFn(val, update) {
  emits('filterFn', val, update)
}

</script>