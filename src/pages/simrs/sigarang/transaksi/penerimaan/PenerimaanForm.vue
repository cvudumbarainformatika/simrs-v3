<template>
  <div class="q-pt-sm q-pb-lg-xl">
    <app-card
      title="Form Penerimaan"
      desc="Form Penerimaan Barang"
    >
      <template #content>
        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-md-12 col-xs-12">
            <div class="row q-col-gutter-md q-mb-sm items-center text-weight-bold">
              <div class="col-md-2 col-xs-12">
                Nomor Penerimaan
              </div>
              <div class="col-md-9 col-xs-12 text-red">
                <app-input
                  v-model="store.form.no_penerimaan"
                  autofocus
                  label="Nomor Penerimaan"
                  label-color="red"
                  outlined
                  hint="SESUAIKAN NOMOR PENERIMAAN"
                  dense
                  disable
                  :loading="store.loadingJumlah"
                />
                <!-- bg-color="red-2" -->
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xs-12">
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-md-4 col-xs-12">
                Tanggal
              </div>
              <div class="col-md-6 col-xs-12">
                <div class="fit row no-wrap justify-end items-center">
                  <div>
                    {{ store.tanggalTampil }}
                  </div>
                  <div class="q-ml-sm">
                    <q-btn
                      icon="icon-mat-event"
                      round
                      dense
                      color="primary"
                    >
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                        @show="updateProxy"
                      >
                        <q-date
                          ref="refDate"
                          v-model="store.form.tanggal"
                          mask="YYYY-MM-DD"
                          :options="dateOption"
                          @update:model-value="store.setTanggal"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-md-4 col-xs-12">
                Penyedia
              </div>
              <div class="col-md-6 col-xs-12">
                {{ store.form.namaPerusahaan ? store.form.namaPerusahaan : '-' }}
              </div>
            </div>
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-md-4 col-xs-12">
                Nomor Kontrak
              </div>
              <div class="col-md-6 col-xs-12">
                {{ store.form.kontrak ? store.form.kontrak : '-' }}
              </div>
            </div>
            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Status penerimaan
              </div>
              <div class="col-md-6 col-xs-12">
                <app-autocomplete-new
                  v-model="store.form.status_pembelian"
                  :valid="statusPembelian"
                  outlined
                  label="Status Penerimaan*"
                  autocomplete="nama"
                  option-value="id"
                  :loading="store.loading"
                  option-label="nama"
                  :source="store.statuses"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Nomor Pemesanan
              </div>
              <div class="col-md-6 col-xs-12">
                <app-autocomplete-new
                  :model="store.form.id"
                  :valid="pemesanan"
                  outlined
                  label="cari nomor pemesanan*"
                  autocomplete="nomor"
                  option-label="nomor"
                  option-value="id"
                  :loading="store.loading"
                  :source="store.pemesanans"
                  @buang="store.setSearch"
                  @on-select="store.pemesananSelected"
                  @clear="clearPemesanan"
                />
                <!-- </div> -->
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Pengirim
              </div>
              <div class="col-md-6 col-xs-12">
                <app-input
                  ref="refPengirim"
                  v-model="store.form.pengirim"
                  input-class="text-left"
                  :valid="pengirim"
                  label="Nama Pengirim*"
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xs-12">
            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Tanggal Surat Jalan
              </div>
              <div class="col-md-6 col-xs-12">
                <app-input-date
                  ref="refTanggalSurat"
                  :model="store.form.tanggal_surat"
                  icon="icon-mat-event"
                  outlined
                  label="Tanggal*"
                  @set-model="setSurat"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Nomor Surat Jalan
              </div>
              <div class="col-md-6 col-xs-12">
                <app-input
                  ref="refNomorSurat"
                  v-model="store.form.surat_jalan"
                  input-class="text-left"
                  label="Nomor Surat*"
                  outlined
                />
                <!-- @update:model-value="store.inputSurat" -->
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Tanggal Faktur
              </div>
              <div class="col-md-6 col-xs-12">
                <app-input-date
                  ref="refTanggalFaktur"
                  :model="store.form.tanggal_faktur"
                  icon="icon-mat-event"
                  outlined
                  label="Tanggal*"
                  @set-model="setFaktur"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Nomor Faktur
              </div>
              <div class="col-md-6 col-xs-12">
                <app-input
                  ref="refNomorFaktur"
                  v-model="store.form.faktur"
                  input-class="text-left"
                  label="Nomor Faktur*"
                  outlined
                />
                <!-- @update:model-value="store.inputSurat" -->
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-sm items-center">
              <div class="col-md-4 col-xs-12">
                Batas Akhir Pembayaran (tempo)
              </div>
              <div class="col-md-6 col-xs-12">
                <app-input-date
                  ref="refTempo"
                  :model="store.form.tempo"
                  icon="icon-mat-event"
                  outlined
                  label="Tempo"
                  @set-model="setModel"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="store.detailPemesanans?.length">
          <div class="row q-col-gutter-md q-mb-sm text-weight-bold items-center bdb">
            <div class="col-md-3 col-xs-12">
              Nama Barang
            </div>
            <div class="col-md-1 col-xs-12">
              Satuan
            </div>
            <div class="col-md-1 col-xs-12">
              Harga
            </div>
            <div class="col-md-1 col-xs-12">
              Pemesanan
            </div>
            <div class="col-md-1 col-xs-12">
              Diterima Sekarang
            </div>
            <div class="col-md-2 col-xs-12">
              Sub Total
            </div>
            <div class="col-md-1 col-xs-12">
              Diterima Sebelumnya
            </div>
            <div class="col-md-2 col-xs-12">
              Seluruh Penerimaan
            </div>
            <!-- <div class="col-md-2 col-xs-12">
              Sub Total
            </div> -->
          </div>
          <div
            v-for="(item, i) in store.detailPemesanans"
            :key="i"
          >
            <div class="row q-col-gutter-md items-center bdb anu">
              <div class="col-md-3 col-xs-12">
                {{ item.barangrs?item.barangrs.nama:'-' }}
              </div>
              <div class="col-md-1 col-xs-12">
                {{ item.satuan?item.satuan.nama:'-' }}
              </div>
              <div class="col-md-1 col-xs-12 cursor-pointer">
                {{ formatRp(item.harga) }}
                <q-popup-edit
                  v-if="item.qty!==item.qtysblm"
                  v-slot="scope"
                  v-model="item.harga"
                  :validate="validasiharga"
                  @show="initHarga(item)"
                  @before-hide="hideHarga"
                  @save="saveHarga"
                >
                  <q-input
                    ref="refHarga"
                    v-model="scope.value"
                    :error="errorHarga"
                    :error-message="errMessageHarga"
                    dense
                    autofocus
                    type="number"
                    counter
                    :loading="store.loadingJumlah"
                    :disable="store.loadingJumlah"
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </div>
              <div class="col-md-1 col-xs-12">
                <div
                  v-if="(parseFloat( item.qtysblm) + parseFloat(item.qtyskr)===parseFloat(item.qty))"
                >
                  <q-chip
                    color="green"
                    text-color="white"
                    class="chip-able"
                    dense
                    square
                    outline
                  >
                    <div>
                      {{ item.qty }}
                    </div>
                  </q-chip>
                </div>
                <div v-if="!(parseFloat( item.qtysblm) + parseFloat(item.qtyskr)===parseFloat(item.qty))">
                  <q-chip
                    color="grey"
                    text-color="white"
                    class="chip-able"
                    dense
                    square
                    outline
                  >
                    <div>
                      {{ item.qty }}
                    </div>
                  </q-chip>
                </div>
              </div>
              <div class="col-md-1 col-xs-12">
                <div class="bold cursor-pointer">
                  {{ item.qtyskr }}
                  <q-popup-edit
                    v-if="item.qty!==item.qtysblm"
                    v-slot="scope"
                    v-model="item.qtyskr"
                    :validate="validate"
                    @show="init(item)"
                    @before-hide="hideQty"
                    @save="save"
                  >
                    <q-input
                      ref="refqty"
                      v-model="scope.value"
                      :error="error"
                      :error-message="errMessage"
                      type="number"
                      dense
                      autofocus
                      counter
                      :loading="store.loadingJumlah"
                      :disable="store.loadingJumlah"
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                  <q-tooltip
                    v-else
                    transition-show="jump-up"
                    transition-hide="jump-down"
                  >
                    jumlah penerimaan sudah sesuai
                    jumlah pemesanan
                  </q-tooltip>
                </div>
              </div>
              <div class="col-md-2 col-xs-12">
                {{ formatDouble(parseFloat(item.qtyskr) * parseFloat(item.harga)) }}
              </div>
              <div class="col-md-1 col-xs-12">
                {{ item.qtysblm }}
              </div>
              <div class="col-md-2 col-xs-12">
                {{ parseFloat( item.qtysblm) + parseFloat(item.qtyskr) }}
              </div>
              <!-- <div class="col-md-2 col-xs-12">
                {{ formatRp((parseFloat( item.qtysblm) +
                  parseFloat(item.qtyskr)) * item.harga) }}
              </div> -->
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-sm q-mt-md">
            <div class="col-md-10 col-xs-12" />
            <!-- <div class="col-md-1 col-xs-12">
              <app-btn label="Batal" color="dark" @click="onBatal" />
            </div> -->
            <div class="col-md-1 col-xs-12">
              <app-btn
                label="Selesai"
                :loading="store.loadingSimpan || store.loadingJumlah"
                :disable="store.loadingSimpan || store.loadingJumlah"
                @click="onSimpan"
              />
            </div>
          </div>
        </div>
      </template>
    </app-card>
  </div>
</template>
<script setup>
import { dateFullFormat, formatRp, formatDouble } from 'src/modules/formatter'
import { ref } from 'vue'
import { notifNegativeCenterVue } from 'src/modules/utils'
import { useTransaksiPenerimaanForm } from 'src/stores/simrs/logistik/sigarang/transaksi/penerimaan/form'
import { date } from 'quasar'

const store = useTransaksiPenerimaanForm()
store.setNomorPenerimaan()
store.setToday()

// date options start ----
const today = new Date()
const lastDay = date.formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'YYYY/MM/DD')
const firstDay = date.formatDate(Date.now(), 'YYYY/MM/01')
function dateOption(val) {
  return val >= firstDay && val <= lastDay
}
// date options end ----
const proxyDate = ref(null)
const refDate = ref(null)
const refqty = ref(null)
const refHarga = ref(null)
const updateProxy = () => {
  // console.log('date', store.form.tanggal)
  // refDate.value.setToday()
  proxyDate.value = store.form.tanggal ? store.form.tanggal : date.formatDate(Date.now(), 'YYYY/MM/DD')
  store.setForm('tanggal', proxyDate.value)
  store.tanggalTampil = dateFullFormat(proxyDate.value)
}

const setModel = val => {
  store.setForm('tempo', val)
  // console.log('tempo', val)
}

const setSurat = val => {
  store.setForm('tanggal_surat', val)
}
const setFaktur = val => {
  store.setForm('tanggal_faktur', val)
}

const clearPemesanan = () => {
  store.setForm('reff', null)
  store.deleteForm('namaPerusahaan')
  store.deleteForm('kontrak')
  store.clearNomorPemesanan()
}

// const beforesave = val => {
//   console.log(val)
//   error.value = true
//   // return val.set
// }

const errorHarga = ref(false)
const errMessageHarga = ref('')
const error = ref(false)
const errMessage = ref('')
const terimaSebelum = ref(null)
const pesanan = ref(null)
// simpan harga
function saveHarga(val) {
  if (!store.form.qty) {
    return notifNegativeCenterVue('Isi Jumlah penerimaan terlebih dahulu')
  }
  store.setForm('harga', val)
  store.setForm('total', parseFloat(val) * parseFloat(store.form.qty))
  store.setForm('sub_total', parseFloat(val) * parseFloat(store.form.qty))
  store.setForm('statuspemesanan', 3)
  console.log('masih lanjut coy', store.form)
  const valid = validasi()
  if (!valid) { simpanDetail() }
}
// simpan jumlah
const save = val => {
  // if ((parseFloat(val) + terimaSebelum.value) > pesanan.value) return notifNegativeCenterVue('Jumlah input melebihi jumlah pemesanan')
  store.setForm('qty', val)
  store.setForm('total', parseFloat(val) * parseFloat(store.form.harga))
  store.setForm('sub_total', parseFloat(val) * parseFloat(store.form.harga))
  store.setForm('statuspemesanan', 3)
  const valid = validasi()
  // if ((parseFloat(val) + parseFloat(terimaSebelum.value)) < parseFloat(pesanan.value)) {
  //   store.setForm('stasuspemesanan', 3)
  // } else {
  //   store.setForm('stasuspemesanan', 4)
  // }
  // console.log('sebelum', parseFloat(val), pesanan.value, terimaSebelum.value)
  // console.log('save', store.form)
  if (!valid) { simpanDetail() }
}

const initHarga = val => {
  // console.log('ref', refHarga.value[0])
  // console.log('form', store.form)
  refHarga.value[0].focus()
  refHarga.value[0].select()
  if (store.form.harga) {
    val.harga = store.form.harga
  }
  store.setForm('harga', store.form.harga ? store.form.harga !== val.harga ? store.form.harga : store.form.harga : val.harga)
  console.log('init harga form', store.form)
}
function hideHarga() {
  // console.log('ref', refHarga.value[0])
  refHarga.value[0].blur()
}
const init = val => {
  terimaSebelum.value = val.qtysblm
  pesanan.value = val.qty
  store.setForm('kode_rs', val.kode_rs)
  store.setForm('kode_108', val.kode_108)
  store.setForm('kode_satuan', val.kode_satuan)
  store.setForm('harga', store.form.harga ? (store.form.harga !== val.harga ? val.harga : store.form.harga) : val.harga)
  store.setForm('nama_barang', val.nama_barang)
  store.setForm('uraian_108', val.uraian_108)
  store.setForm('uraian_50', val.uraian_50)
  store.setForm('kode_50', val.kode_50)
  store.setForm('satuan_besar', val.satuan_besar)
  store.setForm('satuan_kecil', val.satuan_kecil)
  store.setForm('isi', val.isi)

  // console.log('refqty', refqty.value[0])
  refqty.value[0].focus()
  refqty.value[0].select()
  // store.setForm('total', val.harga * kuantiti.value)
  // store.setForm('qty', kuantiti.value)
  console.log('init', val)
  console.log('init form', store.form)
}
function hideQty() {
  refqty.value[0].blur()
}

// validasi
const pemesanan = ref(false)
const pengirim = ref(false)
const pilihSurat = ref(false)
const surat = ref(false)
// const faktur = ref(false)
// const tempo = ref(true)
const statusPembelian = ref(false)
const tglSurat = ref(false)

const refPengirim = ref(null)
const refTempo = ref(null)
const refTanggalSurat = ref(null)
const refNomorSurat = ref(null)
const refNomorFaktur = ref(null)
const refTanggalFaktur = ref(null)
// const diterima = ref(false)
const validasiharga = val => {
  console.log('jumlah', !store.form.qty)
  if (!store.form.qty) {
    errorHarga.value = true
    errMessageHarga.value = ('Isi Jumlah penerimaan terlebih dahulu')
    return false
  }
  // console.log('if', false)
  errorHarga.value = false
  errMessageHarga.value = ''
  return true
}
const validate = val => {
  console.log('validasi', pesanan.value)
  // const apem = validasi()
  // console.log('validasi', apem)
  if ((parseFloat(val) + terimaSebelum.value) > pesanan.value || validasi()) {
    // console.log('pesanan', pesanan.value)
    // console.log('dibanding', parseFloat(val) + terimaSebelum.value)
    // console.log('if', (val + terimaSebelum.value) > pesanan.value)
    error.value = true
    errMessage.value = (parseFloat(val) + terimaSebelum.value) > pesanan.value ? 'Jumlah input melebihi jumlah pemesanan' : 'periksa kembali input anda yang lain'
    return false
  }
  // console.log('if', false)
  error.value = false
  errMessage.value = ''
  return true
}

const validasi = (val) => {
  const form = store.form
  pemesanan.value = !!form.nomor
  pengirim.value = !!form.pengirim
  statusPembelian.value = !!form.status_pembelian
  pilihSurat.value = !!(form.surat_jalan || form.faktur)
  surat.value = !!form.surat
  tglSurat.value = !!form.tanggal_surat
  // console.log('pilih surat', pilihSurat.value)
  if (refNomorFaktur.value.$refs.refInput.modelValue) {
    refTanggalFaktur.value.$refs.refInputDate.validate()
    refTempo.value.$refs.refInputDate.validate()
    refNomorFaktur.value.$refs.refInput.validate()
    // reset validation
    refNomorSurat.value.$refs.refInput.resetValidation()
    refTanggalSurat.value.$refs.refInputDate.resetValidation()
  } else if (refNomorSurat.value.$refs.refInput.modelValue) {
    refNomorSurat.value.$refs.refInput.validate()
    refTanggalSurat.value.$refs.refInputDate.validate()
    // reset validation
    refTanggalFaktur.value.$refs.refInputDate.resetValidation()
    refTempo.value.$refs.refInputDate.resetValidation()
    refNomorFaktur.value.$refs.refInput.resetValidation()
  } else {
    refTanggalFaktur.value.$refs.refInputDate.validate()
    refTempo.value.$refs.refInputDate.validate()
    refNomorFaktur.value.$refs.refInput.validate()
    refNomorSurat.value.$refs.refInput.validate()
    refTanggalSurat.value.$refs.refInputDate.validate()
  }
  refPengirim.value.$refs.refInput.validate()
  // diterima.value = !!form.qty
  // console.log(
  // refPengirim.value.$refs,
  // refPengirim.value.$refs.refInput,
  // 'diterima', diterima.value,
  // 'pemesanan', pemesanan.value,
  // 'pengirim', pengirim.value,
  // 'status pembelian', statusPembelian.value,
  // 'pilih surat', pilihSurat.value
  // 'surat', surat.value,
  // 'tanggal surat', tglSurat.value
  // )
  // cek ref
  const referens = !(store.form.reff < 5)
  const noTrm = store.form.no_penerimaan !== '000.3.2/02.0/.../BAST-../1.02.2.14.0.00.03.0301/..bulan../' + date.formatDate(Date.now(), 'YYYY')
  if (!pemesanan.value || !pengirim.value || !statusPembelian.value || !pilihSurat.value) {
    // if (!diterima.value) {
    //   notifNegativeCenterVue('Anda belum memasukkan jumlah barang diterima')
    // } else {
    notifNegativeCenterVue('periksa kembali input anda')
    return true
    // }
  } else {
    if (!referens || !noTrm) {
      if (!referens) {
        notifNegativeCenterVue('No referensi salah, silahkan referesh terlebih dahulu')
        return true
      } else if (!noTrm) {
        notifNegativeCenterVue('No Penerimaan salah, silahkan pilih kembali nomor pemesanan')

        return true
      }
    } else {
      return false
    }
  }
}
const resetValidation = () => {
  refTanggalFaktur.value.$refs.refInputDate.resetValidation()
  refTempo.value.$refs.refInputDate.resetValidation()
  refNomorFaktur.value.$refs.refInput.resetValidation()
  refNomorSurat.value.$refs.refInput.resetValidation()
  refTanggalSurat.value.$refs.refInputDate.resetValidation()
  // model val
  // refTanggalFaktur.value.$refs.refInputDate.resetValidation()
  // refTempo.value.$refs.refInputDate.resetValidation()
  // refNomorFaktur.value.$refs.refInput.resetValidation()
  // refNomorSurat.value.$refs.refInput.resetValidation()
  // refTanggalSurat.value.$refs.refInputDate.resetValidation()
}
const onSimpan = () => {
  const ada = store.detailPemesanans.map(data => {
    let temp = 0
    if (data.qtyskr > 0) { temp = data }
    return temp
  }).reduce((s, y) => { return s + y })
  // console.log('ada', ada)
  const total = store.detailPemesanans.map(data => {
    // console.log(data)
    return parseFloat(data.qtyskr) * parseFloat(data.harga)
  }).reduce((x, y) => x + y)
  // console.log('total', total)
  if (ada === 0) return notifNegativeCenterVue('tidak ada data penerimaan tersimpan, periksa kembali data penerimaan anda')
  const temp = store.detailPemesanans.map(data => {
    let status = null
    if (parseFloat(data.qty) === (parseFloat(data.qtysblm) + parseFloat(data.qtyskr))) { status = 4 } else { status = 3 }
    // console.log(data)
    return status
  }).reduce((x, y) => x + y) / store.detailPemesanans?.length
  const statuspemesanan = Math.floor(temp)
  // console.log('satatuspemesanan', statuspemesanan)
  store.setForm('statuspemesanan', statuspemesanan)
  store.setForm('status', 2)
  if (total > 0) {
    store.setForm('total', total)
  } else {
    store.deleteForm('total')
  }
  // store.setForm('total', total)
  store.deleteForm('harga')
  store.deleteForm('sub_total')
  store.deleteForm('qty')
  store.deleteForm('kode_rs')
  // console.log('simpan', store.form)
  const valid = validasi()
  if (!valid) {
    simpanDetail()
    resetValidation()
  }
}

const simpanDetail = () => {
  // console.log('simpan deatail', store.form)
  store.simpanTransaksi().then(() => {
    if (store.form.status && store.form.status === 2) {
      store.resetForm()
    }
  })
}

// const onBatal = () => {
//   console.log('batal')
// }
// cari
</script>
<style lang="scss" scoped>
.border-box{
  border: 1px solid black;
}
.bdt{
  border-top: 1px solid black;
}
.bdl{
  border-left: 1px solid black;
}
.bdr{
  border-right: 1px solid black;
}
.bdb{
  border-bottom: 1px solid black;
}
.anu:hover{
  background-color: #87e9df;
  margin-top: 0px;
}

</style>
