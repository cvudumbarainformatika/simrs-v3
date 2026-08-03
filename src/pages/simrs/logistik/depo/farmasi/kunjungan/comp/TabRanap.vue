<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="column flex-center q-pa-lg">
      <q-spinner-dots color="primary" size="40px" />
      <div class="q-mt-sm text-grey-7">Memuat data kunjungan rawat inap...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!items?.length" class="column flex-center q-pa-lg">
      <q-icon name="group_off" size="50px" color="grey-5" />
      <div class="q-mt-sm text-grey-7">Tidak ada data kunjungan rawat inap ditemukan.</div>
    </div>

    <!-- Data List -->
    <q-list v-else separator class="q-pb-xl">
      <q-item v-for="(item, i) in items" :key="i" class="hover-row">
        <!-- Avatar Section -->
        <q-item-section avatar top class="items-center">
          <app-avatar-pasien :pasien="item" width="80px" />
          <div v-if="item?.is_geriatri === 1 || item?.is_geriatri === '1'" class="bg-red text-white text-center q-mt-xs q-px-xs text-weight-bold" style="font-size: 10px; border-radius: 3px; width: 80px; line-height: 1.2;">
            GERIATRI
          </div>
        </q-item-section>

        <!-- Patient Info Section -->
        <q-item-section class="q-col-gutter-xs">
          <q-item-label>
            <span class="text-weight-bold text-h6">{{ item.nama }}</span> | <span class="text-primary text-weight-bold">{{ item.norm }}</span>
            <span v-if="item?.noka"> | </span>
            <span class="text-cyan text-weight-bold">{{ item?.noka ?? '-' }}</span>
          </q-item-label>
          <q-item-label>
            <span class="text-weight-bold text-orange-9">{{ item.noreg }} </span> | Penjamin : <span class="text-weight-bold text-green"> {{ item.sistembayar }}</span>
          </q-item-label>
          <q-item-label>
            NIK : <span class="text-negative text-weight-bold">{{ item?.nktp ?? '-' }}</span> | Telp : <span class="text-teal text-weight-bold"> {{ item?.nohp ?? '-' }}</span>
          </q-item-label>
          <q-item-label caption>
            USIA : <span class="text-weight-bold">{{ item.usia }}</span> | Kelamin : <span class="text-weight-bold">{{ item.kelamin === 'L' ? 'Laki-Laki' : 'Perempuan' }}</span>
          </q-item-label>
          <q-item-label class="text-grey-8">
            <span class="text-grey">Alamat :</span> {{ item?.alamat }}
          </q-item-label>
          <q-item-label caption>
            Status Rawat Inap : <q-badge :color="item.status === '' ? 'teal' : 'grey-7'" class="q-px-sm">{{ item.status === '' ? 'AKTIF (BELUM PULANG)' : 'SUDAH PULANG' }}</q-badge>
          </q-item-label>
        </q-item-section>

        <q-separator vertical class="q-mx-md" />

        <!-- DPJP & Room Details Section -->
        <q-item-section class="q-col-gutter-xs">
          <q-item-label caption>
            DPJP : <span class="text-negative text-weight-bold">{{ item.dokter ?? '-' }}</span>
          </q-item-label>
          <q-item-label>
            RUANGAN : <span class="text-teal text-weight-bold"> {{ item.ruangan }}</span>
          </q-item-label>
          <q-item-label caption>
            Detail : Kamar <b>{{ item.ketruangan }}</b> | Bed <b>{{ item.nomorbed }}</b>
          </q-item-label>
          <q-item-label class="q-mt-xs">
            <div>Tgl Masuk : <i class="text-weight-bold text-negative">{{ item.tglmasuk ? dateFullFormat(item.tglmasuk) : '-' }}</i></div>
            <div v-if="item.status !== ''">Tgl Keluar : <i class="text-weight-bold text-red">{{ item.tglkeluar ? dateFullFormat(item.tglkeluar) : '-' }}</i></div>
          </q-item-label>
          <q-item-label caption class="q-mt-sm">
            <q-badge v-if="item?.sep" color="primary" :label="'SEP: ' + item?.sep" />
            <q-badge v-else-if="item.groups === '1'" label="SEP BELUM TERBIT" color="negative" />
          </q-item-label>
        </q-item-section>

        <!-- Actions Section -->
        <q-item-section side class="justify-center">
          <q-btn
            color="warning"
            text-color="dark"
            label="Info PIO"
            icon="info"
            size="sm"
            no-caps
            class="q-px-md"
            style="min-width: 100px;"
            @click="info(item)"
          >
            <q-tooltip class="bg-warning text-dark" :offset="[10, 10]">
              Pelayanan Informasi Obat (PIO)
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { dateFullFormat } from 'src/modules/formatter'
import { useEResepDepoFarmasiStore } from 'src/stores/simrs/farmasi/eresep/eresep'

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const eresepStore = useEResepDepoFarmasiStore()

function info (item) {
  eresepStore.openInfo()
  eresepStore.setInfo(item)
}
</script>

<style scoped>
.hover-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
