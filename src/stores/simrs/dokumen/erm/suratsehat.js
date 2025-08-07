import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungPoliStore } from '../../pelayanan/poli/pengunjung'
import { notifErr, notifSuccess } from 'src/modules/utils'
export const useDokumenSuratSehatStore = defineStore('dokumen_suratsehat_new', {
  state: () => ({
    loading: false,
    // loadinghapus: false,
    dialog: false,
    cetakdata: '',
    items: [],
    item: {},
    meta: {},
    form: {
      nomorSurat: '',
      noreg: '',
      norm: '',
      pekerjaan: '',
      keperluan: '',
      doc: '',
      penglihatankiri: '',
      penglihatankanan: '',
      pendengarankiri: '',
      pendengarankanan: '',
      warna: '',
      tinggi: '',
      berat: '',
      golDar: '',
      kdsurat: '',
      dokter: '',
    }
  }),
  actions: {
    async simpan(pasien) {
      this.loading = true
      //  const param = { params: this.form }
      try {
        const resp = await api.post('v1/simrs/dokumen/rajal/skdsimpan', this.form)
        if (resp.status === 200) {
          // console.log('simpan anamnesis', resp)
          const storePasien = usePengunjungPoliStore()
          const isi = resp.data.result
          storePasien.injectDataPasien(pasien, isi, 'suratketerangandokter')
          notifSuccess(resp)
          this.initReset()
          this.loading = false
        }
        this.loading = false
      }
      catch (error) {
        // console.log('anamnesis err', error)
        this.loading = false
        notifErr(error)
      }
    },
    initReset() {
      this.form = {
        nomorSurat: '',
        noreg: '',
        norm: '',
        pekerjaan: '',
        keperluan: '',
        doc: '',
        penglihatankiri: '',
        penglihatankanan: '',
        pendengarankiri: '',
        pendengarankanan: '',
        warna: '',
        tinggi: '',
        berat: '',
        golDar: '',
        kdsurat: '',
        dokter: '',
      }
    },
    async batalsurat(pasien, item) {
      item.loadinghapus = true
      try {
        const resp = await api.post('v1/simrs/dokumen/rajal/skdbatal', item)
        if (resp.status === 200) {
          notifSuccess(resp)
          item.loadinghapus = false
          const storePasien = usePengunjungPoliStore()
          const isi = resp.data.result
          storePasien.injectDataPasien(pasien, isi, 'suratketerangandokter')
          notifSuccess(resp)
        }
      }
      catch (error) {
        notifErr(error)
        item.loadinghapus = false
      }
    },
    async cekpembayaran(pasien, item) {

      item.cetak = true
      const sistembayar = pasien?.kodesistembayar
      const tindakan_id = item.tindakan_id
      const params = { tindakan_id: tindakan_id, sistembayar: sistembayar }
      try {
        const resp = await api.post('v1/simrs/dokumen/rajal/cekpembayaran', params)
        if (resp.status === 200) {
          this.cetakdata = item
          this.dialog = true
          item.cetak = false
        }
      }
      catch (error) {
        notifErr(error)
        item.cetak = false
      }
    }
  }
})
