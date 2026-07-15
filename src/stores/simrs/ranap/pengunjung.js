import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { markRaw } from 'vue'

export const usePengunjungRanapStore = defineStore('pengunjung-ranap', {
  state: () => ({
    pasiens: [],
    meta: null,
    params: {
      page: 1,
      q: '',
      status: 'Belum Pulang',
      from: dateDbFormat(new Date()),
      to: dateDbFormat(new Date()),
      per_page: 100,
      koderuangan: null
    },
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    periode: 'Hari Ini',
    ruangans: [],
    ruangan: null,
    statuses: ['Belum Pulang', 'Pulang'],
    statusx: 'Belum Pulang',
    jeniskasus: [],
    jnsKasusPasien: null,
    loading: false,
    pageLayanan: false,
    loadingLayanan: false,
    pasien: null,
    nakes: null,
    nonNakes: null,

    berhakAkses: true,

    loadingSaveGantiDpjp: false
  }),

  // persist: true,

  actions: {
    setPeriode(val) {
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
    async getData() {
      this.loading = true
      const params = { params: this.params }
      try {
        const resp = await api.get('v1/simrs/ranap/ruangan/kunjunganpasien', params)
        // console.log('kunjungan ranap', resp)
        if (resp.status === 200) {
          // this.meta = resp.data
          // this.pasiens = resp.data.data
          this.meta = resp.data?.data
          this.pasiens = resp.data?.data?.data
          this.meta.total = resp?.data?.total
          this.loading = false
        }
        this.loading = false
        // // console.log(resp)
      }
      catch (error) {
        // console.log(error)
        this.loading = false
      }
    },

    hariIni() {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    bulanIni() {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      // const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
      // const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
      const firstday = curr.setFullYear(y, m, 1)
      const lastday = curr.setFullYear(y, m + 1, 0)
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    mingguIni() {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    tahunIni() {
      const curr = new Date()
      const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
      const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },


    goToPage(val) {
      this.params.page = val
      this.getData()
    },
    refresh() {
      this.params.page = 1
      this.getData()
    },
    bukaLayanan(val, pasien) {
      console.log('--- DEBUG FRONTEND: pengunjung.js bukaLayanan DI-TRIGGER ---')
      this.pageLayanan = val
      this.loadingLayanan = true
      const form = { noreg: pasien?.noreg }

      return new Promise((resolve, reject) => {
        console.time('TIMER: API POST v1/simrs/ranap/ruangan/bukalayanan')
        api.post('v1/simrs/ranap/ruangan/bukalayanan', form)
          .then(resp => {
            console.timeEnd('TIMER: API POST v1/simrs/ranap/ruangan/bukalayanan')
            this.loadingLayanan = false
            
            console.time('TIMER: pengunjung.js setPasien() execution')
            this.setPasien(pasien, resp.data)
            console.timeEnd('TIMER: pengunjung.js setPasien() execution')
            
            const indexPasien = this.pasiens.findIndex(x => x.noreg === pasien.noreg)

            const jnsKasus = this.pasiens[indexPasien]?.kd_jeniskasus

            if (this.jeniskasus?.length && jnsKasus) {
              this.jnsKasusPasien = this.jeniskasus.find(x => x.kode === jnsKasus) ?? null
            }

            resolve(this.pasiens[indexPasien])
          })
          .catch(err => {
            console.timeEnd('TIMER: API POST v1/simrs/ranap/ruangan/bukalayanan')
            this.loadingLayanan = false
            reject(err)
          })
      })
    },

    setPasien(pasien, data) {
      const findPasien = this.pasiens.filter(x => x?.noreg === pasien?.noreg)
      if (findPasien?.length) {
        const datax = findPasien[0]
        // markRaw: mencegah Vue mem-proxy data layanan besar secara rekursif
        // Data ini hanya dibaca (display), tidak perlu deep reactive
        datax.dataigd = data?.dataigd ? markRaw(data.dataigd) : null
        datax.newapotekrajal = markRaw(data?.newapotekrajal ?? [])
        datax.diagnosa = markRaw(data?.diagnosa ?? [])
        datax.anamnesis = markRaw(data?.anamnesis ?? []) // wes
        datax.pemeriksaan = markRaw(data?.pemeriksaan ?? []) // wes
        datax.penilaian = markRaw(data?.penilaian ?? []) // wes
        datax.diagnosamedis = markRaw(data?.diagnosamedis ?? [])
        datax.tindakan = markRaw(data?.tindakan ?? [])
        datax.diagnosakeperawatan = markRaw(data?.diagnosakeperawatan ?? [])
        datax.diagnosakebidanan = markRaw(data?.diagnosakebidanan ?? [])
        datax.diagnosagizi = markRaw(data?.diagnosagizi ?? [])
        datax.cppt = markRaw(data?.cppt ?? [])
        datax.laborats = markRaw(data?.laborats ?? [])
        datax.laboratold = markRaw(data?.laboratold ?? [])
        datax.hasilradiologi = markRaw(data?.hasilradiologi ?? [])
        datax.radiologi = markRaw(data?.radiologi ?? [])
        datax.fisio = markRaw(data?.fisio ?? [])
        datax.operasi = markRaw(data?.operasi ?? [])
        datax.bankdarah = markRaw(data?.bankdarah ?? [])
        datax.apheresis = markRaw(data?.apheresis ?? [])
        datax.cathlab = markRaw(data?.cathlab ?? [])
        datax.penunjanglain = markRaw(data?.penunjanglain ?? [])
        datax.permintaanambulan = markRaw(data?.permintaanambulan ?? [])
        datax.perawatanjenazah = markRaw(data?.perawatanjenazah ?? [])
        datax.hais = markRaw(data?.hais ?? [])
        datax.konsultasi = markRaw(data?.konsultasi ?? [])
        datax.edukasi = markRaw(data?.edukasi ?? [])
        datax.dokumenluar = markRaw(data?.dokumenluar ?? [])
        datax.informconcern = markRaw(data?.informconcern ?? [])
        datax.dischargeplanning = markRaw(data?.dischargeplanning ?? [])
        datax.skriningdischargeplannings = markRaw(data?.skriningdischargeplannings ?? [])
        datax.summarydischargeplannings = markRaw(data?.summarydischargeplannings ?? [])
        datax.statuscovid = markRaw(data?.statuscovid ?? [])
        datax.procedure = markRaw(data?.procedure ?? [])
        datax.keterangantindakan = markRaw(data?.keterangantindakan ?? [])
        datax.planningdokter = data?.planningdokter ?? null
        datax.serah_terima = markRaw(data?.serah_terima ?? [])

        // data sementara
        datax.diagnosaKeperawatanUlangSementara = []
        const memodia = data?.manymemo
        if (memodia?.length) {
          const memNonIgd = memodia?.find(f => f.kdruang !== 'POL014') ?? null
          const memIgd = memodia?.find(f => f.kdruang === 'POL014') ?? null
          datax.memodiagnosa = memNonIgd?.diagnosa ?? null
          datax.memodiagnosaigd = memIgd?.diagnosa ?? null
        } else {
          datax.memodiagnosa = null
          datax.memodiagnosaigd = null
        }
      }
    },
    getRuangan() {
      return new Promise((resolve, reject) => {
        api.get('v1/simrs/ranap/ruangan/listruanganranap')
          .then(resp => {
            // console.log('ruangan ranap', resp)
            if (resp.status === 200) {
              const ruangs = resp.data
              this.ruangans = []
              // this.ruangans.push('SEMUA')

              // this.ruangan = this.ruangans.map(x => x.groups)

              // cari auth perawat
              const auth = useAplikasiStore()
              const user = auth?.user
              const nakes = auth?.user?.pegawai?.kdgroupnakes
              const ruanganPerawat = user?.pegawai?.ruangan?.kdmapping
              const ruanganUser = user?.pegawai?.ruangan?.koderuangan || null
              const kodenakes = ['1', '2', '3', '4', '5']
              const selainSa = ['R00037'] // mpp
              const isSA = user?.username === 'sa'


              const isNakes = kodenakes.includes(nakes)
              const isSelainNakesdanSa = selainSa.includes(ruanganUser)


              if (isSA || isSelainNakesdanSa) {
                // SA atau siapa pun yang punya ruangan MPP (nakes atau bukan nakes)
                this.berhakAkses = true
                this.ruangans = ruangs
              } else if (isNakes) {
                // perawat biasa
                this.berhakAkses = true
                if (nakes === '2' || nakes === '3') {
                  this.ruangans = ruangs?.filter(x => x.groups === ruanganPerawat)
                } else {
                  this.ruangans = ruangs
                }

              } else {
                // tidak memenuhi semua syarat
                this.berhakAkses = false
                this.ruangans = []
              }

              // console.log('ruanganUser', ruanganUser);

              // console.log('auth', kodenakes.filter(x => x?.includes(nakes)), user)
              // if (user?.username !== 'sa') {
              //   // console.log('bukan sa')
              //   if (!(isNakes && isSelainNakesdanSa)) {
              //     // console.log('bukan perawat')
              //     if (isSelainNakesdanSa) {
              //       this.berhakAkses = true
              //       this.ruangans = ruangs
              //     } else {
              //       this.berhakAkses = false
              //       this.ruangans = []
              //     }
              //   }
              //   else {
              //     this.berhakAkses = true
              //     // cari ruangan
              //     if (nakes === '2' || nakes === '3') {
              //       this.ruangans = ruangs?.filter(x => x.groups === ruanganPerawat)
              //       // console.log('ini nakes', this.ruangans)
              //     }
              //     else {
              //       this.ruangans = ruangs
              //     }
              //   }
              // }

              // jika usr = sa
              // else {
              //   this.berhakAkses = true
              //   this.ruangans = ruangs
              // }
              // console.log('akhir', this.ruangans)
              // this.params.koderuangan = this.aksesRuangan()
            }
            resolve(resp)
          }).catch(err => {
            // console.log(err)
            reject(err)
          })
      })
    },

    aksesRuangan() {
      let ruang = null
      if (this.ruangans?.length > 0) {
        if (this.ruangans?.length === 1) {
          ruang = this.ruangans[0]?.groups
        }
        else if (this.ruangans?.length > 1) {
          this.ruangans.unshift('SEMUA')
          ruang = this.ruangans[0]
        }
      }
      else {
        ruang = null
      }

      return ruang
    },

    gantiRuangan() {
      // console.log('gnt ruangan', this.ruangan)
      // if (this.ruangan === 'SEMUA') {
      //   this.params.koderuangan = this.ruangans.map(x => x.groups)
      //   this.getData()
      // }
      // else {
      //   this.params.koderuangan = [this.ruangan ?? '']
      //   this.getData()
      // }
      this.params.page = 1
      this.params.koderuangan = this.ruangan
      this.getData()
    },

    initReset() {
      this.ruangan = this.aksesRuangan()
      this.params.page = 1
      this.params.koderuangan = this.ruangan
      this.params.q = ''
      this.params.status = 'Belum Pulang'
      this.params.to = dateDbFormat(new Date())
      this.params.from = dateDbFormat(new Date())
      this.params.per_page = 100

      this.getData()
    },
    gantiPeriode(val) {
      if (val === 'Hari Ini') {
        this.hariIni()
      }
      else if (val === 'Minggu Ini') {
        this.mingguIni()
      }
      else if (val === 'Bulan Ini') {
        this.bulanIni()
      }
      this.getData()
    },
    hariIni() {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    mingguIni() {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    bulanIni() {
      const curr = new Date()
      const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
      const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },

    tahunIni() {
      const curr = new Date()
      const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
      const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    async getJenisKasus() {
      const resp = await api.get('v1/simrs/ranap/ruangan/listjeniskasus')
      // console.log('jns kasus', resp.data)
      if (resp.status === 200) {
        this.jeniskasus = resp.data
      }
    },
    async gantiJenisKasus(val, pasien) {
      console.log('ganti jns kasus', val, pasien)
      const form = {
        noreg: pasien?.noreg,
        kd_jeniskasus: val?.kode
      }

      const resp = await api.post('v1/simrs/ranap/ruangan/gantijeniskasus', form)
      if (resp.status === 200) {
        const noreg = pasien?.noreg
        const isi = resp.data?.kd_jeniskasus
        this.jnsKasusPasien = val
        this.injectDataPasien(noreg, isi, 'kd_jeniskasus')
        // console.log('result', pasien)
      }
    },

    async gantiDpjp(form, pasien) {
      // console.log('ganti dpjp', form, pasien)
      this.loadingSaveGantiDpjp = true
      try {
        const resp = await api.post('/v1/simrs/ranap/ruangan/gantidpjp', form)
        // console.log(resp)
        if (resp.status === 200) {
          const findPasien = this.pasiens.filter(x => x.noreg === pasien?.noreg)
          if (findPasien?.length) {
            const data = findPasien[0]
            // data.datasimpeg = resp?.data?.result?.datasimpeg
            data.dokter = resp?.data?.result?.datasimpeg?.nama
            data.kodedokter = resp?.data?.result?.datasimpeg?.kdpegsimrs
            data.kddokter = resp?.data?.result?.datasimpeg?.kdpegsimrs
            this.loadingSaveGantiDpjp = false
          }

          this.loadingSaveGantiDpjp = false
        }
        this.loadingSaveGantiDpjp = false
      }
      catch (error) {
        console.log(error)
        this.loadingSaveGantiDpjp = false
      }
    },

    gantiMemo(form, pasien) {
      // console.log(form)
      return new Promise((resolve, reject) => {
        api.post('/v1/simrs/pelayanan/gantimemo', form)
          .then(resp => {
            // console.log(resp)
            if (resp.status === 200) {
              const findPasien = this.pasiens.filter(x => x.noreg === pasien?.noreg)
              if (findPasien?.length) {
                const data = findPasien[0]
                data.memodiagnosa = resp?.data?.result?.diagnosa
              }
            }
            resolve(resp)
          }).catch(err => {
            console.log(err)
          })
      })
    },

    injectDataPasien(noreg, val, kode, arr) {
      const findPasien = this.pasiens.filter(x => x.noreg === noreg)
      // console.log('inject pasien', findPasien)
      if (findPasien?.length) {
        const data = findPasien[0]
        // data[kode] = val
        if (kode === 'kd_jeniskasus' ||
          kode === 'status' || kode === 'carakeluar' || kode === 'prognosis' ||
          kode === 'tindaklanjut' || kode === 'diagakhir' || kode === 'sebabkematian') {
          data[kode] = val
        }
        else {
          const target = data[kode]?.find(x => x.id === val?.id) ?? null
          // console.log('inject target pasien', target, kode, val, data)
          // console.log('inject kode pasien', kode)
          // console.log('inject isi pasien', val)

          if (target) {
            Object.assign(target, val)
          }
          else {
            data[kode]?.splice(0, 0, val)
            // data[kode].push(val)
          }
        }
      }
    },

    injectDataArray(noreg, arr, kode) {
      const findPasien = this.pasiens.filter(x => x?.noreg === noreg)
      // console.log('inject pasien', findPasien)
      if (findPasien?.length) {
        const data = findPasien[0]
        data[kode] = arr
      }
    },

    injectUpdatean(noreg, id, val, kode) {
      const findPasien = this.pasiens.filter(x => x?.noreg === noreg)
      if (findPasien?.length) {
        const data = findPasien[0]
        const target = data[kode]?.find(x => x?.id === id)
        if (target) {
          Object.assign(target, val)
        }
      }
    },
    deleteInjectanNull(noreg, kode) {
      const findPasien = this.pasiens.filter(x => x.noreg === noreg)
      if (findPasien?.length) {
        const data = findPasien[0]
        const target = data[kode]?.find(x => x?.id === null || x?.id === '' || x?.id === undefined || !('id' in x)) ?? null
        if (target) {
          data[kode]?.splice(data[kode]?.findIndex(x => x?.id === null), 1)
        }
      }
    },
    deleteInjectanNull2(noreg, kode) {
      const findPasien = this.pasiens.filter(x => x.noreg === noreg)
      if (findPasien?.length) {
        const data = findPasien[0]
        const target = data[kode]?.find(x => !('id' in x))
        if (target) {
          data[kode]?.splice(target, 1)
        }
      }
    },

    hapusDataInjectan(pasien, id, key) {
      // console.log('hapusDataInjectan', key, id, pasien)

      const findPasien = this.pasiens.filter(x => x?.noreg === pasien?.noreg)
      // console.log('find pasien', findPasien)

      if (findPasien?.length) {
        const data = findPasien[0][key]
        // console.log('data', data)

        const pos = data.findIndex(el => el.id === id)
        if (pos >= 0) { data.splice(pos, 1) }
      }
    },

    async getNakes() {
      const resp = await api.get('/v1/simrs/master/pegawai/listnakes')
      // console.log('nakes', resp)

      if (resp.status === 200) {
        this.nakes = resp.data
      }
    },
    async getNonNakes() {
      const resp = await api.get('/v1/simrs/master/pegawai/listnonnakes')
      // console.log('non nakes', resp)

      if (resp.status === 200) {
        this.nonNakes = resp.data
      }
    }
  }
})

// make sure to pass the right store definition, useAuth in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePengunjungRanapStore, import.meta.hot))
}
