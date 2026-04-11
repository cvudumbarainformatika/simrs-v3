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
                <th>NILAI TAHUN {{ tahunsekarang() }} (Rp)</th>
                <th>NILAI TAHUN {{ tahunsekarang() - 1 }} (Rp)</th>
              </tr>
            </thead>
            <tbody v-if="store.reqs.levelberapa === 6">
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan_lalu()) }}
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>

              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo_lalu()) }}
                </td>
              </tr>
            </tbody>




            <tbody v-if="store.reqs.levelberapa === 5">
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan_lalu()) }}
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo_lalu()) }}
                </td>
              </tr>
            </tbody>




            <tbody v-if="store.reqs.levelberapa === 4">
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan_lalu()) }}
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>

              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo_lalu()) }}
                </td>
              </tr>
            </tbody>





            <tbody v-if="store.reqs.levelberapa === 3">
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan_lalu()) }}
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo_lalu()) }}
                </td>
              </tr>
            </tbody>



            <tbody v-if="store.reqs.levelberapa === 2 || store.reqs.levelberapa === 1">
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH PENDAPATAN DAERAH-LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalPendapatan_lalu()) }}
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH BEBAN DAERAH
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalBeban_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(surplusdefisitOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH SURPLUS/DEFISIT KEGIATAN NON OPERASIONAL
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSurplusDefisitNonOperasional_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS/DEFISIT SEBELUM POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalSebelumPosLuarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="">
                <td class="text-center text-bold" colspan="4">
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
                <td class="text-right">
                  {{ formattanpaRp(it.nilai_lalu) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  JUMLAH POS LUAR BIASA
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(posluarbiasa_lalu()) }}
                </td>
              </tr>
              <tr class="bg-grey-2">
                <td class="text-right text-bold" colspan="2">
                  SURPLUS / DEFISIT LO
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo()) }}
                </td>
                <td class="text-right text-bold">
                  {{ formattanpaRp(totalsurplusdefisit_lo_lalu()) }}
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
function tahunsekarang() {
  const tahun = store.reqs.tgl ? new Date(store.reqs.tgl).getFullYear() : new Date().getFullYear()
  return tahun
}
function totalPendapatan() {
  const totalpend = store.hasilpendapatan.map((x) => x.nilai)[0]
  return totalpend
}
function totalPendapatan_lalu() {
  const totalpend = store.hasilpendapatan.map((x) => x.nilai_lalu)[0]
  return totalpend
}
function totalBeban() {
  const totalbeban = store.hasilbeban.map((x) => x.nilai)[0]
  return totalbeban
}
function totalBeban_lalu() {
  const totalbeban = store.hasilbeban.map((x) => x.nilai_lalu)[0]
  return totalbeban
}
function surplusdefisitOperasional() {
  const totalpend = store.hasilpendapatan.map((x) => x.nilai)[0]
  const totalbeban = store.hasilbeban.map((x) => x.nilai)[0]
  return totalpend - totalbeban
}
function surplusdefisitOperasional_lalu() {
  const totalpend = store.hasilpendapatan.map((x) => x.nilai_lalu)[0]
  const totalbeban = store.hasilbeban.map((x) => x.nilai_lalu)[0]
  return totalpend - totalbeban
}
function totalSurplusDefisitNonOperasional() {
  const total = store.hasilsurplusdefisit.map((x) => x.nilai)[0]
  return total
}
function totalSurplusDefisitNonOperasional_lalu() {
  const total = store.hasilsurplusdefisit.map((x) => x.nilai_lalu)[0]
  return total
}

function totalSebelumPosLuarbiasa() {
  return totalSurplusDefisitNonOperasional() + surplusdefisitOperasional()
}
function totalSebelumPosLuarbiasa_lalu() {
  return totalSurplusDefisitNonOperasional_lalu() + surplusdefisitOperasional_lalu()
}

function posluarbiasa() {
  const total = store.hasilluarbiasa.map((x) => x.nilai)[0]
  return total
}
function posluarbiasa_lalu() {
  const total = store.hasilluarbiasa.map((x) => x.nilai_lalu)[0]
  return total
}

function totalsurplusdefisit_lo() {
  return totalPendapatan() - totalBeban() + totalSurplusDefisitNonOperasional() + posluarbiasa()
}

function totalsurplusdefisit_lo_lalu() {
  return totalPendapatan_lalu() - totalBeban_lalu() + totalSurplusDefisitNonOperasional_lalu() + posluarbiasa_lalu()
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
