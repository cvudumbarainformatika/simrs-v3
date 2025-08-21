<template>
  <q-form ref="refForm" class="full-height bg-grey-1 q-pa-sm">
    <div class="row">
      <div class="col-6 text-weight-bold q-gutter-sm">
        <q-btn-dropdown color="primary" label="Pilih Jenis Pembayaran">
          <q-list>
            <q-item v-for="item in paymentOptions" :key="item.value" clickable v-close-popup
              @click="selectPayment(item.value)">
              <q-item-section avatar>
                <q-avatar :icon="item.icon" :color="item.color" :label="selectedPayment
                  ? paymentOptions.find(o => o.value === selectedPayment)?.label
                  : 'Pilih Jenis Pembayaran'" text-color="white" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- <q-radio v-model="storex.jenispembayaran" val="karcis" label="Pelayanan RM" size="sm" dense><q-item-label
            caption> ( {{
              formatRpDouble(karcis) }} )</q-item-label></q-radio>
        <q-radio v-model="storex.jenispembayaran" val="konsulantarpoli" label="Konsul Antar Poli" size="sm"
          dense><q-item-label caption> ( {{
            formatRpDouble(billing?.konsulantarpoli) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="laborat" label="Laborat" size="sm" dense><q-item-label caption> (
            {{
              formatRpDouble(billing?.laborat) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="radiologi" label="Radiologi" size="sm" dense><q-item-label
            caption> ( {{
              formatRpDouble(billing?.radiologi) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="onedaycare" label="Onedaycare" size="sm" dense><q-item-label
            caption> ( {{
              formatRpDouble(billing?.onedaycare) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="fisioterapi" label="Fisioterapi" size="sm" dense><q-item-label
            caption> ( {{
              formatRpDouble(billing?.fisioterapi) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="penunjanglain" label="Penunjanglain" size="sm" dense><q-item-label
            caption> ( {{
              formatRpDouble(billing?.penunjanglain) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="psikologi" label="Psikologi" size="sm" dense><q-item-label
            caption> ( {{
              formatRpDouble(billing?.psikologi) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="cardio" label="Cardio" size="sm" dense><q-item-label caption>
            ( {{
              formatRpDouble(billing?.cardio) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="eeg" label="Eeg" size="sm" dense><q-item-label caption>
            ( {{
              formatRpDouble(billing?.eeg) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="endoscopy" label="Endoscopy" size="sm" dense><q-item-label
            caption>
            ( {{
              formatRpDouble(billing?.endoscopy) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="obat" label="Obat" size="sm" dense><q-item-label caption>
            ( {{
              formatRpDouble(billing?.obat) }} )</q-item-label></q-radio>
        <q-radio v-model="store.jenispembayaran" val="farmasinew" label="E-Resep" size="sm" dense><q-item-label caption>
            ( {{
              formatRpDouble(billing?.farmasinew) }} )</q-item-label></q-radio> -->
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
      <div class="col-12 text-weight-bold">Jenis Pelayanan : <q-badge color="green"
          v-if="storex.jenispembayaran !== ''">{{ storex.jenispembayaran
          }}</q-badge>
      </div>
      <!-- <div class="col-6 text-weight-bold">
        No. Nota : <q-select v-model="store.form.nota" outlined standout="bg-yellow-3" bg-color="white" dense
          :options="store.notas" style="min-width: 200px;" />
      </div> -->
    </div>
    <div class="row q-mt-sm">
      <div class="col-12">
        <q-btn color="primary" class="full-width" label="Cari Tagihan" @click="caripembayaran()"
          :loading="store.loading" />
      </div>
    </div>
    <div class="row q-mt-sm">
      <q-list class="full-width">
        <q-item>
          <q-item-section>
            <q-item-label>Karcis {{ store.items?.rs6 }}</q-item-label>
            <q-item-label caption lines="2">Subtotal <q-badge color="teal" class="text-weight-bold">{{
              formatRpDouble(store.items?.subtotal)
                }}</q-badge></q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ humanDate(store.items?.rs4) }}</q-item-label>
            <q-btn unelevated color="dark" round size="sm" icon="icon-mat-attach_money">
              <q-tooltip class="primary" :offset="[10, 10]">
                Bayar & Print
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </q-list>
    </div>
    <div class="row q-mt-sm">
      <q-list class="full-width" v-for="(item, x) in store.itemsobat" :key="x">
        <q-item>
          <q-item-section>
            <q-item-label>Nota Obat: {{ item?.nota }}</q-item-label>
            <q-item-label caption lines="2">Subtotal <q-badge color="teal" class="text-weight-bold">{{
              formatRpDouble(item?.subtotal)
                }}</q-badge></q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ humanDate(item?.tanggal) }}</q-item-label>
            <q-btn unelevated color="dark" round size="sm" icon="icon-mat-attach_money">
              <q-tooltip class="primary" :offset="[10, 10]">
                Bayar & Print
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />
      </q-list>
    </div>
  </q-form>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formatRpDouble, humanDate } from 'src/modules/formatter';
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan';
import { usePembayaranKasirRajalStore } from 'src/stores/simrs/kasir/rajal/pembayaran';
import { onMounted, ref } from 'vue';

const refForm = ref(null)
const store = usePembayaranKasirRajalStore()
const storex = useKasirRajalListKunjunganStore()

const $q = useQuasar()

const selectedPayment = ref(null)

const prop = defineProps({
  pasien: { type: Object, default: () => { } },
  billing: { type: Object, default: () => { } },
  kwitansi: { type: Array, default: () => [] },
  jenislayanan: { type: String, default: '' },
})

const paymentOptions = [
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
    icon: 'icon-mat-healing',
    color: 'orange'
  }
]

function selectPayment(value) {
  storex.jenispembayaran = value
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
      console.log('cari karcis')
      store.carikarcis(prop.pasien?.noreg)
    } else if (storex.jenispembayaran === 'obat') {
      console.log('cari obat')
      store.cariobat(prop.pasien?.noreg)
    }
  }
}

function bayar() {
  console.log('bayar', store.form.carabayar)
  if (storex.jenispembayaran === '' && store.form.carabayar === '' || storex.jenispembayaran === '' || store.form.carabayar === '') {
    $q.notify({
      type: 'negative',
      title: 'Peringatan',
      message: 'INFO WARNING <b/> MAAF,<em><b>Anda Belum Memilih Jenis Pelayanan</b></em>',
      html: true,
      timeout: 1000
    })
    store.form.carabayar = ''
    storex.jenispembayaran = ''
  } else {
    if (storex.jenispembayaran === 'karcis') {
      if (store.form.carabayar === 'Tunai') {
        $q.dialog({
          dark: true,
          title: 'Peringatan',
          message: 'Apakah Data ini akan DISIMPAN?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          // console.log('OK')
          store.savePembayaran(prop.pasien, prop.billing, prop.jenislayanan, store.form.carabayar)
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
      } else if (store.form.carabayar === 'Qris') {
        $q.dialog({
          dark: true,
          title: 'Peringatan',
          message: 'Apakah Data Anda Ingin Create QRIS?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          // console.log('OK')
          store.createQris(prop.pasien, prop.billing, prop.jenislayanan, val)
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log(
        })
      }
    }
  }
}

onMounted(() => {
  store.carikarcis(prop.pasien?.noreg)
  store.cariobat(prop.pasien?.noreg)
})

const karcis = parseFloat(prop?.billing?.poliklinik + prop?.billing?.kartuidentitas + prop?.billing?.pelayananrm)
</script>
