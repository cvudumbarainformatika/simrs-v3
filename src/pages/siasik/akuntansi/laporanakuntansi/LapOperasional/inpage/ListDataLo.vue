<template>
  <template
    v-if="store.hasilpendapatan?.length > 0 && store.hasilbeban?.length > 0 && store.hasilsurplusdefisit?.length > 0 && store.hasilluarbiasa?.length > 0">
    <q-card-section>
      <div class="row justify-center">
        <div class="full-width">
          <q-markup-table class="custom-table" flat bordered wrap-cells :separator="separator">
            <thead>
              <tr class="bg-grey-4">
                <th>KODE REKENING</th>
                <th>
                  URAIAN
                </th>
                <th>
                  NILAI (Rp.)
                </th>
              </tr>
            </thead>
            <tbody v-if="store.reqs.levelberapa === 6">
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilpendapatan" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
              </tr>
              <tr v-for="it in store.hasilbeban" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN NON OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilsurplusdefisit" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>

              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  POS LUAR BIASA
                </td>
              </tr>
              <tr v-for="it in store.hasilluarbiasa" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
              </tr>
            </tbody>




            <tbody v-if="store.reqs.levelberapa === 5">
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilpendapatan" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
              </tr>
              <tr v-for="it in store.hasilbeban" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN NON OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilsurplusdefisit" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  POS LUAR BIASA
                </td>
              </tr>
              <tr v-for="it in store.hasilluarbiasa" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
              </tr>
            </tbody>




            <tbody v-if="store.reqs.levelberapa === 4">
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilpendapatan" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
              </tr>
              <tr v-for="it in store.hasilbeban" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN NON OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilsurplusdefisit" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  POS LUAR BIASA
                </td>
              </tr>
              <tr v-for="it in store.hasilluarbiasa" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
              </tr>
            </tbody>





            <tbody v-if="store.reqs.levelberapa === 3">
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilpendapatan" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
              </tr>
              <tr v-for="it in store.hasilbeban" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN NON OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilsurplusdefisit" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  POS LUAR BIASA
                </td>
              </tr>
              <tr v-for="it in store.hasilluarbiasa" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
              </tr>
            </tbody>



            <tbody v-if="store.reqs.levelberapa === 2 || store.reqs.levelberapa === 1">
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilpendapatan" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
              </tr>
              <tr v-for="it in store.hasilbeban" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  KEGIATAN NON OPERASIONAL
                </td>
              </tr>
              <tr v-for="it in store.hasilsurplusdefisit" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-center text-bold" colspan="3">
                  POS LUAR BIASA
                </td>
              </tr>
              <tr v-for="it in store.hasilluarbiasa" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
                <td class="text-left">
                  {{ it.kode }}
                </td>
                <td class="text-left">
                  {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card-section>
  </template>
</template>
<script setup>
import { formattanpaRp } from 'src/modules/formatter'
import { useLaporanOperasionalStore } from 'src/stores/siasik/laporan/laporanoperasional/lapoperasional'
import { ref } from 'vue'

const store = useLaporanOperasionalStore()
const separator = ref('cell')

function totalPendapatan() {
  const totalpend = store.hasilpendapatan.map((x) => x.nilai)[0]
  return totalpend
}
function totalBeban() {
  const totalbeban = store.hasilbeban.map((x) => x.nilai)[0]
  return totalbeban
}
function surplusdefisitOperasional() {
  const totalpend = store.hasilpendapatan.map((x) => x.nilai)[0]
  const totalbeban = store.hasilbeban.map((x) => x.nilai)[0]
  return totalpend - totalbeban
}

function totalSurplusDefisitNonOperasional() {
  const total = store.hasilsurplusdefisit.map((x) => x.nilai)[0]
  return total
}

function totalSebelumPosLuarbiasa() {
  return totalSurplusDefisitNonOperasional() + surplusdefisitOperasional()
}

function posluarbiasa() {
  const total = store.hasilluarbiasa.map((x) => x.nilai)[0]
  return total
}

function totalsurplusdefisit_lo() {
  return totalPendapatan() - totalBeban() + totalSurplusDefisitNonOperasional() + posluarbiasa()
}
</script>
<style scoped>
/* Mengatur warna garis pada seluruh tabel termasuk garis luar */
.custom-table {
  border-color: #555555 !important;
}

/* Menargetkan tabel di dalam komponen q-markup-table */
.custom-table table {
  border-color: #555555 !important;
}

/* Mengatur warna garis pada sel header */
.custom-table th {
  border-color: #555555 !important;
  font-weight: bold;
}

/* Mengatur warna garis pada sel data */
.custom-table td {
  border-color: #555555 !important;
}

/* Pastikan garis tidak dobel */
.custom-table table {
  border-collapse: collapse;
}

.custom-table thead tr {
  border-color: #555555 !important;
}
</style>
