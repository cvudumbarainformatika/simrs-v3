import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat, dateFullFormat, formatJam } from 'src/modules/formatter'
import { usePengunjungPoliStore } from './pengunjung'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { usePengunjungRanapStore } from '../../ranap/pengunjung'

export const usePenunjangPoli = defineStore('penunjang-poli', {
  state: () => ({
    tab: 'Laborat',
    // tabs: ['Laborat', 'Radiologi', 'Cardio', 'EEG', 'Hemodialisa', 'USG 4 Dimensi', 'Thread Mill', 'Endoscope', 'Psikologi'],
    tabs: [
      { name: 'Laborat', page: 'Laborat' },
      { name: 'Radiologi', page: 'Radiologi' },
      { name: 'ODC', page: 'Operasi' },
      { name: 'Rehab Medik', page: 'Fisio' },
      { name: 'Diet', page: 'Diet' },
      { name: 'Penunjang Lain', page: 'PenunjangLain' }
    ],
    // laborat
    caripemeriksaanlab: null,
    masterlaborat: [],
    loadingMasterLab: false,
    caripemeriksaanradiologi: '',
    masterradiologi: [],
    notalaborats: [],
    notalaborat: null,
    permintaanLaborats: '',
    permintaans: [],
    form: {
      // norm: '',
      // noreg: '',
      // kdpoli: '',
      // kdpemeriksaan: '',
      gruper: '',
      biaya_sarana: 0,
      biaya_layanan: 0,
      jumlah: 1,
      puasa_pasien: 'Tidak',
      prioritas_pemeriksaan: 'Tidak',
      diagnosa_masalah: '',
      catatan_permintaan: '',
      unit_pengirim: '',
      asal_sumber_spesimen: '',
      lokasi_pengambilan_spesimen: '',
      jumlah_spesimen_klinis: 1,
      volume_spesimen_klinis: 0,
      metode_pengambilan_spesimen: '',
      tanggalpengambilanspesimen: dateDbFormat(new Date()),
      jampengambilanspesimen: formatJam(new Date()),
      waktu_pengambilan_spesimen: dateFullFormat(new Date()),
      kondisi_spesimen: '',
      metode_pengiriman_hasil: 'Penyerahan langsung', // || Dikirim via surel
      tanggalfiksasi: dateDbFormat(new Date()),
      jamfiksasi: dateDbFormat(new Date()),
      waktu_fiksasi_spesimen: dateFullFormat(new Date()),
      cairan_fiksasi: 0, // ml
      volume_cairan_fiksasi: 0, // ml
      // petugas: ''
      details: []
    },
    loadingSaveLab: false,
    pemeriksaanslab: [],
    pemeriksaansradiologi: []
  }),
  actions: {
    // =============================================================================================================================================LABORAT
    async getMasterLaborat () {
      this.loadingMasterLab = true
      try {
        const resp = await api.get('v1/simrs/penunjang/laborat/dialoglaboratpoli')
        // // console.log('masterlaborat', resp)
        if (resp.status === 200) {
          const arr = resp.data
          const arr2 = arr.length > 0
            ? arr.map(x =>
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
          const groupped = this.groupBy(arr2, gruper => gruper.gruper)
          this.masterlaborat = groupped
          this.loadingMasterLab = false
          // console.log('group pemeriksaan', groupped)
        }
        this.loadingMasterLab = false
      }
      catch (error) {
        this.loadingMasterLab = false
      }
    },
    groupBy (list, keyGetter) {
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
      const resp = await api.get('v1/simrs/penunjang/laborat/getnota', payload)
      // // console.log('notalaborat', resp)
      if (resp.status === 200) {
        this.setNotas(resp?.data)
        // const arr = resp.data.map(x => x.nota)
        // this.notalaborats = arr.length ? arr : []
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
      // // console.log('pemeriksaan', pemeriksaan)
      for (let i = 0; i < pemeriksaan?.value.length; i++) {
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
        // // console.log('save resp', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          const isi = resp?.data?.result
          storePasien.injectDataPasien(pasien, isi, 'laborats')
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

    async saveOrderLaboratBaru (pasien, isRanap) {
      console.log('pasien', pasien)
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingSave = true
      this.form.norm = pasien?.norm
      this.form.noreg = pasien?.noreg
      this.form.kodedokter = pasien?.kodedokter
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
      const arr = []

      for (let i = 0; i < this.permintaans.length; i++) {
        const element = this.permintaans[i]
        const obj = {
          form: this.form,
          details: []
        }
        // // console.log('pemeriksaan', pemeriksaan)
        for (let i = 0; i < element?.value.length; i++) {
          const el = element?.value[i]
          this.form.biaya_layanan = el?.aslix?.hargapelayananpolispesialis // ini bisa el?.aslix?.hargapelayananpoliumum
          this.form.biaya_sarana = el?.aslix?.hargasaranapolispesialis // ini bisa el?.aslix?.hargasaranapoliumum
          const objec = {
            kode: el?.aslix?.kode,
            gruper: el?.aslix.gruper
          }
          obj.details.push(objec)
        }

        arr.push(obj)
      }

      this.form.kodepoli = pasien?.kodepoli
      this.form.isRanap = isRanap

      const formbaru = { form: arr }

      // console.log('formbaru', formbaru)

      try {
        const resp = await api.post('v1/simrs/penunjang/laborat/simpanpermintaanlaboratbaru', formbaru)
        // console.log('save resp', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          const arr = resp?.data?.result
          if (arr.length) {
            for (let i = 0; i < arr.length; i++) {
              const isi = arr[i]
              storePasien.injectDataPasien(pasien, isi, 'laborats')
              if (isRanap) this.kirimKePasienKunjunganRanap(pasien, isi, 'laborats', resp.data)
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

    kirimKePasienKunjunganRanap (pasien, isi, kode, resp) {
      const storePasien = usePengunjungRanapStore()
      storePasien.injectDataPasien(pasien?.noreg, isi, kode)
    },

    async hapusLaborat (pasien, id) {
      const payload = { id, noreg: pasien?.noreg }
      try {
        const resp = await api.post('v1/simrs/penunjang/laborat/hapuspermintaanlaborat', payload)
        // // console.log('hapus laborat', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          storePasien.hapusDataLaborat(pasien, id)
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
        }
      }
      catch (error) {
        // console.log('hapus laborat', error)
      }
    },
    setNotas (array) {
      const arr = array.map(x => x.nota)
      this.notalaborats = arr.length ? arr : []
      this.notalaborats.push('LIHAT SEMUA')
      this.notalaborats.push('BARU')
      this.notalaborat = this.notalaborats[0]
    },
    // =============================================================================================================================================LABORAT

    initReset () {
      this.caripemeriksaanlab = null
      // this.permintaanLaborats = ''
      // this.form.prioritas_pemeriksaan = 'Tidak'
      this.form.details = []
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }

})
