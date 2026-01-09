import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue, waitLoad } from "src/modules/utils";

export const usePrioritasAnggaranStore = defineStore('prioritas-anggaran-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    loadingKunci: false,
    disabled: false,
    disableSaved: false,
    fixed: false,
    openDialogRinci: false,
    dialogCetak: false,
    form: {
      id: null,
      notrans: '',
      kodepptk: '',
      pptk: '',
      kodebidang: '',
      namabidang: '',
      kodekegiatan: '',
      kegiatan: '',
      kdruang_pengusul: '',
      ruang_pengusul: '',
      capaianprogram: '',
      masukan: 'Dana yang Dibutuhkan',
      keluaran: '',
      hasil: '',
      targetcapaian: '',
      targetkeluaran: '',
      targethasil: '',
      kunci: '',
      tgltrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      pagu: 0,

      //rincian
      usulan: '',
      jumlahacc: 0,
      volume: 0,
      harga: 0,
      nilai: 0,
      satuan: '',
      koderek108: '',
      uraian108: '',
      koderek50: '',
      uraian50: '',
      nousulan: '',
      koders: '',
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis: '',
      page: 1,
      per_page: 50,
      notrans: ''
    },
    dataCetaks: [],
    dataModals: [],
    dataJasalain: [],
    akuns: [],
    kegiatans: [],
    optionkegiatan: [],
    dataSaved: [],
    getRincian: [],
    rincians: [],
    rincianAktif: null,
    columns: [],


    dataHeader: {},
    rincianSaved: [],
    datarka: [],
    totalPagukegiatan: []
  }),
  actions: {
    goToPage(val) {
      this.params.page = val
      this.getData()
    },
    setForm(key, val) {
      this.form[key] = val
    },
    //get Barangs

    setColumns(payload) {
      // const thumb = payload.map((x) => Object.keys(x))
      // this.columns = thumb[0]
      this.columns = ['kode', 'nama', 'barang108', 'uraian_50', 'depo', 'satuan', 'pengali', 'satuankecil', 'ssh', 'tipe']
      // console.log('columns', this.columns)
    },
    getKegiatan() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/anggaran/penyusunan/prioritas/select', params).then((resp) => {
          console.log('Get Kegiatan', resp)
          if (resp.status === 200) {
            this.kegiatans = resp.data?.data
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/anggaran/penyusunan/prioritas/save', this.form)
        console.log('simpan', resp)
        const result = resp?.data?.data
        if (resp.success === true) {

          this.form.notrans = result?.notrans


          this.items.unshift(result)
          // this.initModeEdit(result)
        }
        const allrinci = result?.rincian || []
        const existingIds = new Set(this.rincianSaved.map(r => r.id))
        const newRincians = allrinci.filter(r => !existingIds.has(r.id))
        this.rincianSaved.unshift(...newRincians)

        notifSuccessVue(resp?.data?.message)
        console.log('rinciansxxx', this.rincianSaved)
        this.form = {
          notrans: result?.notrans,
          kodepptk: result?.kodepptk,
          pptk: result?.pptk,
          kodebidang: result?.kodebidang,
          namabidang: result?.namabidang,
          kodekegiatan: result?.kodekegiatan,
          kegiatan: result?.kegiatan,
          kdruang_pengusul: result?.kdruang_pengusul,
          ruang_pengusul: result?.ruang_pengusul,
          capaianprogram: result?.capaianprogram,
          masukan: result?.masukan,
          keluaran: result?.keluaran,
          hasil: result?.hasil,
          pagu: result?.pagu,
          targetcapaian: result?.targetcapaian,
          targetkeluaran: result?.targetkeluaran,
          targethasil: result?.targethasil,
          kunci: result?.kunci,
          tgltrans: result?.tgltrans,
          tahun: date.formatDate(Date.now(), 'YYYY'),

          usulan: '',
          jumlahacc: 0,
          volume: 0,
          harga: 0,
          nilai: 0,
          satuan: '',
          koderek108: '',
          uraian108: '',
          koderek50: '',
          uraian50: '',
          nousulan: '',
          koders: '',
        }
        // this.getData()
        this.loadingSave = false
        return newRincians[0] || null
      } catch (error) {
        console.log(error)
        this.loadingSave = false
      }
    },
    initForm() {
      this.form = {
        id: null,
        notrans: '',
        kodepptk: '',
        pptk: '',
        kodebidang: '',
        namabidang: '',
        kodekegiatan: '',
        kegiatan: '',
        kdruang_pengusul: '',
        ruang_pengusul: '',
        capaianprogram: '',
        masukan: 'Dana yang Dibutuhkan',
        keluaran: '',
        hasil: '',
        targetcapaian: '',
        targetkeluaran: '',
        targethasil: '',
        kunci: '',
        tgltrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        tahun: date.formatDate(Date.now(), 'YYYY'),
        pagu: 0,
        //rincian
        usulan: '',
        jumlahacc: 0,
        volume: 0,
        harga: 0,
        nilai: 0,
        satuan: '',
        koderek108: '',
        uraian108: '',
        koderek50: '',
        uraian50: '',
        nousulan: '',
        koders: '',
      }
      this.rincians = []
      this.disabled = false
      this.loadingHapus = false
    },

    initModeEdit(result) {
      this.form = result

      const id = result?.id ?? null
      const index = this.items.findIndex(item => item?.id === id)
      if (index !== -1) {
        this.items[index] = result
      }
      // this.supplierSelected = result?.supplier ?? result?.suplier ?? result ?? null
      // this.maxRight = false
      // this.mode = 'edit'
    },
    async getData() {
      this.loading = true
      try {
        const params = {
          tahun: this.params.tahun,
          q: this.params.q
        }
        const resp = await api.get(
          '/v1/anggaran/penyusunan/prioritas/index',
          { params }
        )
        console.log('data Pengusulan', resp)
        if (resp.status === 200) {
          this.items = resp?.data
        }
      } finally {
        this.loading = false
      }

    },
    editForm(val) {
      this.form.id = val?.id ?? null
      this.form.notrans = val?.notrans ?? ''
      this.form.kodepptk = val?.kodepptk ?? ''
      this.form.pptk = val?.pptk ?? ''
      this.form.kodebidang = val?.kodebidang ?? ''
      this.form.namabidang = val?.namabidang ?? ''
      this.form.kodekegiatan = val?.kodekegiatan ?? ''
      this.form.kegiatan = val?.kegiatan ?? ''
      this.form.kdruang_pengusul = val?.kdruang_pengusul ?? ''
      this.form.ruang_pengusul = val?.ruang_pengusul ?? ''
      this.form.capaianprogram = val?.capaianprogram ?? ''
      this.form.masukan = val?.masukan ?? ''
      this.form.keluaran = val?.keluaran ?? ''
      this.form.hasil = val?.hasil ?? ''
      this.form.targetcapaian = val?.targetcapaian ?? ''
      this.form.targetkeluaran = val?.targetkeluaran ?? ''
      this.form.targethasil = val?.targethasil ?? ''
      this.form.kunci = val?.kunci ?? ''
      this.form.tgltrans = val?.tgltrans ?? this.form.tgltrans
      this.form.tahun = val?.tahun ?? this.form.tahun
      // this.form.group = val?.groups?.toString()

    },
    async deleteData(payload) {
      this.loadingDelete = true
      try {
        const resp = await api.post(
          '/v1/anggaran/penyusunan/prioritas/deleterinci',
          payload
        )

        if (resp.status === 200) {
          this.rincianSaved = resp.data.data ?? []
          notifSuccessVue(resp.data.message)
        }
      } catch (error) {
        notifErrVue(error.response?.data?.message ?? 'Gagal hapus data')
      } finally {
        this.getData()
        this.loadingDelete = false
      }
    },
    async kunciData(id) {
      this.loadingKunci = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/anggaran/penyusunan/prioritas/kunci', payload)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          this.getData()
        }
        this.loadingKunci = false
      }
      catch (error) {
        notifErr(error)
        this.loadingKunci = false
      }
    },
    search(val) {
      this.params.q = val
      this.getData()
    },
    goToPage(val) {
      this.params.page = val
      this.getData()
    },

    dataCetak() {
      waitLoad('show')
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/anggaran/penyusunan/prioritas/cetakdata', params)
          .then((resp) => {
            waitLoad('done')
            // console.log('resp Cetak', resp)
            this.datarka = []
            this.totalPagukegiatan = []
            if (resp.status === 200) {
              this.dataCetaks = resp.data.data
              this.meta = resp.data.meta
              // this.setColumns(resp.data.data)
              // console.log(resp.data.data)
              this.mapingDataCetak()
              resolve(resp)
            }
          })
          .catch((err) => {
            waitLoad('done')
            reject(err)
          })
      })
    },
    mapingDataCetak() {
      const rka = []
      const totalrka = []
      const rincianAll = this.dataCetaks?.flatMap((x) => x.rincian)
      console.log('rincianAll', rincianAll)
      const uniq1 = rincianAll.map((x) => x.kode1)
      const fils1 = uniq1?.length ? [...new Set(uniq1)] : []
      for (let i = 0; i < fils1?.length; i++) {
        const el = fils1[i]
        const obj = {
          kode: rincianAll.filter((x) => x.kode1 === el)[0].kode1,
          uraian: rincianAll.filter((x) => x.kode1 === el)[0]?.uraian1,
          pagu: rincianAll.filter((x) => x.kode1 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
        totalrka.push(obj)
      }
      console.log('rka', rka)
      const uniq2 = rincianAll.map((x) => x.kode2)
      const fils2 = uniq2?.length ? [...new Set(uniq2)] : []
      for (let i = 0; i < fils2?.length; i++) {
        const el = fils2[i]
        const obj = {
          kode: rincianAll.filter((x) => x.kode2 === el)[0].kode2,
          uraian: rincianAll.filter((x) => x.kode2 === el)[0]?.uraian2,
          pagu: rincianAll.filter((x) => x.kode2 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }
      const uniq3 = rincianAll.map((x) => x.kode3)
      const fils3 = uniq3?.length ? [...new Set(uniq3)] : []
      for (let i = 0; i < fils3?.length; i++) {
        const el = fils3[i]
        const obj = {
          kode: rincianAll.filter((x) => x.kode3 === el)[0].kode3,
          uraian: rincianAll.filter((x) => x.kode3 === el)[0]?.uraian3,
          pagu: rincianAll.filter((x) => x.kode3 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }
      const uniq4 = rincianAll.map((x) => x.kode4)
      const fils4 = uniq4?.length ? [...new Set(uniq4)] : []
      for (let i = 0; i < fils4?.length; i++) {
        const el = fils4[i]
        const obj = {
          kode: rincianAll.filter((x) => x.kode4 === el)[0].kode4,
          uraian: rincianAll.filter((x) => x.kode4 === el)[0]?.uraian4,
          pagu: rincianAll.filter((x) => x.kode4 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }
      const uniq5 = rincianAll.map((x) => x.kode5)
      const fils5 = uniq5?.length ? [...new Set(uniq5)] : []
      for (let i = 0; i < fils5?.length; i++) {
        const el = fils5[i]
        const obj = {
          kode: rincianAll.filter((x) => x.kode5 === el)[0].kode5,
          uraian: rincianAll.filter((x) => x.kode5 === el)[0]?.uraian5,
          pagu: rincianAll.filter((x) => x.kode5 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }
      const uniq6 = rincianAll.map((x) => x.kode6)
      const fils6 = uniq6?.length ? [...new Set(uniq6)] : []
      for (let i = 0; i < fils6?.length; i++) {
        const el = fils6[i]
        const obj = {
          kode: rincianAll.filter((x) => x.kode6 === el)[0].kode6,
          uraian: rincianAll.filter((x) => x.kode6 === el)[0].uraian6,
          pagu: rincianAll.filter((x) => x.kode6 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: rincianAll.filter((x) => x.kode6 === el).map((x) => {
            return {
              kode108: x.koderek108,
              usulan: x.usulan,
              volume: x.volume,
              harga: x.harga,
              satuan: x.satuan,
              pagu: x.total
            }
          })
        }
        rka.push(obj)
      }

      const sortAnggaran = (rka) =>
        rka.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const dataRKA = sortAnggaran(rka)
      this.datarka = dataRKA
      console.log('DATA RKAxxxx', this.datarka)

      this.totalPagukegiatan = totalrka
      console.log('DATA total', this.totalPagukegiatan)

    },

  }
})
