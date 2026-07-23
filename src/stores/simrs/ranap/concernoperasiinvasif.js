import { defineStore } from 'pinia'
import { api, pathImg } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { date } from 'quasar'
import { imageToBase64 } from 'src/modules/imgBase64'

export const useConcernOperasiInvasifRanapStore = defineStore('concern-operasi-invasif-ranap-store', {
  state: () => ({
    form: {
      tanggal: null,
      pelaksana: null,
      pengedukasi: null,
      penerimaEdukasi: null,
      diagnosis: [],
      dasarDiagnosis: null,
      tindakanMedis: null,
      indikasi: null,
      tujuan: [],
      tujuanLain: null,
      tatacara: null,
      resiko: [],
      resikoLain: null,
      komplikasi: null,
      prognosis: [],
      alternatif: null,
      golonganDarah: null,

      hubunganDgPasien: 'Diri Sendiri',
      keluarga: null,
      nama: null,
      lp: null,
      tglLahir: null,
      noKtp: null,
      alamat: null,
      telepon: null,

      ttdDokter: null,
      // ttdSaksiRs: null,
      ttdPetugas: null,
      // ttdPasien: null,
      ttdSaksiPasien: null,
      ttdYgMenyatakan: null,
      kdDokter: null,
      kdPetugas: null,
      // kdSaksiRs: null,
      saksiPasien: null,
      // ygMenyatakan: null,
      setuju: 'Iya'
    },
    dokters: [],
    perawats: [],
    nonNakes: [],

    loadingSave: false,
    loadingHapus: false,

    hubunganDgPasiens: ['Diri Sendiri', 'Suami', 'Istri', 'Anak', 'Orang Tua', 'Keluarga'],
    tujuans: ['Mengangkat Tumor', 'Menghilangkan Sumber Infeksi', 'Mengambil Spesimen', 'Mengembalikan fungsi tubuh', 'Melahirkan Bayi', 'Lain-lain'],
    resikos: ['Pendarahan', 'Infeksi Luka Operasi', 'Perlukaan Jaringan', 'Kematian', 'Lain-lain'],
    prognosis: ['Baik', 'Buruk'],
    iyaTidaks: ['Iya', 'Tidak'],
    jekels: [{
      value: 'Laki-Laki',
      label: 'L'
    },
    {
      value: 'Perempuan',
      label: 'P'
    }],
    loading: false,

    // =========================================================================================================== UNTUK ANESTESI-SEDASI
    tindakanMedisSedasis: ['Anestesi Umum', 'Anestesi Spinal', 'Anestesi Lokal', 'Sedasi sedang - dalam'],
    tujuanSedasis: ['Agar daerah yang akan dioperasi terbius atau tidak terasa', 'Agar tidak gelisah saat dilakukan tindakan'],
    tatacaraSedasis: 'Premedikasi, induksi anestesia / sedasi  recovery',
    resikoSedasis: 'Kegagalan pembiusan / sedasi',
    komplikasiSedasis: [
      {
        nama: 'Anestesi Umum',
        details: ['Mual / Muntah / menggigil', 'Sakit tenggorokan', 'Sakit menelan', 'Alergi / hipersensitif terhadap obat', 'Tekanan darah menurun', 'Nadi menurun']
      },
      {
        nama: 'Anestesi Spinal',
        details: ['Mual / Muntah / menggigil', 'Kesulitan buang air kecil', 'Alergi / hipersensitif tetapi jarang', 'Gangguan pernafasan / nafas terasa berat', 'Tekanan darah menurun', 'Nadi menurun']
      },
      {
        nama: 'Anestesi Lokal',
        details: ['Alergi / hipersensitif terhadap obat', 'Infeksi']
      },
      {
        nama: 'Sedasi sedang - dalam',
        details: ['Tidur dalam, sulit dibangunkan', 'Sumbatan jalan nafas', 'Perlu bantuan nafas', 'Mual / muntah']
      }

    ],
    // =========================================================================================================== UNTUK COLONOSCOPY

    pengertianColonoscopy: 'Tehnik pelayanan canggih untuk memeriksa saluran cerna bagian bawah secara visual dengan cara melihat langsung pada layar monitor',
    tujuanColonoscopy: 'Mendeteksi kelainan pada saluran cerna bagian bawah mulai dari anus, rektum dan usus besar, mengambil sampel jaringan',
    resikoColonoscopy: 'Mual, kembung sementara',
    komplikasiColonoscopys: '- Perdarahan' + '\n' + '- Infeksi' + '\n' + '- Luka gores',

    // =========================================================================================================== UNTUK di depan
    item: null,
    menuTab: 'OperasiInvasif'

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    async saveData(pasien, jns) {
      this.loadingSave = true

      const payload = { ...this.form }
      payload.noreg = pasien?.noreg
      payload.norm = pasien?.norm
      payload.kdRuang = pasien?.kodepoli
      payload.jenis = jns

      // Sanitize signatures to prevent backend explosion (Undefined array key 1)
      const signatureFields = ['ttdDokter', 'ttdPetugas', 'ttdSaksiPasien', 'ttdYgMenyatakan']
      signatureFields.forEach(field => {
        if (payload[field] && typeof payload[field] === 'string' && !payload[field].startsWith('data:image')) {
          delete payload[field]
        }
      })

      console.log('save inform form payload', payload)

      const storeRanap = usePengunjungRanapStore()

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/informconcern/simpandata', payload)
        console.log('save inform concern', resp.data)
        if (resp.status === 200) {
          storeRanap.deleteInjectanNull2(pasien?.noreg, 'informconcern')
          const isi = resp?.data?.result
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'informconcern')
          notifSuccess(resp)
          this.loadingSave = false
          this.loadingOrder = false
          this.initReset()
        }
        this.loadingSave = false
        this.loadingOrder = false
      }
      catch (error) {
        this.loadingSave = false
        this.loadingOrder = false
      }
    },

    async deleteData(pasien, id) {
      this.loadingHapus = true

      if (!id) {
        return notifErrVue('Tidak dapat dihapus')
      }

      const payload = { noreg: pasien?.noreg, id }
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/informconcern/hapusdata', payload)
        this.loadingHapus = false
        // console.log(resp)
        if (resp.status === 200) {
          // const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungRanapStore()
          // storePasien.hapusDataFisio(pasien, id)
          storeRanap.hapusDataInjectan(pasien, id, 'informconcern')
          notifSuccess(resp)
        }
      }
      catch (error) {
        this.loadingHapus = false
        // console.log(error)
      }
    },

    editForm(item) {
      this.menuTab = item?.jenis
      this.form = { ...item }

      // Convert existing sign paths to base64 images so they are not deleted during saveData payload sanitization
      const signatureFields = ['ttdDokter', 'ttdPetugas', 'ttdSaksiPasien', 'ttdYgMenyatakan']
      signatureFields.forEach(field => {
        const val = this.form[field]
        if (val && typeof val === 'string' && !val.startsWith('data:image')) {
          const fullUrl = pathImg + val
          imageToBase64(fullUrl, (base64Image) => {
            if (base64Image && (!this.form[field] || this.form[field] === val || !this.form[field]?.startsWith('data:image'))) {
              this.form[field] = base64Image
            }
          })
        }
      })
      
      // Parse diagnosis if it is a string representation of array
      if (typeof this.form.diagnosis === 'string' && this.form.diagnosis.trim() !== '') {
        try {
          this.form.diagnosis = JSON.parse(this.form.diagnosis)
        } catch (e) {
          this.form.diagnosis = this.form.diagnosis.split(',').map(x => x.trim()).filter(Boolean)
        }
      }
      if (!Array.isArray(this.form.diagnosis)) {
        this.form.diagnosis = []
      }

      // Parse tujuan if it is a string representation of array
      if (typeof this.form.tujuan === 'string' && this.form.tujuan.trim() !== '') {
        try {
          this.form.tujuan = JSON.parse(this.form.tujuan)
        } catch (e) {
          this.form.tujuan = this.form.tujuan.split(',').map(x => x.trim()).filter(Boolean)
        }
      }
      if (!Array.isArray(this.form.tujuan)) {
        this.form.tujuan = []
      }

      if (this.menuTab === 'Sedasi' || this.menuTab === 'Restrain') {
        if (!Array.isArray(this.form.komplikasi)) {
          if (typeof this.form.komplikasi === 'string' && this.form.komplikasi.trim() !== '') {
            try {
              const parsed = JSON.parse(this.form.komplikasi)
              this.form.komplikasi = Array.isArray(parsed) ? parsed : [this.form.komplikasi]
            } catch (e) {
              this.form.komplikasi = this.form.komplikasi.split(',').map(x => x.trim()).filter(Boolean)
            }
          } else {
            this.form.komplikasi = []
          }
        }
      }
      const pengunjung = usePengunjungRanapStore()
      this.dokters = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []
      this.nonNakes = pengunjung?.nonNakes
    },

    initReset(pasien) {
      const hariIni = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.form = {
        tanggal: hariIni,
        pelaksana: null,
        pengedukasi: null,
        penerimaEdukasi: null,
        diagnosis: [],
        dasarDiagnosis: null,
        // tindakanMedis: null,
        indikasi: null,
        tujuan: [],
        tujuanLain: null,
        // tatacara: null,
        resiko: [],
        resikoLain: null,
        komplikasi: null,
        prognosis: [],
        alternatif: null,
        golonganDarah: null,
        ttdPetugas: null,
        ttdPasien: null,

        hubunganDgPasien: 'Diri Sendiri',
        keluarga: null,
        nama: null,
        lp: 'Laki-Laki',
        tglLahir: null,
        noKtp: null,
        alamat: null,
        telepon: null,

        ttdDokter: null,
        ttdSaksiRs: null,
        ttdSaksiPasien: null,
        ttdYgMenyatakan: null,
        kdDokter: null,
        kdPetugas: null,
        // kdSaksiRs: null,
        saksiPasien: null,
        // ygMenyatakan: null,
        setuju: 'Iya'
      }

      if (this.menuTab === 'OperasiInvasif') {
        this.form.tatacara = null
        this.form.tindakanMedis = null
        this.form.tujuan = []
        this.form.resiko = []
        this.form.komplikasi = null
      }
      else if (this.menuTab === 'Sedasi') {
        this.form.tatacara = this.tatacaraSedasis
        this.form.tindakanMedis = this.tindakanMedisSedasis.join(' | ')
        this.form.tujuan = this.tujuanSedasis
        this.form.resiko = this.resikoSedasis
        this.form.komplikasi = []
      }
      else if (this.menuTab === 'Colonoscopy') {
        this.form.indikasi = this.pengertianColonoscopy
        this.form.tujuanLain = this.tujuanColonoscopy
        this.form.resikoLain = this.resikoColonoscopy
        this.form.komplikasi = this.komplikasiColonoscopys
      }
      else if (this.menuTab === 'TransfusiDarah') {
        this.form.indikasi = 'Suatu proses pemindahan darah dari orang sehat ( Donor) ke tubuh orang sakit (Pasien)'
        this.form.tindakanMedis = 'Darah yang dipindahkan dapat berupa darah lengkap or hanya komponen darah'
        this.form.tujuanLain = 'Untuk menolong pasien yang mengalami kurang darah baik dalam bentuk sel darah maupun komponen-komponennya'
        this.form.resikoLain = 'Pemindahan darah selain dapat menolong orang dapat juga menimbulkan penyulit tergantung pada masing-masing individu penerimanya, terlebih pada pasien yang ada riwayat alergi'
        this.form.komplikasi = 'Penyulit atau komplikasi yang biasa timbul sifatnya dapat terjadi cepat (akut) atau lambat, selain itu bila dilakukan Tranfusi dalam jumlah banyak dan cepat juga dapat menimbulkan akibat seperti Hipotermi yaitu suhu tubuh menurun, dan beberapa penyakit lainnya.'
        this.form.golonganDarah = null
      }
      else if (this.menuTab === 'PenandaanLokasiOperasi') {
        this.form.alternatif = null
      }
      else if (this.menuTab === 'Resusitasi') {
        this.form.setuju = 'Tidak'
        this.form.tindakanMedis = 'Resusitasi Jantung Paru (RJP) / Do Not Resuscitate (DNR)'
        this.form.indikasi = 'Henti Nafas dan atau Henti Jantung'
        this.form.tujuanLain = 'Tidak dilakukan tindakan Resusitasi Jantung Paru (RJP) jika terjadi henti nafas dan atau henti jantung'
        this.form.tatacara = 'Pemberian kompresi dada, pemasangan alat bantu nafas, intubasi endotrakeal, pemberian obat-obatan resusitasi, defibrilasi (kejut listrik)'
        this.form.resikoLain = 'Kerusakan otak permanen, patah tulang rusuk akibat kompresi dada, kematian'
        this.form.komplikasi = 'Penyulit pasca RJP, nyeri dada, cedera jalan nafas'
        this.form.prognosis = ['Buruk']
      }
      else if (this.menuTab === 'Restrain') {
        this.form.setuju = 'Iya'
        this.form.tindakanMedis = 'Pemasangan Restrain'
        this.form.indikasi = 'Restrain adalah suatu metode atau cara pembatasan/restriksi yang disengaja terhadap gerakan/perilaku seseorang. Merupakan intervensi yang terakhir jika perilaku klien sudah tidak bisa diatasi atau dikontrol dengan strategi perilaku maupun modifikasi lingkungan.'
        this.form.tujuan = [
          'Memberikan perlindungan dan menjamin keselamatan pasien dan lingkungan terhadap cidera',
          'Membantu dalam pelaksanaan pemeriksaan diagnostic dan prosedur terapeutik',
          'Untuk memberikan perawatan pada pasien yang mengalami gangguan kepribadian atau pasien yang tidak kooperatif atau gelisah'
        ]
        this.form.komplikasi = [
          'Luka gesekan',
          'Atrofi otot',
          'Hilangnya/berkurangnya densitas tulang',
          'Ulkus dekubitus',
          'Penurunan fungsi tubuh'
        ]
        this.form.tujuanLain = null
        this.form.tatacara = 'Pengikatan secara fisik menggunakan strap/tali pengikat khusus pada pergelangan tangan, kaki, atau badan pasien secara aman dan terpantau.'
        this.form.resikoLain = 'Iritasi kulit, gangguan sirkulasi darah lokal jika ikatan terlalu kencang.'
        this.form.alternatif = 'Modifikasi lingkungan, observasi ketat oleh petugas/keluarga, atau pemberian terapi farmakologi (obat penenang) sesuai instruksi dokter.'
      }
      else {
        this.form.tatacara = null
        this.form.tindakanMedis = null
        this.form.tujuan = []
        this.form.resiko = []
        this.form.komplikasi = null
      }

      const pengunjung = usePengunjungRanapStore()
      this.dokters = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      // this.perawats = pengunjung?.nakes
      this.perawats = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []
      this.nonNakes = pengunjung?.nonNakes

      // this.item = null

      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})
