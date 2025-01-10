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
            </div>
          </q-card-section>
        </div>

        <div class="col full-height scroll bg-grey-4">
          <div class="row q-pa-md q-col-gutter-md justify-around">
            <div class="col-6">
              <div class="row q-col-gutter-md">
                <div class="col-6" style="height: 300px;">
                  <q-card flat class="fit column">
                    <div class="col-auto q-pa-sm text-bold bg-primary text-white">
                      <div class="f-14">TINDAKAN</div>
                    </div>
                    <div class="col fit scroll">
                      <div class="row q-pa-md q-col-gutter-md">
                        <autocomplete-input-two v-model="store.form.tindakan" :options="store.tindakans"
                          option-label="tindakan" option-value="tindakan" :filters-by="['tindakan']" label="Tindakan"
                          class="col-12" @set-model="(val) => {
                            // console.log('val', val);

                          }" />
                        <!-- <app-input-simrs label="Tindakan" /> -->
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
                        <app-input-simrs label="BB" class="col-3" />
                        <app-input-simrs label="TB" class="col-3" />
                        <app-input-simrs label="Suhu" class="col-3" />
                        <app-input-simrs label="N" class="col-3" />
                        <app-input-simrs label="Sis" class="col-3" />
                        <app-input-simrs label="Dia" class="col-3" />
                        <app-input-simrs label="RR" class="col-3" />
                        <app-input-simrs label="SPO2" class="col-3" />
                        <app-input-simrs label="NYERI" class="col-6" />
                        <app-input-simrs label="SKORING" class="col-6" />
                        <!-- <q-input type="textarea" outlined standout="bg-yellow-3" label="Implementasi" class="col" /> -->
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
                        <app-input-simrs label="Diagnosa Keperawatan" />
                        <q-input type="textarea" outlined standout="bg-yellow-3" label="Implementasi" />
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
                        <app-input-simrs label="Mode" class="col-6" />
                        <app-input-simrs label="Fraksi O2" class="col-6" />
                        <app-input-simrs label="Frekuensi" class="col-6" />
                        <app-input-simrs label="Peep" class="col-6" />
                        <app-input-simrs label="P ins" class="col-6" />
                        <app-input-simrs label="I:E Rasio" class="col-6" />
                        <!-- <app-input-simrs label="RR" class="col-3" />
                        <app-input-simrs label="SPO2" class="col-3" />
                        <app-input-simrs label="NYERI" class="col-12" />
                        <app-input-simrs label="SKORING" class="col-12" /> -->
                        <!-- <q-input type="textarea" outlined standout="bg-yellow-3" label="Implementasi" class="col" /> -->
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
                    <app-input-simrs label="Infus" class="col-12" />
                    <app-input-simrs label="Pump" class="col-12" />
                    <app-input-simrs label="Injeksi" class="col-12" />
                    <app-input-simrs label="Oral" class="col-12" />
                    <app-input-simrs label="Tetes" class="col-12" />
                    <app-input-simrs label="Albumin" class="col-12" />
                    <app-input-simrs label="Makan & Minum" class="col-12" />
                    <app-input-simrs label="Zonde" class="col-12" />
                    <app-input-simrs label="Water Metabolism" class="col-12" />
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
                    <app-input-simrs label="Urine" class="col-12" />
                    <app-input-simrs label="Drine" class="col-12" />
                    <app-input-simrs label="Muntah" class="col-12" />
                    <app-input-simrs label="Feces" class="col-12" />
                    <app-input-simrs label="IVVI" class="col-12" />
                    <app-input-simrs label="Pendarahan" class="col-12" />
                    <app-input-simrs label="UFG" class="col-12" />
                    <app-input-simrs label="Produksi GC" class="col-12" />
                    <!-- <app-input-simrs label="Water Metabolism" class="col-12" /> -->
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-auto bg-primary q-pa-md">
          <div class="row justify-between">
            <q-btn rounded outline color="orange" icon="icon-mat-arrow_back" v-close-popup>
              <span class="text-orange q-ml-sm">Kembali </span>
            </q-btn>
            <q-btn rounded outline color="white" icon="icon-mat-save">
              <span class=" q-ml-sm">Simpan Catatan </span>
            </q-btn>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useNurseNoteRanapStore } from 'src/stores/simrs/ranap/nursenote';
import { defineAsyncComponent } from 'vue';

const AutocompleteInputTwo = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/AutocompleteInputTwo.vue'))
const store = useNurseNoteRanapStore()
const simpan = () => {
  console.log('simpan');

}

const onShow = () => {
  store.initForm()
}

</script>