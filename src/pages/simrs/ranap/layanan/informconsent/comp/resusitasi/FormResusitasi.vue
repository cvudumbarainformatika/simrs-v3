<template>
  <q-form ref="myForm">
    <q-card-section>
      <div class="text-bold text-subtitle1">
        FORM {{ menu?.title }}
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width">
        <div class="row q-col-gutter-sm full-width">
          
          <!-- Tanggal & Pelaksana -->
          <app-input-date :model="store.form.tanggal" label="Tanggal" icon="icon-mat-event" outlined
            @set-model="val => store.form.tanggal = val" :autofocus="true" class="col-md-4 col-sm-12" />
          
          <app-autocomplete-new ref="refDokter" :model="store.form.kdDokter" label="Pelaksana Tindakan (Dokter)"
            autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined :source="store.dokters"
            class="col-md-8 col-sm-12" @on-select="(val) => {
              store.form.kdDokter = val
              store.form.pelaksana = store.dokters?.find(item => item.kdpegsimrs === val)?.nama
            }" @clear="() => {
              store.form.kdDokter = null
              store.form.pelaksana = null
            }" />

          <!-- Pemberi Informasi / Pengedukasi -->
          <app-autocomplete-new ref="refPerawat" :model="store.form.kdPetugas" label="Pemberi Informasi (Petugas/Nakes)"
            autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined :source="store.perawats"
            class="col-md-6 col-sm-12" @on-select="(val) => {
              store.form.kdPetugas = val
              store.form.pengedukasi = store.perawats?.find(item => item?.kdpegsimrs === val)?.nama
            }" @clear="() => {
              store.form.kdPetugas = null
              store.form.pengedukasi = null
            }" />

          <!-- Hubungan dengan Pasien -->
          <q-select label="Pilih Penerima Informasi / Pemberi Persetujuan" outlined standout="bg-yellow-3" dense
            class="col-md-6 col-sm-12" :options="store.hubunganDgPasiens" v-model="store.form.hubunganDgPasien"
            @update:model-value="cekHubunganPasien" />

          <app-input-simrs v-if="store.form.hubunganDgPasien === 'Keluarga'" v-model="store.form.keluarga"
            label="Jelaskan Hubungan Keluarga dengan Pasien" class="col-12" />

          <!-- Identitas Pemberi Pernyataan / Penolak -->
          <app-input-simrs v-model="store.form.nama" label="Nama Penerima Informasi / Penolak Resusitasi"
            class="col-md-8 col-sm-12" />
          
          <div class="col-md-4 col-sm-12 flex items-center">
            <span class="q-mr-sm">Jenis Kelamin:</span>
            <q-radio size="md" v-model="store.form.lp" v-for="aa in store.jekels" :key="aa"
              :label="aa?.label" :val="aa?.value" />
          </div>

          <app-input-simrs v-model="store.form.noKtp" label="No. KTP / SIM / PASPOR" class="col-md-4 col-sm-12" />
          
          <app-input-date :model="store.form.tglLahir" label="Tanggal Lahir" icon="icon-mat-event" outlined
            @set-model="val => store.form.tglLahir = val" :autofocus="false" class="col-md-4 col-sm-12" />
          
          <app-input-simrs v-model="store.form.telepon" label="No Telp / HP" class="col-md-4 col-sm-12" />
          
          <q-input v-model="store.form.alamat" label="Alamat Lengkap" outlined standout="bg-yellow-3" rows="2" type="textarea"
            class="col-12" />

          <q-separator class="col-12 q-my-md" />

          <!-- 11 Poin Informasi RJP / DNR -->
          <div class="col-12 text-bold text-subtitle2 q-mb-xs">11 Poin Informasi Tindakan Medis (Resusitasi/DNR)</div>

          <!-- Diagnosis Checkbox -->
          <div class="col-12">
            <span class="text-caption text-grey-8">Pilih Diagnosis Medis Pasien:</span>
            <q-list separator bordered class="q-mt-xs">
              <q-item v-for="item in pasien?.diagnosamedis" :key="item" tag="label" v-ripple dense>
                <q-item-section avatar>
                  <q-checkbox dense v-model="store.form.diagnosis" :val="item?.masterdiagnosa?.rs4 || item?.rs3" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item?.masterdiagnosa?.rs4 }} ({{ item?.rs3 }})</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="!pasien?.diagnosamedis?.length">
                <q-item-section class="text-grey-6 text-caption">Tidak ada diagnosis medis terekam</q-item-section>
              </q-item>
            </q-list>
          </div>

          <app-input-simrs v-model="store.form.dasarDiagnosis" label="Dasar Diagnosis (misal: Klinis, EKG, dll.)" class="col-12" />
          
          <q-input v-model="store.form.tindakanMedis" label="Tindakan Kedokteran" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          
          <q-input v-model="store.form.indikasi" label="Indikasi Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          
          <q-input v-model="store.form.tujuanLain" label="Tujuan Penolakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          
          <q-input v-model="store.form.tatacara" label="Tata Cara Resusitasi" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          
          <q-input v-model="store.form.resikoLain" label="Resiko Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          
          <q-input v-model="store.form.komplikasi" label="Komplikasi Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          
          <div class="col-12 flex items-center q-my-xs">
            <span class="q-mr-md text-bold">Prognosis:</span>
            <q-checkbox class="q-ml-sm" size="md" v-model="store.form.prognosis" v-for="aa in store.prognosis" :key="aa"
              :label="aa" :val="aa" />
          </div>

          <q-input v-model="store.form.alternatif" label="Alternatif Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />

          <!-- Lain-lain (bisa disimpan di field keluarga/lainnya, tapi di Pinia tidak ada kolom khusus, kita bisa pakai field "penerimaEdukasi" jika ingin menampung teks lain-lain) -->
          <q-input v-model="store.form.penerimaEdukasi" label="Lain - Lain" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />

          <q-separator class="col-12 q-my-md" />

          <!-- Saksi Pasien -->
          <app-input-simrs v-model="store.form.saksiPasien" label="Nama Saksi Pasien / Keluarga" class="col-12"
            :valid="{ required: false }" />

          <q-separator class="col-12 q-my-md" />

          <!-- Tanda Tangan -->
          <div class="col-12">
            <div class="text-bold q-mb-sm">Tanda Tangan Pernyataan Penolakan (DNR)</div>
            <div class="row q-col-gutter-sm">
              <!-- TTD Yang Menyatakan -->
              <div class="col-md-6 col-sm-12" style="min-height: 180px;">
                <q-card flat bordered class="column full-height flex-center q-pa-sm bg-grey-1">
                  <app-signature :ttd="store.form.ttdYgMenyatakan" :width="300" :height="150"
                    label-ttd="Tanda Tangan Yang Menyatakan" @save-ttd="(val) => store.form.ttdYgMenyatakan = val"
                    :pasien="pasien" uuid="ttdYgMenyatakan" @signature="(val) => {
                      store.form.ttdYgMenyatakan = val
                    }" />
                </q-card>
              </div>
              
              <!-- TTD Saksi Pasien -->
              <div class="col-md-6 col-sm-12" style="min-height: 180px;">
                <q-card flat bordered class="column full-height flex-center q-pa-sm bg-grey-1">
                  <app-signature :ttd="store.form.ttdSaksiPasien" :width="300" :height="150"
                    label-ttd="Tanda Tangan Saksi Pasien" @save-ttd="(val) => store.form.ttdSaksiPasien = val"
                    :pasien="pasien" uuid="ttdSaksiPasien" @signature="(val) => {
                      store.form.ttdSaksiPasien = val
                    }" />
                </q-card>
              </div>
            </div>
          </div>

        </div>
      </div>
    </q-card-section>

    <!-- Simpan Button -->
    <q-card-actions align="right" class="q-pa-md">
      <q-btn :loading="store.loadingSave" :disable="store.loadingSave" label="Simpan Penolakan Resusitasi (DNR)" type="button"
        color="primary" class="q-mb-xl" @click="onSubmit" />
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { useConcernOperasiInvasifRanapStore } from 'src/stores/simrs/ranap/concernoperasiinvasif'
import { onMounted, ref } from 'vue'

const store = useConcernOperasiInvasifRanapStore()

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

const myForm = ref(null)

onMounted(() => {
  store.initReset(props?.pasien)
  // Paksa menuTab di-set ke Resusitasi dan panggil reset ulang agar values default terisi
  store.menuTab = 'Resusitasi'
  store.initReset(props?.pasien)
  cekHubunganPasien()
})

const cekHubunganPasien = () => {
  const pasien = props.pasien
  const val = store.form.hubunganDgPasien
  if (val === 'Diri Sendiri') {
    store.form.nama = pasien?.nama
    store.form.noKtp = pasien?.nktp
    store.form.tglLahir = pasien?.tgllahir
    store.form.alamat = pasien?.alamat
    store.form.telepon = pasien?.nohp
    const kel = pasien?.kelamin
    if (kel) {
      if (kel.toLowerCase() === 'l' || kel.toLowerCase().startsWith('laki')) {
        store.form.lp = 'Laki-Laki'
      } else if (kel.toLowerCase() === 'p' || kel.toLowerCase().startsWith('perempuan')) {
        store.form.lp = 'Perempuan'
      } else {
        store.form.lp = kel
      }
    } else {
      store.form.lp = null
    }
  } else {
    store.form.nama = null
    store.form.noKtp = null
    store.form.tglLahir = null
    store.form.alamat = null
    store.form.telepon = null
    store.form.lp = null
  }
}

function onSubmit() {
  if (!store.form.kdDokter) {
    return notifErrVue('Pelaksana Tindakan (Dokter) wajib dipilih!')
  }
  if (!store.form.kdPetugas) {
    return notifErrVue('Pemberi Informasi (Petugas) wajib dipilih!')
  }
  if (!store.form.nama) {
    return notifErrVue('Nama Penerima Informasi / Penolak Resusitasi wajib diisi!')
  }

  // Simpan data
  store.saveData(props?.pasien, props?.menu?.name)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
