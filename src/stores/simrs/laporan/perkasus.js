import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import * as XLSX from 'xlsx'

export const useLaporanPerkasusStore = defineStore('laporan-perkasus-store', {
  state: () => {
    const now = new Date()
    const currentYear = String(now.getFullYear())

    return {
      loading: false,
      loadingMaster: false,
      loadingExport: false,
      items: [],
      total: 0,
      meta: null,

      masterDiagnosa: [],
      optionsDiagnosa: [],

      params: {
        tahun: currentYear,
        bulan: 'ALL',
        kd_diagnosa: [],
        q: ''
      },

      months: [
        { label: 'Semua Bulan (ALL)', value: 'ALL' },
        { label: 'Januari', value: '1' },
        { label: 'Februari', value: '2' },
        { label: 'Maret', value: '3' },
        { label: 'April', value: '4' },
        { label: 'Mei', value: '5' },
        { label: 'Juni', value: '6' },
        { label: 'Juli', value: '7' },
        { label: 'Agustus', value: '8' },
        { label: 'September', value: '9' },
        { label: 'Oktober', value: '10' },
        { label: 'November', value: '11' },
        { label: 'Desember', value: '12' }
      ],

      years: Array.from({ length: 7 }, (_, i) => {
        const y = now.getFullYear() - 4 + i
        return { label: String(y), value: String(y) }
      })
    }
  },

  getters: {
    selectedDiagnosaLabels: (state) => {
      if (!state.params.kd_diagnosa || state.params.kd_diagnosa.length === 0) {
        return 'Semua / Belum Dipilih'
      }
      return state.params.kd_diagnosa.join(', ')
    }
  },

  actions: {
    async fetchMasterDiagnosa() {
      if (this.masterDiagnosa.length > 0) return
      this.loadingMaster = true
      try {
        const resp = await api.get('v1/simrs/pelayanan/listdiagnosa')
        if (resp && resp.status === 200 && Array.isArray(resp.data)) {
          const list = resp.data.map(d => ({
            kode: String(d.kode || d.rs1 || d.kddiagnosa || d.code || '').trim(),
            keterangan: String(d.keterangan || d.rs4 || d.nama || d.description || '').trim()
          })).filter(d => d.kode !== '')

          this.masterDiagnosa = list
          this.optionsDiagnosa = list.slice(0, 50)
        }
      } catch (error) {
        console.error('Error fetching master diagnosa:', error)
      } finally {
        this.loadingMaster = false
      }
    },

    filterDiagnosaFn(val, update) {
      if (!val || val.trim() === '') {
        update(() => {
          this.optionsDiagnosa = this.masterDiagnosa.slice(0, 50)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase().trim()

        // Smart Alias: Jika pengguna mengetik angka 1 di awal (contoh: 163), buatkan alias dengan huruf 'i' (contoh: i63)
        let altNeedle = null
        if (/^1\d/.test(needle)) {
          altNeedle = 'i' + needle.substring(1)
        } else if (/^i\d/.test(needle)) {
          altNeedle = '1' + needle.substring(1)
        }

        this.optionsDiagnosa = this.masterDiagnosa
          .filter(item => {
            const k = (item.kode || '').toLowerCase()
            const desc = (item.keterangan || '').toLowerCase()

            const matchKode = k.includes(needle) || (altNeedle && k.includes(altNeedle))
            const matchDesc = desc.includes(needle) || (altNeedle && desc.includes(altNeedle))

            return matchKode || matchDesc
          })
          .slice(0, 100)
      })
    },

    async getData() {
      if (!this.params.kd_diagnosa || (Array.isArray(this.params.kd_diagnosa) && this.params.kd_diagnosa.length === 0)) {
        return false
      }
      this.loading = true
      try {
        const payload = {
          tahun: this.params.tahun,
          bulan: this.params.bulan,
          kd_diagnosa: Array.isArray(this.params.kd_diagnosa)
            ? this.params.kd_diagnosa.join(',')
            : this.params.kd_diagnosa,
          q: this.params.q
        }

        const resp = await api.get('v1/simrs/laporan/rekammdeik/perkasus', { params: payload })

        if (resp && resp.status === 200) {
          const resData = resp.data
          if (resData && Array.isArray(resData.data)) {
            this.items = resData.data
            this.total = Math.max(resData.data.length, typeof resData.total === 'number' ? resData.total : 0)
            this.meta = resData.meta || resData.pagination || null
          } else if (Array.isArray(resData)) {
            this.items = resData
            this.total = resData.length
            this.meta = null
          } else {
            this.items = []
            this.total = 0
            this.meta = null
          }
        } else {
          this.items = []
          this.total = 0
        }
      } catch (error) {
        console.error('Error fetching laporan perkasus:', error)
        this.items = []
      } finally {
        this.loading = false
      }
    },

    setTahun(val) {
      this.params.tahun = val
    },

    setBulan(val) {
      this.params.bulan = val
    },

    setKdDiagnosa(val) {
      this.params.kd_diagnosa = val
    },

    setFilter(val) {
      this.params.q = val
    },

    searchData() {
      return this.getData()
    },

    refresh() {
      return this.getData()
    },

    async exportToExcel() {
      if (!this.params.kd_diagnosa || (Array.isArray(this.params.kd_diagnosa) && this.params.kd_diagnosa.length === 0)) {
        return false
      }
      this.loadingExport = true
      try {
        const payload = {
          tahun: this.params.tahun,
          bulan: this.params.bulan,
          kd_diagnosa: Array.isArray(this.params.kd_diagnosa)
            ? this.params.kd_diagnosa.join(',')
            : this.params.kd_diagnosa,
          q: this.params.q,
          limit: 'all'
        }

        const resp = await api.get('v1/simrs/laporan/rekammdeik/perkasus', { params: payload })
        const exportData = (resp && resp.status === 200 && Array.isArray(resp.data)) ? resp.data : this.items

        const rows = [
          ['LAPORAN PASIEN PER KASUS (RAWAT INAP)'],
          [`Tahun: ${this.params.tahun}`, `Bulan: ${this.params.bulan}`, `Filter Kode ICD: ${this.selectedDiagnosaLabels}`],
          [''],
          [
            'NO',
            'TGL MASUK IGD',
            'MRS',
            'KRS',
            'LOS (HARI)',
            'NOREG',
            'NORM',
            'NIK',
            'NAMA PASIEN',
            'ALAMAT',
            'KELAMIN',
            'USIA',
            'RUANG',
            'DPJP',
            'SISTEM BAYAR',
            'CARA KELUAR',
            'KODE DIAGNOSA',
            'DIAGNOSA UTAMA',
            'ANAMNESE AWAL',
            'RIWAYAT PENYAKIT SEKARANG (RPS)',
            'DIAGNOSA TAMBAHAN',
            'MEMO DIAGNOSA'
          ]
        ]

        exportData.forEach((item, idx) => {
          rows.push([
            idx + 1,
            item.tgl_masuk_igd || item.tgl_igd || '-',
            item.mrs || item.tgl_mrs || item.tgl_masuk || '-',
            item.krs || item.tgl_krs || item.tgl_keluar || '-',
            item.los || item.lama_dirawat || '-',
            item.noreg || item.no_reg || '-',
            item.norm || item.no_rm || '-',
            item.nik || '-',
            item.nama || item.nama_pasien || '-',
            item.alamat || '-',
            item.kelamin || item.jk || '-',
            item.usia || item.umur || '-',
            item.ruang || item.ruangan || '-',
            item.dpjp || item.dokter || '-',
            item.sistem_bayar || item.penjamin || '-',
            item.cara_keluar || item.carakeluar || '-',
            item.kode_diagnosa || item.kddiagnosa || item.icd10 || '-',
            item.diagnosa || item.diagnosa_utama || '-',
            item.anamnese_awal || item.keluhan_utama || item.anamnesis || '-',
            item.riwayat_penyakit_sekarang || item.rps || '-',
            item.diagnosa_tambahan || item.diag_sekunder || '-',
            item.memodiagnosa || item.memo_diagnosa || '-'
          ])
        })

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(rows)
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan Per Kasus')

        const filename = `Laporan_Per_Kasus_${this.params.tahun}_${Date.now()}.xlsx`
        XLSX.writeFile(wb, filename)
      } catch (err) {
        console.error('Failed to export excel:', err)
      } finally {
        this.loadingExport = false
      }
    }
  }
})
