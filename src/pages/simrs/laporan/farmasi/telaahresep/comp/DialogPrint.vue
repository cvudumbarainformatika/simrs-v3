<template>
  <q-dialog persistent maximized transition-show="slide-left" transition-hide="fade" @before-show="show()"
    @before-hide="emits('hide')">
    <q-card flat class="fit" style="overflow: hidden;">
      <div class="fit column">
        <q-bar class="col-auto bg-primary text-white q-py-sm">
          <div class="f-12">
            Print Rincian Laporan Telaah Resep
          </div>
          <q-space />
          <div class="col-auto q-mr-md">
            <div class="row items-center">
              <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                <q-tooltip class="primary" :offset="[10, 10]">
                  Print
                </q-tooltip>
              </q-btn>
            </div>
          </div>
          <q-btn v-close-popup dense flat icon="icon-mat-close" @click="emits('close')">
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>
        <div class="col fit column  q-px-lg q-pt-lg " id="printMe">
          <div class="col full-height scroll">
            <div class="row items-center garis-bawah">
              <div class="col-2">
                <q-img src="~assets/images/logo-kota-grey.png" spinner-color="white"
                  style="height: 3.56cm; max-width: 2.86cm" />
              </div>
              <div class="col-8">
                <div class="row justify-center f-18">
                  PEMERINTAH KOTA PROBOLINGGO
                </div>
                <div class="row justify-center f-12 text-weight-bold">
                  DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
                </div>
                <div class="row justify-center f-20 text-weight-bold">
                  UOBK RSUD DOKTER MOHAMAD SALEH
                </div>
                <div class="row justify-center f-14">
                  Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702
                </div>
                <div class="row justify-center f-14">
                  E-mail : rsudprob@probolinggokota.go.id
                </div>
                <div class="row justify-center f-14 text-weight-bold">
                  PROBOLINGGO 67219
                </div>
              </div>
              <div class="col-2">
                <q-img src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 3cm; max-width: 3cm" />
              </div>
            </div>
            <div class="row justify-center f-16 text-weight-bold q-my-sm">
              Laporan Telaah Resep
            </div>
            <div class="row justify-center f-16 text-weight-bold q-my-sm">
              Periode {{ date.formatDate(store.dataToPrint?.created_at, 'MMMM YYYY') }}
            </div>
            <div class="row items-center justify-bentween q-col-gutter-x-xs">
              <div class="col-6">
                <div class="row">
                  <div class="col-6">Nomor Resep</div>
                  <div class="col-4">{{ store.dataToPrint?.noresep }}</div>
                </div>
                <div v-if="store.dataToPrint?.resep?.poli" class="row">
                  <div class="col-6">Poli</div>
                  <div class="col-4">{{ store.dataToPrint?.resep?.poli?.rs2 }}</div>
                </div>
                <div v-if="store.dataToPrint?.resep?.ruanganranap" class="row">
                  <div class="col-6">Ruangan</div>
                  <div class="col-4">{{ store.dataToPrint?.resep?.ruanganranap?.rs2 }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Dokter</div>
                  <div class="col-4">{{ store.dataToPrint?.resep?.ketdokter?.nama }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Tanggal Permintaan Resep</div>
                  <div class="col-4">{{ date.formatDate(store.dataToPrint?.resep?.tgl_permintaan,
                    'DD MMMM YYYY HH:mm:ss') }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Tanggal Kirim Resep</div>
                  <div class="col-4">{{ date.formatDate(store.dataToPrint?.resep?.tgl_kirim,
                    'DD MMMM YYYY HH:mm:ss') }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Tanggal Resep Diterima</div>
                  <div class="col-4">{{ date.formatDate(store.dataToPrint?.resep?.tgl_diterima,
                    'DD MMMM YYYY HH:mm:ss') }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Tanggal Resep Selesai</div>
                  <div class="col-4">{{ date.formatDate(store.dataToPrint?.resep?.tgl_selesai,
                    'DD MMMM YYYY HH:mm:ss') }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-6">Nama Pasien</div>
                  <div class="col-4">{{ store.dataToPrint?.pasien?.rs2 }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Nomor RM</div>
                  <div class="col-4">{{ store.dataToPrint?.pasien?.rs1 }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Tanggal Lahir</div>
                  <div class="col-4">{{ date.formatDate(store.dataToPrint?.pasien?.rs16,
                    'DD MMMM YYYY') }}</div>
                </div>
                <div class="row">
                  <div class="col-6">Usie</div>
                  <div class="col-4">{{ store.dataToPrint?.pasien?.usia }}</div>
                </div>
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row q-my-md text-weight-bold justify-center f-16">Quistionare</div>
            <q-separator class="q-my-md" />
            <div class="q-pa-sm">
              <div class="row text-weight-bold f-14"> Aspek Administratif</div>
              <div class="row q-ml-sm" v-for="(admin, a) in store.dataToPrint?.administrasi" :key="a">
                <div class="col-auto text-left" style="width: 5%;">
                  {{ a + 1 }}.
                </div>
                <div class="col-6 text-left">
                  {{ admin.question }}
                </div>
                <div class="col-3 text-left">
                  <q-option-group v-model="admin.value" :options="options" color="green" dense inline />
                </div>
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row text-left q-my-sm items-end">
              <span class="f-14 text-weight-bold">Aspek Farmasetik</span>
            </div>
            <div class="row q-ml-sm" v-for="(komp, k) in store.dataToPrint?.komponen_resep" :key="k">
              <div class="col-auto text-left" style="width: 5%;">
                {{ k + 1 }}.
              </div>
              <div class="col-6 text-left">
                {{ komp.question }}
              </div>
              <div class="col-3 text-left">
                <q-option-group v-model="komp.value" :options="options" color="green" dense inline />
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row text-left q-my-sm items-end">
              <span class="f-14 text-weight-bold">Aspek Klinis</span>
            </div>
            <div class="row q-ml-sm" v-for="(farm, fa) in store.dataToPrint?.farmasi_klinis" :key="fa">
              <div class="col-auto text-left" style="width: 5%;">
                {{ fa + 1 }}.
              </div>
              <div class="col-6 text-left">
                {{ farm.question }}
              </div>
              <div class="col-3 text-left">
                <q-option-group v-model="farm.value" :options="tOptions" color="green" dense inline />
              </div>
            </div>
            <!-- tt -->
            <div class="q-mt-md" ref="refTt">
              <div class="q-my-md">
                <div class="row q-mb-md">
                  <div class="col-4" />
                  <div class="col-4" />
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ pojokKananAtas }}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kiriAtasSatu }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ tengahAtasSatu }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kananAtasSatu }}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kiriAtasDua }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ tengahAtasDua }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kananAtasDua }}
                    </div>
                  </div>
                </div>
                <div class="row q-mt-xl text-weight-bold">
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kiriBawahSatu }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ tengahBawahSatu }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kananBawahSatu }}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kiriBawahDua }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ tengahBawahDua }}
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      {{ kananBawahDua }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="q-my-md print-hide">
                <div class="row ">
                  <div class="col-4" />
                  <div class="col-4" />
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="pojokKananAtas" label="tanggal" valid outlined />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kiriAtasSatu" label="kiri atas satu" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="tengahAtasSatu" label="tengah atas satu" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kananAtasSatu" label="kanan atas satu" valid outlined />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kiriAtasDua" label="kiri atas dua" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="tengahAtasDua" label="tengah atas dua" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kananAtasDua" label="kanan atas dua" valid outlined />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kiriBawahSatu" label="kiri bawah satu" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="tengahBawahSatu" label="tengah bawah satu" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kananBawahSatu" label="kanan bawah satu" valid outlined />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kiriBawahDua" label="kiri bawah dua" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="tengahBawahDua" label="tengah bawah dua" valid outlined />
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center f-11">
                      <app-input v-model="kananBawahDua" label="kanan bawah dua" valid outlined />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { date } from 'quasar'
import { useLaporanTelaahResepObatStore } from 'src/stores/simrs/laporan/farmasi/telaah/telaah'
import { ref } from 'vue'

const emits = defineEmits(['close', 'show', 'hide'])

const store = useLaporanTelaahResepObatStore()

function depo () {
  if (store.params.kode_ruang == 'all') {
    return 'Semua Depo Rumah Sakit'
  }
  else {
    const depo = store.gudangs.find(a => a.value === store.params.kode_ruang)
    return depo ? depo?.nama : 'Depo tidak ditemukan'
  }
}

const options = ref([
  { value: 'Sesuai', label: 'Sesuai' },
  { value: 'Tidak sesuai', label: 'Tidak sesuai' }
])
const tOptions = ref([
  { value: true, label: 'Ya' },
  { value: false, label: 'Tidak' }
])

function show () {
  emits('show')
  console.log('show', store.dataToPrint)
  kiriBawahSatu.value = store.dataToPrint?.petugas?.nama
  kiriBawahDua.value = !!store.dataToPrint?.petugas?.nip ? store.dataToPrint?.petugas?.nip : store.dataToPrint?.petugas?.nik
}
// text tanda tangan start

const kiriAtasSatu = ref('Penelaah Resep')
const kiriAtasDua = ref('')
const kiriBawahSatu = ref('')
const kiriBawahDua = ref('')

const tengahAtasSatu = ref('Penanggung Jawab')
const tengahAtasDua = ref('')
const tengahBawahSatu = ref('')
const tengahBawahDua = ref('')

const kananAtasSatu = ref('Mengetahui')
const kananAtasDua = ref('Kepala Instalasi Farmasi')
const kananBawahSatu = ref('')
const kananBawahDua = ref('')

const pojokKananAtas = ref('Probolinggo, ' + date.formatDate(Date.now(), 'DD MMMM YYYY'))

// text tanda tangan end
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Persediaan Farmasi'

}
</script>
