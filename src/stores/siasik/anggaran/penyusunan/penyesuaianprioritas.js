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
      jumalhacc: 0,
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
    },
    dataBarangs: [],
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



    rincianSaved: [],
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
    getBarangs() {
      waitLoad('show')
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/anggaran/penyusunan/pengusulan/selectitem', params)
          .then((resp) => {
            waitLoad('done')
            console.log('resp barang', resp)
            if (resp.status === 200) {
              this.dataBarangs = resp.data.data
              this.meta = resp.data.meta
              this.setColumns(resp.data.data)
              // console.log(resp.data.data)
              resolve(resp.data.data)
            }
          })
          .catch((err) => {
            waitLoad('done')
            reject(err)
          })
      })
    },
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
        const existingIds = new Set(this.rincians.map(r => r.id))
        const newRincians = allrinci.filter(r => !existingIds.has(r.id))
        this.rincians.unshift(...newRincians)

        notifSuccessVue(resp?.data?.message)
        console.log('rinciansxxx', this.rincians)
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
          targetcapaian: result?.targetcapaian,
          targetkeluaran: result?.targetkeluaran,
          targethasil: result?.targethasil,
          kunci: result?.kunci,
          tgltrans: result?.tgltrans,
          tahun: date.formatDate(Date.now(), 'YYYY'),

          usulan: '',
          jumalhacc: 0,
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
        masukan: '',
        keluaran: '',
        hasil: '',
        targetcapaian: '',
        targetkeluaran: '',
        targethasil: '',
        kunci: '',
        tgltrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        tahun: date.formatDate(Date.now(), 'YYYY'),

        //rincian
        usulan: '',
        jumalhacc: 0,
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
          this.rincians = resp.data.data ?? []
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

  }
})
