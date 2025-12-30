<template>
  <q-dialog>
    <q-card class="lebar">
      <q-card-section>
        <div class="f-14 text-weight-bold">
          Form Tarif
        </div>
        <div class="title-desc">
          Input data Tarif
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-6 col-xs-12">
              <app-input v-model="store.form.rs1" label="Kode Tarif" outlined valid :loading="store.loading" readonly />
            </div>
            <div class="col-md-6 col-xs-12">
              <app-input v-model="store.form.rs2" label="Nama Tarif" outlined :loading="store.loading"
                :disable="store.loading || store.edit" :autofocus="!store.edit" />
            </div>
          </div>
          <!-- tarif 1 -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs6" valid label="JS Tarif 1" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'rs6')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs7" valid label="JP Tarif 1" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs7')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs8" valid label="Anastesi Tarif 1" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs8')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="tarif1" valid label="Tarif 1" outlined :loading="store.loading" readonly />
            </div>
          </div>

          <!-- tarif 2 -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs9" valid label="JS Tarif 2" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'rs9')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs10" valid label="JP Tarif 2" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs10')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs11" valid label="Anastesi Tarif 2" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs11')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="tarif2" valid label="Tarif 2" outlined :loading="store.loading" readonly />
            </div>
          </div>

          <!-- presidential -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.ssp" valid label="JS Tarif Presidential" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'ssp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.psp" valid label="JP Tarif Presidential" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'psp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.asp" valid label="Anastesi Tarif Presidential" outlined
                :loading="store.loading" :disable="store.loading" @update:model-value="SetTarif($event, 'asp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="presidential" valid label="Tarif 2" outlined :loading="store.loading" readonly />
            </div>
          </div>
          <!-- tarif poli -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs12" valid label="JS Tarif Poli" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'rs12')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.rs13" valid label="JP Tarif Poli" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs13')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <!-- <app-input v-model="store.form.rs11" valid label="Anastesi Tarif Poli" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs11')" /> -->
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="poli" valid label="Tarif Poli" outlined :loading="store.loading" readonly />
            </div>
          </div>

          <!-- Masa berlaku -->
          <div class="row q-col-gutter-md q-mb-sm">
            <app-input-date-human :model="store.disp.tgl_mulai_berlaku" class="col-12" valid
              label="Tanggal Mulai Berlaku" @dbModel="store.setTglMulaiBerlaku" :loading="store.loading" outlined
              :disable="store.loading" />
          </div>
          <!-- Dasar perubahan -->
          <div class="row q-col-gutter-md q-mb-sm">
            <app-input v-model="store.form.dasar_perubahan" label="Dasar Perubahan" class="col-12" outlined
              :loading="store.loading" :disable="store.loading" text />
          </div>

          <q-separator class="q-my-md" />
          <div class="text-right">
            <app-btn type="reset" color="dark" label="Cancel" class="q-mr-md" :loading="store.loading"
              :disable="store.loading" />
            <app-btn label="Simpan" :loading="store.loading" :disable="store.loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useMasterTindakanOperasiStore } from 'src/stores/simrs/master/tarif/tindakanOperasi'
import { computed } from 'vue'
const store = useMasterTindakanOperasiStore()
function SetTarif (evt, jenis) {
  // console.log('pres', evt, jenis)
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  store.setForm(jenis, val)
}
const tarif1 = computed(() => {
  const js = !isNaN(store.form.rs6) && store.form.rs6 !== '' ? parseInt(store.form.rs6) : 0
  const jp = !isNaN(store.form.rs7) && store.form.rs7 !== '' ? parseInt(store.form.rs7) : 0
  const anastesi = !isNaN(store.form.rs8) && store.form.rs8 !== '' ? parseInt(store.form.rs8) : 0
  return js + jp + anastesi
})
const tarif2 = computed(() => {
  const js = !isNaN(store.form.rs9) && store.form.rs9 !== '' ? parseInt(store.form.rs9) : 0
  const jp = !isNaN(store.form.rs10) && store.form.rs10 !== '' ? parseInt(store.form.rs10) : 0
  const anastesi = !isNaN(store.form.rs11) && store.form.rs11 !== '' ? parseInt(store.form.rs11) : 0
  return js + jp + anastesi
})
const presidential = computed(() => {
  const js = !isNaN(store.form.ssp) && store.form.ssp !== '' ? parseInt(store.form.ssp) : 0
  const jp = !isNaN(store.form.psp) && store.form.psp !== '' ? parseInt(store.form.psp) : 0
  const anastesi = !isNaN(store.form.asp) && store.form.asp !== '' ? parseInt(store.form.asp) : 0
  return js + jp + anastesi
})
const poli = computed(() => {
  const js = !isNaN(store.form.rs12) && store.form.rs12 !== '' ? parseInt(store.form.rs12) : 0
  const jp = !isNaN(store.form.rs13) && store.form.rs13 !== '' ? parseInt(store.form.rs13) : 0
  return js + jp
})
// set tarif end
// simpan
const onSubmit = () => {
  console.log('simpan', store.form)
  store.saveForm()
}
const onReset = () => {
  store.setOpen()
  // myDialog(coba, 'anu coab')
}
</script>
<style lang="scss" scoped>
.lebar {
  max-width: 80vw;
  width: 60vw;
}
</style>
