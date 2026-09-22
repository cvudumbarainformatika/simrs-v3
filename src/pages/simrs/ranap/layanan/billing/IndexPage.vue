<template>
  <q-page class="fit absolute column">
    <div class="fit">
      <q-splitter v-model="splitterModel" :limits="[15, 35]" before-class="overflow-hidden"
        after-class="overflow-hidden" class="fit">
        <template #before>
          <div class="column fit bg-indigo-1">
            <div class="col full-height scroll">
              <q-tabs v-model="innerTab" vertical class="text-dark bg-white shadow-1" active-color="orange-10"
                active-bg-color="indigo-1" no-caps align="left">
                <q-tab v-for="menu in menus" :key="menu.name" :name="menu?.name"
                  style="justify-content: left; border-bottom: 1px solid #e0e0e0; padding-left: 10px; min-height: 38px;">
                  <div class="text-bold" style="font-size: 11px;">
                    {{ menu?.label }}
                  </div>
                </q-tab>
              </q-tabs>
            </div>
          </div>
        </template>

        <template #after>
          <div class="column fit">
            <div class="col fit">
              <q-tab-panels v-model="innerTab" animated vertical transition-prev="jump-up"
                transition-next="jump-up" class="bg-indigo-1 fit" keep-alive>
                <q-tab-panel v-for="menu in menus" :key="menu.name" :name="menu?.name" class="fit q-pa-none">
                  <component :is="menu?.comp" :pasien="pasien" :menu="menu" :kasus="kasus" :data-header="dataHeader" />
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'

const fakturLayananComp = shallowRef(defineAsyncComponent(() => import('./fakturlayanan/IndexPage.vue')))

const menus = ref([
  {
    name: 'rekap-billing',
    label: 'FAKTUR REKAP',
    title: 'FAKTUR REKAP',
    desc: 'Faktur Rekap Pasien',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: shallowRef(defineAsyncComponent(() => import('./rekap/IndexPage.vue')))
  },
  {
    name: 'faktur-detail',
    label: 'FAKTUR DETAIL',
    title: 'FAKTUR DETAIL',
    desc: 'Faktur Detail Billing Pasien',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: shallowRef(defineAsyncComponent(() => import('./fakturdetail/IndexPage.vue')))
  },
  {
    name: 'tindakan-dokter',
    label: 'TINDAKAN DOKTER',
    title: 'Jasa Pelayanan Dokter Umum/Spesialis',
    desc: 'Rincian Tindakan Dokter',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'tindakan-perawat',
    label: 'TINDAKAN PERAWAT / BIDAN',
    title: 'Tindakan Keperawatan',
    desc: 'Rincian Tindakan Keperawatan',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'gizi',
    label: 'GIZI',
    title: 'Instalasi Gizi',
    desc: 'Rincian Asuhan Gizi & Makan Pasien',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'visite-dokter',
    label: 'VISITE, KONSULTASI & ONCALL',
    title: 'Biaya Visite, Konsul & Oncall',
    desc: 'Rincian Visite, Konsul & Oncall',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'laboratorium',
    label: 'LABORATORIUM',
    title: 'Laboratorium',
    desc: 'Rincian Pemeriksaan Laboratorium',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'oksigen',
    label: 'OKSIGEN',
    title: 'Biaya Oksigen',
    desc: 'Rincian Penggunaan Oksigen',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'radiologi',
    label: 'RADIOLOGI',
    title: 'Radiologi',
    desc: 'Rincian Pemeriksaan Radiologi',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'jasa-keperawatan',
    label: 'JASA KEPERAWATAN',
    title: 'Jasa Keperawatan',
    desc: 'Rincian Jasa Keperawatan',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'farmasi',
    label: 'FARMASI',
    title: 'Biaya Farmasi / Obat',
    desc: 'Rincian Resep Farmasi',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'hemodialisa',
    label: 'HEMODIALISA',
    title: 'Hemodialisa',
    desc: 'Rincian Pelayanan Hemodialisa',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'cardio',
    label: 'CARDIO',
    title: 'Cardio',
    desc: 'Rincian Pemeriksaan Cardio',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'eeg',
    label: 'EEG',
    title: 'EEG',
    desc: 'Rincian Pemeriksaan EEG',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'fisioterapi',
    label: 'FISIOTERAPI',
    title: 'Fisioterapi',
    desc: 'Rincian Pelayanan Fisioterapi',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'akomodasi',
    label: 'AKOMODASI / KAMAR',
    title: 'Akomodasi / Kamar',
    desc: 'Rincian Sewa Kamar & Akomodasi',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'operasi',
    label: 'OPERASI',
    title: 'Kamar Operasi & Ruang RR',
    desc: 'Rincian Operasi & Ruang Pemulihan',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  },
  {
    name: 'eresep',
    label: 'E-RESEP',
    title: 'Biaya E-Resep (Non Racikan & Racikan)',
    desc: 'Rincian E-Resep Farmasi',
    nakes: ['1', '2', '3', '4', '5', '6', 'mpp'],
    comp: fakturLayananComp
  }
])

const dataHeader = ref([
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'RSUD DOKTER MOHAMMAD SALEH',
  'Jalan Mayjend Panjaitan No.65 Telp : (0335) 433119,421118 Fax. (0335) 432705',
  'e-mail : rsudprob@probolinggokota.go.id',
  'PROBOLINGGO 67219'
])

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const splitterModel = ref(18)

const innerTab = ref(menus.value[0].name)

onMounted(() => {
  innerTab.value = menus.value[0].name
})
</script>
