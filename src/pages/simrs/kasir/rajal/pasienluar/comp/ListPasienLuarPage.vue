<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items?.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="(item, i) in items" :key="i">
          <pre>{{ item }}</pre>
          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              NO. Nota : <span class="text-negative text-weight-bold">{{ item?.noresep }}</span>
            </q-item-label>
            <q-item-label>
              Nama : <span class="text-weight-bold">{{ item?.nama_pejabat ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              Tanggal : <span class="text-teal text-weight-bold"> {{ humanDate(item?.tgl) }}</span>
            </q-item-label>
            <q-item-label>
              Jenis Layanan : <span class="text-teal text-weight-bold"> {{ item?.jenislayanan }}</span>
            </q-item-label>
          </q-item-section>
          <q-separator vertical class="q-mx-md" />
          <q-item-section class="q-col-gutter-xs">
            <q-item-label class="text-weight-bold">
              Total Nota : <span class="text-weight-bold"><q-badge color="red"> {{ formatRpDouble(item?.subtotal) ??
                '-'
                  }}</q-badge></span>
            </q-item-label>
            <q-item-label>
              Tanggal Bayar : <span class="text-teal text-weight-bold"> {{ humanDate(item?.tglx) ??
                '-' }}</span>
            </q-item-label>
            <div>
              <q-badge outline color="primary">
                {{ item?.nokwitansi }}
              </q-badge>
            </div>
          </q-item-section>
          <q-item-section side>
            <div v-if="item?.nokwitansi != null">
              <q-btn dense size="sm" no-caps color="red" label="Batal" class="q-mb-sm" style="min-width: 100px;"
                @click="emits('batal', item)" />
            </div>
            <div v-else>
              <q-btn dense size="sm" no-caps color="red" label="Bayar" class="q-mb-sm" style="min-width: 100px;"
                :loading="item?.loadingbayar" @click="emits('bayar', item)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
import { dateFullFormat, formatJam, formatRpDouble, humanDate } from 'src/modules/formatter'

const emits = defineEmits(['bayar', 'batal'])


defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingTerima: {
    type: Boolean,
    default: false
  },
  loadingCall: {
    type: Boolean,
    default: false
  },
  loadingTidakhadir: {
    type: Boolean,
    default: false
  },
  loadingcesmix: {
    type: Boolean,
    default: false
  }
})

</script>
