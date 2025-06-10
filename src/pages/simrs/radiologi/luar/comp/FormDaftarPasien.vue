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
                    <app-input v-model="store.form.nik" label="Nomor KTP" class="col-12" outlined />
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
  </q-dialog>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useFormRadiologiLuarStore } from 'src/stores/simrs/radiologi/formradiologiluar'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
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
  console.log('simpan', store.form);
  store.simpan()
    .then(() => {
      emits('close')
    })
}





</script>