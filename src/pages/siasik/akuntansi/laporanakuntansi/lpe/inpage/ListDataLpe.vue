<template>
  <template v-if="store.ekuitasawal && store.surplusdefisit && store.hasilkoreksi?.length > 0">
    <q-card-section class="full-width">
      <div class="row justify-center">
        <div class="full-width">
          <q-markup-table class="width:90%" flat-bordered wrap-cells :separator="separator">
            <thead>
              <tr class="bg-dark text-white max-width">
                <th>URAIAN</th>
                <th>NILAI TAHUN {{ tahunsekarang() }} (Rp)</th>
                <th>NILAI TAHUN {{ tahunsekarang() - 1 }} (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-bold">
                <td class="text-left">
                  {{ store.ekuitasawal.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(isNaN(store.ekuitasawal?.nilai) ? 0 : store.ekuitasawal?.nilai) }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(isNaN(store.ekuitasawal?.nilai_lalu) ? 0 : store.ekuitasawal?.nilai_lalu) }}
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  {{ store.surplusdefisit.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(isNaN(store.surplusdefisit?.nilai) ? 0 : store.surplusdefisit?.nilai) }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(isNaN(store.surplusdefisit?.nilai_lalu) ? 0 : store.surplusdefisit?.nilai_lalu) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td class="text-left">
                  Dampak Kumuatif Perubahan Kebijakan / Penyesuaian Ekuitas
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKoreksi()) }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKoreksi_lalu()) }}
                </td>

              </tr>
              <tr v-for="it in store.hasilkoreksi" :key="it">
                <td class="text-left">
                  - {{ it.uraian }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(isNaN(it?.nilai) ? 0 : it?.nilai) }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(isNaN(it?.nilai_lalu) ? 0 : it?.nilai_lalu) }}
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  Sub Jumlah
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKoreksi()) }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(totalKoreksi_lalu()) }}
                </td>
              </tr>
              <tr class="text-bold">
                <td class="text-left">
                  Ekuitas Akhir
                </td>
                <td class="text-right">
                  {{ formattanpaRp(ekuitasAkhir()) }}
                </td>
                <td class="text-right">
                  {{ formattanpaRp(ekuitasAkhir_lalu()) }}
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
import { useLPEStore } from 'src/stores/siasik/laporan/lpe/lpe'
import { onMounted, ref } from 'vue'

const store = useLPEStore()
const separator = ref('cell')

onMounted(() => {
  store.ekuitasawal = []
  store.surplusdefisit = []
  store.hasilkoreksi = []
})
function tahunsekarang() {
  const tahun = store.reqs.tgl ? new Date(store.reqs.tgl).getFullYear() : new Date().getFullYear()
  return tahun
}
function totalKoreksi() {
  const total = store.hasilkoreksi.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0)
  return total
}
function totalKoreksi_lalu() {
  const total = store.hasilkoreksi.map((x) => parseFloat(x.nilai_lalu)).reduce((a, b) => a + b, 0)
  return total
}

function ekuitasAkhir() {
  const ekuitas = parseFloat(store.ekuitasawal.nilai)
  const surplusdef = parseFloat(store.surplusdefisit.nilai)
  const koreksi = store.hasilkoreksi.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0)

  return ekuitas + surplusdef + koreksi
}

function ekuitasAkhir_lalu() {
  const ekuitas = parseFloat(store.ekuitasawal.nilai_lalu)
  const surplusdef = parseFloat(store.surplusdefisit.nilai_lalu)
  const koreksi = store.hasilkoreksi.map((x) => parseFloat(x.nilai_lalu)).reduce((a, b) => a + b, 0)

  return ekuitas + surplusdef + koreksi
}

</script>
