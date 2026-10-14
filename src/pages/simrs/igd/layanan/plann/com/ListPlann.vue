<template>
  <q-card flat bordered square class="full-height bg-teal-2" style="overflow: hidden;">
    <q-bar class="bg-teal text-white z-top" style="width: inherit;">
      <div class="f-12">
        Data Planing
      </div>
      <q-space />
    </q-bar>
    <q-card-section style="padding:0" class="full-height bg-grey">
      <div v-if="loadingaja" class="column full-height flex-center">
        <div class="text-white">
          Harap Tunggu .....
        </div>
        <div class="text-white">
          Sinkron Data Ke DATABASE
        </div>
      </div>
      <div v-if="pasien?.planheder?.length <= 0" class="column full-height flex-center">
        <div class="text-white">
          Belum Ada data tersimpan
        </div>
      </div>
      <q-scroll-area v-else style="height:calc(100% - 32px);">
        <q-list class="bg-white" separator>
          <transition-group name="list">
            <q-item v-for="(item, n) in lists" :key="n" class="list-move">
              <q-item-section>
                <q-item-label class="f-12">
                  <span class="">Plann </span> : <span class="text-weight-bold">{{ item.rs4 }}</span>
                </q-item-label>
                <div v-if="item?.rs4 === 'Rawat Inap'">
                  <q-item-label>Operasi : <span class="text-weight-bold">{{ item?.planranap?.operasi
                  }}</span></q-item-label>
                  <q-item-label>Jenis Operasi : <span class="text-weight-bold">{{ item?.planranap?.jenisoperasi
                  }}</span></q-item-label>
                  <q-item-label>Tanggal Operasi : <span class="text-weight-bold">{{ item?.planranap?.tgloperasi
                  }}</span></q-item-label>
                  <q-item-label>Ruang Tujuan : <span class="text-weight-bold">{{ item?.planranap?.ruangranap?.rs2
                  }}</span></q-item-label>
                  <div v-if="item?.planranap?.dokumentransfer !== null">
                    <q-item-label>Indikasi Masuk Ruang {{ item?.planranap?.dokumentransfer?.kelas }} : <span
                        class="text-weight-bold">{{
                          item?.planranap?.dokumentransfer?.isi
                        }}</span></q-item-label>
                  </div>
                  <div v-if="item?.planranap?.dokumentransfer !== null">
                    <q-item-label>Dokter Penerima : <span class="text-weight-bold">{{
                      item?.planranap?.dokumentransfer?.dokter?.nama }}</span></q-item-label>
                  </div>
                  <!-- <div v-else>
                    wew
                  </div> -->
                </div>
                <div v-if="item?.rs4 === 'Rujuk Ke Rumah Sakit' || item?.rs4 === 'Rujuk Ke Rumah Sakit Lain'">
                  <q-item-label v-if="item?.planrujukan?.alasan_pindah_rs">Alasan Pindah RS : <span
                      class="text-weight-bold">{{ item?.planrujukan?.alasan_pindah_rs }}</span></q-item-label>
                  <q-item-label v-if="item?.planrujukan?.terapi_tindakan">Terapi / Tindakan : <span
                      class="text-weight-bold">{{ item?.planrujukan?.terapi_tindakan }}</span></q-item-label>
                  <q-item-label v-if="item?.planrujukan?.diet">Diet : <span class="text-weight-bold">{{
                    item?.planrujukan?.diet }}</span></q-item-label>
                  <q-item-label>Alasan Dirujuk : <span class="text-weight-bold">{{ item?.planrujukan?.atas_dasar
                  }}</span></q-item-label>
                  <q-item-label>Jenis Pelayanan : <span class="text-weight-bold">{{ item?.planrujukan?.jenis_pelayanan
                  }}</span></q-item-label>
                  <q-item-label>Tanggal Rujukan : <span class="text-weight-bold">{{ item?.planrujukan?.tgl_rujukan
                  }}</span></q-item-label>
                  <q-item-label>Tanggal Rencana Kunjungan : <span class="text-weight-bold">{{
                    item?.planrujukan?.tgl_rencana_kunjungan }}</span></q-item-label>
                  <q-item-label>Type Faskes : <span class="text-weight-bold">{{ item?.planrujukan?.type_faskes
                  }}</span></q-item-label>
                  <q-item-label>Dirujuk Ke : <span class="text-weight-bold">{{ item?.planrujukan?.di_rujuk_ke }} ({{
                    item?.planrujukan?.koders }})</span></q-item-label>
                  <q-item-label>Poli : <span class="text-weight-bold">{{ item?.planrujukan?.poli_rujukan }} ({{
                    item?.planrujukan?.kodepoli }})</span></q-item-label>
                  <q-item-label>Keterangan : <span class="text-weight-bold">{{ item?.planrujukan?.keterangan ?? '-'
                  }}</span></q-item-label>
                  <div class="q-mt-md">
                    <div class="text-weight-bold text-primary q-mb-xs">Obat yang Diberikan</div>
                    <q-markup-table dense flat bordered class="obat-rujukan-table">
                      <thead>
                        <tr>
                          <th class="text-left">Nama Obat</th>
                          <th class="text-left">Jumlah</th>
                          <th class="text-left">Dosis</th>
                          <th class="text-left">Frekwensi</th>
                          <th class="text-left">Cara Pemberian</th>
                          <th class="text-center" style="width: 76px">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="obat in item?.planrujukan?.obatrujukan || []" :key="obat.id">
                          <td>{{ obat.nama_obat }}</td>
                          <td>{{ obat.jumlah }}</td>
                          <td>{{ obat.dosis }}</td>
                          <td>{{ obat.frekwensi }}</td>
                          <td>{{ obat.cara_pemberian }}</td>
                          <td class="text-center no-wrap">
                            <q-btn flat round dense size="sm" color="primary" icon="edit" @click="store.editObatRujukan(obat)">
                              <q-tooltip>Edit obat</q-tooltip>
                            </q-btn>
                            <q-btn flat round dense size="sm" color="negative" icon="delete" @click="hapusObat(obat)">
                              <q-tooltip>Hapus obat</q-tooltip>
                            </q-btn>
                          </td>
                        </tr>
                        <tr v-if="!(item?.planrujukan?.obatrujukan?.length)">
                          <td colspan="6" class="text-center text-grey">Belum ada obat</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </div>
                <div v-if="item?.rs4 === 'Pulang'">
                  <q-item-label>Alasan Pulang : <span class="text-weight-bold">{{ item?.planpulang?.atas_dasar
                  }} {{ item?.planpulang?.alasan ?? '-' }} </span></q-item-label>
                  <q-item-label v-if="item?.planpulang?.atas_dasar === 'Meninggal'">
                    Tanggal Meninggal : <span class="text-weight-bold">{{ item?.planpulang?.tgl_meninggal }} {{
                      item?.planpulang?.jam_meninggal }}</span>
                  </q-item-label>
                  <q-item-label v-if="item?.planpulang?.atas_dasar === 'Meninggal'">
                    Alasan Meninggal : <span class="text-weight-bold">{{ item?.planpulang?.atas_dasar }}</span>
                  </q-item-label>
                  <q-item-label v-if="item?.planpulang?.atas_dasar === 'Meninggal'">
                    No. Surat : <span class="text-weight-bold">{{ item?.planpulang?.nosurat }}</span>
                  </q-item-label>
                  <div class="" v-if="item?.planpulang?.atas_dasar === 'Paksa'">
                    <div class="q-pt-sm text-weight-bold">Informasi Penanggung Jawab</div>
                    <q-item-label class="q-mt-xs">Nama : <span class="text-weight-bold">{{
                      item?.planpulang?.nama_penanggungjawab
                        }}</span></q-item-label>
                    <q-item-label class="q-mt-xs">Alamat : <span class="text-weight-bold">{{
                      item?.planpulang?.alamat_penanggungjawab
                        }}</span></q-item-label>
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>
                <div class="q-gutter-sm">
                  <q-btn flat round size="sm" icon="icon-mat-delete" color="negative"
                    @click="hapusItem(item.id, item.rs4)" />
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { usePlannStore } from 'src/stores/simrs/igd/plann'
import { computed } from 'vue'

const $q = useQuasar()
const store = usePlannStore()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  }
})

const lists = computed(() => {
  const arr = props.pasien?.planheder
  return arr?.sort((a, b) => { return b.id - a.id })
})

function hapusItem(id, jenis) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('OK')
    store.deleteData(props.pasien, id, jenis)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function hapusObat(obat) {
  $q.dialog({ title: 'Hapus Obat', message: `Hapus ${obat.nama_obat}?`, cancel: true, persistent: true })
    .onOk(async () => {
      try {
        const resp = await api.post('v1/simrs/planing/igd/hapusobatrujukan', { id: obat.id })
        if (resp.status === 200) {
          lists.value?.forEach(item => {
            const data = item?.planrujukan?.obatrujukan
            const index = data?.findIndex(row => row.id === obat.id)
            if (index >= 0) data.splice(index, 1)
          })
          $q.notify({ type: 'positive', message: resp.data.message })
        }
      } catch (error) {
        // Pesan kesalahan dari interceptor axios sudah ditampilkan.
      }
    })
}

</script>

<style scoped>
.obat-rujukan-table :deep(th) {
  background: #e8f5f2;
  color: #00695c;
  font-weight: 700;
}
</style>
