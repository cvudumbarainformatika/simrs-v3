<template>
  <q-dialog class="q-mt-xl" @hide="hiddenDialog()" @show="init()" backdrop-filter="blur(4px)" persistent>
    <q-card style="min-width:70vw; min-height:20vw;">
      <q-card-section class="row items-center">
        <div class="column">
          <div class="f-14 text-weight-bold">
            PILIH DATA SERAHTERIMA
          </div>
          <div class="f-10">
            Pencarian Data Serahterima Berdasarkan Nomor Serahterima Pekerjaan
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup icon="icon-mat-clear" flat round dense />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list>
          <template v-if="carisrt.loading === false">
            <q-table class="my-sticky-header" wrap-cells :rows="carisrt.bastsigarang" :columns="columns" row-key="name"
              @request="carisrt.onRequest" v-model:pagination="carisrt.reqs" :filter="carisrt.reqs.q"
              :loading="carisrt.loading" :rows-per-page-options="[50, 100, 200, 500]">
              <template #top-left>
                <div class="flex q-qutter-sm z-top">
                  <div>
                    <q-input v-model="carisrt.reqs.q" outlined dark color="white" dense placeholder="Cari BAST ..."
                      debounce="500" style="min-width: 200px;" @keyup.enter="carisrt.goToPage(1)">
                      <template v-if="carisrt.reqs.q" #append>
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
                <q-tr :props="props">
                  <q-td key="nobast" :props="props">
                    <div class="text-teal text-bold" style="font-size: 1em">
                      No. Penerimaan {{ props.row.no_penerimaan }}
                    </div>
                    <div class="q-pl-sm" style="font-size: 0.9em">No. Bast {{ props.row.no_bast }}</div>
                  </q-td>
                  <q-td key="tgltrans" :props="props">
                    {{ props.row.tanggal_bast }}
                  </q-td>
                  <q-td key="namaperusahaan" :props="props">
                    {{ props.row.perusahaan?.nama }}
                  </q-td>
                  <q-td key="nominalpembayaran" :props="props">
                    {{ formattanpaRp(props.row.nilai_tagihan) }}
                  </q-td>
                  <q-td>
                    <div class="row justify-end">
                      <!-- <q-btn outline size="sm" class="q-px-md" label="Pilih"
                        @click="pilihDataSerahterima(props?.row) && gantibotton(props?.row)" /> -->
                      <q-btn outline size="sm" class="q-px-md" label="Pilih"
                        @click="pilihDataSerahterima(props?.row)" />
                      <!-- <q-btn v-else outline size="sm" class="q-px-md" label="Sudah NPD" :disable="store.disabled" /> -->
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </template>
          <template v-else-if="store.form.kodepenerima === null">
            <div class="full-heigh">
              <div class="text-center q-pa-md">
                Silahkan Pilih Pihak Ketiga Telebih Dahulu.
              </div>
            </div>
          </template>
          <template v-else>
            <div class="full-heigh">
              <q-inner-loading :showing="carisrt.loading">
                <div class="q-pa-xl full-height"> <q-spinner-gears size="50px" color="primary" /> Memuat
                  data...
                </div>
              </q-inner-loading>
              <div v-if="!carisrt.loading" class="text-center q-pa-md">
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
import { onMounted, ref } from 'vue'
import { formattanpaRp } from 'src/modules/formatter'
import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls'
import { dataBastSigarangStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastsigarang'

const carisrt = dataBastSigarangStore()
const store = formInputNpdlsStore()
function hiddenDialog() {
  console.log('hidden dialog')
}
onMounted(() => {
  console.log('store reqs', carisrt?.reqs)
})
const columnsx = [
  {
    name: 'nobast',
    label: 'No BAST',
    align: 'left',
    field: row => [row.no_penerimaan, row.no_bast]
  },
  {
    name: 'tgltrans',
    label: 'Tanggal',
    align: 'left',
    field: 'tgltrans'
  },
  {
    name: 'namaperusahaan',
    label: 'Pihak Ketiga',
    align: 'left',
    field: 'perusahaan'
  },
  {
    name: 'nominalpembayaran',
    label: 'Nilai',
    align: 'center',
    field: 'nilai_tagihan'
  },

  {
    name: 'Opsi',
    label: 'Opsi',
    align: 'center'
  }
]
const columns = ref(columnsx)

const init = () => {
  carisrt.listBastSigarang()
}
const clearSearch = () => {
  carisrt.reqs.q = ''
  carisrt.goToPage(1)
}

function pilihDataSerahterima(row) {
  console.log('row stp pekerjaan', row)
  store.reqs.bast = row?.reff

  store.form.noserahterima = row?.reff

  store.transallserahterima = row?.details
  // console.log('form', store.form)
  store.openDialogSigarang = false
  store.disabled = true
}

// function gantibotton(row) {
//   const bast_id = row?.bast_r_id
//   const transall = store.transall

//   let simpandata = true
//   const hasil = transall.find((x) => x?.bast_r_id === bast_id) ?? null
//   if (hasil) {
//     simpandata = false
//     store.hidden = true
//   } else {
//     simpandata = true
//   }
//   // console.log('row', transall)
//   return simpandata



// }
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
