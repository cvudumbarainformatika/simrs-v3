import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'boot/axios'
import * as XLSX from 'xlsx'

export const useLaporanRadiologiStore = defineStore('laporan_radiologi', {
  state: () => ({
    loading: false,
    loadingDownload: false,
    loadingDokter: false,

    // Parameter Filter
    params: {
      from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      dokter: 'ALL',
      jenis_pasien: 'ALL', // ALL, Rajal, Ranap, IGD
      q: ''
    },

    // Selected Tab
    activeTab: 'global', // 'global', 'dokter', 'detail'

    // Master Dokter
    dokters: [
      { kode: 'ALL', nama: 'Semua Dokter' }
    ],

    // Raw Items dari API / Mock
    rawData: [],

    // Processed Data
    summary: {
      totalPasien: 0,
      totalTindakan: 0,
      totalRajal: 0,
      totalRanap: 0,
      totalIgd: 0,
      totalDokter: 0
    },

    rekapGlobal: [],   // [{ kode, nama, jlhPasien, jlhTindakan, persentase }]
    rekapDokter: [],   // [{ kodedokter, nama, jlhPasien, jlhTindakan, detailTindakan: [] }]
    detailItems: [],   // [{ noreg, norm, nama, jenisPasien, dokter, ruangan, tgl, namaTindakan, status }]
  }),

  getters: {
    formattedFrom: (state) => date.formatDate(state.params.from, 'DD MMMM YYYY'),
    formattedTo: (state) => date.formatDate(state.params.to, 'DD MMMM YYYY'),
  },

  actions: {
    setPeriode(period) {
      this.params.from = period.from
      this.params.to = period.to
      this.getData()
    },

    setDokter(kodedokter) {
      this.params.dokter = kodedokter
      this.processCalculations()
    },

    setJenisPasien(jenis) {
      this.params.jenis_pasien = jenis
      this.processCalculations()
    },

    setSearch(q) {
      this.params.q = q
      this.processCalculations()
    },

    async fetchMasterDokter() {
      this.loadingDokter = true
      try {
        const resp = await api.get('/v1/simrs/radiologi/radiologi/masterdokter').catch(() => null)
        if (resp && resp.status === 200 && Array.isArray(resp.data)) {
          this.dokters = [
            { kode: 'ALL', nama: 'Semua Dokter' },
            ...resp.data.map(d => ({
              kode: d.kdpegsimrs || d.kode || d.id,
              nama: d.nama || d.nama_dokter
            }))
          ]
        } else {
          // Fallback master dokter dummy jika backend belum tersedia
          this.dokters = [
            { kode: 'ALL', nama: 'Semua Dokter' },
            { kode: 'DOK001', nama: 'dr. Ahmad Dahlan, Sp.Rad' },
            { kode: 'DOK002', nama: 'dr. Siti Rahma, Sp.Rad' },
            { kode: 'DOK003', nama: 'dr. Budi Santoso, Sp.Rad' },
            { kode: 'DOK004', nama: 'dr. Maya Kartika, Sp.PD' }
          ]
        }
      } catch (err) {
        console.warn('Error fetching master dokter:', err)
      } finally {
        this.loadingDokter = false
      }
    },

    async getData() {
      this.loading = true
      try {
        const resp = await api.get('/v1/simrs/radiologi/radiologi/laporanradiologi', {
          params: this.params
        }).catch(() => null)

        if (resp && resp.status === 200 && Array.isArray(resp.data?.data)) {
          this.rawData = resp.data.data
        } else {
          // Mock data lengkap jika backend API belum dihubungkan
          this.rawData = this.generateMockData()
        }

        this.processCalculations()
      } catch (error) {
        console.error('Error fetching laporan radiologi:', error)
        this.rawData = this.generateMockData()
        this.processCalculations()
      } finally {
        this.loading = false
      }
    },

    // Algoritma Pengolahan Data Kencang & Optimal
    processCalculations() {
      const qLower = (this.params.q || '').trim().toLowerCase()
      const dokterFilter = this.params.dokter
      const jenisFilter = this.params.jenis_pasien

      // Filter Data Awal
      const filtered = this.rawData.filter(item => {
        if (dokterFilter !== 'ALL' && item.kodedokter !== dokterFilter) return false
        if (jenisFilter !== 'ALL' && item.jenisPasien !== jenisFilter) return false
        if (qLower !== '') {
          const matchName = item.namaPasien?.toLowerCase().includes(qLower)
          const matchNorm = item.norm?.toLowerCase().includes(qLower)
          const matchNoreg = item.noreg?.toLowerCase().includes(qLower)
          const matchTindakan = item.namaTindakan?.toLowerCase().includes(qLower)
          const matchDokter = item.namaDokter?.toLowerCase().includes(qLower)
          if (!matchName && !matchNorm && !matchNoreg && !matchTindakan && !matchDokter) return false
        }
        return true
      })

      this.detailItems = filtered

      // 1. Rekap Pasien Unik & Jenis Pasien
      const uniquePasienMap = new Map()
      let totalRajal = 0
      let totalRanap = 0
      let totalIgd = 0

      filtered.forEach(item => {
        const pasienKey = item.noreg || item.norm || item.id
        if (!uniquePasienMap.has(pasienKey)) {
          uniquePasienMap.set(pasienKey, item)
          if (item.jenisPasien === 'Rajal') totalRajal++
          else if (item.jenisPasien === 'Ranap') totalRanap++
          else if (item.jenisPasien === 'IGD') totalIgd++
        }
      })

      const totalPasien = uniquePasienMap.size
      const totalTindakan = filtered.length

      // 2. Rekap Global per Tindakan
      const mapGlobal = new Map()
      filtered.forEach(item => {
        const key = item.kodeTindakan || item.namaTindakan
        if (!mapGlobal.has(key)) {
          mapGlobal.set(key, {
            kode: item.kodeTindakan || '-',
            nama: item.namaTindakan,
            pasiens: new Set(),
            jlhTindakan: 0
          })
        }
        const record = mapGlobal.get(key)
        record.pasiens.add(item.noreg || item.norm)
        record.jlhTindakan++
      })

      const rekapGlobalArr = []
      mapGlobal.forEach((val) => {
        const jlhPasien = val.pasiens.size
        const persentase = totalTindakan > 0 ? ((val.jlhTindakan / totalTindakan) * 100).toFixed(1) : 0
        rekapGlobalArr.push({
          kode: val.kode,
          nama: val.nama,
          jlhPasien,
          jlhTindakan: val.jlhTindakan,
          persentase: Number(persentase)
        })
      })
      rekapGlobalArr.sort((a, b) => b.jlhTindakan - a.jlhTindakan)
      this.rekapGlobal = rekapGlobalArr

      // 3. Rekap Per Dokter
      const mapDokter = new Map()
      filtered.forEach(item => {
        const docKey = item.kodedokter || item.namaDokter
        if (!mapDokter.has(docKey)) {
          mapDokter.set(docKey, {
            kodedokter: docKey,
            nama: item.namaDokter || 'Tanpa Dokter',
            pasiens: new Set(),
            jlhTindakan: 0,
            tindakanMap: new Map()
          })
        }
        const docRecord = mapDokter.get(docKey)
        docRecord.pasiens.add(item.noreg || item.norm)
        docRecord.jlhTindakan++

        const tndKey = item.namaTindakan
        if (!docRecord.tindakanMap.has(tndKey)) {
          docRecord.tindakanMap.set(tndKey, 0)
        }
        docRecord.tindakanMap.set(tndKey, docRecord.tindakanMap.get(tndKey) + 1)
      })

      const rekapDokterArr = []
      mapDokter.forEach(val => {
        const detailTindakan = []
        val.tindakanMap.forEach((jumlah, namaTindakan) => {
          detailTindakan.push({ namaTindakan, jumlah })
        })
        detailTindakan.sort((a, b) => b.jumlah - a.jumlah)

        rekapDokterArr.push({
          kodedokter: val.kodedokter,
          nama: val.nama,
          jlhPasien: val.pasiens.size,
          jlhTindakan: val.jlhTindakan,
          detailTindakan
        })
      })
      rekapDokterArr.sort((a, b) => b.jlhTindakan - a.jlhTindakan)
      this.rekapDokter = rekapDokterArr

      // 4. Update Summary
      this.summary = {
        totalPasien,
        totalTindakan,
        totalRajal,
        totalRanap,
        totalIgd,
        totalDokter: rekapDokterArr.length
      }
    },

    // Export Excel (.xlsx) dengan Multiple Sheets
    async exportToExcel() {
      this.loadingDownload = true
      try {
        const wb = XLSX.utils.book_new()

        // Sheet 1: Ringkasan & Rekap Global
        const globalRows = [
          ['LAPORAN REKAPITULASI RADIOLOGI GLOBAL'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['RINGKASAN UTAMA'],
          ['Total Pasien Unik', this.summary.totalPasien],
          ['Total Tindakan Radiologi', this.summary.totalTindakan],
          ['Pasien Rawat Jalan', this.summary.totalRajal],
          ['Pasien Rawat Inap', this.summary.totalRanap],
          ['Pasien IGD', this.summary.totalIgd],
          ['Total Dokter DPJP/Pemeriksa', this.summary.totalDokter],
          [''],
          ['REKAPITULASI TINDAKAN RADIOLOGI GLOBAL'],
          ['NO', 'KODE TINDAKAN', 'NAMA TINDAKAN / PEMERIKSAAN', 'JUMLAH PASIEN', 'JUMLAH TINDAKAN', 'KONTRIBUSI (%)']
        ]

        this.rekapGlobal.forEach((g, idx) => {
          globalRows.push([
            idx + 1,
            g.kode,
            g.nama,
            g.jlhPasien,
            g.jlhTindakan,
            `${g.persentase}%`
          ])
        })

        const wsGlobal = XLSX.utils.aoa_to_sheet(globalRows)
        XLSX.utils.book_append_sheet(wb, wsGlobal, 'Rekap Global')

        // Sheet 2: Rekap Per Dokter
        const dokterRows = [
          ['LAPORAN REKAPITULASI RADIOLOGI PER DOKTER'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['NO', 'KODE DOKTER', 'NAMA DOKTER', 'JUMLAH PASIEN', 'JUMLAH TINDAKAN']
        ]

        this.rekapDokter.forEach((d, idx) => {
          dokterRows.push([
            idx + 1,
            d.kodedokter,
            d.nama,
            d.jlhPasien,
            d.jlhTindakan
          ])
        })

        const wsDokter = XLSX.utils.aoa_to_sheet(dokterRows)
        XLSX.utils.book_append_sheet(wb, wsDokter, 'Rekap Per Dokter')

        // Sheet 3: Detail Pasien Transaksi
        const detailRows = [
          ['DETAIL TRANSAKSI PASIEN RADIOLOGI'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['NO', 'NO REG', 'NO RM', 'NAMA PASIEN', 'JENIS PASIEN', 'RUANGAN / POLI', 'DOKTER', 'TINDAKAN RADIOLOGI', 'TANGGAL', 'STATUS']
        ]

        this.detailItems.forEach((item, idx) => {
          detailRows.push([
            idx + 1,
            item.noreg,
            item.norm,
            item.namaPasien,
            item.jenisPasien,
            item.ruangan,
            item.namaDokter,
            item.namaTindakan,
            item.tgl,
            item.status
          ])
        })

        const wsDetail = XLSX.utils.aoa_to_sheet(detailRows)
        XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail Pasien')

        const filename = `Laporan_Radiologi_${date.formatDate(this.params.from, 'YYYYMMDD')}_${date.formatDate(this.params.to, 'YYYYMMDD')}.xlsx`
        XLSX.writeFile(wb, filename)
      } catch (error) {
        console.error('Export Excel failed:', error)
      } finally {
        this.loadingDownload = false
      }
    },

    // Generation Mock Data untuk Pengetesan Frontend Independen
    generateMockData() {
      const doctors = [
        { code: 'DOK001', name: 'dr. Ahmad Dahlan, Sp.Rad' },
        { code: 'DOK002', name: 'dr. Siti Rahma, Sp.Rad' },
        { code: 'DOK003', name: 'dr. Budi Santoso, Sp.Rad' },
        { code: 'DOK004', name: 'dr. Maya Kartika, Sp.PD' }
      ]

      const procedures = [
        { code: 'RAD001', name: 'Thorax PA/AP' },
        { code: 'RAD002', name: 'CT Scan Kepala Non-Kontras' },
        { code: 'RAD003', name: 'USG Abdomen Upper-Lower' },
        { code: 'RAD004', name: 'Foto Polos Abdomen (BNO)' },
        { code: 'RAD005', name: 'MRI Lumbosakral' },
        { code: 'RAD006', name: 'Echocardiography' },
        { code: 'RAD007', name: 'Panoramic Dental' }
      ]

      const patientTypes = ['Rajal', 'Ranap', 'IGD']
      const rooms = ['Poli Dalam', 'Poli Bedah', 'Poli Anak', 'Ruang Ranap Teratai', 'Ruang Ranap Mawar', 'IGD Utama']
      const mockList = []

      const baseDate = this.params.from || date.formatDate(Date.now(), 'YYYY-MM-DD')

      for (let i = 1; i <= 45; i++) {
        const doc = doctors[i % doctors.length]
        const proc = procedures[i % procedures.length]
        const pType = patientTypes[i % patientTypes.length]
        const room = rooms[i % rooms.length]

        mockList.push({
          id: `RAD-TX-${1000 + i}`,
          noreg: `REG/2026/08/${String(100 + i)}`,
          norm: `RM-${String(20000 + i)}`,
          namaPasien: `Pasien Sample ${i}`,
          jenisPasien: pType,
          kodedokter: doc.code,
          namaDokter: doc.name,
          ruangan: room,
          kodeTindakan: proc.code,
          namaTindakan: proc.name,
          tgl: baseDate,
          status: i % 5 === 0 ? 'Selesai' : (i % 3 === 0 ? 'Proses' : 'Selesai')
        })
      }

      return mockList
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanRadiologiStore, import.meta.hot))
}
