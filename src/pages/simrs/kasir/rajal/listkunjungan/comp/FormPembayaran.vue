<template>
  <div class="q-pa-md bg-grey-5 full-height">
    <div class="q-pa-sm row bg-white">
      <div class="col-1 q-pa-xs bg-red full-height">
        <div>
          <app-avatar-pasien :key="pasien" :pasien="pasien" width="100%" height="100%" />
        </div>
      </div>
      <div class="col-5 q-pa-xs ">
        <div class="row">
          <div class="col-3 text-weight-bold">Nama</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ pasien ? pasien.nama : '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-3 text-weight-bold">No. RM</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ pasien?.norm ?? '-' }}</q-badge> / <q-badge color="red"> {{
            pasien.kelamin ??
            '-' }} </q-badge>
          </div>
        </div>
        <div class="row">
          <div class="col-3 text-weight-bold">No. Reg</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ pasien ? pasien.noreg : '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-3 text-weight-bold">Tgl Kunjungan</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ dateFullFormat(pasien?.tgl_kunjungan) ?? '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-3 text-weight-bold">Usia</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ pasien.usia ?? '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-3 text-weight-bold">Poli</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ pasien?.poli ?? '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-3 text-weight-bold">DPJP</div>
          <div class="col-1">:</div>
          <div class="col"><q-badge color="red"> {{ pasien?.dokter ?? '-' }}</q-badge></div>
        </div>
      </div>
      <q-separator vertical />
      <div class="col q-ma-sm ">
        <div class="row">
          <div class="col-12 text-weight-bold q-gutter-sm">
            <div class="row">
              <div class="col-6">
                <span class="text-weight-bold text-h4" align="left">Total Billing :</span>
              </div>
              <div class="col-6" align="right">
                <q-badge color="red" outline rounded class="text-h4 text-weight-bold">{{
                  formatRpDouble(billing?.totalall) }}</q-badge>
              </div>
            </div>
          </div>
        </div>
        <q-separator class="q-ma-sm" />
        <div class="row q-mt-sm">
          <div class="col-12" align="right">
            <q-btn label="Billing" rounded color="primary" @click="store.bayar" />
          </div>
        </div>
      </div>
    </div>
    <q-separator />
    <div class="row " style="height: 81%;">
      <div class="col-6 ">
        <form-pembayaran-detail :pasien="prop?.pasien" :jenislayanan="store.jenispembayaran" :billing="prop?.billing"
          :kwitansi="prop?.kwitansi" />
      </div>
      <q-separator vertical />
      <div class="col">
        <data-pembayaran :kwitansi="prop?.kwitansi" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { dateFullFormat, formatRpDouble } from 'src/modules/formatter';
import { ref } from 'vue'
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan'

import FormPembayaranDetail from './FormPembayaranDetail.vue';
import DataPembayaran from './DataPembayaran.vue';

const store = useKasirRajalListKunjunganStore()

const prop = defineProps({
  pasien: { type: Object, default: () => { } },
  billing: { type: Object, default: () => { } },
  kwitansi: { type: Array, default: () => [] },
})
</script>
