import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErrVue } from 'src/modules/utils'
import { markRaw } from 'vue'

export const useKlaimRanapPenjaminanStore = defineStore('klaim-ranap-penjaminan', {
  state: () => ({
    loading: false,
    loadingTerima: false,
    loadingbuka: false,
    items: [],
    meta: null,
    pageLayanan: false,
    pasien: null,
    noreg: null,
    ruangans: [],
    params: {
      q: '',
      page: 1,
      per_page: 10,
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
      kdruangan: ''
    }
  }),

  actions: {
    setQ(val) {
      this.params.q = val
    },
    setPerPage(val) {
      this.params.per_page = val
      this.params.page = 1
      this.getData()
    },
    search(val) {
      this.params.q = val
      this.params.page = 1
      this.getData()
    },
    refresh() {
      this.params.page = 1
      this.getData()
    },
    goToPage(val) {
      this.params.page = val
      this.getData()
    },
    setBulan(val) {
      this.params.bulan = val
      this.params.page = 1
      this.getData()
    },
    setTahun(val) {
      this.params.tahun = val
      this.params.page = 1
      this.getData()
    },
    setRuangan(val) {
      this.params.kdruangan = val
      this.params.page = 1
      this.getData()
    },

    async getData() {
      this.loading = true
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaimranap/getdataklaimranap', {
          params: this.params
        })
        this.items = resp?.data?.data ?? []
        this.meta = resp?.data ?? null
      } catch (error) {
        console.error('Error getdataklaimranap:', error)
        notifErrVue('Gagal memuat data klaim rawat inap')
      } finally {
        this.loading = false
      }
    },

    async getRuanganRanap() {
      try {
        const resp = await api.get('v1/simrs/penjaminan/klaimranap/ruangan-ranap')
        this.ruangans = resp?.data ?? []
      } catch (error) {
        console.error('Error getRuanganRanap:', error)
      }
    },

    async bukaLayanan(pasien) {
      this.loadingTerima = true
      this.noreg = pasien?.noreg
      const form = { noreg: pasien?.noreg }

      try {
        const resp = await api.post('v1/simrs/ranap/ruangan/bukalayanan', form)
        if (resp.status === 200) {
          const findPasien = this.items.find(x => x?.noreg === pasien?.noreg)
          const target = findPasien || pasien
          this.setPasien(target, resp.data)
          this.pasien = target
          this.pageLayanan = true
          return target
        }
      } catch (error) {
        console.error('Error bukaLayanan ranap:', error)
        notifErrVue('Gagal memuat berkas rawat inap pasien')
      } finally {
        this.loadingTerima = false
      }
    },

    setPasien(target, data) {
      if (!target) return

      // markRaw untuk data layanan berukuran besar agar Vue tidak deep reactive berlebihan
      target.dataigd = data?.dataigd ? markRaw(data.dataigd) : null
      target.newapotekrajal = markRaw(data?.newapotekrajal ?? [])
      target.diagnosa = markRaw(data?.diagnosa ?? [])
      target.anamnesis = data?.anamnesis ?? []
      target.pemeriksaan = data?.pemeriksaan ?? []
      target.penilaian = data?.penilaian ?? []
      target.diagnosamedis = data?.diagnosamedis ?? []
      target.tindakan = data?.tindakan ?? []
      target.diagnosakeperawatan = data?.diagnosakeperawatan ?? []
      target.diagnosakebidanan = data?.diagnosakebidanan ?? []
      target.diagnosagizi = data?.diagnosagizi ?? []
      target.cppt = data?.cppt ?? []
      target.laborats = data?.laborats ?? []
      target.laboratold = data?.laboratold ?? []
      target.hasilradiologi = data?.hasilradiologi ?? []
      target.radiologi = data?.radiologi ?? []
      target.fisio = data?.fisio ?? []
      target.operasi = data?.operasi ?? []
      target.bankdarah = data?.bankdarah ?? []
      target.apheresis = data?.apheresis ?? []
      target.cathlab = data?.cathlab ?? []
      target.penunjanglain = data?.penunjanglain ?? []
      target.permintaanambulan = data?.permintaanambulan ?? []
      target.perawatanjenazah = data?.perawatanjenazah ?? []
      target.hais = data?.hais ?? []
      target.konsultasi = data?.konsultasi ?? []
      target.edukasi = data?.edukasi ?? []
      target.dokumenluar = data?.dokumenluar ?? []
      target.informconcern = data?.informconcern ?? []
      target.dischargeplanning = data?.dischargeplanning ?? []
      target.skriningdischargeplannings = data?.skriningdischargeplannings ?? []
      target.summarydischargeplannings = data?.summarydischargeplannings ?? []
      target.statuscovid = data?.statuscovid ?? []
      target.procedure = data?.procedure ?? []
      target.keterangantindakan = data?.keterangantindakan ?? []
      target.planningdokter = data?.planningdokter ?? null
      target.serah_terima = data?.serah_terima ?? []
      target.rekonsiliasiobats = data?.rekonsiliasiobats ?? []
      target.rekonsiliasi_obat_persetujuan = data?.rekonsiliasi_obat_persetujuan ?? null

      const memodia = data?.manymemo
      if (memodia?.length) {
        const memNonIgd = memodia?.find(f => f.kdruang !== 'POL014') ?? null
        const memIgd = memodia?.find(f => f.kdruang === 'POL014') ?? null
        target.memodiagnosa = memNonIgd?.diagnosa ?? null
        target.memodiagnosaigd = memIgd?.diagnosa ?? null
      } else {
        target.memodiagnosa = null
        target.memodiagnosaigd = null
      }
    }
  }
})
