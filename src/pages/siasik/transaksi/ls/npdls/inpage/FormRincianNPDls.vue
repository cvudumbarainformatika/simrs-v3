<template>
  <template v-if="store.reqs.bast">
    <div class="justify-content-center">
      <q-table
        class="my-sticky-table"
        :rows="carisrt.itembelanja"
        :columns="columns"
        row-key="name"
        dense
        hide-pagination
        ref="rincianNpd"
        wrap-cells
        :rows-per-page-options="[0]"
        :rows-number="[0]"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="nopenerimaan" :props="props" class="text-left">
              {{ props.row.nopenerimaan }}
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
                <q-btn
                  outline
                  size="sm"
                  class="q-px-md"
                  label="Pilih"
                  @click="simpanRinciBast(props?.row)"
                  onclick="disabled='true'"
                />
                <div class="q-pl-sm" />
                <q-btn
                  size="sm"
                  class="q-pl-md"
                  color="negative"
                  icon="icon-mat-delete"
                  @click="deleteData(props?.row?.nopenerimaan)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
        <template #bottom-row>
          <q-tr class="full-width text-bold">
            <q-td colspan="6" class="text-center">
              SUBTOTAL
            </q-td>
            <q-td class="text-right text-bold">
              {{ formattanpaRp(store.reqs.subtotal) }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </template>
  <template v-else>
    <q-form ref="rincianNpd" class="fit" @submit="simpanRinci">
      <div class="row">
        <div class="q-pa-sm q-gutter-y-md" style="width: 50%">
          <q-select
            v-model="store.rinci.koderek50"
            class="ellipsis-2-lines"
            label="Rekening Belanja"
            use-input
            outlined
            standout="bg-yellow-3"
            dense
            emit-value
            map-options
            autocomplete="rincianbelanja"
            option-value="rek50"
            hide-bottom-space
            :disable="store.loading"
            :loading="store.loading"
            :option-label="opt => Object(opt) === opt && 'rincianbelanja' in opt ? opt.rek50 + ' - ' + opt.rincianbelanja : ' '"
            input-debounce="0"
            :options="options"
            :key="store.reqs.kodekegiatan"
            @filter="filterFn"
            @clear="store.setFormInput('koderek50', null)"
            @update:model-value="(val)=>pilihRekening50(val)"
          >
            <template
              v-if="store.rinci.koderek50"
              #append
            >
              <q-icon
                name="icon-mat-cancel"
                class="cursor-pointer"
                @click.stop.prevent="store.setFormInput('koderek50', null)"
              />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Tidak ditemukan
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- <app-autocomplete
            v-model="store.rinci.koderek50"
            label="Rekening Belanja"
            autocomplete="rincianbelanja"
            option-value="rek50"
            outlined
            :loading="store.loading"
            :option-label="opt => Object(opt) === opt && 'rincianbelanja' in opt ? opt.rek50 + ' - ' + opt.rincianbelanja : 'Silahkan Dipilih'"
            :source="store.rekening50"
            :key="store.reqs.kodekegiatan"
            @selected="(val)=>pilihRekening50(val)"
          /> -->
        </div>

        <div class="q-pa-sm q-gutter-y-md" style="width: 50%">
          <app-autocomplete
            v-model="store.rinci.itembelanja"
            label="Item Belanja"
            autocomplete="item"
            option-label="item"
            option-value="item"
            outlined
            :key="store.reqs"
            :source="store.itembelanja"
            :loading="store.loading"
            @selected="(val)=>{
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
              store.rinci.kode_lo = cari?.kode_lo
              store.rinci.uraian_lo = cari?.uraian_lo
              store.rinci.kode_neraca1 = cari?.kode_neraca1
              store.rinci.uraian_neraca1 = cari?.uraian_neraca1
              store.rinci.kode_neraca2 = cari?.kode_neraca2
              store.rinci.uraian_neraca2 = cari?.uraian_neraca2
              store.rinci.kode_lpsal = cari?.kode_lpsal
              store.rinci.uraian_lpsal = cari?.uraian_lpsal
              store.rinci.kode_lak = cari?.kode_lak
              store.rinci.uraian_lak = cari?.uraian_lak
            }"
          />
        </div>
        <app-input-simrs
          v-model="store.rinci.volume"
          class="q-pa-sm q-gutter-y-md"
          style="width: 15%"
          label="Volume Item"
          outlined
          readonly
        />
        <app-input-simrs
          v-model="store.rinci.satuan"
          class="q-pa-sm q-gutter-y-md"
          style="width: 15%"
          label="Satuan Item"
          outlined
          readonly
        />
        <app-input-simrs
          v-model="store.rinci.harga"
          class="q-pa-sm q-gutter-y-md"
          style="width: 20%"
          label="Harga Item"
          outlined
          readonly
        />
        <app-input-simrs
          v-model="store.rinci.total"
          class="q-pa-sm q-gutter-y-md"
          style="width: 25%"
          label="Total Pagu"
          outlined
          readonly
        />
        <app-input-simrs
          v-model="store.rinci.sisapagu"
          class="q-pa-sm q-gutter-y-md"
          style="width: 25%"
          label="Sisa Pagu"
          outlined
          readonly
        />

        <app-input-simrs
          v-model="store.rinci.volumels"
          class="q-pa-sm q-gutter-y-md"
          style="width: 25%"
          label="Volume Permintaan"
          outlined
          :autofocus="false"
          :valid="{required:true, number:true}"
          @update:model-value="(val) => {
            store.rinci.totalls = parseFloat(store.rinci.hargals) * parseFloat(val)
            store.rinci.nominalpembayaran = parseFloat(store.rinci.hargals) * parseFloat(val)
          }"
        />
        <app-input-simrs
          v-model="store.rinci.hargals"
          class="q-pa-sm q-gutter-y-md"
          style="width: 25%"
          label="Harga Permintaan"
          outlined
          :autofocus="false"
          :valid="{required:true, number:true}"
          @update:model-value="(val) => {
            store.rinci.totalls = parseFloat(store.rinci.volumels) * parseFloat(val)
            store.rinci.nominalpembayaran = parseFloat(store.rinci.volumels) * parseFloat(val)
          }"
        />
        <app-input-simrs
          v-model="store.rinci.totalls"
          class="q-pa-sm q-gutter-y-md"
          style="width: 25%"
          label="Total Permintaan"
          outlined
          readonly
        />
        <div class="row items-center q-pb-md q-pa-sm q-gutter-y-md">
          <app-btn
            label="Pilih Rincian"
            class="bg-black"
            type="submit"
            :disable="store.loading"
            :loading="store.loading"
          />
        </div>
      </div>
    </q-form>
  </template>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { dataBastFarmasi } from 'src/stores/siasik/transaksi/ls/npdls/databast'
import { formNotaPermintaanDanaLS } from 'src/stores/siasik/transaksi/ls/npdls/formnpdls'
import { onMounted, ref } from 'vue'
// eslint-disable-next-line no-unused-vars
import { formattanpaRp } from 'src/modules/formatter'
import { notifErrVue } from 'src/modules/utils'

const $q = useQuasar()
const carisrt = dataBastFarmasi()
const rincianNpd = ref([])
// const rincians = ref([])
const options = ref([])
const store = formNotaPermintaanDanaLS()
// const onReset = () => {
//   rincianNpd.value.resetValidation()
// }
onMounted(() => {
  // carisrt.resetFORM()
  // onReset()
  store.getRincianBelanja()
  $q.localStorage.set('rincian_npd', [])
})
async function filterFn (val, update) {
  if (val === '') {
    update(() => {
      options.value = store.rekening50
    })
    return
  }
  if (val === null) {
    update(() => {
      options.value = store.rekening50
    })
    return
  }
  const params = {
    q: val
  }

  const param = { params }

  const resp = await api.get('/v1/transaksi/belanja_ls/anggaran', param)
  console.log('resp', resp.data)
  const data = resp.data

  update(() => {
    options.value = data
    // const filter = ['rek50', 'rincianbelanja']
    // const needle = val.toLowerCase()
    // const multiFilter = (data = [], filterKeys = [], value = '') =>
    //   data.filter((item) => filterKeys.some(
    //     (key) =>
    //       item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
    //         item[key]
    //   )
    //   )
    // let filteredData = multiFilter(store.rekening50, filter, needle)
    // if (!filteredData.length) {
    //   if (val !== '') {
    //     store.getRincianBelanja(val).then(() => {
    //       filteredData = multiFilter(store.options, filter, needle)
    //       options.value = filteredData
    //     })
    //   }
    // }
    // else {
    //   options.value = filteredData
    // }

    // options.value = filteredData
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

// eslint-disable-next-line no-unused-vars
const columns = ref(tablebast)
const selected = ref([])

function deleteData (row) {
  console.log('row', row)
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    console.log('nonpd', store.form.nonpdls)
    const payload = {
      nonpdls: store.form.nonpdls,
      nopenerimaan: row
    }

    store.hapusRinci(payload).then(() => {
      carisrt.refreshTable()
    })
    // store.setForm = props?.row
    // console.log('vv', store.hapusRinci(row))
    // const params = { id: selected.value }
    // emits('deleteIds', selected.value)
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
// function editItem (item) {
//   console.log(item)
//   store.kandungan = null
//   store.kandungan = item
//   store.initForm()
// }
// const form = ref({
//   koderek50: null,
//   itembelanja: null
// })
// function pilihRItemBelanja (val) {
//   const arr = carisrt.itembelanja
//   const cari = arr.find(x => x.rek108 === val)
//   console.log('olene select', cari)
//   store.rinci.idserahterima_rinci = cari.id_bast
//   store.rinci.itembelanja = cari.itembelanja
//   store.rinci.uraian108 = cari.item
//   store.rinci.volume = cari.volume
//   store.rinci.satuan = cari.satuan
//   store.rinci.harga = cari.harga
//   store.rinci.total = cari.pagu
//   store.rinci.volumels = cari.volumebast
//   store.rinci.hargals = cari.hargabast
//   store.rinci.totalls = cari.subtotal
//   store.rinci.nominalpembayaran = cari.subtotal
// }

// eslint-disable-next-line no-unused-vars
function simpanRinci (val) {
  store.reqs.rincianmanual = val
  // SIMPAN RINCIAN PAKAI LOCALSTORAGE JIKA OBJ RINCI KE REPLACE
  // eslint-disable-next-line no-unused-vars
  // const obj = form.value
  const obj = store.rinci
  const rinci = $q.localStorage.getItem('rincian_npd')
  // console.log('rincian sblm push', rinci)

  rinci.push(obj)

  $q.localStorage.set('rincian_npd', rinci)
  store.form.rincians = rinci
  // rincians.value = rinci
  // form.value.koderek50 = null
  // form.value.koderek50 = null
  // console.log('rincian', obj)
  // store.form.rincians.push(obj)
  console.log('abcdefgh', store.form.rincians)

  const unikjumlah = store.form.rincians.map((x) => x.itembelanja)
  const unik = unikjumlah.length ? [...new Set(unikjumlah)] : []
  // console.log('pxpxpxpx', unik)
  const arr = []
  for (let i = 0; i < unik.length; i++) {
    const el = unik[i]
    // console.log('roooow', el)
    const obj = {
      jumlah: store.form.rincians.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
      koderek108: el,
      sisapagu: store.rinci.sisapagu

    }
    // console.log('jumlahnya', obj?.jumlah)
    // console.log('sisa', obj?.sisapagu)
    if (obj?.jumlah > obj?.sisapagu) {
      store.form.rincians = ''
      return notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
    }
    arr.push(obj)

    const subtotal = arr.map((x) => x.jumlah).reduce((x, y) => x + y, 0)
    // console.log('simpan', subtotal)
    store.reqs.subtotal = subtotal
  }

  // const jml = store.form.rincians.map((x) => x.nominalpembayaran)
  // const subtotal = jml.reduce((x, y) => x + y, 0)

  // store.reqs.subtotal = subtotal
  console.log('rincian stlh push', store.form.rincians)
  store.disabled = true
}
// eslint-disable-next-line no-unused-vars
function simpanRinciBast (val) {
  // const obj = store.rinci = val
  // const obj = carisrt.reqs.rincianbast = val
  const rinci = store.rinci = val
  const data = $q.localStorage.getItem('rincian_npd')
  // console.log('sebelum push', rinci)
  data.push(rinci)
  // store.rinci.koderek50 = data?.koderek50 ?? ''
  // store.rinci.rincianbelanja = data?.rincianbelanja ?? ''

  // store.rinci.koderek108 = data?.koderek108 ?? ''
  // store.rinci.uraian108 = data?.uraian108 ?? ''
  // store.rinci.itembelanja = data?.itembelanja ?? ''

  // store.rinci.nopenerimaan = data?.nopenerimaan ?? ''

  // store.rinci.idserahterima_rinci = data?.idserahterima_rinci ?? ''

  // store.rinci.volume = data?.volume ?? ''
  // store.rinci.satuan = data?.satuan ?? ''
  // store.rinci.harga = data?.harga ?? ''
  // store.rinci.total = data?.pagu ?? ''

  // store.rinci.volumels = data?.volumels ?? ''
  // store.rinci.hargals = data?.hargals ?? ''
  // store.rinci.totalls = data?.totalls ?? ''
  // store.rinci.nominalpembayaran = data?.nominalpembayaran ?? ''

  $q.localStorage.set('rincian_npd', data)
  console.log('setelah simpan', data)
  store.form.rincians = data
  // store.form.penerimaans = data.nobast
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
    // console.log('jumlahnya', obj?.jumlah)
    // console.log('sisa', obj?.sisapagu)
    if (obj?.jumlah > obj?.sisapagu) {
      return notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
    } arr.push(obj)
    const subtotal = arr.map((x) => x.jumlah).reduce((x, y) => x + y, 0)
    store.reqs.subtotal = subtotal
  }
  store.disabled = true
}
// function onSimpan () {
//   store.simpanNpdls()
//   // .then(() => {
//   //   store.emptyForm()
//   // })
// }
// eslint-disable-next-line no-unused-vars
function pilihRekening50 (val) {
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
// const onSubmit = () => {
//   // store.simpanNpdls()
//   //   .then(() => {
//   //     if (rincianNpd.value != null) {
//   //       rincianNpd.value.resetValidation()
//   //     }
//   //   })
// }
</script>
<style lang="scss">
.my-sticky-table{
  max-height: 310px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th{
    background-color: #000000;
    color: $white;

  }

  thead tr th{
    position: sticky;
    z-index: 1;
    font-weight: bold;
  }

  /* this will be the loading indicator */
  thead tr:last-child th{
    top: 48px;

  }
    /* height of all previous header rows */

  thead tr:first-child th{
    top: 0;
  }
  .q-td{
    font-size: 3mm;
  }
  /* prevent scrolling behind sticky top row on focus */
  tbody{
    scroll-margin-top: 48px;
    font-size: 1mm;
  }
  .q-table__bottom .q-field__native,
  .q-table__bottom .q-field__inner .q-field__control .q-anchor--skip,
  i.q-icon
   {
    color: $white;
  }
}
</style>
