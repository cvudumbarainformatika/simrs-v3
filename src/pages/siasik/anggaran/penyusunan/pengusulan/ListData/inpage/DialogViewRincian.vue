<template>
  <q-dialog class="full-width q-mt-lg" @hide="hiddenDialog()" backdrop-filter="blur(4x)" persistent>
    <q-card style="min-width:50vw;">
      <q-card-section class="row items-center">
        <div class="column">
          <div class="f-14 text-weight-bold">
            Rincian NPD-LS
          </div>
          <div class="f-10">
            Rincian Nota Permintaan Dana Langsung
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup icon="icon-mat-clear" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-table class="my-sticky-table" :rows="store.rincians" :columns="columns" row-key="name" wrap-cells
          :disable="store.loading" :loading="store.loading" :rows-per-page-options="[0]" :rows-number="[0]">
          <template #body="props">
            <q-tr>
              <q-td key="keterangan" :props="props">
                <q-badge color="green">
                  {{ props.row?.kode_108 }} / {{ props.row?.kode_50 }}
                </q-badge>
                <div>{{ props.row?.keterangan }}</div>
              </q-td>
              <q-td key="rinci" :props="props">
                <q-badge color="green">
                  Vol : {{ props.row?.volume }} |
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
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan'
import { ref } from 'vue'

const store = usePengusulanAnggaranStore()

function hiddenDialog() {
  console.log('hidden dialog')
}
const rincinpd = [
  {
    label: 'Item Pengusulan',
    name: 'keterangan',
    field: row => [row.keterangan, row.kode_108]
  },
  {
    label: 'Rincian',
    name: 'rinci',
    field: row => [row.volume, row.harga, row.nilai]
  }
]
const columns = ref(rincinpd)


function mapPajakBaru() {
  const ppnlama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.ppnpusat) : parseFloat(0)
  const ppn = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.06.01.0001')
  const ppnbaru = isNaN(parseFloat(ppn?.nilai)) ? parseFloat(0) : parseFloat(ppn?.nilai)
  const sumppn = parseFloat(ppnlama) + parseFloat(ppnbaru)

  const pajakdaerahlama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pajakdaerah) : parseFloat(0)
  const pajakdaerah = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.06.02.0001')
  const pajakdaerahbaru = isNaN(parseFloat(pajakdaerah?.nilai)) ? parseFloat(0) : parseFloat(pajakdaerah?.nilai)
  const sumpajakdaerah = parseFloat(pajakdaerahlama) + parseFloat(pajakdaerahbaru)

  const pph21lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph21) : parseFloat(0)
  const arr21 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.01.0001')
  const pph21 = isNaN(parseFloat(arr21?.nilai)) ? parseFloat(0) : parseFloat(arr21?.nilai)
  const sumpph21 = parseFloat(pph21lama) + parseFloat(pph21)

  const pph22lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph22) : parseFloat(0)
  const arr22 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.02.0001')
  const pph22 = isNaN(parseFloat(arr22?.nilai)) ? parseFloat(0) : parseFloat(arr22?.nilai)
  const sumpph22 = parseFloat(pph22lama) + parseFloat(pph22)

  const pph23lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph23) : parseFloat(0)
  const arr23 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.03.0001')
  const pph23 = isNaN(parseFloat(arr23?.nilai)) ? parseFloat(0) : parseFloat(arr23?.nilai)
  const sumpph23 = parseFloat(pph23lama) + parseFloat(pph23)

  const pph25lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph25) : parseFloat(0)
  const arr25 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.04.0001')
  const pph25 = isNaN(parseFloat(arr25?.nilai)) ? parseFloat(0) : parseFloat(arr25?.nilai)
  const sumpph25 = parseFloat(pph25lama) + parseFloat(pph25)

  return { sumppn, sumpajakdaerah, sumpph21, sumpph22, sumpph23, sumpph25 }
}
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
