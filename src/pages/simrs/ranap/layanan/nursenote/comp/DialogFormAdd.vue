<template>
  <q-dialog persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down" @show="onShow">
    <q-card class="fit bg-grey-3">
      <q-form class="column full-height" @submit="simpan">

        <div class="col-auto bg-primary text-white">
          <q-bar class="">
            <div>FORM Nurse Note</div>
            <q-space />


            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>

        <div class="col-auto bg-white">
          <q-card-section class="row justify-between">
            <div class="q-gutter-md">
              <q-btn rounded outline color="orange" icon="icon-mat-arrow_back" v-close-popup>
                <span class="text-orange-9 q-ml-sm">Kembali </span>
              </q-btn>
              <q-btn rounded outline color="primary" @click="store.dialogPreview = true">
                <span class="text-primary q-ml-sm">Lihat Eresep </span>
              </q-btn>
            </div>
          </q-card-section>
        </div>

        <div class="col full-height bg-grey-4">

          <card-column :pasien="pasien" :kasus="kasus" />

          <!-- <div class="row q-pa-md q-col-gutter-md justify-around">

            <div class="col-6">
              <div class="row q-col-gutter-md">

                <div class="col-6" style="height: 300px;">
                  <q-card flat class="fit column">
                    <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                      <div class="f-14">TINDAKAN</div>
                    </div>
                    <div class="col fit scroll">
                      <div class="row q-pa-md q-col-gutter-sm">
                        <autocomplete-input-two v-model="store.form.tindakan" :options="store.tindakans"
                          option-label="tindakan" option-value="tindakan" :filters-by="['tindakan']" label="Tindakan"
                          class="col-12" @set-model="(val) => {
                            console.log('val', val);

                          }" />
                        <q-input v-model="store.form.keterangan" type="textarea" outlined standout="bg-yellow-3"
                          label="Keterangan" class="col-12" />
                      </div>
                    </div>
                  </q-card>
                </div>

                <div class="col-6" style="height: 300px;">
                  <q-card flat class="fit column">
                    <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                      <div class="f-14">OBSERVASI</div>
                    </div>
                    <div class="col full-height scroll">
                      <div class="row q-pa-md q-col-gutter-sm">
                        <app-input-simrs v-model="store.form.bb" label="BB" class="col-3" />
                        <app-input-simrs v-model="store.form.tb" label="TB" class="col-3" />
                        <app-input-simrs v-model="store.form.suhu" label="Suhu" class="col-3" />
                        <app-input-simrs v-model="store.form.nadi" label="N" class="col-3" />
                        <app-input-simrs v-model="store.form.sis" label="Sis" class="col-3" />
                        <app-input-simrs v-model="store.form.dia" label="Dia" class="col-3" />
                        <app-input-simrs v-model="store.form.rr" label="RR" class="col-3" />
                        <app-input-simrs v-model="store.form.spo2" label="SPO2" class="col-3" />
                        <app-input-simrs v-model="store.form.nyeri" label="NYERI" class="col-6" />
                        <app-input-simrs v-model="store.form.skor" label="SKORING" class="col-6" />
                        <div class="col-12">
                          <q-separator></q-separator>
                        </div>
                        <app-input-simrs v-model="store.form.cvp" label="CVP" class="col-4" />
                        <app-input-simrs v-model="store.form.icp" label="ICP" class="col-4" />
                        <app-input-simrs v-model="store.form.gcs" label="GCS" class="col-4" />
                        <div class="col-4">Kejang, Durasi </div> <app-input-simrs v-model="store.form.kejang"
                          label="terjadi" class="col-grow" />

                      </div>
                    </div>
                  </q-card>
                </div>

                <div class="col-6" style="height: 300px;">
                  <q-card flat class="fit column">
                    <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                      <div class="f-14">IMPLEMENTASI</div>
                    </div>
                    <div class="col full-height scroll">
                      <div class="q-pa-md">

                        <app-input-simrs v-model="store.form.dx" label="Diagnosa Keperawatan / Kebidanan" />
                        <q-input v-model="store.form.implementasi" type="textarea" outlined standout="bg-yellow-3"
                          label="Implementasi" />
                      </div>
                    </div>
                  </q-card>
                </div>

                <div class="col-6" style="height: 300px;">
                  <q-card flat class="fit column">
                    <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                      <div class="f-14">VENTILATOR MENU</div>
                    </div>
                    <div class="col full-height scroll">
                      <div class="row q-pa-md q-col-gutter-sm">
                        <app-input-simrs v-model="store.form.mode" label="Mode" class="col-6" />
                        <app-input-simrs v-model="store.form.fraksio2" label="Fraksi O2" class="col-6" />
                        <app-input-simrs v-model="store.form.frek" label="Frekuensi" class="col-6" />
                        <app-input-simrs v-model="store.form.peep" label="PEEP" class="col-6" />
                        <app-input-simrs v-model="store.form.pins" label="P ins" class="col-6" />
                        <app-input-simrs v-model="store.form.ratio" label="I:E Rasio" class="col-6" />
                      </div>
                    </div>
                  </q-card>
                </div>

              </div>
            </div>

            <div class="col">
              <q-card flat class="fit column">
                <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                  <div class="f-14">INTAKE</div>
                </div>
                <div class="col full-height scroll">
                  <div class="row q-pa-md q-col-gutter-sm">
                    <div class="col-4">Infus </div> <app-input-simrs v-model="store.form.infus" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Pump </div> <app-input-simrs v-model="store.form.pump" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Obat-obatan </div> <app-input-simrs v-model="store.form.obat" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Albumin </div> <app-input-simrs v-model="store.form.albumin" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Makan & Minum </div> <app-input-simrs v-model="store.form.mamin"
                      label="mililiter" class="col-grow" />
                    <div class="col-4">Zonde </div> <app-input-simrs v-model="store.form.zonde" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Water Metabolism </div> <app-input-simrs v-model="store.form.water"
                      label="mililiter" class="col-grow" />

                  </div>
                </div>
              </q-card>
            </div>
            <div class="col" style="min-height: 600px;">
              <q-card flat class="fit column">
                <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                  <div class="f-14">OUTPUT</div>
                </div>
                <div class="col full-height scroll">
                  <div class="row q-pa-md q-col-gutter-sm">
                    <div class="col-4">Urine </div> <app-input-simrs v-model="store.form.urine" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Drain </div> <app-input-simrs v-model="store.form.drain" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Muntah </div> <app-input-simrs v-model="store.form.muntah" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Feces </div> <app-input-simrs v-model="store.form.feces" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">IWL </div> <app-input-simrs v-model="store.form.iwl" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Pendarahan </div> <app-input-simrs v-model="store.form.pendarahan"
                      label="mililiter" class="col-grow" />
                    <div class="col-4">UFG </div> <app-input-simrs v-model="store.form.ufg" label="mililiter"
                      class="col-grow" />
                    <div class="col-4">Produksi GC </div> <app-input-simrs v-model="store.form.produksigc"
                      label="mililiter" class="col-grow" />
                  </div>
                </div>
              </q-card>
            </div>
          </div> -->
        </div>

        <div class="col-auto bg-primary q-pa-md">
          <div class="row justify-between">
            <q-btn rounded outline color="orange" icon="icon-mat-arrow_back" v-close-popup>
              <span class="text-orange q-ml-sm">Kembali </span>
            </q-btn>
            <q-btn :loading="store.loading" :disabled="store.loading" type="submit" rounded outline color="white"
              icon="icon-mat-save">
              <span class=" q-ml-sm">Simpan Catatan </span>
            </q-btn>
          </div>
        </div>
      </q-form>
    </q-card>




    <!-- dialog dynamic -->
    <dialog-preview v-model="store.dialogPreview" />
  </q-dialog>
</template>

<script setup>
import { useNurseNoteRanapStore } from 'src/stores/simrs/ranap/nursenote';
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const CardColumn = defineAsyncComponent(() => import('./CardColumn.vue'))
const AutocompleteInputTwo = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/AutocompleteInputTwo.vue'))
const DialogPreview = defineAsyncComponent(() => import('./DialogPreview.vue'))

const store = useNurseNoteRanapStore()

const simpan = () => {
  // console.log('simpan');
  store.simpanData(props.pasien)

}

const onShow = () => {
  previewDiagKeperawatan()
  store.initForm()
}

const previewDiagKeperawatan = () => {

  const dxkep = props?.pasien?.diagnosakeperawatan || []
  console.log('props', dxkep);
}

</script>