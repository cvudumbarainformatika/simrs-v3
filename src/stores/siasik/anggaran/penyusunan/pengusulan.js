import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue, waitLoad } from "src/modules/utils";

export const usePengusulanAnggaranStore = defineStore('pengusulan-anggaran-store', {
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
      kodeRuangan: '',
      ruangan: '',
      kodeKegiatan: '',
      kegiatan: '',
      kodebagian: '',
      organisasi_nama: '',
      paguanggaran: '',
      kode50: '1.02.01.2.10.01',
      uraian: 'Pelayanan dan Penunjang Pelayanan BLUD',
      kunci: '',
      tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tahun: date.formatDate(Date.now(), 'YYYY'),

      //rincian
      keterangan: '',
      volume: 0,
      harga: 0,
      nilai: 0,
      satuan: '',
      jenis: ''
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis: '',
      page: 1,
      per_page: 10,
    },
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
          console.log('Get Kegiatang', resp)
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
        const resp = await api.post('v1/anggaran/penyusunan/pengusulan/save', this.form)
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
          kodeRuangan: result?.kodeRuangan,
          ruangan: result?.ruangan,
          kodeKegiatan: result?.kodeKegiatan,
          kegiatan: result?.kegiatan,
          kodebagian: result?.kodebagian,
          organisasi_nama: result?.organisasi_nama,
          paguanggaran: result?.paguanggaran,
          kode50: result?.kode50,
          uraian: result?.uraian,
          kunci: '',
          tglTransaksi: resp?.data?.data?.tglTransaksi,
          tahun: date.formatDate(Date.now(), 'YYYY'),

          keterangan: '',
          volume: 0,
          harga: 0,
          nilai: 0,
          satuan: '',
          jenis: ''
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
        kodeRuangan: '',
        ruangan: '',
        kodeKegiatan: '',
        kegiatan: '',
        kodebagian: '',
        organisasi_nama: '',
        paguanggaran: '',
        kode50: '1,.02.01.2.10.01',
        uraian: 'P,elayanan dan Penunjang Pelayanan BLUD',
        kunci: '',
        tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        tahun: date.formatDate(Date.now(), 'YYYY'),

        //rincian
        keterangan: '',
        volume: 0,
        harga: 0,
        nilai: 0,
        satuan: '',
        jenis: '',
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
          '/v1/anggaran/penyusunan/pengusulan/index',
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
      this.form.notrans = val.notrans
      this.form.kodeRuangan = val.kodeRuangan
      this.form.ruangan = val.ruangan
      this.form.kodeKegiatan = val.kodeKegiatan
      this.form.kegiatan = val.kegiatan
      this.form.kodebagian = val.kodebagian
      this.form.organisasi_nama = val.organisasi_nama
      this.form.kode50 = val.kode50
      this.form.uraian = val.uraian
      this.form.kunci = val.kunci
      this.form.tglTransaksi = val.tglTransaksi
      // this.form.group = val?.groups?.toString()

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
    async kunciData(id) {
      this.loadingKunci = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/anggaran/penyusunan/penetapanpagu/kunci', payload)
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

  }
})
