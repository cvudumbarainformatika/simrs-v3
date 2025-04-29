import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useListReturPenyediaStore = defineStore('list_retur_penyedia', {
  state: () => ({
    isOpen: false,
    loading: false,
    items: [],
    meta: {},
    param: {
      q: '',
      page: 1,
      per_page: 10
    },
    columns: [
      'penyedia',
      'nomor',
      'tanggal',
      'gud'
    ],
    columnHide: [],
    dataToPrint: {}
  }),
  actions: {
    setParam (key, val) {
      this.param[key] = val
    },
    setSearch (payload) {
      this.setParam('q', payload)
      this.setParam('page', 1)
      this.getList()
    },
    setPage (payload) {
      this.setParam('page', payload)
      this.getList()
    },
    setPerPage (payload) {
      this.setParam('per_page', payload)
      this.setParam('page', 1)
      this.getList()
    },
    refreshTable () {
      this.setParam('page', 1)
      this.getList()
    },
    getInitialData () {
      this.getList()
    },
    getList () {
      this.loading = true
      const param = { params: this.param }
      return new Promise(resolve => {
        api.get('v1/simrs/penunjang/farmasinew/retur/list-retur', param)
          .then(resp => {
            this.loading = false
            console.log('list retur', resp.data)
            this.items = resp.data.data
            this.meta = resp.data.meta

            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    kunci (item) {
      item.loadingKunci = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/farmasinew/retur/kunci', item)
          .then(resp => {
            item.loadingKunci = false
            console.log('kuci', resp?.data)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            item.loadingKunci = false
          })
      })
    },
    async deleteHeader (val) {
      val.loading = true
      val.expand = !val.expand
      val.highlight = !val.highlight
      const kirim = {
        no_retur: val.no_retur
      }
      api.post('v1/simrs/penunjang/farmasinew/retur/delete-header', kirim)
        .then(resp => {
          console.log('hapus heder', resp?.data)

          val.loading = false
          const indexIt = this.items.findIndex(it => it.no_retur === val.no_retur)
          if (indexIt >= 0) this.items.splice(indexIt, 1)
          notifSuccess(resp)
        })
        .catch(() => {
          val.loading = false
        })
    },
    async deleteRinci (val) {
      val.loading = true
      const kirim = {
        no_retur: val.no_retur,
        kd_obat: val.kd_obat,
        nopenerimaan: val.nopenerimaan,
        no_batch: val.no_batch
      }
      api.post('v1/simrs/penunjang/farmasinew/retur/delete-rinci', kirim)
        .then(resp => {
          console.log('hapus rinci', resp?.data)

          val.loading = false
          // hapus di list
          const item = this.items.findIndex(it => it.no_retur === val.no_retur)
          if (item >= 0) {
            if (this.items[item].rinci?.length > 1) {
              const index = this.items[item].rinci.findIndex(ri => ri.kd_obat === val.kd_obat && ri.nopenerimaan === val.nopenerimaan)
              if (index >= 0) this.items[item].rinci.splice(index, 1)
            }
            else {
              this.items.splice(item, 1)
            }
          }
          notifSuccess(resp)
        })
        .catch(() => {
          val.loading = false
        })
    },
    simpanEditFaktur (payload, item) {
      item.loadingEdit = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/farmasinew/retur/simpan-edit_faktur', payload)
          .then(resp => {
            console.log('simpan edit', resp)
            delete item.loadingEdit
            item.no_faktur_retur_pbf = resp?.data?.data?.no_faktur_retur_pbf
            item.tgl_faktur_retur_pbf = resp?.data?.data?.tgl_faktur_retur_pbf
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            delete item.loadingEdit
          })
      })
    },
    simpanEditRinci (payload, item) {
      item.loadingEdit = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/farmasinew/retur/simpan-edit-rinci', payload)
          .then(resp => {
            console.log('simpan edit', resp)
            delete item.loadingEdit
            item.harga_net = resp?.data?.data?.harga_net
            item.no_batch = resp?.data?.data?.no_batch
            item.nopenerimaan = resp?.data?.data?.nopenerimaan
            item.subtotal = resp?.data?.data?.subtotal
            item.tgl_exp = resp?.data?.data?.tgl_exp
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            delete item.loadingEdit
          })
      })
    }
  }
})
