<template>
  <div class="col-auto b print-page">
    <!-- <div class="row b full-width full-height ">
      <div class="col text-center q-py-xs flex-center">
        <div class="text-bold" style="font-size: 17px">PENGKAJIAN AWAL KEBIDANAN IGD</div>
      </div>
    </div> -->
    <div class="row items-center q-px-sm q-pt-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">Dokter Jaga IGD</div>
          <div class="col-9">: {{ user?.nama ?? '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">DPJP Utama</div>
          <div class="col-9">: {{ props.pasien?.dokter ?? '-' }}</div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-3">Tanggal Serah Terima</div>
          <div class="col-9">: {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}</div>
        </div>
        <div class="row">
          <div class="col-3">Jam</div>
          <div class="col-9">: {{ date.formatDate(Date.now(), 'HH:mm') }} WIB</div>
        </div>
      </div>
    </div>

    <div class="row items-start q-px-sm q-pt-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">Alasan Dirawat</div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="b1 flex justify-center text-center col-4">DERAJAT PASIEN
            <br> {{ props.pasien?.skalatransfer?.[0]?.scoretotal ?? '-' }}
          </div>
        </div>
      </div>
    </div>


    <div class="row q-px-sm q-pb-xs full-width">
      <div class="col-12">
        DATA FOKUS
      </div>
    </div>

    <template v-for="(triage, x) in props?.pasien?.triage" :key="x">

      <div class="row items-start q-px-sm full-width">
        <div class="col">
          <div class="row">
            <div class="col-3">Subjektif</div>
            <div class="col-9">: {{ props?.pasien?.anamnesis?.[0]?.rs4 ?? '-' }}</div>
          </div>
          <div class="row">
            <div class="col-3">Objektif</div>
            <div class="col-9">: {{ triage?.kesadaran ?? '-' }}</div>
          </div>
        </div>
        <div class="col">
          <div class="row">
            <div class="col-3">ALERGI</div>
            <div class="col-9">: {{ props?.pasien?.anamnesis?.[0]?.keteranganalergi ?? 'Tidak ada alergi' }}</div>
          </div>
          <div class="row">
            <div class="col-3">SKALA NYERI</div>
            <div class="col-9">: {{ props?.pasien?.anamnesis?.[0]?.keteranganscorenyeri ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row items-start q-px-sm q-pb-xs full-width">
        <div class="col">
          <div class="row">
            <div class="col-2">Tensi : {{ triage?.sistole ?? '-' }}/{{ triage?.diastole ?? '-' }} mmHg,</div>
            <div class="col-2"> Nadi : {{ triage?.nadi ?? '-' }} x/mnt,</div>
            <div class="col-2"> Suhu : {{ triage?.suhu ?? '-' }} °C,</div>
            <div class="col-2"> RR : {{ triage?.pernapasanx ?? '-' }} x/mnt,</div>
            <div class="col-2"> SpO2 : {{ triage?.spo2 ?? '-' }} %</div>
          </div>
        </div>
      </div>
    </template>



    <div class="row items-start q-px-sm q-pt-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">DIAGNOSA</div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
      </div>
      <div class="col">
      </div>
    </div>

    <div class="row items-start q-px-sm q-pt-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col">MASALAH KEPERAWATAN</div>
        </div>
        <template v-if="props?.pasien?.diagnosakebidanan?.length > 0">
          <div v-for="diagkeb in props.pasien?.diagnosakebidanan" :key="diagkeb.id">
            <div> <b>{{ diagkeb.kode }} - {{ diagkeb.nama }}</b> </div>
            <div caption>
              Intervensi Kebidanan
            </div>
            <div v-for="sub in diagkeb.intervensi" :key="sub.id">
              - {{ sub?.masterintervensi?.nama }}
            </div>
          </div>

        </template>
        <template v-else>
          <div v-for="diagkeb in props.pasien?.diagnosakeperawatan" :key="diagkeb.id">
            <div> <b>{{ diagkeb.kode }} - {{ diagkeb.nama }}</b> </div>
            <div caption>
              Intervensi Keperawatan
            </div>
            <div v-for="sub in diagkeb.intervensi" :key="sub.id">
              - {{ sub?.masterintervensi?.nama }}
            </div>
          </div>
        </template>



      </div>
    </div>

    <div class="row items-start q-px-sm q-pt-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">TINDAKAN KEPERAWATAN</div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
      </div>
      <div class="col">
      </div>
    </div>

    <div class="row items-start q-px-sm q-pt-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">Terapi dan Obat</div>
          <div v-if="!props.pasien?.pemberianobat.length" class="col-9">: {{ '-' }}</div>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
    <div class="row q-pb-xs justify-center full-width full-height ">
      <div v-if="props.pasien?.pemberianobat.length" class="row" style="width: 98%;">
        <table class="items-center full-width">
          <thead>
            <tr style="">
              <th class="text-center">
                Terapi
              </th>
              <th class="text-center">
                Dosis
              </th>
              <th class="text-center">
                Jam Masuk
              </th>
              <th class="text-center">
                Sisa Obat
              </th>
              <th class="text-center">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody class="align-middle q-pl-sm">
            <!-- <tr v-for="(xxx, x) in historykehamilan" :key="x">
              <td class="text-center">
                {{ x + 1 }}
              </td>
              <td class="text-rigth">
                <span class="text-h7">{{ xxx?.tanggal_partus }} </span>
              </td>
              <td class="text-rigth">
                <span class="text-h7">{{ xxx?.tempat }} </span>
              </td>
              <td class="text-center ">
                {{ xxx?.umurkehamilan }}
              </td>
              <td class="text-rigth ">
                {{ xxx?.jenispersalinan }}
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>


    <div class="row q-px-sm q-pb-xs full-width full-height ">
      Rencana Terapi/Tindakan/Pemeriksaan :
    </div>

    <div class="row items-start q-px-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">Pemeriksaan yang disertakan </div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-2">RO</div>
          <div class="col-10">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-2">LAB</div>
          <div class="col-10">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-2">ECG</div>
          <div class="col-10">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-2">Lain-lain</div>
          <div class="col-10">: {{ '-' }}</div>
        </div>
      </div>
    </div>

    <div class="row q-px-sm q-pb-xs full-width full-height ">
      <div class="col">
        <div class="row">
          <div class="col-3">Kelengkapan yang disertakan </div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Kondisi Pasien saat serah terima </div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Keadaan Umum </div>
          <div class="col-9">: {{ '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Kesadaran </div>
          <div class="col-9">: {{ '-' }}</div>
        </div>

        <div class="row">
          <div class="col-2">Tensi : {{ '-' }}/{{ '-' }} mmHg,</div>
          <div class="col-2"> Nadi : {{ '-' }} x/mnt,</div>
          <div class="col-2"> Suhu : {{ '-' }} °C,</div>
          <div class="col-2"> RR : {{ '-' }} x/mnt,</div>
          <div class="col-2"> SpO2 : {{ '-' }} %</div>
        </div>

        <div class="row">
          <div class="col-2">Ruangan Asal </div>
          <div class="col-4">: {{ '-' }}</div>
          <div class="col-2">Ruangan Penerima </div>
          <div class="col-4">: {{ '-' }}</div>
        </div>
      </div>
    </div>



    <div class="row full-width q-pb-sm">
      <div class="ttd-kanan">

        <div class="text-bold">
          PERAWAT PENERIMA
        </div>
        <div class="column flex-center">
          <div class="q-pt-xs" style="width: 80px;">
            <!-- <template v-if="item.pegawai">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
            </template> -->
          </div>
        </div>
        <div>
          {{ 'NAMA' }}
        </div>
      </div>
      <div class="ttd-kiri">

        <div class="text-bold">
          PERAWAT PENERIMA
        </div>
        <div class="column flex-center">
          <div class="q-pt-xs" style="width: 80px;">
            <!-- <template v-if="item.pegawai">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
            </template> -->
          </div>
        </div>
        <div>
          {{ 'NAMA' }}
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { date } from 'quasar';
import { dateFull, dateFullFormat, dateHalfFormat, formatJam } from 'src/modules/formatter';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung';
import { useListKunjunganIgdStore } from 'src/stores/simrs/pendaftaran/generalconsent/kunjunganIgd';
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePengunjungIgdStore()
const kunjungan = useListKunjunganIgdStore()
const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai)
// Cari data kunjungan berdasarkan rs1 dari store.items
const kunjunganFromStore = computed(() => {
  // Ambil rs1 dari store.items (data pengunjung IGD)
  const rs1Values = store.items?.map(item => item.rs1).filter(Boolean) || []
  // Filter kunjungan.items yang rs1-nya ada di rs1Values
  return kunjungan.items?.filter(k => k.rs1 && rs1Values.includes(k.rs1)) || []
})

onMounted(async () => {
  await store.getData()
  await kunjungan.getListPasiens()
  console.log('kunjungan data:', store.items?.[0]?.generalcons)
  console.log('igd Kunjungan:', kunjungan.items)
  console.log('kunjungan from store:', kunjunganFromStore.value)
})
const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  // const enc = btoa(`${petugas}`)
  // return `${enc}`

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Pengkajian Awal Kebidanan.png'
  const asal = 'RAWAT JALAN'
  const petugas = props.pasien?.anamnesekebidanan?.[0]?.pegawai?.kdpegsimrs
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})

console.log('pasien', props.pasien)


</script>
<style lang="scss" scoped>
.b {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  border-top: none;
}

.b_double {
  border-bottom: 4px double rgb(30, 30, 30);
  border-left: none;
  border-right: none;
  border-top: none;
  padding-top: 8px;
}

.b1 {
  border: 2px solid #000;
}

.b2 {
  border-right: 2px solid #000;
  border-left: none;
  border-bottom: none;
  border-top: none;
}

.b3 {
  border-bottom: 2px solid #000;
  border-left: none;
  border-right: none;
  border-top: none;
}

.b4 {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: none;
  border-top: none;
}

.b5 {
  border-left: 2px solid #000;
  border-right: none;
  border-bottom: none;
  border-top: none;
}

table {
  border-color: black;
}

table,
th,
td {
  border-width: 1px;
  border-style: solid;
  border-collapse: collapse;
}

td {
  padding-left: 10px;
  padding-right: 10px;
}

.page-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: a4;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD Mohamad Saleh | Hal Ke-" counter(page);
      font-size: 8pt;
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}

.ttd-kanan {
  position: relative;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 60%;
  height: 100px;
  left: 40%;
}

.ttd-kiri {
  position: relative;
  bottom: 50px;
  text-align: center;
  justify-content: center;
  width: 50%;
  height: 100px;
}
</style>
