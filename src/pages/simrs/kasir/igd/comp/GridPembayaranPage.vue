<template>
  <q-card flat bordered class="history-card">
    <q-card-section class="row items-center justify-between q-py-sm bg-blue-1">
      <div class="text-weight-bold text-primary"><q-icon name="icon-mat-payments" class="q-mr-xs" />Riwayat pembayaran</div>
      <q-badge color="primary">{{ sortedPayments.length }}</q-badge>
    </q-card-section>
    <q-separator />
    <q-list v-if="payments.length" separator>
      <q-item v-for="payment in sortedPayments" :key="payment.id">
        <q-item-section>
          <q-item-label>{{ payment.tanggal }}</q-item-label>
          <q-item-label caption>{{ payment.jenis_pembayaran || '-' }} - {{ formatCurrency(payment.nominal) }}</q-item-label>
        </q-item-section>
        <q-item-section side><div class="row items-center no-wrap q-gutter-sm"><span class="text-caption text-grey-7">{{ payment.no_pembayaran }}</span><q-badge v-if="hasActiveReceipt(payment)" color="positive" label="Sudah dicetak" /><q-btn v-else flat dense color="primary" icon="icon-mat-print" label="Cetak kwitansi" @click="$emit('print', payment)" /><q-btn flat dense color="negative" icon="icon-mat-delete" label="Hapus" @click="$emit('delete', payment)" /></div></q-item-section>
      </q-item>
    </q-list>
    <q-card-section v-else class="text-center text-grey-7 q-py-lg">
      <q-icon name="icon-mat-receipt_long" size="32px" color="grey-5" />
      <div class="q-mt-xs text-caption">Belum ada pembayaran tersimpan.</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ payments: { type: Array, default: () => [] } })
defineEmits(['print', 'delete'])
const sortedPayments = computed(() => [...props.payments].sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0)))
function hasActiveReceipt (payment) { return Number(payment?.sudah_kwitansi || 0) === 1 }
function formatCurrency (value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0))
}
</script>