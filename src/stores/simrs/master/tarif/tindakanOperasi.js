import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import ruangan from 'src/router/ruangan'

export const useMasterTindakanOperasiStore = defineStore('master_tindakan_operasi', {
  state: () => ({
    isOpen: false,
    edit: false,
    loading: false,
    items: [],
    meta: {},
    params: {
      nmtindakan: '',
      per_page: 10,
      page: 1
    },
    form: {},
    disp: {},
    columns: [
      'kode',
      'nama',
      'kelas3',
      'kelas2',
      'kelas1',
      'utama',
      'vip',
      'vvip'
    ],
    polis: [],
    ruangRanap: [],
    allRuangs: []
  }),
  actions: {
    resetForm () {
      this.setForm('kdtindakan', '')
      this.setForm('nmtindakan', '')
      const col = [
        'js3',
        'jp3',
        'tarif3',
        'tarif2',
        'tarif1',
        'tarifutama',
        'tarifvip',
        'tarifvvip',
        'habispake3',
        'js2',
        'jp2',
        'habispake2',
        'js1',
        'jp1',
        'habispake1',
        'jsutama',
        'jputama',
        'habispakeutama',
        'jsvip',
        'jpvip',
        'habispakevip',

        'jsvvip',
        'jpvvip',
        'habispakevvip',

        'js_presidential',
        'jp_presidential',
        'habispake_presidential',
        'tarif_presidential',

        'js_hcu',
        'jp_hcu',
        'habispake_hcu',
        'tarif_hcu',

        'js_hc',
        'jp_hc',
        'habispake_hc',
        'tarif_hc',

      ]
      col.forEach(a => {
        this.setForm(a, 0)
      })
      const besok = date.addToDate(new Date(), { days: 1 })
      this.setForm('tgl_mulai_berlaku', date.formatDate(besok, 'YYYY-MM-DD'))
      this.disp.tgl_mulai_berlaku = date.formatDate(besok, 'DD MMMM YYYY')
      // console.log('reset', date.formatDate(besok, 'YYYY-MM-DD'))

    },
    setOpen () {
      this.isOpen = !this.isOpen
    },
    setForm (key, val) {
      this.form[key] = val
    },
    setParams (key, val) {
      this.params[key] = val
    },
    setPage (payload) {
      this.params.page = payload
      this.getDataTable()
    },
    setPerPage (payload) {
      this.params.per_page = payload
      this.params.page = 1
      this.getDataTable()
    },
    refreshTable () {
      this.params.page = 1
      this.getDataTable()
    },
    setSearch (payload) {
      this.params.nmtindakan = payload
      this.params.page = 1
      this.getDataTable()
    },
    newData (payload) {
      this.edit = false
      this.resetForm()
      this.setOpen()
      this.setForm('flag', 'baru')
      console.log('new data', payload)
    },
    editData (payload) {
      this.edit = true
      this.setOpen()
      const key = Object.keys(payload)
      key.forEach(a => {
        this.setForm(a, payload[a])
        if (a === 'tgl_mulai_berlaku') {
          const besok = date.addToDate(new Date(), { days: 1 })
          if (!payload[a]) {
            this.disp[a] = date.formatDate(besok, 'DD MMMM YYYY')
            this.setForm(a, date.formatDate(besok, 'YYYY-MM-DD'))

          }
          else {
            const payloadDate = new Date(payload[[a]])
            const diff = date.getDateDiff(payloadDate, besok, 'days')
            if (diff < 0) {
              this.disp[a] = date.formatDate(besok, 'DD MMMM YYYY')
              this.setForm(a, date.formatDate(besok, 'YYYY-MM-DD'))
            } else {
              this.disp[a] = date.formatDate(payloadDate, 'DD MMMM YYYY')
              this.setForm(a, date.formatDate(payloadDate, 'YYYY-MM-DD'))

            }
          }
        }
        if (a == 'ruangan') {
          const ruangansAda = []
          const ruangans = payload[a].split('|')?.filter(a => a != '')
          ruangans.forEach(b => {
            const found = this.allRuangs?.find(c => c.kode == b)
            if (found) {
              ruangansAda.push(found.kode)
            }
          })
          this.disp[a] = ruangansAda
          console.log('edit data', a, payload[a], ruangansAda)
        }
      })

      this.setForm('flag', 'edit')
      // console.log('edit data', key)
    },
    deletesData (payload) {
      // console.log('delete data', payload)

      const besok = date.addToDate(new Date(), { days: 1 })
      const data = {
        kdtindakan: payload.kdtindakan,
        tgl_mulai_berlaku: date.formatDate(besok, 'YYYY-MM-DD')
      }
      this.deleteData(data)
    },
    undeletesData (payload) {
      // console.log('delete data', payload)

      const besok = date.addToDate(new Date(), { days: 1 })
      const data = {
        kdtindakan: payload.kdtindakan,
        tgl_mulai_berlaku: date.formatDate(besok, 'YYYY-MM-DD')
      }
      this.undeleteData(data)
    },
    mergeRuangan () {
      if (this.polis?.length && this.ruangRanap?.length) {
        this.allRuangs = []
        this.allRuangs = [...this.polis?.map(a => { return { nama: a.polirs, kode: a.kodepoli } }), ...this.ruangRanap.map(a => { return { nama: a.groups_nama, kode: a.groups } })]
        // console.log('merge ', this.allRuangs)

      }
    },
    getInitialData () {
      this.getDataTable()
      this.getPoli()
      this.getRuangRanap()
    },
    // api related function
    async getPoli () {
      await api.get('v1/settings/appakses/all-poli')
        .then(resp => {
          this.polis = resp.data
          // console.log('resp poli', this.polis)
          this.mergeRuangan()
        })
    },
    async getRuangRanap () {
      await api.get('v1/simrs/ranap/ruangan/listruanganranap')
        .then(resp => {
          this.ruangRanap = resp.data
          // console.log('resp ruangranap', this.ruangRanap)
          this.mergeRuangan()
        })
    },
    async getDataTable () {
      this.loading = true
      const param = { params: this.params }
      await api.get('v1/simrs/master/listtindakan', param)
        .then(resp => {
          this.loading = false
          console.log('resp tindakan', resp.data)
          this.meta = resp.data
          this.items = resp.data.data
        })
        .catch(() => { this.loading = false })
    },
    setTglMulaiBerlaku (payload) {
      const besok = date.addToDate(new Date(), { days: 1 })
      const payloadDate = new Date(payload)
      const diff = date.getDateDiff(payloadDate, besok, 'days')
      if (diff < 0) {
        this.setForm('tgl_mulai_berlaku', date.formatDate(besok, 'YYYY-MM-DD'))
        this.disp.tgl_mulai_berlaku = date.formatDate(besok, 'DD MMMM YYYY')
        return notifErrVue('tanggal mulai berlaku minimal besok')
      } else {
        this.setForm('tgl_mulai_berlaku', payload)
        this.disp.tgl_mulai_berlaku = date.formatDate(payload, 'DD MMMM YYYY')
      }
      console.log('tgl mulai', payload, diff)
    },
    async saveForm () {
      // isi form ruangan
      if (this.disp.ruangan?.length) {
        this.setForm('ruangan', this.disp.ruangan.join('|'))
      }

      this.loading = true
      await api.post('v1/simrs/master/simpanmastertindakan', this.form)
        .then(resp => {
          this.loading = false
          console.log('resp tindakan', resp.data)
          this.setOpen()
          this.getDataTable()
          notifSuccess(resp)
        })
        .catch(() => { this.loading = false })
    },
    async deleteData (val) {
      this.loading = true
      await api.post('v1/simrs/master/hapusmastertindakan', val)
        .then(resp => {
          this.loading = false
          console.log('hapus tindakan', resp.data)
          this.getDataTable()
          notifSuccess(resp)
        })
        .catch(() => { this.loading = false })
    },
    async undeleteData (val) {
      this.loading = true
      await api.post('v1/simrs/master/tampilkanmastertindakan', val)
        .then(resp => {
          this.loading = false
          console.log('tampilkan tindakan', resp.data)
          this.getDataTable()
          notifSuccess(resp)
        })
        .catch(() => { this.loading = false })
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMasterTindakanOperasiStore, import.meta.hot))
}
