<template>
  <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <!-- Header Block -->
    <div class="header bg-primary text-white">
      <div class="row items-center justify-between q-px-sm q-py-xs">
        <div class="f-14 text-weight-bold text-yellow">Kunjungan Pasien Depo Farmasi</div>
      </div>
      <q-tabs
        v-model="store.tab"
        dense
        class="bg-primary text-white"
        active-color="yellow"
        indicator-color="yellow"
        align="left"
        @update:model-value="onTabChange"
      >
        <q-tab name="rajal" label="Rawat Jalan" />
        <q-tab name="ranap" label="Rawat Inap" />
        <q-tab name="igd" label="IRD / IGD" />
      </q-tabs>

      <!-- q-bar filter bar -->
      <q-bar class="bg-primary text-white q-py-lg q-px-sm" style="height: auto; min-height: 50px;">
        <!-- Search Input -->
        <div class="q-mr-sm">
          <q-input
            v-model="store.params.q"
            outlined
            dark
            color="white"
            dense
            placeholder="Cari Pasien ..."
            @keyup.enter="store.getData()"
          >
            <template v-slot:append>
              <q-icon
                v-if="store.params.q"
                name="clear"
                class="cursor-pointer"
                @click="store.params.q = ''; store.getData()"
              />
              <q-icon
                name="search"
                class="cursor-pointer"
                @click="store.getData()"
              />
            </template>
          </q-input>
        </div>

        <!-- Custom Period Filter -->
        <q-btn
          v-if="store.tab !== 'ranap' || store.params.flag !== 'aktif'"
          outline
          class="bg-primary q-px-sm q-mr-sm"
          style="height: 40px;"
          no-caps
        >
          <div class="flex items-center q-mx-xs">
            <div class="f-12 q-mr-sm">
              {{ store.periode }}
            </div>
            <q-icon
              :name="showMenuPeriode ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              size="16px"
            />
          </div>

          <q-menu @show="showMenuPeriode = true" @hide="showMenuPeriode = false">
            <div class="row no-wrap q-pa-sm">
              <q-list style="min-width: 100px">
                <q-item
                  v-for="item in periods"
                  :key="item"
                  clickable
                  :active="item === store.periode"
                  active-class="bg-primary text-white"
                  @click="store.setPeriode(item)"
                >
                  <q-item-section>{{ item }}</q-item-section>
                </q-item>
              </q-list>
              <q-separator vertical inset class="q-mx-sm" />

              <div class="column">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <q-date
                      v-model="store.params.from"
                      minimal
                      bordered
                      flat
                      mask="YYYY-MM-DD"
                      @update:model-value="store.setPeriode('Custom')"
                    />
                    <div class="f-10 text-grey-8 q-mt-xs">
                      DARI TANGGAL : <b>{{ store.params.from }}</b>
                    </div>
                  </div>
                  <div class="col">
                    <q-date
                      v-model="store.params.to"
                      minimal
                      bordered
                      flat
                      mask="YYYY-MM-DD"
                      @update:model-value="store.setPeriode('Custom')"
                    />
                    <div class="f-10 text-grey-8 q-mt-xs">
                      SAMPAI TANGGAL : <b>{{ store.params.to }}</b>
                    </div>
                  </div>
                </div>
                <q-separator class="q-my-sm" />
                <div class="row justify-end">
                  <q-btn
                    v-close-popup
                    color="primary"
                    label="Terapkan"
                    push
                    size="sm"
                    @click="store.getData()"
                  />
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>

        <!-- Status Filter -->
        <q-select
          v-model="store.params.flag"
          dense
          outlined
          dark
          color="white"
          :options="statusOptions"
          label="Status Pasien"
          class="q-mr-sm"
          emit-value
          map-options
          style="min-width: 150px;"
          @update:model-value="store.getData()"
        />

        <!-- Poliklinik Filter (Rajal Only) -->
        <q-select
          v-if="store.tab === 'rajal'"
          v-model="store.params.poli"
          dense
          outlined
          dark
          color="white"
          multiple
          use-chips
          emit-value
          map-options
          :options="appStore.polis"
          option-label="polirs"
          option-value="kodepoli"
          label="Filter Poliklinik"
          class="q-mr-sm"
          style="min-width: 180px; max-width: 250px;"
          @update:model-value="store.getData()"
        />

        <!-- Ruangan Filter (Ranap Only) -->
        <q-select
          v-if="store.tab === 'ranap'"
          v-model="store.params.ruangan"
          dense
          outlined
          dark
          color="white"
          multiple
          use-chips
          emit-value
          map-options
          :options="appStore.ruangs"
          option-label="uraian"
          option-value="kode"
          label="Filter Ruangan"
          class="q-mr-sm"
          style="min-width: 180px; max-width: 250px;"
          @update:model-value="store.getData()"
        />

        <!-- Sistem Bayar Filter -->
        <q-select
          v-model="store.params.sistemBayar"
          dense
          outlined
          dark
          color="white"
          :options="sistemBayarOptions"
          label="Group Sistembayar"
          class="q-mr-sm"
          emit-value
          map-options
          style="min-width: 160px;"
          clearable
          @update:model-value="store.getData()"
        />

        <q-space />

        <!-- Refresh Button -->
        <q-btn
          unelevated
          round
          size="sm"
          icon="refresh"
          @click="store.getData()"
        >
          <q-tooltip class="bg-primary text-white" :offset="[10, 10]">
            Refresh Data
          </q-tooltip>
        </q-btn>
      </q-bar>
    </div>

    <!-- Data List inside Scroll Area in Card -->
    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 50px);">
        <component
          :is="activeTabComponent"
          :items="store.items"
          :loading="store.loading"
        />
      </q-scroll-area>

      <!-- Bottom Pagination Bar -->
      <div class="absolute-bottom bg-primary text-white z-top">
        <div class="row items-center justify-between q-pa-sm">
          <div class="row items-center">
            <q-btn
              flat
              color="white"
              icon="skip_previous"
              size="sm"
              round
              :disable="store.params.page === 1"
              @click="store.goToPage(1)"
            />
            <q-btn
              flat
              color="white"
              icon="chevron_left"
              size="sm"
              round
              :disable="store.params.page === 1"
              @click="store.goToPage(store.params.page - 1)"
            />
            <div class="q-px-sm">
              <div v-if="store.params.rowsNumber !== 0">
                | <span class="q-px-sm">Hal <span class="text-yellow text-weight-bold">{{ store.params.page }}</span> dari {{ maxPages }} Hal</span> |
              </div>
              <div v-else>
                Tidak Ada Data
              </div>
            </div>
            <q-btn
              flat
              color="white"
              icon="chevron_right"
              size="sm"
              round
              :disable="store.params.page === maxPages"
              @click="store.goToPage(store.params.page + 1)"
            />
            <q-btn
              flat
              color="white"
              icon="skip_next"
              size="sm"
              round
              :disable="store.params.page === maxPages"
              @click="store.goToPage(maxPages)"
            />
          </div>
          <div class="row items-center q-gutter-sm">
            <div class="f-12">Tampilkan:</div>
            <q-select
              v-model="store.params.per_page"
              :options="[10, 20, 50, 100]"
              dense
              outlined
              dark
              color="white"
              options-cover
              style="width: 80px;"
              @update:model-value="store.setPerPage"
            />
            <div class="q-ml-md text-weight-bold text-yellow">{{ store.params.rowsNumber }} DATA DITEMUKAN</div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useKunjunganPasienDepoStore } from 'src/stores/simrs/farmasi/kunjungan/kunjunganPasien'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useStyledStore } from 'src/stores/app/styled'
import TabRajal from './comp/TabRajal.vue'
import TabRanap from './comp/TabRanap.vue'
import TabIgd from './comp/TabIgd.vue'

const store = useKunjunganPasienDepoStore()
const appStore = useAplikasiStore()
const style = useStyledStore()

const showMenuPeriode = ref(false)
const periods = ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom']

const activeTabComponent = computed(() => {
  if (store.tab === 'ranap') return TabRanap
  if (store.tab === 'igd') return TabIgd
  return TabRajal
})

const maxPages = computed(() => {
  return Math.ceil(store.params.rowsNumber / store.params.per_page) || 1
})

const sistemBayarOptions = [
  { label: 'Semua', value: '' },
  { label: 'JKN / BPJS', value: '1' },
  { label: 'Mandiri / Umum', value: '2' },
  { label: 'Tagihan / Kontraktor', value: '3' }
]

const statusOptions = computed(() => {
  if (store.tab === 'ranap') {
    return [
      { label: 'Semua', value: 'all' },
      { label: 'Aktif (Belum Pulang)', value: 'aktif' },
      { label: 'Sudah Pulang', value: 'pulang' }
    ]
  }
  return [
    { label: 'Semua', value: 'all' },
    { label: 'Belum Terlayani', value: '' },
    { label: 'Terlayani', value: '1' }
  ]
})

function onTabChange (val) {
  store.setTab(val)
}

onMounted(() => {
  store.resetParams()
  store.getData()
})
</script>
