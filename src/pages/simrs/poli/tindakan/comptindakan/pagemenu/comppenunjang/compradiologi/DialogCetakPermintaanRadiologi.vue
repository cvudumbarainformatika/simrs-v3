<template>
  <q-dialog persistent backdrop-filter="blur(4px)" @show="init">
    <q-card style="min-width:80vw; max-width: 80vw;">
      <q-bar class="bg-primary text-white">
        <div>Surat Pengantar Radiologi</div>

        <q-space />

        <q-btn dense flat icon="icon-mat-close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-separator />
      <div id="printMe" class="f-12">
        <q-card-section class="q-pa-none">
          <div class="full-width q-pa-md">
            <div class="headerx full-width relative-position">
              <img src="~assets/logos/logo-rsud.png" class="q-mb-xs" width="50">
              <div class="absolute-top full-width" style="left:0%">
                <div class="column full-width flex-center">
                  <div class="f-14 text-weight-bold">
                    SURAT PENGANTAR PERMINTAAN RADIOLOGI
                  </div>
                  <div class="f-14 text-weight-bold">
                    RSUD MOHAMAD SALEH
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator style="margin-top: -10px;" />
        <q-card-section class="q-pa-md row q-col-gutter-md">
          <div class="col-6">
            <div class="row q-col-gutter-md full-width">
              <div class="col-auto">
                <div>NO. NOTA</div>
                <div>TANGGAL</div>
                <div>NORM</div>
                <div>A / N</div>
                <div>Tgl Lahir</div>
                <div>USIA</div>
                <div>No. Telp</div>
                <div>Alamat</div>
              </div>
              <div class="col full-width">
                <div>{{ data?.rs2 || '-' }}</div>
                <div>{{ data?.rs3 || '-' }}</div>
                <div>{{ pasien?.norm || '-' }}</div>
                <div>{{ pasien?.nama_panggil }}</div>
                <div>{{ pasien?.tgllahir }}</div>
                <div>{{ pasien?.usia }}</div>
                <div>{{ pasien?.nohp }}</div>
                <div>{{ pasien?.alamat }}</div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row q-col-gutter-md full-width">
              <div class="col-auto">
                <div>ASAL</div>
                <div>NOREG</div>
                <div>Penjamin</div>
                <div>Catatan</div>
                <div>Diagnosa Kerja</div>

              </div>
              <div class="col full-width">
                <div>{{ pasien?.ruangan || pasien?.poli || '-' }}</div>
                <div>{{ pasien?.noreg }}</div>
                <div>{{ pasien?.sistembayar || '-' }}</div>
                <div>{{ data?.catatanpermintaan || '-' }}</div>
                <div>{{ data?.diagnosakerja || '-' }}</div>

              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-px-md row full-width justify-between">
          <div class="col-auto">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label class="f-12 text-weight-bold">
                    {{ data?.rs4 }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

        </q-card-section>
      </div>
      <q-card-section class="q-pa-none bg-primary text-white">
        <div class="q-pa-md row justify-between items-center">
          <div><q-btn label="Tutup" color="dark" text-color="white" v-close-popup /></div>
          <div>
            <q-btn v-print="printObj" label="Print" color="yellow-3" text-color="dark" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  data: {
    type: Object,
    default: null
  }
})

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'CETAK SEP',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}


function init() {
  console.log('init', props.pasien, props.data);

}

</script>