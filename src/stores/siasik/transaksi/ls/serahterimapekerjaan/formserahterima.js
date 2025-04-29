import { defineStore } from 'pinia';
import { notifErrVue } from 'src/modules/utils';
import { api } from 'src/boot/axios';
import { date } from 'quasar';

export const useFormSerahterimaStore = defineStore('formSerahterima', {
  state: () => ({
    loading: false,
    error: null,
    fixed: false,
    disabled: false,
    openDialog: false,
    params: {
      q: '',
      page: 1,
      rowsPerPage: 50,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      kodekegiatan: '',
    },
    // State untuk header
    formheader: {
      noserahterima: '',
      nokontrak: '',
      kodepihakketiga: '',
      namaperusahaan: '',
      kodemapingrs: '',
      namasuplier: '',
      tglmulaikontrak: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglakhirkontrak: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tgltrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      kodepptk: '',
      namapptk: '',
      program: '',
      kegiatan: '',
      kodekegiatanblud: '',
      kegiatanblud: '',
    },
    // State untuk rincian (array)
    rincian: [],
    // State untuk item rincian sementara (saat menambah/edit rincian)
    rinci: {
      nokontrak: '',
      koderek50: '',
      uraianrek50: '',
      koderek108: '',
      uraian108: '',
      itembelanja: '',
      idserahterima_rinci: '',
      volume: 0,
      satuan: '',
      harga: 0,
      total: 0,
      volumels: 0,
      hargals: 0,
      totalls: 0,
      nominalpembayaran: 0,
    },
    // Data Kontrak
    kontrakpekerjaan: [],

    // Data Anggaran
    anggarans: [],
    itembelanja: [],
    rekening50: [],

  }),

  actions: {
    // Reset form ke state awal
    resetForm() {
      this.header = {
        noserahterima: '',
        nokontrak: '',
        kodepihakketiga: '',
        namaperusahaan: '',
        kodemapingrs: '',
        namasuplier: '',
        tglmulaikontrak: '',
        tglakhirkontrak: '',
        tgltrans: '',
        kodepptk: '',
        namapptk: '',
        program: '',
        kegiatan: '',
        kodekegiatanblud: '',
        kegiatanblud: '',
      };
      this.rincian = [];
      this.rincianItem = {
        nokontrak: '',
        koderek50: '',
        uraianrek50: '',
        koderek108: '',
        uraian108: '',
        itembelanja: '',
        idserahterima_rinci: '',
        volume: 0,
        satuan: '',
        harga: 0,
        total: 0,
        volumels: 0,
        hargals: 0,
        totalls: 0,
        nominalpembayaran: 0,
      };
      this.error = null;
    },

    onRequest(props) {
      // console.log('props', props)
      this.params.page = props?.pagination?.page ?? 1
      this.params.rowsPerPage = props?.pagination?.rowsPerPage ?? 10
      this.getKontrakPekerjaan()
    },
    goToPage(val) {
      this.params.page = val
      this.getKontrakPekerjaan()
    },
    setFormInput(key, val) {
      this.rinci[key] = val
      this.formheader[key] = val
    },
    // Tambah rincian ke array
    addRincian() {
      if (!this.rincianItem.nokontrak || this.rincianItem.volume <= 0) {
        notifErrVue.create({
          type: 'negative',
          message: 'Harap isi data rincian dengan lengkap!',
        });
        return;
      }
      this.rincian.push({ ...this.rincianItem });
      this.resetRincianItem();
      notifErrVue.create({
        type: 'positive',
        message: 'Rincian ditambahkan ke daftar.',
      });
    },

    // Reset rincianItem
    resetRincianItem() {
      this.rincianItem = {
        nokontrak: '',
        koderek50: '',
        uraianrek50: '',
        koderek108: '',
        uraian108: '',
        itembelanja: '',
        idserahterima_rinci: '',
        volume: 0,
        satuan: '',
        harga: 0,
        total: 0,
        volumels: 0,
        hargals: 0,
        totalls: 0,
        nominalpembayaran: 0,
      };
    },

    // Simpan data ke backend
    async saveData() {
      if (this.rincian.length === 0) {
        notifErrVue.create({
          type: 'negative',
          message: 'Harap tambahkan setidaknya satu rincian!',
        });
        return;
      }

      this.loading = true;
      try {
        const response = await api.post('/v1/transaksi/serahterima/savedata', {
          ...this.header,
          rincian: this.rincian,
        });
        notifErrVue.create({
          type: 'positive',
          message: response.data.message,
        });
        this.resetForm(); // Reset form setelah simpan
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menyimpan data';
        notifErrVue.create({
          type: 'negative',
          message: this.error,
        });
      } finally {
        this.loading = false;
      }
    },

    // Muat data untuk edit
    async loadData(noserahterimapekerjaan) {
      this.loading = true;
      try {
        const response = await api.get(`/v1/transaksi/serahterima/${noserahterimapekerjaan}`);
        this.header = response.data.header;
        this.rincian = response.data.rincian;
        notifErrVue.create({
          type: 'positive',
          message: 'Data berhasil dimuat.',
        });
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal memuat data';
        notifErrVue.create({
          type: 'negative',
          message: this.error,
        });
      } finally {
        this.loading = false;
      }
    },

    // Hapus data
    async deleteData(noserahterimapekerjaan) {
      this.loading = true;
      try {
        const response = await api.post('/v1/transaksi/serahterima/deletedata', {
          noserahterimapekerjaan,
        });
        notifErrVue.create({
          type: 'positive',
          message: response.data.message,
        });
        this.resetForm(); // Reset form setelah hapus
      } catch (error) {
        this.error = error.response?.data?.message || ' konieGagal menghapus data';
        notifErrVue.create({
          type: 'negative',
          message: this.error,
        });
      } finally {
        this.loading = false;
      }
    },

    // Ambil data kontrak pekerjaan
    getKontrakPekerjaan() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('/v1/transaksi/serahterima/getkontrak', params)
          .then((resp) => {
            if (resp.status === 200) {
              console.log('Data Kontrak', resp.data)
              this.loading = false
              this.kontrakpekerjaan = resp.data
              resolve(resp.data)
            }
            else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    getRincianBelanja() {
      this.loading = true
      const params = { params: this.params }
      console.log('anggaran', params)
      return new Promise((resolve) => {
        api.get('/v1/transaksi/belanja_ls/anggaran', params)
          .then((resp) => {
            if (resp.status === 200) {
              console.log('anggaran', resp.data)
              this.loading = false
              this.anggarans = resp.data
              this.filterRekening50(resp.data)
              this.filterItemBelanja(resp.data)
              resolve(resp.data)
            }
            else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    filterRekening50() {
      const data = this.anggarans?.length
        ? this.anggarans?.map((x) => {
          return {
            itembelanja: x.usulan,
            rincianbelanja: x.uraian50,
            rek50: x.koderek50,
            realisasi: x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
              x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
              x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
          }
        })
        : []
      const rek = data.reduce((a, b) => {
        const yangsama = a.find(x => x.rek50 === b.rek50)
        if (!yangsama) {
          a.push(b)
        }
        return a
      }, [])
      this.rekening50 = rek
    },
    filterItemBelanja() {
      const data = this.anggarans?.length
        ? this.anggarans?.filter(x => x.koderek50 === this.reqs.rekening50).map((x) => {
          return {
            idpp: x.idpp,
            koderek108: x.koderek108,
            uraian108: x.uraian108,
            koderek50: x.koderek50,
            uraian50: x.uraian50,
            itembelanja: x.usulan,
            harga: parseFloat(x.harga),
            satuan: x.satuan,
            volume: parseFloat(x.volume),
            pagu: parseFloat(x.pagu),
            realisasi: x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
              x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
              x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0),
            sisapagu: parseFloat(x.pagu) - (x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
              x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
              x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)),
          }
        })
        : []
      this.itembelanja = data
      // console.log('item belanja', data)
    },
  },
});
