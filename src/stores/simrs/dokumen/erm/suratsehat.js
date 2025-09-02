import { defineStore, acceptHMRUpdate } from 'pinia'
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

      pendidikan: '',
      statusperkawinan: '',
      psikatopologi: '',
      kepribadian: [
        { form: 'Ketaatan Pada Peraturan', nilai: '' },
        { form: 'Kemampuan Mengendalikan Emosi', nilai: '' },
        { form: 'Kemampuan Mengatasi Permaslahan', nilai: '' },
      ],
      kecerdasan: '',

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
    },

    jenisx: [
      { value: 'SRT01', label: 'Surat Keterangan Dokter' },
      { value: 'SRT02', label: 'Surat Kesehatan Jiwa' }
    ],
    defaultJenis: 'SRT01',
    kawins: [
      { value: 'Kawin', label: 'Kawin' },
      { value: 'Belum Kawin', label: 'Belum Kawin' }
    ],

    psikatopologis: [
      { value: 'Ditemukan', label: 'Ditemukan' },
      { value: 'Tidak Ditemukan Tanda / Gejala Gangguan Jiwa yang bermakna dan dapat menganggu aktivitas kehidupan sehari-hari', label: 'Tidak Ditemukan Tanda / Gejala Gangguan Jiwa yang bermakna dan dapat menganggu aktivitas kehidupan sehari-hari' }
    ],

    penilaians: [
      { value: 'Sangat Bagus', label: 'Sangat Bagus' },
      { value: 'Bagus', label: 'Bagus' },
      { value: 'Cukup', label: 'Cukup' },
      { value: 'Kurang', label: 'Kurang' },
      { value: 'Sangat Kurang', label: 'Sangat Kurang' }
    ],



  }),
  actions: {
    async simpan(pasien) {
      this.loading = true
      // console.log('simpan', this.form);

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
      // console.log('cek pembayaran item', item);

      // this.cetakdata = item
      // this.dialog = true
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDokumenSuratSehatStore, import.meta.hot))

}
