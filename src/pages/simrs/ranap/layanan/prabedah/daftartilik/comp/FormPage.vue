<script setup>
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import { computed, onMounted } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const store = useDaftarTilikStore()

onMounted(() => {
  store.getNakes()
})

const onSubmit = () => {
  store.simpanData(props.pasien)
}

const onReset = () => {
  store.initForm()
}
</script>

<template>
  <div class="column fit bg-grey-2">
    <div class="col full-height bg-white relative-position">
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <!-- Header Informasi Operasi -->
          <div class="bg-indigo-10 text-white q-pa-sm rounded-borders text-weight-bold q-mb-md flex items-center q-gutter-x-sm">
            <q-icon name="icon-mat-fact_check" size="20px" />
            <span>CHECKLIST DAFTAR TILIK (PRE-OPERASI)</span>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-6">
              <q-input
                :model-value="pasien?.ruang || pasien?.ruangan || store.form.ruang_rawat || '-'"
                label="Ruang Rawat"
                dense
                outlined
                readonly
                bg-color="grey-2"
                standout="bg-yellow-3"
              />
            </div>
          </div>

          <!-- Tabel Checklist -->
          <div class="q-my-md">
            <q-markup-table dense flat bordered class="q-mb-md">
              <thead class="bg-indigo-10 text-white">
                <tr>
                  <th style="width: 50px;" class="text-center">No</th>
                  <th class="text-left">Kelengkapan Pre-Operasi</th>
                  <th style="width: 60px;" class="text-center">Ya</th>
                  <th style="width: 60px;" class="text-center">Tidak</th>
                  <th style="width: 250px;" class="text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in store.checklistMasters" :key="item.kode">
                  <td class="text-center text-weight-bold text-grey-8">{{ item.no }}</td>
                  <td style="white-space: normal; word-break: break-word;">
                    {{ item.label }}
                  </td>
                  <td class="text-center">
                    <q-radio
                      v-model="store.form.checklist[item.kode].status"
                      val="Ya"
                      dense
                      size="sm"
                      color="indigo-10"
                    />
                  </td>
                  <td class="text-center">
                    <q-radio
                      v-model="store.form.checklist[item.kode].status"
                      val="Tidak"
                      dense
                      size="sm"
                      color="indigo-10"
                    />
                  </td>
                  <td>
                    <q-input
                      v-model="store.form.checklist[item.kode].keterangan"
                      dense
                      outlined
                      standout="bg-yellow-3"
                      placeholder="..."
                      class="full-width q-my-xs"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <!-- Catatan -->
          <div class="q-mb-md">
            <q-input
              v-model="store.form.catatan"
              label="Catatan Pre-Operasi"
              type="textarea"
              outlined
              autogrow
              standout="bg-yellow-3"
              rows="3"
            />
          </div>

          <!-- Petugas Serah Terima -->
          <div class="bg-grey-3 q-pa-sm text-weight-bold text-grey-8 rounded-borders q-mb-md flex items-center">
            <q-icon name="icon-mat-people" size="18px" class="q-mr-xs" />
            <span>NAMA & TANDA TANGAN PETUGAS (PENGANTAR)</span>
          </div>

          <div class="row q-col-gutter-sm q-mb-lg">
            <div class="col-12 col-sm-6">
              <app-autocomplete-new
                :model="store.form.petugas_pengantar"
                label="Petugas Pengantar (Ruangan)"
                autocomplete="nama"
                option-value="kdpegsimrs"
                option-label="nama"
                outlined
                :source="store.perawats"
                @on-select="(val) => store.form.petugas_pengantar = val"
                @clear="store.form.petugas_pengantar = ''"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <q-separator class="q-mb-md" />
          <div class="row justify-end q-gutter-sm q-pb-md">
            <q-btn
              label="Batal / Reset"
              color="grey-6"
              no-caps
              flat
              @click="onReset"
            />
            <q-btn
              :label="store.form.id ? 'Update Daftar Tilik' : 'Simpan Daftar Tilik'"
              icon="icon-mat-save"
              color="indigo-10"
              no-caps
              :loading="store.loadingSave"
              @click="onSubmit"
            />
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<style scoped>
.border-cell {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
