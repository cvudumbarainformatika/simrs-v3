import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
// eslint-disable-next-line no-unused-vars
import { notifErrVue } from 'src/modules/utils'
import { useListKunjunganBpjsStore } from 'src/stores/simrs/pendaftaran/kunjungan/bpjs/lists'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useListGeneralConsentStore } from './kunjungan'
import { useListKunjunganIgdStore } from './kunjunganIgd'

export const useGeneralConsentStore = defineStore('general_consent', {
  state: () => ({
    items: [],
    loading: false,
    openPreviewGc: false,

    ranaps: [],
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      // tgl: dateDbFormat(new Date()),
      to: dateDbFormat(new Date()),
      from: dateDbFormat(new Date()),
      kdbayar: null,
      status: null
    },

    form: {
      isRajal: true,
      tanggal: dateDbFormat(new Date()),
      petugas: null,
      nama: null,
      norm: null,
      noreg: null,
      alamat: null,
      nohp: null,
      hubunganpasien: 'Diri Sendiri',
      ttdpasien: null,
      ttdpetugas: null,
      nikpetugas: null,
      wali1: null,
      wali2: null,
      hubunganWali1: null,
      hubunganWali2: null
    },

    options: ['Diri Sendiri', 'Ayah Kandung', 'Ibu Kandung', 'Kakak Kandung', 'Adik Kandung', 'Paman', 'Kakek', 'Cucu', 'Saudara'],
    wali: ['Suami', 'Istri', 'Orang tua kandung / Adopsi', 'Saudara kandung', 'Wali']
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    async getData() {
      this.loading = true
      try {
        const resp = await api.get('/v1/simrs/pendaftaran/generalconscent/mastergeneralconsent')
        // console.log('master general consent', resp)
        if (resp.status === 200) {
          this.items = resp.data
          this.loading = false
        }
        this.loading = false
      }
      catch (error) {
        this.loading = false
      }
    },

    setForm(frm, val) {
      this.form[frm] = val
      // console.log('ttd', val, frm)
    },
    resetFORM() {
      this.form = {}
      const columns = [
        'tanggal',
        'petugas',
        'nama',
        'norm',
        'alamat',
        'nohp',
        'hubunganpasien',
        'ttdpasien',
        'ttdpetugas',
        'wali1',
        'wali2',
        'hubunganWali1',
        'hubunganWali2'
      ]
      for (let i = 0; i < columns?.length; i++) {
        this.setForm(columns[i], null)
      }
      this.setForm('tanggal', dateDbFormat(new Date()))
    },
    saveGeneralConsentPasien(pegawai) {
      if (!this.form.ttdpasien) {
        notifErrVue('Maaf tanda tangan pasien Belum Ada')
        return
      }
      if (!this.form.norm) {
        notifErrVue('Maaf NORM pasien KOSONG !!!')
        return
      }
      if (!pegawai.nik) {
        notifErrVue('Maaf !, NIK Petugas Tidak Boleh KOSONG !!!')
        return
      }
      // console.log('save general cons', pegawai)
      this.form.nikpetugas = pegawai?.nik
      return new Promise((resolve, reject) => {
        api.post('/v1/simrs/pendaftaran/generalconscent/simpangeneralcontent', this.form)
          .then(resp => {
            // console.log(resp)
            console.log('save general cons', resp)
            this.form.ttdpasien = resp.data?.ttdpasien_url
            this.form.ttdpetugas = resp.data?.ttdpetugas

            // inject data pasien
            const listpasien = useListKunjunganBpjsStore()
            const target = listpasien.items?.find(x => x.norm === resp?.data?.norm)

            const ListPasienRanap = useListGeneralConsentStore()
            const targetRanap = ListPasienRanap.ranap?.find(x => x.noreg === resp?.data?.noreg)

            const ListPasienIgd = useListKunjunganIgdStore()
            const targetIgd = ListPasienIgd.items?.find(x => x?.noreg === resp?.data?.noreg)

            if (target) {
              target.ttdpasien = resp.data?.ttdpasien
              target.generalcons = resp.data
              target.generalcons.pdf = 'generalconsent/' + resp?.data?.norm + '.pdf'
            }

            if (targetRanap) {
              targetRanap.ttdpasien = resp.data?.ttdpasien
              targetRanap.generalcons = resp.data
              targetRanap.generalcons.pdf = 'generalconsent/' + resp?.data?.noreg?.replace(/\//g, '') + '.pdf'
            }

            if (targetIgd) {
              targetIgd.ttdpasien = resp.data?.ttdpasien
              targetIgd.generalconsigd = resp.data
              targetIgd.generalconsigd['pdf'] = 'generalconsent/' + resp?.data?.noreg?.replace(/\//g, '') + '.pdf'
            }

            // console.log('inject', target)

            // inject data pegawai
            const app = useAplikasiStore()
            const user = app?.user?.pegawai

            user.ttdpegawai = resp.data?.ttdpetugas

            // console.log(user)

            resolve(resp)
          }).catch(err => {
            console.log('save general cons', err)
            reject(err)
          })
      })
    },


  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGeneralConsentStore, import.meta.hot))
