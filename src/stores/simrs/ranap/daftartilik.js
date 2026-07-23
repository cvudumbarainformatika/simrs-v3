import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess, notifErrVue } from 'src/modules/utils'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const useDaftarTilikStore = defineStore('daftar-tilik-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    perawats: [],
    
    // Master item checklist
    checklistMasters: [
      { no: '1', kode: 'rm_pasien', label: 'RM pasien' },
      { no: '2', kode: 'informed_consent', label: 'Informed Consent (Bedah & Anestesi) telah ditandatangani' },
      { no: '3', kode: 'gelang_identitas', label: 'Gelang identitas terpasang' },
      { no: '4', kode: 'penandaan_lokasi', label: 'Penandaan (Mark site)' },
      { no: '5', kode: 'rencana_tindakan', label: 'Rencana tindakan yang akan dilakukan' },
      { no: '6', kode: 'konsul_kardiologi', label: 'Konsul Kardiologi' },
      { no: '7', kode: 'konsul_penyakit_dalam', label: 'Konsul Penyakit Dalam' },
      { no: '8', kode: 'konsul_paru', label: 'Konsul Paru' },
      { no: '9', kode: 'konsul_anak', label: 'Konsul Anak' },
      { no: '10', kode: 'konsul_anestesi', label: 'Konsul Anestesi' },
      { no: '11', kode: 'golongan_darah', label: 'Golongan darah & darah tersedia' },
      { no: '12', kode: 'hasil_lab', label: 'Hasil laboratorium terlampir' },
      { no: '13', kode: 'hasil_radiologi', label: 'Hasil Radiologi, USG, CT-Scan, MRI' },
      { no: '14', kode: 'puasa', label: 'Puasa' },
      { no: '15', kode: 'huknah_lavement', label: 'Huknah / Lavement' },
      { no: '16', kode: 'kebersihan_pasien', label: 'Kebersihan pasien (mandi dengan anti septic, cuci rambut, sikat gigi)' },
      { no: '17', kode: 'lapangan_operasi_dicukur', label: 'Lapangan operasi dicukur / Skirent' },
      { no: '20', kode: 'alergi_obat', label: 'Alergi Obat' },
      { no: '21', kode: 'gigi_palsu_dll', label: 'Gigi palsu, kacamata, kontaklensa, hearing aid, wig telah dilepas dan disimpan' },
      { no: '22', kode: 'infus', label: 'Infus' },
      { no: '23', kode: 'kateter', label: 'Kateter' },
      { no: '24', kode: 'alat_khusus_implan', label: 'Alat khusus / Implan tersedia' },
      { no: '25', kode: 'pesanan_icu', label: 'Pesanan ICU tersedia' },
      { no: '26', kode: 'antibiotik_profilaksis', label: 'Antibiotik profilaksis' },
    ],

    // Master item paska-operasi
    checklistMastersPaska: [
      { no: '1', kode: 'kesadaran_nilai', label: 'Kesadaran/nilai' },
      { no: '2', kode: 'status', label: 'Status' },
      { no: '3', kode: 'laporan_operasi', label: 'Laporan Operasi' },
      { no: '4', kode: 'rencana_asuhan_pasca_operasi', label: 'Rencana Asuhan Pasca Operasi' },
      { no: '5', kode: 'laporan_anestesi', label: 'Laporan anestesi' },
      { no: '6', kode: 'formulir_pemeriksaan_patologi', label: 'Formulir pemeriksaan patologi' },
      { no: '7', kode: 'bahan_specimen', label: 'Bahan specimen: kultur, PA' },
      { no: '8', kode: 'laporan_nasokomial', label: 'Laporan Nasokomial' },
      { no: '9', kode: 'ringkasan_pulang', label: 'Ringkasan Pulang' },
      { no: '10', kode: 'resep', label: 'Resep' },
      { no: '11', kode: 'hasil_radiologi_usg_ct_mri', label: 'Hasil radiologi, USG, CT-Scan, MRI' },
      { no: '12', kode: 'transfusi_darah', label: 'Transfusi darah' }
    ],

    form: {
      id: null,
      ruang_rawat: '',
      
      // PRE-OPERASI
      checklist: {},
      catatan: '',
      petugas_pengantar: '',
      petugas_pengantar_nama: '',
      petugas_penerima: '',
      petugas_penerima_nama: '',
      pre_jam_tiba: '',
      pre_urutan_jadwal: '',
      pre_lokasi_operasi: '',

      // PASKA-OPERASI
      paska_checklist: {},
      paska_gambar_penandaan: '',
      paska_catatan: '',
      paska_petugas_pengantar: '',
      paska_petugas_pengantar_nama: '',
      paska_petugas_penerima: '',
      paska_petugas_penerima_nama: '',
      paska_jam_keluar: '',
      paska_lokasi_sisi: ''
    }
  }),

  actions: {
    // Helper Ambil Jam Keluar dari Laporan Operasi Pasien
    extractJamKeluar(pasien) {
      if (!pasien) return ''
      if (Array.isArray(pasien.laporanop) && pasien.laporanop.length > 0 && pasien.laporanop[0]?.rs12) {
        return pasien.laporanop[0].rs12
      }
      if (Array.isArray(pasien.laporan_operasi) && pasien.laporan_operasi.length > 0 && pasien.laporan_operasi[0]?.rs12) {
        return pasien.laporan_operasi[0].rs12
      }
      return pasien.rs12 || ''
    },

    // Inisialisasi/Reset Form
    initForm(item = null, pasien = null) {
      const jamKeluarAuto = this.extractJamKeluar(pasien)

      // Inisialisasi struktur checklist Pre-Op lengkap
      const rawChecklist = item ? (typeof item.checklist === 'string' ? JSON.parse(item.checklist || '{}') : (item.checklist || {})) : {}
      const checklistDefault = {}
      this.checklistMasters.forEach(master => {
        const val = rawChecklist[master.kode]
        checklistDefault[master.kode] = {
          status: typeof val === 'object' ? (val?.status ?? null) : (typeof val === 'string' ? val : (master.kode === 'rm_pasien' ? 'Ya' : null)),
          keterangan: typeof val === 'object' ? (val?.keterangan ?? '') : ''
        }
      })

      // Inisialisasi struktur checklist Paska-Op lengkap
      const rawPaskaChecklist = item ? (typeof item.paska_checklist === 'string' ? JSON.parse(item.paska_checklist || '{}') : (item.paska_checklist || {})) : {}
      const paskaChecklistDefault = {}
      this.checklistMastersPaska.forEach(master => {
        const val = rawPaskaChecklist[master.kode]
        paskaChecklistDefault[master.kode] = {
          status: typeof val === 'object' ? (val?.status ?? null) : (typeof val === 'string' ? val : null),
          keterangan: typeof val === 'object' ? (val?.keterangan ?? '') : ''
        }
      })

      if (item) {
        // Load data to edit
        this.form = {
          id: item.id,
          ruang_rawat: item.ruang_rawat || '',
          checklist: checklistDefault,
          catatan: item.catatan || '',
          petugas_pengantar: item.petugas_pengantar || '',
          petugas_pengantar_nama: item.petugas_pengantar_nama || '',
          petugas_penerima: item.petugas_penerima || '',
          petugas_penerima_nama: item.petugas_penerima_nama || '',
          pre_jam_tiba: item.pre_jam_tiba || '',
          pre_urutan_jadwal: item.pre_urutan_jadwal || '',
          pre_lokasi_operasi: item.pre_lokasi_operasi || '',
          
          paska_checklist: paskaChecklistDefault,
          paska_gambar_penandaan: item.paska_gambar_penandaan || '',
          paska_catatan: item.paska_catatan || '',
          paska_petugas_pengantar: item.paska_petugas_pengantar || '',
          paska_petugas_pengantar_nama: item.paska_petugas_pengantar_nama || '',
          paska_petugas_penerima: item.paska_petugas_penerima || '',
          paska_petugas_penerima_nama: item.paska_petugas_penerima_nama || '',
          paska_jam_keluar: item.paska_jam_keluar || jamKeluarAuto,
          paska_lokasi_sisi: item.paska_lokasi_sisi || ''
        }
      } else {
        this.form = {
          id: null,
          ruang_rawat: '',
          checklist: checklistDefault,
          catatan: '',
          petugas_pengantar: '',
          petugas_pengantar_nama: '',
          petugas_penerima: '',
          petugas_penerima_nama: '',
          pre_jam_tiba: '',
          pre_urutan_jadwal: '',
          pre_lokasi_operasi: '',

          paska_checklist: paskaChecklistDefault,
          paska_gambar_penandaan: '',
          paska_catatan: '',
          paska_petugas_pengantar: '',
          paska_petugas_pengantar_nama: '',
          paska_petugas_penerima: '',
          paska_petugas_penerima_nama: '',
          paska_jam_keluar: jamKeluarAuto,
          paska_lokasi_sisi: ''
        }
      }
    },

    // Fetch daftar perawat/nakes dari store atau API jika belum ada
    async getNakes() {
      if (this.perawats && this.perawats.length > 0) {
        return
      }

      const pengunjung = usePengunjungRanapStore()
      if (pengunjung?.nakes && pengunjung.nakes.length > 0) {
        this.perawats = pengunjung.nakes.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3' || x?.kdgroupnakes === '1')
        return
      }

      try {
        const resp = await api.get('v1/simrs/penunjang/surgical/get-nakes')
        const data = resp?.data?.data ?? resp?.data ?? []
        if (data && data.length > 0) {
          this.perawats = data
        }
      } catch (e) {
        console.error('Error fetching nakes in daftartilik store:', e)
      }
    },

    // Fetch data from real backend API
    async getData(pasien) {
      this.loading = true
      await this.getNakes()
      const jamKeluarAuto = this.extractJamKeluar(pasien)

      try {
        const resp = await api.get(`v1/simrs/ranap/layanan/daftartilik/list?noreg=${pasien?.noreg}`)
        if (resp.status === 200) {
          // Petakan data dari kolom DB (pre_checklist, kdruang) ke interface UI kita
          this.items = (resp.data || []).map(x => ({
            id: x.id,
            ruang_rawat: x.kdruang,
            checklist: typeof x.pre_checklist === 'string' ? JSON.parse(x.pre_checklist) : (x.pre_checklist || {}),
            catatan: x.pre_catatan,
            petugas_pengantar: x.pre_petugas_pengantar,
            petugas_pengantar_nama: x.petugas_pre_pengantar?.nama || x.pre_petugas_pengantar,
            petugas_penerima: x.pre_petugas_penerima,
            petugas_penerima_nama: x.petugas_pre_penerima?.nama || x.pre_petugas_penerima,
            pre_jam_tiba: x.pre_jam_tiba,
            pre_urutan_jadwal: x.pre_urutan_jadwal,
            pre_lokasi_operasi: x.pre_lokasi_operasi,

            paska_checklist: typeof x.paska_checklist === 'string' ? JSON.parse(x.paska_checklist) : (x.paska_checklist || {}),
            paska_gambar_penandaan: x.paska_gambar_penandaan,
            paska_catatan: x.paska_catatan,
            paska_petugas_pengantar: x.paska_petugas_pengantar,
            paska_petugas_pengantar_nama: x.petugas_paska_pengantar?.nama || x.paska_petugas_pengantar,
            paska_petugas_penerima: x.paska_petugas_penerima,
            paska_petugas_penerima_nama: x.petugas_paska_penerima?.nama || x.paska_petugas_penerima,
            paska_jam_keluar: x.paska_jam_keluar || jamKeluarAuto,
            paska_lokasi_sisi: x.paska_lokasi_sisi || '',

            created_at: x.created_at,
            updated_at: x.updated_at
          }))
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error get data daftartilik', error)
      }
    },

    async simpanData(pasien) {
      if (!this.form.petugas_pengantar) {
        return notifErrVue('Petugas Pengantar (Ruangan) harus diisi!')
      }

      this.loadingSave = true

      // Tentukan nama ruang rawat dari prop pasien
      const namaRuang = pasien?.ruang || pasien?.ruangan || this.form.ruang_rawat || ''

      const payload = {
        id: this.form.id,
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        kdruang: namaRuang,
        pre_checklist: this.form.checklist,
        pre_catatan: this.form.catatan,
        pre_petugas_pengantar: this.form.petugas_pengantar,
        pre_petugas_penerima: this.form.petugas_penerima,
        pre_jam_tiba: this.form.pre_jam_tiba,
        pre_urutan_jadwal: this.form.pre_urutan_jadwal,
        pre_lokasi_operasi: this.form.pre_lokasi_operasi,

        paska_checklist: this.form.paska_checklist,
        paska_gambar_penandaan: this.form.paska_gambar_penandaan,
        paska_catatan: this.form.paska_catatan,
        paska_petugas_pengantar: this.form.paska_petugas_pengantar,
        paska_petugas_penerima: this.form.paska_petugas_penerima,
        paska_jam_keluar: this.form.paska_jam_keluar,
        paska_lokasi_sisi: this.form.paska_lokasi_sisi
      }

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/daftartilik/simpandata', payload)
        if (resp.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
          this.initForm()
        }
        this.loadingSave = false
        return true
      } catch (error) {
        this.loadingSave = false
        console.error('error simpan data daftartilik', error)
        return false
      }
    },

    // Aksi Konfirmasi Penerimaan Pasien Paska-Operasi oleh Perawat Ruang Rawat
    async terimaPasienPaska(itemParam, pasienParam) {
      console.log('terimaPasienPaska dipanggil:', itemParam, pasienParam)
      const item = itemParam?.value || itemParam
      const pasien = pasienParam?.value || pasienParam

      if (!item || !item.id) {
        notifErrVue('Data daftar tilik tidak ditemukan!')
        return false
      }

      const auth = useAplikasiStore()
      const userKdpeg = auth.user?.pegawai?.kdpegsimrs || auth.user?.karyawan?.kdpegsimrs || auth.user?.kdpegsimrs || auth.user?.username || auth.user?.id || ''
      const userNama = auth.user?.nama || auth.user?.pegawai?.nama || auth.user?.name || 'Petugas Ruangan'

      if (!userKdpeg) {
        notifErrVue('Data akun login perawat penerima tidak ditemukan!')
        return false
      }

      this.loadingSave = true
      const payload = {
        id: item.id,
        noreg: pasien?.noreg || item?.noreg,
        paska_petugas_penerima: userKdpeg
      }

      console.log('Payload simpandata:', payload)

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/daftartilik/simpandata', payload)
        console.log('Response simpandata:', resp)
        if (resp.status === 200) {
          if (resp?.data) {
            resp.data.message = `Pasien paska operasi berhasil dikonfirmasi di ruangan oleh ${userNama}`
          }
          notifSuccess(resp)
          await this.getData(pasien || { noreg: payload.noreg })
        }
        this.loadingSave = false
        return true
      } catch (error) {
        this.loadingSave = false
        console.error('error terima pasien paska op', error)
        notifErrVue('Gagal konfirmasi: ' + (error?.response?.data?.message || error?.message || 'Error Server'))
        return false
      }
    },

    async deleteData(pasien, id) {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/daftartilik/hapusdata', { id })
        if (resp.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
        }
        this.loading = false
        return true
      } catch (error) {
        this.loading = false
        console.error('error hapus data daftartilik', error)
        return false
      }
    }
  }
})
