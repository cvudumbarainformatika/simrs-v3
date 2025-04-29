<template>
  <q-form ref="formInput" @submit="saveSerahterima">
    <div class="row">
      <div class="q-pa-sm q-gutter-y-md" style="width: 50%">

        <q-select label="Rekening Belanja" v-model="store.rinci.koderek50" class="ellipsis-2-lines" use-input outlined
          standout="bg-yellow-3" dense emit-value map-options autocomplete="uraianrek50" option-value="koderek50"
          hide-bottom-space :disable="store.loading" :loading="store.loading"
          :option-label="opt => Object(opt) === opt && 'uraian50' in opt ? opt.koderek50 + ' - ' + opt.uraian50 : ' '"
          input-debounce="0" :options="options" :key="store.formheader.kodekegiatanblud" @filter="filterFn"
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
        </q-select>

      </div>

      <!-- <div class="q-pa-sm q-gutter-y-md" style="width: 50%">
        <app-input-simrs v-if="store.form.serahterimapekerjaan === '3'" label="Rincian Belanja"
          v-model="store.rinci.itembelanja" disable outlined :autofocus="false" :valid="{ required: true }" />
        <app-autocomplete v-else v-model="store.rinci.itembelanja" label="Item Belanja" autocomplete="itembelanja"
          option-label="itembelanja" option-value="itembelanja" outlined :key="store.reqs" :source="store.itembelanja"
          :loading="store.loading" @selected="(val) => {
            const arr = store.itembelanja
            const cari = arr.find(x => x.itembelanja === val)
            store.rinci.idserahterima_rinci = cari.idpp
            store.rinci.koderek108 = cari.koderek108
            store.rinci.uraian108 = cari.uraian108
            store.rinci.volume = cari.volume
            store.rinci.satuan = cari.satuan
            store.rinci.harga = cari.harga
            store.rinci.total = cari.pagu
            store.rinci.sisapagu = cari.sisapagu
            store.rinci.volumels = 0
            store.rinci.hargals = 0
            store.rinci.totalls = 0
            store.rinci.nominalpembayaran = 0
          }" />
      </div>
      <app-input-simrs v-model="store.rinci.volume" class="q-pa-sm q-gutter-y-md" style="width: 15%" label="Volume Item"
        outlined readonly />
      <app-input-simrs v-model="store.rinci.satuan" class="q-pa-sm q-gutter-y-md" style="width: 15%" label="Satuan Item"
        outlined readonly />
      <app-input-simrs :model-value="formattanpaRp(store.rinci.harga)" class="q-pa-sm q-gutter-y-md" style="width: 20%"
        label="Harga Item" outlined readonly />
      <app-input-simrs :model-value="formattanpaRp(store.rinci.total)" class="q-pa-sm q-gutter-y-md" style="width: 25%"
        label="Total Pagu" outlined readonly />
      <app-input-simrs :model-value="formattanpaRp(store.rinci.sisapagu)" class="q-pa-sm q-gutter-y-md"
        style="width: 25%" label="Sisa Pagu" outlined readonly />

      <app-input-simrs v-model="store.rinci.volumels" class="q-pa-sm q-gutter-y-md" style="width: 25%"
        label="Volume Permintaan" outlined :autofocus="false" :valid="{ required: true, number: true }"
        @update:model-value="(val) => {
          store.rinci.totalls = parseFloat(store.rinci.hargals) * parseFloat(val)
          store.rinci.nominalpembayaran = parseFloat(store.rinci.hargals) * parseFloat(val)
        }" />
      <app-input-simrs v-model="store.rinci.hargals" class="q-pa-sm q-gutter-y-md" style="width: 25%"
        label="Harga Permintaan" outlined :autofocus="false" :valid="{ required: true, number: true }"
        @update:model-value="(val) => {
          store.rinci.totalls = parseFloat(store.rinci.volumels) * parseFloat(val)
          store.rinci.nominalpembayaran = parseFloat(store.rinci.volumels) * parseFloat(val)
        }" />
      <app-input-simrs :model-value="formattanpaRp(store.rinci.nominalpembayaran)" class="q-pa-sm q-gutter-y-md"
        style="width: 25%" label="Total Permintaan" outlined readonly />
      <div class="row items-center q-pb-md q-pa-sm q-gutter-y-md">
        <app-btn label="Simpan Rincian" class="bg-black" type="submit" :disable="store.loading"
          :loading="store.loading" />
      </div>
      <div class="row items-center q-pb-md q-pa-sm q-gutter-y-md">
        <app-btn label="Tambah Pajak" class="bg-orange-8" :disable="store.loading" :loading="store.loading"
          @click="tambahPajak()" />
      </div> -->
    </div>
  </q-form>
</template>
<script setup>
import { notifErrVue } from 'src/modules/utils';
import { ref } from 'vue';
import { formattanpaRp } from 'src/modules/formatter'
import { useFormSerahterimaStore } from 'src/stores/siasik/transaksi/ls/serahterimapekerjaan/formserahterima';


const store = useFormSerahterimaStore()
const options = ref([])
const formInput = ref(null)


async function filterFn(val, update) {
  // console.log('val filter', val)
  if (!store.rekening50 || store.rekening50.length === 0) {
    // Jika data rekening kosong, muat ulang data
    await store.getRincianBelanja();
  }
  update(() => {
    if (val === '') {
      options.value = store.rekening50;
    } else {
      const needle = val.toLowerCase();
      const filter = ['koderek50', 'uraian50'];

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
  if (!arr || arr.length === 0) {
    console.error('Data rekening50 kosong');
    return;
  }

  const obj = arr.find(x => x.rek50 === val);
  if (!obj) {
    console.error('Rekening tidak ditemukan');
    return;
  }

  // Reset nilai sebelumnya
  store.rinci = {
    ...store.rinci,
    koderek50: obj.rek50,
    rincianbelanja: obj.rincianbelanja,
    itembelanja: '',
    volume: '',
    satuan: '',
    harga: '',
    total: '',
    sisapagu: '',
    volumels: '',
    hargals: '',
    totalls: '',
    nominalpembayaran: ''
  };

  store.reqs.rekening50 = val;
  store.filterItemBelanja();
}
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
function saveSerahterima() {
  // console.log('store.rinci', store.rinci)
  const objrincian = store.rinci
  store.form.rincians.push(objrincian)
  const unikjumlah = store.form.rincians.map((x) => x.itembelanja)
  const unik = unikjumlah.length ? [...new Set(unikjumlah)] : []

  const arr = []
  for (let i = 0; i < unik.length; i++) {
    const el = unik[i]
    const obj = {
      jumlah: store.form.rincians.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
      koderek108: el,
      sisapagu: store.rinci.sisapagu
    }
    if (obj?.jumlah > obj?.sisapagu) {
      formNpdLS.value.resetValidation()
      store.form.rincians = []
      console.log('pxpxpxpx', (obj?.jumlah > obj?.sisapagu))
      return notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
    }

    // arr.push(obj)
    // const subtotal = arr.map((x) => x.jumlah).reduce((x, y) => x + y, 0)
    // store.reqs.subtotal = subtotal
  }
  store.simpanNpdls(props.data).then(() => {
    store.rinci.koderek50 = ''
    store.rinci.itembelanja = ''
    store.rinci.volume = ''
    store.rinci.satuan = ''
    store.rinci.harga = ''
    store.rinci.total = ''
    store.rinci.sisapagu = ''
    store.rinci.volumels = ''
    store.rinci.hargals = ''
    store.rinci.totalls = ''
    store.rinci.nominalpembayaran = ''
    formNpdLS.value.resetValidation()
    store.disabled = true
  })
}
function tambahPajak() {
  console.log('open Dialog')
  store.openDialogPajak = true
  pjk.form.nonpdls = store.form.nonpdls
  pjk.reqs.nonpdls = store.form.nonpdls
  pjk.getListpajak()
  console.log('nonpdls pajak', pjk.form.nonpdls)
}
</script>
