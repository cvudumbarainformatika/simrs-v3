<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items?.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="(item, i) in items" :key="i">
          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              NO. VA : <span class="text-negative text-weight-bold">{{ item?.nova }}</span> || Nama : <span
                class="text-weight-bold">{{ item?.nama }}</span>
            </q-item-label>
            <q-item-label>
              <span class="text-weight-bold">{{ item?.nota }} </span> | <span class="text-cyan text-weight-bold">{{
                item?.rs3 }}</span>
            </q-item-label>
            <q-item-label>
              Tanggal Expired Date : <span class="text-teal text-weight-bold"> {{ item?.tgled }}</span>
            </q-item-label>
          </q-item-section>
          <q-separator vertical class="q-mx-md" />
          <q-item-section class="q-col-gutter-xs">
            <q-item-label class="text-weight-bold">
              Total VA : <span class="text-weight-bold"><q-badge color="red"> {{ formatRpDouble(item?.nominal) ??
                '-'
                  }}</q-badge></span>
            </q-item-label>
            <q-item-label>
              Tanggal Bayar : <span class="text-teal text-weight-bold"> {{ item?.tglbayar ??
                '-' }}</span>
            </q-item-label>
            <div>
              <q-badge outline color="primary">
                {{ item?.kasir }}
              </q-badge>
            </div>
          </q-item-section>
          <q-item-section side>
            <div v-if="item?.tglbyr != null" class="q-gutter-xs">
              <q-badge rounded color="purple" label="Lunas" />

            </div>
            <div v-else class="q-gutter-xs">
              <div v-if="item?.batal === '1'">
                <q-badge outline rounded color="red" label="SUDAH DIBATAL" />
              </div>
              <div v-else class="q-gutter-xs">
                <q-btn dense size="sm" rounded no-caps color="primary" label="Flaging Manual" class="q-mb-sm"
                  style="min-width: 100px;" :loading="item?.loadingbayar" @click="emits('flaging', item)" /> <br>
                <q-btn dense size="sm" rounded no-caps color="red" label="Batal" class="q-mb-sm"
                  style="min-width: 100px;" @click="batalva(item.nova)" :loading="store.loadingbatal && item.nova" />
              </div>
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
import { dateFullFormat, formatJam, formatRpDouble } from 'src/modules/formatter'
import { useFlagingVaStore } from 'src/stores/simrs/kasir/va/flagingva'

const emits = defineEmits(['flaging'])
const store = useFlagingVaStore()

function batalva(val) {
  store.batalva(val)
}
console.log('sasa', store.noreg)

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
