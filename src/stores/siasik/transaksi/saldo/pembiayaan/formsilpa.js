import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'
import { storeSisaAnggaran } from 'src/stores/siasik/transaksi/saldo/pembiayaan/silpa'
export const useFormSilpa = defineStore('Silpa_form', {
  state: () => ({
    isOpen: false,
    loading: false,
    ambils: {
      q: ''
    },
    form: {
      notrans: null,
      tanggal: null,
      tahun: null,
      nominal: 0
    }
  }),
  actions: {
    resetFORM() {
      this.form = {}
      const columns = ['notrans', 'tanggal', 'tahun', 'nominal']
      for (let i = 0; i < columns?.length; i++) {
        this.setForm(columns[i], null)
      }
    },
    setOpen() {
      this.isOpen = !this.isOpen
      // this.getLayanan();
      // this.getKategori();
      // this.getSatuan();
    },
    newData() {
      this.resetFORM()
      this.edited = false
      this.isOpen = !this.isOpen
      // this.getGedungsData()
    },
    editData(val) {
      this.edited = true
      const keys = Object.keys(val)
      keys.forEach((key, index) => {
        this.setForm(key, val[key])
      })
      // kecuali yang ada di object user
      this.isOpen = !this.isOpen
    },
    setAmbils(key, val) {
      this.ambils[key] = val
    },
    setForm(key, val) {
      this.form[key] = val
    },
    emptyForm() {
      this.form = {}
    },
    simpanSilpa() {
      // cari nama bank
      // const bank = this.rekeningbluds.find(
      //   (x) => x.noRek === this.form.rekening
      // );
      // const data = {
      //   nama: this.form.nama,
      //   harga: this.form.harga,
      //   kategori_id: this.form.kategori_id,
      //   satuan_id: this.form.satuan_id,
      //   // namaRek: bank?.namaRek ?? "-",
      // };
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('/v1/transaksi/transaksi_anggaran/transsilpa', this.form)
          .then((resp) => {
            // console.log('isian', resp)
            this.loading = false
            this.isOpen = false
            notifSuccess(resp)
            this.loading = false
            const store = storeSisaAnggaran()
            store.getDataTable()

            resolve(resp.data)
          })
          .catch((err) => {
            this.loading = false
            this.isOpen = false
            reject(err)
          })
      })
    }
  }
})
