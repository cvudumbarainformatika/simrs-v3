import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";

export const dataBastSigarangStore = defineStore('data_bast_sigarang', {
  state: () => ({
    loading: false,
    disabled: false,
    reqs: {
      q: '',
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0,
      kodepenerima: null,
      kodekegiatanblud: null
    },
    bastsigarang: [],
  }),
  actions: {
    goToPage(val) {
      this.reqs.page = val;
      this.listBastSigarang();
    },
    onRequest(props) {
      this.reqs.page = props?.pagination?.page ?? 1
      this.reqs.rowsPerPage = props?.pagination?.rowsPerPage ?? 10
      this.listBastSigarang()
    },
    refreshTable() {
      this.reqs.page = 1
      this.listBastSigarang()
    },
    listBastSigarang() {
      this.loading = true;
      const params = { params: this.reqs };
      return new Promise((resolve, reject) => {
        api.get('/v1/transaksi/belanja_ls/bastsigarang', params)
          .then((resp) => {
            console.log('data BAST Sigarang', resp);
            if (resp.status === 200) {

              this.bastsigarang = resp.data;

            }
            this.loading = false;
            resolve(resp.data);
          })
          .catch((err) => {
            this.loading = false;
            reject(err);
          });
      });
    },
  }

})
