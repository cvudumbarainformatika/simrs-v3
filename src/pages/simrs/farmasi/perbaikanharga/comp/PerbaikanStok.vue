<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        Perbaikan Stok
      </div>
      <div class="row items-center bg-dark text-white">
        <div class="col-2">
          Nopenerimaan
        </div>
        <div class="col-2">
          Harga
        </div>
        <div class="col-2">
          Nobatch
        </div>
        <div class="col-2">
          Penerimaan / Awal
        </div>
        <div class="col-2">
          Harga
        </div>
        <div class="col-2">
          Nobatch
        </div>
      </div>
      <div v-if="props.data?.data?.stok?.length === 0">
        <app-no-data />
      </div>
      <div v-for="(item, i) in props.data?.data?.stok" :key="item">
        <div v-if="item?.loading" class="row items-center justify-center bg-dark text-white">
          Mohon tunggu sebentar ...
        </div>
        <div v-else>
          <div class="row items-center"
            :class="i % 2 === 0 ? (parseFloat(item?.harga) === parseFloat(cekHarga(item)?.harga) ? 'bg-grey-2' : 'bg-negative text-white cursor-pointer') : (parseFloat(item?.harga) === parseFloat(cekHarga(item)?.harga) ? 'bg-grey-4' : 'bg-negative text-white cursor-pointer')"
            @click="() => {
              if (parseFloat(item?.harga) !== parseFloat(cekHarga(item)?.harga)) {
                onClickRow(item)
              }
            }">
            <div class="col-2">
              {{ item?.nopenerimaan }}
            </div>
            <div class="col-2">
              {{ item?.harga }}
            </div>
            <div class="col-2">
              {{ item?.nobatch }}
            </div>
            <div class="col-2">
              {{ cekHarga(item)?.nopenerimaan }}
            </div>
            <div class="col-2">
              {{ cekHarga(item)?.harga }}
            </div>
            <div class="col-2">
              {{ cekHarga(item)?.nobatch }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})
const emits = defineEmits(['ubahharga'])

function onClickRow (item) {
  const matches = props.data?.data?.penerimaan?.filter(p => p.nopenerimaan === item.nopenerimaan) ?? []
  const initialMatches = props.data?.data?.awal?.filter(p => p.nopenerimaan === item.nopenerimaan) ?? []
  const allBatches = [...matches, ...initialMatches]
  
  if (allBatches.length === 0) {
    $q.notify({
      message: 'Master penerimaan tidak ditemukan untuk nomor ini.',
      color: 'negative',
      icon: 'warning'
    })
    return
  }
  
  if (allBatches.length === 1) {
    const singleBatch = allBatches[0]
    $q.dialog({
      title: 'Konfirmasi Perbaikan Harga',
      message: `Apakah Anda ingin menyesuaikan transaksi ini ke Batch: ${singleBatch.nobatch || '-'} dengan harga: ${singleBatch.harga}?`,
      cancel: {
        color: 'negative',
        label: 'Tidak',
        'no-caps': true
      },
      ok: {
        color: 'primary',
        label: 'Ubah',
        'no-caps': true
      },
      persistent: true
    }).onOk(() => {
      emits('ubahharga', { item, penerimaan: singleBatch, harga: singleBatch.harga, tipe: 'stok', id: item.id })
    })
  } else {
    const optionsList = allBatches.map(b => {
      const incoming = b.incoming_qty !== undefined ? b.incoming_qty : parseFloat(b.jumlah || 0)
      const outgoing = b.outgoing_qty !== undefined ? b.outgoing_qty : 0
      const remaining = b.remaining_qty !== undefined ? b.remaining_qty : 0
      const opnameQty = b.opname_qty !== undefined ? b.opname_qty : 0
      
      return {
        label: `Batch: ${b.nobatch || '-'} (Harga: ${b.harga}) [Masuk: ${incoming} | Opname Bulan Ini: ${opnameQty} | Stok Real Hari Ini: ${remaining}]`,
        value: b
      }
    })
    
    $q.dialog({
      title: 'Pilih Batch Penerimaan',
      message: 'Terdapat beberapa batch untuk penerimaan ini. Silakan pilih batch yang sesuai:',
      options: {
        type: 'radio',
        model: allBatches[0],
        items: optionsList
      },
      cancel: {
        color: 'negative',
        label: 'Batal',
        'no-caps': true
      },
      ok: {
        color: 'primary',
        label: 'Pilih',
        'no-caps': true
      },
      persistent: true
    }).onOk(selectedBatch => {
      emits('ubahharga', { item, penerimaan: selectedBatch, harga: selectedBatch.harga, tipe: 'stok', id: item.id })
    })
  }
}

function cekHarga (item) {
  if (item?.nopenerimaan?.includes('awal')) return props.data?.data?.awal?.find(p => p?.nopenerimaan === item?.nopenerimaan && p?.nobatch === item?.nobatch)
  else return props.data?.data?.penerimaan?.find(p => p?.nopenerimaan === item?.nopenerimaan && p?.nobatch === item?.nobatch)
}
</script>
