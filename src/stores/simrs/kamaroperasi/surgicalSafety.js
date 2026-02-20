import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"
import { toRaw } from "vue"
import { usePermintaanOperasistore } from "./permintaanoperasi"

export const useSurgicalSafetyStore = defineStore('surgical_safety_store', {
  state: () => ({
    loading: false,
    pasien: null,
    params: {
      q: '',
      page: 1,
      per_page: 10
    },
    signIn: [
      {
        tanya: 'Apakah pasien telah dikonfirmasi identitas, area operasi, tindakan operasi dan lembar persetujuan ?',
        options: [
          { value: '0', label: 'Belum' },
          { value: '1', label: 'Sudah' },
        ],
        jawab: '',
      },
      {
        tanya: 'Apakah area operasi telah ditandai ?',
        options: [
          { value: '0', label: 'Tidak diperlukan' },
          { value: '1', label: 'Ya, Daerah ' },
        ],
        adaInput: true,
        jawab: '',
        input: ''
      },
      {
        tanya: 'Apakah mesin anastesi dan obat-obatan telah diperiksa kesiapannya ?',
        options: [
          { value: '0', label: 'Belum' },
          { value: '1', label: 'Sudah' },
        ],
        jawab: '',
      },
      {
        tanya: 'Apakah mesin Oxymetri berfungsi dengan baik ?',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya' },
        ],
        jawab: '',
      },
      {
        tanya: 'Apakah Jumlah Instrumen dan bahan habis pakai sudah dihitung ?',
        options: [
          { value: '0', label: 'Belum' },
          { value: '1', label: 'Sudah' },
        ],
        jawab: '',
      },
      {
        tanya: 'Apakah pasien memiliki alergi yang diketahui ?',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya, Jenis ' },
        ],
        adaInput: true,
        jawab: '',
        input: ''
      },
      {
        tanya: 'Riwayat asma',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya, terakhir kambuh ' },
        ],
        adaInput: true,
        jawab: '',
        input: ''
      },
      {
        tanya: 'Pasien ada kesulitan napas atau resiko aspirasi ?',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya, tapi tersedia peralatan untuk mengatasinya ' },
        ],
        jawab: '',
      },
      {
        tanya: 'Resiko terjadi pandarahan > 500 ml (7 ml/kg BB pada anak-anak) ?',
        options: [
          { value: '0', label: 'Tidak diperlukan' },
          { value: '1', label: 'Ya, tapi sudah direncanakan dipasang 2 lv lina dan vena sentral' },
        ],
        jawab: '',
      },
      {
        tanya: 'Rencana Pemasangan Implant',
        options: [
          { value: '0', label: 'Tidak ada' },
          { value: '1', label: 'Ada ( dilanjutkan memakai Impalnt )' },
        ],
        jawab: '',
      },

    ],
    timeOut: [
      {
        tanya: 'Konfirmasi kelengkapan tim operasi dan telah memperkenalkan nama serta tugas masing-masing',
        options: [
          { value: '0', label: 'Belum' },
          { value: '1', label: 'Sudah' },
        ],
        jawab: '',
      },
      {
        tanya: 'Konfirmasi identitas pasien ( cek gelang identitas ), jenis tindakan/prosedur operasi dan area yang akan dioperasi',
        options: [
          { value: '0', label: 'Belum' },
          { value: '1', label: 'Sudah' },
        ],
        jawab: '',
      },
      {
        tanya: 'Apakah antibiotik profilaksis sudah diberikan dalam 60 menit sebelum operasi ?',
        options: [
          { value: '0', label: 'Belum' },
          { value: '1', label: 'Sudah' },
        ],
        adaInputArray: true,
        jawab: '',
        inputArray: [
          {
            input: '', label: 'jenis',
          },
          {
            input: '', label: 'Diberikan jam'
          }
        ]
      },
      {
        tanya: 'Antisipasi kejadian kritis untuk Operator : Adakah kemungkinan tindakan darurat di luar standar yang akan dilakukan ?',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya, ' },
        ],
        adaInput: true,
        jawab: '',
        input: '',
      },
      {
        tanya: 'Perkiraan lama operasi sudah diketahui',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya, ' },
        ],
        adaInput: true,
        jawab: '',
        input: '',
        ket: ' jam',
      },
      {
        tanya: 'Apakah persiapan darah ?',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ada ' },
        ],
        adaInput: true,
        jawab: '',
        input: '',
        ket: ' kantong',
      },
      {
        tanya: 'Untuk Anastesi : Apakah ada perhatian khusus mengenai pembiusan pada pasien ini ?',
        options: [
          { value: '0', label: 'Tidak' },
          { value: '1', label: 'Ya, ' },
        ],
        adaInput: true,
        jawab: '',
        input: '',
      },
      {
        tanya: 'Untuk Instrumen : ',
        options: [
          { value: '1', label: 'Cek sterilisasi alat' },
          { value: '0', label: 'Cek kesiapan kondisi peralatan yang diperlukan' },
        ],
        type: "checkbox",
        jawab: [],
      },
      {
        tanya: 'Foto Radiologi penting sudah dipasang ?',
        options: [
          { value: '0', label: 'Tidak diperlukan' },
          { value: '1', label: 'Sudah' },
        ],
        jawab: '',
      },
    ],
    signOut: [
      {
        tanya: 'Perawat membacakan : ',
        options: [
          { value: '0', label: 'Nama tindakan/prosedur operasi yang dilakukan' },
          { value: '1', label: 'Kelengkapan dan kecocokan jumlah instrumen, kassa dan jarum sebelum dan sesudah operasi ( form inventaris kassa dan instrumen )' },
          { value: '2', label: 'Label pada spesimen ( membacakan identitas pasien, jenis spesimen. register, ruangan )' },
          { value: '3', label: 'Kerusakan alat ( bila ada ) dan akan / sudah dilaporkan' },
        ],
        type: "checkbox",
        jawab: [],
      },
      {
        tanya: 'Adakah pesanan untuk perawat di recovery room / Ruang Rawat / ICU ?',
        options: [
          { value: '0', label: 'Tidak ada' },
          { value: '1', label: 'Ada yaitu ' },
        ],
        adaInput: true,
        jawab: '',
        input: ''
      },
    ],
    form: {
      signIn: [],
      signOut: [],
      timeOut: [],
      dokter_anastesi: null,
      dokter_operator: null,
      penata_anastesi: null,
      perawat_instrumen: null,
      perawat_sirkuler: null,
      asisten_1: null,
      asisten_2: null,
      noreg: null,
      id: null,
    },
    implants: [],
    implant_seri: null,
    seri: null,
    nakes: [],
    formKasa: {},
    masterKasa: [],
    // instrumen
    formInstrumen: {},
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm () {
      // const id = this.form.id
      const surgical = this.pasien?.surgical?.find(x => x.nota === this.pasien.rs2)
      if (!surgical) {
        this.setForm('signIn', structuredClone(toRaw(this.signIn)))
        this.setForm('signOut', structuredClone(toRaw(this.signOut)))
        this.setForm('timeOut', structuredClone(toRaw(this.timeOut)))
        this.setForm('dokter_anastesi', null)
        this.setForm('dokter_operator', null)
        this.setForm('penata_anastesi', null)
        this.setForm('perawat_instrumen', null)
        this.setForm('perawat_sirkuler', null)
        this.setForm('asisten_1', null)
        this.setForm('asisten_2', null)
        this.setForm('id', null)
        this.setForm('nota', this.pasien.rs2)
        this.setForm('noreg', this.pasien.noreg)
      } else if (surgical) {
        this.form = surgical
        console.log('else reset', surgical)

      }
    },
    async getNakes () {
      try {
        const { data } = await api.get('v1/simrs/penunjang/surgical/get-nakes')
        this.nakes = data?.data ?? data
        // console.log('nakes', this.nakes)

      } catch (e) {

      }
    },
    simpan (pasien) {
      this.loading = true
      const pengunjung = usePermintaanOperasistore()
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/surgical/simpan', this.form)
          .then(resp => {
            this.loading = false
            console.log('simpan', resp?.data)
            this.form = resp?.data?.data
            pengunjung.injectDataPasien(pasien, resp?.data?.data, 'surgical')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    assignImplats (data, implant, seri) {
      const implantMap = new Map(
        implant?.map(i => [i.persiapan_operasi_distribusi_id, i]) ?? []
      )
      data.forEach(x => {
        const ada = implantMap.get(x.distribusi_id)
        if (ada) {
          // hanya assign field yang dibutuhkan
          Object.assign(x, {
            id: ada.id ?? null,
            seri: ada.seri ?? '',
            jenis: ada.jenis ?? '',
            pemakaian: ada.pemakaian
              ?? ((x.jumlah ?? 0) - (x.jumlah_retur ?? 0)),
            jumlah_retur: ada.jumlah_retur ?? x.jumlah_retur ?? 0
          })

          x.simpan = true
        } else {
          // kondisi data baru / tidak ada implant
          x.simpan = false
          x.id = null
          x.seri = ''
          x.jenis = ''
          x.pemakaian = (x.jumlah ?? 0) - (x.jumlah_retur ?? 0)
        }
      })
      // console.log('implants', data, implant)
      // data.forEach(x => {
      //   // console.log('x', x)
      //   const ada = implant?.find(f => x?.distribusi_id === f?.persiapan_operasi_distribusi_id)
      //   // console.log('ada', ada, typeof ada)

      //   if (ada && typeof ada == 'object') {
      //     Object.assign(x, ada)
      //     x.simpan = true
      //   } else {
      //     x.simpan = false
      //     x.seri = ''
      //     x.jenis = ''
      //     x.pemakaian = (x.jumlah ?? 0) - (x.jumlah_retur ?? 0)
      //   }
      // })
    },
    async getImplants () {
      this.loading = true
      const param = {
        params: {
          noreg: this.pasien.noreg,
          nota: this.pasien.rs2
        }
      }
      try {
        const { data } = await api.get('v1/simrs/penunjang/surgical/get-implant', param)
        this.implants = data?.data ?? data
        this.pasien.implant = data?.implant ?? null
        this.pasien.implant_seri = data?.implant_seri ?? null
        this.assignImplats(this.implants, this.pasien.implant, this.pasien.implant_seri)
        // console.log('implants', data, this.implants)
      }
      finally {
        this.loading = false
      }
    },
    async simpanImplants () {
      this.loading = true
      const data = this.implants.filter(x => x.simpan)
      const form = {
        data,
        noreg: this.pasien.noreg,
        nota: this.pasien.rs2
      }
      // console.log('simpan', form)
      try {
        const resp = await api.post('v1/simrs/penunjang/surgical/simpan-implant', form)
        // console.log('data', resp)

        notifSuccess(resp)
        this.getImplants()
      } finally { this.loading = false }
    },
    async simpanGambar () {
      console.log('simpan gambar', this.seri)
      const form = new FormData()
      form.append('file', this.seri)
      form.append('noreg', this.pasien.noreg)
      form.append('nota', this.pasien.rs2)
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/penunjang/surgical/simpan-gambar', form)
        notifSuccess(resp)
        this.getImplants()
      } finally {
        this.loading = false
        this.seri = null
      }


    },
    async hapusGambar (file) {
      const form = {
        id: file.id,
      }
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/penunjang/surgical/hapus-gambar', form)
        // console.log('hapus', resp)

        notifSuccess(resp)
        this.getImplants()
      } finally {
        this.loading = false
      }
    },
    setFormKasa (key, val) {
      this.formKasa[key] = val
    },
    resetFormKasa () {
      this.formKasa = {
        noreg: this.pasien.noreg,
        nota: this.pasien.rs2,
        norm: this.pasien.norm,
        kode: '',
        nama: '',
        pakai: 0,
        awal: 0,
        tambah: 0,
        sisa: 0,
        akhir: 0,
      }
    },
    async ambilMasterkasa () {
      this.loading = true
      try {
        const resp = await api.get('v1/simrs/penunjang/surgical/get-master-kasa')
        this.masterKasa = resp?.data?.data ?? resp?.data
        // console.log('kasa', resp?.data?.data, this.masterKasa)

      } finally {
        this.loading = false
      }
    },
    simpanKasa () {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/surgical/simpan-inventaris-kasa', this.formKasa)
          .then(resp => {
            this.loading = false
            this.injectKasa('baru', resp?.data?.data)
            this.resetFormKasa()
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    injectKasa (type, data) {
      console.log('inject', data)
      if (data?.id) {
        console.log('inject ada id')
        const index = this.pasien.inventaris_kasa.findIndex(x => x.id === data.id)
        if (type == 'hapus') {
          this.pasien.inventaris_kasa.splice(index, 1)
        }
        else {
          if (index >= 0) {
            console.log('inject ada id update')
            this.pasien.inventaris_kasa[index] = data
          } else {
            console.log('inject ada id push')
            this.pasien.inventaris_kasa.push(data)
          }
        }
      }

    },
    hapusKasa (val) {
      console.log('hapus', val)
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/surgical/hapus-inventaris-kasa', val)
          .then(resp => {
            this.loading = false
            this.injectKasa('hapus', resp?.data?.data)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })

    },

    setFormInstrumen (key, val) {
      this.formInstrumen[key] = val
    },
    resetFormInstrumen () {
      const dataAwal = [
        {
          noreg: this.pasien.noreg,
          nota: this.pasien.rs2,
          norm: this.pasien.norm,
          nama: 'Instrumen',
          pakai: 0,
          awal: 0,
          tambah: 0,
          sisa: 0,
          akhir: 0,
        },
        {
          noreg: this.pasien.noreg,
          nota: this.pasien.rs2,
          norm: this.pasien.norm,
          nama: 'Jarum',
          pakai: 0,
          awal: 0,
          tambah: 0,
          sisa: 0,
          akhir: 0,
        },
        {
          noreg: this.pasien.noreg,
          nota: this.pasien.rs2,
          norm: this.pasien.norm,
          nama: 'Permasalahan Pada Instrumen',
          pakai: 0,
          awal: 0,
          tambah: 0,
          sisa: 0,
          akhir: 0,
        },
      ]
      this.formInstrumen = this.pasien?.inventaris_Instrumen?.length ? this.pasien?.inventaris_Instrumen : dataAwal

    },
  },

})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSurgicalSafetyStore, import.meta.hot))
}
