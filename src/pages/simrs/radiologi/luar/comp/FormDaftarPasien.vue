<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-hide="slide-right" transition-show="slide-left">
    <q-card flat class="fit overflow-hidden">
      <q-form flat class="fit column overflow-hidden" @submit="onSubmit">
        <q-card-section class="col-auto q-pa-none">
          <q-bar class="bg-primary text-white q-pa-sm">
            <div class="f-12">
              Form Permintaan Luar
            </div>
            <q-space />
            <q-btn dense flat icon="icon-mat-close" @click="emits('close')">
              <q-tooltip class="bg-white text-primary">
                Close
              </q-tooltip>
            </q-btn>
          </q-bar>
        </q-card-section>
        <q-card-section class="col full-height q-pa-none overflow-hidden">
          <div class="row fit">
            <div class="col-6 kiri shadow-1 full-height ">
              <div class="column full-height relative-position">

                <div class="col full-height scroll">
                  <div class="row q-pa-lg q-col-gutter-sm">
                    <div class="col-12">
                      <div class=" f-14 text-bold">I. Data Pasien</div>
                      <q-separator class="q-my-sm"></q-separator>
                    </div>
                    <!-- <app-input v-model="store.form.nik" label="Nomor KTP" class="col-12" outlined /> -->
                    <div class="col-12 row q-col-gutter-x-sm">
                      <app-input-simrs v-model="store.form.nik" label="NIK / NO. KTP" :valid="{ min: 16, number: true }"
                        :autofocus="false" class="col-6" />
                      <div class="col-6">
                        <i>Harap diisi NIK / NO. KTP dengan benar untuk otomatisasi data</i>
                      </div>
                    </div>
                    <app-input v-model="store.form.nama" label="Nama" style="width:90%" outlined />
                    <app-input v-model="store.form.temp_lahir" label="Tempat Lahir" outlined class="col-6" />
                    <app-input-date :model="store.form.tgllahir" label="Tgl Lahir" outlined class="col-5"
                      @set-model="(val) => store.form.tgllahir = val" />


                    <div class="col-12">
                      Jenis Kelamin
                      <div class="row items-center">
                        <q-radio v-model="store.form.kelamin" size="sm" val="Laki-laki" label="Laki-laki" />
                        <q-radio v-model="store.form.kelamin" size="sm" val="Perempuan" label="Perempuan" />
                      </div>
                    </div>
                    <q-input v-model="store.form.alamat" outlined type="textarea" rows="2" class="col-12"
                      label="Alamat" />


                  </div>

                </div>
              </div>
            </div>

            <div class="col-6 kanan shadow-1 full-height ">
              <div class="column full-height relative-position">

                <div class="col full-height scroll">
                  <div class="row q-pa-md q-col-gutter-sm">
                    <div class="col-12">
                      <div class=" f-14 text-bold">II. Data Permintaan</div>
                      <q-separator class="q-my-sm"></q-separator>
                    </div>

                    <app-input v-model="store.form.ygmeminta" label="Tempat Permintaan" class="col-8" outlined valid />
                    <app-autocomplete v-model="store.form.jnsPembayaran" outlined label="Jenis Pembayaran" class="col-8"
                      :source="store.jenis" @set-model="(val) => { store.form.jnsPembayaran = val }" />
                    <app-autocomplete v-if="store.form.jnsPembayaran === 'Perusahaan'"
                      v-model="store.form.perusahaan_id" outlined label="Perusahaan" class="col-10"
                      autocomplete="perusahaan" option-value="id" option-label="perusahaan" :source="store.perusahaans"
                      @get-source="store.getPerusahaan" @selected="(val) => { store.form.perusahaan_id = val }" />

                    <q-input v-model="store.form.permintaan" label="Permintaan" autogrow outlined standout="bg-yellow-3"
                      icon="icon-mat-search" :rules="[val => !!val || 'Harap cari pemeriksaan dahulu']"
                      lazy-rules="ondemand" hide-bottom-space @click="modalOpen = true" class="col-12" />




                    <div v-if="store.form.permintaans?.length" class="col-12">
                      <q-list bordered separator>

                        <q-item v-for="(row, n) in store.form.permintaans" :key="n">
                          <q-item-section>
                            <q-item-label>{{ row?.val }}</q-item-label>
                            <q-item-label caption class="text-bold">Rp . {{ row.total }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <div class="column q-gutter-sm f-12 text-black">
                              <div class="flex justify-end text-right">
                                <span class="q-mr-sm">Jumlah : </span>
                                <span style="min-width: 20px;">
                                  {{ row.jumlah }}
                                  <q-popup-edit v-model="row.jumlah" buttons label-set="Update" label-cancel="Batal"
                                    @hide="(val) => {
                                      if (!isNaN(val) && !isNaN(parseFloat(val))) {
                                        return true
                                      } else {
                                        return false
                                      }
                                    }" v-slot="scope">
                                    <app-input-simrs v-model="scope.value" label="Jumlah" :valid="{ number: true }" />
                                  </q-popup-edit>
                                </span>
                              </div>
                              <div class="flex justify-end">
                                <span class="q-mr-sm">Ukuran : </span>
                                <span style="min-width: 20px;">
                                  {{ row.ukuran }}
                                  <q-popup-edit v-model="row.ukuran" buttons label-set="Update" label-cancel="Batal"
                                    @hide="(val) => {
                                      if ((!!val || props.valid?.required || val === 0)) {
                                        return true
                                      } else {
                                        return false
                                      }
                                    }" v-slot="scope">
                                    <q-select v-model="scope.value" dense standout="bg-yellow-3 text-black" outlined
                                      label="Ukuran" :options="store.ukurans" emit-value map-options
                                      input-class="ellipsis" fill-input hide-bottom-space class="col-3" />
                                  </q-popup-edit>
                                </span>
                              </div>
                            </div>
                          </q-item-section>
                        </q-item>


                      </q-list>
                    </div>
                    <div style="padding-bottom:100px"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="absolute-bottom full-width bg-yellow-3 q-pa-md">
            <div class="row justify-between">
              <q-btn label="Kembali" color="dark" no-caps v-close-popup />
              <q-btn type="submit" label="Simpan" color="primary" no-caps :disable="store.loadingSimpan"
                :loading="store.loadingSimpan" />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>




    <!-- modal permintaan -->
    <ModalPermintaan v-model="modalOpen" :lists="storeListPasienRadiologi.namaPemeriksaans" :pasien="pasien"
      @ok="(val) => pilihPermintaan(val)" />

    <dialog-peserta v-model="store.openDialogPeserta" :peserta="store.cekPeserta" @ok="copyDataFromBpjs()" />
  </q-dialog>
</template>

<script setup>
import { ref, defineAsyncComponent, watch } from 'vue'
import { useFormRadiologiLuarStore } from 'src/stores/simrs/radiologi/formradiologiluar'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'


const DialogPeserta = defineAsyncComponent(() => import('src/pages/simrs/pendaftaran/rawatinap/pagemenus/compFormPendaftaran/DialogPeserta.vue'))

const refDialog = ref(null)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['close'])


const ModalPermintaan = defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/compradiologi/ModalPermintaan.vue'))

const store = useFormRadiologiLuarStore()

const storeListPasienRadiologi = useListPasienRadiologiStore()

const modalOpen = ref(false)

function pilihPermintaan(val) {

  console.log('val', val);


  const arr = val?.length ? val.map(x => {
    const ukuran = x.ukuran || '43 x 35'
    const jumlah = x.jumlah || 1
    const pelaksana = x.pelaksana || null
    const kdPelaksana = x.kdPelaksana || null
    return {
      ...x,
      kdPelaksana, ukuran, jumlah, pelaksana
    }
  }) : []
  const implode = arr?.length ? arr?.map(x => x.nama).join('-. ') : ''
  const str = `-. ${implode}`
  store.form.permintaan = str
  store.form.permintaans = arr



  modalOpen.value = false

  // console.log('str', str);

}


function onSubmit() {
  // console.log('simpan', store.form);
  store.simpan()
    .then(() => {
      emits('close')
    })
}

const cekKtp = (e) => {
  // console.log('e', e)
  // Output NIK tidak valid
  if (!isNumber(e)) {
    console.log('nik tidak valid')
    return
  }
  const digit = e?.toString()?.length
  if (digit !== 16) {
    console.log('nik tidak valid')
  }
  else {
    const nik = e.toString()
    const N = (new Date()).getFullYear().toString().substr(-2) // tahun sekarang
    const prov = nik?.substring(0, 2) ?? ''
    const kabkota = nik?.substring(2, 4) ?? ''
    const kec = nik?.substring(4, 6) ?? ''
    const tglNik = nik?.substring(6, 8) ?? '' // tanggal NIK
    const blnNik = nik?.substring(8, 10) ?? ''
    const thnNik = nik?.substring(10, 12) ?? '' // tahun NIK
    // const urut = nik.substring(12, 16) // nourut ktp sesuai tgl lahir di ktp

    const klmn = tglNik > 40 ? 'Perempuan' : 'Laki-laki'

    // console.log('nik valid', N)
    // console.log('nik thn', thnNik)
    // console.log('nik tgl', tglNik)
    // console.log('nik bln', blnNik)
    // console.log('nik prov', prov)
    // console.log('nik kabkota', kabkota)
    // console.log('nik kec', kec)
    // console.log('nik klmn', klmn)

    // update store kode ktp


    // update paramWilayah


    // autoGetServer(prov, kabkota, kec)

    const tahun = parseInt(thnNik) < parseInt(N) ? `20${thnNik}` : `19${thnNik}`
    const tglAsli = tglNik > 40 ? tglNik - 40 : tglNik
    const tgl = tglAsli < 10 ? `${tglAsli}` : tglAsli

    // update store pasien

    // store.form.temp_lahir = kabkota
    store.form.kelamin = klmn
    store.form.tgllahir = `${tahun}-${blnNik}-${tgl}`

    store.cekPesertaBpjs('nik', nik)
  }
}

function isNumber(input) {
  return !isNaN(input) && !isNaN(parseFloat(input))
}


watch(() => store.form.nik, (val) => {
  if (val !== null && val !== '') {
    cekKtp(val)
  }
}, { deep: true })



function copyDataFromBpjs() {
  store.form.nama = store.cekPeserta?.nama

  store.openDialogPeserta = false
}





</script>