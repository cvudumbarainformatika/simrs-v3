<template>
  <q-table class="my-sticky-header" flat title="Treats" :rows="store.items" :columns="columns" row-key="name"
    @request="store.onRequest" v-model:pagination="store.params" :filter="store.params.q" :loading="store.loading"
    :rows-per-page-options="[10, 20, 50, 100, 500, 1000]">
    <template #top-left>
      <div class="flex q-qutter-sm z-top">
        <div>
          <q-input outlined color="white" dark dense debounce="300" v-model="store.params.q" placeholder="Cari Obat">
            <template #append>
              <q-icon name="icon-mat-search" />
            </template>
          </q-input>
        </div>
        <div class="q-mx-sm">
          <q-select v-model="bulan" :options="bulans" outlined dark dense color="white" style="width:150px"
            @update:model-value="changeMonth" />
        </div>
        <div>
          <q-select v-model="store.params.tahun" :options="tahuns" outlined dark dense color="white"
            style="width:100px" />
        </div>
      </div>
    </template>
    <template #top-right>
      <!-- refresh Ids -->
      <q-btn unelevated round size="sm" icon="icon-mat-refresh" @click="store.goToPage(1)">
        <q-tooltip class="primary" :offset="[10, 10]">
          Refresh Table
        </q-tooltip>
      </q-btn>
      <q-btn flat icon="icon-my-file-excel" size="sm" padding="sm" round no-caps @click="exportTable">
        <q-tooltip>Export Ke Excel</q-tooltip>
      </q-btn>
    </template>
    <template #no-data="{ message, filter }">
      <div class="absolute-top fit row flex-center bg-transparent items-center text-dark">
        <div class="row items-center q-gutter-sm">
          <q-icon size="2em" name="icon-mat-eye" />
          <div>
            Data tidak ditemukan... {{ message }}
          </div>
          <div class="text-h4">
            {{ filter ? '🏷️' : '🏷️' }}
          </div>
        </div>
        <!-- <q-icon size="2em" :name="filter ? 'icon-mat-list' : icon" /> -->
      </div>
    </template>
    <template #body="props">
      <q-tr :props="props" @click="onRowClick(props.row)">
        <q-td v-if="!props.row?.loading" key="nama_obat" :props="props">
          {{ props.row.nama_obat }}
        </q-td>
        <q-td v-if="!props.row?.loading" key="saldo_awal" :props="props">
          {{ props?.cols[1]?.value }}
        </q-td>
        <q-td v-if="!props.row?.loading" key="masuk" :props="props">
          {{ props?.cols[2]?.value }}
        </q-td>
        <q-td v-if="!props.row?.loading" key="keluar" :props="props">
          {{ props?.cols[3]?.value }}
        </q-td>
        <q-td v-if="!props.row?.loading" key="stok_akhir" :props="props">
          {{ props?.cols[4]?.value }}
        </q-td>
        <q-td v-if="!props.row?.loading" key="stok_sekarang" :props="props">
          {{ props?.cols[5]?.value }}
        </q-td>
        <q-td v-if="!props.row?.loading" key="stok_fisik" :props="props">
          {{ props?.cols[6]?.value }}
        </q-td>
        <q-td v-if="props.row?.loading" colspan="7">
          <div class="bg-yellow text-center">
            Sebentar... sedang ambil data rinci ...
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { date, exportFile, useQuasar } from 'quasar'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useKartuStokFarmasiStore } from 'src/stores/simrs/farmasi/katustok'
import { onMounted, ref } from 'vue'

const store = useKartuStokFarmasiStore()
const $q = useQuasar()
const bulan = ref('Januari')
const bulans = ref(['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'])
const tahuns = ref([])
const app = useAplikasiStore()
const keteranganStok = ref('Stok Sekarang')
const columnsx = [
  {
    name: 'nama_obat',
    required: true,
    label: 'DETAIL OBAT',
    align: 'left',
    sortable: false,
    key: 'nama_obat',
    field: 'nama_obat'
  },
  { name: 'saldo_awal', label: 'Saldo Awal', align: 'right', field: (row) => hitungSaldoAwal(row?.saldoawal), key: 'saldo_awal' },
  {
    name: 'masuk',
    label: 'Stok Masuk',
    align: 'right',
    field: (row) => (
      hitungPenerimaan(row?.penerimaanrinci) + hitungMutasiMasuk(row?.mutasimasuk) + newReturResep(row?.returpenjualan) +
      hitungPenyesuaianMasuk(row?.penyesuaian) + hitungReturDistribusi(row?.persiapanretur) + hitungReturGudang(row?.returgudang)
    )
  },
  {
    name: 'keluar',
    label: 'Stok Keluar',
    align: 'right',
    field: (row) => (hitungMutasiKeluar(row?.mutasikeluar) + hitungResepKeluar(row?.resepkeluar, row?.distribusipersiapan) +
      hitungResepRacikanKeluar(row?.resepkeluarracikan) + hitungPenyesuaianKeluar(row?.penyesuaian) + hitungDistribusi(row?.distribusipersiapan) +
      hitungBarangRusak(row?.barangrusak) + hitungReturDepo(row?.returdepo) + returPbf(row?.returpbf) + pengembalian(row?.pengembalianrincififo)
    )
  },
  {
    name: 'stok_akhir',
    label: 'Stok Akhir',
    field: (row) => hitungTotal(row),
    align: 'right'
  },
  {
    name: 'stok_sekarang',
    label: keteranganStok.value,
    field: (row) => stokSekarang(row),
    align: 'right'
  },
  {
    name: 'stok_fisik',
    label: 'Stok Fisik',
    field: (row) => stokFisik(row),
    align: 'right'
  }
]

const columns = ref(columnsx)

onMounted(() => {
  init()
})

function init () {
  const d = new Date()
  const b = d.getMonth()
  bulan.value = bulans.value[b]
  // store.setTahun(d.getFullYear())
  store.params.tahun = d.getFullYear()
  generateArrayOfYears()
  changeMonth(bulan.value)
}

// function lihat (pro) {
//   console.log(pro)
// }

function generateArrayOfYears () {
  const max = new Date().getFullYear()
  const min = max - 5
  const years = []

  for (let i = max; i >= min; i--) {
    years.push(i)
  }
  tahuns.value = years
}

function changeMonth (val) {
  const cariIndexBulans = bulans.value.findIndex((x) => x === val) + 1
  const serial = cariIndexBulans <= 9 ? '0' + cariIndexBulans : cariIndexBulans
  store.params.bulan = serial
  // store.getData()
}

function hitungSaldoAwal (arr) {
  return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
}

function hitungPenerimaan (arr) {
  // jika jenis penerimaan bukan 'Pesanan' maka langsung jadi stok .... asal kunci =1
  // jika jenis penerimaan = 'Pesanan' maka harus jadi Faktur dulu,  jadi stok .... asal kunci = 1
  // const filt = arr?.filter((x) => x.jenissurat !== 'Surat Jalan') sf

  const terimalangsung = arr?.filter((x) => x.jenis_penerimaan !== 'Pesanan' && x.kunci === '1')
  const jmlterimalangsung = terimalangsung?.reduce((x, y) => parseFloat(x) + parseFloat(y.jml_terima_k), 0)

  const terimafaktur = arr?.filter((x) => x.jenis_penerimaan === 'Pesanan' && x.kunci === '1' && x.jenissurat === 'Faktur')
  const jmlterimafaktur = terimafaktur?.reduce((x, y) => parseFloat(x) + parseFloat(y.jml_terima_k), 0)

  // eslint-disable-next-line no-unused-vars
  const totalJml = jmlterimalangsung + jmlterimafaktur
  return totalJml
}
function hitungMutasiKeluar (arr) {
  return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jml), 0)
}
function hitungMutasiMasuk (arr) {
  return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jml), 0)
}
function hitungReturGudang (arr) {
  return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
}
function hitungReturDepo (arr) {
  return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
}
const gudang = ['Gd-05010100', 'Gd-03010100']
function hitungBarangRusak (arr) {
  // console.log(gudang.includes(app?.user?.kdruangansim), app?.user?.kdruangansim)
  if (gudang.includes(app?.user?.kdruangansim)) return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
  else return 0
}
function hitungResepKeluar (arr, dist) {
  // if (app?.user?.kdruangansim === 'Gd-04010103') {
  //   const noreseps = app?.user?.kdruangansim === 'Gd-04010103' ? dist?.map(m => m?.noresep) : []
  //   // console.log('nores', noreseps)
  //   const resepkeluar = arr?.filter(f => !noreseps.includes(f?.noresep))?.reduce((x, y) => parseFloat(x) + parseFloat(y?.jumlah), 0)

  //   return resepkeluar
  // }
  // else {
  //   const resepkeluar = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)

  //   // console.log('returresep', jmlRetur)
  //   return resepkeluar
  // }
  const resepkeluar = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)

  // console.log('returresep', jmlRetur)
  return resepkeluar
}
function hitungDistribusi (arr) {
  if (app?.user?.kdruangansim === 'Gd-04010103') {
    const dsitribusi = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.keluar), 0)

    // console.log('returresep', jmlRetur)
    return dsitribusi
  }
  else return 0
}
function hitungReturDistribusi (arr) {
  if (app?.user?.kdruangansim === 'Gd-04010103') {
    const returDist = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.retur), 0)

    // console.log('returresep', jmlRetur)
    return returDist
  }
  else return 0
}

function hitungResepRacikanKeluar (arr) {
  const resepkeluar = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
  // console.log('racikan', resepkeluar)
  return resepkeluar
}

function newReturResep (arr) {
  const jmlRetur = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah_retur), 0)
  // console.log('racikan', jmlRetur)
  return jmlRetur
}
function returPbf (arr) {
  const jmlRetur = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah_retur), 0)
  // console.log('racikan', jmlRetur)
  return jmlRetur
}
function pengembalian (arr) {
  const pengembalian = arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
  // console.log('pengembalian', arr, pengembalian)
  return pengembalian
}
// function returResep (arr, kodeObat) {
//   const arrreturResep = arr?.length ? arr.map(x => x.retur)?.reduce((a, b) => a.concat(b), []) : []
//   const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x?.rinci)?.reduce((a, b) => a.concat(b), []) : []
//   const rinciWhereKode = rincianReturResep?.length ? rincianReturResep?.filter(x => x?.kdobat === kodeObat) : []
//   const jmlRetur = rinciWhereKode?.reduce((x, y) => parseFloat(x) + parseFloat(y?.jumlah_retur), 0)
//   return jmlRetur
// }

function hitungPenyesuaianMasuk (arr) {
  // const penye = arr?.map(m => m?.ssw)
  // console.log('penye', arr)

  const penye = arr
  const masuk = []
  const anu = penye?.filter(f => f.penyesuaian > 0)
  if (anu?.length) {
    anu.forEach(s => {
      masuk.push(s)
    })
  }
  // penye?.forEach(e => {
  // })
  return masuk?.reduce((x, y) => parseFloat(x) + parseFloat(y.penyesuaian), 0)
}
function hitungPenyesuaianKeluar (arr) {
  // const penye = arr?.map(m => m.ssw)
  const penye = arr
  const keluar = []
  const anu = penye?.filter(f => f.penyesuaian < 0)
  if (anu?.length) {
    anu.forEach(s => {
      keluar.push(s)
    })
  }
  // penye?.forEach(e => {
  // })

  return keluar?.reduce((x, y) => parseFloat(x) + parseFloat(-y.penyesuaian), 0)
}

function stokSekarang (arr) {
  // let jumlah = 0
  const bulanIni = date.formatDate(Date.now(), 'MM')
  // console.log('bulan', bulanIni, store.params.bulan, bulanIni === store.params.bulan.toString())

  if (bulanIni === store.params.bulan.toString()) {
    // console.log('jumlah', arr?.stok?.map(m => m.jumlah), arr?.stok?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0))
    return arr?.stok?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
  }
  else {
    return arr?.saldoakhir?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
  }
}
function stokFisik (arr) {
  return arr?.fisik?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)
}
// function persiapanOperasiKeluar (arr) {
//   return arr?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah_distribusi), 0)
// }

function hitungTotal (row) {
  // const total = hitungSaldoAwal(row?.saldoawal) + (hitungPenerimaan(row?.penerimaanrinci) ?? 0) + (hitungMutasiMasuk(row?.mutasimasuk) ?? 0) + (returResep(row?.resepkeluar) ?? 0) -
  // (hitungMutasiKeluar(row?.mutasikeluar) ?? 0) - hitungResepKeluar(row?.resepkeluar) - (hitungResepRacikanKeluar(row?.resepkeluarracikan) ?? 0)
  // console.log('masuk', hitungReturDistribusi(row?.persiapanretur))
  // console.log('keluar', hitungDistribusi(row?.distribusipersiapan))

  // eslint-disable-next-line no-unused-vars
  const awal = hitungSaldoAwal(row?.saldoawal)
  // eslint-disable-next-line no-unused-vars
  const masuk = hitungPenerimaan(row?.penerimaanrinci) + hitungMutasiMasuk(row?.mutasimasuk) + newReturResep(row?.returpenjualan) +
    hitungPenyesuaianMasuk(row?.penyesuaian) + hitungReturDistribusi(row?.persiapanretur) + hitungReturGudang(row?.returgudang)
  // eslint-disable-next-line no-unused-vars
  const keluar = hitungMutasiKeluar(row?.mutasikeluar) + hitungResepKeluar(row?.resepkeluar, row?.distribusipersiapan) +
    hitungResepRacikanKeluar(row?.resepkeluarracikan) + hitungPenyesuaianKeluar(row?.penyesuaian) + hitungDistribusi(row?.distribusipersiapan) +
    hitungBarangRusak(row?.barangrusak) + hitungReturDepo(row?.returdepo) + returPbf(row?.returpbf) + pengembalian(row?.pengembalianrincififo)
  // eslint-disable-next-line no-unused-vars
  const total = awal + masuk - keluar
  return total
  // return awal + ' ' + masuk + ' ' + keluar+ ' ' + total
}

function exportTable () {
  // naive encoding to csv format
  const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
    store.items?.map(row => columns.value.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        // eslint-disable-next-line no-void
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  // console.log('content', content)

  const status = exportFile(
    `kartu-stok-${store.params.bulan}-${store.params.tahun}.csv`,
    content,
    // 'text/csv'
    {
      encoding: 'utf-8',
      mimeType: 'text/csv',
      byteOrderMark: '\uFEFF'
    }
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

function wrapCsvValue (val, formatFn, row) {
  // eslint-disable-next-line no-void
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  // eslint-disable-next-line no-void
  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

// eslint-disable-next-line no-unused-vars
function onRowClick (row) {
  console.log('onRowClick', row)
  // store.setItem(row)
  store.getDetail(row)
}

// function delokIsineProps (props) {
//   console.log('props', props)
// }

</script>

<style lang="scss">
.my-sticky-header {
  /* height or max-height is important */
  height: 100%;

  div.q-table__top,
  .q-table__bottom,
  tr:first-child th {
    background-color: $primary;
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
