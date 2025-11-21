import { api, pathImg } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'
import { onMounted, ref, watch } from 'vue'
import { imageToBase64 } from 'src/modules/imgBase64'

export function useContent(isiPasien, kelompok) {
  const items = ref([])
  const pasien = ref(null)
  const petugas = ref(null)
  const isi = ref('What you see is <b>what</b> you get.')
  const defaultForm = ref('..........................')
  const defWali1 = ref(' 1 ) .............................. ')
  const defWali2 = ref('2) ..............................')
  const hubPasien = ref('2) (Hubungan dengan pasien)')
  const isOk = ref(false)

  async function changeIsi(kelompok) {
    const params = {
      kelompok,
      pernyataan: isi.value
    }
    await api.post('v1/simrs/pendaftaran/generalconscent/simpanmaster', params)
      .then(resp => {
        // console.log(resp)
        notifSuccessVue('Data Sukses tersimpan')
      })
  }

  function updateIsi(key, val) {
    console.log('content', isi.value)
    console.log(key)
  }

  function getDataIrja() {
    const params = {
      params: {
        kelompok: kelompok
      }
    }
    isi.value = null
    return new Promise((resolve, reject) => {
      api.get('/v1/simrs/pendaftaran/generalconscent/mastergeneralconsent', params)
        .then(resp => {
          // console.log(resp)
          if (resp.status === 200) {
            isi.value = resp.data[0].pernyataan
            isOk.value = true
            // isi.value.replace('RSUD Dr.Mohamad Saleh', 'W3Schools')

            // console.log('resp', isi.value)
            // console.log('resp', isi.value.indexOf(defWali1.value))
          }

          resolve(resp)
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })

    // api.get('/v1/simrs/pendaftaran/generalconscent/mastergeneralconsent', params)
    //   .then(resp => {
    //     // console.log(resp)
    //     if (resp.status === 200) {
    //       isi.value = resp.data[0].pernyataan
    //       isOk.value = true
    //     }
    //   })
  }

  function getPasien() {
    pasien.value = isiPasien ?? null
  }


  function initImage(image) {
    console.log('initImage', image);
    Promise.all([
      imageToBase64(image, (base64Image) => {
        pasien.value.ttdPas = base64Image ?? ''
      })
    ])
  }

  watch(() => pasien.value, (n, old) => {
    console.log('watcher pasien', n)
    if (n === true) {
      setTimeout(initImage, 100)
    }
  },
    { immediate: true })

  onMounted(() => {
    getDataIrja()
    getPasien()
    updateIsi()

    initImage(pathImg + pasien?.value?.ttdpasien)
  })
  return {
    items,
    pasien,
    petugas,
    isi,
    defaultForm,
    isOk,
    defWali1,
    defWali2,
    hubPasien,
    changeIsi,
    updateIsi,
    getDataIrja
  }
}
