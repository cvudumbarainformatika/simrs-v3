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

          <!-- Identitas Pemberi Pernyataan -->
          <app-input-simrs v-model="store.form.nama" label="Nama Penerima Informasi / Pemberi Pernyataan"
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

          <!-- Pilihan Persetujuan vs Penolakan -->
          <div class="col-12 flex items-center q-py-sm bg-grey-2 q-px-md rounded-borders">
            <span class="text-bold q-mr-md">Apakah Pasien / Keluarga Setuju diberikan Tindakan Transfusi Darah?</span>
            <q-radio class="q-ml-sm" size="md" v-model="store.form.setuju" val="Iya" label="SETUJU (Persetujuan / RM IRNA-18)" color="primary" />
            <q-radio class="q-ml-lg" size="md" v-model="store.form.setuju" val="Tidak" label="MENOLAK (Penolakan / RM IRNA-19)" color="negative" />
          </div>

          <!-- Golongan Darah - Hanya Tampil jika Setuju -->
          <div v-if="store.form.setuju === 'Iya'" class="col-12 row q-col-gutter-sm items-center q-mt-sm">
            <div class="col-md-4 col-sm-12">
              <q-select v-model="store.form.golonganDarah" label="Golongan Darah Pasien" outlined dense
                :options="['A', 'B', 'AB', 'O', 'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'Lainnya']"
                use-input fill-input hide-selected @new-value="(val, done) => done(val, 'add-unique')" />
            </div>
            <div class="col-md-8 col-sm-12 text-grey-7 text-caption">
              *Masukkan Golongan Darah pasien sesuai hasil pemeriksaan laboratorium.
            </div>
          </div>

          <q-separator class="col-12 q-my-md" />

          <!-- Saksi Pasien -->
          <app-input-simrs v-model="store.form.saksiPasien" label="Nama Saksi Pasien / Keluarga" class="col-12"
            :valid="{ required: false }" />

          <q-separator class="col-12 q-my-md" />

          <!-- Tanda Tangan -->
          <div class="col-12">
            <div class="text-bold q-mb-sm">Tanda Tangan Pernyataan</div>
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
    <q-card-actions align="right" class="q-pa-md ">
      <q-btn :loading="store.loadingSave" :disable="store.loadingSave" label="Simpan Inform Concern" type="button"
        color="primary" class="q-mb-xl" @click="onSubmit" />
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { useConcernOperasiInvasifRanapStore } from 'src/stores/simrs/ranap/concernoperasiinvasif'
import { defineAsyncComponent, onMounted, ref } from 'vue'

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
  store.initReset(props?.pasien, 'TransfusiDarah')
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
    return notifErrVue('Nama Penerima Informasi wajib diisi!')
  }
  if (store.form.setuju === 'Iya' && !store.form.golonganDarah) {
    return notifErrVue('Golongan Darah wajib diisi jika menyetujui tindakan!')
  }
  
  store.saveData(props?.pasien, props?.menu?.name)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
</style>
