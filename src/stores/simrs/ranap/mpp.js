import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useMppRanapStore = defineStore('mpp-ranap-store', {
  state: () => ({
    form: {
      usia: null,
      kognitif_rendah: false,
      resiko_tinggi: false,
      potensi_komplain: false,
      kasus_penyakit: null,
      keterbatasan_adl: false,
      pakai_alat_medis: false,
      riwayatalat_medis: '',
      riwayat_psikologis: [],
      readmisi: false,
      biaya_tinggi: false,
      pembiayaan_komplek: false,
      melebihi_los: false,
      transfer_rujukan: false,
      kerjasama_sektor: false,
      kontinuitas_pelayanan: false
    },
    items: [],
    editingId: null,
    loading: false,
    loadingHapus: false
  }),
  actions: {
    async getData(pasien) {
      this.loading = true
      try {
        const resp = await api.get(`v1/simrs/ranap/layanan/mpp/skrining/list?noreg=${pasien?.noreg}`)
        if (resp.status === 200) {
          this.items = resp.data || []
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error get data mpp', error)
      }
    },

    async simpanData(pasien) {
      this.loading = true
      const payload = {
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        skrining: this.form
      }
      if (this.editingId) {
        payload.id = this.editingId
      }
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/mpp/skrining/simpandata', payload)
        if (resp.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
          this.initReset(pasien)
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error simpan data mpp', error)
      }
    },

    async deleteData(pasien, id) {
      this.loadingHapus = true
      const payload = { id }
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/mpp/skrining/hapusdata', payload)
        if (resp.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
          if (this.editingId === id) {
            this.initReset(pasien)
          }
        }
        this.loadingHapus = false
      } catch (error) {
        this.loadingHapus = false
        console.error('error hapus data mpp', error)
      }
    },

    editData(item) {
      // Parse skrining jika masih berupa JSON string
      const data = typeof item.skrining === 'string' ? JSON.parse(item.skrining) : item.skrining
      Object.assign(this.form, data)
      this.editingId = item.id
    },

    initReset(pasien) {
      Object.assign(this.form, {
        usia: null,
        kognitif_rendah: false,
        resiko_tinggi: false,
        potensi_komplain: false,
        kasus_penyakit: null,
        keterbatasan_adl: false,
        pakai_alat_medis: false,
        riwayatalat_medis: '',
        riwayat_psikologis: [],
        readmisi: false,
        biaya_tinggi: false,
        pembiayaan_komplek: false,
        melebihi_los: false,
        transfer_rujukan: false,
        kerjasama_sektor: false,
        kontinuitas_pelayanan: false
      })
      this.editingId = null

      // Otomatisasi Centangan Usia (Kriteria 1)
      if (pasien) {
        let age = null
        if (pasien.tgllahir) {
          const birthDate = new Date(pasien.tgllahir)
          const today = new Date()
          age = today.getFullYear() - birthDate.getFullYear()
          const m = today.getMonth() - birthDate.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
        } else if (pasien.usia) {
          const match = pasien.usia.match(/^(\d+)\s*(Tahun|Thn)/i)
          if (match) {
            age = parseInt(match[1], 10)
          }
        }

        if (age !== null) {
          if (age <= 18) {
            this.form.usia = 'Anak-anak'
          } else if (age >= 60) {
            this.form.usia = 'Lansia'
          } else {
            this.form.usia = 'Dewasa'
          }
        }
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMppRanapStore, import.meta.hot))
}
