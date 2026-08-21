import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { usePengunjungPoliStore } from './pengunjung'

export const useLaporanEswlPoliStore = defineStore('laporan-eswl-poli', {
  state: () => ({
    loading: false,
    loadingDelete: false,
    form: {
      id: null,
      norm: null,
      noreg: null,
      kddokter: null,
      asisten: null,
      tanggal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      
      // Informasi Umum
      berat_badan: null,
      tinggi_badan: null,
      sesi: null,
      no_eswl: null,
      riwayat: null,
      
      // Informasi Tindakan
      waktu_mulai: date.formatDate(Date.now(), 'HH:mm'),
      waktu_selesai: date.formatDate(Date.now(), 'HH:mm'),
      elektrode_sn: null,
      jumlah_tembakan: null,
      td_sistol: null,
      td_diastol: null,
      nadi: null,
      posisi: 'Prone',
      batu_detail: [
        { posisi: '', ukuran_x: '', ukuran_y: '' },
        { posisi: '', ukuran_x: '', ukuran_y: '' }
      ],
      lokalisasi_type: 'X-Ray',
      lokalisasi_lama: null,
      lokalisasi_xray: {
        kv: '',
        ma: '',
        fluroscopy: ''
      },
      lokalisasi_usg: {
        probe_fokus: '',
        probe_batu: '',
        perputaran: ''
      },
      lokalisasi_gambar: 'Bagus',
      
      // Penembakan & Monitor
      sinkronisasi: 'ECG',
      penembakan_detail: [
        { tembakan: '', power: '', energi: '' },
        { tembakan: '', power: '', energi: '' },
        { tembakan: '', power: '', energi: '' }
      ],
      monitor_usg: 'Tidak',
      monitor_usg_catatan: '',
      monitor_rontgen: 'Tidak',
      monitor_rontgen_catatan: '',
      tingkat_kesakitan: 'Tidak sakit',
      
      // Penggunaan Obat
      obat_pre: null,
      obat_durante: null,
      obat_post: null,
      
      // Evaluasi
      kepecahan_batu: 'Terlihat jelas',
      lama_penembakan: null,
      keterangan: null,
      
      // Canvas Drawing
      alternatif: ''
    },
    listdokters: [],
    listperawats: []
  }),
  actions: {
    getListDokter() {
      return new Promise((resolve, reject) => {
        api.get('v1/simrs/pelayanan/laporantindakan/listdokter')
          .then(resp => {
            this.listdokters = resp.data?.length ? resp.data.map(x => {
              return { nama: x.nama, kode: x.kdpegsimrs }
            }) : []
            resolve(resp)
          })
          .catch(err => {
            console.log('list dokters err', err)
            reject(err)
          })
      })
    },

    getListPerawat() {
      return new Promise((resolve, reject) => {
        api.get('v1/simrs/master/nakes/perawat')
          .then(resp => {
            this.listperawats = resp.data?.length ? resp.data.map(x => {
              return { nama: x.nama, kode: x.kdpegsimrs }
            }) : []
            resolve(resp)
          })
          .catch(err => {
            console.log('list perawats err', err)
            reject(err)
          })
      })
    },

    simpanData(pasien) {
      this.form.norm = pasien?.norm
      this.form.noreg = pasien?.noreg

      if (!this.form.kddokter) {
        notifErrVue('Maaf, Dokter Operator wajib dipilih!')
        return Promise.reject('Dokter kosong')
      }

      this.loading = true

      // Prepare payload with combined fields
      const payload = { ...this.form }
      payload.monitor_usg = this.form.monitor_usg === 'Ya' ? 'Ya - ' + this.form.monitor_usg_catatan : 'Tidak'
      payload.monitor_rontgen = this.form.monitor_rontgen === 'Ya' ? 'Ya - ' + this.form.monitor_rontgen_catatan : 'Tidak'

      return new Promise((resolve, reject) => {
        api.post('v1/simrs/pelayanan/laporaneswl/simpan', payload)
          .then((resp) => {
            this.loading = false
            const storePasien = usePengunjungPoliStore()
            const isi = resp.data
            storePasien.injectDataPasien(pasien, isi, 'laporaneswl')
            notifSuccess(resp)
            this.initForm()
            resolve(resp)
          })
          .catch(err => {
            console.log('simpan ESWL err', err)
            this.loading = false
            reject(err)
          })
      })
    },

    initForm() {
      this.form = {
        id: null,
        norm: null,
        noreg: null,
        kddokter: null,
        asisten: null,
        tanggal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        
        // Informasi Umum
        berat_badan: null,
        tinggi_badan: null,
        sesi: null,
        no_eswl: null,
        riwayat: null,
        
        // Informasi Tindakan
        waktu_mulai: date.formatDate(Date.now(), 'HH:mm'),
        waktu_selesai: date.formatDate(Date.now(), 'HH:mm'),
        elektrode_sn: null,
        jumlah_tembakan: null,
        td_sistol: null,
        td_diastol: null,
        nadi: null,
        posisi: 'Prone',
        batu_detail: [
          { posisi: '', ukuran_x: '', ukuran_y: '' },
          { posisi: '', ukuran_x: '', ukuran_y: '' }
        ],
        lokalisasi_type: 'X-Ray',
        lokalisasi_lama: null,
        lokalisasi_xray: {
          kv: '',
          ma: '',
          fluroscopy: ''
        },
        lokalisasi_usg: {
          probe_fokus: '',
          probe_batu: '',
          perputaran: ''
        },
        lokalisasi_gambar: 'Bagus',
        
        // Penembakan & Monitor
        sinkronisasi: 'ECG',
        penembakan_detail: [
          { tembakan: '', power: '', energi: '' },
          { tembakan: '', power: '', energi: '' },
          { tembakan: '', power: '', energi: '' }
        ],
        monitor_usg: 'Tidak',
        monitor_usg_catatan: '',
        monitor_rontgen: 'Tidak',
        monitor_rontgen_catatan: '',
        tingkat_kesakitan: 'Tidak sakit',
        
        // Penggunaan Obat
        obat_pre: null,
        obat_durante: null,
        obat_post: null,
        
        // Evaluasi
        kepecahan_batu: 'Terlihat jelas',
        lama_penembakan: null,
        keterangan: null,
        
        // Canvas Drawing
        alternatif: ''
      }
    },

    editData(val) {
      this.initForm()
      
      // Map basic fields
      Object.keys(this.form).forEach(key => {
        if (val[key] !== undefined) {
          this.form[key] = val[key]
        }
      })

      // Map combined monitor fields
      if (val.monitor_usg && val.monitor_usg.startsWith('Ya')) {
        this.form.monitor_usg = 'Ya'
        this.form.monitor_usg_catatan = val.monitor_usg.replace('Ya - ', '')
      } else {
        this.form.monitor_usg = 'Tidak'
        this.form.monitor_usg_catatan = ''
      }

      if (val.monitor_rontgen && val.monitor_rontgen.startsWith('Ya')) {
        this.form.monitor_rontgen = 'Ya'
        this.form.monitor_rontgen_catatan = val.monitor_rontgen.replace('Ya - ', '')
      } else {
        this.form.monitor_rontgen = 'Tidak'
        this.form.monitor_rontgen_catatan = ''
      }

      // Safeguard nested arrays / objects
      if (val.batu_detail && Array.isArray(val.batu_detail)) {
        this.form.batu_detail = JSON.parse(JSON.stringify(val.batu_detail))
      }
      if (val.lokalisasi_xray && typeof val.lokalisasi_xray === 'object') {
        this.form.lokalisasi_xray = { ...val.lokalisasi_xray }
      }
      if (val.lokalisasi_usg && typeof val.lokalisasi_usg === 'object') {
        this.form.lokalisasi_usg = { ...val.lokalisasi_usg }
      }
      if (val.penembakan_detail && Array.isArray(val.penembakan_detail)) {
        this.form.penembakan_detail = JSON.parse(JSON.stringify(val.penembakan_detail))
      }
    },

    hapusData(pasien, id) {
      this.loadingDelete = true
      const payload = { id }
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/pelayanan/laporaneswl/hapus', payload)
          .then((resp) => {
            this.loadingDelete = false
            const storePasien = usePengunjungPoliStore()
            storePasien.hapusDataLaporanEswl(pasien, id)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(err => {
            console.log('hapus ESWL err', err)
            this.loadingDelete = false
            reject(err)
          })
      })
    }
  }
})
