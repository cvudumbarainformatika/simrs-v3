<template>
  <template v-if="store.reqs.bast">
    <div class="justify-content-center q-pt-sm">
      <q-table class="my-sticky-table" :rows="carisrt.itembelanja" :columns="columns" row-key="name" dense
        hide-pagination ref="rincianNpd" wrap-cells :rows-per-page-options="[0]" :rows-number="[0]">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nopenerimaan" :props="props" class="text-left">
              <div>
                {{ props.row.nobast }}
              </div>
              <div class="text-teal text-bold" style="font-size: 0.9em">
                Penerimaan : {{ props.row.nopenerimaan }}
              </div>
            </q-td>
            <q-td key="koderek50" :props="props">
              {{ props.row.koderek50 }}
            </q-td>
            <q-td key="rincianbelanja" :props="props" class="text-left">
              {{ props.row.rincianbelanja }}
            </q-td>
            <q-td key="koderek108" :props="props">
              {{ props.row.koderek108 }}
            </q-td>
            <q-td key="itembelanja" :props="props">
              {{ props.row.itembelanja }}
            </q-td>
            <q-td key="totalls" :props="props" class="text-right">
              {{ formattanpaRp(props.row.totalls) }}
            </q-td>
            <q-td key="nominalpembayaran" :props="props" class="text-right">
              {{ formattanpaRp(props.row.nominalpembayaran) }}
              <q-popup-edit v-model="props.row.nominalpembayaran" auto-save v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>
            <q-td>
              <div class="row justify-end">

                <q-btn v-if="gantibotton(props?.row)" label="Simpan" outline size="sm" class="q-px-md"
                  @click="simpanRinciBast(props?.row)" :loading="store.loading" />

                <q-btn v-else size="sm" class="q-pl-md" color="negative" icon="icon-mat-delete"
                  @click="deleteData(props?.row?.nopenerimaan)" :loading="store.loading" />

                <!-- <q-btn size="sm" :color="tersimpan ? 'negative' : 'primary'"
                  :icon="tersimpan ? 'icon-mat-delete' : 'icon-mat-save'" :label="tersimpan ? 'Hapus' : 'Simpan'"
                  @click="tersimpan[props?.row] ? deleteData(props?.row?.nopenerimaan) : simpanRinciBast(props?.row)" /> -->

              </div>
            </q-td>
          </q-tr>
        </template>
        <template #bottom-row>
          <q-tr class="full-width text-bold">
            <q-td colspan="6" class="text-center" style="font-size: 4em">
              SUBTOTAL
            </q-td>
            <q-td colspan="2" class="text-right text-bold" style="font-size: 4em">
              {{ formattanpaRp(subtotal()) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </template>
  <template v-else>
    <q-form ref="formNpdLS" @submit="saveNobast">
      <div class="row">
        <div class="q-pa-sm q-gutter-y-md" style="width: 50%">
          <q-select label="Rekening Belanja" v-model="store.rinci.koderek50" class="ellipsis-2-lines" use-input outlined
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
          </q-select>
        </div>

        <div class="q-pa-sm q-gutter-y-md" style="width: 50%">
          <app-autocomplete v-model="store.rinci.itembelanja" label="Item Belanja" autocomplete="item"
            option-label="item" option-value="item" outlined :key="store.reqs" :source="store.itembelanja"
            :loading="store.loading" @selected="(val) => {
              const arr = store.itembelanja
              const cari = arr.find(x => x.item === val)
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
        <app-input-simrs v-model="store.rinci.volume" class="q-pa-sm q-gutter-y-md" style="width: 15%"
          label="Volume Item" outlined readonly />
        <app-input-simrs v-model="store.rinci.satuan" class="q-pa-sm q-gutter-y-md" style="width: 15%"
          label="Satuan Item" outlined readonly />
        <app-input-simrs v-model="store.rinci.harga" class="q-pa-sm q-gutter-y-md" style="width: 20%" label="Harga Item"
          outlined readonly />
        <app-input-simrs v-model="store.rinci.total" class="q-pa-sm q-gutter-y-md" style="width: 25%" label="Total Pagu"
          outlined readonly />
        <app-input-simrs v-model="store.rinci.sisapagu" class="q-pa-sm q-gutter-y-md" style="width: 25%"
          label="Sisa Pagu" outlined readonly />

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
        <app-input-simrs v-model="store.rinci.totalls" class="q-pa-sm q-gutter-y-md" style="width: 25%"
          label="Total Permintaan" outlined readonly />
        <div class="row items-center q-pb-md q-pa-sm q-gutter-y-md">
          <app-btn label="Simpan Rincian" class="bg-black" type="submit" :disable="store.loading"
            :loading="store.loading" />
        </div>
      </div>
    </q-form>
  </template>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formattanpaRp } from 'src/modules/formatter';
import { notifErrVue } from 'src/modules/utils';
import { dataBastFarmasi } from 'src/stores/siasik/transaksi/ls/npdls/databast';
import { formNotaPermintaanDanaLS } from 'src/stores/siasik/transaksi/ls/npdls/formnpdls';
import { ref } from 'vue';

const $q = useQuasar()
const store = formNotaPermintaanDanaLS()
const carisrt = dataBastFarmasi()
const options = ref([])
const rincianNpd = ref([])
const formNpdLS = ref(null)

// const tersimpan = ref(false)

function gantibotton(row) {
  const bast_id = row?.bast_r_id
  const transall = store.transall

  let simpandata = true
  const hasil = transall.find((x) => x?.bast_r_id === bast_id) ?? null
  if (hasil) {
    simpandata = false
  } else {
    simpandata = true
  }
  // console.log('row', transall)
  return simpandata



}

async function filterFn(val, update) {
  // console.log('val filter', val)
  if (val === '') {
    update(() => {
      options.value = store.rekening50
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    const arr = options.value
    const filter = ['rek50', 'rincianbelanja']

    const multiFilter = (data = [], filterKeys = [], value = '') =>
      data.filter((item) => filterKeys.some(
        (key) =>
          item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
          item[key]
      )
      )
    const filteredData = multiFilter(arr, filter, needle)
    // console.log('filterdata', filteredData)
    options.value = filteredData
  })
}
function pilihRekening50(val) {
  const arr = store.rekening50
  const obj = arr.length ? arr.find(x => x.rek50 === val) : null
  // Mengosongkan form rincian Belanja ketika request kegiatan blud
  // store.reqs.kodekegiatan = val ?? ''
  // store.rinci.koderek50 = ''
  store.rinci.koderek50 = obj?.rek50 ?? ''
  store.rinci.rincianbelanja = obj?.rincianbelanja ?? ''
  store.reqs.kodekegiatan = obj?.kodekegiatan ?? ''
  carisrt.filterRekening50()

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
  store.reqs.rekening50 = obj?.rek50 ?? ''
  // console.log('rek50', store.reqs.rekening50)
  store.filterItemBelanja()
}
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
function saveNobast() {
  store.reqs.rincianmanual = store.rinci
  const objrincian = store.rinci
  store.form.rincians.push(objrincian)
  // console.log('storerincian', store.form.rincians)
  const unikjumlah = store.form.rincians.map((x) => x.itembelanja)
  const unik = unikjumlah.length ? [...new Set(unikjumlah)] : []
  // console.log('pxpxpxpx', unik)
  const arr = []
  for (let i = 0; i < unik.length; i++) {
    const el = unik[i]
    const obj = {
      jumlah: store.form.rincians.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
      koderek108: el,
      sisapagu: store.rinci.sisapagu
    }
    if (obj?.jumlah > obj?.sisapagu) {
      store.form.rincians = []
      return notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
    }
    formNpdLS.value.resetValidation()
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

function simpanRinciBast(val) {
  // console.log('data BAST', val)
  // console.log('dengan BAST', val)
  const objrincian = store.rinci = val

  store.form.rincians.push(objrincian)

  const unikjumlah = store.form.rincians.map((x) => x.koderek108)
  const unik = unikjumlah.length ? [...new Set(unikjumlah)] : []
  const arr = []
  for (let i = 0; i < unik.length; i++) {
    const el = unik[i]
    const obj = {
      jumlah: store.form.rincians.filter((z) => z.koderek108 === el).map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
      koderek108: el,
      sisapagu: store.form.rincians.filter((z) => z.koderek108 === el)[0]?.sisapagu
    }
    if (obj?.jumlah > obj?.sisapagu) {
      store.form.rincians = []
      return notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
    }
    arr.push(obj)
  }
  store.simpanNpdls(props.data).then(() => {
    store.disabled = true
  })
  const subtotal = arr.map((x) => x.jumlah).reduce((x, y) => x + y, 0)
  store.reqs.subtotal = subtotal
}

function subtotal() {
  // console.log('get baru', store.transall)
  const subtotalrinci = store.transall.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0)
  return subtotalrinci
}

const selected = ref([])

function deleteData(row) {
  // console.log('row', carisrt.itembelanja)
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {

    const payload = {
      nonpdls: store.paramsrinci.nonpdls,
      nopenerimaan: row,
    }
    store.hapusRinci(payload).then(() => {
      if (store.transall.length < 0) {
        store.resetFORM()
        formNpdLS.value.resetValidation()
      }
    })
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
const tablebast = [
  {
    label: 'No BAST',
    name: 'nopenerimaan',
    align: 'center',
    field: 'nopenerimaan'
  },
  {
    label: 'Rekening 50',
    name: 'koderek50',
    align: 'center',
    field: 'koderek50'
  },
  {
    label: 'Uraian',
    name: 'rincianbelanja',
    align: 'center',
    field: 'rincianbelanja'
  },
  {
    label: 'Rekening 108',
    name: 'koderek108',
    align: 'center',
    field: 'koderek108'
  },
  {
    label: 'Item Belanja',
    name: 'itembelanja',
    align: 'center',
    field: 'itembelanja'
  },
  {
    label: 'Subtotal',
    name: 'totalls',
    align: 'center',
    field: 'totalls'
  },
  {
    label: 'Nominal Pembayaran',
    name: 'nominalpembayaran',
    align: 'center',
    field: 'nominalpembayaran'
  },
  {
    name: 'Opsi',
    label: 'Opsi',
    align: 'center'
  }
]

const columns = ref(tablebast)
</script>
