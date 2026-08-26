import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue, waitLoad } from "src/modules/utils";

export const usePerubahanAnggaranBelanja_PAK = defineStore('perubahan-anggaran-belanja-pak-store', {
    state: () => ({
        items: [],
        loading: false,
        loadingSave: false,
        loadingDelete: false,
        loadingKunci: false,
        disabled: false,
        disableSaved: false,
        fixed: false,
        openDialogRinci: false,
        dialogCetak: false,
        form: {
            id: null,
            notrans: '',
            kodeRuangan: '',
            ruangan: '',
            kodeKegiatan: '',
            kegiatan: '',
            kodebagian: '',
            organisasi_nama: '',
            paguanggaran: '',
            kode50: '1.02.01.2.10.01',
            uraian: 'Pelayanan dan Penunjang Pelayanan BLUD',
            kunci: '',
            tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD'),
            tahun: date.formatDate(Date.now(), 'YYYY'),

            //rincian
            koderek50: null,
            koderek108: null,
            uraian50: null,
            uraian108: null,
            keterangan: '',
            volume: 0,
            harga: 0,
            nilai: 0,
            satuan: '',
            jenis: '',
            kode: ''
        },
        params: {
            q: '',
            tahun: date.formatDate(Date.now(), 'YYYY'),
            tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
            jenis: '',
            page: 1,
            per_page: 30,
        },
        dataBarangslama: [],
        metaBarangLama: {
            current_page: 1,
            per_page: 30,
            next_page_url: null,
            prev_page_url: null
        },
        dataBarangsbaru: [],
        dataModals: [],
        dataJasalain: [],
        akuns: [],
        kegiatans: [],
        optionkegiatan: [],
        dataSaved: [],
        rincians: [],
        columns: [],
    }),
    actions: {
        goToPage(val) {
            this.params.page = val
            this.getData()
        },
        setForm(key, val) {
            this.form[key] = val
        },
        //get Barangs
        getBarangslama() {
            waitLoad('show')
            // const params = { params: this.form }

            const params = {
                params: {
                    tahun: this.form.tahun,
                    kodeKegiatan: this.form.kodeKegiatan,
                    q: this.params.q,
                    page: this.params.page,
                    per_page: this.params.per_page
                }
            }

            return new Promise((resolve, reject) => {
                api
                    .get('v1/anggaran/perubahan/belanja/selectitemlama', params)
                    .then((resp) => {
                        waitLoad('done')
                        console.log('resp barang lama', resp)
                        if (resp.status === 200) {
                            this.dataBarangslama = resp.data.data.map(item => ({
                                ...item,
                                tmp_touched: false,
                                sedangInput: false
                            }))
                            console.log('dataBarangslama', this.dataBarangslama)
                            this.metaBarangLama = {
                                current_page: resp.data.current_page,
                                per_page: resp.data.per_page,
                                next_page_url: resp.data.next_page_url,
                                prev_page_url: resp.data.prev_page_url
                            }
                            this.params.page = resp.data.current_page
                            // this.setColumns(resp.data.data)
                            // console.log(resp.data.data)
                            resolve(resp.data.data)
                        }
                    })
                    .catch((err) => {
                        waitLoad('done')
                        reject(err)
                    })
            })
        },
        getBarangs() {
            waitLoad('show')
            const params = { params: this.params }
            return new Promise((resolve, reject) => {
                api
                    .get('v1/anggaran/penyusunan/pengusulan/selectitem', params)
                    .then((resp) => {
                        waitLoad('done')
                        console.log('resp barang', resp)
                        if (resp.status === 200) {
                            this.dataBarangsbaru = resp.data.data
                            this.meta = resp.data.meta
                            this.setColumns(resp.data.data)
                            // console.log(resp.data.data)
                            resolve(resp.data.data)
                        }
                    })
                    .catch((err) => {
                        waitLoad('done')
                        reject(err)
                    })
            })
        },
        setColumns(payload) {
            // const thumb = payload.map((x) => Object.keys(x))
            // this.columns = thumb[0]
            this.columns = ['kode', 'nama', 'barang108', 'uraian_50', 'depo', 'satuan', 'pengali', 'satuankecil', 'ssh', 'tipe']
            // console.log('columns', this.columns)
        },
        nextBarangLama() {
            if (!this.metaBarangLama.next_page_url) return

            this.params.page = Number(this.params.page || 1) + 1
            this.getBarangslama()
        },

        prevBarangLama() {
            if (!this.metaBarangLama.prev_page_url) return

            this.params.page = Math.max(1, Number(this.params.page || 1) - 1)
            this.getBarangslama()
        },
        getKegiatan() {
            this.loading = true
            const params = { params: this.params }
            return new Promise((resolve) => {
                api.get('v1/anggaran/perubahan/belanja/select', params).then((resp) => {
                    console.log('Get Kegiatang', resp)
                    if (resp.status === 200) {
                        this.kegiatans = resp.data?.data
                        this.loading = false
                        resolve(resp)
                    }
                }).catch(() => { this.loading = false })
            })
        },
        async simpanData() {
            this.loadingSave = true
            try {
                const resp = await api.post('v1/anggaran/perubahan/belanja/save', this.form)
                console.log('simpan', resp)
                const result = resp?.data?.data
                if (resp.success === true) {

                    this.form.notrans = result?.notrans


                    this.items.unshift(result)
                    // this.initModeEdit(result)
                }
                const allrinci = result?.rincian || []
                const existingIds = new Set(this.rincians.map(r => r.id))
                const newRincians = allrinci.filter(r => !existingIds.has(r.id))
                this.rincians.unshift(...newRincians)

                notifSuccessVue(resp?.data?.message)
                console.log('rinciansxxx', this.rincians)
                this.form = {
                    notrans: result?.notrans,
                    kodeRuangan: result?.kodeRuangan,
                    ruangan: result?.ruangan,
                    kodeKegiatan: result?.kodeKegiatan,
                    kegiatan: result?.kegiatan,
                    kodebagian: result?.kodebagian,
                    kodepptk: result?.kodepptk,
                    pptk: result?.pptk,
                    organisasi_nama: result?.organisasi_nama,
                    paguanggaran: result?.paguanggaran,
                    kode50: result?.kode50,
                    uraian: result?.uraian,
                    masukan: result?.masukan,
                    capaianprogram: result?.capaianprogram,
                    targetcapaian: result?.targetcapaian,
                    targetmasukan: result?.targetmasukan,
                    targetkeluaran: result?.targetkeluaran,
                    keluaran: result?.keluaran,
                    targethasil: result?.targethasil,
                    hasil: result?.hasil,
                    kunci: '',
                    tglTransaksi: resp?.data?.data?.tglTransaksi,
                    tahun: date.formatDate(Date.now(), 'YYYY'),

                    koderek50: null,
                    koderek108: null,
                    uraian50: null,
                    uraian108: null,
                    keterangan: '',
                    volume: 0,
                    harga: 0,
                    nilai: 0,
                    satuan: '',
                    jenis: ''
                }
                // this.getData()
                this.loadingSave = false
            } catch (error) {
                console.log(error)
                this.loadingSave = false
            }
        },
        initForm() {
            this.form = {
                id: null,
                notrans: '',
                kodeRuangan: '',
                ruangan: '',
                kodeKegiatan: '',
                kegiatan: '',
                kodebagian: '',
                organisasi_nama: '',
                paguanggaran: '',
                kode50: '1,.02.01.2.10.01',
                uraian: 'Pelayanan dan Penunjang Pelayanan BLUD',
                kunci: '',
                tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD'),
                tahun: date.formatDate(Date.now(), 'YYYY'),

                //rincian
                koderek50: null,
                koderek108: null,
                uraian50: null,
                uraian108: null,
                keterangan: '',
                volume: 0,
                harga: 0,
                nilai: 0,
                satuan: '',
                jenis: '',
            }
            this.rincians = []
            this.disabled = false
            this.loadingHapus = false
        },

        initModeEdit(result) {
            this.form = result

            const id = result?.id ?? null
            const index = this.items.findIndex(item => item?.id === id)
            if (index !== -1) {
                this.items[index] = result
            }
            // this.supplierSelected = result?.supplier ?? result?.suplier ?? result ?? null
            // this.maxRight = false
            // this.mode = 'edit'
        },
        async getData() {
            this.loading = true
            try {
                const params = {
                    tahun: this.params.tahun,
                    q: this.params.q
                }
                const resp = await api.get(
                    '/v1/anggaran/perubahan/belanja/index',
                    { params }
                )
                console.log('data Pengusulan', resp)
                if (resp.status === 200) {
                    this.items = resp?.data
                }
            } finally {
                this.loading = false
            }

        },
        editForm(val) {
            this.form.notrans = val.notrans
            this.form.kodeRuangan = val.kodeRuangan
            this.form.ruangan = val.ruangan
            this.form.kodeKegiatan = val.kodeKegiatan
            this.form.kegiatan = val.kegiatan
            this.form.kodebagian = val.kodebagian
            this.form.organisasi_nama = val.organisasi_nama
            this.form.kode50 = val.kode50
            this.form.uraian = val.uraian
            this.form.kunci = val.kunci
            this.form.tglTransaksi = val.tglTransaksi
            // this.form.group = val?.groups?.toString()

        },
        async deleteData(payload) {
            this.loadingDelete = true
            try {
                const resp = await api.post(
                    '/v1/anggaran/perubahan/belanja/deleterinci',
                    payload
                )

                if (resp.status === 200) {
                    this.rincians = resp.data.data ?? []
                    notifSuccessVue(resp.data.message)
                }
            } catch (error) {
                notifErrVue(error.response?.data?.message ?? 'Gagal hapus data')
            } finally {
                this.getData()
                this.loadingDelete = false
            }
        },
        async kunciData(id) {
            this.loadingKunci = true
            const payload = { id }
            try {
                const resp = await api.post('/v1/anggaran/perubahan/belanja/kunci', payload)
                if (resp.status === 200) {
                    // this.items = resp?.data?.data
                    notifSuccess(resp)
                    this.getData()
                }
                this.loadingKunci = false
            }
            catch (error) {
                notifErr(error)
                this.loadingKunci = false
            }
        },
        search(val) {
            this.params.q = val
            this.getData()
        },
        goToPage(val) {
            // console.log('goToPage', val)
            this.params.page = val
            this.getData()
        },

        dataCetak() {
            waitLoad('show')
            const params = { params: this.params }
            return new Promise((resolve, reject) => {
                api
                    .get('v1/anggaran/perubahan/belanja/cetak', params)
                    .then((resp) => {
                        waitLoad('done')
                        console.log('resp Cetak', resp)
                        this.pergeseran = []
                        if (resp.status === 200) {
                            this.pergeseran = resp.data.data
                            this.rincianpergeseran = resp.data.data.hasilperubahan
                            console.log('rincianpergeseran', this.rincianpergeseran)
                            // this.setColumns(resp.data.data)
                            // console.log(resp.data.data)
                            this.mapingDatapergeseran()
                            resolve(resp)
                        }
                    })
                    .catch((err) => {
                        waitLoad('done')
                        reject(err)
                    })
            })
        },

        mapingDatapergeseran() {
            const rka = []
            // const totalrka = []
            const unik1 = this.rincianpergeseran.map((x) => x.kode1)
            const ar1 = unik1.length ? [...new Set(unik1)] : []
            for (let i = 0; i < ar1.length; i++) {
                const el = ar1[i];
                const obj = {
                    notrans: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].notrans,
                    koderek50: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].koderek50,
                    tahun: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].tahun,
                    kodekegiatanblud: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].kodekegiatanblud,
                    kodebidang: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].kodebidang,
                    kode: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].kode1,
                    uraian: this.rincianpergeseran.filter((x) => x.kode1 === el)[0].uraian1,
                    pagu: this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    pagubaru: this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
                    selisih: this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode1 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    rincian: []
                }
                rka.push(obj)
            }

            const unik2 = this.rincianpergeseran.map((x) => x.kode2)
            const ar2 = unik2.length ? [...new Set(unik2)] : []
            for (let i = 0; i < ar2.length; i++) {
                const el = ar2[i];
                const obj = {
                    notrans: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].notrans,
                    koderek50: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].koderek50,
                    tahun: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].tahun,
                    kodekegiatanblud: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].kodekegiatanblud,
                    kodebidang: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].kodebidang,
                    kode: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].kode2,
                    uraian: this.rincianpergeseran.filter((x) => x.kode2 === el)[0].uraian2,
                    pagu: this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    pagubaru: this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
                    selisih: this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode2 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    rincian: []
                }
                rka.push(obj)
            }

            const unik3 = this.rincianpergeseran.map((x) => x.kode3)
            const ar3 = unik3.length ? [...new Set(unik3)] : []
            for (let i = 0; i < ar3.length; i++) {
                const el = ar3[i];
                const obj = {
                    notrans: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].notrans,
                    koderek50: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].koderek50,
                    tahun: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].tahun,
                    kodekegiatanblud: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].kodekegiatanblud,
                    kodebidang: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].kodebidang,
                    kode: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].kode3,
                    uraian: this.rincianpergeseran.filter((x) => x.kode3 === el)[0].uraian3,
                    pagu: this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    pagubaru: this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
                    selisih: this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode3 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    rincian: []
                }
                rka.push(obj)
            }

            const unik4 = this.rincianpergeseran.map((x) => x.kode4)
            const ar4 = unik4.length ? [...new Set(unik4)] : []
            for (let i = 0; i < ar4.length; i++) {
                const el = ar4[i];
                const obj = {
                    notrans: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].notrans,
                    koderek50: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].koderek50,
                    tahun: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].tahun,
                    kodekegiatanblud: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].kodekegiatanblud,
                    kodebidang: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].kodebidang,
                    kode: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].kode4,
                    uraian: this.rincianpergeseran.filter((x) => x.kode4 === el)[0].uraian4,
                    pagu: this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    pagubaru: this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
                    selisih: this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode4 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    rincian: []
                }
                rka.push(obj)
            }
            const unik5 = this.rincianpergeseran.map((x) => x.kode5)
            const ar5 = unik5.length ? [...new Set(unik5)] : []
            for (let i = 0; i < ar5.length; i++) {
                const el = ar5[i];
                const obj = {
                    notrans: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].notrans,
                    tahun: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].tahun,
                    koderek50: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].koderek50,
                    kodekegiatanblud: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].kodekegiatanblud,
                    kodebidang: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].kodebidang,
                    kode: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].kode5,
                    uraian: this.rincianpergeseran.filter((x) => x.kode5 === el)[0].uraian5,
                    pagu: this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    pagubaru: this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
                    selisih: this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode5 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    rincian: []
                }
                rka.push(obj)
            }

            const unik6 = this.rincianpergeseran.map((x) => x.kode6)
            const ar6 = unik6.length ? [...new Set(unik6)] : []
            for (let i = 0; i < ar6.length; i++) {
                const el = ar6[i];
                const obj = {
                    notrans: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].notrans,
                    koderek50: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].koderek50,
                    tahun: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].tahun,
                    kodekegiatanblud: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].kodekegiatanblud,
                    kodebidang: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].kodebidang,
                    kode: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].kode6,
                    uraian: this.rincianpergeseran.filter((x) => x.kode6 === el)[0].uraian6,
                    pagu: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    pagubaru: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0),
                    selisih: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.totalbaru)).reduce((a, b) => a + b, 0) - this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
                    rincian: this.rincianpergeseran.filter((x) => x.kode6 === el).map((x) => {
                        return {
                            kode108: x.koderek108,
                            usulan: x.usulan,
                            satuan: x.satuan,
                            volume: x.volume,
                            harga: x.harga,
                            pagu: x.total,

                            volumebaru: x.volumebaru,
                            hargabaru: x.hargabaru,
                            pagubaru: x.totalbaru,
                            selisih: parseFloat(x.totalbaru) - parseFloat(x.total)
                        }
                    })
                }
                rka.push(obj)
            }

            const sortAnggaran = (rka) =>
                rka.sort(({ kode: a }, { kode: b }) =>
                    a < b ? -1 : a > b ? 1 : 0
                )
            const dataRKApergeseran = sortAnggaran(rka)
            this.datarkapergeseran = dataRKApergeseran
            console.log('rka', this.datarkapergeseran)
        },

        async penetapan(payload) {
            this.loadingSave = true
            try {
                const resp = await api.post('/v1/anggaran/perubahan/belanja/penetapanpak', payload)

                if (resp.status === 200) {
                    notifSuccess(resp)
                    await this.getData()
                }

                return resp // 🔥 penting

            } catch (error) {
                notifErr(error)
                throw error // 🔥 penting biar bisa ditangkap di component

            } finally {
                this.loadingSave = false // 🔥 paling aman
            }
        },
    }
})
