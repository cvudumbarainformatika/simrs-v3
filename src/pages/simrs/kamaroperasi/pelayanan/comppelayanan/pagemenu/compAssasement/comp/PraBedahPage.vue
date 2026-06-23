<template>
  <div class="">
    <div v-if="store.notas?.length > 0" class="q-pa-sm">
      <div class="row items-center">
        <div class="col-auto depan ">Pilih Nota Operasi</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <app-autocomplete v-model="store.form.nota" label="Nota" dense :source="store.notas" option-value="nota"
            option-label="nota" outlined @selected="updateNota" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Riwayat Operasi</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.riwayat_operasi" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Riwayat Pengobatan</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.riwayat_pengobatan" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Alergi Obat dan Makanan</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.alergi" label="" type="textarea" />
        </div>
      </div>
      <div class="row q-py-sm text-weight-bold">Pemeriksaan Fisik</div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Kepala dan Leher</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.kepala_leher" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Mulut dan Gigi</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.mulut_gigi" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Kardiovaskuler</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.kardiovaskuler" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Genito Urinaria</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.genito_urinaria" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Obdomen</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.abdomen" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Alat Reproduksi</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.alat_reproduksi" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Thorax</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.thorax" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Muskuloskeletal</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.muskuloskeletal" :options="options" inline dense />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Riwayat Penyakit Dahulu</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.riwayat_penyakit" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center q-py-xs">
        <div class="col-auto depan ">Komplikasi</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-option-group v-model="store.form.komplikasi" :options="optionRiwayat" inline dense type="checkbox" />
        </div>
      </div>

      <div class="row items-center">
        <div class="col-auto depan ">Hasil Laboratorium</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.hasil_lab" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Hasil Pemeriksaan Penunjang Lain</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.hasil_pen_lain" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Diagnosa Pre Operasi</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.diagnosa_pre_op" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Rencana Tindakan Pembedahan</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.rencana_tindakan_bedah" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Rencana Pemasangan Implan</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.rencana_pasang_implan" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Rencana Pasca Pembedahan</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.rencana_pasca_bedah" label="" type="textarea" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-auto depan ">Catatan Khusus Dokter</div>
        <div class="col-auto dua">:</div>
        <div class="col-auto belakang">
          <q-input v-model="store.form.catatan_khusus_dokter" label="" type="textarea" />
        </div>
      </div>

      <div class="row justify-end q-mt-xl">
        <div class="col-2 text-center"><app-btn label="Simpan" @click="store.simpan(props.pasien)"
            :loading="store.loading" :disable="store.loading" /></div>
      </div>

      <!-- <div class="row justify-end q-mt-xl">
        <div class="col-6 text-center">Dokter</div>
      </div>
      <div class="row q-my-md justify-end">
        <div class="col-6 text-center ">
          <div class="column flex-center">
            <div style="width: 100px;">
              <vue-qrcode :value="qrUrl(store.form.dokter_operator)" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-end">
        <div class="col-6 text-center">{{ pasien?.dokter?.nama ?? 'belum dipilih' }}
        </div>
      </div>
       -->
    </div>
    <div v-else>
      <app-maintenance text="!!!  Belum Ada Nota permintaan Operasi !!!" color="negative" />
    </div>
  </div>
</template>

<script setup>
import { useAssasementPraBedahStore } from 'src/stores/simrs/kamaroperasi/assasement/praBedah'
import { onMounted, onUnmounted, ref } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useAssasementPraBedahStore()
const options = ref([
  {
    label: 'Tidak Ada Kelainan',
    value: 'Tidak Ada Kelainan'
  },
  {
    label: 'Ada Kelainan',
    value: 'Ada Kelainan'
  },
])
const optionRiwayat = ref([
  {
    label: 'Pendarahan',
    value: 'Pendarahan'
  },
  {
    label: 'Infeksi dearan operasi',
    value: 'Infeksi dearan operasi'
  },
  {
    label: 'Perlukaan Jaringan',
    value: 'Perlukaan Jaringan'
  },
  {
    label: 'Kematian',
    value: 'Kematian'
  },
  {
    label: 'Lain-lain',
    value: 'Lain-lain'
  },
])

function updateNota (val) {
  console.log('update nota', val)
  store.resetForm()
  store.getPraBedah(val)
}
onMounted(() => {
  store.getNotas(props.pasien)
  // store.getPraBedah(props.pasien)
  // if (props?.pasien?.pra_bedah?.length > 0) {
  //   const data = props?.pasien?.pra_bedah[0]
  //   store.form = { ...data }
  // }
  // console.log('form', store.form)
})
onUnmounted(() => {
  store.form = {
    komplikasi: []
  }
  // console.log('form', store.form)
})
</script>
<style lang="scss" scoped>
.depan {
  width: 20%;
}

.dua {
  width: 1%;
}

.belakang {
  width: 79%;
}
</style>
