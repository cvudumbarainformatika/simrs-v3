<template>
  <q-dialog persistent :maximized="true" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="" style="overflow: hidden;">
      <div class="column full-height scroll">
        <div class="col-auto">
          <div class="column">
            <q-bar class="bg-primary text-white">
              <q-space />
              <q-btn v-close-popup dense flat icon="icon-mat-close">
                <q-tooltip class="bg-white text-primary">
                  Close
                </q-tooltip>
              </q-btn>
            </q-bar>

            <div class="q-px-md q-py-sm">
              <div class="row justify-between">
                <div class="kiri column">
                  <div class="row">
                    <div style="width:100px">
                      Ruangan
                    </div>
                    <div> : {{ carigudang(params.koderuangan) }}</div>
                  </div>
                  <div class="row">
                    <div style="width:100px">
                      Kode Barang
                    </div>
                    <div> : {{ item?.kd_obat }}</div>
                  </div>
                  <div class="row">
                    <div style="width:100px">
                      Nama Barang
                    </div>
                    <div> : {{ item?.nama_obat }}</div>
                  </div>
                </div>
                <div class="kanan column">
                  <div class="text-right">
                    Periode
                  </div>
                  <div>
                    Bulan {{ bulans[parseInt(params?.bulan) - 1 ?? 0] }} Tahun {{ params?.tahun }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col full-height">
          <q-scroll-area style="height: calc( 100% - 1px );">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th class="text-end">
                    Masuk
                  </th>
                  <th class="text-end">
                    Keluar
                  </th>
                  <th class="text-end">
                    Stok
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="4">
                    <b>Saldo Awal</b>
                  </td>
                  <td class="text-end ">
                    <b>{{ saldoAwal }}</b>
                  </td>
                </tr>
                <template v-if="bentukArrBaru?.length">
                  <tr v-for="(rinci, n) in bentukArrBaru" :key="rinci">
                    <td
                      :class="rinci?.masuk === 0 ? rinci?.keluar === 0 ? 'text-yellow-9' : 'text-negative' : 'text-primary'">
                      {{ rinci?.tanggal }} <span class=""> {{ rinci?.jam }}</span>
                    </td>
                    <td
                      :class="rinci?.masuk === 0 ? rinci?.keluar === 0 ? 'text-yellow-9' : 'text-negative' : 'text-primary'">
                      {{ rinci?.keterangan }}
                    </td>
                    <td class="text-end">
                      {{ formatDouble((rinci?.masuk ?? 0), 1) }}
                    </td>
                    <td class="text-end">
                      {{ formatDouble((rinci?.keluar ?? 0), 1) }}
                    </td>
                    <td class="text-end">
                      {{ formatDouble((cariHasilAkhirArray(n) ?? 0), 1) }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <b>Saldo Akhir</b>
                    </td>
                    <td class="text-end">
                      <div style="min-height: 30px;" class="f-14">
                        <b>{{ formatDouble((cariHasilAkhirArray(bentukArrBaru?.length) ?? 0), 1) }}</b>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div style="margin-bottom: 100px;" />
          </q-scroll-area>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { date } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

const app = useAplikasiStore()
// const index = ref(-1)

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  params: {
    type: Object,
    default: null
  }
})

const bulans = ref(['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'Novermber', 'Desember'])

const bentukArrBaru = computed(() => {
  const terimalangsung = props?.item?.penerimaanrinci?.filter((x) => x.jenis_penerimaan !== 'Pesanan' && x.kunci === '1')?.map(x => {
    return {
      tgl: x?.tglpenerimaan,
      tanggal: date.formatDate(x?.tglpenerimaan, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tglpenerimaan, 'HH:mm'),
      keterangan: 'Penerimaan Langsung Jenis ' + x.jenis_penerimaan + ' nomor ' + x?.nopenerimaan,
      masuk: parseFloat(x?.jml_terima_k),
      keluar: 0,
      total: 0
    }
  })

  const terimapesan = props?.item?.penerimaanrinci?.filter((x) => x.jenis_penerimaan === 'Pesanan' && x.kunci === '1' && x.jenissurat === 'Faktur')?.map(x => {
    return {
      tgl: x?.tglpenerimaan,
      tanggal: date.formatDate(x?.tglpenerimaan, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tglpenerimaan, 'HH:mm'),
      keterangan: 'Penerimaan Nomor ' + x?.nopenerimaan,
      masuk: parseFloat(x?.jml_terima_k),
      keluar: 0,
      total: 0
    }
  })

  const barangrusak = props?.item?.barangrusak?.map(x => {
    return {
      tgl: x?.tgl_rusak,
      tanggal: date.formatDate(x?.tgl_rusak, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.created_at, 'HH:mm'),
      keterangan: 'Item Obat ' + x?.status,
      masuk: 0,
      keluar: parseFloat(x?.jumlah),
      total: 0
    }
  })
  const mutasikeluar = props?.item?.mutasikeluar?.map(x => {
    return {
      tgl: x?.tgl_permintaan,
      tanggal: date.formatDate(x?.tgl_permintaan, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_permintaan, 'HH:mm'),
      keterangan: 'Mutasi Keluar ke ' + carigudang(x?.dari) + ' nomor: ' + x?.no_permintaan,
      masuk: 0,
      keluar: parseFloat(x?.jml),
      total: 0
    }
  })

  const mutasimasuk = props?.item?.mutasimasuk?.map(x => {
    return {
      tgl: x?.tgl_permintaan,
      tanggal: date.formatDate(x?.tgl_permintaan, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_permintaan, 'HH:mm'),
      keterangan: 'Mutasi Masuk dari ' + carigudang(x?.tujuan) + ' nomor: ' + x?.no_permintaan,
      masuk: parseFloat(x?.jml),
      keluar: 0,
      total: 0
    }
  })
  const noreseps = app?.user?.kdruangansim === 'Gd-04010103' ? props?.item?.distribusipersiapan.map(m => m?.noresep) : []
  const resepkeluar = app?.user?.kdruangansim === 'Gd-04010103'
    ? props?.item?.resepkeluar?.filter(f => !noreseps.includes(f.noresep))?.map(x => {
      return {
        tgl: x?.tgl_selesai,
        tanggal: date.formatDate(x?.tgl_selesai, 'DD, MMM YYYY'),
        jam: date.formatDate(x?.tgl_selesai, 'HH:mm'),
        keterangan: 'Nomor resep ' + x?.noresep,
        masuk: 0,
        keluar: parseFloat(x?.jumlah),
        total: 0
      }
    })
    : props?.item?.resepkeluar?.map(x => {
      return {
        tgl: x?.tgl_selesai,
        tanggal: date.formatDate(x?.tgl_selesai, 'DD, MMM YYYY'),
        jam: date.formatDate(x?.tgl_selesai, 'HH:mm'),
        keterangan: 'Nomor resep ' + x?.noresep,
        masuk: 0,
        keluar: parseFloat(x?.jumlah),
        total: 0
      }
    })

  const resepracikankeluar = props?.item?.resepkeluarracikan?.map(x => {
    return {
      tgl: x?.tgl_selesai,
      tanggal: date.formatDate(x?.tgl_selesai, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_selesai, 'HH:mm'),
      keterangan: 'Nomor resep ' + x?.noresep + ' (Racikan)',
      masuk: 0,
      keluar: parseFloat(x?.jumlah),
      total: 0
    }
  })
  // const returresep = props?.item?.resepkeluar?.map(x => {
  //   const arr = x.retur
  //   return arr.map(x => {
  //     return {
  //       tgl: x?.tgl_retur,
  //       tanggal: date.formatDate(x?.tgl_retur, 'DD, MMM YYYY'),
  //       jam: date.formatDate(x?.tgl_retur, 'HH:mm'),
  //       keterangan: 'Retur Resep ' + x?.noresep,
  //       masuk: x?.rinci?.length
  //         ? x.rinci.filter(y => y.kdobat === props.item?.kd_obat).reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah_retur), 0)
  //         : 0,
  //       keluar: 0,
  //       total: 0
  //     }
  //   })
  //   // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  // })
  const returresep = props?.item?.returpenjualan?.map(x => {
    return {
      tgl: x?.tgl_retur,
      tanggal: date.formatDate(x?.tgl_retur, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_retur, 'HH:mm'),
      keterangan: 'Retur Resep ' + x?.noresep,
      masuk: parseFloat(x?.jumlah_retur),
      keluar: 0,
      total: 0
    }
    // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  })
  const returgudang = props?.item?.returgudang?.map(x => {
    return {
      tgl: x?.tgl_retur,
      tanggal: date.formatDate(x?.tgl_retur, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_retur, 'HH:mm'),
      keterangan: 'Nomor retur gudang ' + x?.no_retur,
      masuk: parseFloat(x?.jumlah),
      keluar: 0,
      total: 0
    }
    // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  })
  const returdepo = props?.item?.returdepo?.map(x => {
    return {
      tgl: x?.tgl_retur,
      tanggal: date.formatDate(x?.tgl_retur, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_retur, 'HH:mm'),
      keterangan: 'Nomor retur gudang ' + x?.no_retur,
      masuk: 0,
      keluar: parseFloat(x?.jumlah),
      total: 0
    }
    // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  })
  const returpbf = props?.item?.returpbf?.map(x => {
    return {
      tgl: x?.tgl_retur,
      tanggal: date.formatDate(x?.tgl_retur, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_retur, 'HH:mm'),
      keterangan: 'Nomor retur PBF ' + x?.no_retur,
      masuk: 0,
      keluar: parseFloat(x?.jumlah_retur),
      total: 0
    }
    // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  })
  const penyesuaian = props?.item?.penyesuaian?.map(x => {
    // const arr = m
    // return arr.map(x => {
    return {
      tgl: x?.tgl_penyesuaian,
      tanggal: date.formatDate(x?.tgl_penyesuaian, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_penyesuaian, 'HH:mm'),
      keterangan: 'Koreksi Stok Awal ',
      masuk: x?.penyesuaian > 0 ? parseFloat(x?.penyesuaian) : 0,
      keluar: x?.penyesuaian < 0 ? parseFloat(-x?.penyesuaian) : 0,
      total: 0
    }
    // })
    // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  })
  const pengembalian = props?.item?.pengembalianrincififo?.map(x => {
    // const arr = m
    // return arr.map(x => {
    return {
      tgl: x?.tgl_kunci,
      tanggal: date.formatDate(x?.tgl_kunci, 'DD, MMM YYYY'),
      jam: date.formatDate(x?.tgl_kunci, 'HH:mm'),
      keterangan: 'Pengambalian Obat Pinjaman ',
      masuk: 0,
      keluar: parseFloat(x?.jumlah),
      total: 0
    }
    // })
    // const rincianReturResep = arrreturResep?.length ? arrreturResep?.map(x => x.rinci)?.reduce((a, b) => a.concat(b), []) : []
  })

  const distribusi = app?.user?.kdruangansim === 'Gd-04010103'
    ? props?.item?.distribusipersiapan?.map(x => {
      return {
        tgl: x?.tgl_distribusi,
        tanggal: date.formatDate(x?.tgl_distribusi, 'DD, MMM YYYY'),
        jam: date.formatDate(x?.tgl_distribusi, 'HH:mm'),
        keterangan: x?.noresep === '' ? 'Nomor Permintaan ' + x?.nopermintaan : 'Nomor Permintaan ' + x?.nopermintaan + ', Diresepkan ' + x?.noresep,
        masuk: 0,
        keluar: parseFloat(x?.keluar),
        total: 0
      }
    })
    : []
  const returdistribusi = app?.user?.kdruangansim === 'Gd-04010103'
    ? props?.item?.persiapanretur.filter(f => parseFloat(f.retur) > 0)?.map(x => {
      return {
        tgl: x?.tgl_retur,
        tanggal: date.formatDate(x?.tgl_retur, 'DD, MMM YYYY'),
        jam: date.formatDate(x?.tgl_retur, 'HH:mm'),
        keterangan: 'Retur Nomor Permintaan ' + x?.nopermintaan,
        masuk: parseFloat(x?.retur),
        keluar: 0,
        total: 0
      }
    })
    : []

  // console.log('masuk', returdistribusi?.reduce((a, b) => parseFloat(a) + parseFloat(b.masuk), 0))
  // console.log('keluar', distribusi?.reduce((a, b) => parseFloat(a) + parseFloat(b.keluar), 0))

  const gabung = [terimalangsung, terimapesan, mutasikeluar, mutasimasuk,
    resepkeluar, resepracikankeluar, returresep, penyesuaian,
    distribusi, returdistribusi, barangrusak, returgudang, returdepo, returpbf, pengembalian].flat(Infinity)

  // const hasil = gabung?.length ? gabung?.filter(x => x.masuk !== x.keluar)?.sort((a, b) => new Date(a.tgl) - new Date(b.tgl)) : [] // ini jika yg aneh tdk dimasukkan
  const hasil = gabung?.length ? gabung?.sort((a, b) => new Date(a.tgl) - new Date(b.tgl)) : []

  return hasil
})

const saldoAwal = computed(() => {
  const awal = props?.item?.saldoawal
  const saldoAwal = awal?.reduce((x, y) => parseFloat(x) + parseFloat(y.jumlah), 0)

  return saldoAwal
})

// eslint-disable-next-line no-unused-vars
function carigudang (val) {
  // console.log(app)
  const gud = app?.gudangs?.find(a => a.kode === val)
  const ruang = app?.ruangs?.find(a => a.kode === val)
  return gud ? gud?.nama ?? '-' : ruang?.uraian ?? '-'
}

// eslint-disable-next-line no-unused-vars
function cariHasilAkhirArray (i) {
  // const total = 0
  const arr = bentukArrBaru.value ?? []
  if (arr?.length) {
    // for (let i = 0; i < arr?.length; i++) {
    // if (i === 0) {
    //   total = arr[0]?.penerimaan - arr[0]?.pengeluaran
    //   arr[0].total = total
    // }
    // else {
    const hinggaKeIndex = i + 1
    const arrBaru = arr.slice(0, hinggaKeIndex)
    // const awal = arr[0]?.penerimaan - arr[0]?.pengeluaran
    // const subT = arr[i]?.penerimaan - arr[i]?.pengeluaran;
    const obj = arrBaru.map((x) => x?.masuk - x?.keluar)
    const skrg = obj?.reduce((x, y) => x + y, 0)

    const total = skrg + saldoAwal.value
    // }
    // }
    return total
  }
  return 0
}

onMounted(() => {
  console.log('props', props?.item)
  console.log('computed', bentukArrBaru.value)
  console.log('saldoAwal', saldoAwal.value)
})
</script>

<style lang="scss" scoped>
.text-end {
  text-align: end;
}

/* Standard Tables */

table {
  // margin: 1em 0;
  // border-collapse: collapse;
  border: 0.1em solid #d6d6d6;
  width: 100%;
}

caption {
  text-align: left;
  font-style: italic;
  padding: 0.25em 0.5em 0.5em 0.5em;
  // position: -webkit-sticky;
  // position: sticky;
  // top: 0;
  // z-index: 2;
}

th,
td {
  padding: 0.25em 0.5em 0.25em 1em;
  vertical-align: text-top;
  text-align: left;
  text-indent: -0.5em;
}

th {
  vertical-align: bottom;
  background-color: #666;
  color: #fff;
}

tr:nth-child(even) th[scope=row] {
  background-color: #f2f2f2;
}

tr:nth-child(odd) th[scope=row] {
  background-color: #fff;
}

tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}

tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.05);
}

td:nth-of-type(2) {
  font-style: italic;
}

tr:hover {
  background-color: #ffff99;
  color: $dark;
  font-weight: bold;
}

// th:nth-of-type(3),
// td:nth-of-type(3) {
//   text-align: right;
// }
/* Fixed Headers */

th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
}

th[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
}

th[scope=row] {
  vertical-align: top;
  color: inherit;
  background-color: inherit;
  background: linear-gradient(90deg, transparent 0%, transparent calc(100% - .05em), #d6d6d6 calc(100% - .05em), #d6d6d6 100%);
}

table:nth-of-type(2) th:not([scope=row]):first-child {
  left: 0;
  z-index: 3;
  background: linear-gradient(90deg, #666 0%, #666 calc(100% - .05em), #ccc calc(100% - .05em), #ccc 100%);
}

/* Strictly for making the scrolling happen. */

th[scope=row]+td {
  min-width: 24em;
}

th[scope=row] {
  min-width: 20em;
}
</style>
