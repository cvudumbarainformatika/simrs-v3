<template>
  <div class="column fit q-pa-md">
    <div class="col-auto">
      <div class="text-h6 text-weight-bold">Form Inform Concern Home Care</div>
      <div class="text-caption text-grey-7">
        Isi dan simpan surat permohonan serta surat persetujuan layanan untuk kunjungan ini.
      </div>
    </div>

    <div class="col column q-mt-md overflow-hidden">
      <q-tabs
        v-model="tab"
        dense
        no-caps
        align="left"
        class="col-auto bg-primary text-white"
        active-color="yellow"
        active-bg-color="dark"
      >
        <q-tab name="permohonan" label="Surat Permohonan" />
        <q-tab name="persetujuan" label="Surat Persetujuan" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="col fit bg-grey-2">
        <q-tab-panel name="permohonan" class="scroll">
          <q-form @submit.prevent="store.simpan(props.pasien, 'request')">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Surat Permohonan Layanan Perawatan di Rumah</div>
                <div class="text-caption text-grey-7">Identitas pemohon</div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div v-for="field in applicantFields" :key="field.key" :class="field.col">
                    <q-input
                      v-model="store.permohonan[field.key]"
                      outlined
                      :dense="field.type !== 'textarea'"
                      :type="field.type"
                      :rows="field.rows"
                      :label="field.label"
                      :maxlength="field.maxlength"
                      :rules="field.required ? [wajib] : []"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="store.permohonan.patient_relationship" outlined dense maxlength="50"
                      label="Hubungan pemohon dengan pasien"
                      :rules="[wajib]" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">Identitas pasien yang dimohonkan</div>
                <div class="text-caption text-grey-8 q-mb-sm">
                  Permohonan mencakup pemeriksaan, pengobatan, pemeriksaan penunjang medis, dan tindakan medis non-operatif
                  yang berhubungan dengan penyakit pasien.
                </div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div v-for="field in patientFields" :key="field.key" :class="field.col">
                    <q-input
                      v-model="store.permohonan[field.key]"
                      outlined
                      dense
                      :label="field.label"
                      :maxlength="field.maxlength"
                      :rules="[wajib]"
                    />
                  </div>
                </div>
                <q-input
                  v-model="store.permohonan.service_type"
                  type="textarea"
                  outlined
                  rows="2"
                  maxlength="1000"
                  label="Jenis layanan yang dimohonkan"
                  :rules="[wajib]"
                />
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">Pernyataan dan tanda tangan</div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.permohonan.witness_name" outlined dense maxlength="100" label="Nama saksi"
                      :rules="[wajib]" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.permohonan.signer_name" outlined dense maxlength="100"
                      label="Nama pasien/keluarga yang mengajukan"
                      :rules="[wajib]" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.permohonan.signed_at" outlined dense type="date" label="Tanggal pengajuan"
                      :rules="[wajib]" />
                  </div>
                  <div class="col-12 col-md-6">
                    <app-signature
                      :ttd="store.permohonan.ttd_signer"
                      :pasien="props.pasien"
                      :width="300"
                      :height="150"
                      label-ttd="Tanda Tangan Pasien/Keluarga"
                      uuid="homecare-permohonan-ttd-pemohon"
                      @save-ttd="store.permohonan.ttd_signer = $event"
                      @signature="store.permohonan.ttd_signer = $event"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <app-signature
                      :ttd="store.permohonan.ttd_witness"
                      :pasien="props.pasien"
                      :width="300"
                      :height="150"
                      label-ttd="Tanda Tangan Saksi"
                      uuid="homecare-permohonan-ttd-saksi"
                      @save-ttd="store.permohonan.ttd_witness = $event"
                      @signature="store.permohonan.ttd_witness = $event"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="q-pa-md">
                <q-badge v-if="store.permohonan.id" color="positive" label="Tersimpan" class="q-mr-sm" />
                <q-btn color="primary" unelevated type="submit" icon="icon-mat-save" label="Simpan Permohonan"
                  :loading="store.loadingSave === 'request'" />
              </q-card-actions>
            </q-card>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="persetujuan" class="scroll">
          <q-form @submit.prevent="store.simpan(props.pasien, 'consent')">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Surat Pernyataan/Persetujuan Layanan Keperawatan di Rumah</div>
                <div class="text-caption text-grey-7">Identitas pihak yang membuat pernyataan/persetujuan</div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div v-for="field in consentApplicantFields" :key="field.key" :class="field.col">
                    <q-input
                      v-model="store.persetujuan[field.key]"
                      outlined
                      dense
                      :label="field.label"
                      :maxlength="field.maxlength"
                      :rules="[wajib]"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="store.persetujuan.patient_relationship" outlined dense maxlength="50"
                      label="Persetujuan untuk diri sendiri/istri/suami/anak/ayah/ibu"
                      :rules="[wajib]" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">Identitas pasien dan jenis perawatan</div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div v-for="field in patientFields" :key="field.key" :class="field.col">
                    <q-input
                      v-model="store.persetujuan[field.key]"
                      outlined
                      dense
                      :label="field.label"
                      :maxlength="field.maxlength"
                      :rules="[wajib]"
                    />
                  </div>
                </div>
                <q-checkbox v-model="store.persetujuan.homecare_24_hours" label="Home Care 24 jam" />
                <div class="row q-col-gutter-md q-mt-xs">
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.nurse_visit_frequency" outlined dense maxlength="100"
                      label="Home visit perawat (berapa kali/hari atau sesuai kebutuhan)" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.doctor_visit_frequency" outlined dense maxlength="100"
                      label="Home visit dokter (berapa kali/hari atau sesuai kebutuhan)" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.other_staff" outlined dense maxlength="150" label="Petugas lainnya" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.other_visit_frequency" outlined dense maxlength="100"
                      label="Home visit petugas lainnya (berapa kali/hari atau sesuai kebutuhan)" />
                  </div>
                  <div class="col-12">
                    <q-input v-model="store.persetujuan.nursing_actions" type="textarea" outlined rows="2"
                      maxlength="5000" label="Tindakan keperawatan" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-caption text-grey-8">
                  Saya mengerti dan memahami sepenuhnya risiko pelaksanaan perawatan lanjutan di rumah (Home Health Care)
                  terhadap pasien tersebut. Saya memberikan hak dan kewajiban kepada tim Home Care UOBK RSUD dr. Mohamad
                  Saleh Kota Probolinggo untuk melakukan tindakan sesuai kewenangannya, dan membebaskan petugas dari tuntutan
                  hukum apabila terjadi risiko yang telah dijelaskan.
                </div>
                <div class="row q-col-gutter-md q-mt-xs">
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.witness_name" outlined dense maxlength="100" label="Nama saksi"
                      :rules="[wajib]" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.signer_name" outlined dense maxlength="100"
                      label="Nama pasien/keluarga yang menyetujui"
                      :rules="[wajib]" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="store.persetujuan.signed_at" outlined dense type="date" label="Tanggal persetujuan"
                      :rules="[wajib]" />
                  </div>
                  <div class="col-12 col-md-6">
                    <app-signature
                      :ttd="store.persetujuan.ttd_signer"
                      :pasien="props.pasien"
                      :width="300"
                      :height="150"
                      label-ttd="Tanda Tangan Pasien/Keluarga yang Menyetujui"
                      uuid="homecare-persetujuan-ttd-pemohon"
                      @save-ttd="store.persetujuan.ttd_signer = $event"
                      @signature="store.persetujuan.ttd_signer = $event"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <app-signature
                      :ttd="store.persetujuan.ttd_witness"
                      :pasien="props.pasien"
                      :width="300"
                      :height="150"
                      label-ttd="Tanda Tangan Saksi"
                      uuid="homecare-persetujuan-ttd-saksi"
                      @save-ttd="store.persetujuan.ttd_witness = $event"
                      @signature="store.persetujuan.ttd_witness = $event"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="q-pa-md">
                <q-badge v-if="store.persetujuan.id" color="positive" label="Tersimpan" class="q-mr-sm" />
                <q-btn color="primary" unelevated type="submit" icon="icon-mat-save" label="Simpan Persetujuan"
                  :loading="store.loadingSave === 'consent'" />
              </q-card-actions>
            </q-card>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-inner-loading :showing="store.loadingData">
      <q-spinner size="40px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useInformConcernHomeCareStore } from 'src/stores/simrs/homeCare/informConcern'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useInformConcernHomeCareStore()
const tab = ref('permohonan')
const wajib = value => !!String(value ?? '').trim() || 'Wajib diisi'

const applicantFields = [
  { key: 'applicant_name', label: 'Nama pemohon', col: 'col-12 col-md-4', maxlength: 100, required: true },
  { key: 'applicant_age_gender', label: 'Umur/Jenis kelamin pemohon', col: 'col-12 col-md-4', maxlength: 100, required: true },
  { key: 'applicant_phone', label: 'No. telepon pemohon', col: 'col-12 col-md-4', maxlength: 50, type: 'tel' },
  { key: 'applicant_address', label: 'Alamat pemohon', col: 'col-12', maxlength: 1000, type: 'textarea', rows: 2, required: true }
]

const consentApplicantFields = applicantFields.filter(field => field.key !== 'applicant_phone')

const patientFields = [
  { key: 'patient_name', label: 'Nama pasien', col: 'col-12 col-md-4', maxlength: 100 },
  { key: 'patient_age_gender', label: 'Umur/Jenis kelamin pasien', col: 'col-12 col-md-4', maxlength: 100 },
  { key: 'patient_address', label: 'Alamat pasien', col: 'col-12', maxlength: 1000 }
]

onMounted(() => {
  store.getData(props.pasien)
})
</script>
