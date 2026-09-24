<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items?.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="item in items" :key="item.noreg" class="q-py-md">
          <q-item-section avatar>
            <app-avatar-pasien :pasien="item" />
          </q-item-section>

          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              <span class="text-weight-bold f-14">{{ item.pasien }}</span> | <span class="text-primary text-weight-bold">{{ item.norm }}</span>
            </q-item-label>
            <q-item-label>
              <span class="text-weight-bold">{{ item.noreg }}</span> |
              <span v-if="item?.noka">Noka: <span class="text-cyan text-weight-bold">{{ item?.noka }}</span> | </span>
              <span v-if="item?.nosep">SEP: <span class="text-deep-orange text-weight-bold">{{ item?.nosep }}</span></span>
            </q-item-label>
            <q-item-label>
              NIK: <span class="text-negative text-weight-bold">{{ item?.nktp ?? '-' }}</span> | Telp: <span class="text-teal text-weight-bold">{{ item?.nohp ?? '-' }}</span>
            </q-item-label>
            <q-item-label caption>
              USIA: <span class="text-weight-bold">{{ item.usia }}</span> | Kelamin: <span class="text-weight-bold">{{ item.kelamin }}</span>
            </q-item-label>
            <q-item-label class="text-grey-8">
              <span class="text-grey-6">Alamat:</span> {{ item?.alamat ?? '-' }}
            </q-item-label>
          </q-item-section>

          <q-separator vertical class="q-mx-md" />

          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              DPJP : <span class="text-negative text-weight-bold">{{ item.dokter ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              RUANGAN : <span class="text-teal text-weight-bold">{{ item.ruangan ?? item.poli ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              Tgl Masuk : <i class="text-weight-bold text-primary">{{ item.tglmasuk ? dateFullFormat(item.tglmasuk) : '-' }}</i>
            </q-item-label>
            <q-item-label>
              Tgl Pulang : <i class="text-weight-bold text-negative">{{ item.tglpulang ? dateFullFormat(item.tglpulang) : 'Masih Dirawat' }}</i>
            </q-item-label>
            <div class="row items-center q-gutter-xs q-mt-xs">
              <div>Penjamin : <span class="text-primary text-weight-bold">{{ item?.sistembayar ?? '-' }}</span></div>
              <q-badge
                v-if="item?.flag_verif_rm === '1'"
                color="positive"
                label="Verif RM"
                class="q-ml-sm"
              />
              <q-badge
                v-else
                color="orange-8"
                label="Belum Verif RM"
                class="q-ml-sm"
              />
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn
              dense
              size="sm"
              no-caps
              color="primary"
              label="Buka Dokumen"
              class="q-mb-sm q-px-md"
              icon-right="icon-mat-folder_open"
              style="min-width: 130px;"
              :loading="loadingTerima && store.noreg === item?.noreg"
              @click="emits('bukalayanan', item)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
import { dateFullFormat } from 'src/modules/formatter'
import { useKlaimRanapPenjaminanStore } from 'src/stores/simrs/penjaminan/klaimranap'

const emits = defineEmits(['bukalayanan'])
const store = useKlaimRanapPenjaminanStore()

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
  }
})
</script>
