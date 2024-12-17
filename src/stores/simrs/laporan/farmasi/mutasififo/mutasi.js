import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
 
import { formatDoubleKoma } from 'src/modules/formatter'
import { notifErrVue } from 'src/modules/utils'

export const useLaporanMutasiFiFoFarmasiStore = defineStore('laporan_mutasi_fifo_farmasi', {
  state: () => ({
    loading: false,
    loadingNext: false,
    loadingDownload: false,
    items: [],
    meta: {},
    params: {
      q: '',
      per_page: 20,
      page: 1,
      // bulan: '06',
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      kode_ruang: 'all',
      jenis: 'detail'
    },
    bulans: [
      { nama: 'January', value: '01' },
      { nama: 'February', value: '02' },
      { nama: 'Maret', value: '03' },
      { nama: 'April', value: '04' },
      { nama: 'Mei', value: '05' },
      { nama: 'Juni', value: '06' },
      { nama: 'Juli', value: '07' },
      { nama: 'Agustus', value: '08' },
      { nama: 'September', value: '09' },
      { nama: 'Oktober', value: '10' },
      { nama: 'November', value: '11' },
      { nama: 'Desember', value: '12' }
    ],
    gudangs: [
      { nama: 'Semua', value: 'all' },
      { nama: 'Gudang Farmasi ( Kamar Obat )', value: 'Gd-05010100' },
      { nama: 'Gudang Farmasi (Floor Stok)', value: 'Gd-03010100' }
    ],
    optionJenis: [
      { nama: 'Detail', value: 'detail' },
      { nama: 'Rekap', value: 'rekap' }
    ],
    total: 0,
    tTotal: 0,
    htotal: 0,
    htTotal: 0,
    fields: {}
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },
    setSearch (payload) {
      console.log(this.params.q)
      // this.setParams('q', payload)
      this.items = []
      this.setParams('page', 1)
      this.getDataTable()
    },
    setPage (payload) {
      this.setParams('page', payload)
      this.getDataTable()
    },
    setPerPage (payload) {
      this.setParams('per_page', payload)
      this.setParams('page', 1)
      this.getDataTable()
    },
    refreshTable () {
      this.setParams('page', 1)
      this.getDataTable()
    },
    mapingItem (val, array, type) {
      val.forEach(it => {
        it.data = []
        // --- harga dan sub dg bawa penerimaan rinci start ---
        // it?.saldoawal.forEach(s => {
        //   const harTr = s?.rincipenerimaan?.find(trm => trm.kdobat === s.kdobat && trm.nopenerimaan === s.nopenerimaan)
        //   const harga = harTr?.harga ? harTr?.harga : (s?.harga ?? 0)
        //   console.log('har', harTr, harga)
        //   s.harga = harga
        //   s.sub = harga * s.jumlah
        // })
        // it?.saldo.forEach(s => {
        //   const harTr = s?.rincipenerimaan?.find(trm => trm.kdobat === s.kdobat && trm.nopenerimaan === s.nopenerimaan)
        //   const harga = harTr?.harga ? harTr?.harga : (s?.harga ?? 0)
        //   s.harga = harga
        //   s.sub = harga * s.jumlah
        // })
        // if (it?.resepkeluar.length) {
        //   it?.resepkeluar.forEach(res => {
        //     const harTr = res?.rincipenerimaan?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
        //     const harSt = res?.opname?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
        //     const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? res?.harga)
        //     res.harga = harga
        //     res.sub = harga * res.jumlah
        //   })
        // }
        // if (it?.returpenjualan.length) {
        //   it?.returpenjualan.forEach(res => {
        //     const harTr = res?.rincipenerimaan?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
        //     const harSt = res?.opname?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
        //     const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? res?.harga)
        //     res.harga = harga
        //     res.sub = harga * res.jumlah
        //   })
        // }
        // if (it?.resepkeluarracikan.length) {
        //   it?.resepkeluarracikan.forEach(rac => {
        //     const harTr = rac?.rincipenerimaan?.find(trm => trm.kdobat === rac.kdobat && trm.nopenerimaan === rac.nopenerimaan)
        //     const harSt = rac?.opname?.find(trm => trm.kdobat === rac.kdobat && trm.nopenerimaan === rac.nopenerimaan)
        //     const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? rac?.herga)
        //     rac.harga = harga
        //     rac.sub = harga * rac.jumlah

        //     const index = this.params.jenis === 'rekap' ? it.resepkeluar.findIndex(a => a.kdobat === rac.kdobat) : it.resepkeluar.findIndex(a => a.kdobat === rac.kdobat && a.nopenerimaan === rac.nopenerimaan)
        //     if (index >= 0) {
        //       const jum = parseFloat(it.resepkeluar[index].jumlah) + parseFloat(rac.jumlah)
        //       const sub = parseFloat(it.resepkeluar[index].sub) + parseFloat(rac.sub)
        //       it.resepkeluar[index].jumlah = jum
        //       it.resepkeluar[index].sub = sub
        //     }
        //     else it.resepkeluar.push(rac)
        //   })
        // }

        // it?.retur?.forEach(per => {
        //   const harTr = per?.rincipenerimaan?.find(trm => trm.kdobat === per.kdobat && trm.nopenerimaan === per.nopenerimaan)
        //   const harSt = per?.opname?.find(trm => trm.kdobat === per.kdobat && trm.nopenerimaan === per.nopenerimaan)
        //   const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? per?.harga)
        //   per.harga = harga
        //   per.sub = harga * per.jumlah
        // })
        // di pemakaian memang tidak ada harga beli
        it?.pemakaian?.forEach(res => {
          const harTr = res?.rincipenerimaan?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
          const harSt = res?.opname?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
          const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? 0)
          res.harga = harga
          res.sub = harga * res.jumlah
        })
        // --- harga dan sub dg bawa penerimaan rinci start ---
        const masuk = []
        const masukx = []
        const keluar = []
        const resep = it.resepkeluar
        const pak = it.pemakaian
        if (this.params.jenis === 'detail') {
          if (it?.saldoawal.length) {
            it?.saldoawal.forEach(s => {
              s.tgl = this.params.tahun + '-' + this.params.bulan + '-01 00:00:00'
              const temp = {
                tgl: s.tgl,
                saldoawal: s,
                ket: 'Saldo Awal'
              }
              it.data.push(temp)
            })
            it?.saldo?.forEach(sa => {
              masuk.push(sa)
            })
          }
          it?.terima?.forEach(per => {
            masuk.push(per)
          })
          it?.retur?.forEach(per => {
            const ada = masuk.findIndex(a => a.kdobat === per.kdobat && a.nopenerimaan === per.nopenerimaan)
            const adaH = masuk.findIndex(a => a.kdobat === per.kdobat && a.harga === per.harga)
            if (ada >= 0) {
              const jum = parseFloat(masuk[ada].jumlah) + parseFloat(per.jumlah)
              const sub = parseFloat(masuk[ada].sub) + parseFloat(per.sub)
              masuk[ada].jumlah = jum
              masuk[ada].sub = sub
            }
            else if (adaH >= 0) {
              const jum = parseFloat(masuk[adaH].jumlah) + parseFloat(per.jumlah)
              const sub = parseFloat(masuk[adaH].sub) + parseFloat(per.sub)
              masuk[adaH].jumlah = jum
              masuk[adaH].sub = sub
            }
            else masuk.push(per)
          })
          if (it?.penyesuaian?.length) {
            it?.penyesuaian.forEach(p => {
              const index = masuk.findIndex(f => f.nopenerimaan === p.nopenerimaan)
              if (index >= 0) {
                console.log('penye', masuk[index], p)

                const jumM = masuk[index].jumlah + p.jumlah
                const subM = masuk[index].sub + p.sub

                masuk[index].jumlah = jumM
                masuk[index].sub = subM
              }
              else {
                const index2 = masuk.findIndex(f => parseFloat(f.harga) === parseFloat(p.harga))
                if (index2 >= 0) {
                  console.log('else 1', masuk[index2], p)

                  const jumEl = masuk[index2].jumlah + p.jumlah
                  const subEl = masuk[index2].sub + p.sub

                  masuk[index2].jumlah = jumEl
                  masuk[index2].sub = subEl
                }
                else {
                  console.log('else 2')
                }
              }
              if (p?.jumlah > 0) {
                const temp = {
                  tgl: p?.tgl ?? this.params.tahun + '-' + this.params.bulan + '-31 23:00:00',
                  masuk: p,
                  ket: 'Pengembalian sisa pasien'
                }
                it.data.push(temp)
              }
              else {
                const dat = {
                  harga: p?.harga,
                  jumlah: -p?.jumlah,
                  kdobat: p?.kdobat,
                  nopenerimaan: p?.nopenerimaan,
                  sub: -p?.sub,
                  tgl: p?.tgl
                }
                const temp = {
                  tgl: p?.tgl ?? this.params.tahun + '-' + this.params.bulan + '-31 23:00:00',
                  keluar: dat,
                  ket: 'Salah hitung stok opname'
                }
                it.data.push(temp)
              }
            })
            console.log('masuk', masuk)
            // console.log('penyesuaian', it?.penyesuaian, akhir)
          }
          // console.log('masuk', masuk)

          resep?.forEach(res => {
            const temp = {
              tgl: res?.tgl ?? this.params.tahun + '-' + this.params.bulan + '-31 23:00:00',
              keluar: res,
              ket: res?.header?.norm + ' ' + (res?.header?.datapasien?.rs2 ?? '')
            }

            it.data.push(temp)

            let diminta = res.jumlah
            let nilaiDiminta = res.sub
            while (diminta > 0) {
              const index = masuk.findIndex(a => a.jumlah > 0 && a.sub > 0 && a.kdobat === res.kdobat && a.nopenerimaan === res.nopenerimaan)
              // console.log('index res', index)
              // if (masuk[index].harga !== res.harga) console.log('index res', masuk[index], res)
              // if (index >= 0 && masuk[index].harga === res.harga) {
              if (index >= 0) {
                if (masuk[index].jumlah >= diminta) {
                  const sisa = masuk[index].jumlah - diminta
                  masuk[index].jumlah = sisa
                  diminta = 0

                  const nilaiSisa = masuk[index].sub > 0 ? masuk[index].sub - nilaiDiminta : nilaiDiminta
                  masuk[index].sub = nilaiSisa
                  nilaiDiminta = 0
                }
                else {
                  const sisa = diminta - masuk[index].jumlah
                  diminta = sisa
                  masuk[index].jumlah = 0

                  const nilaiSisa = masuk[index].sub > 0 ? masuk[index].sub - nilaiDiminta : nilaiDiminta
                  nilaiDiminta = nilaiSisa
                  masuk[index].sub = 0
                }
              }
              else {
                const index1 = masuk.findIndex(a => a.jumlah > 0 && a.sub > 0 && a.kdobat === res.kdobat && a.harga === res.harga)
                // console.log('index res 1', index1)
                if (index1 >= 0) {
                  if (masuk[index1].jumlah >= diminta) {
                    const sisa = masuk[index1].jumlah - diminta
                    masuk[index1].jumlah = sisa
                    diminta = 0

                    const nilaiSisa = masuk[index1].sub > 0 ? masuk[index1].sub - nilaiDiminta : nilaiDiminta
                    masuk[index1].sub = nilaiSisa
                    nilaiDiminta = 0
                  }
                  else {
                    const sisa = diminta - masuk[index1].jumlah
                    diminta = sisa
                    masuk[index1].jumlah = 0

                    const nilaiSisa = masuk[index1].sub > 0 ? masuk[index1].sub - nilaiDiminta : nilaiDiminta
                    nilaiDiminta = nilaiSisa
                    masuk[index1].sub = 0
                  }
                }
                else {
                  const index2 = masuk.findIndex(a => a.jumlah > 0 && a.sub > 0 && a.kdobat === res.kdobat)
                  // console.log('index res 2', index2, masuk[index2], res)
                  if (index2 >= 0) {
                    if (masuk[index2].jumlah >= diminta) {
                      const sisa = masuk[index2].jumlah - diminta
                      masuk[index2].jumlah = sisa
                      diminta = 0

                      const nilaiSisa = masuk[index2].sub > 0 ? masuk[index2].sub - nilaiDiminta : nilaiDiminta
                      masuk[index2].sub = nilaiSisa
                      nilaiDiminta = 0
                    }
                    else {
                      const sisa = diminta - masuk[index2].jumlah
                      diminta = sisa
                      masuk[index2].jumlah = 0

                      const nilaiSisa = masuk[index2].sub > 0 ? masuk[index2].sub - nilaiDiminta : nilaiDiminta
                      nilaiDiminta = nilaiSisa
                      masuk[index2].sub = 0
                    }
                  }
                  // kalo sampe else coba cek mana yang ga match
                  else {
                    // console.log('index res 2', index2, masuk[index2], res)
                    diminta = 0
                  }
                }
              }
            }
            // if (adaPen.length) {
            //   let index = 0
            //   while (diminta > 0 && index < adaPen.length) {
            //     if (adaPen[index].jumlah >= diminta) {
            //       const sisa = adaPen[index].jumlah - diminta
            //       adaPen[index].jumlah = sisa
            //       diminta = 0

            //       const nilaiSisa = adaPen[index].sub - nilaiDiminta
            //       adaPen[index].sub = nilaiSisa
            //       nilaiDiminta = 0
            //     }
            //     else {
            //       const sisa = diminta - adaPen[index].jumlah
            //       diminta = sisa
            //       adaPen[index].jumlah = 0

            //       const nilaiSisa = adaPen[index].sub - nilaiDiminta
            //       nilaiDiminta = nilaiSisa
            //       adaPen[index].sub = 0

            //       index += 1
            //     }
            //     // console.log('if', adaPen[index], diminta)
            //   }
            // }
            // else if (adaPen1.length) {
            //   let index = 0
            //   while (diminta > 0 && index < adaPen1.length) {
            //     if (adaPen1[index].jumlah >= diminta) {
            //       const sisa = adaPen1[index].jumlah - diminta
            //       adaPen1[index].jumlah = sisa
            //       diminta = 0

            //       const nilaiSisa = adaPen1[index].sub - nilaiDiminta
            //       adaPen1[index].sub = nilaiSisa
            //       nilaiDiminta = 0
            //     }
            //     else {
            //       const sisa = diminta - adaPen1[index].jumlah
            //       diminta = sisa
            //       adaPen1[index].jumlah = 0

            //       const nilaiSisa = adaPen1[index].sub - nilaiDiminta
            //       nilaiDiminta = nilaiSisa
            //       adaPen1[index].sub = 0

            //       index += 1
            //     }
            //     // console.log('if', adaPen[index], diminta)
            //   }
            // }
            // else {
            //   let index = 0
            //   while (diminta > 0 && index < masuk.length) {
            //     if (masuk[index].jumlah >= diminta) {
            //       const sisa = masuk[index].jumlah - diminta
            //       masuk[index].jumlah = sisa
            //       diminta = 0
            //       const nilaiSisa = masuk[index].sub - nilaiDiminta
            //       masuk[index].sub = nilaiSisa
            //       nilaiDiminta = 0
            //     }
            //     else {
            //       const sisa = diminta - masuk[index].jumlah
            //       diminta = sisa
            //       masuk[index].jumlah = 0

            //       const nilaiSisa = masuk[index].sub - nilaiDiminta
            //       nilaiDiminta = nilaiSisa
            //       masuk[index].sub = 0

            //       index += 1
            //     }
            //     // console.log('else', masuk[index])
            //   }
            // }
          })
          pak?.forEach(res => {
            // const harTr = res?.rincipenerimaan?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
            // const harSt = res?.opname?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
            // const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? 0)
            // res.harga = harga
            // res.sub = harga * res.jumlah
            const temp = {
              tgl: res?.tgl ?? this.params.tahun + '-' + this.params.bulan + '-31 23:00:00',
              keluar: res,
              ket: (res?.ruangan?.uraian ?? '')
            }

            it.data.push(temp)
            let diminta = res.jumlah
            let nilaiDiminta = res.sub

            while (diminta > 0) {
              const index = masuk.findIndex(a => (a.jumlah > 0 && a.sub > 0) && a.kdobat === res.kdobat && a.nopenerimaan === res.nopenerimaan)
              // console.log('index pak', index)
              if (index >= 0) {
                if (masuk[index].jumlah >= diminta) {
                  const sisa = masuk[index].jumlah - diminta
                  masuk[index].jumlah = sisa
                  diminta = 0

                  const nilaiSisa = masuk[index].sub - nilaiDiminta
                  masuk[index].sub = nilaiSisa
                  nilaiDiminta = 0
                }
                else {
                  const sisa = diminta - masuk[index].jumlah
                  diminta = sisa
                  masuk[index].jumlah = 0

                  const nilaiSisa = masuk[index].sub - nilaiDiminta
                  nilaiDiminta = nilaiSisa
                  masuk[index].sub = 0
                }
              }
              else {
                const index1 = masuk.findIndex(a => (a.jumlah > 0 && a.sub > 0) && a.kdobat === res.kdobat && a.harga === res.harga)
                // console.log('index pak 1', index1)
                if (index1 >= 0) {
                  if (masuk[index1].jumlah >= diminta) {
                    const sisa = masuk[index1].jumlah - diminta
                    masuk[index1].jumlah = sisa
                    diminta = 0

                    const nilaiSisa = masuk[index1].sub - nilaiDiminta
                    masuk[index1].sub = nilaiSisa
                    nilaiDiminta = 0
                  }
                  else {
                    const sisa = diminta - masuk[index1].jumlah
                    diminta = sisa
                    masuk[index1].jumlah = 0

                    const nilaiSisa = masuk[index1].sub - nilaiDiminta
                    nilaiDiminta = nilaiSisa
                    masuk[index1].sub = 0
                  }
                }
                else {
                  const index2 = masuk.findIndex(a => (a.jumlah > 0 && a.sub > 0) && a.kdobat === res.kdobat)
                  // console.log('index pak 2', index2)
                  if (index2 >= 0) {
                    if (masuk[index2].jumlah >= diminta) {
                      const sisa = masuk[index2].jumlah - diminta
                      masuk[index2].jumlah = sisa
                      diminta = 0

                      const nilaiSisa = masuk[index2].sub - nilaiDiminta
                      masuk[index2].sub = nilaiSisa
                      nilaiDiminta = 0
                    }
                    else {
                      const sisa = diminta - masuk[index2].jumlah
                      diminta = sisa
                      masuk[index2].jumlah = 0

                      const nilaiSisa = masuk[index2].sub - nilaiDiminta
                      nilaiDiminta = nilaiSisa
                      masuk[index2].sub = 0
                    }
                  }
                  else {
                    console.log('kode obat tidak ada', res, masuk.filter(f => f.jumlah > 0))
                    diminta = 0
                  }
                }
              }
            }
            // const adaPen = masuk.filter(a => a.kdobat === res.kdobat && (a.nopenerimaan === res.nopenerimaan || a.harga === res.harga))
            // if (adaPen.length) {
            //   let index = 0
            //   while (diminta > 0 && index < adaPen.length) {
            //     if (adaPen[index].jumlah >= diminta) {
            //       const sisa = adaPen[index].jumlah - diminta
            //       adaPen[index].jumlah = sisa
            //       diminta = 0

            //       const nilaiSisa = adaPen[index].sub - nilaiDiminta
            //       adaPen[index].sub = nilaiSisa
            //       nilaiDiminta = 0
            //     }
            //     else {
            //       const sisa = diminta - adaPen[index].jumlah
            //       diminta = sisa
            //       adaPen[index].jumlah = sisa

            //       const nilaiSisa = adaPen[index].sub - nilaiDiminta
            //       nilaiDiminta = nilaiSisa
            //       adaPen[index].sub = 0
            //       index += 1
            //     }
            //     // console.log('if', adaPen[index], diminta)
            //   }
            // }
            // else {
            //   let index = 0
            //   while (diminta > 0 && index < masuk.length) {
            //     if (masuk[index].jumlah >= diminta) {
            //       const sisa = masuk[index].jumlah - diminta
            //       masuk[index].jumlah = sisa
            //       diminta = 0

            //       const nilaiSisa = masuk[index].sub - nilaiDiminta
            //       masuk[index].sub = nilaiSisa
            //       nilaiDiminta = 0
            //     }
            //     else {
            //       const sisa = diminta - masuk[index].jumlah
            //       diminta = sisa
            //       masuk[index].jumlah = sisa

            //       const nilaiSisa = masuk[index].sub - nilaiDiminta
            //       nilaiDiminta = nilaiSisa
            //       masuk[index].sub = 0

            //       index += 1
            //     }
            //     // console.log('else', masuk[index])
            //   }
            // }
          })
          it?.returpenjualan?.forEach(res => {
            // const harTr = res?.rincipenerimaan?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
            // const harSt = res?.opname?.find(trm => trm.kdobat === res.kdobat && trm.nopenerimaan === res.nopenerimaan)
            // const harga = harTr?.harga ? harTr?.harga : (harSt?.harga ?? 0)
            // res.harga = harga
            // res.sub = harga * res.jumlah
            const temp = {
              tgl: res.tgl,
              masuk: res,
              ket: 'retur dari ' + res?.header?.norm + ' ' + (res?.header?.datapasien?.rs2 ?? '')
            }
            it.data.push(temp)
          })
          it?.penerimaanrinci.forEach(s => {
            const temp = {
              tgl: s.tgl,
              masuk: s,
              ket: s?.pbf?.nama + ' ( ' + s?.jenissurat + ' : ' + s?.nomorsurat + ' ) '
            }
            it.data.push(temp)
          })
        }
        else {
          if (type === 'download') {
            const temp = {
              kd_obat: it?.kd_obat,
              tgl: this.params.tahun + '-' + this.params.bulan + '-01 00:00:00',
              ket: ''
            }
            it.data.push(temp)
          }
          if (it?.saldoawal.length) {
            const sala = {
              kd_obat: it?.kd_obat,
              jumlah: it?.saldoawal?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.saldoawal?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }

            const temp = {
              kd_obat: it?.kd_obat,
              tgl: this.params.tahun + '-' + this.params.bulan + '-01 00:00:00',
              saldoawal: sala,
              ket: type === 'download' ? '' : 'Saldo Awal'
            }
            if (type === 'download')it.data[0].saldoawal = sala
            else it.data.push(temp)

            const salJ = {
              tgl: this.params.tahun + '-' + this.params.bulan + '-01 00:00:00',
              kd_obat: it?.kd_obat,
              jumlah: it?.saldo?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.saldo?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0),
              ket: type === 'download' ? '' : 'Saldo Awal'
            }

            masuk.push(salJ)
            // console.log('sal awal ', masukx)
          }
          if (it?.penyesuaian?.length) {
            const raw = {
              tgl: it?.penyesuaian[0]?.tgl,
              harga: 0,
              kdobat: it?.penyesuaian[0]?.kdobat,
              jumlah: it?.penyesuaian?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.penyesuaian?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0),
              ket: 'Penngembalian sisa pasien'
            }
            if (type === 'download') {
              const index1 = masukx.findIndex(f => f.kd_obat === raw?.kdobat)
              console.log('Ada Peny  index1', raw, index1, masukx)
              if (index1 >= 0) {
                const jumM = masukx[index1].jumlah + raw.jumlah
                const subM = masukx[index1].sub + raw.sub

                masukx[index1].jumlah = jumM
                masukx[index1].sub = subM
              }

              else masukx.push(raw)
            }
            else {
              const index = masuk.findIndex(f => f.kd_obat === raw.kdobat)
              console.log('Ada Peny index', raw, index, masuk)
              if (index >= 0) {
                const jumM = masuk[index].jumlah + raw.jumlah
                const subM = masuk[index].sub + raw.sub

                masuk[index].jumlah = jumM
                masuk[index].sub = subM
              }

              if (raw?.jumlah > 0) {
                it.data.push({
                  tgl: raw?.tgl,
                  masuk: raw,
                  ket: 'Penngembalian sisa pasien'
                })
              }
              else {
                const raw2 = {
                  tgl: raw?.tgl,
                  harga: 0,
                  jumlah: -raw?.jumlah,
                  sub: -raw?.sub
                }
                it.data.push({
                  tgl: raw?.tgl,
                  keluar: raw2,
                  ket: 'Salah hitung stok opname'
                })
              }
            }
            console.log('Ada penyesuanag', masukx, masuk)
            // console.log('penyesuaian', it?.penyesuaian, akhir)
          }
          if (it?.terima?.length) {
            const jumlah = it?.terima?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0)
            const subt = it?.terima?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            const ms = {
              tgl: it?.terima[0].tgl,
              kd_obat: it?.kd_obat,
              jumlah,
              sub: subt,
              ket: type === 'download' ? '' : 'Penerimaan'
            }

            console.log('terima nya ', jumlah, subt, ms)

            if (type === 'download') {
              const index1 = masukx.findIndex(f => f.kd_obat === it?.kd_obat)
              console.log('terima nya index', index1)
              if (index1 >= 0) {
                const jumM = masukx[index1].jumlah + jumlah
                const subM = masukx[index1].sub + subt

                masukx[index1].jumlah = jumM
                masukx[index1].sub = subM
              }
              else masukx.push(ms)
            }
            else {
              const index = masuk.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index >= 0) {
                const jumM = masuk[index].jumlah + ms.jumlah
                const subM = masuk[index].sub + ms.sub

                masuk[index].jumlah = jumM
                masuk[index].sub = subM
              }
              else masuk.push(ms)
            }
            // console.log('terima ', masukx)
          }
          if (it?.returpenjualan?.length) {
            const raw = {
              tgl: it?.returpenjualan[0]?.tgl,
              harga: 0,
              jumlah: it?.returpenjualan?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.returpenjualan?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }
            if (type === 'download') {
              const index1 = masukx.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index1 >= 0) {
                const jumM = masukx[index1].jumlah + raw.jumlah
                const subM = masukx[index1].sub + raw.sub
                console.log('ret ', masukx[index1].jumlah)

                masukx[index1].jumlah = jumM
                masukx[index1].sub = subM
              }
              else masukx.push(raw)
            }
            else {
              const index = masuk.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index >= 0) {
                const jumM = masuk[index].jumlah + raw.jumlah
                const subM = masuk[index].sub + raw.sub

                masuk[index].jumlah = jumM
                masuk[index].sub = subM
              }
            }
            // console.log('ret jual ', masukx)
            if (type !== 'download') {
              it.data.push({
                tgl: raw?.tgl,
                masuk: raw,
                ket: 'Retur Penjualan'
              })
            }
          }

          if (it?.resepkeluar?.length) {
            const raw = {
              tgl: it?.resepkeluar[0]?.tgl,
              harga: 0,
              jumlah: it?.resepkeluar?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.resepkeluar?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }
            if (type !== 'download') {
              it.data.push({
                tgl: raw?.tgl,
                keluar: raw,
                ket: 'Resep'
              })
            }
            if (type === 'download') {
              const index = keluar.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index >= 0) {
                const jumM = keluar[index].jumlah + raw.jumlah
                const subM = keluar[index].sub + raw.sub

                keluar[index].jumlah = jumM
                keluar[index].sub = subM
              }
              else {
                keluar.push(raw)
              }
            }
            else {
              const index = masuk.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index >= 0) {
                const jumM = masuk[index].jumlah - raw.jumlah
                const subM = masuk[index].sub - raw.sub

                masuk[index].jumlah = jumM
                masuk[index].sub = subM
              }
            }
          }
          if (it?.pemakaian?.length) {
            const raw = {
              tgl: it?.pemakaian[0]?.tgl,
              harga: 0,
              jumlah: it?.pemakaian?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.pemakaian?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }
            if (type !== 'download') {
              it.data.push({
                tgl: raw?.tgl,
                keluar: raw,
                ket: 'Ruangan'
              })
            }
            if (type === 'download') {
              const index = keluar.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index >= 0) {
                const jumM = keluar[index].jumlah + raw.jumlah
                const subM = keluar[index].sub + raw.sub

                keluar[index].jumlah = jumM
                keluar[index].sub = subM
              }
              else {
                keluar.push(raw)
              }
            }
            else {
              const index = masuk.findIndex(f => f.kd_obat === it?.kd_obat)
              if (index >= 0) {
                const jumM = masuk[index].jumlah - raw.jumlah
                const subM = masuk[index].sub - raw.sub

                masuk[index].jumlah = jumM
                masuk[index].sub = subM
              }
            }
          }

          if (it?.penerimaanrinci?.length) {
            const ms = {
              kd_obat: it?.kd_obat,
              jumlah: it?.penerimaanrinci?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: it?.penerimaanrinci?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }
            const temp = {
              tgl: it?.penerimaanrinci[0].tgl,
              masuk: ms,
              ket: 'Penerimaan'
            }
            if (type !== 'download') it.data.push(temp)
            // else {
            //   const index = masuk.findIndex(f => f.kd_obat === it?.kd_obat)
            //   if (index >= 0) {
            //     const jumM = masuk[index].jumlah + ms.jumlah
            //     const subM = masuk[index].sub + ms.sub

            //     masuk[index].jumlah = jumM
            //     masuk[index].sub = subM
            //   }
            // }
            // console.log('pen rinc ', masukx)
          }
        }
        if (type === 'download' && this.params.jenis === 'rekap') {
          if (masukx?.length) {
            const mas = {
              kd_obat: it?.kd_obat,
              jumlah: masukx?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: masukx?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }
            it.data[0].masuk = mas
          }
          if (keluar?.length) {
            const kel = {
              kd_obat: it?.kd_obat,
              jumlah: keluar?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
              sub: keluar?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
            }
            it.data[0].keluar = kel
          }
          const jAw = it.data[0]?.saldoawal?.jumlah ?? 0
          const sAw = it.data[0]?.saldoawal?.sub ?? 0

          const jMa = it.data[0]?.masuk?.jumlah ?? 0
          const sMa = it.data[0]?.masuk?.sub ?? 0

          const jKe = it.data[0]?.keluar?.jumlah ?? 0
          const sKe = it.data[0]?.keluar?.sub ?? 0
          const akh = {
            kd_obat: it?.kd_obat,
            jumlah: jAw + jMa - jKe,
            sub: sAw + sMa - sKe
          }
          if (it.data?.length > 0)it.data[0].akhir = akh

          it.masuk = masukx
          it.keluar = keluar
        }
        else {
          const akhir = masuk.filter(f => f.jumlah !== 0)
          it.akhir = akhir.filter(f => f.jumlah !== 0)
          it.akhir.forEach(s => {
            s.tgl = this.params.tahun + '-' + this.params.bulan + '-31 23:59:50'
            const temp = {
              tgl: s.tgl,
              ket: 'Saldo Akhir'
            }
            if (this.params.jenis === 'rekap' && it.data.filter(f => f.masuk)?.map(m => m.masuk)?.length > 1) {
              temp.akhir = s
              temp.masuk = {
                jumlah: it.data.filter(f => f.masuk)?.map(m => m.masuk)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0),
                sub: it.data.filter(f => f.masuk)?.map(m => m.masuk)?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
              }
            }
            else {
              temp.akhir = s
            }
            // console.log('temp akhir', temp)

            if (type !== 'download') it.data.push(temp)
          })
        }
        const jumAk = it?.akhir?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0)
        const subAk = it?.akhir?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
        const jumAw = it?.saldoawal?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0)
        const subAw = it?.saldoawal?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
        const jumMs = it?.data?.filter(f => !!f.masuk)?.map(m => m.masuk)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0)
        const subMs = it?.data?.filter(f => !!f.masuk)?.map(m => m.masuk)?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
        const jumKel = it?.data?.filter(f => !!f.keluar)?.map(m => m.keluar)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlah), 0)
        const subKel = it?.data?.filter(f => !!f.keluar)?.map(m => m.keluar)?.reduce((a, b) => parseFloat(a) + parseFloat(b.sub), 0)
        const subt = {
          tgl: this.params.tahun + '-' + this.params.bulan + '-31 23:59:59',
          subtotal: {
            jumlah: jumAk,
            sub: subAk
          },
          subAw: {
            jumlah: jumAw,
            sub: subAw
          },
          subMs: {
            jumlah: jumMs,
            sub: subMs
          },
          subKel: {
            jumlah: jumKel,
            sub: subKel
          },
          ket: type === 'download' ? '' : 'Subtotal Saldo Akhir'
        }
        if (this.params.jenis === 'detail' && (jumAk > 0 || jumAw > 0 || jumMs > 0 || jumKel > 0)) it?.data.push(subt)
        // if (this.params.jenis === 'rekap' && type === 'download') it?.data.push(subt)

        it?.data?.sort(function (a, b) {
          const dateA = new Date(a.tgl)
          const dateB = new Date(b.tgl)

          // Subtract the dates to get a value that is either negative, positive, or zero
          return dateA - dateB
        })
        const index = array.findIndex(a => a.kd_obat === it.kd_obat)
        if (index >= 0) array[index] = it
        else array.push(it)
      })

      // array = val
      console.log('metani items', array)
    },
    getInitialData (val) {
      this.setParams('page', val)
      this.getDataTable()
      this.meta = {}
      this.items = []
    },
    setField () {
      if (this.params.jenis === 'rekap') {
        this.fields = {
          No: 'no',
          'Kode Obat': 'kd_obat',
          'Nama Obat': 'nama_obat',
          Satuan: 'satuan_k',
          'Kode Belanja': 'uraian50',
          Keterangan: 'ket',
          'Jumlah Saldo Awal': 'jumlSalAwal',
          'Nilai Saldo Awal': 'nilaiSalAwal',
          'Jumlah Masuk': 'jumlMasuk',
          'Nilai Masuk': 'nilaiMasuk',
          'Jumlah Keluar': 'jumlKeluar',
          'Nilai Keluar': 'nilaiKeluar',
          'Jumlah Saldo Akhir': 'jumlSalAkhir',
          'Nilai Saldo Akhir': 'nilaiSalAkhir'
        }
      }
      else {
        this.fields = {
          No: 'no',
          'Kode Obat': 'kd_obat',
          'Nama Obat': 'nama_obat',
          Satuan: 'satuan_k',
          Keterangan: 'ket',
          'Jumlah Saldo Awal': 'jumlSalAwal',
          'Harga Saldo Awal': 'harSalAwal',
          'Nilai Saldo Awal': 'nilaiSalAwal',
          'Tanggal Masuk': 'tglMasuk',
          'Jumlah Masuk': 'jumlMasuk',
          'Harga Masuk': 'harMasuk',
          'Nilai Masuk': 'nilaiMasuk',
          'Tanggal Keluar': 'tglKeluar',
          'Jumlah Keluar': 'jumlKeluar',
          'Harga Keluar': 'harKeluar',
          'Nilai Keluar': 'nilaiKeluar',
          'Jumlah Saldo Akhir': 'jumlSalAkhir',
          'Harga Saldo Akhir': 'harSalAkhir',
          'Nilai Saldo Akhir': 'nilaiSalAkhir'
        }
      }
    },
    cekNan (val) {
      return isNaN(parseFloat(val)) ? '' : val
    },
    async fetch () {
      // laravel throttle 180 ms
      this.setField()
      const param = { params: this.params }
      // console.log('param', param)
      param.params.action = 'download'

      const data = []
      const dataForTotal = []
      const items = []
      const resp = await api.get('v1/simrs/laporan/farmasi/pemakaian/get-mutasi', param)
      // await api.get('v1/simrs/laporan/farmasi/pemakaian/get-mutasi', param)
      // .then(resp => {
      if (!resp?.data?.data?.length) return notifErrVue('Data tidak ditemukan')
      this.mapingItem(resp?.data?.data, items, 'download')
      items.forEach((item, i) => {
        // console.log('item', item)
        if (item?.data?.length) {
          item?.data.forEach((dat, d) => {
            const ada = {}
            const tmpForTot = {}
            if (d === 0) {
              ada.no = i + 1
              ada.kd_obat = item?.kd_obat
              ada.nama_obat = item?.nama_obat
              ada.satuan_k = item?.satuan_k
              if (this.params.jenis === 'rekap') ada.uraian50 = item?.uraian50
            }
            // ini untuk menjmlah total
            tmpForTot.jumlSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.jumlah), 2))
            tmpForTot.nilaiSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.sub), 2))
            tmpForTot.jumlMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.jumlah), 2))
            tmpForTot.nilaiMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.sub), 2))
            tmpForTot.jumlKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.jumlah), 2))
            tmpForTot.nilaiKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.sub), 2))
            tmpForTot.jumlSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.jumlah), 2))
            tmpForTot.nilaiSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.sub), 2))

            if (this.params.jenis === 'rekap') {
              ada.ket = dat?.ket
              ada.jumlSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.jumlah), 2))
              ada.nilaiSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.sub), 2))
              ada.jumlMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.jumlah), 2))
              ada.nilaiMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.sub), 2))
              ada.jumlKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.jumlah), 2))
              ada.nilaiKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.sub), 2))
              ada.jumlSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.jumlah), 2))
              ada.nilaiSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.sub), 2))
            }
            else {
              ada.ket = dat?.ket
              ada.jumlSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.jumlah ?? dat?.subAw?.jumlah), 2))
              ada.harSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.harga), 2))
              ada.nilaiSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.sub ?? dat?.subAw?.sub), 2))
              ada.tglMasuk = dat?.masuk?.tgl ?? ''
              ada.jumlMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.jumlah ?? dat?.subMs?.jumlah), 2))
              ada.harMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.harga), 2))
              ada.nilaiMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.sub ?? dat?.subMs?.sub), 2))
              ada.tglKeluar = dat?.keluar?.tgl ?? ''
              ada.jumlKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.jumlah ?? dat?.subKel?.jumlah), 2))
              ada.harKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.harga), 2))
              ada.nilaiKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.sub ?? dat?.subKel?.sub), 2))
              ada.jumlSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.jumlah ?? dat?.subtotal?.jumlah), 2))
              ada.harSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.harga), 2))
              ada.nilaiSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.sub ?? dat?.subtotal?.sub), 2))
            }
            // console.log('ada', ada)
            data.push(ada)
            dataForTotal.push(tmpForTot)
          })
        }
        else {
          console.log('ada tidak')
          const temp = {}
          temp.no = i + 1
          temp.kd_obat = item?.kd_obat
          temp.nama_obat = item?.nama_obat
          temp.satuan_k = item?.satuan_k
          if (this.params.jenis === 'rekap') temp.uraian50 = item?.uraian50

          data.push(temp)
        }
      })
      // total
      const tot = {
        ket: 'Total',
        jumlSalAwal: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlSalAwal) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlSalAwal), 0), 2)),
        nilaiSalAwal: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiSalAwal) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiSalAwal), 0), 2)),
        jumlMasuk: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlMasuk) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlMasuk), 0), 2)),
        nilaiMasuk: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiMasuk) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiMasuk), 0), 2)),
        jumlKeluar: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlKeluar) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlKeluar), 0), 2)),
        nilaiKeluar: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiKeluar) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiKeluar), 0), 2)),
        jumlSalAkhir: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlSalAkhir) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlSalAkhir), 0), 2)),
        nilaiSalAkhir: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiSalAkhir) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiSalAkhir), 0), 2))
      }
      data.push(tot)
      console.log('items', data)
      return data
      // })
    },
    startDownload () { this.loadingDownload = true },
    finishDownload () { this.loadingDownload = false },
    async getDataTable () {
      this.setParams('action', '')
      this.setParams('per_page', 20)
      if (this.params.page === 1) this.loading = true
      else this.loadingNext = true
      const param = { params: this.params }
      await api.get('v1/simrs/laporan/farmasi/pemakaian/get-mutasi', param)
        .then(resp => {
          this.loading = false
          this.loadingNext = false
          // console.log('data tabel', resp.data)
          this.meta = resp.data?.meta
          // this.items = resp?.data?.data
          this.mapingItem(resp?.data?.data, this.items)
        })
        .catch(() => {
          this.loading = false
          this.loadingNext = false
        })
    }
  }
})
