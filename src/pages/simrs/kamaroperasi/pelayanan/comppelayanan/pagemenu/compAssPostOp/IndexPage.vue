<template>
  <q-card flat bordered class="bg-transparent full-height column q-ma-xs">
    <div class="col-auto bg-primary text-white q-pa-md">
      <div class="row justify-between items-center">
        <div>
          <div class="f-20">
            LIST CPPT
          </div>
          <div class="caption text-grey-4">
            Sebagai Catatan Perkembangan Pasien
          </div>
        </div>
        <div>
          <q-btn rounded outline color="white" @click="settings.isForm = !settings.isForm">
            <q-icon name="icon-mat-add" size="xs" /><span class="q-ml-xs">Tambah</span>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="col full-height">
      <ListSoap :pasien="pasien" :kasus="kasusComputed" :nakes="nakesComputed" :items="store.items"
        :notasis="store.notasis" :store="store" />
    </div>

    <DialogForm v-model="settings.isForm" :pasien="pasien" :kasus="kasusComputed" :nakes="nakesComputed"
      @exit="settings.isForm = false" />
  </q-card>
</template>

<script setup>
import { defineAsyncComponent, onMounted, computed } from 'vue'
import useForm from './comp/useForm'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'

const ListSoap = defineAsyncComponent(() => import('./comp/ListSoap.vue'))
const DialogForm = defineAsyncComponent(() => import('./comp/DialogForm.vue'))

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pasien: { type: Object, default: () => null },
  kasus: { type: Object, default: () => null },
  nakes: { type: String, default: null }
})

const auth = useAplikasiStore()
const ranapStore = usePengunjungRanapStore()

const nakesComputed = computed(() => props.nakes ?? auth?.user?.pegawai?.kdgroupnakes)

const kasusComputed = computed(() => {
  if (props.kasus) return props.kasus
  const jnsKasus = props.pasien?.kd_jeniskasus
  if (ranapStore.jeniskasus?.length && jnsKasus) {
    return ranapStore.jeniskasus.find(x => x.kode === jnsKasus) ?? null
  }
  return null
})

// eslint-disable-next-line no-unused-vars
const { settings, store, storeAnamnesis, storePemeriksaanUmum, storePenilaian } = useForm(props.pasien)

onMounted(() => {
  // console.log('props', props.nakes)
  if (!ranapStore.jeniskasus?.length) {
    ranapStore.getJenisKasus()
  }

  store.getCppt(props?.pasien?.cppt)
  Promise.all([
    store.getNotasiDpjp(props?.pasien?.noreg)
  ])
})

</script>
