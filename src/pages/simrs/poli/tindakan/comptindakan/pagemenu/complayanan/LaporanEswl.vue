<template>
  <div class="row fit">
    <div class="col-7 full-height column relative-position" style="overflow: hidden;">
      <FormComp
        :key="props.pasien"
        :pasien="props.pasien"
      />
    </div>
    <div class="col-5 full-height bg-grey-4 column relative-position" style="overflow: hidden;">
      <ListComp
        v-if="pasien.laporaneswl?.length"
        :lists="pasien?.laporaneswl"
        :listdokter="store.listdokters"
        :listperawat="store.listperawats"
        :pasien="props.pasien"
      />

      <div
        v-else
        class="full-height column flex-center text-grey-6 text-bold"
      >
        <q-icon name="icon-mat-assignment" size="50px" class="q-mb-sm" />
        <div>Belum Ada Data Laporan ESWL Tersimpan</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ListComp from './compLaporanEswl/ListComp.vue'
import FormComp from './compLaporanEswl/FormComp.vue'
import { useLaporanEswlPoliStore } from 'src/stores/simrs/pelayanan/poli/laporanEswl'
import { onMounted } from 'vue'

const store = useLaporanEswlPoliStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

onMounted(() => {
  store.getListDokter()
  store.getListPerawat()
})
</script>
