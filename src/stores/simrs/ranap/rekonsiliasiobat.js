import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
import { notifSuccess } from 'src/modules/utils'

export const useRekonsiliasiObatStore = defineStore('rekonsiliasi-obat-store', {
  state: () => ({
    form: {
      id: null,
      noreg: null,
      norm: null,
      tipe: 'mrs',
      nama_obat: '',
      dosis: '',
      lama_pakai: '',
      dibawa_saat_mrs: 'Ya',
      break: '',
      berlanjut_ke_ranap: 'Ya',
      berlanjut_saat_krs: 'Ya',
      frekuensi: '',
      cara_pemberian: '',
      waktu_pemberian_terakhir: '',
      tindak_lanjut: 'Lanjut aturan pakai sama',
      perubahan_aturan_pakai: '',
      aturan_pakai: '',
      rekonsiliasi: 'Lanjut aturan pakai sama',
      aturan_pakai_saat_pulang: '',
      kdruang: null
    },
    formPersetujuan: {
      id: null,
      noreg: null,
      norm: null,
      pernyataan_nama: '',
      pernyataan_tgl_lahir: '',
      pernyataan_alamat: '',
      pernyataan_hubungan: 'Diri sendiri',
      pasien_nama: '',
      pasien_tgl_lahir: '',
      pasien_norm: '',
      pasien_alamat: '',
      ttd_yang_menyatakan: null,
      ttd_saksi: null,
      ttd_saksi_2: null,
      kdruang: null
    },
    loadingOrder: false,
    loadingHapus: false,
    loadingPersetujuan: false,
    
    // dropdown options
    yaTidaks: ['Ya', 'Tidak'],
    tindakLanjuts: ['Lanjut aturan pakai sama', 'Lanjut aturan pakai berubah', 'Stop'],
    rekonsiliasis: ['Lanjut aturan pakai sama', 'Lanjut aturan pakai berubah', 'Stop'],
    tipes: [
      { value: 'mrs', label: 'Penggunaan Obat Sebelum MRS' },
      { value: 'persetujuan', label: 'Persetujuan Sentralisasi' },
      { value: 'pindah', label: 'Rekonsiliasi Saat Pindah Ruangan' },
      { value: 'krs', label: 'Rekonsiliasi Saat Pulang (Discharge)' }
    ]
  }),
  actions: {
    initReset() {
      this.form.id = null
      this.form.nama_obat = ''
      this.form.dosis = ''
      this.form.lama_pakai = ''
      this.form.dibawa_saat_mrs = 'Ya'
      this.form.berlanjut_ke_ranap = 'Ya'
      this.form.berlanjut_saat_krs = 'Ya'
      this.form.frekuensi = ''
      this.form.cara_pemberian = ''
      this.form.waktu_pemberian_terakhir = ''
      this.form.tindak_lanjut = 'Lanjut aturan pakai sama'
      this.form.perubahan_aturan_pakai = ''
      this.form.aturan_pakai = ''
      this.form.rekonsiliasi = 'Lanjut aturan pakai sama'
      this.form.aturan_pakai_saat_pulang = ''
    },

    initFormPersetujuan(pasien) {
      this.formPersetujuan.noreg = pasien?.noreg
      this.formPersetujuan.norm = pasien?.norm
      this.formPersetujuan.pasien_nama = pasien?.nama || ''
      this.formPersetujuan.pasien_tgl_lahir = pasien?.tgllahir || ''
      this.formPersetujuan.pasien_norm = pasien?.norm || ''
      this.formPersetujuan.pasien_alamat = pasien?.alamat || ''

      const exist = pasien?.rekonsiliasi_obat_persetujuan ?? null
      if (exist) {
        this.formPersetujuan.id = exist.id
        this.formPersetujuan.pernyataan_nama = exist.pernyataan_nama || ''
        this.formPersetujuan.pernyataan_tgl_lahir = exist.pernyataan_tgl_lahir || ''
        this.formPersetujuan.pernyataan_alamat = exist.pernyataan_alamat || ''
        this.formPersetujuan.pernyataan_hubungan = exist.pernyataan_hubungan || 'Diri sendiri'
        this.formPersetujuan.ttd_yang_menyatakan = exist.ttd_yang_menyatakan || null
        this.formPersetujuan.ttd_saksi = exist.ttd_saksi || null
        this.formPersetujuan.ttd_saksi_2 = exist.ttd_saksi_2 || null
      } else {
        this.formPersetujuan.id = null
        this.formPersetujuan.pernyataan_nama = ''
        this.formPersetujuan.pernyataan_tgl_lahir = ''
        this.formPersetujuan.pernyataan_alamat = ''
        this.formPersetujuan.pernyataan_hubungan = 'Diri sendiri'
        this.formPersetujuan.ttd_yang_menyatakan = null
        this.formPersetujuan.ttd_saksi = null
        this.formPersetujuan.ttd_saksi_2 = null
      }
    },
    
    async simpandata(pasien) {
      this.loadingOrder = true
      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.kdruang = pasien?.kdruangan

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/rekonsiliasiobat/simpandata', this.form)
        if (resp.status === 200) {
          const storeRanap = usePengunjungRanapStore()
          const isi = resp?.data?.result
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'rekonsiliasiobats')
          notifSuccess(resp)
          this.initReset()
        }
        this.loadingOrder = false
      } catch (error) {
        this.loadingOrder = false
      }
    },

    async hapusdata(pasien, id) {
      this.loadingHapus = true
      const payload = { id }
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/rekonsiliasiobat/hapusdata', payload)
        if (resp.status === 200) {
          const storeRanap = usePengunjungRanapStore()
          storeRanap.hapusDataInjectan(pasien?.noreg, id, 'rekonsiliasiobats')
          notifSuccess(resp)
        }
        this.loadingHapus = false
      } catch (error) {
        this.loadingHapus = false
      }
    },

    async simpanpersetujuan(pasien) {
      this.loadingPersetujuan = true
      this.formPersetujuan.noreg = pasien?.noreg
      this.formPersetujuan.norm = pasien?.norm
      this.formPersetujuan.kdruang = pasien?.kdruangan

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/rekonsiliasiobat/simpanpersetujuan', this.formPersetujuan)
        if (resp.status === 200) {
          const storeRanap = usePengunjungRanapStore()
          const isi = resp?.data?.result
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'rekonsiliasi_obat_persetujuan')
          notifSuccess(resp)
        }
        this.loadingPersetujuan = false
      } catch (error) {
        this.loadingPersetujuan = false
      }
    },

    async hapuspersetujuan(pasien, id) {
      this.loadingPersetujuan = true
      const payload = { id }
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/rekonsiliasiobat/hapuspersetujuan', payload)
        if (resp.status === 200) {
          const storeRanap = usePengunjungRanapStore()
          storeRanap.injectDataPasien(pasien?.noreg, null, 'rekonsiliasi_obat_persetujuan')
          notifSuccess(resp)
          this.initFormPersetujuan(pasien)
        }
        this.loadingPersetujuan = false
      } catch (error) {
        this.loadingPersetujuan = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRekonsiliasiObatStore, import.meta.hot))
}
