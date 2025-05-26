<template>
  <div class="row items-center q-col-gutter-x-sm">
    <!-- Status fungsional -->

    <div class="col-6">
      <app-autocomplete class="q-my-xs" v-model="store.form.fungsional" :source="store.statusFungs"
        label="Status Fungsional" outlined hide-dropdown-icon />
    </div>
    <!-- jika fingsional Perlu Bantuan -->
    <div v-if="store.form.fungsional === 'Perlu Bantuan'" class="col-6">
      <app-input-simrs ref="refLainFungsi" v-model="store.form.lainx"
        :label="'Sebutkan Bantuan yang diperlukan ' + panjangChar(store.form.lainx, 250)"
        :valid="{ max: 255, canEmpty: true }" />
    </div>

    <!-- Alasan -->
    <div class="col-6">
      <app-input-simrs ref="refAlasan" v-model="store.form.alasan"
        :label="'Alasan Kunjungan ' + panjangChar(store.form.alasan, 250)"
        :valid="{ max: 255, canEmpty: true, canEmpty: true }" />
    </div>
    <!-- Riwayat Psikososial -->
    <div class="col-6"> <app-input-simrs ref="refRiwayatPsikososial" v-model="store.form.riwayat"
        :label="'Riwayat Psikososial ' + panjangChar(store.form.riwayat, 250)" type="textarea"
        :valid="{ max: 255, canEmpty: true }" />
    </div>
    <!-- Hunbungan dengan kel -->
    <div class="col-6">
      <app-autocomplete class="q-my-xs" v-model="store.form.hubungan" :source="store.hubungans"
        label="Hubungan Pasien dengan keluarga" outlined hide-dropdown-icon />
    </div>
    <!-- Status Psikologis -->
    <div class="col-6">
      <app-autocomplete class="q-my-xs" v-model="store.form.psikologis" :source="store.psikologis"
        label="Status Psikologis" outlined hide-dropdown-icon />
    </div>
    <!-- jika psikologis lain-lain -->
    <div v-if="store.form.psikologis === 'Lain-lain'" class="col-6">
      <app-input-simrs ref="refLainPsiko" v-model="store.form.lain"
        :label="'Sebutkan Status Psikologis Lainya ' + panjangChar(store.form.lain, 250)"
        :valid="{ max: 255, canEmpty: true }" />
    </div>
    <!-- Tek Dar -->
    <div class="col-5">
      <app-input-simrs ref="refTekDar" v-model="store.form.td"
        :label="'Tekanan Darah ' + panjangChar(store.form.td, 250)" :valid="{ max: 255, canEmpty: true }" />
    </div>
    <div class="col-1 text-center">mmHg</div>
    <!-- Nadi -->
    <div class="col-5">
      <app-input-simrs ref="refNadi" v-model="store.form.nadi" :label="'Nadi ' + panjangChar(store.form.nadi, 250)"
        :valid="{ max: 255, canEmpty: true }" />
    </div>
    <div class="col-1 text-center">x/menit</div>
    <!-- Suhu -->
    <div class="col-5">
      <app-input-simrs ref="refSuhu" v-model="store.form.suhu" :label="'Suhu ' + panjangChar(store.form.suhu, 250)"
        :valid="{ max: 255, canEmpty: true }" />
    </div>
    <div class="col-1 text-center">
      <div class="row justify-center">
        <span class="f-10">o</span> C
      </div>
    </div>
    <!-- Tinggi Badan -->
    <div class="col-5">
      <app-input-simrs ref="refTingBad" v-model="store.form.tb"
        :label="'Tinggi Badan ' + panjangChar(store.form.tb, 250)" :valid="{ max: 255, canEmpty: true }" />
    </div>
    <div class="col-1 text-center">cm</div>
    <!-- Berat Badan -->
    <div class="col-5">
      <app-input-simrs ref="refBerBad" v-model="store.form.bb" :label="'Berat Badan ' + panjangChar(store.form.bb, 250)"
        :valid="{ max: 255, canEmpty: true }" />
    </div>
    <div class="col-1 text-center">Kg</div>
    <!-- Penurunan BB -->
    <div class="col-6">
      <app-autocomplete class="q-my-xs" v-model="store.form.penurunanBB" :source="store.penurunanBeratBadans"
        label="Penurunan BB pasien yang tidak diiginkan dalam 6 bulan terakhir " outlined hide-dropdown-icon>
        <q-tooltip>Apakah Pasien Mengalami Penurunan BB yang tidak diiginkan dalam 6 bulan
          terakhir</q-tooltip></app-autocomplete>
    </div>
    <!-- Napsu-->
    <div class="col-6">
      <app-autocomplete class="q-my-xs" v-model="store.form.asupanNafsu" :source="store.yatis"
        label="Apakah asupan makna berkurang akibat nafsu makan  " outlined hide-dropdown-icon> <q-tooltip>Apakah asupan
          makna berkurang akibat nafsu makan </q-tooltip></app-autocomplete>
    </div>
    <!-- Diagsus-->
    <div class="col-6">
      <app-autocomplete class="q-my-xs" v-model="store.form.diagKhus" :source="store.yatis"
        label="Pasien dengan diagnosa khusus" outlined hide-dropdown-icon> <q-tooltip>Pasien dengan diagnosa khusus
        </q-tooltip></app-autocomplete>
    </div>

  </div>
  <div class="row q-mt-md justify-end">
    <q-btn label="Simpan" no-caps dense color="primary" @click="simpan" :loading="store.loading"
      :disable="store.loading"> <q-tooltip>Simpan</q-tooltip></q-btn>
  </div>
</template>
<script setup>
import { notifErrVue } from 'src/modules/utils'
import { usePengkajianHemodialisaStore } from 'src/stores/simrs/hemodialisa/pengkajian'
import { onMounted, onUnmounted, ref } from 'vue'


const store = usePengkajianHemodialisaStore()

const refAlasan = ref(null)
const refTekDar = ref(null)
const refNadi = ref(null)
const refSuhu = ref(null)
const refTingBad = ref(null)
const refBerBad = ref(null)
const refRiwayatPsikososial = ref(null)
const refLainPsiko = ref(null)
const refLainFungsi = ref(null)
function resetValidasi () {
  refAlasan.value?.appInputSimrs?.resetValidation()
  refTekDar.value?.appInputSimrs?.resetValidation()
  refNadi.value?.appInputSimrs?.resetValidation()
  refSuhu.value?.appInputSimrs?.resetValidation()
  refTingBad.value?.appInputSimrs?.resetValidation()
  refBerBad.value?.appInputSimrs?.resetValidation()
  refRiwayatPsikososial.value?.appInputSimrs?.resetValidation()
  refLainPsiko.value?.appInputSimrs?.resetValidation()
  refLainFungsi.value?.appInputSimrs?.resetValidation()
}
function validasi () {
  console.log('refLainFungsi', !refLainPsiko.value)

  if (refAlasan.value?.appInputSimrs?.validate() &&
    refTekDar.value?.appInputSimrs?.validate() &&
    refNadi.value?.appInputSimrs?.validate() &&
    refSuhu.value?.appInputSimrs?.validate() &&
    refTingBad.value?.appInputSimrs?.validate() &&
    refBerBad.value?.appInputSimrs?.validate() &&
    refRiwayatPsikososial.value?.appInputSimrs?.validate() &&
    (!refLainPsiko.value ? true : refLainPsiko.value?.appInputSimrs?.validate()) &&
    (!refLainFungsi.value ? true : refLainFungsi.value?.appInputSimrs?.validate())
  ) {
    return true
  } else {
    return false
  }
}
function panjangChar (val, panj) {
  if (val?.length > parseInt(panj)) return '(' + val?.length + ')'
  else return ''
}

function simpan () {
  if (!validasi()) return notifErrVue('Silahkan lengkapi form terlebih dahulu')
  store.simpan().then(() => {
    store.resetForm()
    resetValidasi()
    store.initPasien()
  })
  console.log('store.form', store.form)

}
onMounted(() => {
  store.initPasien()
  setTimeout(() => {
    resetValidasi()

  }, 50)
})
onUnmounted(() => {
  store.resetForm()
})
</script>
