import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue } from "src/modules/utils"

export const useKlaimPenjaminanStore = defineStore('klaim-penjaminan', {
  state: () => ({
    loading: false,
    loadingbuka: false,
    loadingTerima: false,
    loadingCaraMasuk: false,
    loadingKunjunganKlaim: false,
    loadingTarifKlaim: false,
    loadingDiagnosaIdrg: false,
    loadingnewclaim: false,
    items: [],
    caraMasukOptions: [],
    kunjunganKlaim: null,
    covid19Klaim: null,
    sudahPernahKlaim: 0,
    totalTarifKlaim: 0,
    tarifKlaim: null,
    noregTarifAktif: null,
    diagnosaIdrgOptions: [],
    newClaimResponse: null,
    meta: {},
    pageLayanan: false,
    formpasien: {
      jaminan: '3;JKN',
      noPeserta: '',
      noSep: '',
      cob: '',
      jenisRawat: '2',
      kelasEksekutif: false,
      naikTurunKelas: false,
      adaRawatIntensif: false,
      kelasRawat: '3',
      caraMasuk: '',
      beratLahir: 0,
      adlSubAcute: '',
      adlChronic: '',
      caraPulang: '1',
      dpjp: '',
      jenisTarif: 'kelas_c_pemerintah',
      pasienTb: false,
      nomorRegisterSitb: '',
      pernyataan: true,
      sistole: 0,
      diastole: 0,
      pencarianDiagnosa: null,
      pencarianProsedur: '',
      diagnosaIdrg: [],
      prosedurIdrg: [],
      hasilIdrg: null,
      tarif: {
        prosedurNonBedah: 0,
        prosedurBedah: 0,
        konsultasi: 0,
        tenagaAhli: 0,
        keperawatan: 0,
        penunjang: 0,
        radiologi: 0,
        laboratorium: 0,
        pelayananDarah: 0,
        rehabilitasi: 0,
        kamar: 0,
        rawatIntensif: 0,
        obat: 0,
        obatKronis: 0,
        obatKemoterapi: 0,
        alkes: 0,
        bmhp: 0,
        sewaAlat: 0
      }
    },
    params: {
      q: '',
      page: 1,
      per_page: 10,
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
      pelayanan: 1
    }
  }),
  actions: {
    async cariDiagnosaIdrg(term) {
      const pencarian = String(term ?? '').trim()
      if (pencarian.length < 2) {
        this.diagnosaIdrgOptions = []
        return []
      }

      this.loadingDiagnosaIdrg = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/diagnosa-idrg', {
          params: { term: pencarian }
        })
        this.diagnosaIdrgOptions = resp?.data ?? []
        return this.diagnosaIdrgOptions
      }
      catch (error) {
        this.diagnosaIdrgOptions = []
        notifErrVue('Gagal mencari diagnosa iDRG')
        return []
      }
      finally {
        this.loadingDiagnosaIdrg = false
      }
    },
    async getTarifKlaim(noreg, layanan = '') {
      if (!noreg) return null

      this.noregTarifAktif = noreg
      this.loadingTarifKlaim = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/tarif', {
          params: {
            noreg_utama: noreg,
            layanan
          }
        })
        const result = resp?.data ?? {}
        if (this.noregTarifAktif !== noreg) return null
        this.tarifKlaim = result
        this.totalTarifKlaim = Number(result?.total_tarif ?? 0)
        this.formpasien.tarif = {
          prosedurNonBedah: Number(result?.prosedur_non_bedah ?? 0),
          prosedurBedah: Number(result?.prosedur_bedah ?? 0),
          konsultasi: Number(result?.konsultasi ?? 0),
          tenagaAhli: Number(result?.tenaga_ahli ?? 0),
          keperawatan: Number(result?.keperawatan ?? 0),
          penunjang: Number(result?.penunjang ?? 0),
          radiologi: Number(result?.radiologi ?? 0),
          laboratorium: Number(result?.laboratorium ?? 0),
          pelayananDarah: Number(result?.pelayanan_darah ?? 0),
          rehabilitasi: Number(result?.rehabilitasi ?? 0),
          kamar: Number(result?.kamar ?? 0),
          rawatIntensif: Number(result?.rawat_intensif ?? 0),
          obat: Number(result?.obat ?? 0),
          obatKronis: Number(result?.obat_kronis ?? 0),
          obatKemoterapi: Number(result?.obat_kemoterapi ?? 0),
          alkes: Number(result?.alkes ?? 0),
          bmhp: Number(result?.bmhp ?? 0),
          sewaAlat: Number(result?.sewa_alat ?? 0)
        }

        return result
      }
      catch (error) {
        if (this.noregTarifAktif !== noreg) return null
        this.tarifKlaim = null
        this.totalTarifKlaim = 0
        notifErrVue('Gagal mengambil tarif klaim')
        return null
      }
      finally {
        if (this.noregTarifAktif === noreg) this.loadingTarifKlaim = false
      }
    },
    async getKunjunganKlaim(noreg, layanan = '') {
      if (!noreg) {
        this.kunjunganKlaim = null
        this.covid19Klaim = null
        this.sudahPernahKlaim = 0
        this.totalTarifKlaim = 0
        return null
      }

      this.loadingKunjunganKlaim = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/kunjungan-klaim', {
          params: { noreg, layanan }
        })
        const result = resp?.data ?? {}

        this.kunjunganKlaim = result?.data ?? null
        this.covid19Klaim = result?.covid19 ?? null
        this.sudahPernahKlaim = Number(result?.sudahpernahklaim ?? 0)
        this.totalTarifKlaim = Number(result?.total_tarif ?? 0)

        return result
      }
      catch (error) {
        this.kunjunganKlaim = null
        this.covid19Klaim = null
        this.sudahPernahKlaim = 0
        this.totalTarifKlaim = 0
        notifErrVue('Gagal mengambil data kunjungan klaim')
        return null
      }
      finally {
        this.loadingKunjunganKlaim = false
      }
    },
    async getCaraMasuk() {
      this.loadingCaraMasuk = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/cara-masuk')
        this.caraMasukOptions = [
          { label: '-', value: '' },
          ...(resp?.data ?? []).map(item => ({
            label: item.keterangan,
            value: item.kode
          }))
        ]
      }
      catch (error) {
        this.caraMasukOptions = [{ label: '-', value: '' }]
        notifErrVue('Gagal mengambil data cara masuk')
      }
      finally {
        this.loadingCaraMasuk = false
      }
    },
    resetFormKlaim() {
      this.noregTarifAktif = null
      this.loadingTarifKlaim = false
      this.tarifKlaim = null
      this.totalTarifKlaim = 0
      this.formpasien = {
        jaminan: '3;JKN',
        noPeserta: '',
        noSep: '',
        cob: '',
        jenisRawat: '2',
        kelasEksekutif: false,
        naikTurunKelas: false,
        adaRawatIntensif: false,
        kelasRawat: '3',
        caraMasuk: '',
        beratLahir: 0,
        adlSubAcute: '',
        adlChronic: '',
        caraPulang: '1',
        dpjp: '',
        jenisTarif: 'kelas_c_pemerintah',
        pasienTb: false,
        nomorRegisterSitb: '',
        pernyataan: true,
        sistole: 0,
        diastole: 0,
        pencarianDiagnosa: null,
        pencarianProsedur: '',
        diagnosaIdrg: [],
        prosedurIdrg: [],
        hasilIdrg: null,
        tarif: {
          prosedurNonBedah: 0,
          prosedurBedah: 0,
          konsultasi: 0,
          tenagaAhli: 0,
          keperawatan: 0,
          penunjang: 0,
          radiologi: 0,
          laboratorium: 0,
          pelayananDarah: 0,
          rehabilitasi: 0,
          kamar: 0,
          rawatIntensif: 0,
          obat: 0,
          obatKronis: 0,
          obatKemoterapi: 0,
          alkes: 0,
          bmhp: 0,
          sewaAlat: 0
        }
      }
    },
    setParams(key, val) {
      this.params[key] = val
    },
    goToPage(val) {
      this.params.page = val
      this.getData()
    },
    search(val) {
      this.params.q = val
      this.params.page = 1
      this.getData()
    },
    refresh(val) {
      this.params.page = 1
      this.getData()
    },
    async getData() {
      this.loading = true
      const params = { params: this.params }
      await api.get('v1/simrs/penjaminan/klaim/getdataklaim', params)
        .then(resp => {
          // console.log('kunjungan igd', resp?.data?.data)
          this.loading = false
          this.pasiens = resp?.data?.data
          this.items = resp?.data?.data
          this.meta = resp?.data
        })
        .catch(() => { this.loading = false })
    },
    async bukaLayanan(pasien) {
      this.loadingTerima = true

      const form = { noreg: pasien?.noreg }
      this.noreg = pasien?.noreg
      this.togglePageTindakan()
      try {
        const resp = await api.post('v1/simrs/pelayanan/igd/terimapasien', form)
        if (resp.status === 200) {
          const findPasien = this.items.filter(x => x?.noreg === pasien?.noreg)
          console.log('findPasien', findPasien)
          if (findPasien?.length) {
            // findPasien[0].status = findPasien[0].status === '' ? '2' : findPasien[0].status

            // BARU
            findPasien[0].triage = resp?.data?.triage
            findPasien[0].anamnesis = resp?.data?.anamnesis
            findPasien[0].penilaiananamnesis = resp?.data?.penilaiananamnesis
            findPasien[0].datasimpeg = resp?.data?.datasimpeg
            findPasien[0].diagnosa = resp?.data?.diagnosa
            findPasien[0].permintaanperawatanjenazah = resp?.data?.permintaanperawatanjenazah
            findPasien[0].historyperkawinan = resp?.data?.historyperkawinan
            findPasien[0].historykehamilan = resp?.data?.historykehamilan
            findPasien[0].anamnesekebidanan = resp?.data?.anamnesekebidanan
            findPasien[0].fisio = resp?.data?.fisio
            findPasien[0].diagnosakeperawatan = resp?.data?.diagnosakeperawatan
            findPasien[0].laborats = resp?.data?.laborats
            findPasien[0].newapotekrajal = resp?.data?.newapotekrajal
            findPasien[0].newapotekrajalretur = resp?.data?.newapotekrajalretur
            findPasien[0].ok = resp?.data?.ok
            findPasien[0].diagnosakebidanan = resp?.data?.diagnosakebidanan
            findPasien[0].penunjanglain = resp?.data?.penunjanglain
            findPasien[0].ambulan = resp?.data?.ambulan
            findPasien[0].radiologi = resp?.data?.radiologi
            findPasien[0].bankdarah = resp?.data?.bankdarah
            findPasien[0].planheder = resp?.data?.planheder
            findPasien[0].tindakan = resp?.data?.tindakan
            findPasien[0].laboratold = resp?.data?.laboratold
            findPasien[0].pemeriksaanfisikpsikologidll = resp?.data?.pemeriksaanfisikpsikologidll
            findPasien[0].konsultasi = resp?.data?.konsuldokterspesialis
            findPasien[0].tinjauanulang = resp?.data?.tinjauanulang
            findPasien[0].skalatransfer = resp?.data?.skalatransfer
            findPasien[0].pemberianobat = resp?.data?.pemberianobat
            findPasien[0].rencanaterapidokter = resp?.data?.rencanaterapidokter
            findPasien[0].dokumenluar = resp?.data?.dokumenluar
            findPasien[0].hasilradiologi = resp?.data?.hasilradiologi
            findPasien[0].rs35x = resp?.data?.rs35x
            findPasien[0].transradiologi = resp?.data?.transradiologi
            findPasien[0].bankdarahtrans = resp?.data?.bankdarahtrans
            findPasien[0].oktrans = resp?.data?.oktrans
            findPasien[0].kamarjenazah = resp?.data?.kamarjenazah
            findPasien[0].ambulantrans = resp?.data?.ambulantrans
            findPasien[0].jawabankonsulbynoreg = resp?.data?.jawabankonsulbynoreg
            // BARU
            // findPasien[0].laporantindakan = resp?.data?.laporantindakan
            // findPasien[0].psikiatri = resp?.data?.psikiatri
            // findPasien[0].neonatusmedis = resp?.data?.neonatusmedis
            // findPasien[0].neonatuskeperawatan = resp?.data?.neonatuskeperawatan
            // findPasien[0].pediatri = resp?.data?.pediatri
            // findPasien[0].kandungan = resp?.data?.kandungan
            // findPasien[0].dokumenluar = resp?.data?.dokumenluar
          }
          this.loadingTerima = false
          console.log('items', this.items)
          this.noreg = null
        }
      }
      catch (error) {
        console.log(error)
        this.loadingTerima = false
        this.noreg = null
        this.notifikasiError('Maaf.. Harap ulangi, Ada Kesalahan ')
      }
    },
    async bukaLayananrajal(pasien) {
      this.loadingTerima = true
      const form = { noreg: pasien?.noreg }
      this.noreg = pasien?.noreg
      this.togglePageTindakan()
      try {
        const resp = await api.post('v1/simrs/rajal/poli/terimapasien', form)
        // console.log('terima', resp)
        if (resp.status === 200) {
          const findPasien = this.items.filter(x => x?.noreg === pasien?.noreg)
          if (findPasien?.length) {
            findPasien[0].status = findPasien[0].status === '' ? '2' : findPasien[0].status
            const responseData = resp?.data?.result ?? null
            // BARU
            findPasien[0].anamnesis = responseData?.anamnesis
            findPasien[0].datasimpeg = responseData?.datasimpeg
            findPasien[0].diagnosa = responseData?.diagnosa
            findPasien[0].diagnosakeperawatan = responseData?.diagnosakeperawatan
            findPasien[0].diagnosakebidanan = responseData?.diagnosakebidanan
            findPasien[0].diet = responseData?.diet
            findPasien[0].edukasi = responseData?.edukasi
            findPasien[0].fisio = responseData?.fisio
            findPasien[0].gambars = responseData?.gambars
            findPasien[0].laborats = responseData?.laborats
            findPasien[0].laboratold = responseData?.laboratold
            findPasien[0].newapotekrajal = responseData?.newapotekrajal
            findPasien[0].ok = responseData?.ok
            findPasien[0].pemeriksaanfisik = responseData?.pemeriksaanfisik
            findPasien[0].penunjanglain = responseData?.penunjanglain
            findPasien[0].planning = responseData?.planning
            findPasien[0].radiologi = responseData?.radiologi
            findPasien[0].sharing = responseData?.sharing
            findPasien[0].taskid = responseData?.taskid
            findPasien[0].tindakan = responseData?.tindakan
            // BARU
            findPasien[0].laporantindakan = responseData?.laporantindakan
            findPasien[0].psikiatri = responseData?.psikiatri
            findPasien[0].neonatusmedis = responseData?.neonatusmedis
            findPasien[0].neonatuskeperawatan = responseData?.neonatuskeperawatan
            findPasien[0].pediatri = responseData?.pediatri
            findPasien[0].kandungan = responseData?.kandungan
            findPasien[0].dokumenluar = responseData?.dokumenluar
            findPasien[0].rs19 = responseData?.rs19
            // jawabn konsul
            findPasien[0].jawabankonsul = responseData?.jawabankonsul
            findPasien[0].jawabankonsulbynoreg = responseData?.jawabankonsulbynoreg
            findPasien[0].intradialitik = responseData?.intradialitikhd

          }
          this.loadingTerima = false
          this.noreg = null
        }
      }
      catch (error) {
        console.log(error)
        this.loadingTerima = false
        this.noreg = null
        this.notifikasiError('Maaf.. Harap ulangi, Ada Kesalahan ')
      }
    },
    togglePageTindakan() {
      this.pageLayanan = !this.pageLayanan
    },
    notifikasiError(msg) {
      notifErrVue(msg)
    },
    async newclaim() {
      this.loadingnewclaim = true
      try {
        const resp = await api.post('v1/simrs/penjaminan/klaim/new-claim', this.formpasien, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        const result = resp?.data ?? null
        this.newClaimResponse = result
        return result
      }
      catch (error) {
        this.newClaimResponse = null
        notifErrVue(error?.response?.data?.message ?? 'Gagal membuat klaim baru')
        return null
      }
      finally {
        this.loadingnewclaim = false
      }
    }
  }
})
