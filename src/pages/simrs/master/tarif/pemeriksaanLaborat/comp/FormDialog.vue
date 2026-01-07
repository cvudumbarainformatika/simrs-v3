<template>
  <q-dialog>
    <q-card class="lebar">
      <q-card-section>
        <div class="f-14 text-weight-bold">
          Form Tindakan
        </div>
        <div class="title-desc">
          Input data Tindakan
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-6 col-xs-12">
              <app-input v-model="store.form.kode" label="Kode Pemeriksaan" outlined valid :loading="store.loading"
                readonly />
            </div>
            <div class="col-md-6 col-xs-12">
              <app-input v-model="store.form.nama" label="Nama Pemeriksaan" outlined :loading="store.loading"
                :disable="store.loading || store.edit" :autofocus="!store.edit" />
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-6 col-xs-12">
              <app-autocomplete v-model="store.form.kelompok" valid label="Paket Pemeriksaan" :loading="store.loading"
                :disable="store.loading" :source="store.kelompoks" outlined />
            </div>
            <div class="col-md-6 col-xs-12">
              <app-autocomplete v-model="store.form.jenislab" valid label="Jenis Lab" :loading="store.loading"
                :disable="store.loading" :source="store.jenises" outlined />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hs1" valid label="JS Tarif 1" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif1($event, 'js')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hp1" valid label="JP Tarif 1" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif1($event, 'jp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.tf1" valid label="Tarif 1" outlined :loading="store.loading" readonly />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hs2" valid label="JS Tarif 2" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetTarif2($event, 'js')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hp2" valid label="JP Tarif 2" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetTarif2($event, 'jp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.tf2" valid label="Tarif 2" outlined :loading="store.loading" readonly />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.pss" valid label="JS Presedential" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetPresidential($event, 'js')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.psp" valid label="JP Presedential" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetPresidential($event, 'jp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.tfps" valid label="Tarif Kelas Presedential" outlined
                :loading="store.loading" readonly />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hcus" valid label="JS HCU" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetHcu($event, 'js')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hcup" valid label="JP HCU" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetHcu($event, 'jp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.tfhcu" valid label="Tarif Kelas HCU" outlined :loading="store.loading"
                readonly />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hcs" valid label="JS Home Care" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" @update:model-value="SetHomeCare($event, 'js')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.hcp" valid label="JP Home Care" outlined :loading="store.loading"
                :disable="store.loading" @update:model-value="SetHomeCare($event, 'jp')" />
            </div>
            <div class="col-md-3 col-xs-12">
              <app-input v-model="store.form.tfhc" valid label="Tarif Kelas Home Care" outlined :loading="store.loading"
                readonly />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <app-input-date-human :model="store.disp.tgl_mulai_berlaku" class="col-12" valid
              label="Tanggal Mulai Berlaku" @dbModel="store.setTglMulaiBerlaku" :loading="store.loading" outlined
              :disable="store.loading" />
          </div>
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
import { useMasterTarifLaboratoriumStore } from 'src/stores/simrs/master/tarif/laboratorium'
const store = useMasterTarifLaboratoriumStore()
// set tarif start

function SetTarif1 (evt, jenis) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('hs1', val)
  if (jenis === 'jp') store.setForm('hp1', val)
  const js = !isNaN(store.form.hs1) && store.form.hs1 !== '' ? parseInt(store.form.hs1) : 0
  const jp = !isNaN(store.form.hp1) && store.form.hp1 !== '' ? parseInt(store.form.hp1) : 0

  store.setForm('tf1', js + jp)
}
function SetTarif2 (evt, jenis) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('hs2', val)
  if (jenis === 'jp') store.setForm('hp2', val)
  const js = !isNaN(store.form.hs2) && store.form.hs2 !== '' ? parseInt(store.form.hs2) : 0
  const jp = !isNaN(store.form.hp2) && store.form.hp2 !== '' ? parseInt(store.form.hp2) : 0

  store.setForm('tf2', js + jp)
}
function SetPresidential (evt, jenis) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('pss', val)
  if (jenis === 'jp') store.setForm('psp', val)
  const js = !isNaN(store.form.pss) && store.form.pss !== '' ? parseInt(store.form.pss) : 0
  const jp = !isNaN(store.form.psp) && store.form.psp !== '' ? parseInt(store.form.psp) : 0

  store.setForm('tfps', js + jp)
}
function SetHcu (evt, jenis) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('hcus', val)
  if (jenis === 'jp') store.setForm('hcup', val)
  const js = !isNaN(store.form.hcus) && store.form.hcus !== '' ? parseInt(store.form.hcus) : 0
  const jp = !isNaN(store.form.hcup) && store.form.hcup !== '' ? parseInt(store.form.hcup) : 0

  store.setForm('tfhcu', js + jp)
}
function SetHomeCare (evt, jenis) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('hcs', val)
  if (jenis === 'jp') store.setForm('hcp', val)
  const js = !isNaN(store.form.hcs) && store.form.hcs !== '' ? parseInt(store.form.hcs) : 0
  const jp = !isNaN(store.form.hcp) && store.form.hcp !== '' ? parseInt(store.form.hcp) : 0

  store.setForm('tfhc', js + jp)
}
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
