<template>
  <div class="q-mb-xl bg-white">
    <div class="row">
      <div class="col-2 ">
        <div class="row">
          <div class="col-12 q-pa-xs bg-grey-4">
            <app-avatar-pasien
              :key="pasien"
              :pasien="pasien"
              width="50px"
            />
            <div class="text-weight-bold f-12 q-mt-sm">
              {{ pasien ? pasien.nama : '-' }}
            </div>
            <div class="text-teal">
              {{ pasien?.norm??'-' }}
            </div>
            <div class="text-teal">
              {{ pasien ? pasien.noreg : '-' }}
            </div>
            <div class="text-purple text-weight-bold">
              {{ pasien?.poli??'-' }}
            </div>
            <div class="text-green ">
              {{ dateFullFormat(pasien?.tgl_kunjungan)??'-' }}
            </div>
            <div class="text-orange text-weight-bold">
              {{ pasien?.dokter??'-' }}
            </div>
            <!-- <div> {{ pasien?.kodesistembayar?? '-' }}</div> -->
          </div>
        </div>
        <div class="row no-wrap bg-primary text-white q-pa-xs items-center">
          <div class="f-12 text-weight-bold">
            Pilih
          </div>
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="karcis"
            label="Karcis"
            @update:model-value="gantiDataNota"
          />
        </div>
        <!-- <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="konsulantarpoli"
            label="Konsul Antar Poli"
            @update:model-value="gantiDataNota"
          />
        </div> -->
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="tindakan"
            label="Tindakan"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="laborat"
            label="Laboratorium"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="radiologi"
            label="Radiologi"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="farmasi"
            label="Farmasi"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="operasibesar"
            label="Operasi (Tindakan Besar)"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="operasikecil"
            label="Operasi (Tindakan Kecil)"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs">
          <q-radio
            v-model="store.golongan"
            dense
            checked-icon="icon-mat-task_alt"
            unchecked-icon="icon-mat-panorama_fish_eye"
            val="sharing bpjs"
            label="Sharing BPJS"
            @update:model-value="gantiDataNota"
          />
        </div>
        <div class="row no-wrap q-ma-xs q-mt-md">
          <q-btn
            class="col-12"
            dense
            size="12px"
            label="Cetak Rekap Billing"
            color="primary"
            no-caps
            push
            @click="cetakFakturRekap(pasien)"
          >
            <q-tooltip
              class="primary"
              :offset="[10, 10]"
            >
              Cetak Faktur Rekap
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="col-10">
        <div class="row no-wrap">
          <div class="col-12">
            <div class="row no-wrap bg-primary text-white q-py-sm">
              <div class="f-12 text-weight-bold q-px-sm">
                Pembayaran
              </div>
            </div>
          </div>
        </div>
        <div class="row no-wrap q-pt-sm">
          <div class="col-12">
            <!-- belum dibayar -->
            <div class="">
              <!-- header default-->
              <div
                v-if="store.golongan===''"
                class="row no-wrap q-col-gutter-xs bg-grey-10 q-pa-xs f-12 text-weight-bold text-white"
              >
                <div class="col-3">
                  <div class="row no-wrap">
                    <div class="col-2">
                      No
                    </div>
                    <div class="col-10">
                      No Kwitansi
                    </div>
                  </div>
                </div>
                <div class="col-2">
                  Pembayaran
                </div>
                <div class="col-2">
                  Tanggal
                </div>
                <div class="col-3">
                  <div class="row no-wrap">
                    <div class="col-6 text-right">
                      Jumlah
                    </div>
                    <div class="col-6 text-right">
                      Batal
                    </div>
                  </div>
                </div>
                <div class="col-2 text-center">
                  #
                </div>
              </div>
              <!-- header karcis -->
              <div
                v-if="store.golongan==='karcis'"
                class="row no-wrap q-col-gutter-xs bg-grey-10 q-pa-xs f-12 text-weight-bold text-white"
              >
                <div class="col-1">
                  No
                </div>
                <div class="col-3">
                  Nama Layanan
                </div>
                <div class="col-6">
                  <div class="row no-wrap">
                    <div class="col-6 text-right">
                      Jumlah
                    </div>
                    <div class="col-6 text-right">
                      Batal
                    </div>
                  </div>
                </div>
                <!-- <div class="col-2 text-center">
                        #
                      </div> -->
              </div>
              <!-- bukan karcis -->
              <div
                v-if="store.golongan!=='karcis'"
                class=""
              >
                <div class="row no-wrap q-my-sm">
                  <div class="col-6">
                    <app-autocomplete
                      v-model="nota"
                      label="pilih Nota"
                      autocomplete="nota"
                      option-label="nota"
                      option-value="nota"
                      outlined
                      valid
                      autofocus
                      :source="dataNotas"
                      @selected="notaDipilih"
                    />
                  </div>
                </div>
                <div class="row no-wrap q-col-gutter-xs bg-grey-10 q-pa-xs f-12 text-weight-bold text-white">
                  <div class="col-1">
                    No
                  </div>
                  <div class="col-3">
                    Nama Layanan
                  </div>
                  <div class="col-6">
                    <div class="row no-wrap">
                      <div class="col-6 text-right">
                        Jumlah
                      </div>
                      <div class="col-6 text-right">
                        Batal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="store.notas?.Pelayanan?.length && store?.notas?.flag===1">
                {{ store.notas }}

                <div class="q-ml-xs row no-wrap q-col-gutter-xs">
                  <div class="col-1 text-weight-bold" />
                  <div class="col-3 text-weight-bold">
                    {{ store.notas?.Pelayanan }}
                  </div>
                  <div class="col-6 text-right text-weight-bold">
                    Rp  {{ formatRp(store.notas.Subtotal) }}
                  </div>
                </div>
                <!-- button -->
                <div class="q-ml-sm row no-wrap items-center q-my-md">
                  <div class="q-mr-xs">
                    <app-btn
                      label="Batal"
                      color="grey-7"
                      push
                      dense
                      :loading="store.loading && carabayar==='batal'"
                      :disable="store.loading"
                      @click="batal"
                    />
                  </div>
                  <div class="q-mr-xs">
                    <app-btn
                      label="Cetak"
                      color="blue-grey-7"
                      push
                      dense
                      :loading="store.loading && carabayar==='cetak'"
                      :disable="store.loading"
                      @click="cetak"
                    />
                  </div>
                </div>
              </div>
              <div v-if="store.notas?.Pelayanan?.length && store?.notas?.flag===0">
                <!-- child -->
                <!-- {{ store.notas }} -->
                <div
                  v-for="(pel,i) in store.notas.Pelayanan"
                  :key="i"
                  class="q-ml-xs q-mt-xs items-center row no-wrap q-col-gutter-xs"
                >
                  <div class="col-1">
                    {{ i + 1 }}
                  </div>
                  <div class="col-3">
                    {{
                      pel.namatindakan ??
                        pel.keterangan ??
                        pel.tindakan
                    }}
                  </div>
                  <div class="col-6">
                    <div class="row no-wrap">
                      <div class="col-6 text-right">
                        Rp {{ pel.subtotal>0?formatRp(pel.subtotal):formatRp(pel.subtotalx) }}
                      </div>
                      <div class="col-6 text-right">
                        0
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bottom -->
                <div class="q-ml-xs row no-wrap q-col-gutter-xs">
                  <div class="col-1">
                    <!--  -->
                  </div>
                  <div class="col-3 text-right text-weight-bold">
                    Total
                  </div>
                  <div class="col-6">
                    <div class="row no-wrap">
                      <div class="col-6 text-right">
                        Rp  {{ formatRp(store.notas.Subtotal) }}
                      </div>
                      <div class="col-6 text-right">
                        Rp 0
                      </div>
                    </div>
                  </div>
                  <div class="col-2">
                    <!-- # -->
                  </div>
                </div>
                <!-- button -->
                <div class="q-ml-sm row no-wrap items-center q-my-md">
                  <div class="q-mr-xs">
                    <app-btn
                      label="Buat Qris"
                      color="blue"
                      push
                      dense
                      :loading="store.loading && carabayar==='qris'"
                      :disable="store.loading"
                      @click="buatQris"
                    />
                  </div>
                  <div class="q-mr-xs">
                    <app-btn
                      label="Bayar Tunai"
                      color="green"
                      push
                      dense
                      :loading="store.loading && carabayar==='tunai'"
                      :disable="store.loading"
                      @click="bayarTunai"
                    />
                  </div>
                  <div class="q-mr-xs">
                    <app-btn
                      label="Buat VA"
                      color="lime-7"
                      push
                      dense
                      :loading="store.loading && carabayar==='va'"
                      :disable="store.loading"
                      @click="buatVA"
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="!store.notas.Pelayanan && store.loading"
                class="q-mt-lg"
              >
                <div
                  class="flex column flex-center"
                >
                  <q-spinner-cube
                    color="primary"
                    size="3em"
                  />
                  <div>Harap Tunggu ...</div>
                </div>
              </div>
              <div v-if="!store.notas.Pelayanan && !store.loading">
                <app-no-data />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CetakRekapBilling
    v-model="printRekap"
    :pasien="pasien"
    @tutup="actPrintRekap"
  />
</template>
<script setup>
import { dateFullFormat, formatRp } from 'src/modules/formatter'
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan'
import CetakRekapBilling from './CetakRekapBilling.vue'
import { ref } from 'vue'
const prop = defineProps({
  pasien: { type: Object, default: () => {} }
})
const emits = defineEmits([
  'print',
  'rekap',
  'nota'
])

const printRekap = ref(false)
// const tab = ref('trans')
// function goTo(val) {
//   tab.value = val
// }
const store = useKasirRajalListKunjunganStore()

function cetakFakturRekap(val) {
  // nota.value = ' Tindakan'

  // emits('rekap', val)
  printRekap.value = true
  // console.log('cetak faktur', val)
}

function actPrintRekap() {
  printRekap.value = false
}
const dataNotas = ref([])
const nota = ref('')
function gantiDataNota(val) {
  if (val === 'karcis') {
    // console.log('karcis', prop.pasien)
    const param = {
      golongan: val,
      noreg: prop.pasien.noreg
    }
    emits('nota', param)
  } else {
    // console.log('pilihan lain', prop.pasien)
    store.notas = {}
    nota.value = ''
    if (val === 'tindakan') {
      if (prop.pasien.tindakan?.length) {
        const param = {
          golongan: val,
          noreg: prop.pasien.noreg,
          nota: prop.pasien.tindakan[0].nota
        }
        nota.value = prop.pasien.tindakan[0].nota
        dataNotas.value = prop.pasien.tindakan
        emits('nota', param)
      }
    }
    if (val === 'laborat') {
      if (prop.pasien.laborat?.length) {
        const param = {
          golongan: val,
          noreg: prop.pasien.noreg,
          nota: prop.pasien.laborat[0].nota
        }
        nota.value = prop.pasien.laborat[0].nota
        dataNotas.value = prop.pasien.laborat
        emits('nota', param)
      }
    }
    if (val === 'radiologi') {
      if (prop.pasien.transradiologi?.length) {
        const param = {
          golongan: val,
          noreg: prop.pasien.noreg,
          nota: prop.pasien.transradiologi[0].nota
        }
        nota.value = prop.pasien.transradiologi[0].nota
        dataNotas.value = prop.pasien.transradiologi
        emits('nota', param)
      }
    }
    if (val === 'operasibesar') {
      if (prop.pasien.kamaroperasi?.length) {
        const param = {
          golongan: val,
          noreg: prop.pasien.noreg,
          nota: prop.pasien.kamaroperasi[0].nota
        }
        nota.value = prop.pasien.kamaroperasi[0].nota
        dataNotas.value = prop.pasien.kamaroperasi
        emits('nota', param)
      }
    }
    if (val === 'operasikecil') {
      if (prop.pasien.tindakanoperasi?.length) {
        const param = {
          golongan: val,
          noreg: prop.pasien.noreg,
          nota: prop.pasien.tindakanoperasi[0].nota
        }
        nota.value = prop.pasien.tindakanoperasi[0].nota
        dataNotas.value = prop.pasien.tindakanoperasi
        emits('nota', param)
      }
    }
    if (val === 'farmasi') {
      const farmasi = []
      if (prop.pasien.apotekrajal?.length) {
        prop.pasien.apotekrajal.forEach(a => farmasi.push(a))
      }
      if (prop.pasien.apotekrajalpolilalu?.length) {
        prop.pasien.apotekrajalpolilalu.forEach(a => farmasi.push(a))
      }
      if (prop.pasien.apotekracikanrajal?.length) {
        prop.pasien.apotekracikanrajal.forEach(a => farmasi.push(a))
      }
      if (prop.pasien.apotekracikanrajallalu?.length) {
        prop.pasien.apotekracikanrajallalu.forEach(a => farmasi.push(a))
      }
      if (farmasi?.length) {
        const param = {
          golongan: val,
          noreg: prop.pasien.noreg,
          nota: farmasi[0].nota
        }
        nota.value = farmasi[0].nota
        dataNotas.value = farmasi
        emits('nota', param)
      }
    }
    if (val === 'sharingbpjs') {
      // dataNotas.value = prop.pasien.tindakan
    }
  }
}
function notaDipilih(val) {
  // console.log('dipilih val', val)
  nota.value = val
  const param = {
    golongan: store.golongan,
    noreg: prop.pasien.noreg,
    nota: val
  }
  // console.log('param', param)

  emits('nota', param)
}
const carabayar = ref('')
function kirimBayar() {
  let rinci = ''
  if (store.notas?.Pelayanan?.length) {
    // console.log('nota pelayanan')
    store.notas.Pelayanan.forEach(a => {
      const b = a.namatindakan + ':' + a.subtotal
      rinci += ',' + b
    })
    // console.log(rinci)
    const form = {
      noreg: prop.pasien.noreg,
      norm: prop.pasien.norm,
      tgl_kunjungan: prop.pasien.tgl_kunjungan,
      nama: prop.pasien.nama,
      sapaan: prop.pasien.sapaan,
      kelamin: prop.pasien.kelamin,
      poli: prop.pasien.poli,
      sistembayar: prop.pasien.sistembayar,
      total: store.notas.Subtotal,
      rinci,
      kodepoli: prop.pasien.kodepoli,
      groupssistembayar: prop.pasien.groupssistembayar,
      jenispembayaran: store.golongan,
      carabayar: carabayar.value
    }
    // console.log('form', form)
    store.savePembayaran(form).then(() => {
      emits('print', carabayar.value)
    })
  }
}
function bayar() {
  if (store.notas?.Pelayanan?.length) {
    // console.log('nota pelayanan')
    const form = {
      noreg: prop.pasien.noreg,
      norm: prop.pasien.norm,
      nama: prop.pasien.nama,
      poli: prop.pasien.poli,
      sistembayar: prop.pasien.sistembayar,
      // total: 100,
      total: store.notas.Subtotal,
      kodepoli: prop.pasien.kodepoli,
      groupssistembayar: prop.pasien.groupssistembayar,
      jenispembayaran: store.golongan,
      carabayar: carabayar.value,
      nota: nota.value
    }
    // console.log('form', form)
    store.savePembayaran(form).then(() => {
      emits('print', carabayar.value)
    })
  }
}
function buatQris() {
  // console.log('buat qris')
  carabayar.value = 'qris'
  if (store.golongan === 'karcis') {
    kirimBayar()
  } else { bayar() }
}
function bayarTunai() {
  carabayar.value = 'tunai'
  if (store.golongan === 'karcis') {
    kirimBayar()
  } else { bayar() }
  console.log('bayar tunai')
}
function buatVA() {
  // emits('print', 'qris')
  console.log('buat VA')
}
function batal() {
  console.log('buat VA')
}
function cetak() {
  carabayar.value = 'tunai'
  emits('print', carabayar.value)
  // console.log('cetak aja')
}

</script>
