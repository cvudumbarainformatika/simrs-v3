import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useMasterTarifLaboratoriumStore = defineStore('master_tarif_laboratorium', {
  state: () => ({
    isOpen: false,
    edit: false,
    loading: false,
    items: [],
    meta: {},
    params: {
      q: '',
      per_page: 10,
      page: 1
    },
    form: {},
    disp: {},
    kelompoks: [],
    jenises: [],
  }),
  actions: {
    resetForm () {
      this.setForm('kode', '')
      this.setForm('nama', '')
      this.setForm('kelompok', '')
      this.setForm('dasar_perubahan', '')
      const col = [
        'hs1',
        'hp1',
        'tf1',

        'hs2',
        'hp2',
        'tf2',

        'pss',
        'psp',
        'tfps',

        'hcus',
        'hcup',
        'tfhcu',

        'hcs',
        'hcp',
        'tfhc',

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
      this.params.q = payload
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
        kode: payload.kode,
        tgl_mulai_berlaku: date.formatDate(besok, 'YYYY-MM-DD')
      }
      this.deleteData(data)
    },
    undeletesData (payload) {
      // console.log('delete data', payload)

      const besok = date.addToDate(new Date(), { days: 1 })
      const data = {
        kode: payload.kode,
        tgl_mulai_berlaku: date.formatDate(besok, 'YYYY-MM-DD')
      }
      this.undeleteData(data)
    },

    getInitialData () {
      this.getDataTable()
      this.getKelompoks()
      this.getJenis()
    },
    // api related function
    async getKelompoks () {
      await api.get('v1/simrs/master/tarif-laborat/list-kelompok')
        .then(resp => {
          this.kelompoks = resp.data
        })
    },
    async getJenis () {
      await api.get('v1/simrs/master/tarif-laborat/list-jenis')
        .then(resp => {
          this.jenises = resp.data
        })
    },
    async getDataTable () {
      this.loading = true
      const param = { params: this.params }
      await api.get('v1/simrs/master/tarif-laborat/list', param)
        .then(resp => {
          this.loading = false
          console.log('resp lab', resp.data)
          this.meta = resp.data?.meta ?? resp.data
          this.items = resp?.data?.data
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
      await api.post('v1/simrs/master/tarif-laborat/simpan', this.form)
        .then(resp => {
          this.loading = false
          console.log('resp tindakan', resp.data)
          this.setOpen()
          this.getInitialData()
          notifSuccess(resp)
        })
        .catch(() => { this.loading = false })
    },
    async deleteData (val) {
      this.loading = true
      await api.post('v1/simrs/master/tarif-laborat/hapus', val)
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
      await api.post('v1/simrs/master/tarif-laborat/tampilkan', val)
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
  import.meta.hot.accept(acceptHMRUpdate(useMasterTarifLaboratoriumStore, import.meta.hot))
}
