<template>
  <div class="bg-grey-2 q-pa-xs full-height">
    <div class="row full-width q-col-gutter-sm">
      <!-- Profiling Permintaan -->
      <div class="col-12 col-md-5">
        <q-card class="shadow-6 bg-white q-pa-none">
          <q-card-section class="bg-primary text-white full-width">
            <div class="row">
              <div class="col-auto">
                <q-avatar size="70px" class="q-mr-lg" color="white" text-color="primary" icon="icon-mat-person" />
              </div>
              <div class="col">
                <div>
                  <div class="text-h5 text-weight-bold">{{ form.nama || 'Nama Pasien' }}</div>
                  <div class="text-subtitle2">
                    No. RM: <span class="text-bold">{{ form.norm || '-' }}</span> &nbsp;|&nbsp;
                    No. Reg: <span class="text-bold">{{ form.noreg || '-' }}</span>
                  </div>
                  <div class="text-caption q-mt-xs">
                    Asal Permintaan: <span class="text-bold">{{ form.asal || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-md">
            <q-item>
              <q-item-section avatar>
                <q-icon name="icon-mat-dashboard" color="primary" size="md" />
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle1 text-weight-bold">Diagnosa Masalah</div>
                <div class="">{{ form.diagnosa || '-' }}</div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="icon-mat-info" color="primary" size="md" />
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle1 text-weight-bold">Catatan/Keterangan</div>
                <div class="">{{ form.catatan || '-' }}</div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="icon-mat-local_pharmacy" color="primary" size="md" />
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle1 text-weight-bold">Status Alergi</div>
                <div class="">{{ form.alergi }}</div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="icon-my-upper-torso-of-a-woman-svgrepo-com" color="primary" size="md" />
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle1 text-weight-bold">Status Kehamilan</div>
                <div class="">{{ form.kehamilan }}</div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="icon-mat-send" color="primary" size="md" />
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle1 text-weight-bold">Metode Penyampaian Hasil</div>
                <div class="">{{ form.metode || '-' }}</div>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <!-- List Permintaan Pemeriksaan -->
      <div class="col-12 col-md-7">
        <q-card class="shadow-6 bg-white">
          <div class="text-h6 text-white bg-primary q-pa-md flex items-center">
            <q-icon name="icon-mat-assignment" class="q-mr-sm" />
            Daftar Permintaan Pemeriksaan
          </div>
          <q-list bordered>


            <template v-for="item in pemeriksaanOptions" :key="item">
              <q-expansion-item group="somegroup" icon="icon-mat-app_registration" :label="item?.value"
                header-class="text-teal f-18 text-weight-bold">
                <q-card>
                  <q-separator />
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
                    commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
                    eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-separator />
            </template>


          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const asalOptions = [
  'Ruangan',
  'Poli'
]

const metodeOptions = [
  'Penyerahan langsung (digital/cetak foto)',
  'Email',
  'WhatsApp'
]

const pemeriksaanOptions = [
  { label: 'ULTRASONOGRAFI (USG) ABDOMEN', value: 'USG_ABDOMEN' },
  { label: 'ULTRA SONO GRAFI (USG)', value: 'USG' }
]

const form = ref({
  noreg: '20240520-001',
  norm: 'RM-123456',
  nama: 'Budi Santoso',
  asal: 'Ruangan',
  diagnosa: 'KAD kolik renal, Hipertensi, Vertigo',
  catatan: 'Pasien datang dengan keluhan nyeri pinggang hebat.',
  metode: 'Penyerahan langsung (digital/cetak foto)',
  alergi: 'Tidak',
  kehamilan: 'Tidak',
  pemeriksaan: ['USG_ABDOMEN', 'USG']
})

// Data hasil per permintaan
const hasil = ref(form.value.pemeriksaan.map(() => ({
  hasil: '',
  kesimpulan: '',
  saved: false
})))

function getPemeriksaanLabel(val) {
  const found = pemeriksaanOptions.find(opt => opt.value === val)
  return found ? found.label : val
}

function onSubmitHasil(idx) {
  hasil.value[idx].saved = true
}
</script>

<style scoped></style>