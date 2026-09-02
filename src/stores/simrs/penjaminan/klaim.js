import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue } from "src/modules/utils"

const DEFAULT_TOPUP_DRUG_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Deferiprone', value: '10012' },
  { label: 'Deferoksamin', value: '10022' },
  { label: 'Deferasirox', value: '10032' }
]

export const useKlaimPenjaminanStore = defineStore('klaim-penjaminan', {
  state: () => ({
    loading: false,
    loadingbuka: false,
    loadingTerima: false,
    loadingCaraMasuk: false,
    loadingKunjunganKlaim: false,
    loadingTarifKlaim: false,
    loadingDiagnosaIdrg: false,
    loadingGetDiagnosaIdrg: false,
    loadingGroupingIdrg: null,
    loadingnewclaim: null,
    items: [],
    caraMasukOptions: [],
    kunjunganKlaim: null,
    covid19Klaim: null,
    sudahPernahKlaim: 0,
    totalTarifKlaim: 0,
    tarifKlaim: null,
    noregTarifAktif: null,
    diagnosaIdrgOptions: [],
    prosedurIdrgOptions: [],
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
      topupDrug: '',
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
    async cariProsedurIdrg(term) {
      const pencarian = String(term ?? '').trim()
      if (pencarian.length < 2) {
        this.prosedurIdrgOptions = []
        return []
      }
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/prosedur-idrg', { params: { term: pencarian } })
        this.prosedurIdrgOptions = resp?.data ?? []
        return this.prosedurIdrgOptions
      }
      catch (error) {
        this.prosedurIdrgOptions = []
        notifErrVue('Gagal mencari prosedur iDRG')
        return []
      }
    },
    async simpanProsedurIdrg(payload) {
      try {
        const resp = await api.post('v1/simrs/penjaminan/klaim/prosedur-idrg', payload)
        return resp?.data ?? null
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal menyimpan prosedur iDRG'))
        return null
      }
    },
    async ubahJumlahProsedurIdrg(payload) {
      try {
        const resp = await api.put('v1/simrs/penjaminan/klaim/prosedur-idrg', payload)
        return resp?.data ?? null
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal mengubah jumlah prosedur iDRG'))
        return null
      }
    },
    async hapusProsedurIdrg(payload) {
      try {
        const resp = await api.delete('v1/simrs/penjaminan/klaim/prosedur-idrg', { data: payload })
        return resp?.data ?? null
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal menghapus prosedur iDRG'))
        return null
      }
    },
    async simpanDiagnosaIdrg(payload) {
      try {
        const resp = await api.post('v1/simrs/penjaminan/klaim/diagnosa-idrg', payload)
        return resp?.data ?? null
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal menyimpan diagnosis iDRG'))
        return null
      }
    },
    async hapusDiagnosaIdrg(payload) {
      try {
        const resp = await api.delete('v1/simrs/penjaminan/klaim/diagnosa-idrg', { data: payload })
        return resp?.data ?? null
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal menghapus diagnosis iDRG'))
        return null
      }
    },
    async getDiagnosaIdrg(payload) {
      const noreg = payload?.noreg
      const nomorSep = payload?.nomor_sep
      if (!noreg || !nomorSep) return null

      this.loadingGetDiagnosaIdrg = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/diagnosa-idrg/get', {
          params: { noreg, nomor_sep: nomorSep }
        })
        const result = resp?.data ?? null
        if (result?.success) {
          this.formpasien.diagnosaIdrg = normalizeIdrgItems(result?.items ?? result?.diagnosa)
        }
        return result
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal mengambil diagnosa iDRG dari E-Klaim'))
        return null
      }
      finally {
        this.loadingGetDiagnosaIdrg = false
      }
    },
    async getProsedurIdrg(payload) {
      const noreg = payload?.noreg
      const nomorSep = payload?.nomor_sep
      if (!noreg || !nomorSep) return null

      this.loadingGetDiagnosaIdrg = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaim/prosedur-idrg/get', {
          params: { noreg, nomor_sep: nomorSep }
        })
        const result = resp?.data ?? null
        if (result?.success) {
          this.formpasien.prosedurIdrg = normalizeIdrgItems(result?.items ?? result?.procedure)
        }
        return result
      }
      catch (error) {
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal mengambil prosedur iDRG dari E-Klaim'))
        return null
      }
      finally {
        this.loadingGetDiagnosaIdrg = false
      }
    },
    async groupingIdrg(payload) {
      const noreg = payload?.noreg
      if (!noreg || this.loadingGroupingIdrg === noreg) return null

      this.loadingGroupingIdrg = noreg
      try {
        const resp = await api.post('v1/simrs/penjaminan/klaim/grouping-idrg', payload)
        const result = resp?.data ?? null

        if (result?.success) return result

        notifErrVue(formatGroupingError(result))
        return null
      }
      catch (error) {
        notifErrVue(formatGroupingError(error?.response?.data, error?.message))
        return null
      }
      finally {
        this.loadingGroupingIdrg = null
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
    async getKunjunganKlaim(noreg, layanan = '', silent = false) {
      if (!noreg) {
        this.kunjunganKlaim = null
        this.covid19Klaim = null
        this.sudahPernahKlaim = 0
        this.totalTarifKlaim = 0
        return null
      }

      if (!silent) this.loadingKunjunganKlaim = true
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
        if (!silent) this.loadingKunjunganKlaim = false
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
        topupDrug: '',
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
    async newclaim(payload = null) {
      this.loadingnewclaim = payload?.noreg ?? '__global__'
      try {
        const resp = await api.post('v1/simrs/penjaminan/klaim/new-claim', payload ?? this.formpasien, {
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
        notifErrVue(formatClaimError(error?.response?.data, error?.message, 'Gagal membuat klaim baru'))
        return null
      }
      finally {
        this.loadingnewclaim = null
      }
    }
  }
})

function normalizeIdrgItems(value) {
  const rawItems = Array.isArray(value) ? value : (value?.diagnosa ?? value?.procedure ?? value?.items ?? value)
  const items = typeof rawItems === 'string'
    ? rawItems.split('#').map(item => item.trim()).filter(Boolean)
    : rawItems
  return Array.isArray(items)
    ? items.map(item => {
      const rawCode = item?.kode ?? item?.code ?? item?.code_diagnosa ?? item?.code_procedure ?? item
      const match = typeof rawCode === 'string' ? rawCode.match(/^(.+?)(?:\+(\d+))?$/) : null
      return {
        kode: match?.[1] ?? rawCode,
        jumlah: Number(item?.jumlah ?? match?.[2] ?? 1),
        nama: item?.nama ?? item?.description ?? item?.diagnosa ?? item?.procedure ?? match?.[1] ?? item
      }
    }).filter(item => !['', '0', '#'].includes(String(item?.kode ?? '').trim()))
    : []
}

function preserveIdrgLabels(items, previousItems) {
  if (!items.length) return previousItems ?? []
  const previousByCode = new Map((previousItems ?? []).map(item => [String(item?.kode ?? ''), item]))
  return items.map(item => {
    const previous = previousByCode.get(String(item?.kode ?? ''))
    const labelIsCode = String(item?.nama ?? '') === String(item?.kode ?? '')
    return previous && labelIsCode
      ? { ...item, nama: previous.nama }
      : item
  })
}

function normalizeGrouping(value, explicitSpecialDrugOptions = []) {
  if (!value || typeof value !== 'object') return null
  const source = value.response_idrg ?? value.response?.response_idrg ?? value.response?.data ?? value
  const specialOptions = normalizeSpecialCmgOptions(source)
  const topupDrugOptions = explicitSpecialDrugOptions.length
    ? explicitSpecialDrugOptions
    : normalizeSpecialDrugOptions(source)
  return {
    info: formatIdrgInfo(source),
    mdc: source.mdc_description ?? source.mdc ?? '-',
    mdcCode: source.mdc_number ?? source.mdc_code ?? '-',
    drg: source.drg_description ?? source.drg ?? '-',
    drgCode: source.drg_code ?? '-',
    costWeight: source.cost_weight ?? '-',
    nbr: source.nbr ?? '-',
    totalCostWeight: source.total_cost_weight ?? '-',
    totalKlaim: source.total_tarif ?? source.total_klaim ?? source.total_claim ?? source.tarif ?? source.base_tariff ?? 0,
    status: source.status_cd ?? source.status ?? '-',
    topupDrug: source.drug_opt ?? '',
    topupDrugCostWeight: source.topup_drug_cost_weight ?? source.drug_cost_weight ?? '-',
    hasTopupDrug: topupDrugOptions.length > 0,
    topupDrugOptions: mergeTopupDrugOptions(topupDrugOptions),
    specialProcedureOptions: specialOptions.procedure,
    specialProsthesisOptions: specialOptions.prosthesis,
    specialInvestigationOptions: specialOptions.investigation,
    specialDiagnosticOptions: specialOptions.diagnostic,
    procedureOpt: source.procedure_opt ?? '',
    prosthesisOpt: source.prosthesis_opt ?? '',
    investigationOpt: source.investigation_opt ?? '',
    topupProcedureCode: source.topup_procedure_code ?? '',
    topupProcedureCostWeight: source.topup_procedure_cost_weight ?? '',
    topupProsthesisCode: source.topup_prosthesis_code ?? '',
    topupProsthesisCostWeight: source.topup_prosthesis_cost_weight ?? '',
    topupInvestigationCode: source.topup_investigation_code ?? '',
    topupInvestigationCostWeight: source.topup_investigation_cost_weight ?? ''
  }
}

function normalizeSpecialCmgOptions(source) {
  const raw = parseCmgOptions(source?.special_cmg_option_code ?? source?.opt_cmg)
  const groups = { procedure: [], prosthesis: [], investigation: [], diagnostic: [] }
  raw.forEach(option => {
    const type = String(option?.type ?? '').trim().toLowerCase()
    const group = type === 'special procedure' ? 'procedure'
      : type === 'special prosthesis' ? 'prosthesis'
        : type === 'special investigation' ? 'investigation'
          : type === 'special diagnostic' ? 'diagnostic' : type
    if (!groups[group]) return
    const value = option?.code ?? option?.kode ?? option?.value ?? ''
    if (value) groups[group].push({
      label: option?.description ?? option?.nama ?? option?.label ?? value,
      value
    })
  })
  return groups
}

function normalizeSpecialDrugOptions(source) {
  const specialDrug = source?.special_drug ?? source?.special_drugs ?? source?.drug_options
  const cmgOptions = parseCmgOptions(source?.special_cmg_option_code ?? source?.opt_cmg)
  const topupOptions = Array.isArray(source?.topup_options)
    ? source.topup_options.filter(option => isSpecialDrug(option?.type))
    : []
  const specialDrugOptions = Array.isArray(specialDrug)
    ? specialDrug
    : cmgOptions.filter(option => isSpecialDrug(option?.type))
  const rawOptions = specialDrugOptions.length ? specialDrugOptions : topupOptions
  return rawOptions.map(option => {
    if (typeof option === 'string') return { label: option, value: option }
    const value = option?.code ?? option?.kode ?? option?.value ?? ''
    const label = option?.description ?? option?.nama ?? option?.label ?? value
    return { label, value }
  }).filter(option => option.value)
}

function mergeTopupDrugOptions(options) {
  const backendOptions = options.filter(option => option?.value)
  const usedBackendOptions = new Set()
  const defaults = DEFAULT_TOPUP_DRUG_OPTIONS.map(defaultOption => {
    const index = backendOptions.findIndex(option => String(option.label).trim().toLowerCase() === defaultOption.label.toLowerCase())
    if (index < 0) return defaultOption
    usedBackendOptions.add(index)
    return backendOptions[index]
  })

  return [...defaults, ...backendOptions.filter((_, index) => !usedBackendOptions.has(index))]
}

function isSpecialDrug(type) {
  const normalized = String(type ?? '').trim().toLowerCase()
  return normalized === 'drug' || normalized === 'special drug'
}

function parseCmgOptions(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    return flattenCmgOptions(JSON.parse(value))
  }
  catch {
    return []
  }
}

function flattenCmgOptions(value) {
  if (Array.isArray(value)) return value.flatMap(item => flattenCmgOptions(item))
  if (!value || typeof value !== 'object') return []
  if (value.code || value.kode || value.value || value.description || value.nama || value.label) return [value]
  return Object.values(value).flatMap(item => flattenCmgOptions(item))
}

function formatIdrgInfo(value) {
  const scriptVersion = String(value?.script_version ?? '').trim()
  const logicVersion = value?.logic_version
  if (scriptVersion && logicVersion) {
    const date = new Date(logicVersion)
    const tanggal = Number.isNaN(date.getTime())
      ? String(logicVersion)
      : new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date).replace(',', '')
    return `${scriptVersion} @ ${tanggal}`
  }
  return value?.info ?? value?.message ?? value?.created_at ?? '-'
}

function formatGroupingError(response, fallback = '') {
  const backendMessage = response?.message
  const eklaimMessage = response?.metadata?.message
  const eklaimCode = response?.metadata?.code
  const errorNo = response?.metadata?.error_no
  const details = [
    backendMessage && `Backend: ${backendMessage}`,
    eklaimMessage && eklaimMessage !== backendMessage && `E-Klaim: ${eklaimMessage}`,
    eklaimCode && `Kode: ${eklaimCode}`,
    errorNo && `Error No: ${errorNo}`
  ].filter(Boolean)

  return details.join(' | ') || fallback || 'Gagal mengambil data grouping IDRG'
}

function formatClaimError(response, fallback = '', defaultMessage = 'Gagal memproses klaim') {
  const validationErrors = Object.entries(response?.errors ?? {})
    .flatMap(([field, messages]) => (Array.isArray(messages) ? messages : [messages])
      .filter(Boolean)
      .map(message => `${field}: ${message}`))
  const backendMessage = response?.message
  const eklaimMessage = response?.metadata?.message
  const eklaimCode = response?.metadata?.code
  const errorNo = response?.metadata?.error_no
  const details = [
    ...validationErrors,
    backendMessage && !validationErrors.some(message => message.endsWith(`: ${backendMessage}`))
      ? `Backend: ${backendMessage}`
      : null,
    eklaimMessage && eklaimMessage !== backendMessage ? `E-Klaim: ${eklaimMessage}` : null,
    eklaimCode ? `Kode: ${eklaimCode}` : null,
    errorNo ? `Error No: ${errorNo}` : null
  ].filter(Boolean)

  return details.join(' | ') || fallback || defaultMessage
}
