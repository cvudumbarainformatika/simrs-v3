<template>
  <q-dialog class="full-width q-mt-lg" @hide="hiddenDialog()" backdrop-filter="blur(4x)" persistent>
    <q-card style="min-width:50vw;">
      <q-card-section class="row items-center">
        <div class="column">
          <div class="f-14 text-weight-bold">
            Rincian Anggaran
          </div>
          <div class="f-10">
            Rencana Kerja dan Anggaran
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup icon="icon-mat-clear" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-table class="my-sticky-table" :rows="store.rincianSaved" :columns="columns" row-key="name" wrap-cells
          :disable="store.loading" :loading="store.loading" :rows-per-page-options="[0]" :rows-number="[0]">
          <template #body="props">
            <q-tr>
              <q-td key="usulan" :props="props">
                <span class="text-bold q-pr-sm">{{ props.row?.usulan }}</span>
                <q-badge color="green">
                  {{ props.row?.koderek50 }}
                </q-badge>
                <div>{{ props.row?.uraian50 }}</div>
              </q-td>
              <q-td key="item" :props="props">
                <q-badge color="green">
                  {{ props.row?.koderek108 }}
                </q-badge>
                <div>{{ props.row?.uraian108 }}</div>
              </q-td>
              <q-td key="rinci" :props="props">
                <q-badge color="green">
                  Vol : {{ props.row?.jumlahacc }} |
                  Harga : {{ formattanpaRp(props.row?.harga) }}
                </q-badge>
                <div class="q-pa-xs">
                  <q-separator />
                </div>
                <q-badge size="18px" color="yellow" class="text-bold text-dark">
                  Jumlah : {{ formattanpaRp(props.row?.nilai) }}
                </q-badge>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>
<script setup>

import { formattanpaRp } from 'src/modules/formatter'
import { usePrioritasAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/penyesuaianprioritas'
import { listDataNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/listdatanpdls'
import { ref } from 'vue'

const store = usePrioritasAnggaranStore()

function hiddenDialog() {
  console.log('hidden dialog')
  store.dialogCetak = false
}
const rincinpd = [
  {
    label: 'Nama Item / Kode Rekening 50',
    name: 'usulan',
    field: row => [row.usulan, row.uraian50]
  },
  {
    label: 'Kode Rekening 108',
    name: 'item',
    field: row => [row.uraian108, row.koderek108]
  },
  {
    label: 'Nilai',
    name: 'rinci',
    field: row => [row.jumlahacc, row.harga, row.nilai]
  }
]
const columns = ref(rincinpd)


</script>

<style lang="scss">
.my-sticky-table {
  height: 510px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #000000;
    color: $white;

  }

  thead tr th {
    position: sticky;
    z-index: 1;
    font-weight: bold;
  }

  /* this will be the loading indicator */
  thead tr:last-child th {
    top: 48px;

  }

  /* height of all previous header rows */

  thead tr:first-child th {
    top: 0;
  }

  .q-td {
    font-size: 3mm;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    scroll-margin-top: 48px;
    font-size: 1mm;
  }

  .q-table__bottom .q-field__native,
  .q-table__bottom .q-field__inner .q-field__control .q-anchor--skip,
  i.q-icon {
    color: $white;
  }
}
</style>
