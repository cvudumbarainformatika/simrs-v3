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
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs1" label="Kode Tarif" outlined valid :loading="store.loading" readonly />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs2" label="Nama Tarif" outlined :loading="store.loading"
                :disable="store.loading || store.edit" :autofocus="!store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-autocomplete v-model="store.form.rs3" valid label="Tipe" :loading="store.loading"
                :disable="store.loading" :source="store.types" outlined />
            </div>
          </div>

          <!-- non Privat -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs4" valid label="JS Tarif Non Privat" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'rs4')" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs5" valid label="JP Tarif Non Privat" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs5')" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="tarif2" valid label="Tarif Non Privat" outlined :loading="store.loading" readonly />
            </div>
          </div>

          <!-- Privat -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs6" valid label="JS Tarif Privat" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'rs6')" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs7" valid label="JP Tarif Privat" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'rs7')" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="tarif1" valid label="Tarif Privat" outlined :loading="store.loading" readonly />
            </div>
          </div>


          <!-- presidential -->
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.pss" valid label="JS Tarif Presidential" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif($event, 'pss')" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.psp" valid label="JP Tarif Presidential" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif($event, 'psp')" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="presidential" valid label="Tarif 2" outlined :loading="store.loading" readonly />
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
import { useMasterTarifRadiologiStore } from 'src/stores/simrs/master/tarif/radiologi'
import { computed } from 'vue'
const store = useMasterTarifRadiologiStore()
function SetTarif (evt, jenis) {
  // console.log('pres', evt, jenis)
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  store.setForm(jenis, val)
}
const tarif1 = computed(() => {
  const js = !isNaN(store.form.rs6) && store.form.rs6 !== '' ? parseInt(store.form.rs6) : 0
  const jp = !isNaN(store.form.rs7) && store.form.rs7 !== '' ? parseInt(store.form.rs7) : 0
  return js + jp
})
const tarif2 = computed(() => {
  const js = !isNaN(store.form.rs4) && store.form.rs4 !== '' ? parseInt(store.form.rs4) : 0
  const jp = !isNaN(store.form.rs5) && store.form.rs5 !== '' ? parseInt(store.form.rs5) : 0
  return js + jp
})
const presidential = computed(() => {
  const js = !isNaN(store.form.pss) && store.form.pss !== '' ? parseInt(store.form.pss) : 0
  const jp = !isNaN(store.form.psp) && store.form.psp !== '' ? parseInt(store.form.psp) : 0
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
