<template>
  <div class="fit column">
    <div class="col full-height ">
      <q-card flat bordered square class="full-height " style="overflow: hidden;">
        <q-form ref="refForm" @submit="onSubmit" class="column full-height">
          <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
            <div class="row items-center justify-between">
              <div class="f-12 text-weight-bold">
                Visum
              </div>
              <div>
                <q-btn flat dense size="md" icon="icon-mat-history" @click="historyOpen">
                  <q-tooltip class="bg-dark text-white">
                    {{ tooltip }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="col full-height scroll">
            <div class="col-12 q-mb-sm">
              <q-select v-model="store.form.jenisvisum" :options="visumoptions" label="Jenis Visum" outlined dense
                emit-value map-options option-label="label" option-value="value" />
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input v-model="store.form.tanggalvisum" label="Tanggal Visum" outlined dense readonly>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="store.form.tanggalvisum" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-6">
                <q-input v-model="store.form.jam" label="Jam" outlined dense readonly>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="store.form.jam" mask="HH:mm" format24h v-close-popup />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-6">
                <q-input v-model="store.form.permintaan" label="Permintaan" outlined dense />
              </div>
              <div class="col-6">
                <q-input v-model="store.form.dari" label="Dari" outlined dense />
              </div>
              <div class="col-6">
                <q-input v-model="store.form.tanggalsurat" label="Tanggal Surat" outlined dense readonly>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="store.form.tanggalvisum" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input v-model="store.form.nosurat" label="No. Surat" outlined dense />
              </div>
              <div class="col-6">
                <q-input v-model="store.form.bangsa" label="Bangsa" outlined dense />
              </div>
              <div class="col-6">
                <q-input v-model="store.form.umur" label="Umur" outlined dense />
              </div>
              <div class="col-6">
                <q-input v-model="store.form.pekerjaan" label="Pekerjaan" outlined dense />
              </div>
              <div class="col-6">
                <q-input v-model="store.form.Alamat" label="Alamat" outlined dense />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-right q-mt-md" style="margin-bottom: 50px;">
              <app-btn color="primary" label="Simpan" tooltip="Simpan" type="submit" tip :loading="store.loadingForm" />
            </div>

          </q-card-section>
        </q-form>
        <div style="margin-bottom: 100px;" />
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { useVisumStore } from 'src/stores/simrs/igd/visum';

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  tooltip: {
    type: String,
    default: 'History Pasien'
  }
})
const store = useVisumStore()
function onSubmit() {
  console.log('aaaa')
}

function historyOpen() {
  console.log('aaaa')
}

const visumoptions = [
  { label: 'Visum Penganiayaan', value: '1' },
  { label: 'Visum Pemerkosaan', value: '2' },
  { label: 'Visum Kematian', value: '3' }
]
</script>
