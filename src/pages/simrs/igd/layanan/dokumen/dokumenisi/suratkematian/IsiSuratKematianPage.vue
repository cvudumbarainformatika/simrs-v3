<template>
  <div class="contentx">
    <div class="f-16 text-center text-bold q-mb-xs" style="text-decoration: underline; text-underline-offset: 5px;">

    </div>
    <div class="f-12 text-center text-bold q-my-sm">
      <span>NOMOR : <span>{{ store.isisuratkematian?.nosurat ||
        '472.12/......../425.208/KEM/..../20....'
          }}</span></span>
    </div>

    <div class="full-width q-mt-lg">
      <div>Yang bertanda tangan di bawah ini : </div>


      <div class="row q-pa-sm q-ml-md">
        <div class="col-auto q-mr-lg">
          <div class="column">
            <div>Nama Dokter </div>
            <div>Pangkat / Gol </div>
            <div>Jabatan </div>
          </div>
        </div>
        <div class="col-grow">
          <div class="column">
            <div> : {{ store.isisuratkematian?.dokterpenangungjawabpulang?.nama }}</div>
            <div> : {{ store.isisuratkematian?.dokterpenangungjawabpulang?.golongan ?? '' }} {{
              store.isisuratkematian?.dokterpenangungjawabpulang?.golongan ? ' / ' : '' }} {{
                store.isisuratkematian?.dokterpenangungjawabpulang?.ket_golongan ?? '' }}
            </div>
            <div> : {{ store.isisuratkematian?.dokterpenangungjawabpulang?.ket_jabatan ?? '' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div>Menyatakan bahwa : </div>
    <div class=""><span class="text-bold">TELAH MENINGGAL DUNIA </span> , Saudara : </div>

    <div class="full-width">
      <table class="model-1 q-ml-lg" style="width: 97%;">
        <tbody>
          <tr valign="top">
            <td width="15%">
              <div>
                Nama Lengkap
              </div>
            </td>
            <td>
              <div class="flex flex-wrap">
                <div class="q-mr-sm">: </div>
                <div>{{ pasien?.nama }}</div>
              </div>
            </td>
          </tr>
          <tr valign="top">
            <td width="15%">
              <div>
                Nomor KTP
              </div>
              <!-- <i>Address</i> -->
            </td>
            <td>
              <div class="flex flex-wrap">
                <div class="q-mr-sm">: </div>
                <div>{{ pasien?.nktp }}</div>
              </div>
            </td>
          </tr>
          <tr valign="top">
            <td width="15%">
              <div>
                Umur
              </div>
              <!-- <i>Address</i> -->
            </td>
            <td>
              <div class="flex flex-wrap">
                <div class="q-mr-sm">: </div>
                <div>{{ pasien?.usia }}</div>
              </div>
            </td>
          </tr>
          <tr valign="top">
            <td width="15%">
              <div>
                Jenis Kelamin
              </div>
              <!-- <i>Address</i> -->
            </td>
            <td>
              <div class="flex flex-wrap">
                <div class="q-mr-sm">: </div>
                <div>{{ pasien?.kelamin }}</div>
              </div>
            </td>
          </tr>
          <tr valign="top">
            <td width="15%">
              <div>
                Alamat
              </div>
            </td>
            <td>
              <div class="flex no-wrap q-gutter-sm">
                <div class=""> : </div>
                <div>{{ pasien?.alamat }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="full-width q-mt-md">
      <div class="" style="text-indent: 20px;">
        Pada Tanggal <span class="text-bold"> {{
          humanDate(store.isisuratkematian?.tgl_meninggal) }}
        </span>
        tepatnya pada jam : <span class="text-bold"> {{
          store.isisuratkematian?.jam_meninggal
          ?? '-' }} WIB </span> ,
        dikarenakan <span class=""> {{ store.isisuratkematian?.alasan_meninggal }} </span> .
      </div>
    </div>
    <div class="full-width">
      <div class="" style="text-indent: 20px;">
        Demikian Surat Keterangan Kematian ini kami terbitkan untuk dapat digunakan
        semestinya dan sebijak-bijaknya
      </div>
    </div>

    <div class="row justify-between q-mt-xl">
      <div class="col-grow"></div>
      <div class="col-auto">
        <div class="column flex-center">
          <div>Probolinggo, Tgl {{ humanDate(store.isisuratkematian?.tgl_meninggal) }}</div>
          <div>Mengetahui</div>
          <div class="q-mb-sm">Dokter, </div>

          <div v-if="store.isisuratkematian?.dokterpenangungjawabpulang?.nama" style="height: 120px;"
            class="relative-position">
            <div class="absolute-center" style="width: 80px;">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
              <!-- <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH"
                style="height: 10px; max-width: 10px" /> -->
            </div>
          </div>
          <div v-else style="height: 80px;" class="relative-position">
            <div class="column flex-center full-height" style="width: 80px;">
              <div>ttd</div>
            </div>
          </div>

          <div class="q-mt-md">
            {{ store.isisuratkematian?.dokterpenangungjawabpulang?.nama || '................................' }}
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>
<script setup>
import { humanDate } from 'src/modules/formatter';
import { usePlannStore } from 'src/stores/simrs/igd/plann';

const store = usePlannStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})


</script>
