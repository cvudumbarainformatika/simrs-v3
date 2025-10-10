<template>
  <q-dialog persistent maximized transition-show="slide-left" transition-hide="fade" @before-show="show()"
    @before-hide="emits('hide')">
    <q-card flat class="fit" style="overflow: hidden;">
      <div class="fit column">
        <q-bar class="col-auto bg-primary text-white q-py-sm">
          <div class="f-12">
            Dokumen BAST
          </div>
          <q-space />

          <q-btn v-close-popup dense flat icon="icon-mat-close" @click="emits('close')">
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>

        <div class="col fit column">
          <div class="col full-height scroll">
            <div class="row justify-end q-ma-sm">
              <q-btn v-print="printObj" round icon="icon-mat-print" dense color="dark" size="md"><q-tooltip
                  class="primary" :offset="[10, 10]">
                  Cetak BAST
                </q-tooltip></q-btn>
              <q-btn color="primary" round size="sm" icon="icon-my-print_setting" @click="tandatangan.setOpen">
                <q-tooltip class="primary" :offset="[10, 10]">
                  Pilih tanda tangan
                </q-tooltip>
              </q-btn>
            </div>
            <div id="printMe">
              <q-card-section>
                <div class="row">
                  <app-kop-surat />
                </div>
                <div class="row justify-center text-weight-bold f-20 q-py-sm">
                  BERITA ACARA SERAH TERIMA BARANG / JASA
                </div>
                <div class="row justify-center q-pb-sm">
                  Nomor : {{ store.item?.no_bast }}
                </div>
                <div class="q-mb-md">
                  Pada hari ini <span class="text-weight-bold text-italic">{{ date.formatDate(store.item?.tanggal,
                    'dddd')
                    }}</span>
                  Tanggal <span class="text-weight-bold text-italic">{{
                    tanggalTerbilang(date.formatDate(store.item?.tanggal, 'DD'))
                  }}</span>
                  Bulan <span class="text-weight-bold text-italic">{{ date.formatDate(store.item?.tanggal, 'MMMM')
                    }}</span>
                  Tahun <span class="text-weight-bold text-italic">{{
                    tahunTerbilang(date.formatDate(store.item?.tanggal,
                      'YYYY'))
                  }}</span>,
                  <!-- tahun <span class="text-weight-bold text-italic">{{ tahunTerbilang('3211') }}</span>, -->
                  bertempat di UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo, kami yang bertanda tangan di bawah ini:
                </div>
                <!-- Pihak pertama start -->
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <div class="row">
                      <div class="col-4" />
                      <div class="col-4">
                        I.
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    Nama
                  </div>
                  <div class="col-7">
                    <app-input v-model="namaSupplier" label="Nama PIC penyedia" :filled="false" class="print-hide" />
                    <div class="print-only">
                      {{ namaSupplier }}
                    </div>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Jabatan
                  </div>
                  <div class="col-7">
                    <app-input v-model="jabatanSupplier" label="Jabatan PIC penyedia" :filled="false"
                      class="print-hide" />
                    <div class="print-only">
                      {{ jabatanSupplier }}
                    </div>
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Instansi / Perusahaan
                  </div>
                  <div class="col-7">
                    {{ store?.item?.penyedia ?? 'Nama perusahaan tidak ditemukan' }}
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Alamat
                  </div>
                  <div class="col-7">
                    {{ store?.item?.alamat_penyedia ?? 'Alamat perusahaan tidak ditemukan' }}
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-11">
                    yang selanjutnya disebut <span class="text-weight-bold">PIHAK PERTAMA.</span>
                  </div>
                </div>
                <!-- Pihak pertama end -->


                <!-- Pihak kedua start -->
                <!-- {{ tandatangan.data.ppk }} -->
                <div class="print-hide text-italic">
                  identitas PPK :
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1">
                    <div class="row">
                      <div class="col-4" />
                      <div class="col-4">
                        II.
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    Nama
                  </div>
                  <div class="col-7">
                    {{ tandatangan?.data?.ppk?.nama }}
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    NIP
                  </div>
                  <div class="col-7">
                    {{ tandatangan?.data?.ppk?.nip_baru === '' ? tandatangan?.data?.ppk?.nip :
                      tandatangan?.data?.ppk?.nip_baru
                    }}
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Jabatan
                  </div>
                  <div class="col-7">
                    {{ tandatangan?.data?.ppk?.relasi_jabatan ? tandatangan?.data?.ppk?.relasi_jabatan?.jabatan :
                      'jabatan tidak ditemukan' }}
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Instansi / Perusahaan
                  </div>
                  <div class="col-7">
                    UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <div class="col-3">
                    Alamat
                  </div>
                  <div class="col-7">
                    Jalan Mayjen Panjaitan No.65, Kota Probolinggo
                  </div>
                </div>
                <div class="fit row no-wrap justify-start items-center q-my-sm">
                  <div class="col-1" />
                  <!-- <div class="col-11">
                    yang ditugaskan sebagai Pejabat Penandatanganan Kontrak berdasarkan Keputusan Direktur UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo Nomor : 100.3/01/KEP/425.102.8/{{ date.formatDate(Date.now(),'YYYY') }} tanggal 02 Januari {{ date.formatDate(Date.now(),'YYYY') }} Tentang Penunjukan dan Pengangkatan Pejabat Penandatangan Kontrak (PPK), Pejabat Teknis Kegiatan (PTK), dan Pembantu PTK Anggaran Badan Layanan Umum Daerah pada UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo Tahun Anggaran {{ date.formatDate(Date.now(),'YYYY') }},
                    yang selanjutnya disebut <span class="text-weight-bold">PIHAK KEDUA.</span>
                  </div> -->
                  <!-- yang ditugaskan sebagai Pejabat Penandatanganan Kontrak berdasarkan Keputusan Direktur UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo Nomor: 100.3/89/KEP/425.102.8/2024 tanggal 31 Desember 2024 Tentang Pejabat Pengelolaan Keuangan dan Barang pada UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo Tahun Anggaran 2025, yang selanjutnya disebut PIHAK KEDUA. -->
                  <div class="col-11">
                    yang ditugaskan sebagai Pejabat Penandatanganan Kontrak berdasarkan Keputusan Direktur UOBK RSUD
                    Dokter
                    Mohamad Saleh Kota Probolinggo Nomor : 100.3/89/KEP/425.102.8/2024 tanggal 31 Desember 2024 Tentang
                    Pejabat Pengelolaan Keuangan dan Barang pada UOBK RSUD Dokter Mohamad Saleh Kota Probolinggo Tahun
                    Anggaran 2025,
                    yang selanjutnya disebut <span class="text-weight-bold">PIHAK KEDUA.</span>
                  </div>
                </div>
                <!-- Pihak kedua end -->
                <div class="print-hide">
                  <app-input v-model="namaRekeningBelanja" class="print-hide" label="nama rekening belanja"
                    :filled="false" />
                </div>

                <div class="q-my-md ">
                  <span class="q-mr-md" /> <span class="text-weight-bold">PIHAK PERTAMA</span> dan <span
                    class="text-weight-bold">PIHAK KEDUA</span> bersepakat dan setuju untuk melaksanakan serah terima
                  hasil
                  pekerjaan
                  <!-- <span class="text-weight-bold">{{ namaRekeningBelanja }}</span> -->
                  yang dijelaskan sebagai berikut:
                </div>
                <div class="row no-wrap q-my-md">
                  <div class="col-shrink text-weight-bold" style="width:20px;">
                    a.
                  </div>
                  <div class="col">
                    <span class="text-weight-bold">PIHAK PERTAMA</span> menyerahkan hasil pekerjaan <span
                      class="text-weight-bold">{{ namaRekeningBelanja }}</span> kepada <span
                      class="text-weight-bold">PIHAK
                      KEDUA</span> sesuai dengan ketentuan yang tercantum dalam Surat Pesanan, dengan rincian sebagai
                    berikut:
                  </div>
                </div>

                <!-- no details -->
                <div v-if="!store.item?.penerimaan?.length">
                  <app-no-data />
                </div>
                <!-- details -->
                <div v-if="store.item?.penerimaan" class="q-mt-md q-px-xs">
                  <!-- header detail -->
                  <div class="row justify-between q-col-gutter-sm">
                    <div style="width: 5%;" class="col-auto text-weight-bold border-tb border-left">
                      No.
                    </div>
                    <div style="width: 60%;" class="col-auto text-weight-bold border-tb border-left">
                      Nama Barang
                    </div>
                    <div style="width: 10%;" class="col-auto text-weight-bold border-tb border-left">
                      Jumlah
                    </div>
                    <div style="width: 10%;" class="col-auto text-weight-bold border-tb border-left">
                      Satuan
                    </div>
                    <div style="width: 15%;" class="col-auto text-weight-bold border-box">
                      Kondisi barang
                    </div>
                  </div>
                </div>
                <!-- body details -->
                <template v-for="(rin, j) in allRinci" :key="j">
                  <div class="row justify-between q-col-gutter-sm q-px-xs">
                    <div style="width: 5%;" class="col-auto text-weight-bold border-bottom border-left">
                      {{ j + 1 }}
                    </div>
                    <div style="width: 60%;" class="col-auto text-weight-bold border-bottom border-left">
                      {{ rin?.masterobat?.nama_obat }}
                    </div>
                    <div style="width: 10%;" class="col-auto text-weight-bold border-bottom border-left">
                      {{ rin?.jml_terima_k }}

                    </div>
                    <div style="width: 10%;" class="col-auto text-weight-bold border-bottom border-left">
                      {{ rin?.satuan_kcl }}

                    </div>
                    <div style="width: 15%;" class="col-auto  border-bottom border-left border-right">
                      Baik Dan Sesuai
                    </div>
                  </div>

                  <q-separator />
                </template>

                <!-- penutup -->
                <div class="row no-wrap q-my-md">
                  <div class="col-shrink text-weight-bold" style="width:20px;">
                    b.
                  </div>
                  <div class="col">
                    <span class="text-weight-bold">PIHAK KEDUA</span> menyatakan menerima hasil sebagaimana tersebut di
                    atas
                    pekerjaan <span class="text-weight-bold">{{ namaRekeningBelanja }}</span> dari <span
                      class="text-weight-bold">PIHAK
                      PERTAMA</span> dalam keadaan baik dan lengkap
                  </div>
                </div>
                <div>
                  <span class="q-mr-md" />Demikian Berita Acara Serah Terima ini dibuat dalam rangkap 2 (dua) untuk
                  dipergunakan sebagaimana mestinya.
                </div>
              </q-card-section>
              <!-- tanda tangan -->
              <q-card-section>
                <div class="row justify-between q-col-gutter-sm ">
                  <div class="col-6 text-center" />
                  <div class="col-6 text-center">
                    Probolinggo, {{ dateFullFormat(store?.item?.tanggal) }}
                  </div>
                </div>
                <!-- options -->
                <div class="row justify-between q-col-gutter-sm print-hide">
                  <div class="col-6 text-center">
                    <app-autocomplete-new v-model="tandatangan.tt.kiri" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan?.optionTT" @on-select="tandatangan?.kiriSelected" />
                  </div>
                  <div class="col-6 text-center">
                    <app-autocomplete-new v-model="tandatangan.tt.kanan" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan?.optionTT" @on-select="tandatangan?.kananSelected" />
                  </div>
                </div>
                <!-- Input -->
                <div class="row justify-between q-col-gutter-sm print-hide">
                  <div class="col-6 text-center">
                    <app-input v-model="tandatangan.kiri" outlined valid label="Text kiri" />
                  </div>
                  <div class="col-6 text-center">
                    <app-input v-model="tandatangan.kanan" outlined valid label="Text kanan" />
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <div class="col-6 text-center">
                    {{ tandatangan?.kiri }}
                  </div>
                  <div class="col-6 text-center">
                    {{ tandatangan?.kanan }}
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm q-mb-xl">
                  <div class="col-6 text-center">
                    {{ tandatangan?.onKiri?.acr }}
                  </div>
                  <div class="col-6 text-center">
                    {{ tandatangan?.onKanan?.acr }}
                  </div>
                </div>
                <div class="row justify-between q-col-gutter-sm">
                  <div class="col-6 text-center">
                    <div v-if="!tandatangan?.onKiri?.ada">
                      <div v-if="tandatangan?.tt?.kiri !== null">
                        <div class="print-hide">
                          <app-input v-model="freeTextKiri" label="Nama" :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ freeTextKiri === '' ? '(.......................................)' : freeTextKiri }}
                        </div>
                      </div>
                    </div>
                    <div v-if="tandatangan?.onKiri?.ada">
                      <div class="row justify-center">
                        {{ tandatangan?.onKiri?.nama }}
                      </div>
                      <div class="row justify-center">
                        {{ tandatangan?.onKiri?.nip }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 text-center">
                    <div v-if="!tandatangan?.onKanan?.ada">
                      <div v-if="tandatangan?.tt?.kanan !== null">
                        <div class="print-hide">
                          <app-input v-model="freeTextKanan" label="Nama" :filled="false" />
                        </div>
                        <div class="print-only">
                          {{ freeTextKanan === '' ? '(.......................................)' : freeTextKanan }}
                        </div>
                      </div>
                    </div>
                    <div v-if="tandatangan.onKanan.ada">
                      <div class="row justify-center">
                        {{ tandatangan.onKanan.nama }}
                      </div>
                      <div class="row justify-center">
                        {{ tandatangan.onKanan.nip }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- option -->
                <div class="row justify-center q-col-gutter-sm print-hide">
                  <div>
                    <app-autocomplete-new v-model="tandatangan.tt.tengah" label="pilih yang berdanda tangan"
                      autocomplete="nama" option-label="nama" option-value="value" outlined valid
                      :source="tandatangan.optionTT" @on-select="tandatangan.tengahSelected" />
                  </div>
                </div>
                <!-- input -->
                <div class="row justify-center q-col-gutter-sm print-hide">
                  <div>
                    <app-input v-model="tandatangan.tengah" outlined valid label="Text Tengah" />
                  </div>
                </div>
                <div class="row justify-center q-col-gutter-sm">
                  <div>{{ tandatangan.tengah }}</div>
                </div>
                <div class="row justify-center q-col-gutter-sm q-mb-xl">
                  <div>{{ tandatangan.onTengah.acr }}</div>
                </div>
                <div v-if="!tandatangan.onTengah.ada">
                  <div v-if="tandatangan.tt.tengah !== null" class="row justify-center">
                    <div class="print-hide">
                      <app-input v-model="freeTextBawah" label="Nama" :filled="false" />
                    </div>
                    <div class="print-only">
                      {{ freeTextBawah === '' ? '(.......................................)' : freeTextBawah }}
                    </div>
                  </div>
                </div>
                <div v-if="tandatangan.onTengah.ada">
                  <div class="row justify-center">
                    {{ tandatangan.onTengah.nama }}
                  </div>
                  <div class="row justify-center">
                    {{ tandatangan.onTengah.nip }}
                  </div>
                </div>
              </q-card-section>
            </div>

          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>


</template>

<script setup>
import { date } from 'quasar'
import { dateFullFormat } from 'src/modules/formatter'
import { useListBastPenerimaanFarmasiStore } from 'src/stores/simrs/farmasi/bast/list'
import { useTandaTanganStore } from 'src/stores/simrs/logistik/sigarang/tantatangan/tandatangan'
import { computed, defineAsyncComponent, ref } from 'vue'

const emits = defineEmits(['close', 'show', 'hide'])



const store = useListBastPenerimaanFarmasiStore()
const tandatangan = useTandaTanganStore()
tandatangan.getInitialData()

const allRinci = computed(() => {
  return store.item?.penerimaan?.flatMap(det => det?.penerimaanrinci || []) || []
})
// tanggal terbilang
function tanggalTerbilang (val) {
  // console.log(val)
  switch (val) {
    case '01':
      return 'Satu'

    case '02':
      return 'Dua'

    case '03':
      return 'Tiga'

    case '04':
      return 'Empat'

    case '05':
      return 'Lima'

    case '06':
      return 'Enam'

    case '07':
      return 'Tujuh'

    case '08':
      return 'Delapan'

    case '09':
      return 'Sembilan'

    case '10':
      return 'Sepuluh'

    case '11':
      return 'Sebelas'

    case '12':
      return 'Dua Belas'

    case '13':
      return 'Tiga Belas'

    case '14':
      return 'Empat Belas'

    case '15':
      return 'Lima Belas'

    case '16':
      return 'Enam Belas'

    case '17':
      return 'Tujuh Belas'

    case '18':
      return 'Delapan Belas'

    case '19':
      return 'Sembilan Belas'

    case '20':
      return 'Dua Puluh'

    case '21':
      return 'Dua Puluh Satu'

    case '22':
      return 'Dua Puluh Dua'

    case '23':
      return 'Dua Puluh Tiga'

    case '24':
      return 'Dua Puluh Empat'

    case '25':
      return 'Dua Puluh Lima'

    case '26':
      return 'Dua Puluh Enam'

    case '27':
      return 'Dua Puluh Tujuh'

    case '28':
      return 'Dua Puluh Delapan'

    case '29':
      return 'Dua Puluh Sembilan'

    case '30':
      return 'Tiga Puluh'

    case '31':
      return 'Tiga Puluh Satu'

    default:
      return ''
  }
}
// tahun terbilang
function tahunTerbilang (val) {
  const temp = val.split('')
  let satuan = ''
  let puluhan = ''
  if (temp[2] === '1') {
    if (temp[3] === '1') {
      puluhan = 'Sebelas'
    }
    else {
      puluhan = bilangan(temp[3])
      satuan = 'belas'
    }
  }
  else {
    puluhan = bilangan(temp[2]) + ' puluh'
    satuan = bilangan(temp[3])
  }
  const ratusan = temp[1] === '1' ? 'Seratus' : temp[1] === '0' ? '' : (bilangan(temp[0]) + ' ratus')
  const ribuan = temp[0] === '1' ? 'Seribu' : temp[0] === '0' ? '' : (bilangan(temp[0]) + ' ribu')
  // console.log('tahun', ribuan, ratusan, puluhan, satuan)
  return ribuan + ' ' + ratusan + ' ' + puluhan + ' ' + satuan
}

// bilangan
function bilangan (val) {
  switch (val) {
    case '1':
      return 'Satu'

    case '2':
      return 'Dua'

    case '3':
      return 'Tiga'

    case '4':
      return 'Empat'

    case '5':
      return 'Lima'

    case '6':
      return 'Enam'

    case '7':
      return 'Tujuh'

    case '8':
      return 'Delapan'

    case '9':
      return 'Sembilan'

    case '0':
      return ''

    default:
      return ''
  }
}


// identitas supplier
const namaSupplier = ref('')
const jabatanSupplier = ref('')

// nama rekening belanja
const namaRekeningBelanja = ref('')

const freeTextKiri = ref('')
const freeTextKanan = ref('')
const freeTextBawah = ref('')
function show () {
  emits('show')
  namaRekeningBelanja.value = store?.item?.belanja ?? ''
}
const printObj = {
  id: 'printMe',
  popTitle: ' '
}
</script>

<style scoped>
.q-table td box {
  white-space: normal !important;
  inline-size: 100px;
  overflow-wrap: break-word;
}

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: normal !important;
}

.print {
  position: absolute;
  right: 30px;
  top: 5px;
  z-index: 10;
}

.garis-bawah {
  border-bottom: 6px solid black;
  border-bottom-style: double;
}

.border-box {
  border: 1px solid black;
}

.border-tb {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.border-left {
  border-left: 1px solid black;
}

.border-right {
  border-right: 1px solid black;
}

.border-bottom {
  border-bottom: 1px solid black;
}
</style>
