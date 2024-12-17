import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useMappingNakesStore = defineStore('mapping-nakes', {
  state: () => ({
    listsnakes: [],
    loadingListNakes: false,
    loadingSave: false,
    objNakes: null,
    searchResultKepeg: null,
    form: {
      nip: '',
      kdpegsimrs: '',
      statusspesialis: '',
      kdgroupnakes: '',
      kdruangansim: ''
    },
    ygsudahdimappings: [],
    pegawais: []
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    async getNakes() {
      this.loadingListNakes = true
      try {
        const resp = await api.get('v1/simrs/maping/simpegsimrs/listnakes')
        console.log(resp)
        if (resp.status === 200) {
          this.listsnakes = resp?.data
          this.loadingListNakes = false
        }
      } catch (error) {
        console.log(error)
        this.loadingListNakes = false
      }
    },
    async getSimpeg() {
      try {
        const resp = await api.get('v1/simrs/maping/simpegsimrs/pegawaisimpeg')
        console.log('pegawai', resp)
        if (resp.status === 200) {
          this.pegawais = resp?.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    setObjnakes(val) {
      this.objNakes = val
      // this.searchResultKepeg = val?.nama
      const peg = this.pegawais?.filter(x => x.kdpegsimrs === val?.kode)
      this.searchResultKepeg = peg.length ? peg[0] : null
    },
    async saveMapping() {
      const notValidNakes = this.objNakes === null || this.objNakes === ''
      const notValidNKepeg = this.searchResultKepeg === null || this.searchResultKepeg === ''
      if (notValidNakes) {
        notifErrVue('Maaf.... Pilih NAKES Terlebih dahulu!')
      } else if (notValidNKepeg) {
        notifErrVue('Maaf.... Cari Data KEPEGAWAIAN Terlebih dahulu!')
      } else {
        this.loadingSave = true
        this.form.nip = this.searchResultKepeg?.nip
        this.form.kdpegsimrs = this.objNakes?.kode
        this.form.kdgroupnakes = this.objNakes?.kdgroupnakes
        this.form.kdruangansim = this.objNakes?.kdruangan
        this.form.statusspesialis = this.objNakes?.Spesialis
        try {
          const resp = await api.post('v1/simrs/maping/simpegsimrs/simpanmaping', this.form)
          if (resp?.status === 200) {
            this.setDataTermapping(resp?.data?.result)
            notifSuccess(resp)
            this.loadingSave = false
            console.log(this.ygsudahdimappings)
            const target = this.pegawais?.filter(x => x.nip === this.searchResultKepeg?.nip)
            if (target.length) {
              target[0].kdpegsimrs = this.objNakes?.kode
            }
            this.objNakes = null
            this.searchResultKepeg = null
            this.form = {
              nip: '',
              kdpegsimrs: '',
              statusspesialis: '',
              kdgroupnakes: '',
              kdruangansim: ''
            }
          }
          this.loadingSave = false
        } catch (error) {
          console.log(error)

          this.loadingSave = false
        }
      }
    },
    async getDataTermapping(arr) {
      const resp = await api.get('v1/simrs/maping/simpegsimrs/datatermaping')
      if (resp.status === 200) {
        this.setDataTermapping(resp?.data)
      }
    },
    setDataTermapping(arr) {
      this.ygsudahdimappings = arr.length ? arr?.map(x => x.kdpegsimrs) : []
    }
  }
})
