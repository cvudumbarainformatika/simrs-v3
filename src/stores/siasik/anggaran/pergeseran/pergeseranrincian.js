import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue, waitLoad } from "src/modules/utils";

export const usePergeseranAnggaranStore = defineStore('pergeseran-anggaran-store', {
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
      //header
      noperubahan: '',
      notrans: '',
      nousulan: '',
      kodekegiatanblud: '',
      uraianblud: '',
      kodebidang: '',
      namabidang: '',
      bidang: '',

      //rinci
      usulan: '',
      volume: 0,
      harga: 0,
      nilai: 0,
      volumebaru: 0,
      hargabaru: 0,
      totalbaru: 0,
      selisih: 0,

      koderek108: '',
      uraian108: '',
      koderek50: '',
      uraian50: '',
      jumlahacc: 0,
      satuan: '',
      jenis: '',

      koders: '',
      idpp: '',
      tglperubahan: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis: '',
      page: 1,
      per_page: 10,
    },
    kegiatanblud: null,
    namapptk: null,
    kodepptk: null,
    dataBarangs: [],
    dataModals: [],
    dataJasalain: [],
    akuns: [],
    kegiatans: [],
    optionkegiatan: [],
    dataSaved: [],
    rincians: [],
    columns: [],
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
        api.get('v1/anggaran/penyusunan/pengusulan/select', params).then((resp) => {
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
        const resp = await api.post('v1/anggaran/pergeseran/rincian/save', this.form)
        console.log('simpan', resp)
        const result = resp?.data?.data
        if (resp.success === true) {

          this.form.noperubahan = result?.noperubahan

          this.items.unshift(result)
          // this.initModeEdit(result)
        }
        // const allrinci = result?.penetapan || []
        // const existingIds = new Set(this.rincians.map(r => r.id))
        // const newRincians = allrinci.filter(r => !existingIds.has(r.id))
        // this.rincians.unshift(...newRincians)
        this.rincians = [...(result?.penetapancopy || [])]

        notifSuccessVue(resp?.data?.message)
        this.form = {
          noperubahan: result?.noperubahan,
          notrans: result?.notrans,
          usulan: '',
          volume: 0,
          harga: 0,
          nilai: 0,
          volumebaru: 0,
          hargabaru: 0,
          totalbaru: 0,
          selisih: 0,
          koderek108: '',
          uraian108: '',
          koderek50: '',
          uraian50: '',
          jumlahacc: 0,
          satuan: '',
          nousulan: '',
          kodekegiatanblud: result?.kodekegiatan,
          uraianblud: result?.kegiatan,
          kodebidang: result?.kodebidang,
          namabidang: result?.namabidang,
          bidang: result?.kodebidang,
          pagu: result?.pagu,
          koders: '',
          idpp: '',
          tglperubahan: date.formatDate(Date.now(), 'YYYY-MM-DD'),
          tahun: result?.tgltrans ? date.formatDate(result.tgltrans, 'YYYY') : date.formatDate(Date.now(), 'YYYY'),

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
        noperubahan: '',
        notrans: '',
        usulan: 0,
        volume: 0,
        harga: 0,
        nilai: 0,
        volumebaru: 0,
        hargabaru: 0,
        totalbaru: 0,
        selisih: 0,
        koderek108: '',
        uraian108: '',
        koderek50: '',
        uraian50: '',
        jumlahacc: 0,
        satuan: '',
        nousulan: '',
        kodekegiatanblud: '',
        uraianblud: '',
        kodebidang: '',
        bidang: '',
        koders: '',
        idpp: '',
        tglperubahan: date.formatDate(Date.now(), 'YYYY-MM-DD'),
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
          '/v1/anggaran/pergeseran/rincian/index',
          { params }
        )
        console.log('data Pergeseran', resp)
        if (resp.status === 200) {
          this.items = resp?.data
        }
      } finally {
        this.loading = false
      }

    },
    editForm(val) {
      this.form.noperubahan = val.noperubahan
      this.form.notrans = val.notrans
      this.form.usulan = val.usulan
      this.form.volume = val.volume
      this.form.harga = val.harga
      this.form.nilai = val.nilai
      this.form.volumebaru = val.volumebaru
      this.form.hargabaru = val.hargabaru
      this.form.totalbaru = val.totalbaru
      this.form.selisih = val.selisih
      this.form.koderek108 = val.koderek108
      this.form.uraian108 = val.uraian108
      this.form.koderek50 = val.koderek50
      this.form.uraian50 = val.uraian50
      this.form.jumlahacc = val.jumlahacc
      this.form.satuan = val.satuan
      this.form.nousulan = val.nousulan
      this.form.kodekegiatanblud = val.kodekegiatanblud
      this.form.uraianblud = val.uraianblud
      this.form.kodebidang = val.kodebidang
      this.form.namabidang = val.bidang
      this.form.bidang = val.bidang
      this.form.koders = val.koders
      this.form.idpp = val.idpp
      this.form.tglperubahan = val.tglperubahan


    },
    async deleteData(payload) {
      this.loadingDelete = true
      try {
        const resp = await api.post(
          '/v1/anggaran/penyusunan/pengusulan/deleterinci',
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
    async verifikasi(payload) {
      this.loadingSave = true
      try {
        const resp = await api.post('/v1/anggaran/pergeseran/rincian/verifikasi', payload)

        if (resp.status === 200) {
          notifSuccess(resp)
          await this.getData()
        }

        return resp // 🔥 penting

      } catch (error) {
        notifErr(error)
        throw error // 🔥 penting biar bisa ditangkap di component

      } finally {
        this.loadingSave = false // 🔥 paling aman
      }
    },

    dataCetak() {
      waitLoad('show')
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/anggaran/pergeseran/rincian/cetak', params)
          .then((resp) => {
            waitLoad('done')
            console.log('resp Cetak', resp)
            this.pergeseran = []
            if (resp.status === 200) {
              this.pergeseran = resp.data
              this.rincianpergeseran = resp.data.flatMap((x) => x.hasilpergeseran)
              // this.setColumns(resp.data.data)
              // console.log(resp.data.data)
              this.mapingDatapergeseran()
              resolve(resp)
            }
          })
          .catch((err) => {
            waitLoad('done')
            reject(err)
          })
      })
    },

    search(val) {
      this.params.q = val
      this.getData()
    },
    goToPage(val) {
      this.params.page = val
      this.getData()
    },
    mapingDatapergeseran() {
      const rka = []
      // const totalrka = []
      const unik1 = this.rincianpergeseran.map((x) => x.kode1)
      const ar1 = unik1.length ? [...new Set(unik1)] : []
      for (let i = 0; i < ar1.length; i++) {
        const el = ar1[i];
        const obj = {
          kode: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].kode1,
          uraian: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].uraian1,
          pagu: this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          pagubaru: this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
          selisih: this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }

      const unik2 = this.rincianpergeseran.map((x) => x.kode2)
      const ar2 = unik2.length ? [...new Set(unik2)] : []
      for (let i = 0; i < ar2.length; i++) {
        const el = ar2[i];
        const obj = {
          kode: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].kode2,
          uraian: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].uraian2,
          pagu: this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          pagubaru: this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
          selisih: this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }

      const unik3 = this.rincianpergeseran.map((x) => x.kode3)
      const ar3 = unik3.length ? [...new Set(unik3)] : []
      for (let i = 0; i < ar3.length; i++) {
        const el = ar3[i];
        const obj = {
          kode: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].kode3,
          uraian: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].uraian3,
          pagu: this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          pagubaru: this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
          selisih: this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }

      const unik4 = this.rincianpergeseran.map((x) => x.kode4)
      const ar4 = unik4.length ? [...new Set(unik4)] : []
      for (let i = 0; i < ar4.length; i++) {
        const el = ar4[i];
        const obj = {
          kode: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].kode4,
          uraian: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].uraian4,
          pagu: this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          pagubaru: this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
          selisih: this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }
      const unik5 = this.rincianpergeseran.map((x) => x.kode5)
      const ar5 = unik5.length ? [...new Set(unik5)] : []
      for (let i = 0; i < ar5.length; i++) {
        const el = ar5[i];
        const obj = {
          kode: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].kode5,
          uraian: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].uraian5,
          pagu: this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          pagubaru: this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
          selisih: this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: []
        }
        rka.push(obj)
      }

      const unik6 = this.rincianpergeseran.map((x) => x.kode6)
      const ar6 = unik6.length ? [...new Set(unik6)] : []
      for (let i = 0; i < ar6.length; i++) {
        const el = ar6[i];
        const obj = {
          kode: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].kode6,
          uraian: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].uraian6,
          pagu: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          pagubaru: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
          selisih: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
          rincian: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => {
            return {
              kode108: x.koderek108,
              usulan: x.usulan,
              satuan: x.satuan,
              volume: x.volume,
              harga: x.harga,
              pagu: x.total,

              volumebaru: x.volumebaru,
              hargabaru: x.hargabaru,
              pagubaru: x.totalbaru,
              selisih: parseFloat(x.totalbaru) - parseFloat(x.total)
            }
          })
        }
        rka.push(obj)
      }

      const sortAnggaran = (rka) =>
        rka.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const dataRKApergeseran = sortAnggaran(rka)
      this.datarkapergeseran = dataRKApergeseran
      console.log('rka', this.datarkapergeseran)
    },

  }
})
