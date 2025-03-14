import { acceptHMRUpdate, defineStore } from "pinia"

export const useTemplatePersiapanOperasiStore = defineStore('template_persiapan_operasi', {
  state: () => ({
    loading: false,
    isOpen: false,
    item: {},
    items: [],
    params: {
      page: 1,
      per_page: 10,
      q: '',
    },
    form: {
      user: 'private',
      nama: '',
    },
    typeOptions: [
      { value: 'public', nama: 'Bisa Dilihat Semua' },
      { value: 'private', nama: 'Untuk saya saja' },
    ]
  }),
  actions: {
    setparams (key, val) {
      this.params[key] = val
    },
    setForm (key, val) {
      this.form[key] = val
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTemplatePersiapanOperasiStore, import.meta.hot))
}
