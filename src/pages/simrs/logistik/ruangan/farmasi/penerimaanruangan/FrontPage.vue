<template>
  <div class="q-pa-xs bg-white">
    <div class="row bg-primary text-white q-pa-sm q-mb-sm rouded-border">
      <div class="f-16 text-weight-bold">
        Halaman Penerimaan Ruangan
      </div>
    </div>
    <app-table-extend
      :columns="store.columns"
      :items="store.items"
      :meta="store.meta"
      :per-page="store.params.per_page"
      :loading="store.loading"
      :to-search="store.params.q"
      :click-able="true"
      :default-btn="false"
      :ada-tambah="false"
      :ada-filter="false"
      row-no
      use-full
      text-cari="Cari No. Permintaan / Nama Obat..."
      @find="store.setSearch"
      @goto="store.setPage"
      @set-row="store.setPerPage"
      @refresh="store.refreshTable"
      @on-click="onClick"
    >
      <!-- @edit-data="store.editData" -->
      <!--
            row-image="image"
            @delete-ids="table.deletesData"
            -->

      <template #header-left-after-search>
        <div class="row q-col-gutter-sm items-center q-ml-sm">
          <!-- Filter Depo Asal -->
          <div class="col-auto">
            <q-btn outline color="white" class="bg-primary text-white" no-caps dense>
              <div class="flex items-center q-mx-xs">
                <div class="f-12 q-mr-xs">
                  {{ store.depos.find(d => d.value === store.params.kdgudang)?.nama || 'Semua Depo' }}
                </div>
                <q-icon name="icon-mat-keyboard_arrow_down" size="16px" />
              </div>
              <q-menu>
                <q-list style="min-width: 200px">
                  <q-item
                    v-for="(dp, i) in store.depos"
                    :key="i"
                    clickable
                    v-close-popup
                    :active="store.params.kdgudang === dp.value"
                    active-class="bg-primary text-white"
                    @click="store.setGudang(dp.value)"
                  >
                    <q-item-section>{{ dp.nama }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- Filter Status -->
          <div class="col-auto">
            <q-btn outline color="white" class="bg-primary text-white" no-caps dense>
              <div class="flex items-center q-mx-xs">
                <div class="f-12 q-mr-xs">
                  {{ store.paramStatus?.nama || 'Semua Status' }}
                </div>
                <q-icon name="icon-mat-keyboard_arrow_down" size="16px" />
              </div>
              <q-menu>
                <q-list style="min-width: 200px">
                  <q-item
                    v-for="(st, i) in store.statuses"
                    :key="i"
                    clickable
                    v-close-popup
                    :active="store.paramStatus?.value === st.value"
                    active-class="bg-primary text-white"
                    @click="store.setParamStatus(st)"
                  >
                    <q-item-section>{{ st.nama }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- Filter Periode Tanggal -->
          <div class="col-auto">
            <q-btn outline color="white" class="bg-primary text-white" no-caps dense>
              <div class="flex items-center q-mx-xs">
                <div class="f-12 q-mr-xs">
                  Periode: {{ store.header?.periode || 'Semua' }}
                </div>
                <q-icon name="icon-mat-keyboard_arrow_down" size="16px" />
              </div>
              <q-menu>
                <div class="row no-wrap q-pa-sm">
                  <q-list style="min-width: 110px">
                    <q-item
                      v-for="item in store.periods"
                      :key="item"
                      clickable
                      v-close-popup="item !== 'Custom'"
                      :active="item === store.header?.periode"
                      active-class="bg-primary text-white"
                      @click="store.setPeriode(item)"
                    >
                      <q-item-section>{{ item }}</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator vertical inset />
                  <div class="column q-pa-xs">
                    <div class="row q-col-gutter-xs">
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
                          Dari: <b>{{ store.params.from || '-' }}</b>
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
                          Sampai: <b>{{ store.params.to || '-' }}</b>
                        </div>
                      </div>
                    </div>
                    <div class="row q-mt-xs justify-end">
                      <q-btn
                        label="Terapkan"
                        color="primary"
                        dense
                        size="sm"
                        v-close-popup
                        @click="store.getPermintaanDepo"
                      />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>

          <!-- Jenis Distribusi -->
          <div class="col-auto">
            <div class="row items-center text-white">
              <div class="q-mr-xs f-12 text-weight-medium">
                Jenis:
              </div>
              <div class="q-mr-xs">
                <q-radio
                  v-model="store.params.jenisdistribusi"
                  checked-icon="icon-mat-task_alt"
                  unchecked-icon="icon-mat-panorama_fish_eye"
                  val="non-konsinyasi"
                  label="Non-Konsinyasi"
                  keep-color
                  color="white"
                  dense
                  class="f-12"
                  :disable="store.loading"
                  @update:model-value="store.gantiJenisDistribusi"
                />
              </div>
              <div>
                <q-radio
                  v-model="store.params.jenisdistribusi"
                  checked-icon="icon-mat-task_alt"
                  unchecked-icon="icon-mat-panorama_fish_eye"
                  val="konsinyasi"
                  label="Konsinyasi"
                  keep-color
                  color="white"
                  dense
                  class="f-12"
                  :disable="store.loading"
                  @update:model-value="store.gantiJenisDistribusi"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #col-no_permintaan>
        <div>No Pemintaan</div>
      </template>
      <template #col-tgl_permintaan>
        <div>Tanggal Permintaan</div>
      </template>
      <template #col-dari>
        <div>Dari</div>
      </template>
      <template #col-jumlah>
        <div>Jumlah</div>
      </template>
      <template #col-user>
        <div>User Entri</div>
      </template>
      <template #col-act>
        <div>#</div>
      </template>
      <template #cell-tgl_permintaan="{ row }">
        <div class="row justify-between no-wrap">
          {{ row.tgl_permintaan ? dateFullFormat(row.tgl_permintaan):'-' }}
        </div>
      </template>
      <template #cell-no_permintaan="{ row }">
        <div class="row justify-between no-wrap q-mt-xs">
          <div class=" text-weight-bold">
            {{ row.no_permintaan }}
          </div>
        </div>
      </template>
      <template #cell-dari="{ row }">
        <div class="row justify-between no-wrap">
          {{ row.dari?depo(row?.dari) :'-' }}
        </div>
      </template>
      <template #cell-status="{ row }">
        <div class="row">
          <q-chip
            class="f-10"
            :color="color(row.flag)"
            :label="label(row.flag)"
            text-color="white"
          />
        </div>
      </template>
      <template #cell-user="{ row }">
        <div class="row">
          {{ row.user ? row.user.nama : '-' }}
        </div>
      </template>
      <template #cell-act="{ row }">
        <div v-if="row.flag==='4'">
          <q-btn
            flat
            icon="icon-mat-lock"
            dense
            color="negative"
            :loading="store.loadingKunci && row.no_permintaan === toloadBeli"
          >
            <!-- @click="kunci(row)" -->
            <q-tooltip
              class="primary"
              :offset="[10, 10]"
            >
              Sudah diterima
            </q-tooltip>
          </q-btn>
        </div>
        <div v-if="row.flag==='3'">
          <q-btn
            flat
            icon="icon-mat-move_to_inbox"
            dense
            color="primary"
            :loading="store.loadingSimpan && row.no_permintaan === toloadBeli"
            @click="kunci(row)"
          >
            <q-tooltip
              class="primary"
              :offset="[10, 10]"
            >
              Terima
            </q-tooltip>
          </q-btn>
        </div>

        <div
          v-else
          class="text-primary text-weight-bold"
        >
          <q-tooltip
            class="primary"
            :offset="[10, 10]"
          >
            Tidak Ada yang perlu dilakukan
          </q-tooltip>
        </div>
      </template>
      <template #expand="{ row }">
        <div v-if="row.permintaanrinci?.length">
          <div class="row items-center text-weight-bold">
            <div class="col-3 text-center">
              Obat
            </div>
            <div class="col-3 text-center">
              Stok
            </div>
            <div class="col-3 text-center">
              Jumlah
            </div>
            <div class="col-3 text-right">
              #
            </div>
          </div>
          <q-separator />
          <div
            v-for="(rin, i) in row.permintaanrinci"
            :key="i"
          >
            <div class="row items-center q-col-gutter-sm anu">
              <div class="col-3">
                <div class="row q-mt-xs">
                  <div
                    class="text-deep-purple text-weight-bold"
                  >
                    {{ rin.kdobat }}
                  </div>
                </div>
                <div class="row justify-between no-wrap q-mt-xs">
                  <div
                    class=" text-weight-bold"
                    style="white-space: wrap;"
                  >
                    {{ rin.masterobat ? rin.masterobat.nama_obat : '-' }}
                  </div>
                </div>
                <div class="row justify-between no-wrap q-mt-xs anu">
                  <div
                    class=" text-weight-bold"
                    :class="rin.masterobat.status_fornas === '1' ? 'text-green' : 'text-negative'"
                  >
                    {{ rin.masterobat.status_fornas === '1' ? 'Fronas' : 'Non-Fornas' }}
                  </div>
                  <div
                    class=" text-weight-bold"
                    :class="rin.masterobat.status_forkid === '1' ? 'text-green' : 'text-negative'"
                  >
                    {{ rin.masterobat.status_forkid === '1' ? 'Forkit' : 'Non-Forkit' }}
                  </div>
                  <div
                    class=" text-weight-bold"
                    :class="rin.masterobat.status_generik === '1' ? 'text-green' : 'text-negative'"
                  >
                    {{ rin.masterobat.status_generik === '1' ? 'Generik' : 'Non-Generik' }}
                  </div>
                </div>

                <div class="row justify-between no-wrap q-mt-xs anu f-10 text-italic">
                  <div class=" text-weight-bold">
                    ({{ rin.masterobat.satuan_k }})
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row justify-between no-wrap q-mt-xs text-purple">
                  <div class="q-mr-xs">
                    Ruangan
                  </div>
                  <div class="">
                    <div v-if="rin.stokreal">
                      <div v-if="rin.stokreal?.length">
                        {{ rin.stokreal.filter(x => x.kdruang === row.dari).map(a => parseFloat(a.stokdendiri)).reduce((a,
                                                                                                                        b) => a + b, 0) }}
                      </div>
                      <div v-if="!rin.stokreal?.length">
                        0
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row justify-between no-wrap q-mt-xs text-cyan">
                  <div class="q-mr-xs">
                    Max
                  </div>
                  <div class="">
                    {{ parseFloat(rin.mak_stok) }}
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row justify-between no-wrap q-mt-xs text-green">
                  <div class="q-mr-xs">
                    Permintaan
                  </div>
                  <div class="text-weight-bold">
                    {{ rin.jumlah_minta }}
                  </div>
                </div>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
        <div v-else>
          Tidak ada Rincian
        </div>
      </template>
    </app-table-extend>
  </div>
</template>

<script setup>
import { dateFullFormat } from 'src/modules/formatter'
import { useDistribusiPenerimaanRuanganStore } from 'src/stores/simrs/farmasi/penerimaanruangan/penerimaanruangan'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { onMounted, ref, watch } from 'vue'

const store = useDistribusiPenerimaanRuanganStore()
const apps = useAplikasiStore()
onMounted(() => {
  store.setForm('kddepo', apps?.user?.kdruangansim)
  store.setParams('kddepo', apps?.user?.kdruangansim)
  store.setParams('kdgudang', 'Gd-03010101')
  store.getInitialData()
})
watch(() => apps?.user?.kdruangansim, (obj) => {
  store.setForm('kddepo', obj)
  store.setParams('kddepo', obj)
})

function onClick (val) {
  // console.log('click', val)
  val.item.expand = !val.item.expand
  val.item.highlight = !val.item.highlight
}
function depo (val) {
  const temp = apps.ruangs.filter(a => a.kode === val)
  // console.log('temp', temp)
  if (temp?.length) {
    return temp[0].uraian
  }
  else {
    return val
  }
}

const toloadBeli = ref('')
function kunci (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  toloadBeli.value = val.no_permintaan
  const form = {
    no_permintaan: val.no_permintaan,
    kdruang: val.tujuan, // gudang
    tujuan: val.dari// depo
  }
  console.log('val', val, form)

  store.simpanDetail(form)
}
const color = val => {
  switch (val) {
    case 99:
      return 'white'
      // eslint-disable-next-line no-unreachable
      break
    case '':
      return 'negative'
      // eslint-disable-next-line no-unreachable
      break
    case '1':
      return 'cyan'
      // eslint-disable-next-line no-unreachable
      break
    case '2':
      return 'blue'
      // eslint-disable-next-line no-unreachable
      break
    case '3':
      return 'orange'
      // eslint-disable-next-line no-unreachable
      break
    case '4':
      return 'grey'
      // eslint-disable-next-line no-unreachable
      break
    case '5':
      return 'negative'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'red'
      // eslint-disable-next-line no-unreachable
      break
  }
}

const label = (status) => {
  switch (status) {
    case '':
      return 'Draft'
      // eslint-disable-next-line no-unreachable
      break
    case '1':
      return 'Permintaan dikirim ke Depo'
      // eslint-disable-next-line no-unreachable
      break
    case '2':
      return 'Diterima Depo'
      // eslint-disable-next-line no-unreachable
      break
    case '3':
      return 'Telah di distribusikan'
      // eslint-disable-next-line no-unreachable
      break
    case '4':
      return 'Diterima Ruangan'
      // eslint-disable-next-line no-unreachable
      break
    case '5':
      return 'Permintaan Ditolak'
      // eslint-disable-next-line no-unreachable
      break
    case 99:
      return 'Status belum di filter'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'Belum di definisikan'
      // eslint-disable-next-line no-unreachable
      break
  }
}

</script>

<style>
.box {
  white-space: normal !important;
  inline-size: 170px;
  overflow-wrap: break-word;
}
.rouded-border{
  border-radius: 5px;
}
</style>
