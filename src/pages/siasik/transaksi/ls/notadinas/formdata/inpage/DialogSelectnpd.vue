<template>
  <q-dialog class="q-mt-xl" @hide="hiddenDialog()" @show="init()" backdrop-filter="blur(4px)" persistent>
    <q-card style="min-width:70vw; min-height:15vw;">
      <q-card-section class="row items-center">
        <div class="column">
          <div class="f-14 text-weight-bold">
            PILIH DATA NPD-LS
          </div>
          <div class="f-10">
            Pencarian Data NPD-LS
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup icon="icon-mat-clear" flat round dense />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list>
          <template v-if="store.datanpd.length !== 0">
            <q-table class="my-sticky-header" wrap-cells :rows="store.datanpd" :columns="columns" row-key="name"
              @request="store.onRequest" v-model:pagination="store.params" :filter="store.params.q"
              :loading="store.loading" :rows-per-page-options="[50, 100, 200, 500]">
              <template #top-left>
                <div class="flex q-qutter-sm z-top">
                  <div>
                    <q-input v-model="store.params.q" outlined dark color="white" dense
                      placeholder="Cari Data NPD-LS ..." debounce="500" style="min-width: 200px;"
                      @keyup.enter="store.goToPage(1)">
                      <template v-if="store.params.q" #append>
                        <q-icon name="icon-mat-close" size="xs" class="cursor-pointer"
                          @click.stop.prevent="clearSearch" />
                      </template>
                      <template #prepend>
                        <q-icon size="sm" name="icon-mat-search" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </template>
              <template #body="props">
                <!-- <q-tr :props="props" v-if="gantibotton(props?.row)"> -->
                <q-tr :props="props">
                  <q-td key="nonpdls" :props="props">
                    <div class="text-teal text-bold">
                      No NPD-LS : {{ props.row.nonpdls }}
                    </div>
                    <div class="q-pl-sm" style="font-size: 0.9em">Serahterima: {{ props.row.noserahterima }}</div>
                  </q-td>
                  <q-td key="kegiatanblud" :props="props">
                    <div class="text-bold">
                      {{ props.row.kegiatanblud }}
                    </div>
                    <div class="q-pl-sm" style="font-size: 0.9em">Keterangan: {{ props.row.keterangan }}</div>
                  </q-td>
                  <q-td key="total" :props="props">
                    {{ formattanpaRp(props.row.total) }}
                  </q-td>
                  <q-td>
                    <div class="row justify-end">
                      <!-- <q-btn outline size="sm" class="q-px-md" label="Pilih"
                        @click="pilihDataSerahterima(props?.row) && gantibotton(props?.row)" /> -->
                      <!-- <q-btn v-if="gantibotton(props?.row)" outline size="sm" class="q-px-md" label="Pilih"
                        @click="pilihDataSerahterima(props?.row)" /> -->
                      <q-btn outline size="sm" class="q-px-md" label="Pilih" @click="pilhDatanpd(props?.row)" />
                      <!-- <q-btn v-else outline size="sm" class="q-px-md" label="Sudah NPD" :disable="store.disabled" /> -->
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </template>
          <template v-else>
            <div class="full-heigh">
              <q-inner-loading :showing="store.loading">
                <div class="q-pa-xl full-height"> <q-spinner-gears size="50px" color="primary" /> Memuat
                  data...
                </div>
              </q-inner-loading>
              <div v-if="!store.loading" class="text-center q-pa-md">
                Tidak ada data yang ditemukan.
              </div>
            </div>
          </template>

        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { formattanpaRp } from 'src/modules/formatter'
import { useFormNotadinasStore } from 'src/stores/siasik/transaksi/ls/notadinas/form'

const store = useFormNotadinasStore()
function hiddenDialog() {
  console.log('hidden dialog')
}
const columnsx = [
  {
    name: 'nonpdls',
    label: 'No NPD-LS',
    align: 'left',
    field: row => [row.nonpdls, row.noserahterima]
  },
  {
    name: 'kegiatanblud',
    label: 'Kegiatan BLUD',
    align: 'left',
    field: row => [row.kegiatanblud, row.keterangan]
  },
  {
    name: 'total',
    label: 'Nilai',
    align: 'center',
    field: 'total'
  },
  {
    name: 'Opsi',
    label: 'Opsi',
    align: 'center'
  }
]
const columns = ref(columnsx)

const init = () => {
  store.getDataNpdls()
}
const clearSearch = () => {
  store.params.q = ''
  store.goToPage(1)
}

function pilhDatanpd(row) {
  store.rinci.nonpdls = row?.nonpdls
  store.rinci.tglnpd = row?.tglnpdls
  store.rinci.kegiatan = row?.kegiatan
  store.rinci.kodekegiatanblud = row?.kodekegiatanblud
  store.rinci.kegiatanblud = row?.kegiatanblud
  store.rinci.nokontrak = row?.nokontrak
  store.rinci.noserahterima = row?.noserahterima
  store.rinci.total = row?.total

  // Untuk Jenis Rekening Belanja
  store.rinci.kodebelanja = row?.kode

  console.log('store.rinci', store.rinci)

  store.openDialog = false
  store.disabled = true
}

function gantibotton(row) {
  const bast_id = row?.bast_r_id
  const transall = store.transall

  let simpandata = true
  const hasil = transall.find((x) => x?.bast_r_id === bast_id) ?? null
  if (hasil) {
    simpandata = false
    store.hidden = true
  } else {
    simpandata = true
  }
  // console.log('row', transall)
  return simpandata


}
</script>
<style lang="scss">
.my-sticky-header {
  /* height or max-height is important */
  height: 100%;

  div.q-table__top,
  .q-table__bottom,
  tr:first-child th {
    background-color: $dark;
    color: $white;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    // border-width: 0;
  }

  tr:first-child th {
    // border-top: 1px solid $white;
    background-color: $grey-4;
    color: $dark;
  }

  //   /* bg color is important for th; just specify one */

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }

  // /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px
  }

  // /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 100px !important;
  }

  .q-table__bottom .q-field__native,
  .q-table__bottom .q-field__inner .q-field__control .q-anchor--skip,
  i.q-icon {
    color: $grey-4;
  }

}
</style>
