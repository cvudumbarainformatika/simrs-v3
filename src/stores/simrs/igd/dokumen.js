import { defineStore } from 'pinia'

export const useDokumenIgdStore = defineStore('dokumen-igd-store', {
  state: () => ({
    tabs: [
      { name: 'Billing', page: 'Billing' },
      { name: 'Resume', page: 'Resume' },
      { name: 'Triase', page: 'Triase' },
      { name: 'Surat Kematian', page: 'Surat Kematian' },
      { name: 'Indikasi Masuk Rawat Inap', page: 'Indikasi Masuk Rawat Inap' },
      { name: 'Sep', page: 'Sep' },
      { name: 'Billing Detail', page: 'Billing Detail' },
      // { name: 'Ambulan', page: 'Ambulan' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
      // { name: 'Bank Darah', page: 'BankDarah' },
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
