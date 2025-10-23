<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="f-14 text-weight-bold">
          Registrasi / Kunjungan Home Care
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row fit q-col-gutter-sm q-mb-md">
          <!-- kiri -->
          <div class="col-6">
            <!-- no Registrasi -->
            <!-- <div class="row q-col-gutter-sm items-center q-mb-xs">
              <div class="col-4">
                Nomor Registrasi
              </div>
              <div class="col-8">
                : {{ store.form.noreg }}
              </div>
            </div> -->
            <!-- Jenis Admin Layanan -->
            <div class="row q-col-gutter-sm items-center q-mb-xs">
              <div class="col-12">
                <app-autocomplete ref="refJenisAdminLayanan" v-model="store.form.kode_layanan" label="Admin Layanan"
                  autocomplete="nama" option-value="kode" option-label="nama" outlined
                  :source="store.homeCareAdminLayanans" :loading="store.loading"
                  :rules="[val => (!!val) || 'Harap diisi',]" @selected="(val) => store.pilihAdminLayanan(val)" />
              </div>
            </div>
          </div>
          <!-- kanan -->
          <div class="col-6">
            <!-- DPJP -->
            <div class="row q-col-gutter-sm items-center q-mb-xs">
              <div class="col-12">
                <app-autocomplete ref="refDPJP" v-model="store.form.dpjp" label="DPJP" autocomplete="nama"
                  option-value="dpjp" option-label="nama" :disable="!store.dpjps?.length" outlined :source="store.dpjps"
                  :loading="store.loading" :rules="[val => (!!val) || 'Harap diisi',]" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { notifErrVue } from 'src/modules/utils'
import { useRegistrasiPasienHomeCareStore } from 'src/stores/simrs/pendaftaran/form/homecare/registrasi'

const store = useRegistrasiPasienHomeCareStore()
store.getInitialData()
// emits
const emits = defineEmits(['bisaSimpan'])
// refs
const refJenisAdminLayanan = ref(null)
const refDPJP = ref(null)
// reset validasi
function resetValidation () {
  refJenisAdminLayanan.value.$refs.refAuto.resetValidation()
  refDPJP.value.$refs.refAuto.resetValidation()
}
// validasi
let valid = false
function validasi () {
  const asalRujukan = refJenisAdminLayanan.value.$refs.refAuto.validate()
  const dpjp = refDPJP.value.$refs.refAuto.validate()
  // const dpjp = true
  if (asalRujukan && dpjp) { valid = true }
  else { valid = false }
}
// set
function set () {
  validasi()
  if (valid) {
    emits('bisaSimpan', { form: store.form, save: true })
    return { form: store.form, save: true }
  }
  else {
    emits('bisaSimpan', { form: store.form, save: false })
    notifErrVue('periksa kembali input registrasi anda')
    return { form: store.form, save: false }
  }
}

// expose function
defineExpose({ resetValidation, set })
</script>
