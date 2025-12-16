<template>
  <q-form ref="refForm" class=" bg-grey-1 q-pa-sm" style="display: flex; flex-direction: column;">
    <q-card flat bordered class="q-mb-md rounded-borders shadow-2">
      <q-card-section>
        <div class="row">
          <div class="col-6 text-weight-bold q-gutter-sm">
            <q-btn-dropdown color="primary" label="Pilih Jenis Pembayaran">
              <q-list>
                <q-item v-for="item in paymentOptions" :key="item.value" clickable v-close-popup
                  @click="selectPayment(item.value)">
                  <q-item-section avatar>
                    <q-avatar :icon="item.icon" :color="item.color" text-color="white" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <q-separator vertical />
          <div class="col-6 q-pl-sm">
            <div class="row text-weight-bold q-mt-sm ">
              <div class="col-4  q-gutter-lg">
                <q-radio v-model="store.form.carabayar" val="Tunai" label="Tunai" size="sm" dense
                  @update:model-value="(val) => setjeniscarabayar(val)" />
              </div>
              <div class="col-4">
                <q-radio v-model="store.form.carabayar" val="Qris" label="Qris" size="sm" dense
                  @update:model-value="(val) => setjeniscarabayar(val)" />
              </div>
              <div class="col-4">
                <q-radio v-model="store.form.carabayar" val="VA" label="VA" size="sm" dense
                  @update:model-value="(val) => setjeniscarabayar(val)" />
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-12 text-weight-bold">Jenis Pelayanan : <q-badge
              :color="paymentOptions.find(item => item.value === storex.jenispembayaran)?.color">{{
                storex.jenispembayaran
                  === '' ? 'Semua' : storex.jenispembayaran
              }}</q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="rounded-borders shadow-2" style="height: 500px; display: flex; flex-direction: column;">
      <!-- Header -->
      <div class="row q-ma-sm">
        <div class="col-12">
          <div
            class="full-width bg-grey-8 text-white text-weight-bold flex items-center justify-center q-px-md q-py-sm rounded-b-xl shadow-2"
            style="height: 35px;">
            <span>Detail Pembayaran</span>
          </div>
        </div>
      </div>
      <q-scroll-area class="col-grow">
        <div v-if="store.loadingbayar" class="row items-center justify-center" style="height: 100%;">
          <q-spinner-facebook color="blue" size="64px" />
        </div>
        <div v-else style="flex: 1; overflow-y: auto; padding-bottom: 12px;">
          <div class="col-12 q-mt-sm" style="overflow-y: auto; padding-bottom: 50px;">
            <div class="row q-mt-sm" v-if="(selectedPayment === '' || selectedPayment === 'karcis') && store.items">

              <q-list class="full-width kwitansi-card">
                <q-item>
                  <q-item-section>
                    <q-item-label>Karcis {{ store.items?.rs6 }}</q-item-label>
                    <q-item-label>Subtotal Pelayanan Karcis <q-badge
                        :color="paymentOptions.find(item => item.value === 'karcis')?.color" class="text-weight-bold">{{
                          formatRpDouble(store.items?.subtotal)
                        }}</q-badge></q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(store.items?.rs4) }}</q-item-label>
                    <div class="row q-gutter-xs">
                      <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                        icon="icon-mat-attach_money" :loading="store.loadingpembayaran"
                        @click="bayarkarcis('Karcis', store.items?.subtotal)">
                        <q-tooltip class="primary" :offset="[10, 10]">
                          Bayar & Print
                        </q-tooltip>
                      </q-btn>
                      <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                        icon="icon-mat-qr_code_2" :loading="store.loadingpembayaran"
                        @click="store.createQris(prop.pasien, store.items?.subtotal, 'Karcis', store.form.carabayar)">
                        <q-tooltip class="primary" :offset="[10, 10]">
                          Bayar & Print
                        </q-tooltip>
                      </q-btn>
                      <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                        icon="icon-eva-bell-outline" :loading="store.loadingpembayaran"
                        @click="store.createva(prop.pasien, store.items?.subtotal, 'Karcis', store.form.carabayar)">
                        <q-tooltip class="primary" :offset="[10, 10]">
                          Bayar & Print
                        </q-tooltip>
                      </q-btn>
                    </div>

                  </q-item-section>
                </q-item>

                <q-separator spaced inset />
              </q-list>
            </div>

            <div class="row q-mt-sm" v-if="(selectedPayment === '' || selectedPayment === 'obat') && store.itemsobat">
              <q-list class="full-width kwitansi-card" v-for="(item, x) in store.itemsobat" :key="x">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.nota }}</q-item-label>
                    <q-item-label> Subtotal Pelayanan Obat <q-badge
                        :color="paymentOptions.find(item => item.value === 'obat')?.color" class="text-weight-bold">{{
                          formatRpDouble(item?.subtotal)
                        }}</q-badge></q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.tanggal) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money" @click="bayarnonkarcis(item?.nota, item?.subtotal, 'Farmasi')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2"
                      @click="store.createQris(prop.pasien, store.items?.subtotal, 'NonKarcis', store.form.carabayar)">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="row q-mt-sm"
              v-if="(selectedPayment === '' || selectedPayment === 'tindakan') && store.itemstindakan">
              <q-list class="full-width kwitansi-card" v-for="(item, q) in store.itemstindakan" :key="q">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.rs2 }}</q-item-label>
                    <q-item-label> Subtotal Pelayanan Tindakan <q-badge
                        :color="paymentOptions.find(item => item.value === 'tindakan')?.color"
                        class="text-weight-bold">{{
                          formatRpDouble(item?.total)
                        }}</q-badge></q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.rs3) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money" @click="bayarnonkarcis(item?.rs2, item?.total, 'Tindakan')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="row q-mt-sm"
              v-if="(selectedPayment === '' || selectedPayment === 'Operasi') && store.itemsoperasi">
              <q-list class="full-width kwitansi-card" v-for="(item, a) in store.itemsoperasi" :key="a">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.rs2 }}</q-item-label>
                    <q-item-label> Subtotal Pelayanan Kamar Operasi <q-badge
                        :color="paymentOptions.find(item => item.value === 'Operasi')?.color"
                        class="text-weight-bold">{{
                          formatRpDouble(item?.total)
                        }}</q-badge></q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.rs3) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money" @click="bayarnonkarcis(item?.rs2, item?.total, 'Operasi')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="row q-mt-sm"
              v-if="(selectedPayment === '' || selectedPayment === 'Laboratorium') && store.itemslaborat">
              <q-list class="full-width kwitansi-card" v-for="(item, b) in store.itemslaborat" :key="b">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.nota }}</q-item-label>
                    <q-item-label> Subtotal Pelayanan Laborat <q-badge
                        :color="paymentOptions.find(item => item.value === 'Laboratorium')?.color"
                        class="text-weight-bold">{{
                          formatRpDouble(item?.total_subtotal)
                        }}</q-badge></q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.rs3) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money"
                      @click="bayarnonkarcis(item?.nota, item?.total_subtotal, 'Laboratorium')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="row q-mt-sm"
              v-if="(selectedPayment === '' || selectedPayment === 'Radiologi') && store.itemsradiologi">
              <q-list class="full-width kwitansi-card" v-for="(item, c) in store.itemsradiologi" :key="c">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.rs2 }}</q-item-label>
                    <q-item-label> Subtotal Pelayanan Radiologi <q-badge
                        :color="paymentOptions.find(item => item.value === 'Radiologi')?.color"
                        class="text-weight-bold">{{
                          formatRpDouble(item?.total)
                        }}</q-badge></q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.rs3) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money" @click="bayarnonkarcis(item?.rs2, item?.total, 'Radiologi')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="row q-mt-sm"
              v-if="(selectedPayment === '' || selectedPayment === 'TindakanPsikologi') && store.itemssharingbpjs">
              <q-list class="full-width kwitansi-card" v-for="(item, c) in store.itemstindakanpsikologi" :key="c">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.nota }}</q-item-label>
                    <q-item-label> Subtotal Psikologi <q-badge
                        :color="paymentOptions.find(item => item.value === 'TindakanPsikologi')?.color"
                        class="text-weight-bold">{{
                          formatRpDouble(item?.subtotal)
                        }}</q-badge></q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money"
                      @click="bayarnonkarcis(item?.nota, item?.subtotal, 'TindakanPsikologi')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="row q-mt-sm"
              v-if="(selectedPayment === '' || selectedPayment === 'SharingBpjs') && store.itemssharingbpjs">
              <q-list class="full-width kwitansi-card" v-for="(item, c) in store.itemssharingbpjs" :key="c">
                <q-item>
                  <q-item-section>
                    <q-item-label>Nota : {{ item?.id }}</q-item-label>
                    <q-item-label> Subtotal Sharing BPJSi <q-badge
                        :color="paymentOptions.find(item => item.value === 'SharingBpjs')?.color"
                        class="text-weight-bold">{{
                          formatRpDouble(item?.subtotal)
                        }}</q-badge></q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <q-btn v-if="store.form.carabayar === 'Tunai'" unelevated color="dark" round size="sm"
                      icon="icon-mat-attach_money" @click="bayarnonkarcis(item?.id, item?.subtotal, 'SharingBpjs')"
                      :loading="store.loadingpembayaran">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'Qris'" unelevated color="dark" round size="sm"
                      icon="icon-mat-qr_code_2">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                    <q-btn v-if="store.form.carabayar === 'VA'" unelevated color="dark" round size="sm"
                      icon="icon-eva-bell-outline">
                      <q-tooltip class="primary" :offset="[10, 10]">
                        Bayar & Print
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
          </div>
        </div>
      </q-scroll-area>
      <div
        class="bg-grey-8 text-white text-weight-bold flex items-center justify-between q-px-md q-py-sm rounded-b-xl shadow-2"
        style="height: 40px; margin-top: auto;">
        <span>Total :</span>
        <span v-if="store.loadingbayar === false">{{ formatRpDouble(totalbill) }} </span>
        <span v-else="store.loadingbayar === true"><q-spinner-facebook /></span>
      </div>
    </q-card>
  </q-form>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formatRpDouble, humanDate } from 'src/modules/formatter';
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan';
import { usePembayaranKasirRajalStore } from 'src/stores/simrs/kasir/rajal/pembayaran';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const refForm = ref(null)
const store = usePembayaranKasirRajalStore()
const storex = useKasirRajalListKunjunganStore()

const $q = useQuasar()

const selectedPayment = ref('')
const router = useRouter()

const prop = defineProps({
  pasien: { type: Object, default: () => { } },
  billing: { type: Object, default: () => { } },
  kwitansi: { type: Array, default: () => [] },
  jenislayanan: { type: String, default: '' },
  getKwitansiTerbayar: { type: Array, default: () => [] }
})

const paymentOptions = [
  {
    value: '',
    label: 'Semua',
    icon: 'icon-mat-list',
    color: 'grey'
  },
  {
    value: 'karcis',
    label: 'Pelayanan RM',
    icon: 'icon-mat-medical_information',
    color: 'primary'
  },
  {
    value: 'obat',
    label: 'Pembayaran Obat',
    icon: 'icon-mat-local_pharmacy',
    color: 'green'
  },
  {
    value: 'tindakan',
    label: 'Biaya Tindakan',
    icon: 'icon-my-stethoscope',
    color: 'orange'
  },
  {
    value: 'Operasi',
    label: 'Biaya Operasi',
    icon: 'icon-my-stomach-svgrepo-com',
    color: 'dark'
  },
  {
    value: 'Laboratorium',
    label: 'Laboratorium',
    icon: 'icon-my-stomach-svgrepo-com',
    color: 'teal'
  },
  {
    value: 'Radiologi',
    label: 'Radiologi',
    icon: 'icon-my-stomach-svgrepo-com',
    color: 'teal-10'
  },
  {
    value: 'TindakanPsikologi',
    label: 'Psikologi',
    icon: 'icon-my-stomach-svgrepo-com',
    color: 'yellow-7'
  },
  {
    value: 'SharingBpjs',
    label: 'Sharing Bpjs',
    icon: 'icon-my-stomach-svgrepo-com',
    color: 'red'
  }
]

const totalbill = computed(() => {
  const totalkarcis = parseFloat(store.items?.subtotal ?? 0)
  const totalobat = parseFloat(store.itemsobat?.reduce((acc, cur) => acc + cur.subtotal, 0) ?? 0)
  const totaltindakan = parseFloat(store.itemstindakan?.reduce((acc, cur) => acc + cur.total, 0) ?? 0)
  const totaloperasi = parseFloat(store.itemsoperasi?.reduce((acc, cur) => acc + cur.total, 0) ?? 0)
  const totallaborat = parseFloat(store.itemslaborat?.reduce((acc, cur) => acc + cur.total_subtotal, 0) ?? 0)
  const totalradiologi = parseFloat(store.itemsradiologi?.reduce((acc, cur) => acc + cur.total, 0) ?? 0)
  const totalpsikologi = parseFloat(store.itemstindakanpsikologi?.reduce((acc, cur) => acc + cur.subtotal, 0) ?? 0)
  const totalsharing = parseFloat(store.itemssharingbpjs?.reduce((acc, cur) => acc + cur.subtotal, 0) ?? 0)
  const total = parseFloat(totalkarcis + totalobat + totaltindakan + totaloperasi + totallaborat + totalradiologi + totalpsikologi + totalsharing)
  store.total = total
  return total
})

function selectPayment(value) {
  storex.jenispembayaran = value
  selectedPayment.value = value
}

function setjeniscarabayar(value) {
  store.form.carabayar = value
}

function caripembayaran() {
  if (storex.jenispembayaran === '') {
    $q.notify({
      type: 'negative',
      title: 'Peringatan',
      message: 'INFO WARNING <b/> MAAF,<em><b>Anda Belum Memilih Jenis Pelayanan</b></em>',
      html: true,
      timeout: 1000
    })
  } else {
    if (storex.jenispembayaran === 'karcis') {
      store.items
    } else if (storex.jenispembayaran === 'obat') {
      console.log('cari obat')
      store.itemsobat
    }
  }
}

function bayarkarcis(val, subtotal) {
  if (store.form.carabayar === '' || store.form.carabayar === '') {
    $q.notify({
      type: 'negative',
      title: 'Peringatan',
      message: 'INFO WARNING <b/> MAAF,<em><b>Anda Belum Memilih Cara Bayar</b></em>',
      html: true,
      timeout: 1000
    })
  } else {
    if (val === 'Karcis') {
      if (store.form.carabayar === 'Tunai') {
        $q.dialog({
          dark: true,
          title: 'Peringatan',
          message: 'Apakah Data ini akan DISIMPAN?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          store.savePembayaran(prop.pasien, subtotal, val, store.form.carabayar, router)
        }).onCancel(() => {
          console.log('Cancel')
        }).onDismiss(() => {
          console.log('I am triggered on both OK and Cancel')
        })
      }
    }
  }
}

function bayarnonkarcis(nota, total, jenis) {

  if (store.form.carabayar === '' || store.form.carabayar === '') {
    $q.notify({
      type: 'negative',
      title: 'Peringatan',
      message: 'INFO WARNING <b/> MAAF,<em><b>Anda Belum Memilih Cara Bayar</b></em>',
      html: true,
      timeout: 1000
    })
  } else {
    if (store.form.carabayar === 'Tunai') {
      $q.dialog({
        dark: true,
        title: 'Peringatan',
        message: 'Apakah Data ini akan DISIMPAN?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        store.savePembayarannonKarcis(prop.pasien, nota, total, jenis, router)
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
onMounted(() => {
  console.log('prop.pasien', prop.pasien)
  store.loadingbayar = true
  store.carikarcis(prop.pasien?.noreg)
  store.cariobat(prop.pasien?.noreg)
  store.caritindakan(prop.pasien?.noreg)
  store.caritindakanpsikologi(prop.pasien?.noreg)
  store.carioperasi(prop.pasien?.noreg)
  store.carilaborat(prop.pasien?.noreg)
  store.cariradiologi(prop.pasien?.noreg)
  store.carisharingbpjs(prop.pasien?.noreg)
})



</script>
<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.kwitansi-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kwitansi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
}
</style>
