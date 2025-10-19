import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifSuccess } from "src/modules/utils";
import { useUnitPengelolahArsipStore } from "./arsip";
import { date } from "quasar";
import { useAppStore } from "src/stores/app";

export const useUnitPengelolaharsippeminjamanStore = defineStore('unit-pengelolah-arsip-peminjaman-store', {
  state: () => ({
    itemspegawai: [],
    tab: 'formpeminjamandokumen',
    tabs: [
      { name: 'form', page: 'formpeminjamandokumen' },
      { name: 'List', page: 'listpeminjamandokumen' },
    ],
    items: [],
    itemspeminjaman: [],
    meta: null,
    loading: false,
    loadinglist: false,
    loadingpegawai: false,
    dialog: false,
    dialogkembali: false,
    loadingForm: false,
    params: {
      bidangbagian: '',
      kodekelasifikasi: '',
      deskripsi: '',
      noarsip: ''
    },
    form: {
      nopeminjaman: '',
      peminjam: '',
      unitpengolah: useAppStore?.user?.pegawai?.kdarteri,
      tanggal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      rencanakembali: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      keterangan: '',
      rincian: []
    },
    formkembali: {
      nopeminjaman: '',
      noarsip: '',
      keterangan: ''
    },
    paramslist: {
      q: '',
      bidangbagian: '',
      page: 1,
      per_page: 10
    },
    tanggal: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    rencanakembali: date.formatDate(Date.now(), 'DD MMMM YYYY')
  }),
  actions: {
    async getCariData() {
      this.items = []
      this.loading = true
      const params = { params: this.params }
      await api.get('v1/simrs/unitpengelolaharsip/peminjaman/cari-arsip', params)
        .then(resp => {
          this.items = resp?.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async getDataorganisasi() {
      await api.get('v1/simrs/master/listorganisasi')
        .then(resp => {
          this.itemsorganisasi = resp?.data
        })
        .catch(() => { })
    },
    async getdatacabinet() {
      await api.get('v1/simrs/master/listcabinet')
        .then(resp => {
          this.itemscabinet = resp?.data
        })
        .catch(() => { })
    },
    saveData() {
      this.loadingForm = true
      return new Promise(resolve => {
        api.post('v1/simrs/unitpengelolaharsip/peminjaman/simpan-pinjaman', this.form)
          .then(resp => {
            const updatedItem = resp?.data?.result
            const index = this.items.findIndex(item => item.id === updatedItem.id)
            this.items[index] = updatedItem
            this.initreset()
            notifSuccess(resp)
            this.loadingForm = false
            resolve(resp)
          })
          .catch(() => {
            this.initreset()
            this.loadingForm = false
          })
      })
    },
    initreset() {
      this.form.nopeminjaman = ''
      this.form.peminjam = ''
      this.form.tanggal = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.form.keterangan = ''
      this.form.rincian = []
      this.dialog = false
    },
    getdatapegawai() {
      this.loadingpegawai = true
      return new Promise(resolve => {
        api.get('v1/simrs/unitpengelolaharsip/peminjaman/data-pegawai')
          .then(resp => {
            this.itemspegawai = resp?.data
            this.loadingpegawai = false
            resolve(resp)
          })
          .catch(() => {
            this.loadingpegawai = false
          })
      })
    },
    async getListPeminjaman() {
      this.loadinglist = true
      const params = { params: this.paramslist }
      await api.get('v1/simrs/unitpengelolaharsip/peminjaman/list-peminjaman', params)
        .then(resp => {
          this.itemspeminjaman = resp?.data?.data
          this.meta = resp?.data
          console.log('itemspeminjaman', this.itemspeminjaman)
          this.loadinglist = false
        })
        .catch(() => { this.loadinglist = false })
    },
    saveDataKembali() {
      this.loadingForm = true
      return new Promise(resolve => {
        api.post('v1/simrs/unitpengelolaharsip/peminjaman/simpan-kembali', this.formkembali)
          .then(resp => {
            const updatedItem = resp?.data?.result
            const index = this.items.findIndex(item => item.id === updatedItem.id)
            this.items[index] = updatedItem
            this.initresetkembali()
            notifSuccess(resp)
            this.loadingForm = false
            resolve(resp)
          })
          .catch(() => {
            this.initresetkembali()
            this.loadingForm = false
          })
      })
    },
    initresetkembali() {
      this.formkembali.nopeminjaman = ''
      this.formkembali.keterangan = ''
      this.dialogkembali = false
    }
  }
})
