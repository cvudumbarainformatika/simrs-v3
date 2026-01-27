import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'
import { notifErrVue } from 'src/modules/utils'

export const useLaporanKuitansiTercetak = defineStore(
  'laporan-kuitansi-tercetak',
  {
    state: () => ({
      loading: false,

      // ✅ DATA TABEL
      rows: [],

      // ✅ DEFINISI KOLOM
      columns: [
        { name: 'noreg', label: 'No Reg', field: 'noreg', align: 'left' },
        { name: 'norm', label: 'No RM', field: 'norm', align: 'left' },
        { name: 'nama', label: 'Nama Pasien', field: 'nama', align: 'left' },
        { name: 'nokuitansi', label: 'No Kuitansi', field: 'nokuitansi', align: 'left' },
        { name: 'tgl', label: 'Tanggal', field: 'tgl', align: 'left' },
        { name: 'total', label: 'Total', field: 'total', align: 'right' }
      ],

      params: {
        tgldari: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        tglsampai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        layanan: ''
      },

      tanggal: {
        from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
        to: date.formatDate(Date.now(), 'DD MMMM YYYY')
      }
    }),

    actions: {
      initAmbilData() {
        if (this.params.tgldari > this.params.tglsampai) {
          return notifErrVue(
            'Tanggal Dari Tidak Boleh Lebih Besar Dari Tanggal Sampai'
          )
        }
        this.getDataTable()
      },

      async getDataTable() {
        this.loading = true
        try {
          const resp = await api.get(
            'v1/simrs/laporan/keuangan/kuitansitercetak',
            { params: this.params }
          )

          // ✅ pastikan ARRAY
          this.rows = (resp.data || []).map(x => ({
            noreg: x.noreg,
            norm: x.norm,
            nama: x.nama,
            nokuitansi: x.nokwitansi,
            tgl: x.tgl,
            total: x.total
          }))
        }
        catch (err) {
          console.error(err)
          notifErrVue('Gagal mengambil data kuitansi')
        }
        finally {
          this.loading = false
        }
      }
    }
  }
)
