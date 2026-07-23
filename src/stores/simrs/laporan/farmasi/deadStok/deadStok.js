import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useDeadStokReportStore = defineStore('laporan_dead_stok', {
  state: () => {
    const now = new Date()
    const dariBulan = date.formatDate(now, 'MM')
    const dariTahun = date.formatDate(now, 'YYYY')

    // Calculate default 3 months range (M + 2)
    const targetDate = new Date(now.getFullYear(), now.getMonth() + 2, 1)
    const sampaiBulan = date.formatDate(targetDate, 'MM')
    const sampaiTahun = date.formatDate(targetDate, 'YYYY')

    return {
      loading: false,
      loadingDownload: false,
      items: [],
      meta: {},
      total_tersedia: 0,
      total_dead_stok: 0,
      persentase_dead_stok: 0,
      params: {
        dari_bulan: dariBulan,
        dari_tahun: dariTahun,
        sampai_bulan: sampaiBulan,
        sampai_tahun: sampaiTahun,
        kode_ruang: 'all' // Default Rumah Sakit
      },
      bulans: [
        { nama: 'Januari', value: '01' },
        { nama: 'Februari', value: '02' },
        { nama: 'Maret', value: '03' },
        { nama: 'April', value: '04' },
        { nama: 'Mei', value: '05' },
        { nama: 'Juni', value: '06' },
        { nama: 'Juli', value: '07' },
        { nama: 'Agustus', value: '08' },
        { nama: 'September', value: '09' },
        { nama: 'Oktober', value: '10' },
        { nama: 'November', value: '11' },
        { nama: 'Desember', value: '12' }
      ],
      gudangs: [
        { nama: 'Rumah Sakit ( Semua Gudang & Depo )', value: 'all' },
        { nama: 'Gudang Farmasi ( Kamar Obat )', value: 'Gd-05010100' },
        { nama: 'Gudang Farmasi ( Floor Stok )', value: 'Gd-03010100' },
        { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
        { nama: 'Depo Rawat Inap', value: 'Gd-04010102' },
        { nama: 'Depo IGD', value: 'Gd-02010104' },
        { nama: 'Depo OK', value: 'Gd-04010103' },
        { nama: 'Depo Floor Stok', value: 'Gd-03010101' }
      ],
      fields: {
        'No': 'no',
        'Kode Obat': 'kd_obat',
        'Nama Obat': 'nama_obat',
        'Kode Belanja': 'kode_belanja',
        'Saldo Akhir (Qty)': 'saldo_akhir_qty',
        'Saldo Akhir (Nominal)': 'saldo_akhir_val',
        'Expired Date': 'expired_date',
        'Keterangan': 'keterangan'
      }
    }
  },
  actions: {
    setParams (key, val) {
      this.params[key] = val

      // Auto-adjust sampai_bulan and sampai_tahun (to 3 months after dari_bulan/dari_tahun)
      if (key === 'dari_bulan' || key === 'dari_tahun') {
        const dariBul = parseInt(this.params.dari_bulan)
        const dariTah = parseInt(this.params.dari_tahun)
        if (!isNaN(dariBul) && !isNaN(dariTah)) {
          const targetDate = new Date(dariTah, dariBul - 1 + 2, 1)
          this.params.sampai_bulan = String(targetDate.getMonth() + 1).padStart(2, '0')
          this.params.sampai_tahun = String(targetDate.getFullYear())
        }
      }
    },
    async getData () {
      this.loading = true

      // Convert dari_bulan/dari_tahun to YYYY-MM-DD
      const fromDate = `${this.params.dari_tahun}-${this.params.dari_bulan}-01`

      // Convert sampai_bulan/sampai_tahun to YYYY-MM-DD (last day of that month)
      const lastDay = new Date(parseInt(this.params.sampai_tahun), parseInt(this.params.sampai_bulan), 0).getDate()
      const toDate = `${this.params.sampai_tahun}-${this.params.sampai_bulan}-${String(lastDay).padStart(2, '0')}`

      const param = {
        params: {
          tempat: this.params.kode_ruang,
          from: fromDate,
          to: toDate
        }
      }
      await api.get('v1/simrs/laporan/farmasi/persediaan/get-dead-stok', param)
        .then(resp => {
          this.loading = false
          this.items = resp?.data?.data ?? []
          this.meta = resp?.data ?? {}
          this.total_tersedia = resp?.data?.total_tersedia ?? 0
          this.total_dead_stok = resp?.data?.total_dead_stok ?? 0
          this.persentase_dead_stok = resp?.data?.persentase_dead_stok ?? 0
        })
        .catch(() => {
          this.loading = false
        })
    },
    startDownload () {
      this.loadingDownload = true
    },
    finishDownload () {
      this.loadingDownload = false
    },
    async fetch () {
      this.loadingDownload = true

      const fromDate = `${this.params.dari_tahun}-${this.params.dari_bulan}-01`
      const lastDay = new Date(parseInt(this.params.sampai_tahun), parseInt(this.params.sampai_bulan), 0).getDate()
      const toDate = `${this.params.sampai_tahun}-${this.params.sampai_bulan}-${String(lastDay).padStart(2, '0')}`

      const params = {
        tempat: this.params.kode_ruang,
        from: fromDate,
        to: toDate,
        action: 'download'
      }
      try {
        const res = await api.get('v1/simrs/laporan/farmasi/persediaan/get-dead-stok', { params })
        this.loadingDownload = false
        
        const data = res?.data?.data ?? []
        const totalTersedia = res?.data?.total_tersedia ?? 0
        const totalDeadStok = res?.data?.total_dead_stok ?? 0
        const persentase = res?.data?.persentase_dead_stok ?? 0

        const mappedData = data.map((item, index) => ({
          no: index + 1,
          kd_obat: item.kd_obat,
          nama_obat: item.nama_obat,
          kode_belanja: item.kode_belanja ?? '',
          saldo_akhir_qty: item.saldo_akhir_qty,
          saldo_akhir_val: item.saldo_akhir_val,
          expired_date: item.expired_date ?? '',
          keterangan: item.total_transaksi === 0 ? 'Dead Stock' : 'Aktif'
        }))

        // Append empty row as a separator
        mappedData.push({
          no: '',
          kd_obat: '',
          nama_obat: '',
          kode_belanja: '',
          saldo_akhir_qty: '',
          saldo_akhir_val: '',
          expired_date: '',
          keterangan: ''
        })

        // Append summary statistics
        mappedData.push({
          no: '',
          kd_obat: '',
          nama_obat: 'Total Jenis Obat Tersedia',
          kode_belanja: '',
          saldo_akhir_qty: totalTersedia,
          saldo_akhir_val: '',
          expired_date: '',
          keterangan: 'item'
        })

        mappedData.push({
          no: '',
          kd_obat: '',
          nama_obat: 'Total Jenis Obat Dead Stock',
          kode_belanja: '',
          saldo_akhir_qty: totalDeadStok,
          saldo_akhir_val: '',
          expired_date: '',
          keterangan: 'item'
        })

        mappedData.push({
          no: '',
          kd_obat: '',
          nama_obat: 'Persentase Obat Dead Stock',
          kode_belanja: '',
          saldo_akhir_qty: `${persentase}%`,
          saldo_akhir_val: '',
          expired_date: '',
          keterangan: ''
        })

        return mappedData
      } catch (err) {
        this.loadingDownload = false
        return []
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeadStokReportStore, import.meta.hot))
}
