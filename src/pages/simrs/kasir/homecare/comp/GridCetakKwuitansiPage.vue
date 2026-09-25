<template>
  <q-card flat bordered class="history-card">
    <q-card-section class="row items-center justify-between q-py-sm bg-teal-1">
      <div class="text-weight-bold text-teal-9"><q-icon name="icon-mat-print" class="q-mr-xs" />Kwitansi pembayaran
      </div>
    </q-card-section>
    <q-separator />
    <q-list v-if="receipts.length" separator>
      <q-item v-for="receipt in receipts" :key="receipt.id">
        <q-item-section><q-item-label>{{ receipt.nomor }}</q-item-label><q-item-label caption>{{ receipt.tanggal }} - {{
          formatCurrency(receipt.nominal) }}</q-item-label><q-item-label v-if="isActive(receipt)" caption
            class="text-positive">Aktif</q-item-label><q-item-label v-else caption class="text-negative">Dibatalkan {{
              receipt.tgl_batal || '' }}</q-item-label></q-item-section>
        <q-item-section side><q-btn v-if="isActive(receipt)" flat dense color="negative" icon="icon-mat-cancel"
            label="Batal" :loading="cancelling" @click="$emit('cancel', receipt)" /><q-badge v-else color="negative"
            label="Batal" /></q-item-section>
      </q-item>
    </q-list>
    <q-card-section v-else class="text-center text-grey-7 q-py-lg"><q-icon name="icon-mat-history" size="32px"
        color="grey-5" />
      <div class="q-mt-xs text-caption">Belum ada kwitansi. Kwitansi tidak dapat dihapus, hanya dapat dibatalkan.</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({ receipts: { type: Array, default: () => [] }, cancelling: Boolean })
defineEmits(['cancel'])
function isActive(receipt) { return !receipt.batal || receipt.batal === '0' }
function formatCurrency(value) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0)) }
</script>
