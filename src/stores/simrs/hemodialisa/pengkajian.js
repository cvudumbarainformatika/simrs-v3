/*
     * Field   Type          Null    Default              Comment
     * ------  ------------  ------  -------------------  -------------
     * id      bigint(12)    NO      (NULL)               id
     * rs1     varchar(100)  YES     (NULL)               noreg
     * rs2     varchar(50)   YES     (NULL)               norm
     * rs3     datetime      YES     0000-00-00 00:00:00  tgl
     * rs4     varchar(255)  YES     (NULL)               alasan
     * rs5     varchar(255)  YES     (NULL)               riwayat
     * rs6     varchar(255)  YES     (NULL)               hubungan
     * rs7     varchar(255)  YES     (NULL)               psokologis
     * rs8     varchar(255)  YES     (NULL)               lain
     * rs9     varchar(255)  YES     (NULL)               td
     * rs10    varchar(255)  YES     (NULL)               nadi
     * rs11    varchar(255)  YES     (NULL)               suhu
     * rs12    varchar(255)  YES     (NULL)               tb
     * rs13    varchar(255)  YES     (NULL)               bb
     * rs14    varchar(255)  YES     (NULL)               parameter / nafsu makan
     * rs15    varchar(255)  YES     (NULL)               parameterx /  diagnosa khusus
     * rs16    varchar(255)  YES     (NULL)               parameterxx / status fungsional
     * rs17    varchar(255)  YES     (NULL)               fungsional
     * rs18    varchar(255)  YES     (NULL)               lainx
     *
     *
     * */
import { acceptHMRUpdate, defineStore } from "pinia"
import { useListPasienHemodialisaStore } from "./hemodialisa"
import { date } from "quasar"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"

export const usePengkajianHemodialisaStore = defineStore('pengkajian-hemodialisa', {
  state: () => ({

    loading: false,
    pengunjung: useListPasienHemodialisaStore(),
    form: {
      noreg: null,
      norm: null,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      alasan: '', // rs4
      riwayat: '', // rs5
      hubungan: 'Baik', // rs6
      psikologis: 'Tenang', // rs7
      lain: '', // jika psikologis = Lain-lain rs8
      td: '', // rs9
      nadi: '', // rs10
      suhu: '',   // rs11
      tb: '', // rs12
      bb: '', // rs13
      penurunanBB: 'Tidak ada Penurunan Berat Badan', // rs14
      asupanNafsu: 'Ya', // rs16
      diagKhus: 'Ya', // rs15
      fungsional: 'Mandiri', // rs17
      lainx: '', // jika fungsional = Perlu Bantuan rs18
    },
    yatis: ['Ya', 'Tidak'],
    hubungans: ['Baik', 'Tidak Baik'],
    psikologis: ['Tenang', 'Cemas', 'Takut', 'Marah', 'Kecenderungan Bunuh Diri', 'Lain-lain'],
    penurunanBeratBadans: ['Tidak ada Penurunan Berat Badan', 'Tidak Yakin / Tidak Tahu / Terasa Baju Longgar', 'Ya, Turun 1-5 kg', 'Ya, Turun 6-10 kg', 'Ya, Turun 11-15 kg', 'Ya, > 15 kg'],
    statusFungs: ['Mandiri', 'Perlu Bantuan']
  }),
  actions: {
    initPasien () {
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
        alasan: '',
        riwayat: '',
        hubungan: 'Baik',
        psikologis: 'Tenang',
        lain: '', // jika psikologis = Lain-lain
        td: '',
        nadi: '',
        suhu: '',
        tb: '',
        bb: '',
        penurunanBB: 'Tidak ada Penurunan Berat Badan',
        asupanNafsu: 'Ya',
        diagKhus: 'Ya',
        fungsional: 'Mandiri',
        lainx: '', // jika fungsional = Perlu Bantuan
      }
    },
    simpan () {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/hemodialisa/layanan/pengkajian/simpan', this.form)
          .then(resp => {
            this.loading = false
            const data = resp?.data?.data
            const index = this.pengunjung?.pasien?.pengkajian?.findIndex(item => item.id === data?.id)

            if (index >= 0) {
              this.pengunjung.pasien.pengkajian[index] = data
            }
            else this.pengunjung.pasien.pengkajian?.push(data)

            notifSuccess(resp)
            resolve(data)
          }).catch(err => {
            this.loading = false
            reject(err)
          })
      })
    },
    hapus (item) {
      item.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/hemodialisa/layanan/pengkajian/hapus', item)
          .then(resp => {
            const index = this.pengunjung?.pasien?.pengkajian?.findIndex(it => it.id === item.id)
            if (index >= 0) this.pengunjung.pasien.pengkajian.splice(index, 1)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            delete item.loading
          })
      })

    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePengkajianHemodialisaStore, import.meta.hot))
}
