<template>
  <div class="row full-width full-height">
    <div class="col-7">
      <q-form ref="refForm" @submit="onSubmit" class="q-gutter-sm q-pa-lg">

        <div class=" text-weight-bold">Form Surat Keterangan Dokter </div>

        <div>
          <q-option-group v-model="store.defaultJenis" :options="store.jenisSurat" inline
            :rules="[val => !!val || 'Harap pilih salah satu']" />
        </div>

        <q-separator class="q-my-sm"></q-separator>
        <div v-if="store.defaultJenis === 'SRT01'">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-model="store.form.nomorSurat" label="Nomor Surat" outlined dense disable />
            </div>
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.pekerjaan" label="Pekerjaan" outlined dense />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.keperluan" label="Untuk Keperluan" outlined dense />
            </div>
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.golDar" label="Golongan Darah" outlined dense />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.penglihatankiri" label="Penglihatan Kiri" outlined
                dense />
            </div>
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.penglihatankanan" label="Penglihatan Kanan" outlined
                dense />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.pendengarankiri" label="Pendengaran Kiri" outlined
                dense />
            </div>
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.pendengarankanan" label="Pendengaran Kanan" outlined
                dense />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-if="store.form" v-model="store.form.warna" label="Perbedaan warna" outlined dense />
            </div>
            <div class="col-6">
              <q-option-group v-if="store.form" v-model="store.form.doc" :options="documents" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>
            <!-- <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.tinggi" label="Tinggi Badan" outlined dense />
          </div> -->
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">
            <!-- <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.berat" label="Berat Badan" outlined dense />
          </div> -->


          </div>
        </div>

        <div v-else-if="store.defaultJenis === 'SRT02'">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-model="store.form.nomorSurat" label="Nomor Surat (otomatis)" outlined dense disable />
            </div>
            <div class="col-6">
              <app-input v-model="store.form.keperluan" label="Untuk Keperluan" outlined dense />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">

            <div class="col-6">
              <app-input v-model="store.form.pekerjaan" label="Pekerjaan" outlined dense />
            </div>
            <div class="col-6">
              <app-input v-model="store.form.pendidikan" label="Pendidikan" outlined dense />
            </div>

          </div>

          <div class="row q-col-gutter-sm q-mb-sm">


            <div class="col-12">
              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-bold">Status Perkawinan</div>
              <q-option-group v-model="store.form.statusperkawinan" :options="store.kawins" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>

            <div class="col-12">
              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-bold">Psikatopologi</div>
              <q-option-group v-model="store.form.psikatopologi" :options="store.psikatopologis" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>

            <div class="col-12" v-for="(item, i) in store.form.kepribadian" :key="item?.form">
              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-bold">{{ item.form }}</div>
              <q-option-group v-model="item.nilai" :options="store.penilaians" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>


          </div>

          <q-separator class="q-my-sm"></q-separator>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12">
              <app-input v-model="store.form.kecerdasan" label="Kecerdasan" outlined dense />
            </div>
          </div>

          <q-separator class="q-my-xs"></q-separator>


        </div>


        <div v-else-if="store.defaultJenis === 'SRT03'">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <app-input v-model="store.form.nomorSurat" label="Nomor Surat (otomatis)" outlined dense disable />
            </div>
            <div class="col-6">
              <app-input v-model="store.form.keperluan" label="Untuk Keperluan" outlined dense />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-sm">

            <div class="col-6">
              <app-input v-model="store.form.pekerjaan" label="Pekerjaan" outlined dense />
            </div>
            <div class="col-6">
              <app-input v-model="store.form.pendidikan" label="Pendidikan" outlined dense />
            </div>

          </div>

          <div class="row q-col-gutter-sm q-mb-sm">


            <div class="col-12">

              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-bold">Status Perkawinan</div>
              <q-option-group v-model="store.form.statusperkawinan" :options="store.kawins" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>

            <div class="col-12">
              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-bold">Keterangan Riwayat Penguunaan obat-obatan dalam Seminggu Terakhir </div>

            </div>

            <div class="col-12" v-for="(item, i) in store.form.riwayatObat" :key="item?.form">
              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-normal">{{ item.form }}</div>
              <q-option-group v-model="item.nilai"
                :options="item.form === 'Asal Obat' ? store.asalObats : store.adaTidaks" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>

            <div class="col-12">
              <q-separator class="q-my-xs"></q-separator>
              <div class="text-weight-bold">Kesimpulan tentang gejala-gejala penggunaan dan atau penyalahgunaan
                narkotika / zat psikoaktif
              </div>
              <q-option-group v-model="store.form.doc" :options="store.adaTidaks" inline
                :rules="[val => !!val || 'Harap pilih salah satu']" />
            </div>


          </div>

          <q-separator class="q-my-sm"></q-separator>

          <!-- <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12">
              <app-input v-model="store.form.kecerdasan" label="Kecerdasan" outlined dense />
            </div>
          </div> -->

          <q-separator class="q-my-xs"></q-separator>


        </div>


        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12">
            <q-btn color="primary" icon-right="icon-mat-save" label="Simpan" type="submit" unelevated
              :loading="store.loading" class="full-width">
              <q-tooltip class="primary" :offset="[10, 10]">
                Simpan
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-form>
    </div>
    <div class="col-5 full-height bg-grey-3">
      <div class="row full-height">
        <div class="col-12 full-height">
          <ListSuratPage :kdsurat="suhats" :pasien="props.pasien" @delete="deleteData" @print="cetakData" />
        </div>
      </div>
    </div>
  </div>


  <SuratSehatDokumenPage v-if="store?.cetakdata?.kdsurat == 'SRT01'" :pasien="props.pasien" :data="store.cetakdata" />

  <SuratKesehatanJiwaPage v-else-if="store?.cetakdata?.kdsurat == 'SRT02'" :pasien="props.pasien"
    :data="store.cetakdata" />
  <SuratKeteranganNapza v-else-if="store?.cetakdata?.kdsurat == 'SRT03'" :pasien="props.pasien"
    :data="store.cetakdata" />

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useDokumenSuratSehatStore } from '../../../../../stores/simrs/dokumen/erm/suratsehat';
import ListSuratPage from './ListSuratPage.vue'
import SuratSehatDokumenPage from './SuratSehatDokumenPage.vue';
import SuratKesehatanJiwaPage from './SuratKesehatanJiwaPage.vue';
import SuratKeteranganNapza from './SuratKeteranganNapza.vue';

const store = useDokumenSuratSehatStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

// console.log('props surat sehat page', props.pasien);


const suhats = ref('SRT01')

onMounted(() => {
  const polijiwa = props.pasien?.kodepoli === 'POL010' ? true : false
  store.isPolijiwa = polijiwa

  if (polijiwa) {
    // jns.filter(item => item.value === 'SRT02' || item.value === 'SRT03')
    store.defaultJenis = 'SRT02'
  } else {
    // jns.filter(item => item.value === 'SRT01')
    store.defaultJenis = 'SRT01'
  }
  // store.jenisx = jns

  // console.log('jenis surat', jns);

})

const documents = ref([
  {
    label: 'BAIK',
    value: 'BAIK'
  },
  {
    label: 'TIDAK BAIK',
    value: 'TIDAK BAIK'
  }
])
function onSubmit() {
  // Handle form submission logic here
  store.form.noreg = props.pasien?.noreg
  store.form.norm = props.pasien?.norm
  store.form.dokter = props.pasien?.kodedokter
  store.form.kdsurat = suhats.value
  store.form.kdpoli = props.pasien?.kodepoli
  store.form.sistembayar = props.pasien?.sistembayar
  store.form.kddpjp = props.pasien?.kodedokter

  store.form.jenis = store.defaultJenis

  store.simpan(props.pasien)
}

function deleteData(item) {
  // console.log('delete item', item)
  store.batalsurat(props.pasien, item)
  // store.deleteSurat(props.pasien, item)
}

function cetakData(val) {
  store.cekpembayaran(props.pasien, val)
  // store.cetakdata = val
  // store.dialog = true
}


</script>
