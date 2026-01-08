<template>
  <q-dialog persistent backdrop-filter="blur(4px)" :model-value="modelValue">
    <q-card style="min-width:80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Cetak Pencairan</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div id="printMe" class="f-12 row justify-center">
            <q-card-section>
              <div v-if="store.datarka.length" class="col-auto" style="font-size: 1em">
                <div class="row  justify-between full-width full-height ">
                  <div class="row b1 justify-between full-width">
                    <div class="row b2" style="width:70%">
                      <div class="row flex-center full-width">
                        <div class="col text-weight-bold full-width q-pa-sm b3 text-center">
                          <div>
                            RENCANA KERJA DAN ANGGARAN
                          </div>
                          <div>
                            SATUAN KERJA PERANGKAT DAERAH
                          </div>
                        </div>
                      </div>
                      <div class="row text-center text-bold full-width q-py-sm">
                        <div class="full-width">
                          UOBK RSUD DOKTER MOHAMAD SALEH
                        </div>
                        <div class="full-width">
                          TAHUN ANGGARAN {{ store.params.tahun }}
                        </div>
                      </div>
                    </div>
                    <div class="row" style="width:30%">
                      <div class="row text-weight-bold full-width text-center">
                        <div class="col flex-center q-pa-md full-width">
                          <div class="q-pb-sm">
                            Formulir
                          </div>
                          <div>
                            RKA - RINCIAN BELANJA SKPD
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row b4 full-width">
                    <div class="col full-width">

                      <div class="row item-row">
                        <div class="label">URUSAN PEMERINTAHAN</div>
                        <div class="value">
                          : 1 - URUSAN PEMERINTAHAN WAJIB YANG BERKAITAN DENGAN PELAYANAN DASAR
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">BIDANG URUSAN</div>
                        <div class="value">
                          : 1.02 - URUSAN PEMERINTAHAN BIDANG KESEHATAN
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">PROGRAM</div>
                        <div class="value">
                          : 1.02.01 - PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KAB/KOTA
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">KEGIATAN</div>
                        <div class="value">
                          : 1.02.01.2.10 - PENINGKATAN PELAYANAN BLUD
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">ORGANISASI</div>
                        <div class="value">
                          : 1.02.2.14.0.00.03.0000 - DINAS KESEHATAN
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">SUB ORGANISASI</div>
                        <div class="value">
                          : 1.02.2.14.0.00.03.0301 - UOBK RSUD MOHAMAD SALEH
                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="row b6 justify-between full-width full-height ">
                    <div class="row q-pl-sm q-py-xs" style="width:100%">
                      <div class="row text-bold q-pl-sm q-py-sm flex-center full-width text-center">
                        Indikator Tolak Ukur Kinerja Kegiatan
                      </div>
                    </div>
                  </div>
                  <div class="row justify-between full-width full-height ">
                    <div class="row full-width" style="width:100%">
                      <table class="justify-center full-width">
                        <thead>
                          <tr style="height: 25px">
                            <th rowspan="2">
                              Indikator
                            </th>
                            <th colspan="2">
                              Tolak Ukur Kerja
                            </th>
                          </tr>
                          <tr style="height: 25px">
                            <th>
                              Uraian
                            </th>
                            <th>
                              Target Kinerja
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="height: 25px">
                            <td class="text-bold">
                              Capaian Kegiatan
                            </td>
                            <td>
                              {{ header.capaianprogram }}
                            </td>
                            <td class="text-right">
                              {{ header.targetcapaian }}
                            </td>
                          </tr>
                          <tr style="height: 25px">
                            <td class="text-bold">
                              Masukan
                            </td>
                            <td>
                              {{ header.masukan }}
                            </td>
                            <td class="text-right">
                              {{ formatRpDouble(header.pagu) }}
                            </td>
                          </tr>
                          <tr style="height: 25px">
                            <td class="text-bold">
                              Keluaran
                            </td>
                            <td>
                              {{ header.keluaran }}
                            </td>
                            <td class="text-right">
                              {{ header.targetkeluaran }}
                            </td>
                          </tr>
                          <tr style="height: 25px">
                            <td class="text-bold">
                              Hasil
                            </td>
                            <td>
                              {{ header.hasil }}
                            </td>
                            <td class="text-right">
                              {{ header.targethasil }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="row b4 full-width">
                    <div class="col full-width">

                      <div class="row item-row">
                        <div class="label">
                          SUB KEGIATAN
                        </div>
                        <div class="value">
                          : 1.02.01.2.10.0001 - Pelayanan dan Penunjang Pelayanan BLUD
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">
                          KEGIATAN BLUD
                        </div>
                        <div class="value">
                          : {{ header.kegiatan }}
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">
                          SUMBER PENDANAAN
                        </div>
                        <div class="value">
                          : Pendapatan dari BLUD
                        </div>
                      </div>

                      <div class="row item-row">
                        <div class="label">
                          WAKTU PELAKSANAAN
                        </div>
                        <div class="value">
                          : Januari s/d Desember {{ store.params.tahun }}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div class="row justify-between full-width full-height ">
                    <div class="row full-width" style="width:100%">
                      <table class="justify-center full-width">
                        <thead>
                          <tr class="text-bold text-center" style="height:50px">
                            <td class="text-center" style="width: 10%">KODE REKENING</td>
                            <td class="text-center" style="width: 30%">URAIAN</td>
                            <td class="text-center" style="width: 5%">VOLUME</td>
                            <td class="text-center" style="width: 5%">SATUAN</td>
                            <td class="text-center" style="width: 10%">HARGA (Rp.)</td>
                            <td class="text-center" style="width: 20%">PAGU (Rp.)</td>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="it in store.datarka" :key="it">
                            <tr>
                              <td class="text-bold text-left q-py-md"> {{ it.kode }} </td>
                              <td class="text-bold text-left q-py-md" colspan="4"> {{ it.uraian }} </td>
                              <td class="text-right text-bold">
                                <!-- <span class="row justify-between">
                                  <span class="col-auto flex-start">Rp. </span> -->
                                <span class="flex-end text-right">
                                  {{ formattanpaRp(it.pagu) }}
                                </span>
                                <!-- </span> -->
                              </td>
                            </tr>
                            <template v-for="rinci in it?.rincian" :key="rinci">
                              <tr>
                                <td>
                                  <span class="q-pl-sm q-py-sm">
                                    {{ rinci.kode108 }}
                                  </span>
                                </td>
                                <td>
                                  <span class="q-py-sm">
                                    - {{ rinci.usulan }}
                                  </span>
                                </td>
                                <td>
                                  <span class="q-py-sm">
                                    {{ rinci.volume }}
                                  </span>
                                </td>
                                <td>
                                  <span class="q-py-sm">
                                    {{ rinci.satuan }}
                                  </span>
                                </td>
                                <td class="text-right">
                                  <!-- <span class="row justify-between">
                                    <span class="col-auto flex-start">Rp. </span> -->
                                  <span class="flex-end text-right">
                                    {{ formattanpaRp(rinci.harga) }}
                                  </span>
                                  <!-- </span> -->
                                </td>
                                <td class="text-right">
                                  <!-- <span class="row justify-between">
                                    <span class="col-auto flex-start">Rp. </span> -->
                                  <span class="flex-end text-right">
                                    {{ formattanpaRp(rinci.pagu) }}
                                  </span>
                                  <!-- </span> -->
                                </td>
                              </tr>
                            </template>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="row b5 justify-between q-pt-xl q-pb-md full-width">
                    <div class="row q-pl-sm q-py-xs text-weight-bold" style="width:100%">
                      <div class="col text-center">
                        <div class="text-bold">
                          Pejabat Teknis Kegiatan
                        </div>
                        <div style="padding-bottom: 60px" />
                        <div class="underline text-bold q-py-xs">
                          {{ header.pptk }}
                          <div class="garis-bawah" style="text-decoration-line: underline;" />
                        </div>
                        <div>
                          NIP. {{ header.kodepptk }}
                        </div>
                      </div>
                      <div class="col text-center" v-for="it in tt.ttd" :key="it">
                        <div class="text-bold">
                          Kuasa Pengguna Anggaran
                        </div>
                        <div style="padding-bottom: 60px" />
                        <div class="underline text-bold q-py-xs">
                          {{ it.nama }}
                          <div class="garis-bawah" style="text-decoration-line: underline;" />
                        </div>
                        <div>
                          NIP. {{ it.nip }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>


          </div>
        </q-page-container>
        <q-footer elevated>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Print
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { dateFullFormat, formatRpDouble, formattanpaRp } from 'src/modules/formatter'
import { terbilangRupiah } from 'src/modules/utils'
import { ref, computed } from 'vue'
import { usePrioritasAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/penyesuaianprioritas'
import { onMounted } from 'vue'
import { useBukubesarStore } from 'src/stores/siasik/akuntansi/bukubesar/bukubesar'

const store = usePrioritasAnggaranStore()
const tt = useBukubesarStore()
onMounted(() => {
  tt.getTtd()
  // store.getDataBukubesar()
})
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  datanpds: {
    type: Object,
    default: null
  }
})
const header = computed(() => {
  if (!props.datanpds) return null

  // buang rincian
  const { rincian, ...rest } = props.datanpds
  return rest
})
const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Dokumeen Perencanaan Anggaran | RSUD Mohamad Saleh',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}


</script>
<style>
.item-row {
  display: flex;
  width: 100%;
  padding: 6px 8px;
}

.label {
  width: 220px;
  /* KUNCI: lebar konsisten */
  font-weight: 600;
  white-space: nowrap;
}

.value {
  flex: 1;
  word-break: break-word;
}

.b {
  border-bottom-style: solid;
  border-width: 2px;
}

.b1 {
  border-style: solid;
  border-width: 2px;
}

.b2 {
  border-right-style: solid;
  border-width: 2px;
}

.b3 {
  border-bottom-style: solid;
  border-width: 2px;
}

.b4 {
  border-right-style: solid;
  border-left-style: solid;
  border-width: 2px;
}

.b5 {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.b6 {
  border-right-style: solid;
  border-left-style: solid;
  border-top-style: solid;
  border-width: 2px;
}

table,
thead,
th,
td {
  border-width: 2px;
  border-style: solid;
  border-collapse: collapse;
  border-right-style: solid;
  border-left-style: solid;
}

td {
  height: 35px;
  max-height: 50px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
