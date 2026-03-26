import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"
import { usePermintaanOperasistore } from "./permintaanoperasi"
import { date } from "quasar"

export const useLaporanOperasiStore = defineStore('laporan_operasi_store', {
  state: () => ({
    loading: false,
    pasien: null,
    params: {
      q: '',
      page: 1,
      per_page: 10
    },
    tarif: [],
    form: {},
    notaTindakans: ['Baru'],
    formTindakan: {},
    optionJenisAnastesis: ['General Tiva', 'General FM', 'General Intubasi', 'Lokal', 'Regional'],
    optionKlasifikasiOperasis: ['Operasi Bersih', 'Operasi Bersih Terkontaminasi', 'Operasi Kotor', 'Operasi Terkontaminasi'],
    optionYT: ['YA', 'TIDAK'],
    optionAsa: ['-', '1', '2', '3', '4', '5'],
    nakes: [],
    notaLapOperasis: [],
    notaLapOperasi: null
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm () {
      console.log('reset Form')

      this.setForm('tanggal', date.formatDate(Date.now(), 'YYYY-MM-DD'))
      this.setForm('noreg', this.pasien?.noreg)
      this.setForm('nota', this.pasien?.rs2)
      this.setForm('tindakan', this.pasien?.tindakanop?.id)

      this.setForm('rs4', '')
      this.setForm('rs5', '')
      this.setForm('rs6', '')
      this.setForm('rs7', '')
      this.setForm('rs8', '')
      this.setForm('rs9', '')
      this.setForm('rs10', date.formatDate(Date.now(), 'YYYY-MM-DD'))
      this.setForm('rs11', date.formatDate(Date.now(), 'HH:mm:ss'))
      this.setForm('rs12', date.formatDate(Date.now(), 'HH:mm:ss'))
      this.setForm('rs13', '')
      this.setForm('rs14', '')
      this.setForm('asa', '')
      this.setForm('jenis_darah_masuk', '')
      this.setForm('jd_keluar', 0)
      this.setForm('jd_masuk', 0)

      this.setForm('tTime', false)
    },
    assignForm (data) {
      console.log('assignForm laporan', data)
      if (!data) return this.resetForm()
      const keys = Object.keys(data)
      if (keys?.length <= 0) return this.resetForm()
      this.setForm('tanggal', data.rs3)
      this.setForm('noreg', data.rs1)
      this.setForm('nota', data?.rs2)
      this.setForm('tindakan', data.tindakan)

      this.setForm('rs4', data.rs4)
      this.setForm('rs5', data.rs5)
      this.setForm('rs6', data.rs6)
      this.setForm('rs7', data.rs7)
      this.setForm('rs8', data.rs8)
      this.setForm('rs9', data.rs9)
      this.setForm('rs10', data.rs10)
      this.setForm('rs11', data.rs11)
      this.setForm('rs12', data.rs12)
      this.setForm('rs13', data.rs13)
      this.setForm('rs14', data.rs14)
      this.setForm('rs15', data.rs15)
      this.setForm('asa', data.asa)
      this.setForm('jenis_darah_masuk', data.jenis_darah_masuk)
      this.setForm('jd_keluar', data.jd_keluar)
      this.setForm('jd_masuk', data.jd_masuk)

      this.setForm('tTime', parseInt(data.ttime) == 1 ? true : false)
    },

    setFormTindakan (key, val) {
      this.formTindakan[key] = val
    },
    resetFormTindakan () {
      let kelas = null
      console.log('reset Form Tindakan')

      if (this.pasien.rs10 == 'POL014') kelas = 'IRD'
      else if (this.pasien.rs10.includes('POL') && !this.pasien.rs10 == 'POL014') kelas = 'poli'
      else kelas = this.pasien.ruangranap?.rs3

      this.setFormTindakan('tanggal', date.formatDate(Date.now(), 'YYYY-MM-DD'))
      this.setFormTindakan('noreg', this.pasien?.noreg)
      this.setFormTindakan('nota', 'Baru')
      this.setFormTindakan('rs14', this.pasien?.rs14)
      this.setFormTindakan('rs9', this.pasien?.kodedokter)
      this.setFormTindakan('rs11', [])
      this.setFormTindakan('rs12', '')
      this.setFormTindakan('rs13', [])
      this.setFormTindakan('rs15', this.pasien?.rs13)
      this.setFormTindakan('rs16', kelas)
      this.setFormTindakan('tanpaAnas', false)
      this.setFormTindakan('cito', false)
      this.setFormTindakan('kode', '')
      this.setFormTindakan('tarif', 0)
      this.setFormTindakan('an', 0)
      this.setFormTindakan('js', 0)
      this.setFormTindakan('jp', 0)
      this.setFormTindakan('subtotal', 0)
      this.setFormTindakan('jumlah', 1)
      this.setFormTindakan('sisbaysplit', '')
      this.setFormTindakan('total_split', 0)
    },

    assignFormTindakan (data) {
      console.log('assignForm Tindakan', data)
      if (!data) return this.resetFormTindakan()
      const keys = Object.keys(data)
      if (keys?.length <= 0) return this.resetFormTindakan()

      this.setFormTindakan('noreg', data?.rs1)
      this.setFormTindakan('nota', data?.rs2)
      this.setFormTindakan('tanggal', data.rs3)
      this.setFormTindakan('kode', data.rs4)
      this.setFormTindakan('js', parseInt(data.rs5))
      this.setFormTindakan('jp', parseInt(data.rs6))
      this.setFormTindakan('an', parseInt(data.rs7))
      this.setFormTindakan('jumlah', data.rs8)
      const dk = this.cariNakes(data?.rs9, 'dokter')
      this.setFormTindakan('rs9', dk)
      this.setFormTindakan('rs10', data?.rs10)
      const aop = this.cariNakes(data?.rs11, 'perawat')
      this.setFormTindakan('rs11', aop)
      const an = this.cariNakes(data?.rs12, 'dokter')
      this.setFormTindakan('rs12', an)
      const asn = this.cariNakes(data?.rs13, 'perawat')
      this.setFormTindakan('rs13', asn)
      this.setFormTindakan('rs14', data?.rs14)
      this.setFormTindakan('rs15', data?.rs15)
      this.setFormTindakan('rs16', data.rs16)
      this.setFormTindakan('tanpaAnas', parseInt(data.rs7) <= 0 ? true : false)
      this.setFormTindakan('cito', data.rs18 == 'cito' ? true : false)
      this.setFormTindakan('tarif', parseInt(data.rs5) + parseInt(data.rs6) + parseInt(data.rs7))
      this.setFormTindakan('subtotal', parseInt(data.rs5) + parseInt(data.rs6) + parseInt(data.rs7))
      this.setFormTindakan('sisbaysplit', data.rs19)
      this.setFormTindakan('total_split', data.rs20)
    },
    cariNakes (val, type) {
      const dat = val?.split(';').filter(x => !!x)
      const nakes = []
      dat.forEach(x => {
        const nak = this.nakes.find(y => y.kdpegsimrs === x)
        if (nak) nakes.push(nak)
      })
      // console.log('cari nakes', dat)
      return nakes.length > 0 ? (type == 'dokter' ? nakes.map(x => x.kdpegsimrs)[0] : nakes.map(x => x.kdpegsimrs)) : (type == 'dokter' ? '' : [])
    },
    getTarifOp (val) {
      const param = {
        params: {
          q: val
        }
      }
      return new Promise(resolve => {
        api.get('v1/simrs/penunjang/ok/tindakan-op/get-tindakan-op', param)
          .then(({ data }) => {
            this.tarif = data?.data ?? data
            // console.log('tarif', this.tarif)
            resolve(data)
          })
      })

    },
    async getNakes () {
      try {
        const { data } = await api.get('v1/simrs/penunjang/surgical/get-nakes')
        this.nakes = data?.data ?? data
        // console.log('nakes', this.nakes)

      } catch (e) {

      }
    },
    simpanLaporan (pasien) {
      this.loading = true
      const pengunjung = usePermintaanOperasistore()
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/laporan-op/simpan', this.form)
          .then(resp => {
            this.loading = false
            console.log('simpan', resp?.data)
            this.pasien.laporanop = resp?.data?.data
            // this.form = resp?.data?.data
            // pengunjung.injectDataPasien(pasien, resp?.data?.data, 'tindakanop')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    hapusLaporan (data) {
      this.loading = true
      const form = {
        id: data?.id,
        noreg: data?.rs1,
        nota: data?.rs2,
      }
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/laporan-op/hapus', form)
          .then(resp => {
            this.loading = false
            const data = resp?.data?.data
            console.log('s hapus', data, this.pasien)
            this.pasien.laporanop = null
            // this.hapusDariPengunjung(data, 'tindakanop')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    simpanFormTindakan () {
      this.loading = true
      // const pengunjung = usePermintaanOperasistore()
      const payload = { ...this.formTindakan }
      const p1 = payload.rs9 + ';'
      payload.rs9 = p1
      const p2 = payload?.rs11?.join(';') + ';'
      payload.rs11 = p2
      const p3 = payload.rs12 + ';'
      payload.rs12 = p3
      const p4 = payload?.rs13?.join(';') + ';'
      payload.rs13 = p4
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/tindakan-op/simpan', payload)
          .then(resp => {
            this.loading = false
            const data = resp?.data?.data
            const nota = resp?.data?.nota
            console.log('simpan', data, this.pasien)
            const indexMany = this.pasien.manytindakanop.findIndex(item => item.id === data?.id)
            if (indexMany >= 0) this.pasien.manytindakanop[indexMany] = data
            else this.pasien.manytindakanop.push(data)

            this.pasien.tindakanop = data
            const indexNota = this.notaTindakans.findIndex(item => item === nota)
            if (indexNota < 0) this.notaTindakans.push(nota)
            this.resetFormTindakan()
            // this.form = resp?.data?.data
            // pengunjung.injectDataPasien(this.pasien, data, 'tindakanop')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    hapusTindakanOp (data) {
      this.loading = true
      const form = {
        id: data?.id,
        noreg: data?.rs1,
        nota: data?.rs2,
      }
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/tindakan-op/hapus', form)
          .then(resp => {
            this.loading = false
            const data = resp?.data?.data
            console.log('s hapus', data, this.pasien)
            this.pasien.tindakanop = null
            // this.hapusDariPengunjung(data, 'tindakanop')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    hapusDariPengunjung (data, kode) {
      // const pengunjung = usePermintaanOperasistore()
      // const pasien = pengunjung.items.find(x => x.noreg === data.noreg)
      const pasien = this.pasien
      const tipe = typeof pasien[kode]
      console.log('hapus', pasien, tipe, data)

      if (tipe === 'object') {
        pasien[kode] = null
      } else {
        const target = pasien[kode]?.find(x => x.id === val.id)
        if (target) {
          target = null
        }
        else {
          const index = pasien[kode]?.findIndex(x => x.id === val.id)
          pasien[kode].splice(index, 1)
        }
      }

    }
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanOperasiStore, import.meta.hot))
}
