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

          <!-- Identitas Pemberi Pernyataan / Penerima Informasi -->
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

          <!-- Informasi Tindakan Pemasangan Restrain -->
          <div class="col-12 text-bold text-subtitle2 q-mb-xs">Informasi Tindakan Pemasangan Restrain</div>
          
          <q-input v-model="store.form.indikasi" label="1. Pengertian Restrain" outlined standout="bg-yellow-3" rows="3" type="textarea" class="col-12" />
          
          <!-- Checklist Tujuan -->
          <div class="col-12 q-mt-sm">
            <div class="text-bold text-caption text-grey-8">2. Pilih Tujuan Pemasangan Restrain:</div>
            <q-list separator bordered class="q-mt-xs">
              <q-item v-for="item in tujuanOptions" :key="item" tag="label" v-ripple dense>
                <q-item-section avatar>
                  <q-checkbox dense v-model="store.form.tujuan" :val="item" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Checklist Komplikasi -->
          <div class="col-12 q-mt-md">
            <div class="text-bold text-caption text-grey-8">3. Pilih Komplikasi Pemasangan Restrain:</div>
            <q-list separator bordered class="q-mt-xs">
              <q-item v-for="item in komplikasiOptions" :key="item" tag="label" v-ripple dense>
                <q-item-section avatar>
                  <q-checkbox dense v-model="store.form.komplikasi" :val="item" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Tambahan detail jika diperlukan -->
          <q-input v-model="store.form.tatacara" label="Tata Cara Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12 q-mt-md" />
          <q-input v-model="store.form.resikoLain" label="Risiko Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />
          <q-input v-model="store.form.alternatif" label="Alternatif Tindakan" outlined standout="bg-yellow-3" rows="2" type="textarea" class="col-12" />

          <q-separator class="col-12 q-my-md" />

          <!-- Saksi Pasien -->
          <app-input-simrs v-model="store.form.saksiPasien" label="Nama Saksi Pasien / Keluarga" class="col-12"
            :valid="{ required: false }" />

          <q-separator class="col-12 q-my-md" />

          <!-- Tanda Tangan -->
          <div class="col-12">
            <div class="text-bold q-mb-sm">Tanda Tangan Pernyataan Persetujuan (Restrain)</div>
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
      <q-btn :loading="store.loadingSave" :disable="store.loadingSave" label="Simpan Persetujuan Restrain" type="button"
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

const tujuanOptions = [
  'Memberikan perlindungan dan menjamin keselamatan pasien dan lingkungan terhadap cidera',
  'Membantu dalam pelaksanaan pemeriksaan diagnostic dan prosedur terapeutik',
  'Untuk memberikan perawatan pada pasien yang mengalami gangguan kepribadian atau pasien yang tidak kooperatif atau gelisah'
]

const komplikasiOptions = [
  'Luka gesekan',
  'Atrofi otot',
  'Hilangnya/berkurangnya densitas tulang',
  'Ulkus dekubitus',
  'Penurunan fungsi tubuh'
]

onMounted(() => {
  store.initReset(props?.pasien)
  // Paksa menuTab di-set ke Restrain dan panggil reset ulang agar values default terisi
  store.menuTab = 'Restrain'
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
    return notifErrVue('Nama Penerima Informasi / Pemberi Persetujuan wajib diisi!')
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
