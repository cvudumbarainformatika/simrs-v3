import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'
import { notifErrVue } from 'src/modules/utils'

export const useLaporanRincianPerunit = defineStore(
  'laporan-rincian-perunit',
  {
    state: () => ({
      items: [],
      nakes: [],
      report: null,
      loading: false,
      params: {
        from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        pelayanan: null,
        jenisLaporan: null
      }
    }),

    actions: {
      async carireport() {
        this.loading = true

        try {
          const perluMasterNakes = this.params.pelayanan === 3
            && this.params.jenisLaporan === 3
          const [resp] = await Promise.all([
            api.get(
              '/v1/simrs/laporan/keuangan/rincianperunit',
              { params: this.params }
            ),
            perluMasterNakes ? this.getNakes() : Promise.resolve()
          ])

          this.report = resp.data
          const rows = resp.data?.sRow || []
          const nakesMap = perluMasterNakes
            ? new Map(this.nakes.map(item => [item.kdpegsimrs, item.nama]))
            : null
          this.items = nakesMap
            ? rows.map(item => ({
              ...item,
              pelaksana1: this.namaPelaksana(item.pelaksana1, nakesMap),
              pelaksana2: this.namaPelaksana(item.pelaksana2, nakesMap)
            }))
            : rows
        }
        catch (error) {
          this.report = null
          this.items = []
          notifErrVue(
            error.response?.data?.message
            || 'Gagal mengambil laporan rincian per unit.'
          )
        }
        finally {
          this.loading = false
        }
      },
      async getNakes() {
        if (this.nakes.length) return

        const resp = await api.get('/v1/simrs/master/pegawai/listnakes')
        this.nakes = resp.data || []
      },
      namaPelaksana(codes, nakesMap) {
        return String(codes || '')
          .split(';')
          .filter(Boolean)
          .map(code => nakesMap.get(code) || code)
          .join('; ')
      },
      resetFilter() {
        this.params = {
          from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
          to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
          pelayanan: null,
          jenisLaporan: null
        }
      }
    }
  }
)
