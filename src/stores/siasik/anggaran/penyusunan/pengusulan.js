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
    fixed: false,
    form: {
      notrans: '',
      kodeRuangan: '',
      ruangan: '',
      kodeKegiatan: '',
      kegiatan: '',
      kodebagian: '',
      organisasi_nama: '',
      kode50: '',
      uraian: '',
      kunci: '',
      jenis: '',
      tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD'),


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
      page: 1,
      per_page: 10,
    },
    dataBarangs: [],
    dataModals: [],
    dataJasalain: [],
    akuns: [],
    kegiatans: [],
    optionkegiatan: [],


    columns: [],
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    //get Barangs
    getBarangs() {
      waitLoad('show')
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/barangrs/index', params)
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
        const resp = await api.post('v1/anggaran/penyusunan/penetapanpagu/save', this.form)

        if (resp.success === true) {
          this.form.notrans = resp?.data?.data?.notrans
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          notrans: '',
          kodeRuangan: '',
          ruangan: '',
          kodeKegiatan: '',
          kegiatan: '',
          kodebagian: '',
          organisasi_nama: '',
          kode50: '',
          uraian: '',
          kunci: '',
          tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        }
        this.getData()
        this.loadingSave = false
      } catch (error) {
        console.log(error)
        this.loadingSave = false
      }
    },
    async getData() {
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/anggaran/penyusunan/penetapanpagu/index', params)
      console.log('resp Data', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
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
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/anggaran/penyusunan/penetapanpagu/delete', payload)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          this.getData()
        }
        this.loadingDelete = false
      }
      catch (error) {
        notifErr(error)
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
    search(val) {
      this.params.q = val
      this.getData()
    },
  }
})
