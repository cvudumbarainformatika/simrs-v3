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

    async simpanData(pasien, customForm = null) {
      this.loading = true
      const formData = customForm ? JSON.parse(JSON.stringify(customForm)) : this.form
      const sData = formData.skrining || formData
      
      const payload = {
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        
        // 1. Skrining (Form A)
        skrining: {
          usia: sData.usia,
          kognitif_rendah: sData.kognitif_rendah,
          resiko_tinggi: sData.resiko_tinggi,
          potensi_komplain: sData.potensi_komplain,
          kasus_penyakit: sData.kasus_penyakit,
          keterbatasan_adl: sData.keterbatasan_adl,
          pakai_alat_medis: sData.pakai_alat_medis,
          riwayatalat_medis: sData.riwayatalat_medis,
          riwayat_psikologis: sData.riwayat_psikologis,
          readmisi: sData.readmisi,
          biaya_tinggi: sData.biaya_tinggi,
          pembiayaan_komplek: sData.pembiayaan_komplek,
          melebihi_los: sData.melebihi_los,
          transfer_rujukan: sData.transfer_rujukan,
          kerjasama_sektor: sData.kerjasama_sektor,
          kontinuitas_pelayanan: sData.kontinuitas_pelayanan
        },
        
        // 2. Asesmen (Form A)
        asesmen: {
          tgl_kajian: formData.tgl_kajian,
          fisik_fungsional: formData.fisik_fungsional,
          riwayat_kesehatan: formData.riwayat_kesehatan,
          psiko_sosio_kultural: formData.psiko_sosio_kultural,
          kesehatan_mental: formData.kesehatan_mental,
          dukungan_keluarga: formData.dukungan_keluarga,
          masalah_finansial: formData.masalah_finansial,
          asuransi: formData.asuransi,
          asuransi_ket: formData.asuransi_ket,
          pakai_alat_obat: formData.pakai_alat_obat,
          riwayat_trauma: formData.riwayat_trauma,
          riwayat_trauma_ket: formData.riwayat_trauma_ket,
          health_literacy: formData.health_literacy,
          health_literacy_ket: formData.health_literacy_ket,
          harapan_asuhan: formData.harapan_asuhan,
          aspek_legal: formData.aspek_legal,
          aspek_legal_ket: formData.aspek_legal_ket,
        },
        
        // 3. Identifikasi Masalah (Form B)
        identifikasi_masalah: {
          masalah: formData.masalah,
          masalah_ket: formData.masalah_ket,
        },
        
        // 4. Sasaran (Form B)
        sasaran: {
          sasaran: formData.sasaran,
          sasaran_ket: formData.sasaran_ket,
        },
        
        // 5. Perencanaan (Form B)
        perencanaan: {
          perencanaan: formData.perencanaan,
          perencanaan_ket: formData.perencanaan_ket,
          kolaborasi_unit_lain_ket: formData.kolaborasi_unit_lain_ket,
          kolaborasi_dll_ket: formData.kolaborasi_dll_ket,
        },
        
        // 6. Monitoring (Form B)
        monitoring: {
          monitoring: formData.monitoring,
          monitoring_tgl: formData.monitoring_tgl,
          monitoring_ppk_cp: formData.monitoring_ppk_cp,
          monitoring_koding: formData.monitoring_koding,
          monitoring_koding_ket: formData.monitoring_koding_ket,
        },
        
        // 7. Fasilitasi (Form B)
        fasilitasi: {
          fasilitasi: formData.fasilitasi,
          fasilitasi_tgl: formData.fasilitasi_tgl,
          fasilitasi_ket: formData.fasilitasi_ket,
        },
        
        // 8. Advokasi (Form B)
        advokasi: {
          advokasi: formData.advokasi,
          advokasi_tgl: formData.advokasi_tgl,
        },
        
        // 9. Hasil Pelayanan (Form B)
        hasil_pelayanan: {
          hasil: formData.hasil,
          hasil_ket: formData.hasil_ket,
          level_hasil: formData.level_hasil,
        },
        
        // 10. Terminasi (Form B)
        terminasi: {
          terminasi: formData.terminasi,
          terminasi_tgl: formData.terminasi_tgl,
          cara_pulang_val: formData.cara_pulang_val,
          cara_pulang_ket: formData.cara_pulang_ket,
          cara_pulang_tgl: formData.cara_pulang_tgl,
          cara_pulang_jam: formData.cara_pulang_jam,
        }
      }

      if (this.editingId) {
        payload.id = this.editingId
      }
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/mpp/skrining/simpandata', payload)
        if (resp.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
          // Jangan reset form setelah simpan karena ini update data tunggal secara berkelanjutan
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
      const cleanSkrining = {}
      if (data && typeof data === 'object') {
        Object.keys(data).forEach(key => {
          const val = data[key]
          if (val === 1 || val === '1' || val === true || val === 'true') {
            cleanSkrining[key] = true
          } else if (val === 0 || val === '0' || val === false || val === 'false') {
            cleanSkrining[key] = false
          } else {
            cleanSkrining[key] = val
          }
        })
      }
      Object.assign(this.form, cleanSkrining)
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
