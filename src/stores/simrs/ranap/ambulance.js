import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const usePermintaanAmbulanStore = defineStore('permintaan-ambulance-store', {
  state: () => ({
    notas: [],
    form: {
      nota: null,
      tujuan: '',
      keterangan: '',
      layanansupir: '',
      layananperawat: '',
      kd_driver: '',
      perawat1: '',
      perawat2: '',
      kodedokter: '',
      alasan_keperluan: '',
      indikasi_rujuk: '',
      jenis_ambulan: 'Ambulance Reguler',
      skor_indeks: 0,
      kategori_resiko: '0',
      kualifikasi_petugas: 'BLS',
      penilaian_resiko: {
        haemodinamik: 0,
        cardio: 0,
        ecg_monitor: 0,
        intravenous_line: 0,
        provesional_pacemaker: 0,
        respirasi: 0,
        airways: 0,
        respiratory_support: 0,
        kesadaran: 0,
        prematuritas: 0,
        lanjut_usia: 0
      }
    },
    tujuans: [],
    layanans: [
      { value: '', label: '---------' },
      { value: 'Rujukan', label: 'Rujukan' },
      { value: 'Jenazah', label: 'Jenazah' },
      { value: 'Emergency', label: 'Emergency' }
    ],
    jenisAmbulans: [
      { label: 'Ambulance Reguler', value: 'Ambulance Reguler' },
      { label: 'Ambulance Emergency', value: 'Ambulance Emergency' },
      { label: 'Ambulance Jenazah', value: 'Ambulance Jenazah' }
    ],
    dokters: [],
    perawats: [],
    drivers: [],
    loadingOrder: false,
    loadingHapus: false
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    async getTujuanAmbulance () {
      try {
        const resp = await api.get('v1/simrs/penunjang/permintaanambulan/gettujuanambulan')
        // console.log('tujuan ambulance', resp)

        if (resp.status === 200) {
          const data = resp.data
          this.tujuans = data
        }
      }
      catch (error) {

      }
    },

    async saveOrder (pasien) {
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingOrder = true
      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.kodepoli = pasien?.kodepoli
      this.form.kodesistembayar = pasien?.kodesistembayar
      this.form.kdgroup_ruangan = pasien?.kdgroup_ruangan
      this.form.kelas_ruangan = pasien?.kelas_ruangan
      this.form.nota = (this.form.nota === 'BARU' || this.form.nota === 'SEMUA' || this.form.nota === '') ? null : this.form.nota

      try {
        const resp = await api.post('v1/simrs/penunjang/permintaanambulan/simpanpermintaan', this.form)
        if (resp.status === 200) {
          const storeRanap = usePengunjungRanapStore()
          const isi = resp?.data?.result
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'permintaanambulan')
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
          this.loadingOrder = false
          this.initReset()
        }
        this.loadingOrder = false
      }
      catch (error) {
        this.loadingOrder = false
      }
    },

    setFormEdit (item) {
      if (!item) return
      let penilaian = {
        haemodinamik: 0,
        cardio: 0,
        ecg_monitor: 0,
        intravenous_line: 0,
        provesional_pacemaker: 0,
        respirasi: 0,
        airways: 0,
        respiratory_support: 0,
        kesadaran: 0,
        prematuritas: 0,
        lanjut_usia: 0
      }

      if (item?.penilaian_resiko) {
        if (typeof item.penilaian_resiko === 'string') {
          try {
            penilaian = { ...penilaian, ...JSON.parse(item.penilaian_resiko) }
          } catch (e) {
            console.error('Error parse penilaian_resiko', e)
          }
        } else if (typeof item.penilaian_resiko === 'object') {
          penilaian = { ...penilaian, ...item.penilaian_resiko }
        }
      }

      this.form = {
        id: item?.id || null,
        nota: item?.nota || null,
        tujuan: item?.rs10 || '',
        keterangan: item?.rs11 || '',
        layanansupir: item?.rs12 || '',
        layananperawat: item?.rs15 || '',
        kd_driver: item?.kd_driver || '',
        perawat1: item?.rs13 || '',
        perawat2: item?.rs14 || '',
        kodedokter: item?.rs9 || '',
        alasan_keperluan: item?.alasan_keperluan || '',
        indikasi_rujuk: item?.indikasi_rujuk || '',
        jenis_ambulan: item?.jenis_ambulan || 'Ambulance Reguler',
        skor_indeks: Number(item?.skor_indeks || 0),
        kategori_resiko: String(item?.kategori_resiko ?? '0'),
        kualifikasi_petugas: item?.kualifikasi_petugas || 'BLS',
        penilaian_resiko: penilaian
      }
    },

    async getNota (pasien) {
      const payload = { params: { noreg: pasien?.noreg } }
      const resp = await api.get('v1/simrs/penunjang/permintaanambulan/getnota', payload)
      // console.log('nota fisio', resp.data)
      if (resp.status === 200) {
        this.setNotas(resp?.data)
      }
    },

    setNotas (array) {
      const arr = array.map(x => x.nota)
      this.notas = arr?.length ? arr : []
      this.notas.unshift('SEMUA')
      this.notas.push('BARU')
      this.form.nota = this.notas[0]
    },

    async hapusPermintaan (pasien, id) {
      this.loadingHapus = true
      const payload = { noreg: pasien?.noreg, id }
      try {
        const resp = await api.post('v1/simrs/penunjang/permintaanambulan/hapuspermintaan', payload)
        this.loadingHapus = false
        // console.log(resp)
        if (resp.status === 200) {
          // const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungRanapStore()
          // storePasien.hapusDataFisio(pasien, id)
          storeRanap.hapusDataInjectan(pasien, id, 'permintaanambulan')
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
        }
      }
      catch (error) {
        this.loadingHapus = false
        // console.log(error)
      }
    },

    initReset () {
      this.form = {
        nota: null,
        tujuan: '',
        keterangan: '',
        layanansupir: '',
        layananperawat: '',
        kd_driver: '',
        perawat1: '',
        perawat2: '',
        kodedokter: '',
        alasan_keperluan: '',
        indikasi_rujuk: '',
        jenis_ambulan: 'Ambulance Reguler',
        skor_indeks: 0,
        kategori_resiko: '0',
        kualifikasi_petugas: 'BLS',
        penilaian_resiko: {
          haemodinamik: 0,
          cardio: 0,
          ecg_monitor: 0,
          intravenous_line: 0,
          provesional_pacemaker: 0,
          respirasi: 0,
          airways: 0,
          respiratory_support: 0,
          kesadaran: 0,
          prematuritas: 0,
          lanjut_usia: 0
        }
      }

      const pengunjung = usePengunjungRanapStore()
      this.dokters = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []
      
      // Ambil khusus non-nakes (kdgroupnakes null / empty / bukan 1,2,3)
      const nonNakesList = pengunjung?.nonNakes?.length
        ? pengunjung.nonNakes
        : (pengunjung?.nakes?.filter(x => !x?.kdgroupnakes || x?.kdgroupnakes === '' || !['1', '2', '3'].includes(x?.kdgroupnakes)) ?? [])

      // Distinct by kdpegsimrs
      const uniqueDrivers = []
      const map = new Map()
      for (const item of nonNakesList) {
        if (item?.kdpegsimrs && !map.has(item.kdpegsimrs)) {
          map.set(item.kdpegsimrs, true)
          uniqueDrivers.push(item)
        }
      }
      this.drivers = uniqueDrivers.length ? uniqueDrivers : (pengunjung?.nonNakes ?? [])

      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})
