import { defineStore } from 'pinia'

export const useDokumenIgdStore = defineStore('dokumen-igd-store', {
  state: () => ({
    tabs: [
      { name: 'Billing', page: 'Billing' },
      { name: 'Triase', page: 'Triase' },
      // { name: 'Operasi', page: 'Operasi' },
      // { name: 'Rehab Medik', page: 'Fisioterapi' },
      // { name: 'Perawatan Jenazah', page: 'Jenazah' },
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
