import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { dateDbFormat } from "src/modules/formatter"

export const usePengunjungHomeCareStore = defineStore('pengunjung_home_care_store', {
  state: () => ({
    pasiens: [],
    meta: null,
    pasien: null,
    params: {
      page: 1,
      q: '',
      status: 'Semua',
      from: dateDbFormat(new Date()),
      to: dateDbFormat(new Date()),
      per_page: 100,
    },
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    periode: 'Hari Ini',
    ruangans: [],
    ruangan: null,
    statuses: ['Semua', 'Terlayani', 'Dalam Pelayanan', 'Belum Dilayani'],
    statusx: 'Semua',
    pageLayanan: false,
  }),
  actions: {

    setPerPage (payload) {
      // console.log('sasa', payload)
      this.params.page = 1
      this.params.per_page = payload
      this.getData()
    },
    setPeriode (val) {
      this.periode = val
      if (val === 'Hari ini') {
        this.hariIni()
      }
      else if (val === 'Minggu ini') {
        this.mingguIni()
      }
      else if (val === 'Bulan ini') {
        this.bulanIni()
      }
    },

    hariIni () {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    bulanIni () {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      const firstday = curr.setFullYear(y, m, 1)
      const lastday = curr.setFullYear(y, m + 1, 0)
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    mingguIni () {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },

    async getData () {
      this.loading = true
      console.log('get data')
      const params = { params: this.params }
      try {
        const resp = await api.get('v1/simrs/homecare/pengunjung/list', params)
        if (resp.status === 200) {
          this.meta = resp.data?.meta
          this.pasiens = resp.data?.data
          this.loading = false
        }
        console.log('ada ')
      } catch (error) {
        console.log('error', error)
        this.loading = false
      } finally {
        this.loading = false
      }
    },

    goToPage (val) {
      this.params.page = val
      this.getData()
    },
    refresh () {
      this.params.page = 1
      this.getData()
    },
    bukaLayanan (val, pasien) {
      this.pageLayanan = val
      this.loadingLayanan = true
      const form = { noreg: pasien?.noreg }
      // console.log('pasien', pasien)


      // this.persiapanInjectPasien(pasien)

      return new Promise((resolve, reject) => {
        api.post('v1/simrs/homecare/pengunjung/bukalayanan', form)
          .then(resp => {
            // console.log('ranap', resp)
            this.loadingLayanan = false
            // if (resp.status === 200) {
            this.setPasien(pasien, resp.data)
            const indexPasien = this.pasiens.findIndex(x => x.noreg === pasien.noreg)
            resolve(this.pasiens[indexPasien])
          })
          .catch(err => {
            // console.log('error buka layanan', err)
            this.loadingLayanan = false
            reject(err)
          })
      })
    },
    setPasien (pasien, data) {
      const findPasien = this.pasiens.find(x => x?.noreg === pasien?.noreg)
      // this.pasiens[indexPasien] = data
      // // console.log('wew', this.pasiens[indexPasien])
      if (findPasien) {
        const datax = findPasien
        datax.newapotekrajal = data?.newapotekrajal ?? []
        datax.laborats = data?.laborats ?? []
        datax.laboratold = data?.laboratold ?? []
        datax.fisio = data?.fisio ?? []
        datax.anamnesis = data?.anamnesis ?? []
        // datax.dataigd = data?.dataigd ?? null
        // datax.diagnosa = data?.diagnosa ?? []
        // datax.pemeriksaan = data?.pemeriksaan ?? []
        // datax.penilaian = data?.penilaian ?? []
        // datax.diagnosamedis = data?.diagnosamedis ?? []
        // datax.tindakan = data?.tindakan ?? []
        // datax.diagnosakeperawatan = data?.diagnosakeperawatan ?? []
        // datax.diagnosakebidanan = data?.diagnosakebidanan ?? []
        // datax.diagnosagizi = data?.diagnosagizi ?? []
        // datax.cppt = data?.cppt ?? []
        // datax.hasilradiologi = data?.hasilradiologi ?? []
        // datax.radiologi = data?.radiologi ?? []
        // datax.operasi = data?.operasi ?? []
        // datax.operasi_ird = data?.operasi_ird ?? []
        // datax.bankdarah = data?.bankdarah ?? []
        // datax.apheresis = data?.apheresis ?? []
        // datax.cathlab = data?.cathlab ?? []
        // datax.penunjanglain = data?.penunjanglain ?? []
        // datax.permintaanambulan = data?.permintaanambulan ?? []
        // datax.oksigen = data?.oksigen ?? []
        // datax.perawatanjenazah = data?.perawatanjenazah ?? []
        // datax.hais = data?.hais ?? []
        // datax.konsultasi = data?.konsultasi ?? []
        // datax.edukasi = data?.edukasi ?? []
        // datax.dokumenluar = data?.dokumenluar ?? []
        // datax.informconcern = data?.informconcern ?? []
        // datax.dischargeplanning = data?.dischargeplanning ?? []
        // datax.skriningdischargeplannings = data?.skriningdischargeplannings ?? []
        // datax.summarydischargeplannings = data?.summarydischargeplannings ?? []
        // datax.statuscovid = data?.statuscovid ?? []
        // datax.procedure = data?.procedure ?? []
        // datax.keterangantindakan = data?.keterangantindakan ?? []
        // datax.planningdokter = data?.planningdokter ?? null
        // datax.serah_terima = data?.serah_terima ?? []

        // data sementara
        // datax.diagnosaKeperawatanUlangSementara = []
        // const memodia = data?.manymemo
        // if (memodia?.length) {
        //   const memNonIgd = memodia.find(f => f.kdruang !== 'POL014')
        //   const memIgd = memodia.find(f => f.kdruang == 'POL014')
        //   if (memNonIgd) datax.memodiagnosa = memNonIgd?.diagnosa
        //   else datax.memodiagnosa = memodia[0].diagnosa
        //   if (memIgd) datax.memodiagnosaigd = memIgd?.diagnosa
        // }
        // console.log('memo', memodia)

      }
    },

    injectDataPasien (pasien, val, kode, arr) {
      // console.log('a', pasien)
      // console.log('b', val.id)
      // console.log('kode', kode)
      const findPasien = this.items.filter(x => x === pasien)
      // console.log('findPasien', findPasien)
      if (findPasien?.length) {
        const data = findPasien[0]
        // console.log('data', data[kode])
        const target = data[kode]?.find(x => x.id === val.id)
        // console.log('itarget', target)
        // console.log('inject kode pasien', kode)
        // console.log('inject isi pasien', val)

        if (target) {
          Object.assign(target, val)
        }
        else {
          if (kode === 'diagnosa') {
            data[kode]?.push(val)
          }
          else if (kode === 'dokumenluar') {
            const trg = data[kode]

            if (trg) {
              data[kode] = []
              data[kode] = val
            }
          }
          else {
            data[kode]?.splice(0, 0, val)
          }
        }
      }
    },
    setLayananSelesai (val) {
      console.log('selesai layanan', val)

    },

    hapusDataAnamnesis (pasien, id) {
      const findPasien = this.items.filter(x => x === pasien)
      if (findPasien?.length) {
        const data = findPasien[0].anamnesis
        const pos = data.findIndex(el => el.id === id)
        if (pos >= 0) { data.splice(pos, 1) }
      }
    },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePengunjungHomeCareStore, import.meta.hot))
}
