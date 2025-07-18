import { acceptHMRUpdate, defineStore } from 'pinia'
// eslint-disable-next-line no-unused-vars
import { api } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import { notifErr, notifSuccess } from 'src/modules/utils'
import { useListPasienHemodialisaStore } from './hemodialisa'

export const useHdUploadDokStore = defineStore('upload-dok-hd', {
  state: () => ({
    masters: ['Hemodialisa'],
    form: {},
    loadingSave: false
  }),
  actions: {

    initForm () {
      // anamnesis tambahan
      this.form.nama = null
      this.form.dokumen = []
    },

    // getMaster (isRanap) {
    //   const params = { params: { ranap: isRanap ? '1' : '' } }
    //   return new Promise((resolve, reject) => {
    //     api.get('v1/simrs/hemodialisa/layanan/dokumenupload/master', params)
    //       .then((resp) => {
    //         // console.log(resp)
    //         if (resp.status === 200) {
    //           this.masters = resp.data
    //         }
    //         resolve(resp?.data)
    //       })
    //       .catch((err) => {
    //         // console.log(err)
    //         reject(err)
    //       })
    //   })
    // },

    selectFiles (files) {
      for (let i = 0; i < files?.length; i++) {
        const images = files[i]
        this.form.dokumen.push(images)
      }
      console.log('masukkan ke form', this.form)
    },

    saveData (pasien, isRanap) {
      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.isRanap = isRanap

      const data = new FormData()
      for (let i = 0; i < this.form.dokumen; i++) {
        const images = this.form.dokumen[i]
        data.append(`dokumen[${i}]`, images)
      }
      data.append('noreg', pasien?.noreg)
      data.append('norm', pasien?.norm)
      data.append('nama', this.form.nama)
      this.loadingSave = true
      // console.log(data)
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/hemodialisa/layanan/dokumenupload/store', this.form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((resp) => {
            console.log('upload', resp)
            if (resp.status === 200) {
              const storeHD = useListPasienHemodialisaStore()
              for (let i = 0; i < resp?.data?.result?.length; i++) {
                const isi = resp.data.result[i]
                storeHD.injectDataPasien(pasien?.noreg, isi, 'dokumenluar')
              }
              notifSuccess(resp)
              this.initForm()
              this.loadingSave = false
            }
            resolve(resp?.data)
            this.loadingSave = false
          })
          .catch((err) => {
            console.log(err)
            this.loadingSave = false
            reject(err)
          })
      })
    },

    deleteData (pasien, id) {
      const payload = { id }
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/hemodialisa/layanan/dokumenupload/deletedata', payload)
          .then((resp) => {
            // console.log('del', resp)
            if (resp.status === 200) {
              const storeHD = useListPasienHemodialisaStore()
              storeHD.hapusDataInjectan(pasien, id, 'dokumenluar')

              notifSuccess(resp)
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    }

    // previewData(item) {
    //   this.preview = true
    //   this.form = item
    // }

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHdUploadDokStore, import.meta.hot))
}
