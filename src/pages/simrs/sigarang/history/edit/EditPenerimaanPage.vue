<template>
  <q-dialog>
    <q-card
      style="width:80vw; max-width:95vw;"
    >
      <q-card-section>
        <div class="f-16 text-weight-bold q-mb-sm">
          Edit Penerimaan
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <!-- header -->
        <div class="row items-center q-col-gutter-sm">
          <div class="col-6">
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Perusahaan
              </div>
              <div class="col-9 text-weight-bold">
                {{ store.item.perusahaan?store.item.perusahaan.nama:'-' }}
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Kontrak
              </div>
              <div class="col-9 text-weight-bold">
                {{ store.item.kontrak }}
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Nomor Pemesanan
              </div>
              <div class="col-9">
                <!-- <app-input
                  v-model="store.form.nomor"
                  label="Nomor Pemesanan"
                  outlined
                  debounce="1000"
                  @update:model-value="gantiNomorPesanan"
                /> -->
                {{ store.form.nomor }}
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Nomor Penerimaan
              </div>
              <div class="col-9">
                {{ store.form.no_penerimaan }}
                <!-- <div v-if="!store.loadingNoPenerimaan">
                  <app-input
                    v-model="store.form.no_penerimaan "
                    label="Nomor Penerimaan"
                    outlined
                  />
                </div>
                <div v-if="store.loadingNoPenerimaan">
                  <q-btn
                    flat
                    loading
                  />
                </div> -->
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Pengirim
              </div>
              <div class="col-9">
                <!-- {{ store.form.pengirim }} -->
                <app-input
                  v-model="store.form.pengirim "
                  label="Pengirim"
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Tanggal Transaksi
              </div>
              <div class="col-9">
                <!-- {{ store.form.tanggal }} -->
                <app-input-date-human
                  :model="store.display.tanggal"
                  label="Tanggal"
                  outlined
                  @set-model="setModel"
                  @set-display="setDisplay"
                />
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Surat Jalan
              </div>
              <div class="col-9">
                <!-- {{ store.form.surat_jalan }} -->
                <app-input
                  v-model="store.form.surat_jalan "
                  label="Nomor Surat jalan"
                  outlined
                />
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Tanggal Surat Jalan
              </div>
              <div class="col-9">
                <!-- {{ store.form.tanggal_surat }} -->
                <app-input-date-human
                  :model="store.display.tanggal_surat"
                  label="Tanggal"
                  outlined
                  @set-model="setTglSuratjalan"
                  @set-display="setDispTglSuratjalan"
                />
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Faktur
              </div>
              <div class="col-9">
                <!-- {{ store.form.faktur }} -->
                <app-input
                  v-model="store.form.faktur "
                  label="Nomor Faktur"
                  outlined
                />
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Tanggal Faktur
              </div>
              <div class="col-9">
                <!-- {{ store.form.tempo }} -->
                <app-input-date-human
                  :model="store.display.tanggal_faktur"
                  label="Tanggal Faktur"
                  outlined
                  @set-model="setTglFaktur"
                  @set-display="setDispTglFaktur"
                />
              </div>
            </div>
            <div class="row q-mb-sm items-center">
              <div class="col-3">
                Tempo
              </div>
              <div class="col-9">
                <!-- {{ store.form.tempo }} -->
                <app-input-date-human
                  :model="store.display.tempo"
                  label="Tanggal"
                  outlined
                  @set-model="setTempo"
                  @set-display="setDispTempo"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mr-md items-center">
          <div class="col-2">
            Status Pemesanan
          </div>
          <div class="col-2">
            <q-chip
              class="f-12"
              :color="color(store.item.statuspesanan)"
              text-color="white"
              :label="label(store.item.statuspesanan,'PEMESANAN')"
            />
            <!-- {{ store.item.statuspesanan }} -->
          </div>
          <div class="col-8 text-right">
            <app-btn
              label="Simpan Perubahan Header Transaksi"
              :loading="store.loading"
              :disable="store.loading"
              @click="store.simpanHeader"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <!-- details -->
      <q-card-section>
        <div
          v-if="!store.item.details?.length"
          style="height:300px"
        >
          <app-no-data />
        </div>
        <div v-if="store.item.details?.length">
          <!-- header -->
          <div class="row text-weight-bold q-col-gutter-sm q-mb-sm q-mt-sm">
            <div class="col-1 btb bl">
              Kode Barang
            </div>
            <div class="col-3 btb bl">
              Nama barang
            </div>
            <div class="col-1 btb bl">
              Harga
            </div>
            <div class="col-3 bt bl bb no-padding">
              <div
                class="row "
                style="height:26px;"
              >
                <div class="col-3">
                  Pesan
                </div>
                <div class="col-3  bl">
                  Terima
                </div>
                <div class="col-4  bl">
                  Subtotal
                </div>
                <div class="col-2  bl">
                  Dist
                </div>
              </div>
            </div>
            <div class="col-1 btb bl">
              Satuan
            </div>
            <div class="col-2 btb bl">
              Keterangan
            </div>
            <div class="col-1 btb bl br">
              Aksi
            </div>
          </div>
          <!-- data -->
          <div
            v-for="(detail,i) in store.item.details"
            :key="i"
          >
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-1 bb bl">
                <div class="row">
                  <div class="text-weight-bold col-3">
                    {{ i+1 }}.
                  </div>
                  <div class="col-9">
                    {{ detail.barangrs?detail.barangrs.kode:'-' }}
                  </div>
                </div>
              </div>
              <div class="col-3 bb bl">
                {{ detail.barangrs?detail.barangrs.nama:'-' }}
              </div>
              <div class="col-1 bb bl">
                <div v-if="detail.edit">
                  <app-input
                    ref="refHarga"
                    v-model="detail.harga"
                    label="harga"
                    outlined
                    :loading="store.loadingUpdateDetail"
                    @focus="beforeUpdateHarga(detail,i)"
                    @blur="updateHarga(detail,i)"
                    @update:model-value="updateModelHarga"
                    @keyup.enter="updateHarga(detail,i)"
                  />
                </div>
                <div
                  v-if="!detail.edit"
                  class="text-right"
                >
                  {{ formatRpDouble(detail.harga) }}
                </div>
              </div>
              <div class="col-3 bl bb no-padding">
                <div
                  class="row items-center"
                  style="height:26px;"
                >
                  <div class="col-3">
                    <div :class="detail.qty!==detail.dipesan?'text-weight-bold text-grey':''">
                      {{ detail.dipesan?detail.dipesan:'-' }}
                    </div>
                  </div>
                  <div class="col-3">
                    <div v-if="detail.edit">
                      <app-input
                        ref="jmlTrm"
                        v-model="detail.qty"
                        label="diterima"
                        outlined
                        :loading="store.loadingUpdateDetail"
                        @focus="beforeUpdateJumlah(detail,i)"
                        @blur="updateJumlah(detail,i)"
                        @update:model-value="updateModelJumlah"
                        @keyup.enter="updateJumlah(detail,i)"
                      />
                    </div>
                    <div
                      v-if="!detail.edit"
                      :class="detail.qty!==detail.dipesan?'text-weight-bold text-negative':''"
                    >
                      {{ detail.qty }}
                    </div>
                  </div>
                  <div class="col-4">
                    {{ detail.sub_total?formatDouble(detail.sub_total):'-' }}
                  </div>
                  <div class="col-2">
                    {{ detail.distribusi?detail.distribusi:'-' }}
                  </div>
                </div>
              </div>
              <div class="col-1 bb bl">
                {{ detail.satuan?detail.satuan.nama:'-' }}
              </div>
              <div class="col-2 bb bl">
                {{ detail.merk }}
              </div>
              <div
                v-if="store.loadingDetailPemesanan"
                class="col-1 bb bl br"
              >
                <q-btn
                  v-if="store.loadingDetailPemesanan"
                  size="sm"
                  loading
                  dense
                  style="min-width:25px"
                  color="primary"
                  flat
                >
                  <template #loading>
                    <q-spinner-hourglass
                      class="on-left"
                      size="18px"
                    />
                  </template>
                </q-btn>
              </div>
              <div
                v-if="!store.loadingDetailPemesanan"
                class="col-1 bb bl br"
              >
                <!-- <div v-if="detail.diterima===null || detail.diterima===0 || !detail.diterima"> -->

                <div v-if="!detail.edit">
                  <q-btn
                    color="primary"
                    round
                    icon="icon-mat-edit"
                    flat
                    size="sm"
                    @click="editRow(detail,i)"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="center middle"
                    >
                      Edit
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="!detail.distribusi"
                    color="negative"
                    round
                    icon="icon-mat-delete_sweep"
                    flat
                    size="sm"
                    @click="hapus(detail,i)"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="center middle"
                    >
                      Hapus
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-7">
              Total
            </div>
            <div class="col-5 text-weight-bold">
              {{ formatRpDouble( store.item.total) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { date, Dialog } from 'quasar'
import { formatRpDouble, formatDouble } from 'src/modules/formatter'
// import { notifCenterVue } from 'src/modules/utils'
import { useEditPenerimaanStore } from 'src/stores/simrs/logistik/sigarang/history/edit/penerimaan'
import { ref } from 'vue'

/**
  edit pemesanan meliputi:
  * edit Faktur
  * pecah Faktur
  * edit nomor pemesananan
  * edit nomor BAST (berpengaruh pada tabel recent stok update)
  * edit jumlah penerimaan
  * hapus penerimaan (termasuk data di gudang jika masih belum di distribusikan)
  * hapus detail penerimaan (termasuk data di gudang jika masih belum di distribusikan)
 */
const store = useEditPenerimaanStore()
// function gantiNomorPesanan(val) {
//   // store.params.nomor = val
//   console.log('nomor pemesanan', val)
//   store.getJumlahNomorPenerimaan(val)
//   console.log('form', store.form)
// }
function setModel(val) {
  store.setForm('tanggal', date.formatDate(val, 'YYYY-MM-DD'))
}
function setDisplay(val) {
  store.display.tanggal = val
  console.log('form ', store.form)
}
function setTglSuratjalan(val) {
  store.setForm('tanggal_surat', date.formatDate(val, 'YYYY-MM-DD'))
}
function setDispTglSuratjalan(val) {
  store.display.tanggal_surat = val
}
function setTempo(val) {
  store.setForm('tempo', date.formatDate(val, 'YYYY-MM-DD'))
}
function setDispTempo(val) {
  store.display.tempo = val
}
function setTglFaktur(val) {
  store.setForm('tanggal_faktur', date.formatDate(val, 'YYYY-MM-DD'))
}
function setDispTglFaktur(val) {
  store.display.tanggal_faktur = val
}

function editRow(val, i) {
  console.log('edit ', i, val)
  store.item.details[i].edit = true
}
const jmlTrm = ref(null)
const refHarga = ref(null)
let indexDetil = -1
function beforeUpdateHarga(val, i) {
  indexDetil = i
  val.hargaprev = val.harga
}
function updateModelHarga(val) {
  console.log(val)
  if (indexDetil >= 0) {
    const det = store.item.details[indexDetil]
    det.sub_total = parseFloat(det.qty) * parseFloat(val)
  }
}
function updateHarga(val, i) {
  // console.log('ref1', jmlTrm.value)
  // console.log('item ', store.item.details.map(x => x.sub_total).reduce((a, b) => a + b, 0))
  console.log('update ', i, val)
  Dialog.create({
    title: 'Konfirmasi.',
    message: 'Lakukan Edit Harga Diterima?',
    persistent: true,
    ok: {
      push: true,
      'no-caps': true,
      label: 'Lanjut edit harga diterima',
      color: 'green'
    },
    cancel: {
      'no-caps': true,
      push: true,
      color: 'dark'
    }
  }).onOk(() => {
    console.log('store item', store.item)
    console.log('ok', val, i)
    const form = {
      id: val.id,
      qty: val.qty,
      harga: val.harga,
      penerimaan_id: val.penerimaan_id,
      kode_rs: val.kode_rs,
      nomor: store.item.nomor,
      totalHarga: store.item.details.map(x => x.sub_total).reduce((a, b) => a + b, 0)
    }
    if (parseFloat(val.dipesan) > parseFloat(val.qty)) {
      form.statuspesanan = 3
    } else {
      delete form.statuspesanan
    }
    store.simpanPerubahanDetail(form).then(resp => {
      store.item.statuspesanan = resp.pesanan.status
      val.harga = resp.terima.harga
      store.item.details[i].edit = false
      store.item.total = form.totalHarga
    })
    delete val.hargaprev
    indexDetil = -1
  }).onCancel(() => {
    if (val.harga !== val.hargaprev) {
      val.harga = val.hargaprev
      delete val.hargaprev
    }
    indexDetil = -1
  })
  store.item.details[i].edit = false
}
function beforeUpdateJumlah(val, i) {
  indexDetil = i
  val.qtyprev = val.qty
}
function updateModelJumlah(val) {
  if (indexDetil >= 0) {
    const det = store.item.details[indexDetil]
    det.sub_total = parseFloat(val) * parseFloat(det.harga)
  }
}
function updateJumlah(val, i) {
  // console.log('ref1', jmlTrm.value)
  // console.log('item ', store.item)
  console.log('update ', i, val)
  Dialog.create({
    title: 'Konfirmasi.',
    message: 'Lakukan Edit Jumlah Diterima?',
    persistent: true,
    ok: {
      push: true,
      'no-caps': true,
      label: 'Lanjut edit jumlah diterima',
      color: 'green'
    },
    cancel: {
      'no-caps': true,
      push: true,
      color: 'dark'
    }
  }).onOk(() => {
    console.log('store item', store.item)
    console.log('ok', val, i)
    const form = {
      id: val.id,
      qty: val.qty,
      penerimaan_id: val.penerimaan_id,
      kode_rs: val.kode_rs,
      nomor: store.item.nomor,
      totalHarga: store.item.details.map(x => x.sub_total).reduce((a, b) => a + b, 0)
    }
    if (parseFloat(val.dipesan) > parseFloat(val.qty)) {
      form.statuspesanan = 3
    } else {
      delete form.statuspesanan
    }
    store.simpanPerubahanDetail(form).then(resp => {
      store.item.statuspesanan = resp.pesanan.status
      val.qty = resp.terima.qty
      store.item.details[i].edit = false
      store.item.total = form.totalHarga
    })
    indexDetil = -1
  }).onCancel(() => {
    if (val.qty !== val.qtyprev) {
      val.qty = val.qtyprev
    }
    indexDetil = -1
  })
  store.item.details[i].edit = false
}
function hapus(val, i) {
  console.log('item detail length', store.item.details?.length)
  console.log('hapus', val)
  const form = {
    id: val.id,
    kode_rs: val.kode_rs,
    penerimaan: val.penerimaan_id,
    jmlDet: store.item.details?.length
  }
  if (store.item.details?.length <= 1) {
    Dialog.create({
      title: 'Konfirmasi',
      message: 'Data akan terhapus seluruhnya, Apakah akan dilanjutkan?',
      ok: {
        push: true,
        'no-caps': true,
        color: 'negative',
        label: 'Lanjutkan Hapus'
      },
      cancel: {
        push: true,
        color: 'dark'
      }
    })
      .onOk(() => {
        store.hapusDetail(form).then(() => {
          store.table.refreshTable()
          store.setOpen()
        })
      })
  } else {
    store.hapusDetail(form).then(() => { store.item.details.splice(i, 1) })
  }
}
// -----------keterangan status-----------
const color = val => {
  switch (val) {
    case 1:
      return 'blue'
      // eslint-disable-next-line no-unreachable
      break
    case 2:
      // return 'grey'
      return 'red-4'
      // eslint-disable-next-line no-unreachable
      break
    case 3:
      return 'orange'
      // eslint-disable-next-line no-unreachable
      break
    case 4:
      return 'green'
      // eslint-disable-next-line no-unreachable
      break
    case 5:
      return 'orange'
      // eslint-disable-next-line no-unreachable
      break
    case 6:
      return 'green'
      // eslint-disable-next-line no-unreachable
      break
    case 7:
      return 'grey'
      // eslint-disable-next-line no-unreachable
      break
    case 8:
      return 'blue-grey'
      // eslint-disable-next-line no-unreachable
      break
    case 9:
      return 'brown-6'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'red'
      // eslint-disable-next-line no-unreachable
      break
  }
}

const label = (status, nama) => {
  // console.log('nama', nama)
  if (nama === 'PEMESANAN') {
    switch (status) {
      case 1:
        return 'Draft'
        // eslint-disable-next-line no-unreachable
        break
      case 2:
        return 'Menunggu diterima Gudang'
        // eslint-disable-next-line no-unreachable
        break
      case 3:
        return 'Diterima Sebagian'
        // eslint-disable-next-line no-unreachable
        break
      case 4:
        return 'Diterima Seluruhnya'
        // eslint-disable-next-line no-unreachable
        break

      default:
        return 'Belum ada data'
        // eslint-disable-next-line no-unreachable
        break
    }
  } else {
    return 'Belum di definisikan'
  }
}
// onMounted(() => {
//   store.getInitData()
// })

// -----------keterangan status end-----------
</script>
<style lang="scss" scoped>
.btb{
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
.bt{
  border-top: 1px solid black;
}
.bl{
  border-left: 1px solid black;
}
.br{
  border-right: 1px solid black;
}
.bb{
  border-bottom: 1px solid black;
}
.q-col-gutter-sm{
  .no-padding{
    padding: 0px !important;
  }
}
</style>
