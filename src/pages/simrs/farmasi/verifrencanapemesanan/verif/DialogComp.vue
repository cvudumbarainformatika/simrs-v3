<template>
  <div
    class="full-height"
  >
    <div
      class="row items-start bg-grey-8 text-white q-pr-sm "
      :style=" `height: ${tinggiDetailPas}px;`"
    >
      <div
        class="col-3"
      >
        <div class="row">
          <div
            class="absolute-top bg-dark text-white col-3"
            :style=" `height: ${tinggiDetailPas}px; margin-top: ${h}px`"
          >
            <div class="absolute-top-right">
              <div class="q-pa-sm">
                <q-btn
                  outline
                  round
                  style="color: goldenrod;"
                  :icon="icon(store?.rencana?.flag)"
                />
              </div>
            </div>
            <div class="absolute-top q-mt-xs">
              <div class="q-ml-xs">
                {{ store?.rencana?.no_rencbeliobat ??'-' }}
              </div>
            </div>
            <div class="absolute-bottom">
              <div class="q-ml-xs">
                {{ store?.rencana?.no_verif ?? '-' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-9 q-mt-xs"
        :style=" `height: ${tinggiDetailPas}px;`"
      >
        <div class="row q-ml-sm">
          <div class="col-4">
            <div class="row">
              {{ store?.rencana?.gudang?.nama }}
            </div>
          </div>
          <div class="col-8">
            <div class="row">
              <div class="col-4">
                Tanggal Rencana
              </div>
              <div class="col-8">
                {{ dateFullFormat(store?.rencana?.tgl)??'-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Tanggal Verif
              </div>
              <div class="col-8">
                {{ dateFullFormat(store?.rencana?.tglverif)??'-' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="store?.rencana?.flag==='1'"
      class="text-right q-mr-md q-my-sm"
    >
      <q-btn
        rounded
        push
        label="Selesai"
        class="f-12 q-mr-sm"
        color="green"
        text-color="white"
        icon="icon-mat-done_all"
        :disable="store.loadingVerif && store?.rencana?.loading"
        :loading="store.loadingVerif && store?.rencana?.loading"
        @click="selesaiVerif(store?.rencana)"
      >
        <q-tooltip
          class="primary"
          :offset="[10, 10]"
        >
          Selesai
        </q-tooltip>
      </q-btn>
    </div>
    <div
      class="column q-pa-sm "
      :style="`height: calc(100vh - ${tinggiDetailPas+80}px);`"
    >
      <q-scroll-area
        style="height: 100%;"
      >
        <div
          v-if="store?.rencana?.rincian?.length"
          class="q-mt-sm"
        >
          <q-list
            separator
            bordered
          >
            <q-item
              v-for="(rinc,j) in store?.rencana?.rincian"
              :key="j"
              class="q-py-none"
            >
              <q-item-section
                style="width: 40%;"
                class="q-my-xs"
              >
                <q-item-label class="row text-weight-bold ">
                  <div class="col-expand text-deep-orange">
                    {{ rinc?.mobat?.nama_obat }}
                  </div>
                  <div class="col-shrink f-10 text-italic q-ml-xs">
                    ( {{ rinc?.mobat?.satuan_k }} )
                  </div>
                </q-item-label>
                <q-item-label class="text-italic f-10 ">
                  {{ rinc?.kdobat }}
                </q-item-label>
                <q-item-label
                  v-if="rinc?.mobat?.kandungan"
                  class="f-10"
                >
                  ( {{ rinc?.mobat?.kandungan }} )
                </q-item-label>
                <q-item-label class="row text-weight-bold f-10">
                  <div
                    class="col-shrink q-mr-sm"
                    :class="rinc?.mobat?.status_fornas==='1'?'text-green':'text-red'"
                  >
                    {{ rinc?.mobat?.status_fornas==='1'?'Fornas':'Non-Fornas' }}
                  </div>
                  <div
                    class="col-shrink q-mr-sm"
                    :class="rinc?.mobat?.status_forkid==='1'?'text-green':'text-red'"
                  >
                    {{ rinc?.mobat?.status_forkid==='1'?'Forkit':'Non-Forkit' }}
                  </div>
                  <div
                    class="col-shrink q-mr-sm"
                    :class="rinc?.mobat?.status_generik==='1'?'text-green':'text-red'"
                  >
                    {{ rinc?.mobat?.status_generik==='1'?'Generik':'Non-Generik' }}
                  </div>
                </q-item-label>
                <q-item-label class="row text-weight-bold f-10">
                  <div
                    class="col-shrink  q-mr-sm"
                    :class="rinc?.mobat?.status_kronis==='1'?'text-green':'text-red'"
                  >
                    {{ rinc?.mobat?.status_kronis==='1'?'Kronis':'Non-Kronis' }}
                  </div>
                  <div
                    class="col-shrink  q-mr-sm"
                    :class="rinc?.mobat?.status_prb==='1'?'text-green':'text-red'"
                  >
                    {{ rinc?.mobat?.status_prb==='1'?'PRB':'Non-PRB' }}
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section
                style="width:55%"
              >
                <q-item-label class="row fit items-center q-pa-none q-ma-none ">
                  <div
                    class="col-6 cursor-pointer"
                    @click="rencana.getRinciMinmax(rinc)"
                  >
                    <div class="row q-mb-xs text-weight-bold text-green">
                      <div class="col-4">
                        Jml Rencana
                      </div>
                      <div class="col-6 text-right">
                        {{ parseFloat(rinc?.jumlahdirencanakan) }}
                      </div>
                    </div>
                    <div class="row q-mb-xs text-purple">
                      <div class="col-4">
                        Stok Rs
                      </div>
                      <div class="col-6 text-right">
                        {{ rinc?.totalStok }}
                      </div>
                    </div>
                    <div class="row q-mb-xs text-cyan">
                      <div class="col-4">
                        Maks Stok Rs
                      </div>
                      <div class="col-6 text-right">
                        {{ rinc?.maxRs }}
                      </div>
                    </div>
                    <div class="row q-mb-xs text-light-blue">
                      <div class="col-4">
                        Min Stok Rs
                      </div>
                      <div class="col-6 text-right">
                        {{ rinc?.minRs }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div v-if="store?.rencana?.flag==='1'">
                      <q-input
                        ref="refVerif"
                        v-model="rinc.jumlah_diverif"
                        label="Jumlah Verif"
                        dense
                        outlined
                        standout="bg-yellow-3"
                        :disable="store.loadingSimpan && rinc.loading"
                        @update:model-value="setNumber($event,rinc)"
                        @keyup.enter.stop="simpanObat(rinc)"
                      />
                    </div>
                    <div v-else>
                      <div class="row fit">
                        <div class="col-6">
                          Jumlah diverif
                        </div>
                        <div class="col-6">
                          {{ rinc?.jumlah_diverif }}
                        </div>
                      </div>
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section

                side
                style="width:5%"
              >
                <div v-if="store?.rencana?.flag==='1'">
                  <q-btn
                    v-if=" !rinc?.waktu_verif"
                    icon="icon-mat-send"
                    flat
                    color="primary"
                    dense
                    :loading="store.loadingSimpan && rinc.loading"
                    :disable="store.loadingSimpan && rinc.loading"
                    @click="simpanObat(rinc)"
                  >
                    <q-tooltip
                      class="primary"
                      :offset="[10, 10]"
                    >
                      Kirim
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="rinc?.waktu_verif"
                    icon="icon-mat-done"
                    flat
                    color="primary"
                    dense
                    :loading="store.loadingSimpan && rinc.loading"
                    :disable="store.loadingSimpan && rinc.loading"
                    @click="simpanObat(rinc)"
                  >
                    <q-tooltip
                      class="primary"
                      :offset="[10, 10]"
                    >
                      Kirim
                    </q-tooltip>
                  </q-btn>
                </div>
                <q-icon
                  v-else-if="store?.rencana?.flag==='3'"
                  name="icon-mat-done_all"
                  flat
                  color="green"
                  dense
                >
                  <q-tooltip
                    class="primary"
                    :offset="[10, 10]"
                  >
                    Selesai
                  </q-tooltip>
                </q-icon>
                <q-icon
                  v-else
                  name="icon-mat-done"
                  flat
                  color="green"
                  dense
                >
                  <q-tooltip
                    class="primary"
                    :offset="[10, 10]"
                  >
                    Terkirim
                  </q-tooltip>
                </q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </div>
  </div>
  <DetailMinMax v-model="rencana.isOpen" />
</template>
<script setup>
import { notifErrVue } from 'src/modules/utils'
import { dateFullFormat } from 'src/modules/formatter'
import { useRencanaPemesananObatStore } from 'src/stores/simrs/farmasi/pemesanan/rencana'
import { useVerifikasiRencanaPesanStore } from 'src/stores/simrs/farmasi/verifikasiperencanaanpemesanan/verifrencana'
import { defineAsyncComponent, ref } from 'vue'
import { Dialog } from 'quasar'

// eslint-disable-next-line no-unused-vars
const store = useVerifikasiRencanaPesanStore()
const rencana = useRencanaPemesananObatStore()

const DetailMinMax = defineAsyncComponent(() => import('src/pages/simrs/logistik/gudang/farmasi/rencanapemesanan/rencana/comp/DetailMinMax.vue'))

const tinggiDetailPas = ref(60)
const h = ref(25 + 16)
const refVerif = ref(null)
function setNumber (evt, det) {
  const inc = evt.includes('.')
  const ind = evt.indexOf('.')
  const panj = evt?.length
  const nilai = isNaN(parseFloat(evt)) ? 0 : (inc && (ind === (panj - 2)) ? evt : parseFloat(evt))
  if (nilai > det.maxRs) {
    if (parseFloat(det.jumlahdirencanakan) > det.maxRs) det.jumlah_diverif = det.maxRs
    else det.jumlah_diverif = parseFloat(det.jumlahdirencanakan)

    notifErrVue('Tidak Boleh Lebih dari jumlah Stok Maksimal Rumah Sakit')
  }
  else if (nilai > parseFloat(det.jumlahdirencanakan)) {
    det.jumlah_diverif = parseFloat(det.jumlahdirencanakan)
    notifErrVue('Tidak Boleh Lebih dari jumlah direncanakan')
  }
  else det.jumlah_diverif = nilai
}

function simpanObat (rinc) {
  if (parseFloat(rinc?.jumlah_diverif) <= 0) {
    Dialog.create({
      title: 'Konfirmasi',
      message: 'Apakah Obat "' + rinc?.mobat?.nama_obat + '" tidak disetujui untuk di pesan?',
      ok: {
        push: true,
        'no-caps': true,
        label: 'Tidak disetujui untuk dipesan',
        color: 'negative'
      },
      cancel: {
        push: true,
        'no-caps': true,
        label: 'Batal',
        color: 'dark'
      }
    }).onOk(() => {
      store.simpanObat(rinc)
    })
  }
  else {
    store.simpanObat(rinc)
  }
}
function selesaiVerif (rinc) {
  console.log('rinc', refVerif.value)
  let valid = true
  refVerif.value?.forEach(ver => {
    console.log(ver, ver.validate())
    if (!ver.validate()) valid = false
  })
  if (valid) store.selesaiVerif(rinc)
}
function icon (val) {
  let balik = ' Belum ada status'
  switch (val) {
    case '':
      balik = ' draft'
      break
    case '1':
      balik = 'icon-fa-check-to-slot-solid'
      break
    case '2':
      balik = 'icon-fa-check-double-solid'
      break
    case '3':
      balik = 'icon-fa-circle-check-regular'
      break
    case '4':
      balik = 'Returned'
      break

    default:
      break
  }
  return balik
}
</script>
