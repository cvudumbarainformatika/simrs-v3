<template>
  <q-dialog
    persistent
  >
    <q-card style="min-width: 800px;">
      <q-bar class="bg-primary">
        <q-space />

        <q-btn
          v-close-popup
          dense
          flat
          color="white"
          icon="icon-mat-close"
          @click="store.setClose"
        >
          <q-tooltip class="bg-white text-primary">
            Close
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section
        v-if="store.loadingAlokasi"
        style="height: 300px;"
      >
        <app-loading />
      </q-card-section>
      <q-card-section v-else>
        <!-- {{ store?.obat }} -->
        <div class="row text-weight-bold text-amber-10">
          {{ store?.obat?.nama_obat??store?.obat?.namaobat }}
        </div>
        <div class="row text-italic f-10">
          {{ store?.obat?.kd_obat }}
        </div>
        <q-separator class="q-my-sm" />
        <div v-if="store.mutasis?.length">
          <div class="row bg-grey-7 text-white fit">
            <div class="q-ml-sm">
              Data Mutasi
            </div>
          </div>
          <div class="row text-weight-bold fit q-mb-sm">
            <div class="col-6">
              Gudang / Depo / Ruangan
            </div>
            <div class="col-3">
              Tanggal
            </div>
            <div class="col-3">
              Jumlah
            </div>
          </div>
          <div
            v-for="(rinc,i) in store.mutasis"
            :key="i"
          >
            <div
              class="row items-center"
              :class="i%2===0?(rinc?.flag===''?'text-weight-bold text-negative':(rinc?.flag==='1'?'text-weight-bold text-primary':'text-weight-bold text-deep-orange')):(rinc?.flag===''?'text-weight-bold text-negative bg-blue-grey-3':(rinc?.flag==='1'?'text-weight-bold text-primary bg-blue-grey-3':'text-weight-bold text-deep-orange bg-blue-grey-3'))"
            >
              <div class="col-6">
                <div class="row">
                  {{ ruangan(rinc?.dari) }}
                </div>
                <div class="row text-italic f-10">
                  ({{ rinc?.dari?.includes('R-')?'Ruangan': (rinc?.dari?.includes('Gd-')?'Gudang / Depo':'Poli' ) }})
                </div>
              </div>
              <div class="col-3">
                <div class="row">
                  <div v-if="rinc?.tgl">
                    {{ dateFullFormat(rinc?.tgl) }}
                  </div>
                  <div v-else-if="rinc?.tgl_permintaan">
                    {{ dateFullFormat(rinc?.tgl_permintaan) }}
                  </div>
                </div>
                <div class="row f-10">
                  ({{ rinc?.no_permintaan }})
                </div>
              </div>
              <div class="col-3">
                <div class="row justify-between items-end">
                  {{ rinc?.jumlah }}
                  <div
                    v-if="rinc?.flag===''"
                    class="f-8"
                  >
                    (Draft)
                  </div>
                  <div
                    v-if="rinc?.flag==='1'"
                    class="f-8"
                  >
                    (Dikirim)
                  </div>
                  <div
                    v-if="rinc?.flag==='2'"
                    class="f-12"
                  >
                    (Belum Selesai)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <q-separator class="q-my-sm" />
        </div>

        <div v-if="store.reseps?.length">
          <div class="row bg-grey-7 text-white fit">
            <div class="q-ml-sm">
              Data Resep
            </div>
          </div>
          <div class="row text-weight-bold fit q-mb-sm">
            <div class="col-4">
              Noresep
            </div>
            <div class="col-4">
              Poli / Ruangan
            </div>
            <div class="col-2">
              Tanggal
            </div>
            <div class="col-2">
              Jumlah
            </div>
          </div>
          <div
            v-for="(rinc,i) in store.reseps"
            :key="i"
          >
            <div
              class="row items-center"
              :class="i%2===0?(rinc?.flag===''?'text-weight-bold text-negative':(rinc?.flag==='1'?'text-weight-bold text-primary':'text-weight-bold text-deep-orange')):(rinc?.flag===''?'text-weight-bold text-negative bg-blue-grey-3':(rinc?.flag==='1'?'text-weight-bold text-primary bg-blue-grey-3':'text-weight-bold text-deep-orange bg-blue-grey-3'))"
            >
              <div class="col-4">
                <div class="row">
                  {{ rinc?.noresep }}
                </div>
                <div class="row text-italic f-10">
                  {{ rinc?.noreg }}
                </div>
              </div>
              <div class="col-4">
                <div class="row">
                  {{ ruangan(rinc?.dari) }}
                </div>
                <div class="row text-italic f-10">
                  ({{ rinc?.dari?.includes('R-')?'Ruangan': (rinc?.dari?.includes('Gd-')?'Gudang / Depo':(rinc?.dari?.includes('POL')?'Poli':'Ruangan Ranap') ) }})
                </div>
              </div>
              <div class="col-2">
                <div v-if="rinc?.tgl">
                  {{ dateFullFormat(rinc?.tgl) }}
                </div>
                <div v-else-if="rinc?.tgl_permintaan">
                  {{ dateFullFormat(rinc?.tgl_permintaan) }}
                </div>
              </div>
              <div class="col-2">
                <div class="row justify-between items-end no-wrap">
                  {{ rinc?.jumlah }}
                  <div
                    v-if="rinc?.flag===''"
                    class="f-8"
                  >
                    (Draft)
                  </div>
                  <div
                    v-if="rinc?.flag==='1'"
                    class="f-8"
                  >
                    (Dikirim)
                  </div>
                  <div
                    v-if="rinc?.flag==='2'"
                    class="f-12"
                  >
                    (Belum Selesai)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <q-separator class="q-my-sm" />
        </div>
        <div v-if="store.operasis?.length">
          <div class="row bg-grey-7 text-white fit">
            <div class="q-ml-sm">
              Data Permintaan Operasi
            </div>
          </div>
          <div class="row text-weight-bold fit q-mb-sm">
            <div class="col-4">
              No Permintaan
            </div>
            <div class="col-4">
              Poli / Ruangan
            </div>
            <div class="col-2">
              Tanggal
            </div>
            <div class="col-2">
              Jumlah
            </div>
          </div>
          <div
            v-for="(rinc,i) in store.operasis"
            :key="i"
          >
            <div
              class="row items-center"
              :class="i%2===0?(rinc?.flag===''?'text-weight-bold text-negative':(rinc?.flag==='1'?'text-weight-bold text-primary':'text-weight-bold text-deep-orange')):(rinc?.flag===''?'text-weight-bold text-negative bg-blue-grey-3':(rinc?.flag==='1'?'text-weight-bold text-primary bg-blue-grey-3':'text-weight-bold text-deep-orange bg-blue-grey-3'))"
            >
              <div class="col-4">
                <div class="row">
                  {{ rinc?.nopermintaan }}
                </div>
                <div class="row text-italic f-10">
                  {{ rinc?.noreg }}
                </div>
              </div>
              <div class="col-4">
                <div class="row">
                  {{ ruangan(rinc?.dari) }}
                </div>
                <div class="row text-italic f-10">
                  ({{ rinc?.dari?.includes('R-')?'Ruangan': (rinc?.dari?.includes('Gd-')?'Gudang / Depo':(rinc?.dari?.includes('POL')?'Poli':'Ruangan Ranap') ) }})
                </div>
              </div>
              <div class="col-2">
                <div v-if="rinc?.tgl">
                  {{ dateFullFormat(rinc?.tgl) }}
                </div>
                <div v-else-if="rinc?.tgl_permintaan">
                  {{ dateFullFormat(rinc?.tgl_permintaan) }}
                </div>
              </div>
              <div class="col-2">
                <div class="row justify-between items-end no-wrap">
                  {{ rinc?.jumlah }}
                  <div
                    v-if="rinc?.flag===''"
                    class="f-8"
                  >
                    (Draft)
                  </div>
                  <div
                    v-if="rinc?.flag==='1'"
                    class="f-8"
                  >
                    (Dikirim)
                  </div>
                  <div
                    v-if="rinc?.flag==='2'"
                    class="f-12"
                  >
                    (Belum Selesai)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <q-separator class="q-my-sm" />
        </div>
        <div v-if="!store.mutasis?.length && !store.reseps?.length && !store.operasis?.length">
          <app-no-data />
        </div>
      </q-card-section>

      <q-separator />
    </q-card>
  </q-dialog>
</template>
<script setup>
import { dateFullFormat } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { UseFarmasiStokSekarangTable } from 'src/stores/simrs/farmasi/stoksekarang/tabel'

// eslint-disable-next-line no-unused-vars
const store = UseFarmasiStokSekarangTable()
const apps = useAplikasiStore()
function ruangan (ruang) {
  if (ruang === 'POL014') return 'IGD'
  const ranap = store.ruangRanaps.find(pol => pol.kdruang === ruang)
  if (ranap) return ranap?.nama
  const poli = apps.polis.find(pol => pol.kodepoli === ruang)
  if (poli) return poli?.polirs
  const ruangan = apps.ruangs.find(pol => pol.kode === ruang)
  if (ruangan) return ruangan?.uraian
  const guda = apps.gudangs.find(pol => pol.kode === ruang)
  if (guda) return guda?.nama
  console.log('ruangan', ruang)
}
</script>
