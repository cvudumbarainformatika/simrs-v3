<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="closeDialog">
    <q-card class="payment-dialog">
      <q-card-section class="payment-header row items-center justify-between">
        <div class="row items-center q-gutter-sm"><q-avatar color="white" text-color="primary"
            icon="icon-mat-payments" />
          <div>
            <div class="text-subtitle1 text-weight-bold">Form Pembayaran Homecare</div>
            <div class="text-caption text-blue-1">{{ patient?.noreg }}</div>
          </div>
        </div>
        <q-btn flat round dense icon="icon-mat-close" color="white" @click="closeDialog(false)" />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6"><q-card flat bordered class="detail-card full-height"><q-card-section>
                <div class="text-subtitle2 text-weight-bold q-mb-md">Data pasien</div>
                <div class="row items-center q-gutter-sm q-mb-md"><app-avatar-pasien
                    :pasien="patient?.masterpasien || patient" />
                  <div>
                    <div class="text-weight-bold">{{ patient?.nama || patient?.masterpasien?.rs2 || '-' }}</div>
                    <div class="text-caption text-primary">RM {{ patient?.norm || '-' }}</div>
                  </div>
                </div><q-list dense separator><q-item><q-item-section caption>Penjamin</q-item-section><q-item-section
                      side>{{ patient?.sistem_bayar || '-' }}</q-item-section></q-item><q-item><q-item-section
                      caption>DPJP</q-item-section><q-item-section side>{{ patient?.dokter?.nama || '-'
                      }}</q-item-section></q-item><q-item><q-item-section caption>Jenis
                      kelamin</q-item-section><q-item-section side>{{ patientGender(patient)
                      }}</q-item-section></q-item><q-item><q-item-section caption>Usia</q-item-section><q-item-section
                      side>{{ patientAge(patient) }}</q-item-section></q-item><q-item><q-item-section
                      caption>Layanan</q-item-section><q-item-section side>{{ patient?.nama_admin_layanan || 'Homecare'
                      }}</q-item-section></q-item></q-list>
              </q-card-section></q-card></div>
          <div class="col-12 col-md-6"><q-card flat bordered class="detail-card full-height"><q-card-section>
                <div class="text-subtitle2 text-weight-bold q-mb-md">Rincian pembayaran</div>
                <div v-if="loadingRincian" class="text-center q-py-md"><q-spinner color="primary" size="2em" /></div>
                <template v-else>
                  <div v-for="rincian in paymentDetails" :key="rincian.nama"
                    class="row justify-between q-mb-sm text-grey-8"><span>{{ rincian.nama }}</span><span>{{
                      formatCurrency(rincian.nominal) }}</span></div><q-separator />
                  <div class="row justify-between items-center q-mt-md"><span class="text-weight-bold">Total
                      tagihan</span><span class="text-h6 text-negative text-weight-bold">{{ formatCurrency(totalTagihan)
                      }}</span></div>
                </template>
              </q-card-section></q-card>
          </div>
          <div class="col-12"><q-separator /></div>
          <div class="col-12 col-md-6"><q-select ref="refPaymentMethod" v-model="paymentForm.metode" outlined dense
              label="Metode pembayaran" :options="paymentMethods" @update:model-value="onPaymentMethodChange" /></div>
          <div class="col-12 col-md-6"><q-input :model-value="formatCurrency(totalTagihan)" outlined dense readonly
              label="Nominal dibayar" input-class="text-right text-weight-bold text-primary" /></div>
          <template v-if="paymentForm.metode === 'Tunai'">
            <div class="col-12 col-md-6"><q-input ref="refCashReceived" v-model="cashReceivedText" outlined dense
                label="Uang diterima" prefix="Rp" input-class="text-right" @keyup.enter="savePayment" /></div>
            <div class="col-12 col-md-6"><q-input :model-value="formatCurrency(changeAmount)" outlined dense readonly
                label="Pengembalian" input-class="text-right text-weight-bold text-positive" /></div>
            <div v-if="cashReceived < totalTagihan" class="col-12 text-negative text-caption">Uang diterima kurang {{
              formatCurrency(totalTagihan - cashReceived) }}.</div>
          </template>
          <div class="col-12"><q-input v-model="paymentForm.catatan" outlined dense
              label="Catatan pembayaran (opsional)" /></div>
<div class="col-12 row justify-end q-mt-xs">
            <q-btn unelevated color="primary" icon="icon-mat-save" label="Simpan pembayaran"
              :loading="savingPayment"
              :disable="loadingRincian || !paymentForm.metode || totalTagihan <= 0 || (paymentForm.metode === 'Tunai' && cashReceived < totalTagihan)"
              @click="savePayment" />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-md history-section">
        <div class="text-subtitle1 text-weight-bold q-mb-sm">Riwayat transaksi</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <GridpembyaranPage :payments="paymentHistory" @print="checkAndOpenReceipt"
              @delete="deletePayment" />
          </div>
          <div class="col-12 col-md-6">
            <GridCetakKwuitansiPage :receipts="receiptHistory" :cancelling="homecareStore.membatalkanKwitansi"
              @cancel="cancelReceipt" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md"><q-btn flat label="Tutup" color="grey-8" @click="closeDialog(false)" /></q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="receiptDialog" maximized><q-card class="receipt-page"><q-card-actions align="right"
        class="no-print q-pa-sm"><q-btn flat icon="icon-mat-close" label="Tutup" v-close-popup /><q-btn unelevated
          color="primary" icon="icon-mat-print" label="Cetak Kwitansi" :loading="homecareStore.printingKwitansi"
          @click="printReceipt" /></q-card-actions><q-card-section class="receipt-content receipt-classic q-pa-none">
        <div class="classic-kop row items-start"><img src="/images/logos/logo-rsud.png"
            alt="Logo RSUD dr. Mohamad Saleh" class="classic-logo" />
          <div class="q-ml-sm">
            <div class="text-weight-bold">UOBK RSUD dr. MOHAMAD SALEH</div>
            <div class="text-caption">Jl. Mayjen Panjaitan No. 65 Probolinggo Jawa Timur</div>
            <div class="text-caption">Telp. (0335) 433478, 433119, 421118 Fax. (0335) 432702</div>
          </div>
          <div class="col text-right text-weight-bold">{{ selectedReceipt?.nokwitansi ? `No. Kwitansi :
            ${selectedReceipt.nokwitansi}` : `No. RM : ${patient?.norm || '-'}` }}</div>
        </div>
        <div class="classic-time text-right">{{ selectedReceipt?.tanggal }}</div>
        <div class="classic-body">
          <div class="text-h4 text-weight-bold q-mb-xl">{{ selectedReceipt?.nokwitansi ? 'Kwitansi' : 'Bukan Original'
            }}
          </div>
          <div class="classic-row"><span>Sudah terima dari</span><b>:</b><em>{{ patient?.nama ||
            patient?.masterpasien?.rs2 || '-' }}</em></div>
          <div class="classic-row"><span>Banyaknya uang</span><b>:</b><em>{{ formatCurrency(selectedReceipt?.nominal)
              }}</em></div>
          <div class="classic-row q-mt-md"><span>Untuk pembayaran</span><b>:</b><em>Pembayaran Pelunasan</em></div>
          <div class="classic-row"><span></span><b>:</b><em>{{paymentDetails.map(item => item.nama).join(', ')}}</em>
          </div>
          <div class="classic-row q-mt-md"><span>Untuk</span><b>:</b><em>{{ patient?.nama || patient?.masterpasien?.rs2
            ||
            '-' }}</em></div>
        </div>
        <div class="classic-total">Terbilang Rp. {{ Number(selectedReceipt?.nominal || 0).toLocaleString('id-ID') }},-
        </div>
      </q-card-section></q-card></q-dialog>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { Dialog, Notify } from 'quasar'
import { useKasirHomecareStore } from 'src/stores/simrs/kasir/homecare/homecare'
import GridpembyaranPage from './GridpembyaranPage.vue'
import GridCetakKwuitansiPage from './GridCetakKwuitansiPage.vue'

const props = defineProps({ modelValue: Boolean, patient: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'saved'])
const paymentForm = ref({ metode: '', nominal: 0, catatan: '' })
const paymentMethods = ['Tunai', 'QRIS', 'Transfer Bank', 'Kartu Debit/Kredit']
const homecareStore = useKasirHomecareStore()
const paymentDetails = computed(() => homecareStore.rincianPembayaran)
const loadingRincian = computed(() => homecareStore.loadingRincian)
const savingPayment = computed(() => homecareStore.savingPembayaran)
const paymentHistory = computed(() => homecareStore.riwayatPembayaran)
const receiptHistory = computed(() => homecareStore.riwayatKwitansi)
const receiptDialog = ref(false)
const selectedReceipt = ref(null)
const cashReceived = ref(0)
const refPaymentMethod = ref(null)
const refCashReceived = ref(null)
const totalTagihan = computed(() => paymentDetails.value.reduce((total, item) => total + Number(item.nominal || 0), 0))
const changeAmount = computed(() => Math.max(Number(cashReceived.value || 0) - totalTagihan.value, 0))
const cashReceivedText = computed({ get: () => Number(cashReceived.value || 0).toLocaleString('id-ID'), set: value => { cashReceived.value = Number(String(value).replace(/\D/g, '')) || 0 } })

watch(() => props.modelValue, async visible => { if (visible && props.patient?.noreg) await loadPaymentData() })
async function loadPaymentData() { homecareStore.resetPembayaran(); try { await homecareStore.getRincianPembayaran(props.patient.noreg); paymentForm.value = { metode: '', nominal: homecareStore.totalTagihan, catatan: '' }; cashReceived.value = homecareStore.totalTagihan; await getPaymentHistory(); await getReceiptHistory(); await nextTick(); refPaymentMethod.value?.focus() } catch (error) { Notify.create({ type: 'negative', message: error.response?.data?.message || 'Rincian pembayaran gagal dimuat.' }) } }
async function getPaymentHistory() { return homecareStore.getRiwayatPembayaran(props.patient?.noreg) }
async function getReceiptHistory() { return homecareStore.getRiwayatKwitansi(props.patient?.noreg) }
function closeDialog(value) { emit('update:modelValue', Boolean(value)) }
function formatCurrency(value) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0)) }
function patientGender(patient) { const gender = patient?.kelamin || patient?.masterpasien?.rs17; return gender === 'L' ? 'Laki-laki' : (gender === 'P' ? 'Perempuan' : (gender || 'Jenis kelamin -')) }
function patientAge(patient) { const birthDate = patient?.tgllahir || patient?.masterpasien?.tgllahir || patient?.masterpasien?.rs16; if (!birthDate) return 'Usia -'; const birth = new Date(birthDate); if (Number.isNaN(birth.getTime())) return 'Usia -'; const today = new Date(); let age = today.getFullYear() - birth.getFullYear(); if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--; return age >= 0 ? `${age} tahun` : 'Usia -' }
async function onPaymentMethodChange(method) { if (method === 'Tunai') { await nextTick(); refCashReceived.value?.focus() } }
async function checkAndOpenReceipt(payment) {
  try {
    const response = await homecareStore.cekKwitansiPembayaran(props.patient?.noreg, payment.no_pembayaran)
    if (response.data?.data?.ada) {
      Notify.create({ type: 'warning', message: 'Kwitansi sudah tercetak untuk pembayaran ini.' })
      return
    }
    selectedReceipt.value = payment
    receiptDialog.value = true
  }
  catch (error) {
    Notify.create({ type: 'negative', message: error.response?.data?.message || 'Pengecekan kwitansi gagal.' })
  }
}
async function printReceipt() {
  if (!selectedReceipt.value?.id) {
    Notify.create({ type: 'negative', message: 'Data pembayaran untuk kwitansi tidak ditemukan.' })
    return
  }
  try {
    const response = await homecareStore.cetakKwitansi({
      noreg: props.patient?.noreg,
      no_pembayaran: selectedReceipt.value.no_pembayaran
    })
    selectedReceipt.value = { ...selectedReceipt.value, ...response.data?.data }
    Notify.create({ type: 'positive', message: response.data?.message || 'Kwitansi berhasil dibuat.' })
    await getReceiptHistory()
    window.print()
    receiptDialog.value = false
  }
  catch (error) {
    Notify.create({ type: 'negative', message: error.response?.data?.message || 'Kwitansi gagal dibuat.' })
  }
}
function deletePayment(payment) {
  Dialog.create({
    title: 'Hapus pembayaran',
    message: 'Hapus pembayaran ini? Penghapusan ditolak bila masih ada kwitansi aktif.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const response = await homecareStore.hapusPembayaran({ noreg: props.patient?.noreg, no_pembayaran: payment.no_pembayaran })
      Notify.create({ type: 'positive', message: response.data?.message || 'Pembayaran berhasil dihapus.' })
      await getPaymentHistory()
      await getReceiptHistory()
      emit('saved')
    }
    catch (error) {
      Notify.create({ type: 'negative', message: error.response?.data?.message || 'Pembayaran gagal dihapus.' })
    }
  })
}
async function cancelReceipt(receipt) {
  try {
    const response = await homecareStore.batalKwitansi({ noreg: props.patient?.noreg, nokwitansi: receipt.nomor })
    Notify.create({ type: 'positive', message: response.data?.message || 'Kwitansi berhasil dibatalkan.' })
    await getReceiptHistory()
  }
  catch (error) {
    Notify.create({ type: 'negative', message: error.response?.data?.message || 'Kwitansi gagal dibatalkan.' })
  }
}
function showUiNotice(action) { Notify.create({ type: 'info', message: `${action} akan dihubungkan ke database setelah tampilan disetujui.` }) }
async function savePayment() {
  if (!paymentForm.value.metode) { Notify.create({ type: 'negative', message: 'Metode pembayaran wajib dipilih.' }); return } if (paymentForm.value.metode === 'Tunai' && cashReceived.value < totalTagihan.value) { Notify.create({ type: 'negative', message: 'Uang diterima masih kurang.' }); return } try { const response = await homecareStore.simpanPembayaran({ noreg: props.patient.noreg, jenis_pembayaran: paymentForm.value.metode }); Notify.create({ type: 'positive', message: response.data?.message || 'Pembayaran berhasil disimpan.' }); emit('saved'); await getPaymentHistory(); await getReceiptHistory() } catch (error) { Notify.create({ type: 'negative', message: error.response?.data?.message || 'Pembayaran gagal disimpan.' }) }
}
</script>

<style lang="scss" scoped>
.payment-dialog {
  width: 1100px;
  max-width: 98vw;
  border-radius: 14px;
}

.payment-header {
  background: linear-gradient(110deg, #164f9e, #2377c9);
  color: white;
}

.detail-card {
  border-radius: 10px;
  background: #fbfdff;
}

.receipt-page,
.receipt-content {
  background: white;
}

.receipt-content {
  min-height: 100%;
}

.receipt-classic {
  font-family: Arial, sans-serif;
  color: #000;
}

.classic-kop {
  padding: 4px;
  border-bottom: 1px solid #555;
  font-size: 13px;
  line-height: 1.15;
}

.classic-logo {
  width: 65px;
  height: 65px;
  object-fit: contain;
  flex: 0 0 65px;
}

.classic-time {
  padding: 4px;
  font-size: 11px;
  border-bottom: 1px solid #aaa;
}

.classic-body {
  padding: 8px 4px;
}

.classic-row {
  display: grid;
  grid-template-columns: 160px 16px 1fr;
  margin: 8px 0;
  font-size: 14px;
}

.classic-total {
  width: 68%;
  color: white;
  background-color: #111 !important;
  background-image: repeating-linear-gradient(0deg, #111 0, #111 1px, #eee 1px, #eee 2px) !important;
  padding: 3px 4px;
  font-size: 20px;
  font-weight: bold;
  font-style: italic;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .no-print {
    display: none !important;
  }

  .receipt-content {
    padding: 0 !important;
    max-width: none;
  }
}
</style>
