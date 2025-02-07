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
    <!-- <dialog-preview v-model="store.dialogPreview" :pasien="pasien" :content="contentPreview" @on-selected-reseps="(val) => {
      store.form.reseps = val
    }" /> -->
  </q-dialog>
</template>

<script setup>
import { useNurseNoteRanapStore } from 'src/stores/simrs/ranap/nursenote';
import { defineAsyncComponent, ref } from 'vue';

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

const contentPreview = ref(null)

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