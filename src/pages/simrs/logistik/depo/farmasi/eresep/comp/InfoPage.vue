<template>
  <div class="full-width q-pa-sm">
    <!-- Title and Actions Header -->
    <div class="row justify-between items-center q-mb-md print-hide sticky-header">
      <div class="text-h6 text-teal text-weight-bold">Pelayanan Informasi Obat (PIO)</div>
      <div class="row q-gutter-sm">
        <q-btn color="dark" icon="print" label="Cetak PIO" no-caps @click="toPrint()" />
        <q-btn
          color="teal"
          icon="save"
          label="Simpan PIO"
          no-caps
          :loading="store.loadingPelayananInfoObat"
          :disable="store.loadingPelayananInfoObat"
          @click="simpan()"
        />
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white q-pa-lg shadow-1 border-radius-4 col column q-gutter-y-md print-hide">
      
      <!-- Section 1: Informasi Pelayanan -->
      <div class="row q-col-gutter-md">
        <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">1. Informasi Pelayanan</div>
        <div class="col-12 col-sm-3">
          <q-input v-model="store.formInfo.hari" label="Hari" outlined readonly dense />
        </div>
        <div class="col-12 col-sm-3">
          <app-input-date-human
            :model="store.formInfo.tgl"
            label="Tanggal"
            outlined
            dense
            @set-display="dispTanggal"
            @db-model="setTanggal"
          />
        </div>
        <div class="col-12 col-sm-3">
          <q-input v-model="store.formInfo.waktu" label="Waktu" outlined readonly dense />
        </div>
        <div class="col-12 col-sm-3 column justify-center">
          <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Metode Hubungan:</div>
          <q-option-group v-model="store.formInfo.metode" :options="store.metodes" inline color="teal" dense />
        </div>
      </div>

      <q-separator />

      <!-- Section 2: Identitas Penanya -->
      <div class="row q-col-gutter-md">
        <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">2. Identitas Penanya</div>
        <div class="col-12 col-sm-4">
          <app-input v-model="store.formInfo.nama_penanya" label="Nama Penanya" outlined dense />
        </div>
        <div class="col-12 col-sm-4">
          <app-input v-model="store.formInfo.tlp_penanya" label="Nomor Telepon" outlined dense />
        </div>
        <div class="col-12 col-sm-4 column justify-center">
          <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Status Penanya:</div>
          <q-option-group
            v-model="store.formInfo.status_penanya"
            :options="store.statuses"
            inline
            color="teal"
            dense
            @update:model-value="onStatusPenanyaChanged"
          />
        </div>
      </div>

      <q-separator />

      <!-- Section 3: Kondisi Klinis Pasien -->
      <div class="row q-col-gutter-md">
        <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">3. Kondisi Klinis Pasien</div>
        <div class="col-12 col-sm-3">
          <q-input v-model="store.formInfo.umur_pasien" label="Umur Pasien" outlined readonly dense />
        </div>
        <div class="col-12 col-sm-3 column justify-center">
          <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Jenis Kelamin:</div>
          <q-option-group
            v-model="store.formInfo.jenis_kelamin"
            :options="store.kelamins"
            inline
            color="teal"
            dense
            @update:model-value="onGenderChanged"
          />
        </div>
        <div class="col-12 col-sm-3 column justify-center" v-if="store.formInfo.jenis_kelamin !== 'Laki-Laki'">
          <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Kehamilan:</div>
          <q-option-group v-model="store.formInfo.kehamilan" :options="store.yns" inline color="teal" dense />
        </div>
        <div class="col-12 col-sm-3 column justify-center" v-if="store.formInfo.jenis_kelamin !== 'Laki-Laki'">
          <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Menyusui:</div>
          <q-option-group v-model="store.formInfo.menyusui" :options="store.yns" inline color="teal" dense />
        </div>
        <div class="col-12">
          <app-input v-model="store.formInfo.kasus_khusus" label="Kasus Khusus / Keterangan Penyakit Penyerta" outlined dense />
        </div>
      </div>

      <q-separator />

      <!-- Section 4: Detail Pertanyaan & Jawaban -->
      <div class="row q-col-gutter-md">
        <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">4. Detail Pertanyaan & Jawaban</div>
        <div class="col-12">
          <q-input v-model="store.formInfo.obat_non_eresep" label="Obat yang diberikan di luar E-Resep (jika ada):" outlined type="textarea" rows="2" />
        </div>
        <div class="col-12">
          <q-input v-model="store.formInfo.uraian_pertanyaan" label="Uraian Pertanyaan:" outlined type="textarea" rows="3" />
        </div>
        <div class="col-12 column">
          <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Kategori/Jenis Pertanyaan:</div>
          <q-option-group
            v-model="store.formInfo.jenisPertanyaan"
            type="checkbox"
            :options="store.jenisPertanyaans"
            inline
            color="teal"
            dense
            @update:model-value="(val) => {
              store.formInfo.kode = []
              if (val?.length > 0) {
                val?.forEach(anu => {
                  const ada = store.jenisPertanyaans?.find(x => x.value === anu)
                  if (ada) {
                    store.formInfo.kode.push(ada)
                  }
                })
              }
            }"
          />
        </div>
        <div class="col-12">
          <q-input v-model="store.formInfo.jawaban" label="Uraian Jawaban Apoteker:" outlined type="textarea" rows="3" />
        </div>
        <div class="col-12">
          <q-input v-model="store.formInfo.referensi" label="Referensi Pustaka:" outlined type="textarea" rows="2" />
        </div>
      </div>

      <q-separator />

      <!-- Section 5: Penanggung Jawab -->
      <div class="row q-col-gutter-md">
        <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">5. Apoteker Penanggung Jawab</div>
        <div class="col-12 col-sm-6">
          <app-autocomplete
            v-model="store.formInfo.apoteker"
            label="Pilih Apoteker"
            autocomplete="nama"
            option-label="nama"
            option-value="kdpegsimrs"
            outlined
            dense
            :source="store.apotekers"
          />
        </div>
      </div>

    </div>

    <!-- Dialog Cetak/Dokumen PIO -->
    <CetakPioDialog
      v-model="isOpenCetakPio"
      :pasien="store.selectedPasien"
      :form="store.formInfo"
      :apotekers="store.apotekers"
      :jenis-pertanyaans="store.jenisPertanyaans"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useEResepDepoFarmasiStore } from 'src/stores/simrs/farmasi/eresep/eresep'
import { date } from 'quasar'

const store = useEResepDepoFarmasiStore()
const isOpenCetakPio = ref(false)

const CetakPioDialog = defineAsyncComponent(() => import('./CetakPioDialog.vue'))

function setTanggal (val) {
  store.setFormInfo('hari', date.formatDate(val, 'dddd'))
  store.setFormInfo('waktu', date.formatDate(Date.now(), 'HH:mm:ss'))
  store.setFormInfo('tanggal', val + ' ' + store.formInfo?.waktu)
}

function dispTanggal (val) {
  store.setFormInfo('tgl', val)
}

function toPrint () {
  isOpenCetakPio.value = true
}

function simpan () {
  const jenper = store.formInfo.jenisPertanyaan.join('|')
  store.setFormInfo('jenis_pertanyaan', jenper)
  store.simpanPelayananInfoObat()
}

function onGenderChanged (val) {
  if (val === 'Laki-Laki') {
    store.setFormInfo('kehamilan', '2')
    store.setFormInfo('menyusui', '2')
  }
}

function onStatusPenanyaChanged (val) {
  if (val === '1') {
    const patientName = store.selectedPasien?.nama ?? store.selectedPasien?.datapasien?.nama ?? ''
    const patientPhone = store.selectedPasien?.nohp ?? store.selectedPasien?.datapasien?.nohp ?? ''
    store.setFormInfo('nama_penanya', patientName)
    store.setFormInfo('tlp_penanya', patientPhone)
  } else {
    store.setFormInfo('nama_penanya', '')
    store.setFormInfo('tlp_penanya', '')
  }
}

onMounted(() => {
  store.getApoteker()
})
</script>

<style lang="scss" scoped>
.border-radius-4 {
  border-radius: 4px;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5; /* matches bg-grey-1 parent */
  margin-top: -24px;
  padding-top: 24px;
  padding-bottom: 16px;
}
</style>
