import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const usePerbaikanHargaFarmasiStore = defineStore('perbaikan_harga_farmasi', {
  state: () => ({
    loading: false,
    loadingSimpan: false,
    isOpen: false,
    items: [],
    semuas: [],
    meta: {},
    data: [],
    columns: ['kd_obat', 'nama_obat', 'stok', 'opname', 'mutasi', 'resep', 'racikan', 'retur', 'mutasi_keluar', 'status', 'act'],
    colunmHide: [],
    params: {
      kdruang: '',
      q: '',
      page: 1,
      per_page: 100,
      // tahun: '2024',
      // bulan: '06',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      bulan: date.formatDate(Date.now(), 'MM'),
      pilihan: 'semua'
    },
    gudangs: [
      { nama: 'Gudang Farmasi ( Kamar Obat )', kode: 'Gd-05010100' },
      { nama: 'Depo Rawat inap', kode: 'Gd-04010102' },
      { nama: 'Depo OK', kode: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', kode: 'Gd-05010101' },
      { nama: 'Depo IGD', kode: 'Gd-02010104' },
      { nama: 'Gudang Farmasi (Floor Stok)', kode: 'Gd-03010100' },
      { nama: 'Floor Stock 1 (AKHP)', kode: 'Gd-03010101' },
    ]
  }),
  actions: {
    setParams (payload, value) {
      this.params[payload] = value
    },
    setPage (payload) {
      this.setParams('page', payload)
      this.getData()
    },
    setPerPage (payload) {
      this.setParams('per_page', payload)
      this.setParams('page', 1)
      this.getData()
    },
    refreshTable () {
      this.getData()
    },
    setSearch (payload) {
      // console.log('q', payload)
      // console.log('payload', payload)

      this.setParams('page', 1)
      this.setParams('q', payload)
      this.getData()
    },
    mapSingleDrug (item, data) {
      item.beda = false
      const penerimaan = data?.penerimaan?.filter(a => a.kdobat === item.kd_obat) ?? []
      const awal = data?.awal?.filter(a => a.kdobat === item.kd_obat) ?? []
      const stok = data?.stok?.filter(a => a.kdobat === item.kd_obat) ?? []
      const mutasi = data?.mutasi?.filter(a => a.kdobat === item.kd_obat) ?? []
      const mutasikeluar = data?.mutasikeluar?.filter(a => a.kdobat === item.kd_obat) ?? []
      const opname = data?.opname?.filter(a => a.kdobat === item.kd_obat) ?? []
      const racikan = data?.racikan?.filter(a => a.kdobat === item.kd_obat) ?? []
      const resep = data?.resep?.filter(a => a.kdobat === item.kd_obat) ?? []
      const retur = data?.retur?.filter(a => a.kdobat === item.kd_obat) ?? []

      item.data = {
        stok,
        mutasi,
        mutasikeluar,
        opname,
        racikan,
        resep,
        retur,
        penerimaan,
        awal
      }

      item.stok = stok?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
      item.mutasi = mutasi?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
      item.mutasi_keluar = mutasikeluar?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
      item.opname = opname?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
      item.racikan = racikan?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
      item.resep = resep?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
      item.retur = retur?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0

      // Calculate total outgoing per batch
      const outgoingSums = {}
      const addOutgoing = (noper, batch, qty) => {
        const k = `${noper}_${batch}`
        outgoingSums[k] = (outgoingSums[k] || 0) + parseFloat(qty || 0)
      }
      resep?.forEach(r => addOutgoing(r.nopenerimaan, r.nobatch, r.jumlah))
      racikan?.forEach(r => addOutgoing(r.nopenerimaan, r.nobatch, r.jumlah))
      mutasikeluar?.forEach(m => addOutgoing(m.nopenerimaan, m.nobatch, m.jumlah))
      retur?.forEach(r => addOutgoing(r.nopenerimaan, r.nobatch, -parseFloat(r.jumlah || 0)))

      // Decorate master receipt batches with metrics
      penerimaan?.forEach(p => {
        const k = `${p.nopenerimaan}_${p.nobatch}`
        p.incoming_qty = parseFloat(p.jumlah || 0)
        p.outgoing_qty = outgoingSums[k] || 0
        const stokRelForBatch = stok?.filter(s => s.nopenerimaan === p.nopenerimaan && s.nobatch === p.nobatch) ?? []
        p.remaining_qty = stokRelForBatch.reduce((sum, s) => sum + parseFloat(s.jumlah || 0), 0)
        const opnameForBatch = opname?.filter(o => o.nopenerimaan === p.nopenerimaan && o.nobatch === p.nobatch) ?? []
        p.opname_qty = opnameForBatch.reduce((sum, o) => sum + parseFloat(o.jumlah || 0), 0)
      })

      awal?.forEach(a => {
        const k = `${a.nopenerimaan}_${a.nobatch}`
        a.incoming_qty = parseFloat(a.jumlah || 0)
        a.outgoing_qty = outgoingSums[k] || 0
        const stokRelForBatch = stok?.filter(s => s.nopenerimaan === a.nopenerimaan && s.nobatch === a.nobatch) ?? []
        a.remaining_qty = stokRelForBatch.reduce((sum, s) => sum + parseFloat(s.jumlah || 0), 0)
        const opnameForBatch = opname?.filter(o => o.nopenerimaan === a.nopenerimaan && o.nobatch === a.nobatch) ?? []
        a.opname_qty = opnameForBatch.reduce((sum, o) => sum + parseFloat(o.jumlah || 0), 0)
      })

      // Helper to do Solusi 1 intelligent match
      const checkAndMatch = (st) => {
        let trm = null
        if (st?.nopenerimaan?.includes('awal')) {
          trm = awal?.find(a => a.nopenerimaan === st.nopenerimaan)
        } else {
          const matches = penerimaan?.filter(a => a.nopenerimaan === st.nopenerimaan) ?? []
          if (st.nobatch == null || st.nobatch === '') {
            // Solusi 1: Search for batch with same price
            const priceMatch = matches.find(m => parseFloat(m.harga) === parseFloat(st.harga))
            if (priceMatch) {
              st.nobatch = priceMatch.nobatch
              trm = priceMatch
            } else {
              trm = matches[0] // fallback to first batch
            }
          } else {
            trm = matches.find(m => m.nobatch === st.nobatch)
          }
        }
        return trm
      }

      // 1. Stok
      stok?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm.harga) !== parseFloat(st.harga)) st.beda = true
          if (dateDbFormat(st?.tglpenerimaan) !== (dateDbFormat(trm?.tglpenerimaan ?? trm?.header?.tglpenerimaan))) st.beda = true
        }
      })

      // 2. Mutasi
      mutasi?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm?.harga) !== parseFloat(st.harga)) {
            st.beda = true
            item.beda = true
          }
          if (dateDbFormat(st?.tglpenerimaan) !== (dateDbFormat(trm?.tglpenerimaan ?? trm?.header?.tglpenerimaan))) {
            st.beda = true
            item.beda = true
          }
        }
      })

      // 3. Mutasi Keluar
      mutasikeluar?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm?.harga) !== parseFloat(st.harga)) {
            st.beda = true
            item.beda = true
          }
        }
      })

      // 4. Opname
      opname?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm?.harga) !== parseFloat(st.harga)) {
            st.beda = true
            item.beda = true
          }
        }
      })

      // 5. Racikan
      racikan?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm?.harga) !== parseFloat(st.harga)) {
            st.beda = true
            item.beda = true
          }
        }
      })

      // 6. Resep
      resep?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm?.harga) !== parseFloat(st.harga)) {
            st.beda = true
            item.beda = true
          }
        }
      })

      // 7. Retur
      retur?.forEach(st => {
        const trm = checkAndMatch(st)
        if (trm) {
          if (parseFloat(trm?.harga) !== parseFloat(st.harga)) {
            st.beda = true
            item.beda = true
          }
        }
      })
    },
    metaniData (data) {
      if (this.semuas?.length) {
        this.semuas?.forEach(item => {
          this.mapSingleDrug(item, data)
        })
        if (this.params.pilihan === 'semua') {
          this.items = this.semuas
        }
        else if (this.params.pilihan === 'bermasalah') {
          this.items = this.semuas.filter(fi => fi.beda === true)
        }
        else if (this.params.pilihan === 'tidak') {
          this.items = this.semuas.filter(fi => !fi.beda === true)
        }
      }
    },
    metaniSatuData (data) {
      const kode = data?.kode[0]
      const item = this.semuas.find(f => f.kd_obat === kode)
      if (item) {
        this.mapSingleDrug(item, data)
      }
    },
    getData (val) {
      const param = val || this.params
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('/v1/simrs/farmasinew/cekdata/get-obat', param)
          .then(resp => {
            this.loading = false
            if (parseInt(this.params.per_page) === 1) this.metaniSatuData(resp?.data?.data)
            else {
              this.items = resp.data?.data?.data ?? resp?.data
              this.semuas = resp.data?.data?.data ?? resp?.data
              this.meta = resp.data?.data?.meta ?? resp?.data
              if (this.params?.kdruang) this.metaniData(resp?.data?.data)
            }
            // console.log('resp', resp?.data)
            resolve(resp)
            // this.data = resp?.data?.data
          }).catch(err => {
            this.loading = false
            reject(err)
          })
      })
    },

    async simpanPerbaikanHarga (item) {
      const param = { ...this.params }
      const q = param.q
      this.loading = true
      item.item.loading = true
      try {
        const resp = await api.post('/v1/simrs/farmasinew/cekdata/simpan-perbaikan-harga-dua', item)
        // console.log('resp simpan', resp)
        notifSuccess(resp)
        const perPage = this.params.per_page
        const page = this.params.page
        // this.params.page = 1
        // this.params.per_page = 1
        // this.params.q = item?.item?.kdobat
        this.getData(param).then(() => {
          // this.params.per_page = perPage
          // this.params.page = page
          // this.params.q = q
        })
      }
      catch (err) {
        notifErrVue(err, 'Gagal menyimpan perbaikan harga')
      }
      finally {
        item.item.loading = false
        this.loading = false
      }
    },
    async simpanPerbaikanHargaArray (item) {
      // console.log(' simpan array', item)
      const param = { ...this.params }
      const q = param.q
      // this.loading = true
      item.row['loading' + item.loading] = true
      try {
        const resp = await api.post('/v1/simrs/farmasinew/cekdata/simpan-perbaikan-harga-array', item)
        // console.log('resp simpan array', resp)
        notifSuccess(resp)
        const perPage = this.params.per_page
        const page = this.params.page
        // this.params.page = 1
        // this.params.per_page = 1
        // this.params.q = item?.kd_obat
        this.getData(param).then(() => {
          // this.params.per_page = perPage
          // this.params.page = page
          // this.params.q = q
        })
      }
      catch (err) {
        notifErrVue(err, 'Gagal menyimpan perbaikan harga')
      }
      finally {
        item.row['loading' + item.loading] = false
        // this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePerbaikanHargaFarmasiStore, import.meta.hot))
}
