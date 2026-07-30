<template>
  <div class="fit bg-grey-3">
    <!-- HEADER NAVBAR PERSIS SEPERTI NURSE NOTE -->
    <div class="col-auto bg-primary text-white q-pa-md shadow-2">
      <div class="row justify-between items-center">
        <div>
          <div class="f-20 text-bold flex items-center">
            <q-icon name="icon-mat-monitor_heart" class="q-mr-sm" size="24px" />
            STATUS SEDASI
          </div>
          <div class="caption text-grey-3">
            Catatan Perkembangan Pemantauan Selama & Pasca Sedasi Pasien
          </div>
        </div>
        <div class="row items-center q-gutter-x-sm">
          <q-btn
            round
            flat
            color="white"
            icon="icon-mat-refresh"
            dense
            class="q-mr-xs"
            @click="store.getData(pasien)"
          >
            <q-tooltip class="bg-slate-900 text-white text-caption">Refresh Data Status Sedasi</q-tooltip>
          </q-btn>

          <q-btn rounded outline color="white" class="text-weight-bold" @click="tambahBaru">
            <q-icon name="icon-mat-add" size="xs" /><span class="q-ml-xs">Tambah Status Sedasi</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- MAIN LIST VIEW AREA -->
    <div class="col full-height">
      <ListPage :pasien="pasien" @open-form="isForm = true" />
    </div>

    <!-- FORM MODAL DIALOG (SLIDE OVER FROM RIGHT) -->
    <DialogFormAdd v-model="isForm" :pasien="pasien" :kasus="kasus" :nakes="nakes" />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { usePascaSedasiRanapStore } from 'src/stores/simrs/ranap/pascasedasi'

const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const DialogFormAdd = defineAsyncComponent(() => import('./comp/DialogFormAdd.vue'))

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  }
})

const store = usePascaSedasiRanapStore()
const isForm = ref(false)

function tambahBaru() {
  store.resetForm(props.pasien)
  isForm.value = true
}
</script>

<style lang="scss" scoped>
.f-20 {
  font-size: 18px;
}
</style>
