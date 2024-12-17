import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useKasirRajalListKunjunganStore } from '../../kasir/rajal/kunjungan'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { Dialog, date } from 'quasar'
import { dateFullFormat } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const usePermintaanEResepStore = defineStore('permintaan_e_resep', {
  state: () => ({
    loading: false,
    loadingSigna: false,
    loadingSaveSigna: false,
    loadingObat: false,
    loadingkirim: false,
    loadingHapus: false,
    obatId: null,
    namaRacikan: false,
    form: {
      keterangan: '-',
      jumlah_diminta: 1,
      tiperesep: ''
    },
    listPemintaanSementara: [],
    signas: [],
    fromSigna: { signa: '', jumlah: 1 },
    depos: [
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101', jenis: 't' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102', jenis: 'rnp' },
      { nama: 'Depo OK', value: 'Gd-04010103', jenis: 'ok' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101', jenis: 'rjl' },
      { nama: 'Depo IGD', value: 'Gd-02010104', jenis: 'igd' }
    ],
    nonFilteredObat: [],
    dpPar: '',
    Obats: [],
    filtObats: [],
    namaObat: null,
    pasien: null,
    indexRacikan: -1,
    depo: '',
    tipeReseps: [
      { label: 'Normal', value: 'normal' },
      { label: 'PRB', value: 'prb' },
      { label: 'Iter', value: 'iter' }
    ],
    noresep: '',
    noreseps: [],
    // section racikan ---
    racikanOpen: false,
    racikanTambah: false,
    racikan: {
      jenisresep: 'Racikan',
      namaracikan: '-',
      keteranganx: '-',
      jumlah: 1,
      tiperacikan: 'non-DTD',
      dosisobat: 1,
      dosismaksimum: 1 // dosis resep
    },
    tipeRacikan: [
      { label: 'DTD', value: 'DTD', disable: false },
      { label: 'non-DTD', value: 'non-DTD', disable: false }
    ],
    tipeRacikanT: [
      { label: 'DTD', value: 'DTD', disable: true },
      { label: 'non-DTD', value: 'non-DTD', disable: true }
    ],
    satuanRaciks: ['Bungkus', 'Kapsul', 'Pot'],
    counterRacikan: 1,
    listRacikan: [],
    listRincianRacikan: [],
    resepPasien: [],
    historys: [],
    statusCopied: [],
    statusCopiedRacik: [],
    checkKdObat: [],
    messageCopied: [],
    pemberianObatCek: [],
    konsumsiObatCek: false,
    permintaanResepDuplicate: [],
    noresepDuplicate: '',
    checkObat: [],
    permintaanDuplicate: false,
    noresepAsal: null,
    permintaanResep: [],
    permintaanresep: [],
    permintaanresepracikan: [],
    // section racikan end---
    batases: [
      { depo: 'Gd-05010101', batas: 5 }, // rajal
      { depo: 'Gd-04010102', batas: 7 } // ranap
    ],
    bypass: false
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    setRacikan (key, val) {
      this.racikan[key] = val
    },
    setPasien () {
      const val = this?.pasien
      const temp = val?.diagnosa?.map(x => x?.rs3 + ' - ' + x?.masterdiagnosa?.rs4)
      const diag = temp?.length ? temp.join(', ') : '-'
      this.setForm('noreg', val?.noreg)
      this.setForm('norm', val?.norm)
      this.setForm('groupsistembayar', val?.groups)
      this.setForm('sistembayar', val?.kodesistembayar ?? val?.kdsistembayar)
      this.setForm('dokter', val?.kodedokter)
      this.setForm('diagnosa', diag ?? '-')
      // this.cariSimulasi(val?.noreg)
      // if (this?.depo === 'rjl') this.getBillRajal(val)
      // if (this?.depo === 'rnp') this.getBillRanap(val)
      // if (this?.depo === 'igd') this.getBillIgd(val)
    },
    resetForm () {
      this.namaObat = null
      const tagihanrs = this.form?.tagihanrs ?? 0
      const iterExpired = this.form?.iter_expired ?? ''
      const iterJml = this.form?.iter_jml ?? ''
      const kodeincbg = this.form?.kodeincbg ?? '-'
      const uraianinacbg = this.form?.uraianinacbg ?? '-'
      const tarifina = this.form?.tarifina ?? 0
      const tiperesep = this.form?.tiperesep ?? ''
      const jenisresep = this.form?.jenisresep ?? '-'
      const kdruangan = this.form?.kdruangan ?? '-'

      const aturan = this.form?.aturan ?? '-'
      const konsumsi = this.form?.konsumsi ?? '-'
      const namaracikan = this.form?.namaracikan ?? '-'
      const jumlahdibutuhkan = this.form?.jumlahdibutuhkan ?? '-'
      const tiperacikan = this.form?.tiperacikan ?? 'DTD'
      const keterangan = this.form?.keterangan ?? '-'
      const satuanRacik = this.form?.satuan_racik ?? '-'
      // console.log('jenis resep', jenisresep)
      this.form = {
        keterangan: '-',
        jumlah_diminta: 1,
        tiperesep,
        tagihanrs,
        kodeincbg,
        uraianinacbg,
        tarifina,
        jenisresep,
        kdruangan
      }
      this.setForm('iter_expired', iterExpired)
      this.setForm('iter_jml', iterJml)
      if (jenisresep === 'Racikan') {
        this.setForm('aturan', aturan)
        this.setForm('konsumsi', konsumsi)
        this.setForm('namaracikan', namaracikan)
        this.setForm('jumlahdibutuhkan', jumlahdibutuhkan)
        this.setForm('tiperacikan', tiperacikan)
        this.setForm('keterangan', keterangan)
        this.setForm('satuan_racik', satuanRacik)
        this.setForm('keteranganx', '-')
        if (tiperacikan === 'DTD') {
          this.setForm('jumlah', 1)
          this.setForm('dosisobat', 1)
          this.setForm('dosismaksimum', 1)
        }
        else {
          this.setForm('jumlah', 1)
        }
      }
      this.setPasien()
    },
    resetObat () {
      const tagihanrs = this.form?.tagihanrs ?? 0
      const kodeincbg = this.form?.kodeincbg ?? '-'
      const uraianinacbg = this.form?.uraianinacbg ?? '-'
      const tarifina = this.form?.tarifina ?? 0
      const tiperesep = this.form?.tiperesep ?? 'normal'
      this.form = {
        keterangan: '-',
        jumlah_diminta: 1,
        tiperesep,
        tagihanrs,
        kodeincbg,
        uraianinacbg,
        tarifina
      }

      this.setPasien()
    },
    resetRacikan () {
      const jen = this.racikan?.tiperacikan ?? '-'
      const nam = this.racikan?.namaracikan ?? '-'
      this.racikan = {
        jenisresep: 'Racikan',
        namaracikan: nam,
        keteranganx: '-',
        jumlah: 1,
        tiperacikan: jen,
        dosisobat: 1,
        dosismaksimum: 1 // dosis resep
      }
    },
    hapusList (obat) {
      const resep = this?.pasien?.newapotekrajal?.find(val => val.noresep === obat?.noresep)
      if (obat?.namaracikan) {
        // const racikan = this?.listRacikan?.filter(a => a.namaracikan === obat?.namaracikan)
        const racikan = this?.listRacikan?.find(a => a.namaracikan === obat?.namaracikan)
        // console.log('rac', racikan)
        // if (racikan?.length) {
        if (racikan) {
          // if (racikan[0]?.rincian?.length > 1) {
          //   const index = racikan[0]?.rincian?.findIndex(x => x.id === obat?.id)
          //   if (index >= 0)racikan[0]?.rincian?.splice(index, 1)
          if (racikan?.rincian?.length > 1) {
            const index = racikan?.rincian?.findIndex(x => x.id === obat?.id)
            if (index >= 0)racikan?.rincian?.splice(index, 1)
          }
          else {
            const index = this?.listRacikan?.findIndex(x => x.namaracikan === obat?.namaracikan)
            if (index >= 0) this?.listRacikan?.splice(index, 1)
          }
        }

        const indexLis = this?.listRincianRacikan?.findIndex(x => x.id === obat?.id)
        if (indexLis >= 0) this?.listRincianRacikan?.splice(indexLis, 1)
        console.log('indexLis', indexLis)

        const index = resep?.permintaanracikan?.findIndex(x => x.id === obat?.id)
        if (index >= 0) resep?.permintaanracikan?.splice(index, 1)
        // console.log('new', index)
      }
      else {
        const index = this?.listPemintaanSementara?.findIndex(x => x.id === obat?.id)
        if (index >= 0) this?.listPemintaanSementara?.splice(index, 1)
        const indexp = resep?.permintaanresep?.findIndex(x => x.id === obat?.id)
        if (indexp >= 0) resep?.permintaanresep?.splice(indexp, 1)
        // console.log('new', indexp)
      }
      if (resep?.permintaanracikan.length <= 0 && resep?.permintaanresep.length <= 0) {
        this.noresep = 'BARU'
        const indexres = this?.noreseps?.findIndex(a => a === obat?.noresep)
        if (indexres >= 0) this?.noreseps?.splice(indexres, 1)
      }
      console.log('pasien hapus obat', resep)
    },
    setList (key) {
      key.harga = (parseFloat(key?.jumlah) * parseFloat(key?.hargajual)) + parseFloat(key?.r)
      this.listPemintaanSementara.push(key)
    },
    setListArray (array) {
      array.forEach(arr => {
        this.setList(arr)
      })
    },
    setListRacikan (key) {
      // console.log('set list racikan', key)
      key.harga = (parseFloat(key?.jumlah) * parseFloat(key?.harga_jual)) + parseFloat(key?.r)
      // const adaRin = this.listRincianRacikan?.find(ri => ri.id === key.id && ri.namaracikan === this.form.namaracikan)
      // if (adaRin) this.listRincianRacikan?.push(key)
      // console.log('adaRin', adaRin)

      // const pasResRac = this.pasien.newapotekrajal.find(a => a.noresep === key.noresep)
      // const adaRacRin = this.pasResRac?.permintaanracikan?.find(ri => ri.id === key.id)
      // if (!adaRacRin) pasResRac.permintaanracikan?.push(key)

      const namaracikan = key?.namaracikan
      const adaList = this.listRacikan.find(list => list.namaracikan === namaracikan)
      if (adaList) {
        const adaLiRin = adaList.rincian.find(ri => ri.id === key.id)
        if (!adaLiRin) adaList.rincian.push(key)

        const harga = adaList.rincian.map(a => a?.harga).reduce((a, b) => a + b, 0) ?? 0
        adaList.harga = harga
      }
      else {
        const temp = {
          namaracikan: key?.namaracikan,
          harga: key?.harga,
          aturan: key?.aturan,
          keterangan: key?.keterangan,
          tiperacikan: key?.tiperacikan,
          konsumsi: key?.konsumsi,
          satuan_racik: key?.satuan_racik,
          jumlahracikan: key?.jumlahdibutuhkan,
          rincian: [key]
        }
        const adaLi = this.listRacikan.find(ri => ri.id === key.id)
        if (!adaLi) this.listRacikan.push(temp)
      }

      // console.log('list racikan', this.listRacikan)
      // console.log('list rincian racikan', this.listRincianRacikan)
      const rac = this.listRacikan.find(x => x.namaracikan === this.form.namaracikan)
      this.listRincianRacikan = rac?.rincian ?? []
      // this.tipeRacikan = [
      //   { label: 'DTD', value: 'DTD', disable: true },
      //   { label: 'non-DTD', value: 'non-DTD', disable: true }
      // ]
    },
    setListRacikanArray (array) {
      array.forEach(arr => {
        this.setListRacikan(arr)
      })
    },
    setNoreseps (reseps) {
      this.noreseps = []
      reseps?.forEach(resep => {
        this.noreseps.unshift(resep?.noresep)
      })
      this.noreseps.unshift('BARU')
    },
    setResep (val) {
      this.setForm('noresep', '')
      this.listRacikan = []
      this.listPemintaanSementara = []

      if (val === '' || val === 'BARU') {
        this.indexRacikan = -1
        return
      }
      const reseps = this.pasien?.newapotekrajal

      const resep = reseps.find(x => x.noresep === val)
      this.setForm('iter_expired', resep?.iter_expired ?? '')
      this.setForm('iter_jml', resep?.iter_jml ?? '')
      this.indexRacikan = reseps.findIndex(x => x.noresep === val)
      if (resep?.flag === '') {
        this.setForm('tiperesep', resep?.tiperesep ?? 'normal')
        this.setForm('noresep', val)
        if (resep?.permintaanresep?.length) this.setListArray(resep?.permintaanresep)
        if (resep?.permintaanracikan?.length) this.setListRacikanArray(resep?.permintaanracikan)
      }
      else {
        if (resep?.flag !== '') this.setListResep(resep)
      }
      console.log('set resep', val, resep, this.form)
    },
    setListResep (resep) {
      resep.listRacikan = []
      if (resep?.permintaanracikan?.length) {
        const rac = resep?.permintaanracikan
        rac.forEach(arr => {
          arr.harga = (parseFloat(arr?.jumlah) * parseFloat(arr?.harga_jual)) + parseFloat(arr?.r)
          const namaracikan = arr?.namaracikan
          const adaList = resep?.listRacikan?.filter(list => list.namaracikan === namaracikan)
          if (adaList?.length) {
            adaList[0].rincian.push(arr)
            const harga = adaList[0].rincian.map(a => a?.harga).reduce((a, b) => a + b, 0) ?? 0
            adaList[0].harga = harga
          }
          else {
            const temp = {
              namaracikan: arr?.namaracikan,
              harga: arr?.harga,
              aturan: arr?.aturan,
              keterangan: arr?.keterangan,
              tiperacikan: arr?.tiperacikan,
              konsumsi: arr?.konsumsi,
              jumlahracikan: arr?.jumlahdibutuhkan,
              rincian: [arr]
            }
            resep.listRacikan.push(temp)
          }
        })
      }
      if (resep?.permintaanresep?.length) {
        resep?.permintaanresep.forEach(arr => {
          arr.harga = (parseFloat(arr?.jumlah) * parseFloat(arr?.hargajual)) + parseFloat(arr?.r)
        })
      }
    },
    cariObat (val) {
      const depo = this.depos.filter(pa => pa.jenis === this.depo)
      // console.log('depo', this?.depo, depo)
      if (depo.length) {
        this.dpPar = depo[0]?.value
      }
      else return notifErrVue('depo tujuan tidak ditemukan')
      const param = {
        groups: this?.pasien?.groups,
        kdruang: this.dpPar,
        q: val,
        tiperesep: this.form.tiperesep
      }
      this.loadingObat = true
      const params = { params: param }
      return new Promise(resolve => {
        api.get('v1/simrs/farmasinew/depo/lihatstokobateresepBydokter', params)
          .then(resp => {
            this.loadingObat = false
            this.nonFilteredObat = resp.data?.dataobat
            this.Obats = val?.length ? this.nonFilteredObat.filter(nfil => nfil?.namaobat.toLowerCase().includes(val?.toLowerCase())) : this.nonFilteredObat
            // console.log('hasil', this.nonFilteredObat, this.Obats)

            resolve(resp)
          })
          .catch(() => {
            this.loadingObat = false
            this.Obats = []
          })
      })
      // }
    },
    async getSigna (val, update, abort) {
      const params = {
        params: {
          q: val ?? ''
        }
      }
      const resp = await api.get('v1/simrs/master/signa/get-signa-autocomplete', params)
      if (update !== undefined) {
        update(() => {
          this.signas = resp.data ?? []
        })
      }
      else {
        this.signas = resp.data
      }

      // .then(resp => {
      //   // this.loadingSigna = false
      //   // console.log('signa', resp?.data)
      //   this.signas = resp?.data
      // })
      // .catch(() => { this.loadingSigna = false })
    },
    seveSigna () {
      this.loadingSaveSigna = true
      return new Promise(resolve => {
        api.post('v1/simrs/master/signa/store-signa', this.fromSigna)
          .then(resp => {
            this.loadingSaveSigna = false
            console.log('resp save signa', resp)
            notifSuccess(resp)
            this.fromSigna = { signa: '', jumlah: 1 }
            this.signas.push(resp?.data?.data)
            resolve(resp.data)
          })
          .catch(() => {
            this.loadingSaveSigna = false
          })
      })
    },
    getBillRajal (val) {
      this.setForm('kdruangan', val?.kodepoli)
      const kunjRajal = useKasirRajalListKunjunganStore()
      const param = { noreg: val?.noreg }
      kunjRajal.getBill(param).then(resp => {
        this.setForm('tagihanrs', resp?.data?.totalall)
        // console.log('bill', resp?.data)
        // console.log('form', this.form)
      })
    },
    getBillRanap (val) {
      this.setForm('kdruangan', val?.kdruangan)
      // if (!!this.form?.dokter && !this.dokters?.length) this.cariDokter(this.form?.dokter)
    },
    getBillIgd (val) {
      this.setForm('kdruangan', val?.kodepoli)
      // if (!!this.form?.dokter && !this.dokters?.length) this.cariDokter(this.form?.dokter)
    },
    getBillOk (val) {
      this.setForm('kdruangan', val?.kdruangan)
      // if (!!this.form?.dokter && !this.dokters?.length) this.cariDokter(this.form?.dokter)
    },
    cariSimulasi (val) {
      this.setForm('kodeincbg', '-')
      this.setForm('uraianinacbg', '-')
      this.setForm('tarifina', 0)
      // this.loadingSimulasi = true
      // const param = {
      //   params: { noreg: val }
      // }
      // return new Promise(resolve => {
      //   api.get('v1/simrs/pelayanan/carisimulasi', param)
      //     .then(resp => {
      //       this.loadingSimulasi = false
      //       console.log('cri simulasi', resp)
      //       const tarif = resp?.data?.response?.cbg?.base_tariff ?? (resp?.data?.response?.cbg?.tariff ?? 0)
      //       this.setForm('kodeincbg', resp?.data?.response?.cbg?.code ?? '-')
      //       this.setForm('uraianinacbg', resp?.data?.response?.cbg?.description ?? '-')
      //       this.setForm('tarifina', tarif ?? '-')

      //       resolve(resp)
      //     })
      //     .catch(() => {
      //       this.loadingSimulasi = false
      //     })
      // })
    },
    async getNomor () {
      const param = {
        params: {
          noresep: this.form?.noresep
        }
      }
      await api.get('v1/simrs/farmasinew/depo/conterracikan', param)
        .then(resp => {
          // console.log(resp?.data)
          this.setForm('namaracikan', resp?.data)
        })
    },
    simpanObat (payload) {
      // const form = payload
      this.bypass = false
      console.log('payload', this.form)
      const resep = this?.pasien?.newapotekrajal?.find(val => val.noresep === this.form?.noresep)
      if (resep) {
        if (resep?.flag !== '') this.form.noresep = ''
      }
      console.log('obat', this?.pasien?.newapotekrajal)
      console.log('resep', resep)
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/pembuatanresep', this.form)
          .then(resp => {
            this.loading = false
            console.log('simpan ', resp?.data)
            if (resp.status === 202) {
              this.openDialog(resp?.data)
            }
            else {
              notifSuccess(resp)

              if (!this.form.noresep || this.form.noresep === '' || this.noresep !== resp?.data?.nota) {
                this.noreseps.push(resp?.data?.nota)
                this.noresep = resp?.data?.nota
              }
              this.pasien.newapotekrajal = resp?.data?.newapotekrajal
              this.indexRacikan = this.pasien.newapotekrajal.findIndex(x => x.noresep === resp?.data?.nota)

              console.log('NORESEP2', this.noresep)
              this.setResep(this.noresep)

              this.resetForm()
              this.setForm('noresep', resp?.data?.nota)

              this.setForm('lanjuTr', '')
              resolve(resp)
            }
            this.cariObat()
          })
          .catch((err) => {
            this.loading = false
            console.log('error', err?.response?.data)
            this.bypass = err?.response?.data?.bypass === 1
          })
      })
    },
    async selesaiResep () {
      console.log('selesai', this.form)
      this.loadingkirim = true
      if (!this.form.noresep || this.form.noresep === '') {
        this.loadingkirim = false
        if (this.noresep) this.setForm('noresep', this.noresep)
        else return notifErrVue('nomor resep tidak terekam, silahkan pilih nomor resep yang akan dikirim')
      }
      await api.post('v1/simrs/farmasinew/depo/kirimresep', this.form)
        .then(resp => {
          console.log('selesai', resp?.data)
          // this.setForm('namaracikan', resp?.data)
          this.loadingkirim = false
          notifSuccess(resp)

          this.setListResep(resp?.data?.data)
          const res = resp?.data?.data
          const reseps = this.pasien?.newapotekrajal
          const index = reseps.findIndex(x => x.noresep === res?.noresep)
          if (index >= 0) {
            this.pasien.newapotekrajal[index] = res
            this.indexRacikan = index
          }
          this.listPemintaanSementara = []
          this.listRacikan = []
        })
        .catch((err) => {
          if (err?.response?.data?.message?.includes('simrs/events?auth_key=simrs_key_harry141312&auth_') || err?.response?.data?.message?.includes('https://apijkn.bpjs-kesehatan.go.id')) {
            const reseps = this.pasien?.newapotekrajal
            const index = reseps.findIndex(x => x.noresep === this.form.noresep)
            if (index >= 0) {
              this.pasien.newapotekrajal[index] = []
              this.indexRacikan = index
            }
            this.listPemintaanSementara = []
            this.listRacikan = []
          }
          this.form.noresep = ''
          this.loadingkirim = false
          console.log(err?.response?.data)
          // console.log(err?.response?.data?.sudahAda)
          if (err?.response?.data?.sudahAda?.length) {
            const sudahAda = err?.response?.data?.sudahAda
            this.listPemintaanSementara?.forEach(mi => {
              mi.sudahAda = false
              const ada = sudahAda.find(su => su.kdobat === mi.kdobat)
              if (ada) mi.sudahAda = true
            })
            this.listRacikan?.forEach(li => {
              li?.rincian?.forEach(mi => {
                mi.sudahAda = false
                const ada = sudahAda.find(su => su.kdobat === mi.kdobat)
                if (ada) mi.sudahAda = true
              })
            })
          }
        })
    },
    async hapusObat (val) {
      // console.log('hapusObat', val)
      this.loadingHapus = true
      this.obatId = val?.id
      this.namaRacikan = val?.namaracikan ?? false
      await api.post('v1/simrs/farmasinew/depo/hapus-permintaan-obat', val)
        .then(resp => {
          console.log('resp hapus', resp?.data)
          // hapus list
          this.hapusList(resp?.data?.obat)
          this.pasien.newapotekrajal = resp?.data?.newapotekrajal
          this.indexRacikan = this.pasien.newapotekrajal.findIndex(x => x.noresep === resp?.data?.obat?.noresep)

          if (this.indexRacikan === -1) this.setForm('noresep', '')

          this.loadingHapus = false
          this.obatId = null
          this.cariObat()
          notifSuccess(resp)
        })
        .catch(() => {
          this.loadingHapus = false
          this.obatId = null
        })
    },
    async getHistory (norm) {
      console.log(norm)
      this.loadingHistory = true
      const params = { params: { norm } }
      try {
        const resp = await api.get('v1/simrs/pelayanan/listresepbynorm', params)
        console.log('history', resp)
        if (resp.status === 200) {
          if (resp.data?.length) {
            const arr = resp.data
            console.log('hisr', arr)

            arr.forEach(hi => {
              const batas = this.batases.find(b => b.depo === hi.depo)
              hi?.permintaanresep?.forEach(ri => {
                if (ri?.mobat?.jenis_perbekalan.toLowerCase() === 'obat') {
                  ri.checked = false
                  ri.batas = batas?.batas ?? 0
                }
              })
            })

            this.historyMeta = null
            this.historys = arr
            this.statusCopiedRacik = []
            this.statusCopied = []
            this.pemberianObatCek = []
          }
          else {
            this.statusCopiedRacik = []
            this.statusCopied = []
            this.pemberianObatCek = []
            this.historys = []
          }
        }
        this.loadingHistory = false
      }
      catch (error) {
        this.loadingHistory = false
        // notifErr(error)
      }
    },
    openDialog (val) {
      console.log('DIALOG', val)
      Dialog.create({
        title: 'Konfirmasi',
        message: `Obat yang diberikan tgl ${dateFullFormat(val?.cek?.hasil[0]?.tgl)} yang direncakan untuk konsumsi selama ${val?.cek?.total} hari, baru dikonsumsi ${val?.cek?.selisih} hari. Apakah Akan tetal dilanjutkan?`,
        ok: {
          push: true,
          label: 'Lanjutkan',
          'no-caps': true,
          color: 'primary'
        },
        cancel: {
          push: true,
          label: 'Batal',
          'no-caps': true,
          color: 'dark'
        }
      })
        .onOk(() => {
          this.setForm('lanjuTr', '1')
          this.simpanObat()
        })
    },

    // BARU PUTRA DEV
    cekObat (val, obat, indexlist, tipe) {
      this.loadingObat = true
      let kdobatArray = ''
      let batas = 0

      console.log('TIPE', tipe)
      if (tipe === 'nonRacik') {
        const panjang = val?.permintaanresep.filter(fi => fi.checked)

        val?.permintaanresep.forEach((pa, indexs) => {
          if (pa?.mobat?.jenis_perbekalan.toLowerCase() === 'obat') {
            if (val?.permintaanresep?.length > 5) {
              batas = pa.batas
            }
          }
        })

        if (panjang.length <= 0 && batas > 0) {
          this.loading = false
          return notifErrVue('silahkan pilih obat yang diperlukan maksimal ' + batas + ' Obat!!!')
        }
      }

      if (obat.length) {
        kdobatArray = obat.map(item => item?.kdobat)
      }

      const depo = this.depos.filter(pa => pa.value === val?.depo)

      if (depo[0]?.value === 'Gd-05010101') {
        if (this.form?.tiperesep !== 'normal') {
          this.loading = false
          return notifErrVue('Maaf tidak bisa duplicate resep selain tipe resep normal!!!')
        }
      }

      // if (depo[0]?.value !== 'Gd-02010104') {
      if (this.pasien.groups !== val?.sistembayar?.groups) {
        this.loading = false
        return notifErrVue('Maaf sistem bayar pasien, tidak sama dengan sistem bayar resep yang diduplicate!!!')
      }

      if (this.form.groupsistembayarlain !== val?.sistembayar?.groups) {
        this.loading = false
        return notifErrVue('Maaf sistem bayar yang dipilih, tidak sama dengan sistem bayar resep yang diduplicate!!!')
      }
      // }

      if (depo.length) {
        this.dpPar = depo[0]?.value
      }
      else return notifErrVue('depo tujuan tidak ditemukan')
      const param = {
        groups: this?.pasien?.groups,
        kdruang: this.dpPar,
        q: kdobatArray,
        tiperesep: this.form.tiperesep
      }

      const params = { params: param }
      return new Promise(resolve => {
        api.get('v1/simrs/pelayanan/lihatstokobateresepBydokter', params)
          .then(resp => {
            this.loadingObat = false
            this.nonFilteredObat = resp.data?.dataobat
            this.Obats = val?.length ? this.nonFilteredObat.filter(nfil => nfil?.namaobat.toLowerCase().includes(val?.toLowerCase())) : this.nonFilteredObat
            // console.log('hasil', this.nonFilteredObat, this.Obats)

            this.simpanCopyResep(val, resp.data?.dataobat, indexlist, tipe)
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
            this.loadingObat = false
            this.Obats = []
          })
      })
    // }
    },
    simpanCopyResep (val, obat, indexlist, tipe) {
      this.permintaanresep = val?.permintaanresep
      this.permintaanresepracikan = val?.permintaanracikan
      const resep = []
      const panjang = val?.permintaanresep.filter(fi => fi.checked)
      let batas = 0
      const indexss = []

      val?.permintaanresep.forEach((pa, indexs) => {
        if (pa?.mobat?.jenis_perbekalan.toLowerCase() === 'obat') {
          if (val?.permintaanresep?.length > 5) {
            batas = pa.batas
            if (pa.checked && panjang.length <= pa.batas) {
              indexss.push(indexs)
              resep.push(pa)
            }
          }
          else {
            indexss.push(indexs)
            resep.push(pa)
          }
        }
        else {
          indexss.push(indexs)
          resep.push(pa)
        }
      })

      if (panjang.length > batas) {
        this.loading = false
        return notifErrVue('Maaf duplicate resep maksimal ' + batas + ' Obat, silahkan pilih obat yang diperlukan maksimal ' + batas + ' Obat!!!')
      }

      const racik = val?.permintaanracikan
      const rinracik = val?.rincianracik
      const kirimResep = []
      const depo = this.depos.filter(pa => pa.value === val?.depo)
      if (tipe === 'nonRacik') {
        if (resep.length) {
          resep.forEach(res => {
            const obats = obat.find(ob => ob?.kdobat === res?.kdobat)
            const temp = {

              // data pasien
              noreg: this.form.noreg,
              norm: this.form.norm,
              groupsistembayar: this.form.groupsistembayar,
              sistembayar: this.form.sistembayar,
              dokter: this.form.dokter,
              diagnosa: this.form.diagnosa,
              noresep: this.form.noresep ?? null,
              tiperesep: this.form.tiperesep,
              kodeincbg: this.form.kodeincbg,
              uraianinacbg: this.form.uraianinacbg,
              tarifina: this.form.tarifina,
              kdruangan: this.form.kdruangan,
              tagihanrs: this.form.tagihanrs,

              // data obat master
              kodeobat: res?.kdobat,
              forkit: obats?.forkit,
              fornas: obats?.fornas,
              generik: obats?.generik,
              kandungan: obats?.kandungan,
              kode50: obats?.kode50,
              kode108: obats?.kode108,
              stokalokasi: obats?.alokasi,
              uraian50: obats?.uraian50,
              uraian108: obats?.uraian108,

              // data duplicate
              jenis_perbekalan: res?.mobat?.jenis_perbekalan,
              aturan: res?.aturan,
              jumlah_diminta: res?.jumlah,
              jumlahdosis: res?.jumlah,
              jumlah: res?.jumlah,
              keterangan: res?.keterangan,
              konsumsi: res?.konsumsi,
              satuan_kcl: res?.mobat?.satuan_k,
              kodedepo: depo[0]?.value,
              iter_jml: val?.iter_jml,
              jenisresep: 'nonRacikan',
              tiperacikan: '',
              lanjuTr: ''
            }
            kirimResep.push(temp)
          })
        }
      }
      else {
        if (rinracik.length) {
          rinracik.forEach(racikan => {
            const obats = obat.find(ob => ob?.kdobat === racikan?.kdobat)
            const rac = racik.find(ob => ob?.kdobat === racikan?.kdobat)
            const temp = {

              // data pasien
              noreg: this.form.noreg,
              norm: this.form.norm,
              groupsistembayar: this.form.groupsistembayar,
              sistembayar: this.form.sistembayar,
              dokter: this.form.dokter,
              diagnosa: this.form.diagnosa,
              noresep: this.form.noresep ?? null,
              tiperesep: this.form.tiperesep,
              kodeincbg: this.form.kodeincbg,
              uraianinacbg: this.form.uraianinacbg,
              tarifina: this.form.tarifina,
              kdruangan: this.form.kdruangan,
              tagihanrs: this.form.tagihanrs,

              // data obat master
              kodeobat: rac?.kdobat,
              forkit: obats?.forkit,
              fornas: obats?.fornas,
              generik: obats?.generik,
              kandungan: obats?.kandungan,
              kode50: obats?.kode50,
              kode108: obats?.kode108,
              stokalokasi: obats?.alokasi,
              uraian50: obats?.uraian50,
              uraian108: obats?.uraian108,

              jenis_perbekalan: rac?.mobat?.jenis_perbekalan,
              namaracikan: rac?.namaracikan,
              tiperacikan: rac?.tiperacikan,
              jumlahdibutuhkan: rac?.jumlahdibutuhkan,
              aturan: rac?.aturan,
              konsumsi: rac?.konsumsi,
              keterangan: rac?.keterangan,
              dosismaksimum: rac?.dosismaksimum,
              dosisobat: rac?.dosisobat,
              jumlah: racikan?.jumlah,
              satuan_racik: rac?.satuan_racik,
              keteranganx: rac?.keteranganx,
              jenisresep: 'Racikan',
              jumlahdiminta: rac?.jumlah,
              jumlahdosis: rac?.jumlah,
              kodedepo: depo[0]?.value,
              satuan_kcl: rac?.mobat?.satuan_k,
              lanjuTr: ''

            }
            kirimResep.push(temp)
          })
        }
      }
      const data = {
        kirimResep, groupsistembayar: this.form.groupsistembayar, kddepo: depo[0]?.value, noresep_asal: val?.noresep, noresep: this.form.noresep ?? null
      }

      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/pelayanan/copiresep', data)
          .then(resp => {
            this.loading = false
            notifSuccess(resp)

            console.log('resp', resp?.data)
            const nota = resp?.data.map(item => item?.nota)
            this.noreseps.push(nota[0])
            this.noresep = nota[0]

            const newapotekrajal = resp?.data.map(item => item?.newapotekrajal)
            if (newapotekrajal.length) {
              const lastIndex = newapotekrajal.length - 1
              const lastItem = newapotekrajal[lastIndex]
              this.pasien.newapotekrajal = lastItem
              this.indexRacikan = this.pasien.newapotekrajal.findIndex(x => x.noresep === nota[0])
              if (this.indexRacikan !== -1) { this.setResep(this.noresep) }
            }

            this.resetForm()
            this.setForm('noresep', nota[0])

            resolve(resp)

            if (tipe === 'racik') {
              racik.forEach((dt, idt) => {
                const result = resp.data.find(el => el.kdobat === dt?.kdobat)
                if (result?.messageError) {
                  if (result?.messageError?.cek) {
                    this.statusCopiedRacik[`${indexlist}-${dt?.kdobat}`] = false
                    this.pemberianObatCek[`${indexlist}-${dt?.kdobat}`] = result?.messageError
                    this.permintaanResepDuplicate[`${indexlist}-${dt?.kdobat}`] = data?.kirimResep[idt]
                  }
                  else {
                    this.statusCopiedRacik[`${indexlist}-${dt?.kdobat}`] = false
                    this.pemberianObatCek[`${indexlist}-${dt?.kdobat}`] = null
                    this.messageCopied[`${indexlist}-${dt?.kdobat}`] = result?.messageError
                  }
                }
                else {
                  this.statusCopiedRacik[`${indexlist}-${dt?.kdobat}`] = true
                  this.pemberianObatCek[`${indexlist}-${dt?.kdobat}`] = []
                }
              })
            }
            else {
              resep.forEach((dt, idt) => {
                const result = resp.data.find(el => el.kdobat === dt?.kdobat)
                if (result?.messageError) {
                  if (result?.messageError?.cek) {
                    this.statusCopied[`${indexlist}-${dt?.kdobat}`] = false
                    this.pemberianObatCek[`${indexlist}-${dt?.kdobat}`] = result?.messageError
                    this.permintaanResepDuplicate[`${indexlist}-${dt?.kdobat}`] = data?.kirimResep[idt]
                  }
                  else {
                    this.statusCopied[`${indexlist}-${dt?.kdobat}`] = false
                    this.messageCopied[`${indexlist}-${dt?.kdobat}`] = result?.messageError
                    this.pemberianObatCek[`${indexlist}-${dt?.kdobat}`] = null
                  }
                }
                else {
                  this.statusCopied[`${indexlist}-${dt?.kdobat}`] = true
                }
              })
            }

            this.cariObat()
          })
          .catch(error => {
            this.resetForm()
            console.error('Error in simpanCopyResep:', error)
            this.loading = false
            reject(error)
          })
      })
    },

    simpanCopyResepKonfirmasi (val, tipe, indexlist) {
      const racik = this.permintaanresep
      const resep = this.permintaanresepracikan
      const kirimResep = []
      const apps = useAplikasiStore()
      let kdruang = ''
      let tagihanRs = 0
      const depo = this.depos.filter(pa => pa.jenis === this.depo)

      if (depo[0]?.value === 'Gd-04010102') {
        kdruang = this.pasien?.kdruangan
      }
      else if (depo[0]?.value === 'Gd-04010103') {
        kdruang = this.pasien?.kdruangan
      }
      else {
        kdruang = this.pasien?.kodepoli
      }

      if (depo[0]?.value === 'Gd-05010101') {
        const kunjRajal = useKasirRajalListKunjunganStore()
        const param = { noreg: val?.noreg }
        kunjRajal.getBill(param).then(resp => {
          tagihanRs = resp?.data?.totalall
        })
      }

      const temp = this.pasien?.diagnosa?.map(x => x?.rs3 + ' - ' + x?.masterdiagnosa?.rs4)
      const diag = temp?.length ? temp.join(', ') : '-'

      if (tipe === 'nonRacik') {
        const temp = {
          noresep: this.noresep,
          aturan: val?.aturan,
          diagnosa: val?.diagnosa,
          dokter: val?.dokter,
          forkit: val?.forkit,
          fornas: val?.fornas,
          generik: val?.generik,
          groupsistembayar: this.pasien?.groups,
          jumlah_diminta: val?.jumlah,
          jumlahdosis: val?.jumlah,
          jumlah: val?.jumlah,
          kandungan: val?.kandungan,
          kdruangan: kdruang,
          keterangan: val?.keterangan,
          kode50: val?.kode50,
          kode108: val?.kode108,
          kodedepo: depo[0]?.value,
          kodeincbg: diag,
          kodeobat: val?.kodeobat,
          konsumsi: val?.konsumsi,
          noreg: this.pasien?.noreg,
          norm: this.pasien?.norm,
          satuan_kcl: val?.satuan_kcl,
          jenis_perbekalan: val?.jenis_perbekalan,
          sistembayar: this.pasien?.kodesistembayar ?? this.pasien?.kdsistembayar,
          stokalokasi: val?.stokalokasi,
          tagihanrs: tagihanRs,
          tarifina: 0,
          uraian50: val?.uraian50,
          uraian108: val?.uraian108,
          uraianinacbg: '-',
          iter_jml: val?.iter_jml,
          tiperesep: val?.tiperesep,
          jenisresep: 'nonRacikan',
          tiperacikan: '',
          lanjuTr: '1'
        }
        kirimResep.push(temp)
      }
      else {
        const temp = {
          noresep: this.noresep,
          noreg: this.pasien?.noreg,
          namaracikan: val?.namaracikan,
          tiperacikan: val?.tiperacikan,
          jumlahdibutuhkan: val?.jumlahdibutuhkan,
          aturan: val?.aturan,
          konsumsi: val?.konsumsi,
          keterangan: val?.keterangan,
          kodeobat: val?.kodeobat,
          kandungan: val?.kandungan,
          forkit: val?.forkit,
          fornas: val?.fornas,
          generik: val?.generik,
          hpp: val?.hpp,
          harga_jual: val?.harga_jual,
          kode108: val?.kode108,
          uraian108: val?.uraian108,
          kode50: val?.kode50,
          uraian50: val?.uraian50,
          stokalokasi: val?.alokasi,
          dosismaksimum: val?.dosismaksimum,
          dosisobat: val?.dosisobat,
          satuan_racik: val?.satuan_racik,
          keteranganx: val?.keteranganx,
          groupsistembayar: this.pasien?.groups,
          jenisresep: 'Racikan',
          jumlah: val?.jumlah,
          jumlahdiminta: val?.jumlah,
          jumlahdosis: val?.jumlah,
          kdruangan: kdruang,
          kodedepo: depo[0]?.value,
          kodeincbg: '-',
          norm: this.pasien?.norm,
          satuan_kcl: val?.satuan_kcl,
          sistembayar: this.pasien?.kodesistembayar ?? this.pasien?.kdsistembayar,
          tagihanrs: tagihanRs,
          tarifina: 0,
          uraianinacbg: '-',
          diagnosa: diag,
          lanjuTr: '1',
          tiperesep: val?.tiperesep,
          jenis_perbekalan: val?.jenis_perbekalan
        }
        kirimResep.push(temp)
      }
      const head = {
        noreg: this.pasien?.noreg,
        noresep_asal: val?.noresep,
        tiperesep: val?.tiperesep,
        iter_expired: '',
        norm: val?.norm,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        ruangan: kdruang,
        kdruangan: kdruang,
        dokter: apps?.user?.pegawai?.kdpegsimrs,
        depo: depo[0]?.value,
        sistembayar: this.pasien?.kodesistembayar ?? this.pasien?.kdsistembayar,
        diagnosa: diag,
        kodeincbg: '-',
        uraianinacbg: '-',
        tarifina: 0,
        tagihanrs: tagihanRs,
        flag: '',
        tgl_kirim: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
      }
      const data = {
        head, kirimResep, groupsistembayar: val?.groupsistembayar, kddepo: val?.kodedepo, noresep: this.form.noresep ?? null
      }

      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/pelayanan/copiresep', data)
          .then(resp => {
            this.loading = false
            notifSuccess(resp)

            const nota = resp?.data.map(item => item?.nota)
            this.noreseps.push(nota[0])
            this.noresep = nota[0]

            const newapotekrajal = resp?.data.map(item => item?.newapotekrajal)

            if (newapotekrajal.length) {
              const lastIndex = newapotekrajal.length - 1
              const lastItem = newapotekrajal[lastIndex]
              this.pasien.newapotekrajal = lastItem
              this.indexRacikan = this.pasien.newapotekrajal.findIndex(x => x.noresep === nota[0])
              if (this.indexRacikan !== -1) { this.setResep(this.noresep) }
            }

            this.resetForm()
            this.setForm('noresep', nota[0])
            resolve(resp)

            console.log('RACIK', racik)
            console.log('NON RACIK', resep)

            if (tipe === 'racik') {
              racik.forEach((dt, idt) => {
                const result = resp.data.find(el => el.kdobat === dt?.kdobat)
                if (result?.messageError) {
                  if (result?.messageError?.cek) {
                    this.statusCopiedRacik[`${indexlist}`] = false
                    this.pemberianObatCek[`${indexlist}`] = result?.messageError
                    this.permintaanResepDuplicate[`${indexlist}`] = data?.kirimResep[idt]
                  }
                  else {
                    this.statusCopiedRacik[`${indexlist}`] = false
                    this.pemberianObatCek[`${indexlist}`] = null
                    this.messageCopied[`${indexlist}`] = result?.messageError
                  }
                }
                else {
                  this.statusCopiedRacik[`${indexlist}`] = true
                  this.pemberianObatCek[`${indexlist}`] = []
                }
              })
            }
            else {
              this.permintaanresep.forEach((dt, idt) => {
                const result = resp.data.find(el => el.kdobat === dt?.kdobat)
                if (result?.messageError) {
                  if (result?.messageError?.cek) {
                    this.statusCopied[`${indexlist}`] = false
                    this.pemberianObatCek[`${indexlist}`] = result?.messageError
                    this.permintaanResepDuplicate[`${indexlist}`] = data?.kirimResep[idt]
                  }
                  else {
                    this.statusCopied[`${indexlist}`] = false
                    this.messageCopied[`${indexlist}`] = result?.messageError
                    this.pemberianObatCek[`${indexlist}`] = null
                  }
                }
                else {
                  this.statusCopied[`${indexlist}`] = true
                }
              })
            }

            this.cariObat()
          })
          .catch(error => {
            this.resetForm()
            console.error('Error in simpanCopyResep:', error)
            this.loading = false
            reject(error)
          })
      })
    },
    openDialogDuplicateResep (val, permintaanResepDuplicate, tipe, indexlist) {
      console.log('VALKONF', permintaanResepDuplicate)
      Dialog.create({
        title: 'Konfirmasi',
        message: `Obat yang diberikan tgl ${dateFullFormat(val?.cek?.tgl)} yang direncakan untuk konsumsi selama ${val?.cek?.konsumsi} hari, baru dikonsumsi ${val?.cek?.selisih} hari. Apakah Akan tetal dilanjutkan?`,
        ok: {
          push: true,
          label: 'Lanjutkan',
          'no-caps': true,
          color: 'primary'
        },
        cancel: {
          push: true,
          label: 'Batal',
          'no-caps': true,
          color: 'dark'
        }
      })
        .onOk(() => {
          this.simpanCopyResepKonfirmasi(permintaanResepDuplicate, tipe, indexlist)
        })
    }
  }
})
