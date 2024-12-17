import { defineStore } from 'pinia'
import { api, pathImg } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'
import { usePengunjungPoliStore } from './pengunjung'
import { useMasterPemeriksaanFisik } from '../../master/poliklinik/pemeriksaanfisik'
// import { api } from 'src/boot/axios'

export const usePemeriksaanFisik = defineStore('pemeriksaan-fisik', {
  state: () => ({
    tab: 'Fisik',
    tabs: ['Fisik', 'Anatomy'],
    dialogTemplate: false,
    fullCanvas: false,
    templateActive: 'Body',
    gambarActive: 0,
    // fileGambar: '/src/assets/human/anatomys/body-human.jpg',
    fileGambar: null,
    urlGambar: null,
    writingMode: false,
    dialogForm: {
      anatomy: '',
      ket: '',
      x: 0,
      y: 0,
      ketebalan: 2,
      panjang: 7,
      width: 15,
      height: 15,
      warna: '#000000',
      penanda: 'circle',
      // baru
      angle: 0,
      tinggi: 0,
      fill: 'transparent'
    },
    formMata: {
      vodawal: '',
      vodrefraksi: '',
      vodakhir: '',
      vosawal: '',
      vosrefraksi: '',
      vosakhir: '',
      tod: '',
      tos: '',
      fondosod: '',
      fondosos: ''
    },
    formParu: {
      statuslokalis: ''
    },
    shapes: [],
    mata: [],
    paru: [],
    selectStatusPsikologi: [],
    formVital: {
      tingkatkesadaran: 0,
      denyutjantung: '', // string
      pernapasan: '', // string
      // Tekanan darah
      sistole: 0, // numerik per mmHg
      diastole: 0, // numerik per mmHg
      suhutubuh: 0, // numerik derajat celcius
      // status
      statuspsikologis: 'Tidak ada kelainan',
      sosialekonomi: '',
      spiritual: '',
      skornyeri: 0,
      keteranganskornyeri: 'tidak ada nyeri',

      // baru
      kesadaran: '',
      kesadarane: 0,
      kesadaranm: 0,
      kesadaranv: 0,

      // khususparu baru
      inspeksi: '',
      palpasi: '',
      perkusidadakanan: '',
      perkusidadakiri: '',
      auskultasisuaradasar: '',
      auskultasisuaratambahankanan: '',
      auskultasisuaratambahankiri: '',

      // barulagi
      statusneurologis: '',
      muakuloskeletal: '',
      // barulagi
      tinggibadan: 0.0,
      beratbadan: 0.0,
      vas: 0
    },
    inspeksis: [],
    palpasis: [],
    perkusidadakanans: [],
    perkusidadakiris: [],
    auskultasisuaradasars: [],
    auskultasisuaratambahankanans: [],
    auskultasisuaratambahankiris: [],
    optionsTingkatkesadaran: [
      { value: 0, label: 'Sadar Baik/Alert' }, // 248234008
      { value: 1, label: 'Berespon denga kata-kata / Voice' }, // 300202002
      { value: 2, label: 'Hanya berespons jika dirangsang nyeri / Pain' }, // 450847001
      { value: 3, label: 'Pasien tidak sadar / Unresponsive' }, // 422768004
      { value: 4, label: 'Gelisah atau bingung' }, // 130987000
      { value: 5, label: 'Acute Confusional States' } // 2776000
    ],
    loadingform: false,
    edited: false,
    deleteShapes: [],
    historys: []
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    setFormVital (key, val) {
      this.formVital[key] = val
    },
    setTemplateActive (val) {
      this.templateActive = val
      this.dialogForm.anatomy = val === 'Body' ? '' : val
    },
    setGambarActive (val, file) {
      this.gambarActive = val
      this.fileGambar = file
      this.setDialogTemplate()
      // // console.log('store file', file)
    },
    setFullCanvas () {
      this.fullCanvas = !this.fullCanvas
      // // console.log(this.fullCanvas)
      // const master = useMasterPemeriksaanFisik()
      // const file = master?.items[0]?.gambars[0]?.url
      // this.templateActive = this
      // this.gambarActive = 0
      // this.fileGambar = file ?? null
    },
    setFullCanvasFalse () {
      this.fullCanvas = false
    },
    pushShapes (val) {
      return new Promise((resolve, reject) => {
        const newArr = [...this.shapes]
        newArr.push(val)
        this.shapes = newArr
        // this.setDialogForm('anatomy', '')
        this.setDialogForm('ket', '')

        if (val.anatomy === 'Mata') {
          const newMata = [...this.mata]
          newMata.push(this.formMata)
          this.mata = newMata
        }
        if (val.anatomy === 'Dada dan Paru') {
          const newParu = [...this.paru]
          newParu.push(this.formParu)
          this.paru = newParu
        }

        this.resetFormMataDanParu()
        this.resetDialogForm(this.templateActive, this.dialogForm.penanda)
        resolve()
      })
    },

    deleteObjShapes (idx) {
      // const index = this.shapes.indexOf(idx);
      if (this.shapes[idx]?.id) {
        this.deleteShapes.push(this.shapes[idx]?.id)
      }

      if (idx > -1) { // only splice array when item is found
        this.shapes.splice(idx, 1) // 2nd parameter means remove one item only
        this.mata.splice(idx, 1)
      }
    },

    resetShapes () {
      const a = this.shapes
      const b = a.filter(x => x.templategambar === this.fileGambar)
      b.forEach(f => a.splice(a.findIndex(e => e.templategambar === f.templategambar), 1))
      // this.shapes = []
      this.mata = []
      this.paru = []
    },
    deleteObjectOnShapes (x, y) {
      return new Promise((resolve, reject) => {
        const a = this.shapes
        const idx = a.findIndex(e => e.x === x && e.y === y)
        // b.forEach(f => a.splice(a.findIndex(e => e.templategambar === f.templategambar), 1))
        if (this.shapes[idx]?.id) {
          this.deleteShapes.push(this.shapes[idx]?.id)
        }
        a.splice(a.findIndex(e => e.x === x && e.y === y), 1)
        this.mata?.splice(a.findIndex(e => e.x === x && e.y === y), 1)
        // console.log('store delete object', a)
        resolve()
      })
    },

    setShapeObject (index, key, value) {
      const a = this.shapes
      const b = a.filter(x => x.templategambar === this.fileGambar)
      b[index][key] = value
    },

    resetFormMataDanParu () {
      this.formMata = {
        vodawal: '',
        vodrefraksi: '',
        vodakhir: '',
        vosawal: '',
        vosrefraksi: '',
        vosakhir: '',
        tod: '',
        tos: '',
        fondosod: '',
        fondosos: ''
      }
      this.formParu = {
        statuslokalis: ''
      }
    },

    setDialogForm (key, val) {
      this.dialogForm[key] = val
    },
    setDialogTemplate () {
      // // console.log('oooi')
      this.dialogTemplate = !this.dialogTemplate
    },

    setKeteranganSkornyeri (val) {
      if (val === 0) {
        this.formVital.keteranganskornyeri = 'tidak ada nyeri'
      }
      else if (val > 0 && val <= 3) {
        this.formVital.keteranganskornyeri = 'nyeri ringan'
      }
      else if (val > 3 && val <= 6) {
        this.formVital.keteranganskornyeri = 'nyeri sedang'
      }
      else if (val > 6 && val <= 10) {
        this.formVital.keteranganskornyeri = 'nyeri berat'
      }
    },

    setTingkatKesadaran (val) {
      let result = ''
      if (val === 3) {
        result = 'Coma' // 371632003
      }
      else if (val > 3 && val <= 6) {
        result = 'Stupor' // 89458003
      }
      else if (val > 6 && val <= 9) {
        result = 'Somnolen' // 79519003
      }
      else if (val > 9 && val <= 11) {
        result = 'Delirium' // 2776000
      }
      else if (val > 11 && val <= 13) {
        result = 'Apatis' // 20602000 Apathetic
      }
      else if (val > 13 && val <= 15) {
        result = 'Compos Mentis'
      }

      this.formVital.kesadaran = result
    },
    async savePemeriksaan (pasien, menus) {
      this.loadingform = true
      const arr = menus.length > 0 ? menus.filter(x => x.nama !== 'Body').map(y => y.nama) : []

      const arr2 = this.shapes
      const anatomys = []
      for (let i = 0; i < arr.length; i++) {
        let obj = { nama: arr[i], ket: 'Tidak Ada Kelainan / TAK' }
        const ada = arr2.filter(x => x.anatomy === arr[i])
        if (ada.length > 0) {
          obj = { nama: ada[0].anatomy, ket: ada.map(x => x.ket).join() ?? 'Tidak Ada Kelainan / TAK' }
        }

        anatomys.push(obj)
      }
      const form = this.formVital
      form.noreg = pasien ? pasien.noreg : ''
      form.norm = pasien ? pasien.norm : ''
      form.ruangan = pasien ? pasien.poli : ''
      form.details = arr2
      form.anatomys = anatomys

      // FORm LOKALIS MATA

      if (this.mata.length) {
        form.mata = this.mata
      }

      // form lokalis Paru

      if (this.paru.length) {
        form.paru = this.paru
      }

      form.deleteDetails = this.deleteShapes
      // // console.log('LOG FORM', form)
      try {
        const resp = await api.post('v1/simrs/pelayanan/simpanpemeriksaanfisik', form)
        // console.log('save', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          const isi = resp.data.result
          storePasien.injectDataPasien(pasien, isi, 'pemeriksaanfisik')

          notifSuccess(resp)
          this.initReset(false, pasien)
          this.loadingform = false
          this.edited = false
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
        this.loadingform = false
      }
      catch (error) {
        // console.log('savepemeriksaan', error)
        // notifErr(error.response)
        this.loadingform = false
      }
    },

    async deleteData (pasien, id) {
      const payload = { id }
      try {
        const resp = await api.post('v1/simrs/pelayanan/hapuspemeriksaanfisik', payload)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          storePasien.hapusDataPemeriksaanfisik(pasien, id)
          this.initReset(false, pasien)
          notifSuccess(resp)
        }
      }
      catch (error) {
        // console.log(error)
      }
    },

    async saveImage (img, pasien, details) {
      // // console.log(details)
      this.loadingform = true
      let keterangan = ''
      if (details.length) {
        keterangan = details.map(x => x.ket).join()
      }
      const obj = {
        noreg: pasien ? pasien.noreg : '',
        norm: pasien ? pasien.norm : '',
        image: img,
        keterangan
      }
      try {
        const resp = await api.post('v1/simrs/pelayanan/simpangambar', obj)
        if (resp.status === 200) {
          // console.log('simpan gambar', resp)
          const storePasien = usePengunjungPoliStore()
          const isi = resp.data.result
          storePasien.injectDataPasien(pasien, isi, 'gambars')
          notifSuccess(resp)
          this.loadingform = false
        }
        this.loadingform = false
      }
      catch (error) {
        this.loadingform = false
      }
    },

    async deleteGambar (pasien, nama) {
      this.loadingform = true
      const payload = { nama }
      try {
        const resp = await api.post('v1/simrs/pelayanan/hapusgambar', payload)
        if (resp.status === 200) {
          // // console.log(resp)
          const storePasien = usePengunjungPoliStore()
          storePasien.hapusGambars(pasien, nama)
          notifSuccess(resp)
          this.loadingform = false
          // this.fileGambar = '/src/assets/human/anatomys/body-human.jpg'
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
        this.loadingform = false
      }
      catch (error) {
        // console.log(error)
        this.loadingform = false
      }
    },

    initReset (val, pasien) {
      // ini load template gambar pertama
      const master = useMasterPemeriksaanFisik()
      let file = null
      let template = null
      let imgUrl = null
      let imgActive = 0
      // let lokalis = []
      if (val) {
        file = master?.items[0]?.gambars[0]?.image
        imgUrl = master?.items[0]?.gambars[0]?.url
        template = master?.items[0]?.nama ?? 'Body'
        imgActive = 0
      }
      else {
        // const arr = master?.items?.map(x => x.lokalis)
        // lokalis = arr.filter(v => v?.indexOf(pasien?.kodepoli) > -1)
        file = master?.items?.filter(x => x?.lokalis?.indexOf(pasien?.kodepoli) > -1)[0]?.gambars[0]?.image ?? master?.items[0]?.gambars[0]?.image
        imgUrl = master?.items?.filter(x => x?.lokalis?.indexOf(pasien?.kodepoli) > -1)[0]?.gambars[0]?.url ?? master?.items[0]?.gambars[0]?.url
        template = master?.items?.filter(x => x?.lokalis?.indexOf(pasien?.kodepoli) > -1)[0]?.nama ?? 'Body'
        imgActive = this.gambarActive
      }
      this.fileGambar = file
      this.templateActive = template
      this.urlGambar = pathImg + imgUrl
      // // console.log('init url', pathImg + imgUrl)
      // // console.log('init', file)
      // // console.log('init template', this.templateActive)
      // // console.log('init gambar', this.gambarActive)
      // // console.log('init master', master?.items)

      this.deleteShapes = []

      return new Promise((resolve, reject) => {
        this.edited = false
        this.dialogTemplate = false
        // this.templateActive = 'Body'
        // this.gambarActive = 0
        // this.fileGambar = file ?? null
        this.templateActive = template
        this.gambarActive = imgActive
        // this.fileGambar = val ? file ?? null : this.fileGambar
        // this.urlGambar = val ? imgUrl ?? null : this.urlGambar
        this.writingMode = false
        this.dialogForm = {
          anatomy: template === 'Body' ? '' : template,
          ket: '',
          x: 0,
          y: 0,
          ketebalan: 2,
          panjang: 15,
          width: 30,
          height: 30,
          warna: '#000000',
          penanda: 'circle',
          // baru
          angle: 0,
          tinggi: 15,
          fill: 'transparent'
        }
        // this.dialogForm.anatomy = template
        this.shapes = []
        this.mata = []
        this.paru = []
        // this.shapes = val ? [] : this.shapes
        this.selectStatusPsikologi = []
        this.formVital = {
          tingkatkesadaran: 0,
          denyutjantung: '', // string
          pernapasan: '', // string
          // Tekanan darah
          sistole: 0, // numerik per mmHg
          diastole: 0, // numerik per mmHg
          suhutubuh: 0, // numerik derajat celcius
          // status
          statuspsikologis: 'Tidak ada kelainan',
          sosialekonomi: '',
          spiritual: '',
          skornyeri: 0,
          keteranganskornyeri: 'tidak ada nyeri',

          // baru
          kesadaran: '',
          kesadarane: 0,
          kesadaranm: 0,
          kesadaranv: 0,

          // khusu paru baru
          inspeksi: '',
          palpasi: '',
          perkusidadakanan: '',
          perkusidadakiri: '',
          auskultasisuaradasar: '',
          auskultasisuaratambahankanan: '',
          auskultasisuaratambahankiri: '',
          // barulagi
          statusneurologis: '',
          muakuloskeletal: '',
          // barulagi
          tinggibadan: 0.0,
          beratbadan: 0.0,
          vas: 0
        }

        this.inspeksis = []
        this.palpasis = []
        this.perkusidadakanans = []
        this.perkusidadakiris = []
        this.auskultasisuaradasars = []
        this.auskultasisuaratambahankanans = []
        this.auskultasisuaratambahankiris = []

        resolve()
      })
    },

    resetDialogForm (template, penanda) {
      this.dialogForm = {
        anatomy: template === 'Body' ? '' : template,
        ket: '',
        x: 0,
        y: 0,
        ketebalan: 2,
        panjang: 15,
        width: 30,
        height: 30,
        warna: '#000000',
        penanda: penanda ?? 'circle',
        // baru
        angle: 0,
        tinggi: 15,
        fill: 'transparent'
      }
    },

    editForm (item, pasien) {
      // console.log('edit form', item)
      this.initReset(false, pasien)
      this.edited = true
      this.formVital = {
        id: item?.id,
        tingkatkesadaran: item?.tingkatkesadaran,
        denyutjantung: item?.rs4, // string
        pernapasan: item?.pernapasan, // string
        sistole: item?.sistole, // numerik per mmHg
        diastole: item?.diastole, // numerik per mmHg
        suhutubuh: item?.suhutubuh, // numerik derajat celcius
        statuspsikologis: item?.statuspsikologis,
        sosialekonomi: item?.sosialekonomi,
        spiritual: item?.spiritual,
        skornyeri: item?.skornyeri,
        keteranganskornyeri: item?.keteranganskornyeri,
        kesadaran: item?.kesadaran,
        kesadarane: item?.kesadarane,
        kesadaranm: item?.kesadaranm,
        kesadaranv: item?.kesadaranv,
        inspeksi: item?.inspeksi,
        palpasi: item?.palpasi,
        perkusidadakanan: item?.perkusidadakanan,
        perkusidadakiri: item?.perkusidadakiri,
        auskultasisuaradasar: item?.auskultasisuaradasar,
        auskultasisuaratambahankanan: item?.auskultasisuaratambahankanan,
        auskultasisuaratambahankiri: item?.auskultasisuaratambahankiri,
        statusneurologis: item?.statusneurologis,
        muakuloskeletal: item?.muakuloskeletal,
        // barulagi
        tinggibadan: item?.tinggibadan,
        beratbadan: item?.beratbadan,
        vas: item?.vas
      }

      // const master = useMasterPemeriksaanFisik()
      this.selectStatusPsikologi = item?.statuspsikologis ? item?.statuspsikologis?.split(', ') : []
      this.inspeksis = item?.inspeksi ? item?.inspeksi?.split('||') : []
      this.palpasis = item?.palpasis ? item?.palpasi?.split('||') : []
      this.perkusidadakanans = item?.perkusidadakanan ? item?.perkusidadakanan?.split('||') : []
      this.perkusidadakiris = item?.perkusidadakiri ? item?.perkusidadakiri?.split('||') : []
      this.auskultasisuaradasars = item?.auskultasisuaradasar ? item?.auskultasisuaradasar?.split('||') : []
      this.auskultasisuaratambahankanans = item?.auskultasisuaratambahankanan ? item?.auskultasisuaratambahankanan?.split('||') : []
      this.auskultasisuaratambahankiris = item?.auskultasisuaratambahankiri ? item?.auskultasisuaratambahankiri?.split('||') : []
      this.shapes = []
      const arr = item?.detailgambars.filter(x => x.templategambar === this.fileGambar)
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i]
        el.ids = [i]
      }
      this.shapes = arr
      this.fileGambar = item?.detailgambars[0]?.templategambar ?? this.fileGambar
      this.templateActive = item?.detailgambars[0]?.templatemenu ?? this.templateActive
      this.gambarActive = parseInt(item?.detailgambars[0]?.templateindex) ?? this.gambarActive

      // this.mata = item?.pemeriksaankhususmata
      const matasx = item?.pemeriksaankhususmata
      if (matasx.length && arr.length) {
        matasx.map(x => {
          const obj = {
            rs1: x?.rs1,
            rs2: x?.rs2,
            vodawal: x.rs4,
            vodrefraksi: x?.rs5,
            vodakhir: x?.rs6,
            vosawal: x?.rs7,
            vosrefraksi: x?.rs8,
            vosakhir: x?.rs9,
            tod: x?.rs10,
            tos: x?.rs11,
            fondosod: x?.rs12,
            fondosos: x?.rs13
          }

          return obj
        })

        this.mata = matasx
      }
      else {
        this.mata = []
      }

      // console.log('edit mata', this.mata)
    },

    setNotEdit () {
      this.edited = false
    },

    async getHistory (norm) {
      console.log(norm)
      this.loadingHistory = true
      const params = { params: { norm } }
      try {
        const resp = await api.get('v1/simrs/pelayanan/historypemeriksaanfisik', params)
        console.log('history', resp)
        if (resp.status === 200) {
          if (resp.data?.length) {
            const arr = resp.data
            this.historyMeta = null
            this.historys = arr
          }
          else {
            this.historys = []
          }
        }
        this.loadingHistory = false
      }
      catch (error) {
        this.loadingHistory = false
        // notifErr(error)
      }
    }

  }
})
