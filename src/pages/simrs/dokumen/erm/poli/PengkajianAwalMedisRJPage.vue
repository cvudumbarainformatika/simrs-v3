<template>
  <q-bar dense class="bg-white q-mb-md">
    <q-space />
    <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
      <q-tooltip class="primary" :offset="[10, 10]">
        Print
      </q-tooltip>
    </q-btn>
  </q-bar>
  <div class="tinggi">
    <div id="printMe" class="full-width">
      <KopSurat />
      <div class="garis-bawah-dblue q-pb-sm q-mb-md">
        <div class="row justify-center f-20 text-weight-bold q-mb-md">
          ASESMEN AWAL MEDIS RAWAT JALAN
        </div>
        <div class="row">
          <div class="col-5">
            <div class="row">
              <div class="col-4">
                Nama
              </div>
              <div class="col-8">
                {{ pasien?.nama }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                No. registrasi
              </div>
              <div class="col-8">
                {{ pasien?.noreg }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Ruangan
              </div>
              <div class="col-8">
                {{ pasien?.poli }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Tanggal Masuk
              </div>
              <div class="col-8">
                {{ pasien?.tgl_kunjungan }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                Sistem Bayar
              </div>
              <div class="col-8">
                {{ pasien?.sistembayar }}
              </div>
            </div>
          </div>
          <div class="col-7">
            <div class="row">
              <div class="col-3">
                No. RM
              </div>
              <div class="col-9">
                {{ pasien?.norm }}
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                Umur
              </div>
              <div class="col-9">
                {{ pasien?.usia }}
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                Alamat
              </div>
              <div class="col-9">
                {{ pasien?.alamat }}
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                Dokter
              </div>
              <div class="col-9">
                {{ pasien?.dokter }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-7">
        <b>1. <u>ANAMSESIS </u></b>:
      </div>

      <div v-for="(erm, e) in store.item" :key="e">
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - KELUHAN UTAMA/<em>CHIEF COMPLAINT</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            {{ erm?.anamnesis[0]?.rs4 }}
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - RIWAYAT PENYAKIT SEKARANG/<em>PRESENT DISEASE HISTORY</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            {{ erm?.anamnesis[0]?.riwayatpenyakitsekarang }}
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - RIWAYAT PENYAKIT DAHULU/<em>POST DISEASE HISTORY</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            {{ erm?.anamnesis[0]?.riwayatpenyakit }}
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - RIWAYAT PENYAKIT KELUARGA/<em>HISTORY DISEASE IN THE FAMILY</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            <span v-if="erm?.anamnesis[0]?.riwayatpenyakitkeluarga === 'tidak'">Tidak Ada Riwayat</span>
            <span v-else>{{ erm?.anamnesis[0]?.riwayatpenyakitkeluarga }}</span>
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - RIWAYAT PEKERJAAN/<em>HISTORY OF JOB</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            -
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - STATUS EKONOMI/<em>PECONOMIC STATUS</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            {{ erm?.pemeriksaanfisik[0]?.sosialekonomi }}
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - STATUS KEJIWAAN DAN KEBIASAAN/<em>PSICOLOGICAL STATUS</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            {{ erm?.pemeriksaanfisik[0]?.statuspsikologis }}
          </div>
        </div>
        <q-separator />
        <div class="row q-my-sm">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-3">
            - KULTURAL/<em>CULTURAL</em>
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-5">
            {{ erm?.pemeriksaanfisik[0]?.muakuloskeletal ?? '-' }}
          </div>
        </div>
        <q-separator />
        <div class="col-7">
          <b>2. <u>PEMERIKSAAN UMUM </u></b>:
        </div>
        <!-- <div
          v-for="(ermz,ez) in store.item[0]?.pemeriksaanfisik"
          :key="ez"
        > -->
        <div class="row">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-2">
            - Kesadaran
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-2">
            {{ erm?.pemeriksaanfisik[0]?.kesadaran }}
          </div>
          <div class="col-2">
            - Keadaan Umum
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-3">
            {{ erm?.pemeriksaanfisik[0]?.keadaan_umum }}
          </div>
        </div>
        <q-separator />
        <div class="row">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-2">
            - Keadaan Gizi
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-2">
            <span v-if="erm?.skreeninggizi >= 2" class="col-1">Beresiko Mal Nutrisi</span>
            <span v-else class="col-1">Tidak Beresiko Mal Nutrisi</span>
          </div>
        </div>
        <q-separator />
        <div class="row">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-2">
            - Tekanan Darah
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-2">
            {{ erm?.pemeriksaanfisik[0]?.sistole }}/{{ erm?.pemeriksaanfisik[0]?.diastole }} mmHg
          </div>
          <div class="col-2">
            - Nadi
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-1">
            {{ erm?.pemeriksaanfisik[0]?.rs4 }} x/menit
          </div>
        </div>
        <div class="row">
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-2">
            - Suhu
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-1">
            {{ erm?.pemeriksaanfisik[0]?.suhutubuh }} <span class="f-8" style="vertical-align: top;">o</span>C
          </div>
          <div class="col-1">
            &nbsp;
          </div>
          <div class="col-2">
            - Pernapasan
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-1">
            {{ erm?.pemeriksaanfisik[0]?.pernapasan }} x/menit
          </div>
        </div>
        <div class="q-pa-md">
          <q-markup-table separator="vertical" flat bordered dense center style="width: 50%;">
            <thead>
              <tr>
                <th class="text-left">
                  Anatomy
                </th>
                <th class="text-left">
                  Keterangan
                </th>
                <th class="text-left">
                  Gambar
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detailgambars, dg) in store.item" :key="dg" v-ripple clickable>
                <td class="text-left" style="max-width: 150px;">
                  {{ detailgambars?.pemeriksaanfisik[0]?.detailgambars[0]?.anatomy }}
                </td>
                <td class="text-left">
                  {{ detailgambars?.pemeriksaanfisik[0]?.detailgambars[0]?.ket }}
                </td>
                <td class="text-left" style="max-width: 150px;">
                  <!-- {{ detailgambars.pemeriksaanfisik[0].detailgambars[0].templategambar }} -->
                  <img src=" require(' {{ detailgambars?.pemeriksaanfisik[0]?.detailgambars[0]?.templategambar }}')"
                    height="10" width="10">
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
      <br>
      <q-separator />
      <div class="q-mt-md">
        <b>3. <u>PEMERIKSAAN PENUNJANG PRE-RAWAT JALAN :</u></b>
      </div>
      <div class="row">
        <div class="col-1">
          &nbsp;
        </div>
        <div class="col-1">
          - Laboratorium
        </div>
        <div class="col-1">
          :
        </div>
        <div class="col-7">
          <div>
            <q-markup-table separator="vertical" flat bordered dense>
              <thead>
                <tr>
                  <th class="text-left">
                    Nama Pemeriksaan
                  </th>
                  <th class="text-left">
                    Nama Paket
                  </th>
                  <th class="text-right">
                    Hasil
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lab, lxx) in store?.item[0]?.laborat" :key="lxx">
                  <td class="text-left f-12 ellipsis" style="max-width: 250px;">
                    {{ lab?.pemeriksaanlab?.rs2 }}
                  </td>
                  <td class="text-left f-12 ellipsis" style="max-width: 250px;">
                    {{ lab?.pemeriksaanlab?.rs21 ? lab?.pemeriksaanlab?.rs21 : '-' }}
                  </td>
                  <td class="text-right f-12" style="max-width: 150px;">
                    {{ lab?.rs21 }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </div>
      <br>
      <q-separator />
      <div class="row">
        <div class="col-1">
          &nbsp;
        </div>
        <div class="col-1">
          - Hasil Radiologi
        </div>
        <div class="col-1">
          :
        </div>
        <div class="col-3">
          {{ store.item[0]?.pembacaanradiologi[0]?.rs3 ? store.item[0]?.pembacaanradiologi[0]?.rs3 : '-'
          }}
        </div>
      </div>
      <q-separator />
      <div class="q-mt-md">
        <div class="row">
          <div class="col-2">
            <b>4. <u>DIAGNOSIS KERJA :</u></b>
          </div>
          <template v-if="store.item[0]?.diagnosa?.length">
            <div v-for="(diagp, dp) in store.item[0]?.diagnosa" :key="dp" class="col-3">
              <div>
                - {{ diagp?.rs4 === 'Primer' ? diagp?.masterdiagnosa?.rs4 : '' }}
              </div>
            </div>
          </template>
          <template v-if="store.item[0]?.manymemo?.length">
            <div v-for="(diagp, dp) in store.item[0]?.manymemo" :key="dp" class="col-3">
              <div>
                - {{ diagp?.diagnosa }}
              </div>
            </div>

          </template>
        </div>
      </div>
      <q-separator />
      <div class="q-mt-md">
        <div class="row">
          <div class="col-2">
            <b>5. <u>PENGOBATAN :</u></b>
          </div>
          <div class="col-3">
            <template
              v-if="store.item?.apotekracikanrajal?.length || store.item?.apotekracikanrajallalu?.length || store.item?.apotekrajal?.length || store.item?.apotekrajal?.length">
              <div class="row items-center text-weight-bold">
                <div class="col-9">
                  Obat
                </div>
                <div class="col-3">
                  Jumlah
                </div>
              </div>
              <div v-if="store.item[0]?.apotekrajal?.length">
                <div v-for="(item, i) in store.item[0]?.apotekrajal" :key="i" class="row items-center">
                  <div class="col-9">
                    {{ item?.obat ?? '-' }}
                  </div>
                  <div class="col-3">
                    {{ item?.jumlah ?? '0' }}
                  </div>
                </div>
              </div>
            </template>
            <div v-if="store.item[0]?.newapotekrajal?.length">
              {{ filteredObat(store.item[0]?.newapotekrajal) }}
            </div>
          </div>
        </div>
      </div>
      <q-separator />
      <div class="q-mt-md">
        <div class="row">
          <div class="col-2">
            <b>6. <u>RENCANA :</u></b>
          </div>
          <div>
            - {{ store.item[0]?.planningdokter?.terapi }}
          </div>
        </div>
      </div>
      <q-separator />
      <div class="q-mt-md">
        <div class="row">
          <div class="col-2">
            <b>7. <u>TARGET KEBERHASILAN :</u></b>
          </div>
          <div class="col-3">
            <div>
              - {{ store.item[0]?.planningdokter?.target }}
            </div>
          </div>
        </div>
      </div>
      <q-separator />
      <div class="q-mt-md">
        <div class="row">
          <div class="col-2">
            <b>8. <u>CATATAN KIE :</u></b>
          </div>
          <div class="row">
            <div v-for="(erm, e1) in store.item" :key="e1">
              <div v-for="item in erm?.rs239_implementasi" :key="item">
                <div>
                  <div class="col-5" style="margin-left: 20px;" v-if="!item?.materi?.length">
                    -
                  </div>
                  <div v-else>
                    <div v-for="mat in item?.materi" :key="mat">
                      <div class="flex no-wrap" style="margin-left: 20px;">{{ mat }}, </div>
                    </div>
                  </div>

                  <div v-html="getNewLine(item?.materiLain)" class="text-italic" style="margin-left: 20px;" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-separator />

      <div class="q-mt-md">
        <div class="row">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Pasien / Keluarga
            </div>
          </div>
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Dokter
            </div>
          </div>
        </div>
        <div class="row items-end">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              (........................)
            </div>
          </div>
          <div class="col-6">
            <div class="text-center text-weight-bold">
              <div class="row justify-center">
                <div class="flex-center " style="width: 80px;">
                  <div class="relative-position">
                    <vue-qrcode :value="qrPetugas(petugas)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                      margin: 0
                    }" />
                    <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
                  </div>
                </div>
              </div>
              <div class="f-12 text-wrap row justify-center">{{ petugas?.nama }}</div>


            </div>
          </div>
        </div>
      </div>
      <div v-if="store.loading">
        <app-loading />
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>
<script setup>
import { date } from 'quasar'
import { useDokumenpengkajianawalmedisrjStore } from 'src/stores/simrs/dokumen/erm/pengkajianawalmedisrj'
import KopSurat from '../../comppoli/KopSurat.vue'
import { computed } from 'vue'
import { getNewLine } from 'src/modules/formatter'
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useDokumenpengkajianawalmedisrjStore()
store.setParams('noreg', props.pasien?.noreg)
store.getData()
// eslint-disable-next-line no-unused-vars
function getYT (val) {
  if (val === 1 || val === '1') {
    return 'Ya'
  } else if (val === 0 || val === '0') {
    return 'Tidak'
  } else {
    return '-'
  }
}

const petugas = computed(() => {
  const petugas = store.item[0]?.doktersimpeg
  console.log('petugas', petugas)
  return petugas

})
const qrPetugas = (user) => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASSESMENT PERAWAT.png'
  const asal = 'RAWAT JALAN'
  const petugas = user?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}


function filteredObat (item) {
  const obats = []
  const retur = store.item[0]?.newapotekrajalretur
  // console.log('item', item, retur)


  const perRa = item?.flatMap(x => x.permintaanracikan) ?? []
  const perNoRa = item?.flatMap(x => x.permintaanresep) ?? []

  const rinciannya = item?.flatMap(x => x.rincian) ?? []
  const rincRacik = item?.flatMap(x => x.rincianracik) ?? []

  const retnya = retur?.flatMap(x => x.rinci) ?? []
  // console.log('rinciaaan', perRa, perNoRa, rinciannya, rincRacik, retnya,)

  const kdRacik = perRa?.map(x => x?.kdobat)
  const kdNoRacik = perNoRa?.map(x => x?.kdobat)
  const kdObats = [...kdRacik, ...kdNoRacik]

  kdObats.forEach(ob => {
    const adaR = rinciannya?.length ? rinciannya?.filter(x => x.kdobat === ob)?.reduce((a, b) => a + b?.jumlah, 0) : 0
    const adaNR = rincRacik?.length ? rincRacik?.filter(x => x.kdobat === ob)?.reduce((a, b) => a + b?.jumlah, 0) : 0
    const adaRet = retnya?.length ? retnya?.filter(x => x.kdobat === ob)?.reduce((a, b) => a + b?.jumlah_retur, 0) : 0

    const ObatR = perRa.find(x => x.kdobat === ob)
    const ObatNR = perNoRa.find(x => x.kdobat === ob)
    const jumlah = adaR + adaNR - adaRet
    if (jumlah > 0) obats.push({
      nama: ObatR?.mobat?.nama_obat ?? ObatNR?.mobat?.nama_obat,
      jumlah: jumlah
    })
    else {
      console.log('retur all', ObatR?.mobat?.nama_obat ?? ObatNR?.mobat?.nama_obat)

    }
  })
  const obatnya = obats?.map(x => (x.nama + ' (' + x.jumlah + ')'))?.join(', ')
  // console.log('val', kdObats, obats)
  return obatnya

}
// eslint-disable-next-line no-unused-vars
const printObj = {
  id: 'printMe',
  popTitle: 'Assesment Medis Rawat Jalan'

}
</script>
<style lang="scss" scoped>
.qrcode__image {
  // background-color: #fff;
  // border: 0.05rem solid #fff;
  // border-radius: 0.25rem;
  // box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 20%;
  width: 20%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: letter;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}

.t-vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.tinggi {
  min-height: 100%;
}

.garis-bawah-dablue {
  border-bottom: 1px solid rgb(56, 150, 239);
  border-bottom-style: dashed;
}

.garis-bawah-dblue {
  border-bottom: 4px solid rgb(56, 150, 239);
  border-bottom-style: double;

  .textinggris-miring {
    font-family: Times New Roman, Times, serif;
    font-style: italic;
  }
}
</style>
