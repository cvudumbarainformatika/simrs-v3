<template>
  <q-card flat bordered class="history-card">
    <q-card-section class="row items-center justify-between q-py-sm bg-blue-1">
      <div class="text-weight-bold text-primary"><q-icon name="icon-mat-payments" class="q-mr-xs" />Pembayaran</div>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="loading" class="q-py-lg text-center text-grey-7">
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm text-caption">Memuat riwayat pembayaran...</div>
    </q-card-section>
    <q-list v-else-if="payments.length" separator>
      <q-item v-for="payment in payments" :key="payment.id">
        <q-item-section><q-item-label>{{ payment.tanggal }}</q-item-label><q-item-label caption>{{
          payment.jenis_pembayaran || '-' }} - {{ formatCurrency(payment.nominal) }}</q-item-label></q-item-section>
        <q-item-section side>
          <div class="row no-wrap items-center"><q-badge v-if="hasActiveReceipt(payment)" color="positive" label="Kwitansi sudah dicetak" class="q-mr-xs" />
            <q-btn v-else flat dense color="primary" icon="icon-mat-print" label="Cetak" @click="$emit('print', payment)" /><q-btn flat dense color="negative" icon="icon-mat-delete" label="Hapus"
              :disable="hasActiveReceipt(payment)" @click="$emit('delete', payment)" /></div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-section v-else class="text-center text-grey-7 q-py-lg"><q-icon name="icon-mat-receipt_long" size="32px"
        color="grey-5" />
      <div class="q-mt-xs text-caption">Belum ada pembayaran tersimpan.</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  payments: { type: Array, default: () => [] },
  activeReceiptPayments: { type: Array, default: () => [] },
  loading: Boolean
})
defineEmits(['print', 'delete'])
function hasActiveReceipt(payment) {
  return props.activeReceiptPayments.includes(String(payment?.no_pembayaran || ''))
}
function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}
</script>
