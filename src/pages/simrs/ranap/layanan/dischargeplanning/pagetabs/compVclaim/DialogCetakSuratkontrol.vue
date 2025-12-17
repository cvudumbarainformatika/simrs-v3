<template>
  <q-dialog persistent backdrop-filter="blur(4px)" @show="init">
    <q-card style="min-width:80vw; max-width: 80vw;">
      <q-bar class="bg-primary text-white">
        <div>Cetak Surat Kontrol</div>

        <q-space />

        <q-btn dense flat icon="icon-mat-close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-separator />
      <div id="printMe" class="f-12">
        <q-card-section class="q-pa-none full-width">
          <div class="flex full-width justify-between items-center q-pa-md">
            <div>
              <img src="~assets/logos/logobpjs.svg" class="q-mb-sm" width="200">
            </div>
            <div class="column flex-center">
              <div class="f-14 text-weight-bold">
                SURAT RENCANA KONTROL
              </div>
              <div class="f-14 text-weight-bold">
                UOBK RSUD Dr. MOHAMAD SALEH
              </div>
            </div>

            <div>No. {{ item?.noSuratKontrol }}</div>
          </div>
        </q-card-section>
        <q-separator style="margin-top: -10px;" />
        <q-card-section class="q-pa-md row q-col-gutter-md">
          <div class="col-12">
            <div class="row q-col-gutter-md full-width">
              <div class="col-auto">
                <div>Kepada Yth</div>
                <div>No. Kartu</div>
                <div>NO. RM</div>
                <div>Nama Peserta</div>
                <div>Tgl Lahir</div>
                <div>Poli Kontrol</div>
                <div>Rencana Kontrol</div>

              </div>
              <div class="col full-width">
                <div class="text-bold">: {{ item?.namaDokter }}</div>
                <div>: {{ item?.noKartu }}</div>
                <div>: {{ item?.norm }}</div>
                <div>: {{ item?.nama }}</div>
                <div>: {{ item?.tglLahir }}</div>
                <div class="text-bold">: {{ item?.namaPoli || '-' }}</div>
                <div>: {{ item?.tglRencanaKontrol }}</div>
              </div>
            </div>
          </div>

        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-md row full-width justify-between">
          <div class="col-auto">
            <div class="f-10">
              <i>* Tgl. Entry : {{ item?.created_at }} </i>
            </div>
            <div class="f-10">
              Cetakan dari RS
            </div>
          </div>
          <div class="col-3">
            <div style="width:100%; " class="relative-position">
              <div>Mengetahui DPJP</div>
              <div style="width: 100px; height: 60px;" class="q-mb-xs">
                <!-- <vue-qrcode :value="qrUrl" tag="svg" :options="{
                  errorCorrectionLevel: 'Q',
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin: 2
                }" /> -->
              </div>
              <div class="">
                {{ item?.namaDokter }}
              </div>
            </div>
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
import { computed, ref } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  item: {
    type: Object,
    default: null
  }
})


// console.log('item', props.item);


const qrUrl = computed(() => {
  const noka = props.pasien?.noka// noreg
  return `${noka}`
})



const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'CETAK SURAT KONTROL',
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
</script>

<style lang="scss" scoped></style>
