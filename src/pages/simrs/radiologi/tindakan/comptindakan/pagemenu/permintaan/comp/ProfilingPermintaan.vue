<template>
  <q-card flat class="bg-white q-pa-none">
    <q-card-section class="f-14">
      <div class="row q-col-gutter-y-md">
        <div class="col-12">
          <div class="text-subtitle1 text-primary text-weight-bold q-mb-sm">
            <span class="text-h5">🧍</span> Data Pasien
          </div>

          <q-separator class="q-my-sm" />
          <q-list dense>
            <q-item>
              <q-item-section>

                <div class="row">
                  <div class="col-4">NAMA</div>
                  <div class="col-8">
                    <div class="row">
                      <div class="col-auto" style="min-width:5px"> : </div>
                      <div class="col">{{ pasien?.nama_panggil }}</div>

                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">NOREG | NORM</div>
                  <div class="col-8">: {{ pasien?.noreg }} | {{ pasien?.norm }}</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">NIK</div>
                  <div class="col-8">: {{ pasien?.noktp }} </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">Kelamin / Usia</div>
                  <div class="col-8">: {{ pasien?.usia }} ({{ pasien?.kelamin }})</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">TTL</div>
                  <div class="col-8">: {{ pasien?.templahir }}, {{ formatDate(pasien?.tgllahir) }}</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">Alamat</div>
                  <div class="col-8">
                    <div class="row">
                      <div class="col-auto" style="min-width:5px"> : </div>
                      <div class="col">{{ pasien?.alamat }}</div>

                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Informasi Kunjungan -->
        <div class="col-12">
          <div class="text-subtitle1 text-primary text-weight-bold q-mb-sm">
            <span class="text-h5">ℹ️ </span> Informasi Kunjungan
          </div>
          <q-separator class="q-my-sm" />
          <q-list dense>
            <q-item>
              <q-item-section>

                <div class="row">
                  <div class="col-4">DPJP</div>
                  <div class="col-8">
                    <div class="row">
                      <div class="col-auto" style="min-width:5px"> : </div>
                      <div class="col">{{ pasien?.dokter }}</div>

                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">Ruangan</div>
                  <div class="col-8">: {{ pasien?.ruangan }}</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">Tgl Kunjungan</div>
                  <div class="col-8">: {{ formatDateTime(pasien?.tgl_kunjungan) }}</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-4">Sistem Bayar</div>
                  <div class="col-8">: {{ pasien?.sistembayar }}</div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date } from 'quasar'

defineProps({
  pasien: {
    type: Object,
    default: null
  }
})



function formatDate(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY HH:mm')
}
</script>