<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items?.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="(item, i) in items" :key="i">
          <q-item-section avatar>
            <app-avatar-pasien :pasien="item" />
          </q-item-section>

          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              <span class="text-weight-bold">{{ item?.nama }}</span> | <span class="text-primary text-weight-bold">{{
                item.norm }}</span>
            </q-item-label>
            <q-item-label>
              <span class="text-weight-bold">{{ item?.noreg }} </span> | <span v-if="item?.noka"> Noka : </span> <span
                class="text-cyan text-weight-bold">{{ item?.noka ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              NIK : <span class="text-negative text-weight-bold">{{ item?.nktp ?? '-' }}</span> | Telp : <span
                class="text-teal text-weight-bold"> {{ item?.nohp ?? '-' }}</span>
            </q-item-label>
            <q-item-label caption>
              USIA : <span class="text-weight-bold">{{ item?.usia }}</span> | Kelamin : <span
                class="text-weight-bold">{{
                  item.kelamin }}</span>
            </q-item-label>
            <q-item-label>
              <span class="text-grey">alamat :</span> {{ item?.alamat }}
            </q-item-label>
          </q-item-section>
          <q-separator vertical class="q-mx-md" />
          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              DPJP : <span class="text-negative text-weight-bold">{{ item?.kodedokter ? item?.dokter : '-' }}</span>
            </q-item-label>
            <q-item-label>
              RUANGAN : <span class="text-teal text-weight-bold"> {{ item?.poli }}</span>
            </q-item-label>
            <q-item-label>
              Tanggal : <i class="text-weight-bold text-negative">{{ item?.tgl_kunjungan ?
                dateFullFormat(item.tgl_kunjungan) : '-' }}</i> | Jam : <i class="text-weight-bold text-negative">{{
                  item.tgl_kunjungan ? formatJam(item.tgl_kunjungan) : '-' }}</i>
            </q-item-label>
            <div>Penjamin : <span class="text-primary text-weight-bold">{{ item?.sistembayar }}</span></div>
            <q-item-label v-if="item?.planheder?.length <= 0">
              Plann : -
            </q-item-label>
            <q-item-label v-else>
              <div v-if="item?.planheder[0]?.rs4 === 'Pulang'">
                Plann :<i class="text-weight-bold text-cyan">{{ item?.planheder[0]?.rs4 }}</i> Dengan Kondisi: <span
                  class="text-bold"> {{ item?.planheder[0]?.planpulang?.atas_dasar ?? '-' }} </span>
              </div>
              <div v-else-if="item?.planheder[0]?.rs4 === 'Rawat Inap'">
                Plann :<i class="text-weight-bold text-cyan">{{ item?.planheder[0]?.rs4 }} </i> Diruang : <span
                  class="text-bold"> {{ item?.planheder[0]?.planranap?.ruangranap?.rs2 ?? '-' }} </span>
              </div>
              <div v-else>
                Plann :<i class="text-weight-bold text-cyan"> {{ item?.planheder[0]?.rs4 }} :</i> Dirujuk Ke : <span
                  class="text-bold"> {{ item?.planheder[0]?.planrujukan?.di_rujuk_ke }} </span>
              </div>
            </q-item-label>
            <div class="text-primary">
              <q-badge v-if="item?.sep" :label="item?.sep" />
              <div v-if="!item?.sep">
                <q-badge v-if="item.groups === '1'" label="SEP BELUM TERBIT" color="negative" class="cursor-pointer" />
              </div>
            </div>
            <div v-if="item?.kategoritriage !== null && item?.doa === null">
              <q-badge :color="colortriage(item?.kategoritriage)">
                {{ item?.kategoritriage }}
              </q-badge>
            </div>
            <div v-else-if="item.doa !== null && item.kategoritriage === null">
              <q-badge color="black">
                DOA
              </q-badge>
            </div>
            <div v-else>
              <q-badge color="primary">
                {{ item?.kategoritriage ?? '-' }}
              </q-badge>
            </div>
            <div v-if="item?.groups === '1'" class="flex q-gutter-sm">
              <q-badge v-if="cekReadmisi(item?.last_visit, item?.tgl_kunjungan) && item?.flagpelayanan !== '1'"
                class="q-mt-sm q-px-sm cursor-pointer" dense color="dark">
                <q-popup-proxy dark>
                  <q-banner dark>
                    <template v-slot:avatar>
                      <app-avatar-pasien :pasien="item" width="50px" />
                    </template>
                    <div class="column">
                      <div>Terakhir Masuk </div>
                      <div class="text-bold">{{ humanDate(item?.last_visit) }} </div>
                    </div>
                  </q-banner>
                </q-popup-proxy>
                <div class="f-12">
                  {{ cekReadmisi(item?.last_visit, item?.tgl_kunjungan) }}
                </div>
              </q-badge>
            </div>
          </q-item-section>
          <q-item-section v-if="item?.flagpelayanan === ''" side>
            <q-btn dense size="sm" no-caps color="red" label="TERIMA" class="q-mb-sm"
              icon-right="icon-mat-transfer_within_a_station" style="min-width: 120px;"
              :loading="loadingTerima && store.noreg === item?.noreg" @click="emits('terimapasien', item)" />
          </q-item-section>
          <q-item-section v-if="item?.flagpelayanan === '2'" side>
            <q-btn dense size="sm" no-caps color="primary" label="LIHAT LAYANAN" class="q-mb-sm"
              icon-right="icon-mat-edit" style="min-width: 120px;" @click="emits('bukalayanan', item)" />
          </q-item-section>
          <q-item-section v-if="item?.flagpelayanan === '1'" side>
            <q-btn dense size="sm" no-caps color="green" label="SUDAH DILAYANANI" class="q-mb-sm"
              icon-right="icon-mat-key" style="min-width: 120px;" @click="emits('bukalayanan', item)" />
            <q-btn dense v-if="item?.kunjungancesmix === null" size="sm" no-caps color="dark" label="KIRIM PENJAMINAN"
              class="q-mb-sm" icon-right="icon-mat-attach_money" :loading="item?.loadingcesmix"
              style="min-width: 120px;" @click="emits('kirimcasmix', item)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <!-- layanan -->
    <!-- <page-layanan-igd
      v-model="store.pageLayanan"
      :pasien="pasien"
    /> -->
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
// import { defineAsyncComponent, ref } from 'vue'
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung'
import { dateFullFormat, formatJam } from 'src/modules/formatter'
import { date } from 'quasar'

const emits = defineEmits(['terimapasien', 'bukalayanan', 'kirimcasmix'])
const store = usePengunjungIgdStore()

// const PageLayananIgd = defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/PageLayananIgd.vue'))
// const pasien = ref(null)
// function bukaLayanan(item) {
//   pasien.value = item
//   store.pageLayanan = true
//   // store.setTerima(item)
// }

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingTerima: {
    type: Boolean,
    default: false
  },
  loadingCall: {
    type: Boolean,
    default: false
  },
  loadingTidakhadir: {
    type: Boolean,
    default: false
  },
  loadingcesmix: {
    type: Boolean,
    default: false
  }
})

function colortriage (val) {
  if (val === 'Resusitasi') {
    return 'red'
  }
  else if (val === 'P1') {
    return 'deep-orange'
  }
  else if (val === 'P2') {
    return 'yellow-7'
  }
  else if (val === 'P3') {
    return 'green'
  }
  else {
    return 'black'
  }
}
const cekReadmisi = (last_visit, tglmasuk) => {
  // console.log('tgl', tgl);
  let ada = null
  if (last_visit) {
    const selisih = date.getDateDiff(tglmasuk, last_visit, 'days') ?? null
    if (selisih) {
      if (selisih <= 30) {
        ada = 'Re-Adm'
      }
    }
  }

  return ada

}
</script>
