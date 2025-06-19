<template>
  <div v-if="filterKonsul?.length">
    <q-bar class="bg-accent">
      <div>KONSUL ANTAR POLI</div>
    </q-bar>
    <div class="q-px-xl q-py-md">
      <q-timeline color="secondary" v-for="(item, j) in filterKonsul" :key="j">
        <q-timeline-entry title="Pengantar Konsul : "
          :subtitle="`Konsul Ke ${item?.poli_tujuan?.rs2 || '-'} : Pada Tgl ${humanDate(item?.tgl_kunjungan) || '-'}`"
          icon="icon-mat-email">
          <div style="margin-top: -10px;" v-html="body(item)" />
        </q-timeline-entry>
      </q-timeline>
    </div>
  </div>
</template>

<script setup>
import { humanDate, jamTnpDetik } from 'src/modules/formatter'
import { computed } from 'vue'



const props = defineProps({
  items: {
    type: Object,
    default: () => []
  },
  pasien: {
    type: Object,
    default: null
  }
})

const filterKonsul = computed(() => {
  const noreg = props?.pasien?.noreg
  console.log('noreg', noreg);

  return props?.items?.filter((item) => item?.noreg_baru || item?.noreg_lama === noreg)
})



const body = (item) => {
  return `<div > 
      <div> Dengan Hormat,</div>
      <div> Mohon bantuan  <b> DPJP ${item?.poli_tujuan?.rs2 || '-'}</b> untuk konsultasi masalah medik saat ini, Atas pasien ini dengan kondisi : </div>
      <div> <b>${item?.pertanyaan}</b> </div>


      <hr style="border-color: gray"/>

      <div> <b>JAWBAN KONSUL : </div>
        <hr style="border-color: gray"/>
      <div> Dengan Hormat,</div>
      <div> Sesuai Permintaan konsultasi pada Pemeriksaan pasien, kami dapati saat ini Saran Tindakan medik / Pengobatan : </div>
      <div> <b>${item?.jawaban || '-'}</b> </div>
      <div class="text-right"></b> dijawab Pada Tgl : <b>${humanDate(item?.updated_at)} </b> Jam : <b>${jamTnpDetik(item?.updated_at)}</b></div>
    </div>`
}


</script>