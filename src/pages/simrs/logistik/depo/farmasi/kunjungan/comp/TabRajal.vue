<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="column flex-center q-pa-lg">
      <q-spinner-dots color="primary" size="40px" />
      <div class="q-mt-sm text-grey-7">Memuat data kunjungan rawat jalan...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!items?.length" class="column flex-center q-pa-lg">
      <q-icon name="group_off" size="50px" color="grey-5" />
      <div class="q-mt-sm text-grey-7">Tidak ada data kunjungan rawat jalan ditemukan.</div>
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
            Status Layanan : <q-badge :color="item.status === '1' ? 'green' : 'orange'" outline>{{ getStatus(item.status) }}</q-badge>
          </q-item-label>
        </q-item-section>

        <q-separator vertical class="q-mx-md" />

        <!-- DPJP & Room Details Section -->
        <q-item-section class="q-col-gutter-xs">
          <q-item-label caption>
            DPJP : <span class="text-negative text-weight-bold">{{ item.dokter ?? '-' }}</span>
          </q-item-label>
          <q-item-label>
            POLIKLINIK : <span class="text-teal text-weight-bold"> {{ item.poli }}</span>
          </q-item-label>
          <q-item-label>
            Tanggal : <i class="text-weight-bold text-negative">{{ item.tgl_kunjungan ? dateFullFormat(item.tgl_kunjungan) : '-' }}</i> | Jam : <i class="text-weight-bold text-negative">{{ item.tgl_kunjungan ? formatJam(item.tgl_kunjungan) : '-' }}</i>
          </q-item-label>
          <q-item-label v-if="item?.noantrian">
            No Antrian : <span class="text-teal text-weight-bold"> {{ item?.noantrian }}</span>
          </q-item-label>
          <q-item-label caption class="q-mt-sm">
            <q-badge v-if="item?.sep" color="primary" :label="'SEP: ' + item?.sep" />
            <q-badge v-else-if="item.groups === '1'" label="SEP BELUM TERBIT" color="negative" />
          </q-item-label>
        </q-item-section>

        <!-- Actions Section -->
        <q-item-section side class="justify-center">
          <q-btn
            color="primary"
            label="Pelayanan Farmasi"
            icon="medical_services"
            size="sm"
            no-caps
            class="q-px-md"
            style="min-width: 140px;"
            @click="store.openWorkspace(item)"
          >
            <q-tooltip class="bg-primary text-white" :offset="[10, 10]">
              Input Edukasi, PIO, & MESO Pasien
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useKunjunganPasienDepoStore } from 'src/stores/simrs/farmasi/kunjungan/kunjunganPasien'
import { dateFullFormat, formatJam } from 'src/modules/formatter'

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const store = useKunjunganPasienDepoStore()

function getStatus (val) {
  if (val === '') {
    return 'BELUM TERLAYANI'
  } else if (val === '1') {
    return 'TERLAYANI'
  } else if (val === '2') {
    return 'SUDAH DITERIMA'
  } else {
    return 'TIDAK HADIR'
  }
}
</script>

<style scoped>
.hover-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
