import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'boot/axios'
import * as XLSX from 'xlsx'
import { dateDbFormat } from 'src/modules/formatter'

export const useLaporanRadiologiStore = defineStore('laporan_radiologi', {
  state: () => ({
    loading: false,
    loadingDownload: false,
    loadingDokter: false,

    header: {
      periode: 'Bulan ini'
    },
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Tahun ini', 'Custom'],

    // Parameter Filter
    params: {
      from: date.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'YYYY-MM-DD'),
      to: date.formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'YYYY-MM-DD'),
      dokter: 'ALL',
      jenis_pasien: 'ALL', // ALL, Rajal, Ranap, IGD, Luar
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
    rekapRuangan: [],  // [{ kode, nama, jlhPasien, jlhTindakan, persentase, topTindakan }]
    detailItems: [],   // [{ noreg, norm, nama, jenisPasien, dokter, ruangan, tgl, namaTindakan, status }]

    // Data dari API
    dataPemeriksaan: [],
    dataDokterMinta: [],
    dataDokterLaksana: [],
    dataRuangan: [],
    totalNotaUnik: 0
  }),

  getters: {
    formattedFrom: (state) => date.formatDate(state.params.from, 'DD MMMM YYYY'),
    formattedTo: (state) => date.formatDate(state.params.to, 'DD MMMM YYYY'),

    filteredPemeriksaan: (state) => {
      const q = (state.params.q || '').trim().toLowerCase()
      if (!q) return state.dataPemeriksaan || []
      return (state.dataPemeriksaan || []).filter(item =>
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.kode && item.kode.toLowerCase().includes(q))
      )
    },

    filteredDokterMinta: (state) => {
      const q = (state.params.q || '').trim().toLowerCase()
      if (!q) return state.dataDokterMinta || []
      return (state.dataDokterMinta || []).filter(item => {
        const matchDokter = item.nama && item.nama.toLowerCase().includes(q)
        const matchPmr = (item.pemeriksaan || []).some(p => p.nama && p.nama.toLowerCase().includes(q))
        return matchDokter || matchPmr
      })
    },

    filteredDokterLaksana: (state) => {
      const q = (state.params.q || '').trim().toLowerCase()
      if (!q) return state.dataDokterLaksana || []
      return (state.dataDokterLaksana || []).filter(item => {
        const matchDokter = item.nama && item.nama.toLowerCase().includes(q)
        const matchPmr = (item.pemeriksaan || []).some(p => p.nama && p.nama.toLowerCase().includes(q))
        return matchDokter || matchPmr
      })
    },

    filteredRuangan: (state) => {
      const q = (state.params.q || '').trim().toLowerCase()
      if (!q) return state.dataRuangan || []
      return (state.dataRuangan || []).filter(item =>
        item.nama && item.nama.toLowerCase().includes(q)
      )
    }
  },

  actions: {
    setPeriode(val) {
      this.header.periode = val
      if (val === 'Hari ini') {
        this.hariIni()
        // this.getData()
      }
      else if (val === 'Minggu ini') {
        this.mingguIni()
        // this.getData()
      }
      else if (val === 'Bulan ini') {
        this.bulanIni()
        // this.getData()
      }
      else if (val === 'Tahun ini') {
        this.tahunIni()
        // this.getData()
      }
    },

    hariIni() {
      const cDate = new Date()
      this.params.from = dateDbFormat(cDate)
      this.params.to = dateDbFormat(cDate)
    },
    bulanIni() {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      const firstday = curr.setFullYear(y, m, 1)
      const lastday = curr.setFullYear(y, m + 1, 0)
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    tahunIni() {
      const curr = new Date(), y = curr.getFullYear()
      const firstday = new Date(y, 0, 1)
      const lastday = new Date(y, 11, 31)
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    mingguIni() {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
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

    async getDataAll() {
      this.loading = true
      try {
        await Promise.all([
          this.getData('pemeriksaan'),
          this.getData('dokter_minta_detail'),
          this.getData('dokter_laksana_detail'),
          this.getData('ruangan')
        ])
      } finally {
        this.loading = false
      }
    },

    async getData(groupBy) {
      this.loading = true
      try {
        const resp = await api.get('/v1/simrs/radiologi/radiologi/laporanradiologi', {
          params: { ...this.params, group_by: groupBy }
        }).catch(() => null)

        if (resp && resp.status === 200 && Array.isArray(resp.data?.data)) {
          this.rawData = resp.data.data
          this.mappingData(resp.data)
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

    mappingData(data) {
      // Mapping hasil
      const map = {
        pemeriksaan: 'dataPemeriksaan',
        // dokter_minta: 'dataDokterMinta',
        dokter_minta_detail: 'dataDokterMinta',
        dokter_laksana_detail: 'dataDokterLaksana',
        ruangan: 'dataRuangan'
      }

      const key = map[data?.group_by]
      if (key) {
        this[key] = data?.data || []
      }

      this.totalNotaUnik = data?.total_nota_unik || 0

      this.dataPemeriksaan = (this.dataPemeriksaan || []).map(item => {
        return {
          ...item,
          total_nota: this.totalNotaUnik,
          persen_nota: this.totalNotaUnik > 0
            ? ((item.total / this.totalNotaUnik) * 100).toFixed(1)
            : 0,
          persen_pemeriksaan: this.totalPemeriksaan > 0
            ? ((item.total / this.totalPemeriksaan) * 100).toFixed(1)
            : 0
        }
      })



      // console.log('this.dataPemeriksaan', this.dataPemeriksaan)
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

      // 4. Rekap Per Ruangan / Poli (baru)
      const mapRuangan = new Map()
      filtered.forEach(item => {
        const ruangKey = item.ruangan || 'Tidak Teridentifikasi'
        if (!mapRuangan.has(ruangKey)) {
          mapRuangan.set(ruangKey, {
            nama: ruangKey,
            pasiens: new Set(),
            jlhTindakan: 0,
            tindakanMap: new Map()
          })
        }
        const ruangRecord = mapRuangan.get(ruangKey)
        ruangRecord.pasiens.add(item.noreg || item.norm)
        ruangRecord.jlhTindakan++

        const tndKey = item.namaTindakan
        if (!ruangRecord.tindakanMap.has(tndKey)) {
          ruangRecord.tindakanMap.set(tndKey, 0)
        }
        ruangRecord.tindakanMap.set(tndKey, ruangRecord.tindakanMap.get(tndKey) + 1)
      })

      const rekapRuanganArr = []
      mapRuangan.forEach((val, keyName) => {
        const detailTindakan = []
        val.tindakanMap.forEach((jumlah, namaTindakan) => {
          detailTindakan.push({ namaTindakan, jumlah })
        })
        detailTindakan.sort((a, b) => b.jumlah - a.jumlah)
        const topTindakan = detailTindakan.slice(0, 3).map(t => t.namaTindakan).join(', ')

        const jlhPasien = val.pasiens.size
        const persentase = totalTindakan > 0 ? ((val.jlhTindakan / totalTindakan) * 100).toFixed(1) : 0
        rekapRuanganArr.push({
          kode: keyName.substring(0, 6).toUpperCase(),
          nama: val.nama,
          jlhPasien,
          jlhTindakan: val.jlhTindakan,
          persentase: Number(persentase),
          topTindakan: topTindakan || '-',
          detailTindakan
        })
      })
      rekapRuanganArr.sort((a, b) => b.jlhTindakan - a.jlhTindakan)
      this.rekapRuangan = rekapRuanganArr

      // 5. Update Summary (tambah totalRuangan)
      this.summary = {
        totalPasien,
        totalTindakan,
        totalRajal,
        totalRanap,
        totalIgd,
        totalDokter: rekapDokterArr.length,
        totalRuangan: rekapRuanganArr.length
      }
    },

    // Export Excel (.xlsx) dengan Multiple Sheets
    async exportToExcel() {
      this.loadingDownload = true
      try {
        const wb = XLSX.utils.book_new()

        // Sheet 1: Rekap Per Pemeriksaan
        const pemRows = [
          ['LAPORAN REKAPITULASI RADIOLOGI PER PEMERIKSAAN'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['NO', 'KODE PEMERIKSAAN', 'NAMA PEMERIKSAAN', 'TOTAL NOTA', 'TOTAL TINDAKAN', 'KONTRIBUSI (%)']
        ]

        this.dataPemeriksaan.forEach((p, idx) => {
          pemRows.push([
            idx + 1,
            p.kode || '-',
            p.nama,
            p.total_nota,
            p.total,
            `${p.persen_nota}%`
          ])
        })

        const wsPem = XLSX.utils.aoa_to_sheet(pemRows)
        XLSX.utils.book_append_sheet(wb, wsPem, 'Per Pemeriksaan')

        // Sheet 2: Rekap Per Dokter Peminta
        const dokterMintaRows = [
          ['LAPORAN REKAPITULASI RADIOLOGI PER DOKTER PEMINTA'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['NO', 'NAMA DOKTER PEMINTA', 'TOTAL TINDAKAN', 'DETAIL PEMERIKSAAN']
        ]

        this.dataDokterMinta.forEach((dm, idx) => {
          const detailStr = (dm.pemeriksaan || []).map(p => `${p.nama} (${p.total})`).join('; ')
          dokterMintaRows.push([
            idx + 1,
            dm.nama,
            dm.total,
            detailStr
          ])
        })

        const wsDokterMinta = XLSX.utils.aoa_to_sheet(dokterMintaRows)
        XLSX.utils.book_append_sheet(wb, wsDokterMinta, 'Per Dokter Peminta')

        // Sheet 3: Rekap Per Dokter Pelaksana
        const dokterLaksanaRows = [
          ['LAPORAN REKAPITULASI RADIOLOGI PER DOKTER PELAKSANA'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['NO', 'NAMA DOKTER PELAKSANA', 'TOTAL TINDAKAN', 'DETAIL PEMERIKSAAN']
        ]

        this.dataDokterLaksana.forEach((dl, idx) => {
          const detailStr = (dl.pemeriksaan || []).map(p => `${p.nama} (${p.total})`).join('; ')
          dokterLaksanaRows.push([
            idx + 1,
            dl.nama,
            dl.total,
            detailStr
          ])
        })

        const wsDokterLaksana = XLSX.utils.aoa_to_sheet(dokterLaksanaRows)
        XLSX.utils.book_append_sheet(wb, wsDokterLaksana, 'Per Dokter Pelaksana')

        // Sheet 4: Rekap Per Ruangan
        const ruanganRows = [
          ['LAPORAN REKAPITULASI RADIOLOGI PER RUANGAN / POLI PENGIRIM'],
          [`Periode: ${this.formattedFrom} s/d ${this.formattedTo}`],
          [''],
          ['NO', 'RUANGAN / POLI PENGIRIM', 'TOTAL TINDAKAN']
        ]

        this.dataRuangan.forEach((r, idx) => {
          ruanganRows.push([
            idx + 1,
            r.nama,
            r.total
          ])
        })

        const wsRuangan = XLSX.utils.aoa_to_sheet(ruanganRows)
        XLSX.utils.book_append_sheet(wb, wsRuangan, 'Per Ruangan')

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
