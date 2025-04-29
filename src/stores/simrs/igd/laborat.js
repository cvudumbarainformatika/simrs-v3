import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
// import { dateDbFormat, dateFullFormat, formatJam } from 'src/modules/formatter'
import { usePengunjungIgdStore } from './pengunjung'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useLaboratIgd = defineStore('laborat-igd', {
  state: () => ({
    // laborat
    caripemeriksaanlab: null,
    masterlaborat: [],
    headerlaborats: [],
    loadingMasterLab: false,
    notalaborats: [],
    notalaborat: '',
    permintaanLaborats: '',
    permintaans: [],
    form: {
      // norm: '',
      // noreg: '',
      // kdpoli: '',
      // kdpemeriksaan: '',
      // gruper: '',
      // biaya_sarana: 0,
      // biaya_layanan: 0,
      jumlah: 1,
      puasa_pasien: 'Tidak',
      prioritas_pemeriksaan: 'Tidak',
      diagnosa_masalah: '',
      catatan_permintaan: '',
      unit_pengirim: '',
      // asal_sumber_spesimen: '',
      // lokasi_pengambilan_spesimen: '',
      // jumlah_spesimen_klinis: 1,
      // volume_spesimen_klinis: 0,
      // metode_pengambilan_spesimen: '',
      // tanggalpengambilanspesimen: dateDbFormat(new Date()),
      // jampengambilanspesimen: formatJam(new Date()),
      // waktu_pengambilan_spesimen: dateFullFormat(new Date()),
      // kondisi_spesimen: '',
      // metode_pengiriman_hasil: 'Penyerahan langsung', // || Dikirim via surel
      // tanggalfiksasi: dateDbFormat(new Date()),
      // jamfiksasi: dateDbFormat(new Date()),
      // waktu_fiksasi_spesimen: dateFullFormat(new Date()),
      // cairan_fiksasi: 0, // ml
      // volume_cairan_fiksasi: 0, // ml
      // petugas: ''
      details: []
    },
    loadingSaveLab: false,
    pemeriksaanslab: []
  }),
  actions: {
    // =============================================================================================================================================LABORAT
    async getMasterLaborat () {
      this.loadingMasterLab = true
      try {
        const resp = await api.get('v1/simrs/penunjang/laborat/dialoglaboratpoli')
        // console.log('masterlaborat', resp)
        if (resp.status === 200) {
          const arr = resp.data
          const arr2 = arr?.length > 0
            ? arr.filter(x => x.hidden === '').map(x =>
              ({
                gruper: x.gruper !== '' ? x.gruper : x.pemeriksaan,
                pemeriksaan: x.pemeriksaan,
                jenis: x.gruper !== '' ? 'PAKET' : 'NON-PAKET',
                biayapoliumum: parseInt(x.hargapelayananpoliumum) + parseInt(x.hargasaranapoliumum),
                biayapolispesialis: parseInt(x.hargapelayananpolispesialis) + parseInt(x.hargasaranapolispesialis),
                kode: x.kode,
                aslix: x
              })
            )
            : []
          const groupped = this.groupByx(arr2, gruper => gruper.gruper)
          this.masterlaborat = groupped
          this.loadingMasterLab = false
          // console.log('group pemeriksaan', groupped)
          // const result = Object.groupBy(arr2, ({ gruper }) => gruper)
          // console.log('arr pemeriksaan', result)

          // const grouped = arr?.length ? Object.groupBy(arr, ({ gruper }) => gruper) : {}
          // const header = Object.keys(grouped).map((key) => ({ name: key }))
          // const result = arr.sort((a, b) => (a.gruper > b.gruper) ? 1 : ((b.gruper > a.gruper) ? -1 : 0))
          // this.headerlaborats = header
          // this.masterlaborat = result
          // console.log('header', header)
          // console.log('sort', result)
          // this.loadingMasterLab = false
        }
        this.loadingMasterLab = false
      }
      catch (error) {
        this.loadingMasterLab = false
      }
    },
    groupByx (list, keyGetter) {
      const map = new Map()
      list.forEach((item) => {
        const key = keyGetter(item)
        const collection = map.get(key)
        if (!collection) {
          map.set(key, [item])
        }
        else {
          collection.push(item)
        }
      })
      const arr = Array.from(map, ([name, value]) => ({ name, value }))
      return arr
    },

    async getNota (pasien) {
      const payload = { params: { noreg: pasien?.noreg } }
      const resp = await api.get('v1/simrs/penunjang/laborat/getnotaIgd', payload)
      console.log('notalaborat', resp)
      if (resp.status === 200) {
        // this.setNotas(resp?.data)
        // const arr = resp.data.map(x => x.nota)
        // this.notalaborats = arr?.length ? arr : []
        // this.notalaborats.push('BARU')
        // this.notalaborat = this.notalaborats[0]
      }
    },

    async getNotaold (pasien) {
      const payload = { params: { noreg: pasien?.noreg } }
      const resp = await api.get('v1/simrs/penunjang/laborat/getnotaoldIgd', payload)
      console.log('notalaboratx', resp)
      if (resp.status === 200) {
        this.setNotasold(resp?.data)
        // const arr = resp.data.map(x => x.nota)
        // this.notalaborats = arr?.length ? arr : []
        // this.notalaborats.push('BARU')
        // this.notalaborat = this.notalaborats[0]
      }
    },
    setCariLabNull () {
      this.caripemeriksaanlab = null
    },
    setForm (key, value) {
      this.form[key] = value
    },
    setPermintaanLaborats (val, arr) {
      this.permintaanLaborats = val
      this.permintaans = arr
    },
    setDetails (pemeriksaan) {
      // this.form.details = []
      const thumb = []
      // console.log('pemeriksaan', pemeriksaan)
      for (let i = 0; i < pemeriksaan?.value?.length; i++) {
        const element = pemeriksaan?.value[i]
        this.form.biaya_layanan = element?.aslix?.hargapelayananpolispesialis // ini bisa element?.aslix?.hargapelayananpoliumum
        this.form.biaya_sarana = element?.aslix?.hargasaranapolispesialis // ini bisa element?.aslix?.hargasaranapoliumum
        const obj = {
          kode: element?.aslix?.kode,
          gruper: element?.aslix.gruper
        }
        thumb.push(obj)
      }
      this.form.details = thumb
      // console.log('thumb', this.form)
      // return new Promise((resolve, reject) => {
      //   resolve()
      // })
    },
    async saveOrderLaborat (pasien) {
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingSaveLab = true
      this.form.norm = pasien?.norm
      this.form.noreg = pasien?.noreg
      this.form.waktu_pengambilan_spesimen = this.form.tanggalpengambilanspesimen + ' ' + this.form.jampengambilanspesimen
      this.form.waktu_fiksasi_spesimen = this.form.tanggalfiksasi + ' ' + this.form.jamfiksasi
      // this.form.nota = this.notalaborat === 'LIHAT SEMUA' || this.notalaborat === 'BARU' ? '' : this.notalaborat
      this.form.nota = ''
      if (this.form.prioritas_pemeriksaan === 'Iya' || this.form.prioritas_pemeriksaan === 'iya') {
        this.form.biaya_layanan = this.percentage(this.form.biaya_layanan)
        this.form.biaya_sarana = this.percentage(this.form.biaya_sarana)
      }

      this.form.kdsistembayar = pasien?.kodesistembayar
      this.form.kodedokter = pasien?.kodedokter
      // console.log('save', this.form)
      try {
        const resp = await api.post('v1/simrs/penunjang/laborat/simpanpermintaanlaborat', this.form)
        // console.log('save resp', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungIgdStore()
          const isi = resp?.data?.result
          storePasien.injectDataPasien(pasien, isi, 'laboratold')
          this.setNotasx(resp?.data?.nota)
          notifSuccess(resp)
          this.loadingSaveLab = false
          this.initReset()
        }
        this.loadingSaveLab = false
      }
      catch (error) {
        // console.log('save laborat', error)
        this.loadingSaveLab = false
      }
    },

    async saveOrderLaboratBaru (pasien) {
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingSave = true
      this.form.norm = pasien?.norm
      this.form.noreg = pasien?.noreg
      this.form.kodedokter = pasien?.kodedokter
      this.form.unit_pengirim = pasien?.kodepoli
      // this.form.waktu_pengambilan_spesimen = this.form.tanggalpengambilanspesimen + ' ' + this.form.jampengambilanspesimen
      // this.form.waktu_fiksasi_spesimen = this.form.tanggalfiksasi + ' ' + this.form.jamfiksasi
      this.form.nota = this.notalaborat === 'BARU' ? '' : this.notalaborat
      // this.form.nota = ''
      if (this.form.prioritas_pemeriksaan === 'Iya' || this.form.prioritas_pemeriksaan === 'iya') {
        this.form.biaya_layanan = this.percentage(this.form.biaya_layanan)
        this.form.biaya_sarana = this.percentage(this.form.biaya_sarana)
      }
      this.form.kdsistembayar = pasien?.kodesistembayar
      this.form.kodedokter = pasien?.kodedokter
      // const arr = []

      this.form.details = []
      for (let i = 0; i < this.permintaans?.length; i++) {
        const element = this.permintaans[i]
        for (let i = 0; i < element?.value?.length; i++) {
          const el = element?.value[i]
          const biayalayanan = el?.aslix?.hargapelayananpolispesialis // ini bisa el?.aslix?.hargapelayananpoliumum
          const biayasarana = el?.aslix?.hargasaranapolispesialis // ini bisa el?.aslix?.hargasaranapoliumum
          const objec = {
            kode: el?.aslix?.kode,
            gruper: el?.aslix.gruper,
            biaya_layanan: biayalayanan,
            biaya_sarana: biayasarana
          }
          this.form.details.push(objec)
        }
      }

      // const formbaru = { form: arr }
      const formbaru = this.form
      // console.log('payload', formbaru)

      try {
        const resp = await api.post('v1/simrs/penunjang/laborat/simpanpermintaanlaboratbaruIgd', formbaru)
        // console.log('save resp', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungIgdStore()
          const arr = resp?.data?.result
          if (arr?.length) {
            for (let i = 0; i < arr?.length; i++) {
              const isi = arr[i]
              storePasien.injectDataPasien(pasien, isi, 'laborats')
            }
          }
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
          this.loadingSaveLab = false
          this.initReset()
        }
        this.loadingSaveLab = false
      }
      catch (error) {
        // console.log('save laborat', error)
        this.loadingSaveLab = false
      }
    },

    percentage (val) {
      if (!isNaN(val)) {
        const hasil = val + (val * 25 / 100)
        return hasil
      }
      return 0
    },

    async hapusLaborat (pasien, id) {
      const payload = { id, noreg: pasien?.noreg }
      try {
        const resp = await api.post('v1/simrs/penunjang/laborat/hapuspermintaanlaborat', payload)
        // console.log('hapus laborat', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungIgdStore()
          storePasien.hapusDataLaborat(pasien, id)
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
        }
      }
      catch (error) {
        console.log('hapus laborat', error)
      }
    },
    async hapusLaboratBaru (pasien, id) {
      const payload = { id, noreg: pasien?.noreg }
      try {
        const resp = await api.post('v1/simrs/penunjang/laborat/hapuspermintaanlaboratbaruIgd', payload)
        // console.log('hapus laborat', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungIgdStore()
          const databaru = resp?.data?.result
          storePasien.hapusDataLaboratBaru(pasien, id, databaru)
          this.setNotasx(resp?.data?.nota)
          notifSuccess(resp)
        }
      }
      catch (error) {
        console.log('hapus laborat', error)
      }
    },
    setNotas (array) {
      const arr = array.map(x => x.nota)
      this.notalaborats = arr?.length ? arr : []
      // this.notalaborats.push('LIHAT SEMUA')
      this.notalaborats.push('BARU')
      this.notalaborat = this.notalaborats[0]
    },
    setNotasold (array) {
      console.log('sasa', array)
      const arr = array.map(x => x.rs2)
      this.notalaborats = arr?.length ? arr : []
      // this.notalaborats.push('LIHAT SEMUA')
      this.notalaborats.push('BARU')
      this.notalaborat = this.notalaborats[0]
    },
    setNotasx (arr) {
      this.notalaborats = arr?.length ? arr : []
      // this.notalaborats.push('LIHAT SEMUA')
      this.notalaborats.push('BARU')
      this.notalaborat = this.notalaborats[0]
    },
    // =============================================================================================================================================LABORAT

    initReset () {
      this.caripemeriksaanlab = null
      this.permintaanLaborats = ''
      this.form.diagnosa_masalah = ''
      this.form.catatan_permintaan = ''
      this.form.puasa_pasien = 'Tidak'
      this.form.prioritas_pemeriksaan = 'Tidak'
      this.form.details = []
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }

})
