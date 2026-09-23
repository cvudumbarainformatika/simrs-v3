<template>
  <q-form ref="myForm">
    <q-card-section>
      <div class="text-bold">
        PERSETUJUAN {{ menu?.title }}
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width">
        <div class="row q-col-gutter-sm full-width">
          <app-input-date
            :model="store.form.tanggal"
            label="Tanggal"
            icon="icon-mat-event"
            outlined
            @set-model="val => store.form.tanggal = val"
            :autofocus="true"
            class="col-4"
          />
          <app-autocomplete-new
            ref="refDokter"
            :model="store.form.kdDokter"
            label="Pelaksana Tindakan"
            autocomplete="nama"
            option-value="kdpegsimrs"
            option-label="nama"
            outlined
            :source="store.dokters"
            class="col-8"
            @on-select="(val) => {
              store.form.kdDokter = val
              store.form.pelaksana = store.dokters?.find(item => item.kdpegsimrs === val)?.nama
            }"
            @clear="() => {
              store.form.kdDokter = null
              store.form.pelaksana = null
            }"
          />
          <app-autocomplete-new
            ref="refPerawat"
            :model="store.form.kdPetugas"
            label="Pemberi Informasi"
            autocomplete="nama"
            option-value="kdpegsimrs"
            option-label="nama"
            outlined
            :source="store.perawats"
            class="col-6"
            @on-select="(val) => {
              store.form.kdPetugas = val
              store.form.pengedukasi = store.perawats?.find(item => item?.kdpegsimrs === val)?.nama
            }"
            @clear="() => {
              store.form.kdPetugas = null
              store.form.pengedukasi = null
            }"
          />

          <q-select
            label="Pilih Penerima Informasi / Pemberi Persetujuan"
            outlined
            standout="bg-yellow-3"
            dense
            class="col-6"
            :options="store.hubunganDgPasiens"
            v-model="store.form.hubunganDgPasien"
            @update:model-value="cekHubunganPasien"
          />
          <app-input-simrs
            v-if="store.form.hubunganDgPasien === 'Keluarga'"
            v-model="store.form.keluarga"
            label="Jelaskan Hubungan Keluarga dengan Pasien"
            class="col-12"
          />
          <app-input-simrs
            v-model="store.form.nama"
            label="Nama Penerima Informasi / Pemberi Persetujuan"
            class="col-8"
          />
          <div class="col-4">
            <q-radio
              class="q-ml-sm"
              size="md"
              v-model="store.form.lp"
              v-for="aa in store.jekels"
              :key="aa"
              :label="aa?.label"
              :val="aa?.value"
            />
          </div>
          <app-input-simrs v-model="store.form.noKtp" label="Nik/SIM/PASSPORT" class="col-4" />
          <app-input-date
            :model="store.form.tglLahir"
            label="Tanggal Lahir"
            icon="icon-mat-event"
            outlined
            @set-model="val => store.form.tglLahir = val"
            :autofocus="false"
            class="col-4"
          />
          <app-input-simrs v-model="store.form.telepon" label="No Telp / Hp" class="col-4" />
          <q-input
            v-model="store.form.alamat"
            label="Alamat"
            outlined
            standout="bg-yellow-3"
            rows="3"
            type="textarea"
            class="col-12"
          />

          <!-- 9 Poin Informasi Kedokteran Hemodialisis -->
          <div class="col-12 text-bold q-mt-md">
            Pemberian Informasi Tindakan Kedokteran Hemodialisis
          </div>

          <q-input
            v-model="store.form.dasarDiagnosis"
            label="1. Diagnosis (WD & DD)"
            outlined
            standout="bg-yellow-3"
            rows="2"
            type="textarea"
            class="col-12"
          />

          <q-input
            v-model="store.form.indikasi"
            label="2. Dasar Diagnosis"
            outlined
            standout="bg-yellow-3"
            rows="2"
            type="textarea"
            class="col-12"
          />

          <q-input
            v-model="store.form.tindakanMedis"
            label="3. Tindakan Kedokteran"
            outlined
            standout="bg-yellow-3"
            rows="1"
            class="col-12"
          />

          <q-input
            v-model="store.form.tujuanLain"
            label="4. Indikasi Tindakan"
            outlined
            standout="bg-yellow-3"
            rows="2"
            type="textarea"
            class="col-12"
          />

          <q-input
            v-model="store.form.tatacara"
            label="5. Tata Cara"
            outlined
            standout="bg-yellow-3"
            rows="3"
            type="textarea"
            class="col-12"
          />

          <q-input
            v-model="store.form.resikoLain"
            label="6. Tujuan"
            outlined
            standout="bg-yellow-3"
            rows="2"
            type="textarea"
            class="col-12"
          />

          <q-input
            v-model="store.form.komplikasi"
            label="7. Risiko / Komplikasi"
            outlined
            standout="bg-yellow-3"
            rows="3"
            type="textarea"
            class="col-12"
          />

          <q-input
            v-model="store.form.golonganDarah"
            label="8. Prognosis"
            outlined
            standout="bg-yellow-3"
            rows="1"
            class="col-12"
          />

          <q-input
            v-model="store.form.alternatif"
            label="9. Alternatif & Risiko"
            outlined
            standout="bg-yellow-3"
            rows="2"
            type="textarea"
            class="col-12"
          />

          <app-input-simrs
            v-model="store.form.saksiPasien"
            label="Nama Saksi Keluarga / Pasien"
            class="col-12 q-mt-sm"
          />

          <!-- Signature Section -->
          <div class="col-12">
            <q-separator class="q-my-md" />
            <div class="row q-col-gutter-sm">
              <div class="col-6" bordered style="min-height: 150px; border: 1px solid #ccc;">
                <div class="column full-height flex-center relative-position q-pa-sm">
                  <div>
                    <app-signature
                      :ttd="store.form.ttdYgMenyatakan"
                      :width="250"
                      :height="150"
                      label-ttd="TTD yg Menyatakan"
                      @save-ttd="(val) => store.form.ttdYgMenyatakan = val"
                      :pasien="pasien"
                      uuid="ttdYgMenyatakan"
                      @signature="(val) => { store.form.ttdYgMenyatakan = val }"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6" bordered style="min-height: 150px; border: 1px solid #ccc;">
                <div class="column full-height flex-center relative-position q-pa-sm">
                  <div>
                    <app-signature
                      :ttd="store.form.ttdSaksiPasien"
                      :width="250"
                      :height="150"
                      label-ttd="TTD Saksi Pasien"
                      @save-ttd="(val) => store.form.ttdSaksiPasien = val"
                      :pasien="pasien"
                      uuid="ttdSaksiPasien"
                      @signature="(val) => { store.form.ttdSaksiPasien = val }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        :loading="store.loadingForm"
        :disable="store.loadingForm"
        label="Simpan Inform Concern"
        type="button"
        color="primary"
        class="q-mb-xl"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { useConcernOperasiInvasifRanapStore } from 'src/stores/simrs/ranap/concernoperasiinvasif'
import { onMounted, ref } from 'vue'

const store = useConcernOperasiInvasifRanapStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})

const myForm = ref(null)

onMounted(() => {
  if (!store.form?.id) {
    store.initReset(props?.pasien, 'Hemodialisis')
  }
  cekHubunganPasien()
})

const cekHubunganPasien = () => {
  const pasien = props.pasien
  const val = store.form.hubunganDgPasien
  if (val === 'Diri Sendiri') {
    store.form.nama = pasien?.nama
    store.form.noKtp = pasien?.nktp
    store.form.tglLahir = pasien?.tgllahir
    store.form.alamat = pasien?.alamat
    store.form.telepon = pasien?.nohp
    const kel = pasien?.kelamin
    if (kel) {
      if (kel.toLowerCase() === 'l' || kel.toLowerCase().startsWith('laki')) {
        store.form.lp = 'Laki-Laki'
      } else if (kel.toLowerCase() === 'p' || kel.toLowerCase().startsWith('perempuan')) {
        store.form.lp = 'Perempuan'
      } else {
        store.form.lp = kel
      }
    } else {
      store.form.lp = null
    }
  } else {
    store.form.nama = null
    store.form.noKtp = null
    store.form.tglLahir = null
    store.form.alamat = null
    store.form.telepon = null
    store.form.lp = null
  }
}

function onSubmit() {
  store.saveData(props?.pasien, props?.menu?.name)
}
</script>
