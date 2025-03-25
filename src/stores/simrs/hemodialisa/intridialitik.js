/**
 * Field   Type          Collation          Null    Key     Default  Extra           Privileges                       Comment
------  ------------  -----------------  ------  ------  -------  --------------  -------------------------------  ---------------
id      bigint(12)    (NULL)             NO      PRI     (NULL)   auto_increment  select,insert,update,references
rs1     varchar(100)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  noreg
rs2     varchar(50)   latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  norm
rs3     datetime      (NULL)             YES             (NULL)                   select,insert,update,references
rs4     varchar(10)   latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  jam ke
rs5     varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  keluhan
rs6     varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  bb
rs7     varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  kesadaran
rs8     varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  tekanan darah
rs9     varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  napas
rs10    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  suhu
rs11    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  qb
rs12    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  qd
rs13    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  tekanan vena
rs14    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  tmp
rs15    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  uf
rs16    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  assesment
rs17    varchar(255)  latin1_swedish_ci  YES             (NULL)                   select,insert,update,references  perawat

 */

import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { useListPasienHemodialisaStore } from "./hemodialisa"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"

export const useIntridialitikHemodialisaStore = defineStore('intridialitik-hemodialisa', {
  state: () => ({
    loading: false,
    pengunjung: useListPasienHemodialisaStore(),
    form: {
      noreg: null,
      norm: null,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      jamKe: 'PRE HD',
      keluhan: '',
      bb: '',
      tkDarah: '',
      kesadaran: '',
      napas: '',
      suhu: '',
      qb: '',
      qd: '',
      tkVena: '',
      tmp: '',
      uf: '',
      assasement: ''
    },
    jamKeOptions: ['PRE HD', '1', '2', '3', '4', '5', '6', '7', '8', 'POST HD']
  }),
  actions: {
    initPasien () {
      // console.log('pasie', this.pengunjung?.pasien)
      this.setForm('noreg', this.pengunjung?.pasien?.noreg)
      this.setForm('norm', this.pengunjung?.pasien?.norm)
    },
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm () {
      this.form = {
        noreg: null,
        norm: null,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        jamKe: 'PRE HD',
        keluhan: '',
        bb: '',
        tkDarah: '',
        kesadaran: '',
        napas: '',
        suhu: '',
        qb: '',
        qd: '',
        tkVena: '',
        tmp: '',
        uf: '',
        assasement: ''
      }
    },
    simpan () {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/hemodialisa/layanan/intradialitik/simpan', this.form)
          .then(resp => {
            this.loading = false
            this.pengunjung.injectDataPasien(this.pengunjung?.pasien?.noreg, resp?.data?.data, 'intradialitik')
            console.log('resp', resp?.data, this.pengunjung?.pasien)
            notifSuccess(resp)
            resolve(resp?.data)
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIntridialitikHemodialisaStore, import.meta.hot))
}
