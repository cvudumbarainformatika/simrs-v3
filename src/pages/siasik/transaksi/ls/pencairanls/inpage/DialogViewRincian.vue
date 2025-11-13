<template>
  <q-dialog class="full-width q-mt-lg" @hide="hiddenDialog()" backdrop-filter="blur(4x)" persistent>
    <q-card style="min-width:50vw;">
      <q-card-section class="row items-center">
        <div class="column">
          <div class="f-14 text-weight-bold">
            NPK LS
          </div>
          <div class="f-12">
            Data Rincian NPK-LS
          </div>
        </div>
        <q-space />

        <q-btn v-close-popup icon="icon-mat-clear" flat round dense />
      </q-card-section>
      <q-card-section>
        <div class="row q-pa-sm q-col-gutter-md">
          <div class="col q-gutter-y-md">
            <app-input-date-human label="Tanggal Pencairan" :model="store.form.tglpencairan" icon="icon-mat-event"
              outlined :autofocus="false" :disable="store.disabled || store.loading" @db-model="tglpencairan"
              :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
          </div>
          <div class="col q-gutter-y-md">
            <app-input-date-human label="Tanggal Pindah Buku" :model="store.form.tglpindahbuku" icon="icon-mat-event"
              outlined :autofocus="false" :disable="store.disabled || store.loading" @db-model="tglpindahbuku"
              :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
          </div>
        </div>
        <div class="row q-pa-sm q-col-gutter-md">
          <div class="col q-gutter-y-md">
            <q-btn class="q-mr-sm" color="primary" label="Pencairan" :disable="loading" :loading="loading"
              @click="verifikasiSemua">
              <q-icon class="q-pl-xs" name="icon-mat-task_alt"> </q-icon>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section>

        <q-table class="my-sticky-table" :rows="store.listrinci" :columns="columns" row-key="name" wrap-cells
          :disable="store.loading" :loading="store.loading" :rows-per-page-options="[0]" :rows-number="[0]">
          <template #body="props">
            <q-tr>
              <q-td key="nonpdls" :props="props">
                <q-badge color="green">
                  {{ props.row?.nonpdls }}
                </q-badge>
                <div>{{ props.row?.tglnpd }}</div>
              </q-td>
              <q-td key="kegiatan" :props="props">
                <!-- <q-badge color="teal">
                  {{ props.row?.kegiatanblud }}
                </q-badge> -->
                <div>{{ props.row?.kegiatanblud }}</div>
              </q-td>
              <q-td key="nilai" :props="props">
                <q-badge size="18px" color="yellow" class="text-bold text-dark">
                  Jumlah : {{ formattanpaRp(props.row?.total) }}
                </q-badge>
              </q-td>
              <!-- <q-td key="check" class="text-center">
                <q-checkbox v-model="selectedNpd" :val="props.row.nonpdls" color="primary" />
              </q-td> -->
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>

import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { formattanpaRp } from 'src/modules/formatter'
import { notifErr, notifSuccess } from 'src/modules/utils'
import { listdataNotadinasStore } from 'src/stores/siasik/transaksi/ls/notadinas/list'
import { usePencairanlsStore } from 'src/stores/siasik/transaksi/ls/pencairanls/storepencairan'
import { ref } from 'vue'

const loading = ref(false)
const selectedNpd = ref([])
const store = usePencairanlsStore()
function hiddenDialog() {
  selectedNpd.value = []

}

const rincidata = [
  {
    label: 'Nomer NPD-LS',
    name: 'nonpdls',
    field: row => [row.nonpdls, row.tglnpd]
  },
  {
    label: 'Kegiatan BLUD',
    name: 'kegiatan',
    field: row => [row.kegiatanblud, row.keterangan]
  },
  {
    label: 'Nilai',
    name: 'nilai',
    field: row => [row.total]
  },
  // { name: 'check', label: 'Verif', field: 'check', align: 'center' },
]
const columns = ref(rincidata)

const $q = useQuasar()
async function verifikasiSemua() {
  const nonpkls = store.listrinci[0]?.nonpk
  store.form.nonpk = nonpkls
  loading.value = true
  try {
    const params = store.form

    const resp = await api.post('/v1/transaksi/pencairanls/pencairan',
      params
    )
    console.log('resp verif', resp)
    if (resp.data.success === true) {
      // Notify.create({
      //   type: 'positive',
      //   message: resp.data.message || 'Verifikasi berhasil dilakukan.'
      // })

      store.openDialogRinci = false
      notifSuccess(resp)

    }


  } catch (err) {
    notifErr(err || err.response?.data?.message || err.message)
  } finally {
    loading.value = false
    store.listData()
    store.form.nonpk = ''
    store.form.nopencairan = ''
  }
}

function tglpindahbuku(val) {
  console.log('tglTransaksi', val)
  store.form.tglpindahbuku = val

}
function tglpencairan(val) {
  store.form.tglpencairan = val

}
</script>

<style lang="scss">
.my-sticky-table {
  height: 510px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #000000;
    color: $white;

  }

  thead tr th {
    position: sticky;
    z-index: 1;
    font-weight: bold;
  }

  /* this will be the loading indicator */
  thead tr:last-child th {
    top: 48px;

  }

  /* height of all previous header rows */

  thead tr:first-child th {
    top: 0;
  }

  .q-td {
    font-size: 3mm;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    scroll-margin-top: 48px;
    font-size: 1mm;
  }

  .q-table__bottom .q-field__native,
  .q-table__bottom .q-field__inner .q-field__control .q-anchor--skip,
  i.q-icon {
    color: $white;
  }
}
</style>
