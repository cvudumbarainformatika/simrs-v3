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
        { name: 'no', label: 'No', field: 'no', align: 'left' },
        { name: 'noreg', label: 'No Reg', field: 'noreg', align: 'left' },
        { name: 'norm', label: 'No RM', field: 'norm', align: 'left' },
        { name: 'nama', label: 'Nama Pasien', field: 'nama', align: 'left' },
        { name: 'nokuitansi', label: 'No Kuitansi', field: 'nokuitansi', align: 'left' },
        { name: 'sumber', label: 'Sumber', field: 'sumber', align: 'left' },
        { name: 'tgl', label: 'Tanggal', field: 'tgl', align: 'left' },
        { name: 'kuitansicetak', label: 'Kuitansi Cetak', field: 'kuitansicetak', align: 'left' },
        { name: 'kuitansibatal', label: 'Kuitansi Batal', field: 'kuitansibatal', align: 'left' },
        // { name: 'batal', label: 'Batal', field: 'batal', align: 'left' },
        { name: 'tglbatal', label: 'Tgl Batal', field: 'tglbatal', align: 'left' },
        { name: 'total', label: 'Total', field: 'total', align: 'right' }
      ],

      params: {
        tgldari: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        tglsampai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        layanan: '',
        kasir: ''
      },

      itemskasir: [],

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
      async getmasterkasir() {
        await api.get('/v1/simrs/kasir/tbp/getmasterkasir')
          .then(resp => {
            this.itemskasir = resp.data?.data
          })
          .catch(err => {
            console.log(err)
          })
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
            sumber: x.sumber,
            tgl: x.tgl,
            kuitansicetak: x.batal === '1' ? '' : x.total,
            kuitansibatal: x.batal === '1' ? x.total : '',
            batal: x.batal,
            tglbatal: x.tgl_batal,
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
