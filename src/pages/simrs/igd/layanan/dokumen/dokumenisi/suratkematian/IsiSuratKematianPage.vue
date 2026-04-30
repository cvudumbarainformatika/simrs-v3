<template>
  <div class="contentx">
    <div class="f-16 text-center text-bold q-mb-xs" style="text-decoration: underline; text-underline-offset: 5px;">
    </div>
    <div class="f-12 text-center text-bold q-my-sm">
      <span>NOMOR : <span>{{ plannkematian?.nosurat ||
        '472.12/......../425.208/KEM/..../20....'
          }}</span></span>
    </div>

    <div class="full-width q-mt-lg">
      <div>Yang bertanda tangan di bawah ini :</div>

      <div class="q-mt-sm q-ml-md">
        <div class="row no-wrap q-mb-xs">
          <div class="col-3">Nama Dokter</div>
          <div class="col-1">:</div>
          <div class="col">{{ plannkematian?.dokterpenangungjawabpulang?.nama ?? '-' }}</div>
        </div>
        <div class="row no-wrap q-mb-xs">
          <div class="col-3">Pangkat / Gol</div>
          <div class="col-1">:</div>
          <div class="col">
            {{ plannkematian?.dokterpenangungjawabpulang?.golruang ?? '' }}
            {{ plannkematian?.dokterpenangungjawabpulang?.golruang ? ' / ' : '' }}
            {{ plannkematian?.dokterpenangungjawabpulang?.keterangan ?? '-' }}
          </div>
        </div>
        <div class="row no-wrap">
          <div class="col-3">Jabatan</div>
          <div class="col-1">:</div>
          <div class="col">{{ plannkematian?.dokterpenangungjawabpulang?.jabatan ?? '-' }}</div>
        </div>
      </div>
    </div>

    <div class="q-mt-sm">Menyatakan bahwa :</div>
    <div><span class="text-bold">TELAH MENINGGAL DUNIA</span>, Saudara :</div>

    <div class="full-width q-ml-lg q-mt-sm">
      <div class="row no-wrap q-mb-xs">
        <div class="col-2">Nama Lengkap</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ pasien?.nama ?? '-' }}</div>
      </div>
      <div class="row no-wrap q-mb-xs">
        <div class="col-2">Nomor KTP</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ pasien?.nktp ?? '-' }}</div>
      </div>
      <div class="row no-wrap q-mb-xs">
        <div class="col-2">Umur</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ pasien?.usia ?? '-' }}</div>
      </div>
      <div class="row no-wrap q-mb-xs">
        <div class="col-2">Jenis Kelamin</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ pasien?.kelamin ?? '-' }}</div>
      </div>
      <div class="row no-wrap">
        <div class="col-2">Alamat</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ pasien?.alamat ?? '-' }}</div>
      </div>
    </div>

    <div class="full-width q-mt-md">
      <div style="text-indent: 20px; line-height: 1.7;">
        Pada Tanggal <span class="text-bold"> {{
          humanDate(plannkematian?.tgl_meninggal) }}
        </span>
        tepatnya pada jam : <span class="text-bold"> {{
          plannkematian?.jam_meninggal
          ?? '-' }} WIB </span> ,
        dikarenakan <span class=""> {{ plannkematian?.alasan_meninggal }} </span> .
      </div>
    </div>
    <div class="full-width">
      <div style="text-indent: 20px; line-height: 1.7;">
        Demikian Surat Keterangan Kematian ini kami terbitkan untuk dapat digunakan
        semestinya dan sebijak-bijaknya
      </div>
    </div>

    <div class="row q-mt-xl">
      <div class="col-5 q-ml-auto q-mr-xl">
        <div class="column flex-center">
          <div>Probolinggo, Tgl {{ humanDate(plannkematian?.tgl_meninggal) }}</div>
          <div>Mengetahui</div>
          <div class="q-mb-sm">Dokter,</div>

          <div class="column flex-center q-mt-md">
            <div style="width: 100px;">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
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
import { computed } from 'vue'
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
  },
  plannkematian: {
    type: Object,
    default: null
  },
})

const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  // const enc = btoa(`${petugas}`)
  // return `${enc}`

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SURAT-KEMATIAN.png'
  const asal = 'RAWAT JALAN'
  const petugas = props?.pasien?.kddokter ?? props?.pasien?.kodedokter ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})



</script>
