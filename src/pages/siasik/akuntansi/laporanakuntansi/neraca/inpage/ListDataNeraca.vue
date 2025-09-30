<template>
  <template v-if="store.hasilaset?.length || store.hasilkewajiban?.length || store.hasilekuitas?.length">
    <q-card-section class="full-width">
      <div class="row full-width justify-center">
        <q-markup-table class="custom-table full-width" flat bordered wrap-cells :separator="separator">
          <thead>
            <tr class="bg-grey-4">
              <th>KODE REKENING</th>
              <th>URAIAN</th>
              <th>NILAI (Rp.)</th>
            </tr>
          </thead>
          <tbody v-if="store.reqs.levelberapa === 6">
            <tr v-for="it in store.hasilaset" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH ASET</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahAset()) }}</td>
            </tr>
            <tr v-for="it in store.hasilkewajiban" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr v-for="it in store.hasilekuitas" :key="it" :class="it.kode?.length <= 12 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH KEWAJIBAN DAN EKUITAS</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahWajibEkuitas()) }}</td>
            </tr>
          </tbody>
          <tbody v-if="store.reqs.levelberapa === 5">
            <tr v-for="it in store.hasilaset" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH ASET</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahAset()) }}</td>
            </tr>
            <tr v-for="it in store.hasilkewajiban" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr v-for="it in store.hasilekuitas" :key="it" :class="it.kode?.length <= 9 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH KEWAJIBAN DAN EKUITAS</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahWajibEkuitas()) }}</td>
            </tr>
          </tbody>
          <tbody v-if="store.reqs.levelberapa === 4">
            <tr v-for="it in store.hasilaset" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH ASET</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahAset()) }}</td>
            </tr>
            <tr v-for="it in store.hasilkewajiban" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr v-for="it in store.hasilekuitas" :key="it" :class="it.kode?.length <= 6 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH KEWAJIBAN DAN EKUITAS</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahWajibEkuitas()) }}</td>
            </tr>
          </tbody>
          <tbody v-if="store.reqs.levelberapa === 3">
            <tr v-for="it in store.hasilaset" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH ASET</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahAset()) }}</td>
            </tr>
            <tr v-for="it in store.hasilkewajiban" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr v-for="it in store.hasilekuitas" :key="it" :class="it.kode?.length <= 3 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH KEWAJIBAN DAN EKUITAS</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahWajibEkuitas()) }}</td>
            </tr>
          </tbody>
          <tbody v-if="store.reqs.levelberapa === 2 || store.reqs.levelberapa === 1">
            <tr v-for="it in store.hasilaset" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH ASET</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahAset()) }}</td>
            </tr>
            <tr v-for="it in store.hasilkewajiban" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr v-for="it in store.hasilekuitas" :key="it" :class="it.kode?.length <= 1 ? 'text-bold' : ''">
              <td>{{ it.kode }}</td>
              <td>{{ it.uraian }}</td>
              <td class="text-right">{{ formattanpaRp(it.nilai) }}</td>
            </tr>
            <tr>
              <td colspan="2" class="text-center text-bold">JUMLAH KEWAJIBAN DAN EKUITAS</td>
              <td class="text-right text-bold">{{ formattanpaRp(jumlahWajibEkuitas()) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </q-card-section>

  </template>
  <template v-else>
    <div class="row q-pa-md full-width text-subtitle1 flex-center">
      <q-icon class="q-pr-sm" size="sm" name="icon-mat-warning" />
      BELUM ADA DATA, SILAHKAN PILIH PARAMETER!!
    </div>
  </template>
  <!-- <template v-if="store.objsetarakas?.length > 0 || store.objretribusi?.length > 0 ||
    store.objpiutang?.length > 0 || store.objpenyisihan?.length > 0 ||
    store.objpersediaan?.length > 0 || store.objinvestasi?.length > 0 ||
    store.objasettetap?.length > 0 || store.objasetlainnya?.length > 0 ||
    store.objutang?.length > 0 || store.objutangjkpanjang?.length > 0 ||
    store.objekuitas?.length > 0">
    <q-card-section class="full-width">
      <div class="row justify-center">
        <div class="full-width">
          <q-markup-table flat-bordered wrap-cells :separator="separator">
            <thead>
              <tr class="bg-dark text-white max-width">
                <th>URAIAN</th>
                <th>NILAI (Rp.)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-bold">
                <td colspan="2" class="text-left">
                  ASET
                </td>
              </tr>
              <tr class="text-bold">
                <td colspan="2">
                  <div class="q-pl-sm text-left">
                    ASET LANCAR
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="q-pl-md text-left">
                    Kas dan Setara Kas
                  </div>
                </td>
              </tr>
              <tr v-for="it in store.objsetarakas" :key="it">
                <td>
                  <div class="q-pl-lg text-left">
                    - {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr>
                <td>
                  <div class="q-pl-md text-left">
                    {{ store.objretribusi?.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(store.objretribusi?.nilai) }}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="q-pl-md text-left">
                    Piutang
                  </div>
                </td>
              </tr>
              <tr v-for="it in store.objpiutang" :key="it">
                <td>
                  <div class="q-pl-lg text-left">
                    - {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr v-for="it in store.objpersediaan" :key="it">
                <td>
                  <div class="q-pl-md text-left">
                    {{ it?.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it?.nilai) }}
                </td>
              </tr>
              <tr>
                <td>
                  <div class="q-pl-md text-left">
                    {{ store.objinvestasi?.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(store.objinvestasi?.nilai) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td class="text-center">
                  JUMLAH ASET LANCAR
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalAsetlancar()) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td colspan="2">
                  <div class="q-pl-sm text-left">
                    ASET TIDAK LANCAR
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="q-pl-md text-left">
                    ASET TETAP
                  </div>
                </td>
              </tr>
              <tr v-for="it in store.objasettetap" :key="it">
                <td>
                  <div class="q-pl-lg text-left">
                    - {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td class="text-center">
                  JUMLAH ASET TETAP
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalAsettetap()) }}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="q-pl-md text-left">
                    ASET LAINNYA
                  </div>
                </td>
              </tr>
              <tr v-for="it in store.objasetlainnya" :key="it">
                <td>
                  <div class="q-pl-lg text-left">
                    - {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td class="text-center">
                  JUMLAH ASET LAINNYA
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalAsetlainnya()) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td>
                  <div class="text-right q-pl-sm">
                    JUMLAH ASET
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(jumlahAset()) }}
                </td>
              </tr>
              <tr v-for="it in store.objutang" :key="it">
                <td>
                  <div class="q-pl-md text-left">
                    {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td>
                  <div class="text-center q-pl-sm">
                    JUMLAH KEWAJIBAN JANGKA PENDEK
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKewajiban().kewajibanjgkpendek) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td colspan="2">
                  <div class="q-pl-sm text-left">
                    KEWAJIBAN JANGKA PANJANG
                  </div>
                </td>
              </tr>
              <tr v-for="it in store.objutangjkpanjang" :key="it">
                <td>
                  <div class="q-pl-md text-left">
                    {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td>
                  <div class="text-center q-pl-sm">
                    JUMLAH KEWAJIBAN JANGKA PANJANG
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKewajiban().kewajibanjgkpanjang) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td>
                  <div class="text-right q-pl-sm">
                    JUMLAH KEWAJIBAN
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKewajiban().jumlahkewajiban) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td colspan="2">
                  <div class="q-pl-sm text-left">
                    EKUITAS
                  </div>
                </td>
              </tr>
              <tr v-for="it in store.objekuitas" :key="it">
                <td>
                  <div class="q-pl-md text-left">
                    {{ it.uraian }}
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(it.nilai) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td>
                  <div class="text-right q-pl-sm">
                    JUMLAH EKUITAS
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalEkuitas()) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td>
                  <div class="text-center q-pl-sm">
                    JUMLAH KEWAJIBAN DAN EKUITAS DANA
                  </div>
                </td>
                <td class="text-right">
                  {{ formattanpaRp(jumlahKewajibanDanEkuitas()) }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card-section>
  </template> -->
</template>
<script setup>
import { formattanpaRp } from 'src/modules/formatter'
import { useNeracaStore } from 'src/stores/siasik/laporan/neraca/neraca'
import { ref } from 'vue'
// import { onMounted } from 'vue'
const separator = ref('cell')
const store = useNeracaStore()

function jumlahAset() {
  const totalaset = store.hasilaset.map((x) => parseFloat(x.nilai))[0]
  return totalaset
}

function jumlahWajibEkuitas() {
  const totalwajib = store.hasilkewajiban.map((x) => parseFloat(x.nilai))[0]
  const totalekuitas = store.hasilekuitas.map((x) => parseFloat(x.nilai))[0]
  return totalwajib + totalekuitas
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
