<template>
  <q-dialog persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="fit bg-grey-3">
      <q-form class="column full-height" @submit="simpan">
        <div class="col-auto bg-primary text-white">
          <q-bar class="">
            <div>FORM IMPLEMENTASI</div>
            <q-space />


            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>

        <div class="col scroll">
          <q-card-section class="row q-col-gutter-md justify-around">
            <div class="col-3">
              <q-card>
                <q-bar class="bg-dark text-white">
                  <div class="f-12 text-bold">METODE YG DIGUNAKAN</div>
                </q-bar>
                <q-card-section class="q-pa-sm">
                  <q-list dense separator bordered>
                    <q-item v-for="item in store.metodis" :key="item" tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="store.form.metode" :val="item" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>

              </q-card>
            </div>
            <div class="col-3">
              <q-card>
                <q-bar class="bg-dark text-white">
                  <div class="f-12 text-bold">MATERI</div>
                </q-bar>
                <q-card-section class="q-pa-sm">
                  <q-list dense separator bordered>
                    <q-item v-for="item in store.materiDpjp" :key="item" tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="store.form.materi" :val="item" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <q-input class="q-mt-md" outlined standout="bg-yellow-3" type="textarea"
                    v-model="store.form.materiLain" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card>
                <q-bar class="bg-dark text-white">
                  <div class="f-12 text-bold">MEDIA</div>
                </q-bar>
                <q-card-section class="q-pa-sm">
                  <q-list dense separator bordered>
                    <q-item v-for="item in store.medias" :key="item" tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox v-model="store.form.media" :val="item" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <!-- <q-input class="q-mt-md" outlined standout="bg-yellow-3" type="textarea"
                    v-model="store.form.materiLain" /> -->
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3">
              <q-card>
                oooi
              </q-card>
            </div>
          </q-card-section>
        </div>
        <div class="col-auto bg-primary q-pa-md">
          <div class="row justify-between">
            <q-btn label="Kembali" color="dark" text-color="white" v-close-popup />
            <q-btn type="submit" label="Simpan" color="yellow-3" text-color="dark" />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi';


const store = useImplementasiEdukasiRanapStore()

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: Object,
    default: null
  },
})


const simpan = () => {
  console.log('simpan');

}


</script>