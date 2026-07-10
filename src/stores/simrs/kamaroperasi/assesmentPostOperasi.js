import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useAnamnesisRanapStore } from 'src/stores/simrs/ranap/anamnesis'
import { usePermintaanOperasistore } from 'src/stores/simrs/kamaroperasi/permintaanoperasi'
import { usePemeriksaanUmumRanapStore } from 'src/stores/simrs/ranap/pemeriksaanumum'
import { usePenilaianRanapStore } from 'src/stores/simrs/ranap/penilaian'
import { useDiagnosaKeperawatan } from 'src/stores/simrs/pelayanan/poli/diagnosakeperawatan'
import { useDiagnosaKebidananStore } from 'src/stores/simrs/pelayanan/poli/diagnosakebidanan'
import { getNewLine } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const useAssesmentPostOperasiStore = defineStore('assesment-post-operasi-store', {
  state: () => ({
    items: [],
    notasis: [],
    previousData: null,
    loadingSave: false,

    form: {
      asessment: null,
      diagnosa: null,
      laboratorium: null,
      radiologi: null,
      terapi: null,
      plann: null,
      instruksi: null,
      // tambahan
      o_sambung: null,
      s_sambung: null
    }
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    getCppt(cppt) {
      this.items = cppt ?? []
    },

    getNotasiDpjp(noreg) {
      const params = { params: { noreg } }

      return new Promise((resolve, reject) => {
        api.get('v1/simrs/ranap/layanan/cppt/notasidpjp', params)
          .then((resp) => {
            this.notasis = resp?.data?.result
            resolve(resp)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },

    getPreviousForm(pasien, nakes) {
      const dataAwal = {
        anamnesis: pasien?.anamnesis?.length
          ? pasien.anamnesis?.filter((a) => a?.kdruang !== 'POL014')?.length
            ? pasien.anamnesis?.filter((a) => a?.kdruang !== 'POL014')[0]
            : null
          : null,
        pemeriksaan: pasien?.pemeriksaan?.length
          ? pasien.pemeriksaan?.filter((a) => a?.kdruang !== 'POL014')?.length
            ? pasien.pemeriksaan?.filter((a) => a?.kdruang !== 'POL014')[0]
            : null
          : null,
        penilaian: pasien?.penilaian?.length
          ? pasien.penilaian?.filter((a) => a?.kdruang !== 'POL014')?.length
            ? pasien.penilaian?.filter((a) => a?.kdruang !== 'POL014')[0]
            : null
          : null
      }
      const storeAnamnesis = useAnamnesisRanapStore()
      const storePemeriksaan = usePemeriksaanUmumRanapStore()
      const storePenilaian = usePenilaianRanapStore()

      const cekTerbaru = this.items?.length
        ? this.items?.filter((a) => a?.nakes === nakes)?.length
          ? this.items?.filter((a) => a?.nakes === nakes)[0]
          : null
        : null
      let dataSebelumnya = null

      const auth = useAplikasiStore()
      const pegawai = auth?.user?.pegawai
      const kdpegsimrs = pegawai?.kdpegsimrs

      const cekInputanSendiriTerbaru = this.items?.find((a) => a?.user === kdpegsimrs) || null

      if (!cekTerbaru) {
        dataSebelumnya = dataAwal
        storeAnamnesis.initReset(dataAwal?.anamnesis)
        storePemeriksaan.initReset(dataAwal?.pemeriksaan)
        storePenilaian.initReset(pasien, dataAwal?.penilaian)
      } else {
        if (nakes === '1') {
          dataSebelumnya = cekTerbaru
          storeAnamnesis.initReset(dataSebelumnya?.anamnesis)
          storePemeriksaan.initReset(dataSebelumnya?.pemeriksaan)
          storePenilaian.initReset(pasien, dataSebelumnya?.penilaian)
        } else {
          dataSebelumnya = cekTerbaru
          storeAnamnesis.initReset(dataSebelumnya?.anamnesis)
          storePemeriksaan.initReset(dataSebelumnya?.pemeriksaan)
          storePenilaian.initReset(pasien, dataSebelumnya?.penilaian)
        }
      }
      this.previousData = dataSebelumnya

      // untuk diagnosa keperawatan
      if (nakes === '2') {
        this.initDiagnosaKeperawatan(dataSebelumnya)
        this.form.asessment = dataSebelumnya?.asessment
        this.form.plann = dataSebelumnya?.plann
        this.form.instruksi = dataSebelumnya?.instruksi
        this.form.o_sambung = dataSebelumnya?.o_sambung
        this.form.s_sambung = dataSebelumnya?.s_sambung
      } else if (nakes === '1') {
        this.initMemoDiagnosaToText(pasien?.memodiagnosa)

        if (dataSebelumnya?.plann) { this.form.plann = dataSebelumnya?.plann }
        else { this.initPlannToText(pasien?.planningdokter) }
        if (dataSebelumnya?.instruksi) { this.form.instruksi = dataSebelumnya?.instruksi }
        else { this.initInstruksiToText(pasien?.planningdokter) }
        this.form.o_sambung = dataSebelumnya?.o_sambung
        this.form.s_sambung = dataSebelumnya?.s_sambung
      } else if (nakes === '3') {
        this.initDiagnosaKebidanan(dataSebelumnya)
        this.form.asessment = dataSebelumnya?.asessment
        this.form.plann = dataSebelumnya?.plann
        this.form.instruksi = dataSebelumnya?.instruksi
        this.form.o_sambung = dataSebelumnya?.s_sambung
      } else {
        this.form.asessment = null
        this.form.plann = null
        this.form.instruksi = null
        this.form.o_sambung = null
        this.form.s_sambung = null
      }
    },

    initPlannToText(diag) {
      const text = getNewLine(diag?.terapi)
      this.form.plann = text
    },
    initInstruksiToText(data) {
      const monitor = data?.monitor
      const text = getNewLine(monitor)
      this.form.instruksi = text
    },

    initDiagnosaMedisToText(diag) {
      const diagnosa = diag?.length ? diag?.filter(x => x?.rs13 !== 'POL014') : []
      const text = diagnosa?.length ? diagnosa.map(x => '* ' + x?.rs3 + ' - ' + x?.masterdiagnosa?.rs4).join('\n') : null
      this.form.asessment = text
    },
    initMemoDiagnosaToText(diag) {
      const text = getNewLine(diag)
      this.form.asessment = text ?? null
    },

    initDiagnosaKeperawatan(dataSebelumnya) {
      const storeDiagnosaKeperawatan = useDiagnosaKeperawatan()
      const diagnosKep = dataSebelumnya?.asessment?.replace(/\n/g, '')
      const masterDiagnosaKep = storeDiagnosaKeperawatan.diagnosas
      const splitAssessment = diagnosKep?.split('- ')
      const cariDiagnosaKep = masterDiagnosaKep.filter(row => splitAssessment?.some(value => value?.includes(row?.nama)))
      if (cariDiagnosaKep?.length) storeDiagnosaKeperawatan.selectDiagnosa = cariDiagnosaKep

      // cari intervensi
      const intervensiKep = dataSebelumnya?.instruksi?.replace(/\n/g, '')
      let splitIntervensi = intervensiKep?.split('- ')

      const plannKep = dataSebelumnya?.plann?.replace(/\n/g, '')
      const splitIPlann = plannKep?.split('- ')

      splitIntervensi = splitIntervensi?.concat(splitIPlann)
      const masterIntervensiKep = cariDiagnosaKep?.length ? cariDiagnosaKep.map(x => x?.intervensis)?.flat() : []

      const cariIntervensiKep = masterIntervensiKep.filter(row => splitIntervensi?.some(value => value?.includes(row?.nama)))
      const intervensis = cariIntervensiKep?.length ? cariIntervensiKep.map(x => x?.id + '||' + x?.mdiagnosakeperawatan_kode) : []

      if (cariIntervensiKep?.length) storeDiagnosaKeperawatan.selectIntervensis = intervensis
    },

    initDiagnosaKebidanan(dataSebelumnya) {
      const storeDiagnosaKebidanan = useDiagnosaKebidananStore()
      const diagnosKep = dataSebelumnya?.asessment?.replace(/\n/g, '')
      const masterDiagnosaKep = storeDiagnosaKebidanan.diagnosas
      const splitAssessment = diagnosKep?.split('- ')
      const cariDiagnosaKep = masterDiagnosaKep.filter(row => splitAssessment?.some(value => value?.includes(row?.nama)))
      if (cariDiagnosaKep?.length) storeDiagnosaKebidanan.selectDiagnosa = cariDiagnosaKep

      // cari intervensi
      const intervensiKep = dataSebelumnya?.instruksi?.replace(/\n/g, '')
      let splitIntervensi = intervensiKep?.split('- ')

      const plannKep = dataSebelumnya?.plann?.replace(/\n/g, '')
      const splitIPlann = plannKep?.split('- ')

      splitIntervensi = splitIntervensi?.concat(splitIPlann)
      const masterIntervensiKep = cariDiagnosaKep?.length ? cariDiagnosaKep.map(x => x?.intervensis)?.flat() : []

      const cariIntervensiKep = masterIntervensiKep.filter(row => splitIntervensi?.some(value => value?.includes(row?.nama)))
      const intervensis = cariIntervensiKep?.length ? cariIntervensiKep.map(x => x?.id + '||' + x?.mdiagnosakeperawatan_kode) : []

      if (cariIntervensiKep?.length) storeDiagnosaKebidanan.selectIntervensis = intervensis
    },

    saveCppt(pasien, jnsKasus) {
      this.loadingSave = true
      const kasusKep = jnsKasus?.gruping

      const storeAnamnesis = useAnamnesisRanapStore()
      storeAnamnesis.form.id = null
      let formDefault = storeAnamnesis.form
      formDefault = storeAnamnesis.form
      if (kasusKep === '4.2' || kasusKep === '4.3' || kasusKep === '4.4') {
        formDefault.skreeninggizi = null
        formDefault.keluhannyeri = null
      }

      const anamnesis = {
        noreg: pasien?.noreg ?? null,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        id: null,
        form: formDefault,
        formKebidanan: kasusKep === '4.2' ? storeAnamnesis.formKebidanan : null,
        formNeoNatal: kasusKep === '4.3' ? storeAnamnesis.formNeoNatal : null,
        formPediatrik: kasusKep === '4.4' ? storeAnamnesis.formPediatrik : null
      }

      const storePemeriksaan = usePemeriksaanUmumRanapStore()
      storePemeriksaan.form.id = null
      let frm = storePemeriksaan.form
      frm = storePemeriksaan.form
      if (kasusKep === '4.2' || kasusKep === '4.3' || kasusKep === '4.4') {
        frm.skreeninggizi = null
        frm.keluhannyeri = null
      }

      const pemeriksaan = {
        noreg: pasien?.noreg ?? null,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        id: null,
        form: frm,
        formKebidanan: kasusKep === '4.2' ? storePemeriksaan.formKebidanan : null,
        formNeonatal: kasusKep === '4.3' ? storePemeriksaan.formNeonatal : null,
        formPediatrik: kasusKep === '4.4' ? storePemeriksaan.formPediatrik : null
      }

      const storePenilaian = usePenilaianRanapStore()
      storePenilaian.form.id = null
      const penilaian = {
        barthel: null,
        norton: (storePenilaian.nortons.grupings?.includes(kasusKep)) ? storePenilaian.formNorton : null,
        humpty_dumpty: (storePenilaian.humptys.grupings?.includes(kasusKep) && (storePenilaian.usia < 18)) ? storePenilaian.formHumpty : null,
        morse_fall: (storePenilaian.morses.grupings?.includes(kasusKep) && (storePenilaian.usia >= 18 && storePenilaian.usia < 60)) ? storePenilaian.formMorse : null,
        ontario: (storePenilaian.ontarios.grupings?.includes(kasusKep) && (storePenilaian.usia >= 60)) ? storePenilaian.formOntario : null,
        kdruang: pasien?.kdruangan ?? null,
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        id: null
      }

      const payload = {
        anamnesis,
        pemeriksaan,
        penilaian,
        noreg: pasien?.noreg ?? null,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        id: null,
        form: this.form,
        kdgroup_ruangan: pasien?.kdgroup_ruangan,
        kelas_ruangan: pasien?.kelas_ruangan,
        hak_kelas: pasien?.hak_kelas,
        kodesistembayar: pasien?.kodesistembayar
      }

      return new Promise((resolve, reject) => {
        api.post('v1/simrs/ranap/layanan/cppt/savecppt', payload)
          .then((resp) => {
            if (resp.status === 200) {
              this.items = resp.data?.result
              this.form.asessment = null
              this.form.plann = null
              this.form.instruksi = null
              this.form.laboratorium = null
              this.form.terapi = null
              this.form.radiologi = null
              this.form.diagnosa = null
              const storePasien = usePermintaanOperasistore()
              const findPasien = storePasien.items.find(x => x?.noreg === pasien?.noreg)
              if (findPasien) {
                findPasien.cppt = resp.data.result
              }
            }
            this.loadingSave = false
            resolve(resp)
          })
          .catch((err) => {
            this.loadingSave = false
            console.log(err)
            reject(err)
          })
      })
    },

    async deleteData(pasien, id) {
      const payload = { id }
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/ranap/layanan/cppt/deletecppt', payload)
          .then((resp) => {
            const storePasien = usePermintaanOperasistore()
            storePasien.hapusDataInjectan(pasien, id, 'cppt')
            resolve(resp)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAssesmentPostOperasiStore, import.meta.hot))
}
