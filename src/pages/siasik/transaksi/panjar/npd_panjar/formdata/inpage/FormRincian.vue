<template>
  <q-form ref="formNpdLS" @submit="saveNpd">
    <div class="row">
      <div class="q-pa-sm q-gutter-y-md" style="width: 50%">

        <q-select label="Rekening Belanja" v-model="store.form.koderek50" class="ellipsis-2-lines" use-input outlined
          standout="bg-yellow-3" dense emit-value map-options autocomplete="rincianbelanja" option-value="rek50"
          hide-bottom-space :disable="store.loading" :loading="store.loading"
          :option-label="opt => Object(opt) === opt && 'rincianbelanja' in opt ? opt.rek50 + ' - ' + opt.rincianbelanja : ' '"
          input-debounce="0" :options="options" :key="store.reqs.kodekegiatan" @filter="filterFn"
          @clear="store.setFormInput('koderek50', null)" @update:model-value="(val) => pilihRekening50(val)">
          <template v-if="store.form.koderek50" #append>
            <q-icon name="icon-mat-cancel" class="cursor-pointer"
              @click.stop.prevent="store.setFormInput('koderek50', null)" />
          </template>
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ditemukan
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <!-- <q-select label="Rekening Belanja" v-model="store.rinci.koderek50" class="ellipsis-2-lines" use-input outlined
          standout="bg-yellow-3" dense emit-value map-options autocomplete="rincianbelanja" option-value="rek50"
          hide-bottom-space :disable="store.loading" :loading="store.loading"
          :option-label="opt => Object(opt) === opt && 'rincianbelanja' in opt ? opt.rek50 + ' - ' + opt.rincianbelanja : ' '"
          input-debounce="0" :options="options" :key="store.reqs.kodekegiatan" @filter="filterFn"
          @clear="store.setFormInput('koderek50', null)" @update:model-value="(val) => pilihRekening50(val)">
          <template v-if="store.rinci.koderek50" #append>
            <q-icon name="icon-mat-cancel" class="cursor-pointer"
              @click.stop.prevent="store.setFormInput('koderek50', null)" />
          </template>
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ditemukan
              </q-item-section>
            </q-item>
          </template>
        </q-select> -->

      </div>

      <div class="q-pa-sm q-gutter-y-md" style="width: 50%">
        <app-autocomplete v-model="store.form.idpp" label="Item Belanja" autocomplete="itembelanja"
          option-label="itembelanja" option-value="idpp" outlined :key="store.reqs" :source="store.itembelanja"
          :loading="store.loading" :disable="store.loading" @selected="(val) => {
            const arr = store.itembelanja
            const cari = arr.find(x => x.idpp === val)
            store.form.koderek108 = cari.koderek108
            store.form.uraian108 = cari.uraian108
            store.form.itembelanja = cari.itembelanja
            store.form.volume = cari.volume
            store.form.satuan = cari.satuan
            store.form.harga = cari.harga
            store.form.total = cari.pagu

            store.form.sisapagu = cari.sisapagu
            store.form.volumepermintaanpanjar = 0
            store.form.hargapermintaanpanjar = 0
            store.form.totalpermintaanpanjar = 0
          }" />
      </div>
      <app-input-simrs v-model="store.form.volume" class="q-pa-sm q-gutter-y-md" style="width: 15%" label="Volume Item"
        outlined readonly />
      <app-input-simrs v-model="store.form.satuan" class="q-pa-sm q-gutter-y-md" style="width: 15%" label="Satuan Item"
        outlined readonly />
      <app-input-simrs :model-value="formattanpaRp(store.form.harga)" class="q-pa-sm q-gutter-y-md" style="width: 20%"
        label="Harga Item" outlined readonly />
      <app-input-simrs :model-value="formattanpaRp(store.form.total)" class="q-pa-sm q-gutter-y-md" style="width: 25%"
        label="Total Pagu" outlined readonly />
      <app-input-simrs :model-value="formattanpaRp(store.form.sisapagu)" class="q-pa-sm q-gutter-y-md"
        style="width: 25%" label="Sisa Pagu" outlined readonly />

      <app-input-simrs v-model="store.form.volumepermintaanpanjar" class="q-pa-sm q-gutter-y-md" style="width: 25%"
        label="Volume Permintaan" outlined :autofocus="false" :valid="{ required: true, number: true }"
        @update:model-value="(val) => {
          store.form.totalpermintaanpanjar = parseFloat(store.form.hargapermintaanpanjar) * parseFloat(val)
        }" />
      <app-input-simrs v-model="store.form.hargapermintaanpanjar" class="q-pa-sm q-gutter-y-md" style="width: 25%"
        label="Harga Permintaan" outlined :autofocus="false" :valid="{ required: true, number: true }"
        @update:model-value="(val) => {
          store.form.totalpermintaanpanjar = parseFloat(store.form.volumepermintaanpanjar) * parseFloat(val)
        }" />
      <app-input-simrs :model-value="formattanpaRp(store.form.totalpermintaanpanjar)" class="q-pa-sm q-gutter-y-md"
        style="width: 25%" label="Total Permintaan" outlined readonly />
      <div class="row items-center q-pb-md q-pa-sm q-gutter-y-md">
        <app-btn label="Simpan Rincian" class="bg-black" type="submit" :disable="store.loading"
          :loading="store.loading" />
      </div>

    </div>
  </q-form>
</template>
<script setup>
import { notifErrVue } from 'src/modules/utils';
import { dataBastFarmasiStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastfarmasi';
import { formInputPajakStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formpajak';
import { defineAsyncComponent, ref } from 'vue';
import { formattanpaRp } from 'src/modules/formatter'
import { storeNpdPanjar } from 'src/stores/siasik/transaksi/panjar/npd_panjar/store_npd_panjar';


const store = storeNpdPanjar()
const carisrt = dataBastFarmasiStore()
const pjk = formInputPajakStore()
const options = ref([])
const formNpdLS = ref(null)
// const rincianNpd = ref([])
// function gantibotton(row) {
//   const bast_id = row?.bast_r_id
//   const transall = store.transall

//   let simpandata = true
//   const hasil = transall.find((x) => x?.bast_r_id === bast_id) ?? null
//   if (hasil) {
//     simpandata = false
//   } else {
//     simpandata = true
//   }
//   // console.log('row', transall)
//   return simpandata
// }

async function filterFn(val, update) {
  // console.log('val filter', val)
  if (!store.rekening50 || store.rekening50?.length === 0) {
    // Jika data rekening kosong, muat ulang data
    await store.getRincianBelanja();
  }
  update(() => {
    if (val === '') {
      options.value = store.rekening50;
    } else {
      const needle = val.toLowerCase();
      const filter = ['rek50', 'rincianbelanja'];

      // Selalu filter dari data asal (store.rekening50), bukan dari options yang sudah difilter
      const multiFilter = (data = [], filterKeys = [], value = '') =>
        data.filter((item) => filterKeys.some(
          (key) =>
            item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
            item[key]
        ));

      options.value = multiFilter(store.rekening50, filter, needle);
    }
  });
}
function pilihRekening50(val) {

  if (!val) return; // Tambahkan pengecekan nilai kosong

  const arr = store.rekening50;
  if (!arr || arr?.length === 0) {
    console.error('Data rekening50 kosong');
    return;
  }

  const obj = arr.find(x => x.rek50 === val);
  if (!obj) {
    console.error('Rekening tidak ditemukan');
    return;
  }
  store.form.nopp = obj.notrans
  store.form.koderek50 = obj.rek50
  store.form.rincianbelanja50 = obj.rincianbelanja
  store.form.koderek108 = null
  store.form.uraian108 = null
  store.form.itembelanja = null
  store.form.volume = 0
  store.form.harga = 0
  store.form.total = 0
  store.form.satuan = null
  store.form.volumepermintaanpanjar = 0
  store.form.hargapermintaanpanjar = 0
  store.form.totalpermintaanpanjar = 0
  store.form.idpp = null
  store.form.sisapagu = 0

  store.reqs.rekening50 = val;
  store.filterItemBelanja();
  console.log('FORM', store.form)
}
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
function saveNpd() {

  if (store.form.totalpermintaanpanjar > store.form.sisapagu) {
    return notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
  }
  console.log('Form', store.form)
  store.simpan()
  // store.simpanNpdls(props.data).then(() => {
  //   store.form.nopp = null
  //   store.form.koderek50 = null
  //   store.form.rincianbelanja50 = null
  //   store.form.koderek108 = null
  //   store.form.uraian108 = null
  //   store.form.itembelanja = null
  //   store.form.volume = 0
  //   store.form.harga = 0
  //   store.form.total = 0
  //   store.form.satuan = null
  //   store.form.volumepermintaanpanjar = 0
  //   store.form.hargapermintaanpanjar = 0
  //   store.form.totalpermintaanpanjar = 0
  //   store.form.idpp = null
  //   formNpdLS.value.resetValidation()
  //   store.disabled = true
  // })
}
</script>
