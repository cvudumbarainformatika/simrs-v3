<template>
  <q-card-section>
    <TablePage :ada-cari="false" :default-btn="false" :right-action="false" :items="store.items" :columns="store.kolom"
      :column-hide="store.columnHide" :loading="store.loading" row-no click-able @on-click="click"
      @refresh="store.refreshTable">
      <template #header-left-after-search>
        <q-form ref="formRef" class="row q-pa-md q-col-gutter-xs" @submit="store.initAmbilData">
          <div class="row q-col-gutter-sm">
            <div>
              <app-input-date-human :model="store.tanggal.from" label="dari tanggal" outlined @db-model="setTo"
                @set-display="setToDisp" />
            </div>
            <div>
              <app-input-date-human :model="store.tanggal.to" label="sampai tanggal" outlined @db-model="setTox"
                @set-display="setToFromDisp" />
            </div>
            <div>
              <q-btn label="Cari" type="submit" color="primary" :loading="store.loading" :disable="store.loading" />
            </div>
          </div>
        </q-form>
      </template>
      <template #cell-Status="{ row }">
        {{ row?.status }}
      </template>
      <template #cell-Total="{ row }">
        <div class="row justify-end">
          {{ formatDouble(row?.jumlah) }}
        </div>
      </template>
      <template #expand="{ row }">
        <div v-if="row?.rinci?.length">
          <div class="row f-14 text-weight-bold q-my-sm">
            Detail Pasien
          </div>
          <div class="row text-weight-bold bg-dark text-white items-center q-py-xs"
            style="border-bottom: 1px solid black;">
            <div class="col-1">
              No
            </div>
            <div class="col-2 text-center">
              No. Reg
            </div>
            <div class="col-1 text-center">
              No. RM
            </div>
            <div class="col-4 text-center">
              Nama
            </div>
            <div class="col-1 text-center ">
              Tanggal Masuk
            </div>
            <!-- <div class="col-1 text-right">
              Harga
            </div>
            <div class="col-1 text-right">
              PPN
            </div>
            <div class="col-1 text-right ">
              Subtotal
            </div> -->
          </div>
          <div v-for="(rincix, i) in row.rinci" :key="rincix">
            <div class="row no-wrap " style="border-bottom: 1px solid black;">
              <div class="col-1">
                {{ i + 1 }}.
              </div>
              <div class="col-2 bg-grey-2 text-center" style="white-space: normal; overflow-wrap: normal;">
                {{ rincix?.noreg }}
              </div>
              <div class="col-1 text-center" style="white-space: normal; overflow-wrap: normal;">
                <div class="q-mr-xs">
                  {{ rincix?.norm }}
                </div>
              </div>
              <div class="col-4 bg-grey-2 text-center" style="white-space: normal; overflow-wrap: normal;">
                {{ rincix?.nama }}
              </div>
              <div class="col-1 text-center ">
                {{ rincix?.tglmasuk }}
              </div>
              <!-- <div class="col-1 text-right ">
                {{ formatDouble(rincix?.harga) }}
              </div>
              <div class="col-1 text-right ">
                {{ formatDouble(rincix?.ppn_rp) }}
              </div>
              <div class="col-1 text-right ">
                {{ formatDouble(rincix?.subtotal) }}
              </div> -->
            </div>
          </div>
        </div>
        <!-- {{ row }} -->
      </template>
    </TablePage>
  </q-card-section>
</template>

<script setup>
import TablePage from './TablePage.vue'
import { formatDouble } from 'src/modules/formatter'
import { uselaporankematianStore } from 'src/stores/simrs/laporan/rekap/kematian'

const store = uselaporankematianStore()

function click(val) {
  val.item.expand = !val.item.expand
}

function setToDisp(vaal) {
  store.tanggal.from = vaal
}

function setToFromDisp(vaal) {
  store.tanggal.to = vaal
}

function setTo(val) {
  store.params.tgldari = val
}

function setTox(val) {
  store.params.tglsampai = val
}

</script>
