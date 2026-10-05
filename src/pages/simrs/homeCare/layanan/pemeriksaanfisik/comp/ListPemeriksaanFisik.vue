<template>
  <q-card flat bordered square class="full-height column">
    <q-card-section class="q-px-md q-py-xs bg-dark text-white col-auto">
      <div class="row items-center justify-between">
        <div class="f-12 text-weight-bold">
          Riwayat Pemeriksaan Fisik & TTV Pasien
        </div>
        <div class="f-10 text-grey-4">
          Total: {{ listItems.length }}
        </div>
      </div>
    </q-card-section>
    <q-separator />

    <q-card-section class="col scroll q-pa-sm">
      <div v-if="!listItems.length" class="column flex-center text-grey-6 q-pa-xl">
        <q-icon name="icon-mat-assignment_late" size="48px" />
        <div class="q-mt-sm f-12">Belum ada data pemeriksaan fisik pada kunjungan ini</div>
      </div>

      <div v-else class="q-gutter-y-sm">
        <q-card
          v-for="(item, i) in listItems"
          :key="i"
          bordered
          flat
          class="bg-grey-1"
        >
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between q-mb-xs">
              <div class="text-caption text-weight-bold text-primary">
                {{ item.rs3 || item.created_at || '-' }}
              </div>
              <div class="row q-gutter-xs">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  color="warning"
                  icon="icon-mat-edit"
                  @click="store.setEdit(item)"
                >
                  <q-tooltip>Edit Data</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  color="negative"
                  icon="icon-mat-delete"
                  @click="confirmHapus(item)"
                >
                  <q-tooltip>Hapus Data</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- Chips Ringkasan TTV -->
            <div class="row q-gutter-xs q-mb-xs">
              <q-badge color="primary" outline>
                KU: {{ item.keadaan_umum || '-' }}
              </q-badge>
              <q-badge v-if="item.sistole || item.diastole" color="indigo" outline>
                TD: {{ item.sistole || '-' }}/{{ item.diastole || '-' }} mmHg
              </q-badge>
              <q-badge v-if="item.rs4" color="teal" outline>
                N: {{ item.rs4 }} x/m
              </q-badge>
              <q-badge v-if="item.pernapasan" color="cyan" outline>
                RR: {{ item.pernapasan }} x/m
              </q-badge>
              <q-badge v-if="item.suhutubuh" color="orange" outline>
                Suhu: {{ item.suhutubuh }} °C
              </q-badge>
              <q-badge v-if="item.beratbadan" color="deep-purple" outline>
                BB: {{ item.beratbadan }} kg
              </q-badge>
              <q-badge v-if="item.tinggibadan" color="purple" outline>
                TB: {{ item.tinggibadan }} cm
              </q-badge>
              <q-badge v-if="item.kesadaran" color="secondary" outline>
                Kesadaran: {{ item.kesadaran }} (GCS: {{ item.tingkatkesadaran || '-' }})
              </q-badge>
              <q-badge v-if="item.scorenyeri != null" color="negative" outline>
                Nyeri: {{ item.scorenyeri }} ({{ item.keteranganscorenyeri || '-' }})
              </q-badge>
            </div>

            <!-- Detail Lainnya -->
            <div class="text-caption text-grey-8 q-mt-xs">
              <div v-if="item.statuspsikologis">
                <b>Psikologis:</b> {{ item.statuspsikologis }}
              </div>
              <div v-if="item.statusneurologis">
                <b>Neurologis:</b> {{ item.statusneurologis }}
              </div>
              <div v-if="item.muakuloskeletal">
                <b>Muskuloskeletal:</b> {{ item.muakuloskeletal }}
              </div>
              <div v-if="item.sosialekonomi">
                <b>Sosial Ekonomi:</b> {{ item.sosialekonomi }}
              </div>
              <div v-if="item.spiritual">
                <b>Spiritual:</b> {{ item.spiritual }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { usePemeriksaanFisikHomeCare } from 'src/stores/simrs/homeCare/pemeriksaanfisik'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePemeriksaanFisikHomeCare()
const $q = useQuasar()

const listItems = computed(() => {
  return props.pasien?.pemeriksaanfisik ?? []
})

function confirmHapus (item) {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data pemeriksaan fisik ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(props.pasien, item.id)
  })
}
</script>
