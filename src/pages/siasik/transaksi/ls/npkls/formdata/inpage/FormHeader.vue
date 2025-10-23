<template>
  <q-card class="falt col full-height">
    <q-form @submit="onSubmit" ref="formInput" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col q-gutter-y-md">
          <app-input-simrs v-model="store.formheader.nonpk" label="Nomer NPK-LS" readonly outlined dense />
        </div>
        <div class="col q-gutter-y-md">
          <app-input-date-human label="Tanggal NPK-LS" :model="store.params.tgl" icon="icon-mat-event" outlined
            :autofocus="false" :disable="store.disabled || store.loading || store.transrinci.length > 0"
            @db-model="tglTransaksi" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
          <!-- <app-input-date :model="store.formheader.tgltrans" label="Tanggal Transaksi" icon="icon-mat-event" outlined
            @set-model="tglTransaksi" /> -->
        </div>

      </div>
      <div class="row q-px-md q-pb-md justify-center">
        <app-btn rounded color="teal-8" :loading="store.loading" label="Cari NPD-LS" :source="store.datanpd" @click="() => {
          store.getDataNpdls()
          console.log('data npdls', store.datanpd)
          store.openDialog = true
        }" />
      </div>

      <select-datanpd v-model="store.openDialog" />
    </q-form>
    <div v-if="store.rinci.nonpdls" class="q-px-sm">
      <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
        <div class="row text-primary q-pa-sm q-my-sm q-px-sm">
          <div class="f-14 text-weight-bold">
            Rincian Nota Pergeseran Kas Langsung (NPK-LS)
          </div>
        </div>
      </q-card>
      <!-- <div class="row q-px-md justify-center">
        <app-btn rounded color="teal-8" :loading="store.loading" label="Tambah NPD-LS" :source="store.datanpd" @click="() => {
          store.datanpd = []
          store.openDialog = true
        }" />
      </div> -->
    </div>
    <FormRincian v-if="store.rinci.nonpdls" />
  </q-card>
</template>

<script setup>
import { watch } from 'vue';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import FormRincian from './FormRinci.vue'
import { useFormNPKlangsungStore } from 'src/stores/siasik/transaksi/ls/npkls/form';

const SelectDatanpd = defineAsyncComponent(() => import('./DialogSelectnpd.vue'));
const store = useFormNPKlangsungStore()
const options = ref([])
const formInput = ref(null)


function onSubmit() {
  store.fixed = true
}

function tglTransaksi(val) {
  store.params.tgl = val
  store.formheader.tglnpk = val
  store.setParams('tgl', val)

}



async function filterFn(val, update) {
  // console.log('val filter', val)
  if (!store.ptks || store.ptks?.length === 0) {
    // Jika data rekening kosong, muat ulang data
    await store.getDataBidang();
  }
  update(() => {
    if (val === '') {
      options.value = store.ptks;
    } else {
      const needle = val.toLowerCase();
      const filter = ['kodepptk', 'namapptk'];

      // Selalu filter dari data asal (store.ptks), bukan dari options yang sudah difilter
      const multiFilter = (data = [], filterKeys = [], value = '') =>
        data.filter((item) => filterKeys.some(
          (key) =>
            item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
            item[key]
        ));

      options.value = multiFilter(store.ptks, filter, needle);
    }
  });
}

</script>
