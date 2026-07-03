<template>
  <q-card flat bordered square class="full-height" style="overflow: hidden;">
    <q-form ref="refForm" class="full-height" @submit="onSubmit">
      <q-card-section class="q-px-md q-py-xs bg-primary text-white">
        <div class="row items-center justify-between">
          <div class="f-12 text-weight-bold">
            Form Anamnesis
          </div>
          <div>
            <q-btn flat dense size="md" icon="icon-mat-history" @click="historyOpen">
              <q-tooltip class="bg-dark text-white">
                {{ tooltip }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="full-height scroll">
        <div class="row q-col-gutter-sm">
          <q-input v-model="store.form.keluhanutama" outlined autogrow stack-label standout="bg-yellow-3"
            label="Keluhan Utama" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" hide-bottom-space
            style="width:50%" />
          <q-input v-model="store.form.riwayatpenyakitsekarang" outlined autogrow standout="bg-yellow-3"
            label="Riwayat Penyakit Sekarang" stack-label style="width:50%" />
          <q-input v-model="store.form.riwayatpenyakit" outlined autogrow standout="bg-yellow-3"
            label="Riwayat Penyakit (Dahulu)" stack-label style="width:50%" />
          <q-input v-model="store.form.riwayatpengobatan" outlined autogrow standout="bg-yellow-3" style="width:50%"
            label="Riwayat Pengobatan" stack-label />
          <q-input v-model="store.form.riwayatpenyakitkeluarga" outlined autogrow standout="bg-yellow-3"
            style="width:50%" label="Riwayat Penyakit Keluarga" stack-label />
          <q-input v-model="store.form.riwayatpekerjaan" outlined autogrow standout="bg-yellow-3" style="width:50%"
            label="Riwayat Pekerjaan yg berhubungan dgn zat berbahaya" stack-label />
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <div class="col-12 text-weight-bold">Hambatan</div>

          <div class="col-4">Fisik</div>
          <div class="col-8"><q-option-group v-model="store.form.hambatan_fisik" :options="optionYT" inline
              :rules="[val => !!val || 'Harap pilih salah satu']" dense /></div>
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <div class="col-4">Kursi Roda</div>
          <div class="col-8"><q-option-group v-model="store.form.hambatan_fisik_kursi_roda" :options="optionYT" inline
              :rules="[val => !!val || 'Harap pilih salah satu']" dense /></div>
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <div class="col-4">Lain-lain</div>
          <div class="col-8"><q-input v-model="store.form.hambatan_fisik_lain" outlined type="textarea" rows="2" />
          </div>
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <div class="col-4">Bahasa</div>
          <div class="col-8"><q-option-group v-model="store.form.hambatan_bahasa" :options="optionYT" inline
              :rules="[val => !!val || 'Harap pilih salah satu']" dense /></div>
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <div class="col-4">Penerjemah</div>
          <div class="col-8"><q-option-group v-model="store.form.hambatan_penerjemah" :options="optionYT" inline
              :rules="[val => !!val || 'Harap pilih salah satu']" dense /></div>
          <div class="col-12">
            <q-separator class="q-my-sm" />
            <div class="text-weight-bold">
              Riwayat Alergi
            </div>
            <div class="text-grey-8 f-10">
              Riwayat alergi yang pernah dialami
              oleh pasien
            </div>
            <q-separator class="q-my-sm" />
            <q-checkbox v-for="(al, i) in store.alergis" :key="i" v-model="store.selection" :val="al" :label="al"
              color="primary" @update:model-value="updateSelection" />
            <q-input v-model="store.form.riwayatalergi" outlined label="Riwayat" standout="bg-yellow-3" readonly
              class="q-mb-sm hidden" autogrow />
            <q-input v-model="store.form.keteranganalergi" outlined autogrow label="Keterangan Alergi" stack-label
              standout="bg-yellow-3" />
          </div>
          <div class="col-12 q-mt-xs">
            <div class="text-weight-bold">
              Skreening Gizi
            </div>
            <q-separator class="q-my-xs" />
            <div class="row items-center">
              <div class="col-8">
                Apakah Ada Penurunan Berat badan yang tidak diinginkan selama 6 Bulan terakhir ?
              </div>
              <div class="col-4">
                <q-option-group v-model="store.form.skreeninggizi" :options="optionSkreening" color="primary" inline
                  dense @update:model-value="lihatPerubahan" />
              </div>
            </div>
          </div>
          <div class="col-12 q-mt-xs">
            <q-separator class="q-my-xs" />
            <div class="row items-center">
              <div class="col-8">
                Apakah Asupan Makan berkurang karena tidak nafsu makan ?
              </div>
              <div class="col-4">
                <q-option-group v-model="store.form.asupanmakan" :options="optionAsupanMakan" color="primary" inline
                  dense @update:model-value="lihatPerubahan" />
              </div>
            </div>
          </div>
          <div class="col-12">
            <q-separator class="q-my-xs" />
            <div class="row items-center q-col-gutter-sm">
              <div class="col-2">
                Kondisi Khusus :
              </div>
              <div class="col-8">
                <q-input v-model="store.form.kondisikhusus" outlined dense standout="bg-yellow-3" label="Kondisi Khusus"
                  stack-label @update:model-value="lihatPerubahan" />
              </div>
              <!-- <div class="col-2">
                <q-input
                  v-model="store.form.skor"
                  outlined
                  dense
                  standout="bg-yellow-3"
                  label="Skor"
                  stack-label
                />
              </div> -->
              <div class="col-12">
                <q-separator class="q-my-xs" />
                <div class="flex">
                  Skor Skreening Gizi : <div class="q-mx-sm">
                    <b>{{ store.form.skor }}</b>
                  </div>
                  <div>
                    Keterangan : {{ store.keteranganSkorGizi(store.form.skor) }}
                  </div>
                </div>
              </div>
            </div>

            <q-separator class="q-my-xs" />
          </div>
          <app-autocomplete v-model="store.form.pernafasan" outlined class="col-6"
            :source="['Nafas Normal', 'Tampak Sesak', 'Tidak Bernafas']" hide-dropdown-icon label="Pernafasan" />
          <app-autocomplete v-model="store.form.nyeri_dada" outlined class="col-6"
            :source="['Tidak ada', 'Ada (Tingkat sedang)', 'Nyeri dada kiri tembus ke punggung']" hide-dropdown-icon
            label="Nyeri Dada" />
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <div class="col-6">
            <div class="text-weight-bold">
              Keluhan Nyeri ? <em class="text-primary">{{ store.form.keteranganscorenyeri }}</em>
              <span class="q-ml-sm">
                <q-icon size="lg" color="teal" :name="iconNyeri" />
              </span>
            </div>
            <q-separator class="q-my-xs" />
            <q-slider v-model="store.form.skornyeri" color="primary" thumb-color="primary" label-color="primary"
              label-text-color="yellow" markers :marker-labels="(val) => fnMarkerLabel"
              marker-labels-class="text-primary" label-always switch-label-side :min="0" :max="10"
              @update:model-value="store.setKeteranganSkornyeri" />
          </div>
          <div class="col-6"></div>
          <div class="col-12"><q-separator class="q-my-sm" /></div>
          <app-autocomplete v-model="store.form.batuk" outlined class="col-6  q-mt-sm"
            :source="['Tidak ada', 'Batuk lebih dari 2 minggu']" hide-dropdown-icon label="Batuk" />
          <app-autocomplete v-model="store.form.keputusan" outlined class="col-6 q-mt-sm"
            :source="['Sesuai antrian', 'Poliklinik disegerakan', 'IGD']" hide-dropdown-icon label="Keputusan" />
        </div>
        <q-separator class="q-my-md" />
        <div class="col-12 q-mt-xs">
          <div class="text-weight-bold">
            Assasement Jatuh (skor Up an Go)
          </div>
        </div>
        <div class="col-12 q-mt-xs">
          <q-separator class="q-my-xs" />
          <div class="row items-center">
            <div class="col-8">
              Perhatikan cara berjalan pasien saat akan duduk di kursi. Apakah pasien tampak tidak seimbang
              (sempoyongan) ?
            </div>
            <div class="col-4">
              <q-option-group v-model="store.form.seimbang" :options="optionYesNo" color="primary" inline dense
                @update:model-value="hasilResikoJatuh" />
            </div>
          </div>
        </div>
        <div class="col-12 q-mt-xs">
          <q-separator class="q-my-xs" />
          <div class="row items-center">
            <div class="col-8">
              Apakah pasien memegang pinggiran kursi atau benda lain sebagai penopang saat akan duduk ?
            </div>
            <div class="col-4">
              <q-option-group v-model="store.form.penopang" :options="optionYesNo" color="primary" inline dense
                @update:model-value="hasilResikoJatuh" />
            </div>
          </div>
        </div>
        <div class="col-12 q-mt-xs">
          <q-separator class="q-my-xs" />
          <div class="row items-center">
            <div class="col-8">
              Hasil
            </div>
            <div class="col-4 text-weight-bold">
              Resiko {{ store.cekHasil(store.form) }}
            </div>
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div class="text-right q-mt-md" style="margin-bottom: 50px;">
          <app-btn color="primary" label="Simpan Anamnesis" tooltip="Simpan Data" type="submit" tip
            :loading="store.loadingForm" />
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup>
import { useAnamnesis } from 'src/stores/simrs/pelayanan/poli/anamnesis'
import { computed, ref } from 'vue'
const store = useAnamnesis()
const emits = defineEmits(['openHistory'])

const refForm = ref()

const optionYT = ref([
  { label: 'Iya', value: 'Iya' },
  { label: 'Tidak', value: 'Tidak' }
])
const optionSkreening = ref([
  { label: 'Iya (2)', value: 2 },
  { label: 'Tidak (0)', value: 0 }
])
const optionAsupanMakan = ref([
  { label: 'Iya (1)', value: 1 },
  { label: 'Tidak (0)', value: 0 }
])
const optionYesNo = ref([
  { label: 'Iya', value: 1 },
  { label: 'Tidak', value: 0 }
])

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  tooltip: {
    type: String,
    default: 'History Pasien'
  }
})
function onSubmit () {
  store.saveData(props.pasien).then(() => {
    refForm.value.resetValidation()
  })
}

function historyOpen () {
  emits('openHistory')
  // store.getHistory(props.pasien?.norm)
}

function lihatPerubahan () {
  store.hitungNilaiSkor()
}
function hasilResikoJatuh () {
  store.hitungResikoJatuh()
}

// eslint-disable-next-line no-unused-vars
function updateSelection (val) {
  // console.log(val.join(','))
  store.setForm('riwayatalergi', val.join(', '))
}
const iconNyeri = computed(() => {
  const val = store?.form.skornyeri
  let icon = 'icon-my-emoticon-excited-outline'
  if (val < 2) {
    icon = 'icon-my-emoticon-excited-outline'
  }
  else if (val >= 2 && val < 4) {
    icon = 'icon-my-emoticon-outline'
  }
  else if (val >= 4 && val < 6) {
    icon = 'icon-my-emoticon-neutral-outline'
  }
  else if (val >= 6 && val < 8) {
    icon = 'icon-my-emoticon-confused-outline'
  }
  else if (val >= 8 && val < 10) {
    icon = 'icon-my-emoticon-angry-outline'
  }
  else if (val === 10) {
    icon = 'icon-my-emoticon-cry-outline'
  }

  return icon
})
</script>
