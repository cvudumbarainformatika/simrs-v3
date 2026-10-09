import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr, notifSuccess } from 'src/modules/utils'

const nowForInput = () => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

const currentMonthRange = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const format = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return {
    from: format(new Date(year, month, 1)),
    to: format(new Date(year, month + 1, 0))
  }
}

export const useUangJaminanKasirStore = defineStore('kasir-uang-jaminan', {
  state: () => ({
    loading: false,
    saving: false,
    pasienLoading: false,
    pasienDialog: false,
    items: [],
    pasienItems: [],
    meta: null,
    form: {
      tanggal: nowForInput(),
      jenis_pembayaran: 'VA',
      noreg: '',
      norm: '',
      nama: '',
      no_va: '',
      jumlah: null
    },
    params: {
      page: 1,
      per_page: 10,
      q: '',
      ...currentMonthRange()
    },
    pasienParams: {
      pelayanan: 'igd',
      q: '',
      page: 1,
      per_page: 10
    }
  }),

  actions: {
    setFilterBulanBerjalan () {
      Object.assign(this.params, currentMonthRange(), { page: 1 })
    },

    async getData () {
      this.loading = true
      try {
        const response = await api.get('/v1/simrs/kasir/uang-jaminan', { params: this.params })
        this.items = response.data?.data ?? []
        this.meta = response.data ?? null
      }
      catch (error) {
        notifErr(error)
      }
      finally {
        this.loading = false
      }
    },

    async simpan () {
      this.saving = true
      try {
        const payload = {
          tanggal: this.form.tanggal?.replace('T', ' '),
          jenis_pembayaran: this.form.jenis_pembayaran,
          noreg: this.form.noreg,
          no_va: this.form.no_va,
          jumlah: Number(this.form.jumlah)
        }
        const response = await api.post('/v1/simrs/kasir/uang-jaminan', payload)
        notifSuccess(response)
        this.form = { tanggal: nowForInput(), jenis_pembayaran: 'VA', noreg: '', norm: '', nama: '', no_va: '', jumlah: null }
        this.params.page = 1
        await this.getData()
        return true
      }
      catch (error) {
        notifErr(error)
        return false
      }
      finally {
        this.saving = false
      }
    },

    async getPasien () {
      this.pasienLoading = true
      try {
        const response = await api.get('/v1/simrs/kasir/uang-jaminan/pasien', { params: this.pasienParams })
        this.pasienItems = response.data?.data ?? []
      }
      catch (error) {
        notifErr(error)
      }
      finally {
        this.pasienLoading = false
      }
    },

    bukaDialogPasien () {
      this.pasienDialog = true
      this.pasienParams.page = 1
      this.getPasien()
    },

    setPelayananPasien (pelayanan) {
      this.pasienParams.pelayanan = pelayanan
      this.pasienParams.page = 1
      this.getPasien()
    },

    pilihPasien (pasien) {
      this.form.noreg = pasien?.noreg ?? ''
      this.form.norm = pasien?.norm ?? ''
      this.form.nama = pasien?.nama ?? ''
      this.pasienDialog = false
    }
  }
})
