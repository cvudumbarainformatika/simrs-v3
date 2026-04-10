import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";

export const useRbaStore = defineStore('store_rba_siasik', {
  state: () => ({
    loading: false,
    reqs: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      jenis: null,
    },
    display: {
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      tahunsekarang: date.formatDate(Date.now(), 'YYYY')
    },
    dialogCetak: false,
    tglcetak: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    datarba: [],
    items: [],
    jenis: [{ jenis: 'Rinci Kegiatan', value: '1' }, { jenis: 'Rinci Item', value: '2' }]
  }),
  actions: {
    getData() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('v1/siasik/rba/getdatarba', params).then((resp) => {
          console.log('Data RBA', resp)
          if (resp.status === 200) {
            this.datarba = resp.data?.anggaran
            this.datarbaawal = resp.data?.anggaranawal

            this.mapingData()
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    mapingData() {
      const rba = []
      const unik1 = this.datarba.concat(this.datarbaawal).map((x) => x.kode1)
      const elunik1 = unik1?.length ? [...new Set(unik1)] : []
      for (let i = 0; i < elunik1?.length; i++) {
        const el = elunik1[i];
        const arr = this.datarba.concat(this.datarbaawal)
        const pagu = arr.filter((x) => x.kode1 === el).map((x) => parseFloat(x?.pagu) || 0).reduce((a, b) => a + b, 0)
        const paguawal = arr.filter((x) => x.kode1 === el).map((x) => parseFloat(x?.paguawal) || 0).reduce((a, b) => a + b, 0)
        const obj = {
          kode: arr.filter((x) => x.kode1 === el)[0].kode1,
          uraian: arr.filter((x) => x.kode1 === el)[0].uraian1,
          pagu,
          paguawal,
          selisih: pagu - paguawal,
          rincian: []
        }
        rba.push(obj)
      }
      const unik2 = this.datarba.concat(this.datarbaawal).map((x) => x.kode2)
      const elunik2 = unik2?.length ? [...new Set(unik2)] : []
      for (let i = 0; i < elunik2?.length; i++) {
        const el = elunik2[i];
        const arr = this.datarba.concat(this.datarbaawal)
        const pagu = arr.filter((x) => x.kode2 === el).map((x) => parseFloat(x?.pagu) || 0).reduce((a, b) => a + b, 0)
        const paguawal = arr.filter((x) => x.kode2 === el).map((x) => parseFloat(x?.paguawal) || 0).reduce((a, b) => a + b, 0)
        const obj = {
          kode: arr.filter((x) => x.kode2 === el)[0].kode2,
          uraian: arr.filter((x) => x.kode2 === el)[0].uraian2,
          pagu,
          paguawal,
          selisih: pagu - paguawal,
          rincian: []
        }
        rba.push(obj)
      }

      const unik3 = this.datarba.concat(this.datarbaawal).map((x) => x.kode3)
      const elunik3 = unik3?.length ? [...new Set(unik3)] : []
      for (let i = 0; i < elunik3?.length; i++) {
        const el = elunik3[i];
        const arr = this.datarba.concat(this.datarbaawal)
        const pagu = arr.filter((x) => x.kode3 === el).map((x) => parseFloat(x?.pagu) || 0).reduce((a, b) => a + b, 0)
        const paguawal = arr.filter((x) => x.kode3 === el).map((x) => parseFloat(x?.paguawal) || 0).reduce((a, b) => a + b, 0)
        const obj = {
          kode: arr.filter((x) => x.kode3 === el)[0].kode3,
          uraian: arr.filter((x) => x.kode3 === el)[0].uraian3,
          pagu,
          paguawal,
          selisih: pagu - paguawal,
          rincian: []
        }
        rba.push(obj)
      }

      const unik4 = this.datarba.concat(this.datarbaawal).map((x) => x.kode4)
      const elunik4 = unik4?.length ? [...new Set(unik4)] : []
      for (let i = 0; i < elunik4?.length; i++) {
        const el = elunik4[i];
        const arr = this.datarba.concat(this.datarbaawal)
        const pagu = arr.filter((x) => x.kode4 === el).map((x) => parseFloat(x?.pagu) || 0).reduce((a, b) => a + b, 0)
        const paguawal = arr.filter((x) => x.kode4 === el).map((x) => parseFloat(x?.paguawal) || 0).reduce((a, b) => a + b, 0)
        const obj = {
          kode: arr.filter((x) => x.kode4 === el)[0].kode4,
          uraian: arr.filter((x) => x.kode4 === el)[0].uraian4,
          pagu,
          paguawal,
          selisih: pagu - paguawal,
          rincian: []
        }
        rba.push(obj)
      }
      const unik5 = this.datarba.concat(this.datarbaawal).map((x) => x.kode5)
      const elunik5 = unik5?.length ? [...new Set(unik5)] : []
      for (let i = 0; i < elunik5?.length; i++) {
        const el = elunik5[i];
        const arr = this.datarba.concat(this.datarbaawal)
        const pagu = arr.filter((x) => x.kode5 === el).map((x) => parseFloat(x?.pagu) || 0).reduce((a, b) => a + b, 0)
        const paguawal = arr.filter((x) => x.kode5 === el).map((x) => parseFloat(x?.paguawal) || 0).reduce((a, b) => a + b, 0)
        const obj = {
          kode: arr.filter((x) => x.kode5 === el)[0].kode5,
          uraian: arr.filter((x) => x.kode5 === el)[0].uraian5,
          pagu,
          paguawal,
          selisih: pagu - paguawal,
          rincian: []
        }
        rba.push(obj)
      }

      // const unik6 = [...new Set(this.datarba.concat(this.datarbaawal).map((x) => x.kode))]


      // unik6.forEach((kode) => {
      //   const data = this.datarba.concat(this.datarbaawal).filter((x) => x.kode === kode)

      //   const unikbidang = [...new Set(data.map((x) => `${x.kodebidang}-${x.kodekegiatan}`))]

      //   const rincian = unikbidang.map((bidKegiatan) => {
      //     const [kodebidang, kodekegiatan] = bidKegiatan.split('-')
      //     const bidangkegiatan = data.filter((x) => x.kodebidang === kodebidang && x.kodekegiatan === kodekegiatan)
      //     const totalrinci = bidangkegiatan.reduce((total, item) => total + parseFloat(item?.pagu) || 0, 0);
      //     const totalrinciawal = bidangkegiatan.reduce((total, item) => total + parseFloat(item?.paguawal) || 0, 0);
      //     console.log('Bidang Kegiatan', bidangkegiatan, totalrinci, totalrinciawal)
      //     return {
      //       bidang: bidangkegiatan[0].bidang,
      //       kegiatan: bidangkegiatan[0].kegiatan,
      //       pagu: totalrinci,
      //       paguawal: totalrinciawal,
      //       items: bidangkegiatan.map((item) => ({
      //         // hargaawal: item.hargaawal || 0,
      //         // paguawal: item.paguawal || 0,
      //         // volumeawal: item.volumeawal || 0,
      //         harga: item.harga || item.hargaawal || 0,
      //         item: item.usulan,
      //         pagu: item.pagu || item.paguawal || 0,
      //         satuan: item.satuan,
      //         volume: item.volume || item.volumeawal || 0,
      //       })),
      //     }
      //   })
      //   const totalPagu = data.reduce((total, item) => total + parseFloat(item.pagu) || 0, 0);
      //   const totalPaguawal = data.reduce((total, item) => total + parseFloat(item.paguawal) || 0, 0);
      //   const uraian = data[0].uraian;
      //   rba.push({
      //     kode: kode,
      //     uraian: uraian,
      //     pagu: totalPagu,
      //     paguawal: totalPaguawal,
      //     rincian: rincian,
      //   });
      //   console.log('Hasil RBA', rba)
      // })


      // 1. Gabung data
      const merged = this.datarba.concat(this.datarbaawal)

      // 2. Merge by idpp (biar tidak double & nilai dijumlah)
      const groupedByIdpp = {}

      merged.forEach(item => {
        const key = item.idpp || item.usulan // fallback kalau idpp null

        if (!groupedByIdpp[key]) {
          groupedByIdpp[key] = {
            ...item,
            pagu: parseFloat(item.pagu) || 0,
            paguawal: parseFloat(item.paguawal) || 0,
            harga: parseFloat(item.harga) || 0,
            hargaawal: parseFloat(item.hargaawal) || 0,
            volume: parseFloat(item.volume) || 0,
            volumeawal: parseFloat(item.volumeawal) || 0,
            selisih: (parseFloat(item.pagu) || 0) - (parseFloat(item.paguawal) || 0)
          }
        } else {
          groupedByIdpp[key].pagu += parseFloat(item.pagu) || 0
          groupedByIdpp[key].paguawal += parseFloat(item.paguawal) || 0
          groupedByIdpp[key].harga += parseFloat(item.harga) || 0
          groupedByIdpp[key].hargaawal += parseFloat(item.hargaawal) || 0
          groupedByIdpp[key].volume += parseFloat(item.volume) || 0
          groupedByIdpp[key].volumeawal += parseFloat(item.volumeawal) || 0
          groupedByIdpp[key].selisih = groupedByIdpp[key].pagu - groupedByIdpp[key].paguawal

        }
      })

      // hasil data sudah bersih
      const dataFix = Object.values(groupedByIdpp)

      // 3. Ambil unik kode
      const unik6 = [...new Set(dataFix.map(x => x.kode))]

      unik6.forEach((kode) => {

        const data = dataFix.filter((x) => x.kode === kode)

        // unik bidang + kegiatan
        const unikbidang = [...new Set(data.map((x) => `${x.kodebidang}-${x.kodekegiatan}`))]

        const rincian = unikbidang.map((bidKegiatan) => {

          const [kodebidang, kodekegiatan] = bidKegiatan.split('-')

          const bidangkegiatan = data.filter(
            (x) => x.kodebidang === kodebidang && x.kodekegiatan === kodekegiatan
          )
          const totalrinci = bidangkegiatan.reduce(
            (total, item) => total + (parseFloat(item?.pagu) || 0),
            0
          )

          const totalrinciawal = bidangkegiatan.reduce(
            (total, item) => total + (parseFloat(item?.paguawal) || 0),
            0
          )

          return {
            bidang: bidangkegiatan[0]?.bidang,
            kegiatan: bidangkegiatan[0]?.kegiatan,
            pagu: totalrinci,
            paguawal: totalrinciawal,
            selisih: totalrinci - totalrinciawal,
            items: bidangkegiatan.map((item) => ({
              hargaawal: item.hargaawal || 0,
              harga: item.harga || 0,
              item: item.usulan,
              paguawal: parseFloat(item.paguawal) || 0,
              pagu: (parseFloat(item.pagu) || 0),
              satuan: item.satuan,
              volumeawal: item.volumeawal || 0,
              volume: item.volume || 0,
              selisih: (parseFloat(item.pagu) || 0) - (parseFloat(item.paguawal) || 0)
            })),
          }
        })

        const totalPagu = data.reduce(
          (total, item) => total + (parseFloat(item.pagu) || 0),
          0
        )

        const totalPaguawal = data.reduce(
          (total, item) => total + (parseFloat(item.paguawal) || 0),
          0
        )

        const uraian = data[0]?.uraian

        rba.push({
          kode: kode,
          uraian: uraian,
          pagu: totalPagu,
          paguawal: totalPaguawal,
          selisih: totalPagu - totalPaguawal,
          rincian: rincian,
        })
      })
      console.log('Hasil RBA', rba)

      // const unik6 = this.datarba.map((x) => x.kode)
      // const elunik6 = unik6?.length ? [...new Set(unik6)] : []
      // for (let i = 0; i < elunik6?.length; i++) {
      //   const el = elunik6[i];
      //   const arr = this.datarba

      //   const bidg = arr.filter((x) => x.kode === el)
      //   const unikbidg = bidg.map((x) => x.kodebidang)
      //   const elbidg = unikbidg?.length ? [...new Set(unikbidg)] : []

      //   const obj = {
      //     kode: arr.filter((x) => x.kode === el)[0].kode,
      //     uraian: arr.filter((x) => x.kode === el)[0].uraian,
      //     pagu: arr.filter((x) => x.kode === el).map((x) => parseFloat(x.pagu)).reduce((a, b) => a + b, 0),
      //     rincian: arr.filter((x) => x.kode === el).map((z) => {
      //       return {
      //         bidang: z?.bidang,
      //         kegiatan: z?.kegiatan,
      //         item: z?.usulan,
      //         volume: z?.volume,
      //         satuan: z?.satuan,
      //         harga: z?.harga,
      //         pagu: z?.pagu,
      //       }
      //     })
      //   }
      //   rba.push(obj)
      // }
      const sortRBA = (rba) =>
        rba.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const dataRBA = sortRBA(rba)
      this.items = dataRBA
      console.log('Hasil RBA', hasilRBA)
    }
  }

})
