<template>
  <q-dialog>
    <q-card class="lebar">
      <q-card-section>
        <div class="f-14 text-weight-bold">
          Form Tarif Visite dan Kamar
        </div>
        <div class="title-desc">
          Input data Tarif Visite dan Kamar
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-md-6 col-xs-12">
              <app-input v-model="store.form.rs1" label="Kode Tindakan" outlined valid :loading="store.loading"
                readonly />
            </div>
            <div class="col-md-6 col-xs-12">
              <app-input v-model="store.form.rs2" label="Nama Tindakan" outlined :loading="store.loading"
                :disable="store.loading || store.edit" :autofocus="!store.edit" />
            </div>
          </div>
          <!-- <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4">
              <q-select v-model="store.disp.ruangan" label="Ruangan" map-options emit-value outlined option-label="nama"
                option-value="kode" autocomplete="nama" :loading="store.loading" :options="store.ruangRanap" multiple
                @update:model-value="ruanganSelected" />
            </div>
            <div class="col-8">
              <span v-for="(kode, i) in store.disp.ruangan" :key="i">
                {{ cariRuangan(kode, i) }}
              </span>
            </div>
          </div> -->
          <!-- kelas 3 -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs6" valid label="JS Kelas 3" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs7" valid label="JP Kelas 3" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif Kelas 3</div>
              <div class="row ">{{ parseInt(store.form.rs6 ?? 0) + parseInt(store.form.rs7 ?? 0) }}</div>
            </div>
          </div>

          <!-- kelas 2 -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs8" valid label="JS Kelas 2" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs9" valid label="JP Kelas 2" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif Kelas 2</div>
              <div class="row ">{{ parseInt(store.form.rs8 ?? 0) + parseInt(store.form.rs9 ?? 0) }}</div>
            </div>
          </div>

          <!-- Kelas 1 -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs10" valid label="JS Kelas 1" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs11" valid label="JP Kelas 1" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif Kelas 1</div>
              <div class="row ">{{ parseInt(store.form.rs10 ?? 0) + parseInt(store.form.rs11 ?? 0) }}</div>
            </div>
          </div>

          <!-- Utama -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs12" valid label="JS Utama" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs13" valid label="JP Utama" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif Utama</div>
              <div class="row ">{{ parseInt(store.form.rs12 ?? 0) + parseInt(store.form.rs13 ?? 0) }}</div>
            </div>
          </div>

          <!-- VIP -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs14" valid label="JS VIP" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs15" valid label="JP VIP" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif VIP</div>
              <div class="row ">{{ parseInt(store.form.rs14 ?? 0) + parseInt(store.form.rs15 ?? 0) }}</div>
            </div>
          </div>

          <!-- VVIP -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs16" valid label="JS VVIP" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.rs17" valid label="JP VVIP" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif VVIP</div>
              <div class="row ">{{ parseInt(store.form.rs16 ?? 0) + parseInt(store.form.rs17 ?? 0) }}</div>
            </div>
          </div>

          <!-- HCU -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.hcus" valid label="JS HCU" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.hcup" valid label="JP HCU" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif HCU</div>
              <div class="row ">{{ parseInt(store.form.hcus ?? 0) + parseInt(store.form.hcup ?? 0) }}</div>
            </div>
          </div>

          <!-- ICU -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.icus" valid label="JS ICU" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.icup" valid label="JP ICU" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif ICU</div>
              <div class="row ">{{ parseInt(store.form.icus ?? 0) + parseInt(store.form.icup ?? 0) }}</div>
            </div>
          </div>

          <!-- ICCU -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.iccus" valid label="JS ICCU" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.iccup" valid label="JP ICCU" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif ICCU</div>
              <div class="row ">{{ parseInt(store.form.iccus ?? 0) + parseInt(store.form.iccup ?? 0) }}</div>
            </div>
          </div>

          <!-- NICU -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.nicus" valid label="JS NICU" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.nicup" valid label="JP NICU" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif NICU</div>
              <div class="row ">{{ parseInt(store.form.nicus ?? 0) + parseInt(store.form.nicup ?? 0) }}</div>
            </div>
          </div>

          <!-- Intermediate -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.ins" valid label="JS Intermediate" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.inp" valid label="JP Intermediate" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif Intermediate</div>
              <div class="row ">{{ parseInt(store.form.ins ?? 0) + parseInt(store.form.inp ?? 0) }}</div>
            </div>
          </div>

          <!-- ISO -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.isos" valid label="JS ISO" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.isop" valid label="JP ISO" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif ISO</div>
              <div class="row ">{{ parseInt(store.form.isos ?? 0) + parseInt(store.form.isop ?? 0) }}</div>
            </div>
          </div>

          <!-- presiden -->
          <div class="row q-col-gutter-md q-mb-sm items-center">
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.pss" valid label="JS Presidential" outlined :loading="store.loading"
                :disable="store.loading" :autofocus="store.edit" />
            </div>
            <div class="col-md-4 col-xs-12">
              <app-input v-model="store.form.psp" valid label="JP Presidential" outlined :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div class="col-md-4 col-xs-12 text-end">
              <div class="row f-8">Tarif Presidential</div>
              <div class="row ">{{ parseInt(store.form.pss ?? 0) + parseInt(store.form.psp ?? 0) }}</div>
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

import { useMasterVisiteDanKamarStore } from 'src/stores/simrs/master/tarif/visiteDanKamar'
const store = useMasterVisiteDanKamarStore()
function ruanganSelected (evt) {
  console.log('evt', evt)

}
function cariRuangan (val, i) {
  const ruangan = store.allRuangs.find(item => item.kode == val)
  if (!ruangan) console.log('val', val)
  return ruangan ? ruangan?.nama + (i == store.disp.ruangan.length - 1 ? '' : ', ') : ''
}
// set tarif start
function setJs3 (evt) {
  console.log('form js 3', evt, isNaN(evt), parseInt(evt))
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const jp = !isNaN(store.form.jp3) && store.form.jp3 !== '' ? parseInt(store.form.jp3) : 0
  const habispake = !isNaN(store.form.habispake3) && store.form.habispake3 !== '' ? parseInt(store.form.habispake3) : 0
  store.setForm('js3', val)
  store.setForm('tarif3', val + jp + habispake)
}
function setJp3 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.js3) && store.form.js3 !== '' ? parseInt(store.form.js3) : 0
  const habispake = !isNaN(store.form.habispake3) && store.form.habispake3 !== '' ? parseInt(store.form.habispake3) : 0
  store.setForm('jp3', val)
  store.setForm('tarif3', val + js + habispake)
}
function setHabispake3 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.js3) && store.form.js3 !== '' ? parseInt(store.form.js3) : 0
  const jp = !isNaN(store.form.jp3) && store.form.jp3 !== '' ? parseInt(store.form.jp3) : 0
  store.setForm('habispake3', val)
  store.setForm('tarif3', val + js + jp)
}
//
function setJs2 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const jp = !isNaN(store.form.jp2) && store.form.jp2 !== '' ? parseInt(store.form.jp2) : 0
  const habispake = !isNaN(store.form.habispake2) && store.form.habispake2 !== '' ? parseInt(store.form.habispake2) : 0
  store.setForm('js2', val)
  store.setForm('tarif2', val + jp + habispake)
}
function setJp2 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.js2) && store.form.js2 !== '' ? parseInt(store.form.js2) : 0
  const habispake = !isNaN(store.form.habispake2) && store.form.habispake2 !== '' ? parseInt(store.form.habispake2) : 0
  store.setForm('jp2', val)
  store.setForm('tarif2', val + js + habispake)
}
function setHabispake2 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.js2) && store.form.js2 !== '' ? parseInt(store.form.js2) : 0
  const jp = !isNaN(store.form.jp2) && store.form.jp2 !== '' ? parseInt(store.form.jp2) : 0
  store.setForm('habispake2', val)
  store.setForm('tarif2', val + js + jp)
}
//
function setJs1 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const jp = !isNaN(store.form.jp1) && store.form.jp1 !== '' ? parseInt(store.form.jp1) : 0
  const habispake = !isNaN(store.form.habispake1) && store.form.habispake1 !== '' ? parseInt(store.form.habispake1) : 0
  store.setForm('js1', val)
  store.setForm('tarif1', val + jp + habispake)
}
function setJp1 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.js1) && store.form.js1 !== '' ? parseInt(store.form.js1) : 0
  const habispake = !isNaN(store.form.habispake1) && store.form.habispake1 !== '' ? parseInt(store.form.habispake1) : 0
  store.setForm('jp1', val)
  store.setForm('tarif1', val + js + habispake)
}
function setHabispake1 (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.js1) && store.form.js1 !== '' ? parseInt(store.form.js1) : 0
  const jp = !isNaN(store.form.jp1) && store.form.jp1 !== '' ? parseInt(store.form.jp1) : 0
  store.setForm('habispake1', val)
  store.setForm('tarif1', val + js + jp)
}
//
function setJsUtama (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const jp = !isNaN(store.form.jputama) && store.form.jputama !== '' ? parseInt(store.form.jputama) : 0
  const habispake = !isNaN(store.form.habispakeutama) && store.form.habispakeutama !== '' ? parseInt(store.form.habispakeutama) : 0
  store.setForm('jsutama', val)
  store.setForm('tarifutama', val + jp + habispake)
}
function setJpUtama (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.jsutama) && store.form.jsutama !== '' ? parseInt(store.form.jsutama) : 0
  const habispake = !isNaN(store.form.habispakeutama) && store.form.habispakeutama !== '' ? parseInt(store.form.habispakeutama) : 0
  store.setForm('jputama', val)
  store.setForm('tarifutama', val + js + habispake)
}
function setHabispakeutama (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.jsutama) && store.form.jsutama !== '' ? parseInt(store.form.jsutama) : 0
  const jp = !isNaN(store.form.jputama) && store.form.jputama !== '' ? parseInt(store.form.jputama) : 0
  store.setForm('habispakeutama', val)
  store.setForm('tarifutama', val + js + jp)
}
//
function setJsVip (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const jp = !isNaN(store.form.jpvip) && store.form.jpvip !== '' ? parseInt(store.form.jpvip) : 0
  const habispake = !isNaN(store.form.habispakevip) && store.form.habispakevip !== '' ? parseInt(store.form.habispakevip) : 0
  store.setForm('jsvip', val)
  store.setForm('tarifvip', val + jp + habispake)
}
function setJpVip (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.jsvip) && store.form.jsvip !== '' ? parseInt(store.form.jsvip) : 0
  const habispake = !isNaN(store.form.habispakevip) && store.form.habispakevip !== '' ? parseInt(store.form.habispakevip) : 0
  store.setForm('jpvip', val)
  store.setForm('tarifvip', val + js + habispake)
}
function setHabispakevip (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.jsvip) && store.form.jsvip !== '' ? parseInt(store.form.jsvip) : 0
  const jp = !isNaN(store.form.jpvip) && store.form.jpvip !== '' ? parseInt(store.form.jpvip) : 0
  store.setForm('habispakevip', val)
  store.setForm('tarifvip', val + js + jp)
}
//
function setJsVvip (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const jp = !isNaN(store.form.jpvvip) && store.form.jpvvip !== '' ? parseInt(store.form.jpvvip) : 0
  const habispake = !isNaN(store.form.habispakevvip) && store.form.habispakevvip !== '' ? parseInt(store.form.habispakevvip) : 0
  store.setForm('jsvvip', val)
  store.setForm('tarifvvip', val + jp + habispake)
}
function setJpVvip (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.jsvvip) && store.form.jsvvip !== '' ? parseInt(store.form.jsvvip) : 0
  const habispake = !isNaN(store.form.habispakevvip) && store.form.habispakevvip !== '' ? parseInt(store.form.habispakevvip) : 0
  store.setForm('jpvvip', val)
  store.setForm('tarifvvip', val + js + habispake)
}
function setHabispakevvip (evt) {
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  const js = !isNaN(store.form.jsvvip) && store.form.jsvvip !== '' ? parseInt(store.form.jsvvip) : 0
  const jp = !isNaN(store.form.jpvvip) && store.form.jpvvip !== '' ? parseInt(store.form.jpvvip) : 0
  store.setForm('habispakevvip', val)
  store.setForm('tarifvvip', val + js + jp)
}
function SetPresidential (evt, jenis) {
  console.log('pres', evt, jenis)
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('js_presidential', val)
  if (jenis === 'jp') store.setForm('jp_presidential', val)
  if (jenis === 'habispake') store.setForm('habispake_presidential', val)
  const js = !isNaN(store.form.js_presidential) && store.form.js_presidential !== '' ? parseInt(store.form.js_presidential) : 0
  const jp = !isNaN(store.form.jp_presidential) && store.form.jp_presidential !== '' ? parseInt(store.form.jp_presidential) : 0
  const habispake = !isNaN(store.form.habispake_presidential) && store.form.habispake_presidential !== '' ? parseInt(store.form.habispake_presidential) : 0

  store.setForm('tarif_presidential', js + jp + habispake)
}
function SetHcu (evt, jenis) {
  console.log('pres', evt, jenis)
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('js_hcu', val)
  if (jenis === 'jp') store.setForm('jp_hcu', val)
  if (jenis === 'habispake') store.setForm('habispake_hcu', val)
  const js = !isNaN(store.form.js_hcu) && store.form.js_hcu !== '' ? parseInt(store.form.js_hcu) : 0
  const jp = !isNaN(store.form.jp_hcu) && store.form.jp_hcu !== '' ? parseInt(store.form.jp_hcu) : 0
  const habispake = !isNaN(store.form.habispake_hcu) && store.form.habispake_hcu !== '' ? parseInt(store.form.habispake_hcu) : 0

  store.setForm('tarif_hcu', js + jp + habispake)
}
function SetHomeCare (evt, jenis) {
  console.log('pres', evt, jenis)
  const val = !isNaN(evt) && evt !== '' ? parseInt(evt) : 0
  if (jenis === 'js') store.setForm('js_hc', val)
  if (jenis === 'jp') store.setForm('jp_hc', val)
  if (jenis === 'habispake') store.setForm('habispake_hc', val)
  const js = !isNaN(store.form.js_hc) && store.form.js_hc !== '' ? parseInt(store.form.js_hc) : 0
  const jp = !isNaN(store.form.jp_hc) && store.form.jp_hc !== '' ? parseInt(store.form.jp_hc) : 0
  const habispake = !isNaN(store.form.habispake_hc) && store.form.habispake_hc !== '' ? parseInt(store.form.habispake_hc) : 0

  store.setForm('tarif_hc', js + jp + habispake)
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
