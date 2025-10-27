import { acceptHMRUpdate, defineStore } from 'pinia'
import { dateDbFormat, dateFullFormat, formatJam } from 'src/modules/formatter'

export const usePenunjangHomeCare = defineStore('penunjang-home-care', {
  state: () => ({
    // laborat
    caripemeriksaanlab: null,
    masterlaborat: [],
    loadingMasterLab: false,
    caripemeriksaanradiologi: '',
    masterradiologi: [],
    notalaborats: [],
    notalaborat: null,
    permintaanLaborats: '',
    permintaans: [],
    form: {
      // norm: '',
      // noreg: '',
      // kdpoli: '',
      // kdpemeriksaan: '',
      gruper: '',
      biaya_sarana: 0,
      biaya_layanan: 0,
      jumlah: 1,
      puasa_pasien: 'Tidak',
      prioritas_pemeriksaan: 'Tidak',
      diagnosa_masalah: '',
      catatan_permintaan: '',
      unit_pengirim: '',
      asal_sumber_spesimen: '',
      lokasi_pengambilan_spesimen: '',
      jumlah_spesimen_klinis: 1,
      volume_spesimen_klinis: 0,
      metode_pengambilan_spesimen: '',
      tanggalpengambilanspesimen: dateDbFormat(new Date()),
      jampengambilanspesimen: formatJam(new Date()),
      waktu_pengambilan_spesimen: dateFullFormat(new Date()),
      kondisi_spesimen: '',
      metode_pengiriman_hasil: 'Penyerahan langsung', // || Dikirim via surel
      tanggalfiksasi: dateDbFormat(new Date()),
      jamfiksasi: dateDbFormat(new Date()),
      waktu_fiksasi_spesimen: dateFullFormat(new Date()),
      cairan_fiksasi: 0, // ml
      volume_cairan_fiksasi: 0, // ml
      // petugas: ''
      details: []
    },
    loadingSaveLab: false,
    pemeriksaanslab: [],
    pemeriksaansradiologi: []
  }),
  actions: {
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePenunjangHomeCare, import.meta.hot))
}
