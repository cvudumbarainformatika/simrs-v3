<template>
  <div class="column fit ">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Daftar Surat Keterangan Dokter</q-toolbar-title>
    </q-toolbar>

    <q-list class="q-pa-xs">
      <!-- <div class="column"> -->
      <q-item class="q-my-sm full-width bg-white" clickable v-ripple
        v-for="(item, n) in props.pasien?.suratketerangandokter" :key="n">
        <q-item-section>
          <q-item-label class="text-subtitle1">{{ item?.nosurat }}</q-item-label>
          <q-item-label caption lines="2">
            Keperluan: {{ item?.untukKeperluan }}
          </q-item-label>
          <q-item-label caption lines="2">
            <b v-if="item?.kdsurat === 'SRT01'"> Kesimpulan: {{ item?.kesimpulan }}</b>
            <b v-else-if="item?.kdsurat === 'SRT02'"> SKD: Surat Keterangan Pemeriksaan Kesehatan Jiwa</b>
            <b v-else-if="item?.kdsurat === 'SRT03'"> SKD: NAPZA</b>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row items-center q-gutter-xs" v-if="item?.batal !== '1'">
            <q-btn unelevated color="dark" round size="sm" icon="icon-mat-edit" @click="() => $emit('edit', item)"
              :loading="item.cetak" :pasien="props.pasien">
              <q-tooltip class="primary" :offset="[10, 10]">Print</q-tooltip>
            </q-btn>
            <q-btn unelevated color="dark" round size="sm" icon="icon-mat-print" @click="() => $emit('print', item)"
              :loading="item.cetak" :pasien="props.pasien">
              <q-tooltip class="primary" :offset="[10, 10]">Print</q-tooltip>
            </q-btn>
            <q-btn unelevated round size="sm" icon="icon-mat-delete" color="dark" :loading="item.loadinghapus"
              @click="() => $emit('delete', item)">
              <q-tooltip class="primary" :offset="[10, 10]">Batal</q-tooltip>
            </q-btn>
          </div>
          <div v-else>
            <q-badge rounded label="BATAL" color="red" />
          </div>
        </q-item-section>
      </q-item>
      <!-- </div> -->
    </q-list>
  </div>
</template>

<script setup>
import { useDokumenSuratSehatStore } from 'src/stores/simrs/dokumen/erm/suratsehat';

const store = useDokumenSuratSehatStore()
const props = defineProps({
  pasien: {
    type: Object,
    default: () => ({})
  },
  kdsurat: {
    type: String,
    default: ''
  }
})
defineEmits(['delete', 'print', 'edit'])
</script>
