<template>
  <q-page class="q-pa-sm q-mb-xl">
    <div>
      <!-- <app-box-caption /> -->
      <app-card :is-header="false">
        <template #content>
          <app-table title="Data Volume Sediaan" :columns="table.columns" :column-hide="table.columnHide"
            :items="table.items" :meta="table.meta" :per-page="table.params.per_page" :order-by="table.params.order_by"
            :sort="table.params.sort" :loading="table.loading" :to-search="table.params.q" @goto="table.setPage"
            @set-row="table.setPerPage" @refresh="table.refreshTable" @find="table.setSearch" @set-order="table.setOder"
            @new-data="store.newData" @edit-data="store.editData" @delete="table.deletesData">
            <!-- @edit-data="store.editData" -->
            <!--
            row-image="image"
            @delete-ids="table.deletesData"
            -->
            <template #header-left-after-search>
              <div class="row q-ml-xs">
                <q-checkbox v-model="table.params.status_prb" label="Obat PRB Saja"
                  @update:model-value="table.refreshTable" />
              </div>
            </template>
            <template #col-obat>
              <div>Nama Obat</div>
            </template>
            <template #col-nama>
              <div>Sediaan</div>
            </template>
            <template #col-kelompok>
              <div>Kelompok</div>
            </template>
            <template #col-belanja>
              <div>Kode Belanja Obat</div>
            </template>
            <template #col-status>
              <div>Status</div>
            </template>
            <template #col-bayar>
              <div>Sistem bayar</div>
            </template>
            <template #col-satuan>
              <div>Satuan</div>
            </template>
            <template #cell-obat="{ row }">
              <div class="row box-tiga">
                <div class="col-12 text-weight-bold">
                  {{ row.nama_obat }}
                </div>
                <div class="col-12 text-italic f-10">
                  {{ row.kd_obat }}
                </div>
                <div v-if="row.kode_bpjs" class="col-12 text-italic f-10">
                  Kode Bpjs {{ row.kode_bpjs }}
                </div>
              </div>
            </template>
            <template #cell-nama="{ row }">
              <div v-if="row.kekuatan_dosis" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <app-chip outline ada-tooltip tooltip="Dosis" :label="row.kekuatan_dosis" />
              </div>
              <div v-if="row.volumesediaan" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <app-chip outline ada-tooltip tooltip="Volume" :label="row.volumesediaan" />
              </div>
              <div v-if="row.bentuk_sediaan" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <app-chip outline ada-tooltip tooltip="Bentuk Sediaan" :label="row.bentuk_sediaan" />
              </div>
              <div v-if="row.merk" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <app-chip outline ada-tooltip tooltip="Merk" :label="row.merk" />
              </div>
              <div v-if="row.jenis_perbekalan" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <app-chip font="f-10" square ada-tooltip tooltip="Perbekalan"
                  :outline="row.jenis_perbekalan.includes('Reagen') || row.jenis_perbekalan.includes('Alkes') ? true : false"
                  :label="row.jenis_perbekalan" />
              </div>
            </template>
            <template #cell-kelompok="{ row }">
              <div v-if="row.kelompok_psikotropika" class="row box justify-between items-center no-wrap q-mb-sm">
                <div>
                  Napza
                </div>
                <div class="q-ml-xs text-weight-bold text-right"
                  :class="row.kelompok_psikotropika === '1' ? 'text-red' : 'text-green'">
                  {{ row.kelompok_psikotropika === '1' ? 'YA' : 'TIDAK' }}
                </div>
              </div>
              <div v-if="row.kandungan" class="row box justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Kandungan
                </div>
                <div class=" q-ml-xs text-weight-bold text-right">
                  {{ row.kandungan }}
                </div>
              </div>
              <div v-if="row.indikasi?.length" class="row items-center box justify-between no-wrap q-mb-sm">
                <div>
                  Indikasi
                </div>
                <div>
                  <div v-for="(te, i) in row.indikasi" :key="i" class="text-italic text-right q-mb-xs">
                    <!-- {{ i+1 }}. -->
                    {{ te.indikasi }}
                    <!-- <app-chip
                      outline
                      square
                      color="dark"
                      :label="te.kelas_terapi "
                    /> -->
                  </div>
                </div>
              </div>
              <div v-if="row.mkelasterapi?.length" class="row items-center box justify-between no-wrap q-mb-sm">
                <div>
                  Terapi
                </div>
                <div>
                  <div v-for="(te, i) in row.mkelasterapi" :key="i" class="text-weight-bold text-right q-mb-xs">
                    <!-- {{ i+1 }}. -->
                    {{ te.kelas_terapi }}
                    <!-- <app-chip
                      outline
                      square
                      color="dark"
                      :label="te.kelas_terapi "
                    /> -->
                  </div>
                </div>
              </div>
              <div v-if="row.kelas_terapi" class="row box justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Jenis Produk
                </div>
                <div class=" q-ml-xs text-weight-bold text-right">
                  {{ row.kelas_terapi }}
                </div>
              </div>
              <div v-if="row.kelompok_penyimpanan" class="row box justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Penyimpanan
                </div>
                <div class=" q-ml-xs text-weight-bold text-right">
                  {{ row.kelompok_penyimpanan }}
                </div>
              </div>
              <div v-if="row.kelompok_rko" class="row box justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  RKO
                </div>
                <div class=" q-ml-xs text-weight-bold text-right">
                  {{ row.kelompok_rko }}
                </div>
              </div>
            </template>
            <template #cell-belanja="{ row }">
              <div v-if="row.uraian108" class="row box-dua justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  108
                </div>
                <div class="text-right">
                  {{ row.uraian108 }}
                </div>
              </div>
              <div v-if="row.uraian50" class="row box-dua justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  50
                </div>
                <div class="text-right">
                  {{ row.uraian50 }}
                </div>
              </div>
            </template>
            <template #cell-satuan="{ row }">
              <div v-if="row.satuan_b" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <div class="col-7">
                  besar
                </div>
                <div class="col-5 text-weight-bold">
                  {{ row.satuan_b }}
                </div>
              </div>
              <div v-if="row.satuan_k" class="row box-tiga q-col-gutter-sm q-mb-sm">
                <div class="col-7">
                  kecil
                </div>
                <div class="col-5 text-weight-bold">
                  {{ row.satuan_k }}
                </div>
              </div>
            </template>
            <template #cell-status="{ row }">
              <div class="row box-tiga justify-between items-center q-mb-sm">
                <div v-if="row.status_generik === '1'" class="text-weight-bold text-green q-mx-xs">
                  Generik
                </div>
                <div v-if="row.status_fornas === '1'" class="text-weight-bold text-green q-mx-xs">
                  Fornas
                </div>
                <div v-if="row.status_forkid === '1'" class="text-weight-bold text-green q-mx-xs">
                  Forkit
                </div>
                <div v-if="row.status_kronis === '1'" class="text-weight-bold text-negative q-mx-xs">
                  Obat Kronis
                </div>
                <div v-if="row.status_prb === '1'" class="text-weight-bold text-green q-mx-xs">
                  Obat PRB
                </div>
                <div v-if="row.obat_program === '1'" class="text-weight-bold text-green q-mx-xs">
                  Obat Program
                </div>
                <div v-if="row.obat_donasi === '1'" class="text-weight-bold text-green q-mx-xs">
                  Obat Donasi
                </div>
                <div v-if="row.obat_kebijakan === '1'" class="text-weight-bold text-green q-mx-xs">
                  Obat Kebijakan
                </div>
                <div v-if="row.status_konsinyasi === '1'" class="text-weight-bold text-orange q-mx-xs">
                  Konsinyasi
                </div>
              </div>
              <!-- <div v-if="row.status_generik === '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Generik
                </div>

              </div> -->
              <!-- <div v-if="row.status_fornas === '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class=" text-weight-bold text-green">
                  Fornas
                </div>
              </div> -->
              <!-- <div v-if="row.status_forkid === '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class=" text-weight-bold text-green">
                  Forkit
                </div>
              </div> -->
              <!-- <div v-if="row.status_kronis === '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Obat Kronis
                </div>
              </div> -->
              <div v-if="row.keterangan_kronis" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Restriksi Fornas
                </div>
                <div class="text-right text-italic" style="white-space: normal;">
                  {{ row.keterangan_kronis }}
                </div>
              </div>
              <!-- <div v-if="row.status_prb === '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Obat PRB
                </div>
              </div> -->
              <!-- <div v-if="row.obat_program === '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Obat Program
                </div>
              </div> -->
              <!-- <div v-if="row.obat_donasi == '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Obat Donasi
                </div>
              </div> -->
              <!-- <div v-if="row.obat_kebijakan == '1'" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Obat Kebijakan
                </div>
              </div> -->
              <!-- <div v-if="row.status_konsinyasi == '1'"
                class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold text-green">
                  Konsinyasi
                </div>
              </div> -->
              <div v-if="row.nilai_kdn" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Nilai TKDN
                </div>
                <div class="text-right">
                  {{ row.nilai_kdn }}
                </div>
              </div>
              <div v-if="row.sertifikatkdn" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Sertifikat TKDN
                </div>
                <div class="text-right">
                  {{ row.sertifikatkdn }}
                </div>
              </div>
              <div v-if="row.sistembayar" class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="">
                  Sistem Bayar
                </div>
                <div class="text-right text-weight-bold" :class="sisBay(row.sistembayar)">
                  {{ row.sistembayar }}
                </div>
              </div>
              <div class="row box-tiga justify-between items-center no-wrap q-mb-sm">
                <div class="text-weight-bold">
                  {{ gudang(row?.gudang) }}
                </div>
              </div>
            </template>
            <template #left-acttion="{ row }">
              <div v-if="row?.status_prb == '1'">
                <q-btn flat class="" size="sm" round color="green" icon="icon-mat-backup_table" @click="() => {
                  table.mapingBpjs.isOpen = true
                  table.mapingBpjs.item = row
                }">
                  <q-tooltip anchor="top middle" self="center middle">
                    Maping ke kode obat bpjs
                  </q-tooltip>
                </q-btn>
              </div>
            </template>
          </app-table>
        </template>
      </app-card>
    </div>
    <!-- dialog -->
    <formDialog v-model="store.isOpen" />
    <FormMapingBpjs v-model="table.mapingBpjs.isOpen" />
  </q-page>
</template>
<script setup>
import { useMasterObatForm } from 'src/stores/simrs/master/farmasi/obat/form'
import { useMasterObatTable } from 'src/stores/simrs/master/farmasi/obat/table'
import formDialog from './FormDialog.vue'
import { defineAsyncComponent } from 'vue'

const FormMapingBpjs = defineAsyncComponent(() => import('./FormMapingBpjs.vue'))

const table = useMasterObatTable()
const store = useMasterObatForm()
table.getDataTable()
store.getInitialData()
function sisBay (val) {
  switch (val) {
    case 'UMUM':
      return 'text-indigo'

    case 'BPJS':
      return 'text-green'

    default:
      return ''
  }
}
function gudang (val) {
  const gud = store.optionGudangs.find(x => x.value === val)

  return gud?.label ?? '-'
}
</script>
<style lang="scss" scoped>
.q-table td div.box {
  white-space: normal !important;
  inline-size: 250px;
  overflow-wrap: break-word;
}

.q-table td div.box-dua {
  white-space: normal !important;
  inline-size: 200px;
  overflow-wrap: break-word;
}

.q-table td div.box-tiga {
  white-space: normal !important;
  inline-size: 150px;
  overflow-wrap: break-word;
}

.q-table td {
  white-space: normal !important;
  overflow-wrap: break-word;
}
</style>
