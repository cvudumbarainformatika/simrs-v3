<template>
  <div class="fit bg-white scroll q-pa-md">
    <div class="col-12">
      <div class="row items-center q-mb-md">
        <q-icon name="cancel" size="24px" color="negative" class="q-mr-sm" />
        <div class="text-bold f-16">Formulir Pembatalan Pelayanan Operasi</div>
      </div>
      <q-separator class="q-mb-md" />

      <q-form @submit="simpanData" class="q-gutter-y-md">
        <!-- Section 1: Identitas Penanggung Jawab -->
        <div class="text-subtitle2 text-weight-bold text-primary">I. IDENTITAS PENANGGUNG JAWAB / PASIEN</div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="store.form.nama_penerima_informasi"
              label="Nama Penanggung Jawab"
              outlined
              dense
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Nama harus diisi']"
            />
          </div>
          
          <div class="col-12 col-md-6">
            <q-select
              v-model="store.form.hubungan_penerima_informasi"
              label="Hubungan dengan Pasien"
              :options="hubunganOptions"
              outlined
              dense
              emit-value
              map-options
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Hubungan harus dipilih']"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="store.form.tgllahir_penerima_informasi"
              label="Tanggal Lahir Penanggung Jawab"
              outlined
              dense
              type="date"
              stack-label
              @update:model-value="hitungUmur"
            />
          </div>
          
          <div class="col-12 col-md-6">
            <q-input
              v-model.number="store.form.umur_penerima_informasi"
              label="Umur (Tahun)"
              outlined
              dense
              type="number"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-12 col-md-6">
            <div class="q-pa-sm" style="border: 1px solid #ddd; border-radius: 8px; background-color: #fafafa;">
              <div class="text-weight-bold q-mb-sm text-grey-8">
                Tanda Tangan Penanggung Jawab / Pasien:
              </div>
              <app-signature 
                :ttd="store.form.ttd_penanggung_jawab" 
                :width="300" 
                :height="150"
                label-ttd="TTD Penanggung Jawab" 
                @save-ttd="(val) => store.form.ttd_penanggung_jawab = val"
                :pasien="pasien" 
                uuid="ttd_penanggung_jawab" 
                @signature="(val) => {
                  store.form.ttd_penanggung_jawab = val
                }" 
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Alasan Pembatalan -->
        <div class="text-subtitle2 text-weight-bold text-primary q-mt-md">II. ALASAN PEMBATALAN</div>
        <div class="row">
          <div class="col-12">
            <q-input
              v-model="store.form.alasan_pembatalan"
              label="Pernyataan menerima informasi pembatalan karena:"
              outlined
              type="textarea"
              rows="3"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Alasan pembatalan harus diisi']"
            />
          </div>
        </div>

        <!-- Section 3: Alternatif Tindakan -->
        <div class="text-subtitle2 text-weight-bold text-primary q-mt-md">III. RENCANA ALTERNATIF SETELAH BATAL</div>
        <div class="row">
          <div class="col-12">
            <div class="q-gutter-sm">
              <q-radio v-model="store.form.alternatif_pilihan" val="rujuk" label="Dirujuk ke layanan kesehatan lain" />
              <q-radio v-model="store.form.alternatif_pilihan" val="kembali" label="Dikembalikan kepada dokter pengirim" />
            </div>
          </div>
        </div>

        <!-- Conditional Inputs based on Alternatif Pilihan -->
        <div v-if="store.form.alternatif_pilihan === 'rujuk'" class="row q-mt-sm">
          <div class="col-12">
            <q-input
              v-model="store.form.alternatif_rujuk_ke"
              label="Dirujuk Ke (Nama Layanan Kesehatan/Faskes)"
              outlined
              dense
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Tujuan rujukan harus diisi']"
            />
          </div>
        </div>

        <div v-if="store.form.alternatif_pilihan === 'kembali'" class="row q-mt-sm">
          <div class="col-12">
            <q-input
              v-model="store.form.alternatif_kembali_rencana"
              label="Rencana Tindakan dari Dokter Pengirim"
              outlined
              type="textarea"
              rows="3"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Rencana tindakan harus diisi']"
            />
          </div>
        </div>


        <q-separator class="q-my-md" />

        <div class="row justify-end q-gutter-sm q-pb-lg">
          <q-btn
            label="Simpan Data"
            color="primary"
            type="submit"
            :loading="store.loading"
            :disable="store.loading"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { usePembatalanOperasiStore } from 'src/stores/simrs/kamaroperasi/pembatalan'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePembatalanOperasiStore()

const hubunganOptions = ref([
  { label: 'Pasien Sendiri', value: 'Pasien Sendiri' },
  { label: 'Suami', value: 'Suami' },
  { label: 'Istri', value: 'Istri' },
  { label: 'Anak', value: 'Anak' },
  { label: 'Orang Tua', value: 'Orang Tua' },
  { label: 'Wali', value: 'Wali' },
  { label: 'Lainnya', value: 'Lainnya' }
])

const dokters = computed(() => {
  return store.nakes?.filter(i => i.kdgroupnakes === '1') || []
})

function hitungUmur(val) {
  if (!val) return
  const birthDate = new Date(val)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  store.form.umur_penerima_informasi = age >= 0 ? age : 0
}

watch(() => store.form.alternatif_pilihan, (newVal) => {
  if (newVal === 'rujuk') {
    store.form.alternatif_kembali_rencana = ''
  } else if (newVal === 'kembali') {
    store.form.alternatif_rujuk_ke = ''
  }
})

function simpanData() {
  store.simpan(props.pasien)
}

onMounted(() => {
  store.getNakes()
  store.getDataPembatalan(props.pasien)
})
</script>
