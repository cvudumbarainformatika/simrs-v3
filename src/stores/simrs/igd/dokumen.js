import { defineStore } from 'pinia'

export const useDokumenIgdStore = defineStore('dokumen-igd-store', {
  state: () => ({
    tabs: [
      { name: 'Billing', page: 'Billing' },
      { name: 'Resume', page: 'Resume' },
      { name: 'Triase', page: 'Triase' },
      { name: 'Surat Kematian', page: 'Surat Kematian' },
      { name: 'Indikasi Masuk Rawat Inap', page: 'Indikasi Masuk Rawat Inap' },
      // { name: 'Indikasi Masuk ICU', page: 'Indikasi Masuk ICU' },
      { name: 'Sep', page: 'Sep' },
      { name: 'Billing Detail', page: 'Billing Detail' },
      { name: 'Farmasi', page: 'Farmasi' },
      { name: 'Laborat', page: 'Laborat' },
      { name: 'Radiologi', page: 'Radiologi' },
      { name: 'Konsul Dokter', page: 'Konsul' },
      { name: 'Pengkajian Awal Medis', page: 'Pengkajian Awal Medis' },
      { name: 'Pengkajian Awal Keperawatan', page: 'Pengkajian Awal Keperawatan' },
      { name: 'Observasi Penderita', page: 'Observasi Penderita' },
      { name: 'Pengkajian Awal Kebidanan', page: 'Pengkajian Awal Kebidanan' },
      { name: 'Serah Terima Ruangan', page: 'Serah Terima Ruangan' },
      { name: 'Pasien Pulang', page: 'Pasien Pulang' },
      { name: 'Surat Rencana Rawat Inap', page: 'Surat Rencana Rawat Inap' },
      { name: 'Asesmen Pra Anestesia', page: 'Asesmen Pra Anestesia' },
      { name: 'Asesmen Pra Bedah', page: 'Asesmen Pra Bedah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Penunjang Lain', page: 'PenunjangLain' }
    ],
    tab: 'Billing'
  })
})
