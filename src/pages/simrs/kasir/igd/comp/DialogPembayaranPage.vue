<template>
  <q-dialog :model-value="modelValue" maximized @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="dialog-igd">
      <q-card-section class="header row items-center justify-between">
        <div class="row items-center q-gutter-sm"><q-avatar color="white" text-color="negative" icon="icon-mat-emergency" /><div><div class="text-subtitle1 text-weight-bold">Pembayaran Pasien IGD</div><div class="text-caption text-red-1">{{ patient?.noreg }}</div></div></div>
        <q-btn flat round color="white" icon="icon-mat-close" @click="$emit('update:modelValue', false)" />
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4"><q-card flat bordered class="detail-card full-height"><q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">Data pasien</div>
            <div class="row items-center q-gutter-sm"><app-avatar-pasien :pasien="patient" /><div><div class="text-weight-bold">{{ patient?.nama || '-' }}</div><div class="text-caption text-primary">RM {{ patient?.norm || '-' }}</div></div></div>
            <q-list dense separator class="q-mt-md"><q-item><q-item-section caption>No. registrasi</q-item-section><q-item-section side>{{ patient?.noreg }}</q-item-section></q-item><q-item><q-item-section caption>Sistem bayar</q-item-section><q-item-section side>{{ patient?.sistem_bayar || '-' }}</q-item-section></q-item><q-item><q-item-section caption>Tanggal pulang</q-item-section><q-item-section side>{{ patient?.tanggal_pulang || '-' }}</q-item-section></q-item></q-list>
          </q-card-section></q-card></div>
          <div class="col-12 col-md-8"><q-card flat bordered class="detail-card"><q-card-section>
            <div class="row items-center justify-between q-mb-md"><div class="text-subtitle2 text-weight-bold">Rincian billing IGD</div><div class="row items-center q-gutter-xs"><q-checkbox :model-value="allUnpaidSelected" :indeterminate="someUnpaidSelected && !allUnpaidSelected" label="Pilih semua" dense size="sm" color="negative" @update:model-value="toggleAll" /><q-btn flat round dense icon="icon-mat-refresh" color="primary" :loading="store.loading" @click="loadData"><q-tooltip>Refresh rincian billing</q-tooltip></q-btn></div></div>
            <div v-if="store.loading" class="text-center q-py-xl"><q-spinner color="negative" size="2em" /><div class="q-mt-sm">Memuat tagihan...</div></div>
            <template v-else><div v-for="item in billingItems" :key="item.key" class="row items-center justify-between q-mb-sm"><div class="row items-center no-wrap"><q-checkbox v-model="selectedItems" :val="item.key" :disable="item.sudah_dibayar || Number(item.nominal || 0) <= 0" dense size="sm" color="negative" class="q-mr-xs" /><span :class="{ 'text-grey-5': Number(item.nominal || 0) <= 0 }">{{ item.nama }}</span><q-badge v-if="item.sudah_dibayar" color="positive" class="q-ml-sm">Terbayar</q-badge></div><span :class="{ 'text-grey-5': Number(item.nominal || 0) <= 0 }">{{ formatCurrency(item.nominal) }}</span></div><q-separator /><div class="row justify-between q-mt-md"><span>Nominal dipilih</span><span class="text-subtitle1 text-primary text-weight-bold">{{ formatCurrency(selectedTotal) }}</span></div><div class="row justify-between q-mt-sm"><span>Total tagihan</span><span class="text-weight-bold">{{ formatCurrency(totalTagihan) }}</span></div><div class="row justify-between q-mt-sm"><span>Sudah dibuat kwitansi</span><span class="text-weight-bold text-positive">{{ formatCurrency(store.totalKwitansiAktif) }}</span></div><div class="row justify-between q-mt-sm"><span class="text-weight-bold">Sisa tagihan</span><span class="text-h6 text-negative text-weight-bold">{{ formatCurrency(sisaTagihan) }}</span></div></template>
          </q-card-section></q-card></div>
          <div class="col-12"><q-separator /></div>
          <div class="col-12 col-md-6"><q-select v-model="paymentMethod" outlined dense label="Metode pembayaran" :options="paymentMethods" /></div>
          <div class="col-12 col-md-6 row justify-end"><q-btn unelevated color="primary" icon="icon-mat-save" label="Simpan pembayaran" :loading="store.savingPembayaran" :disable="!paymentMethod || selectedTotal <= 0" @click="savePayment" /></div>
          <div class="col-12 col-md-6"><GridPembayaranPage :payments="store.riwayatPembayaran" @print="checkAndOpenReceipt" /></div><div class="col-12 col-md-6"><GridCetakKwitansiPage :receipts="store.riwayatKwitansi" :cancelling="store.membatalkanKwitansi" @cancel="cancelReceipt" /></div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md"><q-btn flat color="grey-8" label="Tutup" @click="$emit('update:modelValue', false)" /></q-card-actions>
    </q-card>
    </q-dialog>
  <q-dialog v-model="receiptDialog" maximized><q-card class="receipt-page"><q-card-actions align="right" class="no-print q-pa-sm"><q-btn flat icon="icon-mat-close" label="Tutup" v-close-popup /><q-btn unelevated color="primary" icon="icon-mat-print" label="Cetak Kwitansi" :loading="store.printingKwitansi" @click="printReceipt" /></q-card-actions><q-card-section class="receipt-content q-pa-md"><div class="receipt-kop row items-center"><img src="/images/logos/logo-rsud.png" class="receipt-logo"><div><div class="text-weight-bold">UOBK RSUD dr. MOHAMAD SALEH</div><div class="text-caption">Jl. Mayjen Panjaitan No. 65 Probolinggo Jawa Timur</div><div class="text-caption">Telp. (0335) 433478, 433119, 421118</div></div><div class="col text-right text-weight-bold">{{ selectedReceipt?.nokwitansi ? `No. Kwitansi : ${selectedReceipt.nokwitansi}` : `No. RM : ${patient?.norm || '-'}` }}</div></div><div class="text-right text-caption q-mt-sm">{{ selectedReceipt?.tanggal || '' }}</div><q-separator class="q-my-sm" /><div class="text-h4 text-weight-bold q-mb-xl">{{ selectedReceipt?.nokwitansi ? 'Kwitansi' : 'Bukan Kwitansi Original' }}</div><div class="receipt-row"><span>Sudah terima dari</span><b>:</b><em>{{ patient?.nama || '-' }}</em></div><div class="receipt-row"><span>Banyaknya uang</span><b>:</b><em>{{ formatCurrency(selectedReceipt?.nominal) }}</em></div><div class="receipt-row q-mt-md"><span>Untuk pembayaran</span><b>:</b><em>Pembayaran IGD</em></div><div class="receipt-row"><span>Untuk</span><b>:</b><em>{{ patient?.nama || '-' }}</em></div><div class="receipt-total q-mt-lg">Terbilang Rp. {{ Number(selectedReceipt?.nominal || 0).toLocaleString('id-ID') }},-</div></q-card-section></q-card></q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Dialog, Notify } from 'quasar'
import { useKasirIgdStore } from 'src/stores/simrs/kasir/igd/kasirigd'
import GridPembayaranPage from './GridPembayaranPage.vue'
import GridCetakKwitansiPage from './GridCetakKwitansiPage.vue'

const props = defineProps({ modelValue: Boolean, patient: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'saved', 'print'])
const store = useKasirIgdStore()
const selectedItems = ref([])
const paymentMethod = ref('')
const receiptDialog = ref(false)
const selectedReceipt = ref(null)
const paymentMethods = ['Tunai', 'QRIS', 'Transfer Bank', 'Kartu Debit/Kredit']
const fallbackBillingItems = computed(() => {
  const bill = store.rekapBill || {}
  const tindakan = (Array.isArray(bill.tindakan) ? bill.tindakan : []).reduce((total, item) => total + Number(item?.subtotal || 0), 0)
  return [
    ['administrasi', 'Administrasi IGD', bill.adminigd], ['tindakan', 'Tindakan', tindakan], ['laboratorium', 'Laboratorium', bill.laborat], ['radiologi', 'Radiologi', bill.radiologi], ['hemodialisa', 'Hemodialisa', bill.hd], ['anestesi', 'Anestesi Di Luar OK & ICU', bill.penunjanglain], ['cardio', 'Cardio', bill.cardio], ['eeg', 'EEG', bill.eeg], ['endoscope', 'Endoscope', bill.endoscopy], ['darah', 'Biaya Penggunaan Darah', bill.bdrs], ['ok_igd', 'OK IGD', bill.okigd], ['tindakan_ok_igd', 'Tindakan Operasi IGD', bill.tindakanokigd], ['ok_ibs', 'OK IBS', bill.okranap], ['tindakan_ok_ibs', 'Tindakan Operasi IBS', bill.tindakanokranap], ['jenasah', 'Perawatan Jenasah', bill.perawatanjenasah], ['ambulan', 'Ambulan', bill.ambulan], ['materai', 'Biaya Pembuatan Dokumen dan Materai', bill.biayamatrei], ['farmasi', 'Farmasi', Number(bill.farmasi || 0) + Number(bill.eresep || 0)]
  ].map(([key, nama, nominal]) => ({ key, nama, nominal: Number(nominal || 0), sudah_dibayar: false }))
})
const paidItemKeys = computed(() => (store.riwayatPembayaran || []).flatMap(payment => String(payment.kwitansi_d || '').split(';').map(detail => {
  const parts = detail.split('|')
  const legacyKey = parts[2]
  if (['administrasi', 'laboratorium', 'tindakan', 'farmasi', 'radiologi'].includes(legacyKey)) return legacyKey
  return ({ 'Administrasi IGD': 'administrasi', Administrasi: 'administrasi', Laboratorium: 'laboratorium', Laborat: 'laboratorium', Tindakan: 'tindakan', Farmasi: 'farmasi', Radiologi: 'radiologi' })[parts[5]]
}).filter(Boolean)))
const billingItems = computed(() => {
  const items = store.rincianPembayaran?.length ? store.rincianPembayaran : fallbackBillingItems.value
  return items.map(item => ({ ...item, sudah_dibayar: Boolean(item.sudah_dibayar) || paidItemKeys.value.includes(item.key) }))
})
const unpaidItems = computed(() => billingItems.value.filter(item => !item.sudah_dibayar && Number(item.nominal || 0) > 0))
const allUnpaidSelected = computed(() => unpaidItems.value.length > 0 && unpaidItems.value.every(item => selectedItems.value.includes(item.key)))
const someUnpaidSelected = computed(() => unpaidItems.value.some(item => selectedItems.value.includes(item.key)))
const selectedTotal = computed(() => billingItems.value.filter(item => selectedItems.value.includes(item.key) && !item.sudah_dibayar).reduce((total, item) => total + Number(item.nominal || 0), 0))
const totalTagihan = computed(() => billingItems.value.reduce((total, item) => total + Number(item.nominal || 0), 0))
const sisaTagihan = computed(() => Math.max(totalTagihan.value - Number(store.totalKwitansiAktif || 0), 0))

watch(() => props.modelValue, visible => { if (visible) loadData() })
async function loadData () {
  if (!props.patient?.noreg) return
  selectedItems.value = []
  try {
    await Promise.all([store.getBill({ noreg: props.patient.noreg }), store.getRincianPembayaran(props.patient.noreg), store.getRiwayatKwitansiIgd(props.patient.noreg)])
  } catch (error) {
    Notify.create({ type: 'warning', message: 'Status pembayaran belum dapat dimuat. Rincian billing tetap ditampilkan.' })
  }
}
function toggleAll (checked) { selectedItems.value = checked ? unpaidItems.value.map(item => item.key) : [] }
async function savePayment () {
  if (!paymentMethod.value || selectedTotal.value <= 0) return
  try {
    const response = await store.simpanPembayaranIgd({ noreg: props.patient?.noreg, jenis_pembayaran: paymentMethod.value, rincian: selectedItems.value })
    Notify.create({ type: 'positive', message: response.data?.message || 'Pembayaran IGD berhasil disimpan.' })
    paymentMethod.value = ''
    await loadData()
    emit('saved')
  } catch (error) { Notify.create({ type: 'negative', message: error.response?.data?.message || 'Pembayaran IGD gagal disimpan.' }) }
}
function cancelReceipt (receipt) {
  Dialog.create({ title: 'Batal kwitansi', message: `Batalkan kwitansi ${receipt.nomor}?`, cancel: true, persistent: true }).onOk(async () => {
    try {
      const response = await store.batalKwitansiIgd({ noreg: props.patient?.noreg, nokwitansi: receipt.nomor })
      Notify.create({ type: 'positive', message: response.data?.message || 'Kwitansi berhasil dibatalkan.' })
      await loadData()
    } catch (error) { Notify.create({ type: 'negative', message: error.response?.data?.message || 'Kwitansi gagal dibatalkan.' }) }
  })
}async function checkAndOpenReceipt (payment) {
  try {
    const response = await store.cekKwitansiPembayaranIgd(props.patient?.noreg, payment.no_pembayaran)
    if (response.data?.data?.ada) { Notify.create({ type: 'warning', message: 'Kwitansi sudah tercetak untuk pembayaran ini.' }); return }
    selectedReceipt.value = payment
    receiptDialog.value = true
  } catch (error) { Notify.create({ type: 'negative', message: error.response?.data?.message || 'Pengecekan kwitansi gagal.' }) }
}
async function printReceipt () {
  if (!selectedReceipt.value?.no_pembayaran) return
  try { const response = await store.cetakKwitansiIgd({ noreg: props.patient?.noreg, no_pembayaran: selectedReceipt.value.no_pembayaran }); selectedReceipt.value = { ...selectedReceipt.value, ...response.data?.data }; Notify.create({ type: 'positive', message: response.data?.message || 'Kwitansi berhasil dibuat.' }); await store.getRiwayatKwitansiIgd(props.patient?.noreg); window.print(); receiptDialog.value = false } catch (error) { Notify.create({ type: 'negative', message: error.response?.data?.message || 'Kwitansi gagal dibuat.' }) }
}function formatCurrency (value) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0)) }
</script>

<style scoped lang="scss">
.dialog-igd { width: 1100px; max-width: 98vw; }
.header { background: linear-gradient(110deg, #b51f2c, #e54850); color: #fff; }
.detail-card { border-radius: 10px; background: #fff; }
.receipt-page,.receipt-content{background:#fff}.receipt-kop{border-bottom:1px solid #555;padding-bottom:6px}.receipt-logo{width:65px;height:65px;object-fit:contain;margin-right:10px}.receipt-row{display:grid;grid-template-columns:160px 16px 1fr;margin:8px 0}.receipt-total{width:68%;color:#fff;background-color:#111!important;background-image:repeating-linear-gradient(0deg,#111 0,#111 1px,#eee 1px,#eee 2px)!important;padding:3px 4px;font-size:20px;font-weight:bold;font-style:italic;-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.no-print{display:none!important}.receipt-content{padding:0!important;max-width:none}}
</style>