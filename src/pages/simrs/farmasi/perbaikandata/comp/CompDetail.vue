<template>
  <q-dialog maximized persistent @show="show()" @hide="hide()">
    <q-card>
      <q-bar class="bg-primary">
        <q-space />

        <q-btn
          v-close-popup
          dense
          flat
          color="white"
          icon="icon-mat-close"
          @click="emits('close')"
        >
          <q-tooltip class="bg-white text-primary">
            Close
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <div class="row justify-end q-pb-sm" style="border-bottom: 1px solid #ccc;">
          <q-btn label="Ambil ulang data" no-caps dense color="primary" @click="store.ambilUlangData(data?.kd_obat)" :loading="store.loadingGetData" :disable="store.loadingGetData" />
        </div>
        <div class="row text-weight-bold q-mb-md f-16" style="border-bottom: 1px solid #ccc;">
          <div class="col-2">
            {{ data.kd_obat }}
          </div>
          <div class="col-2">
            {{ data.nama_obat }}
          </div>
          <div class="col-2">
            Masuk : <span class="text-green">{{ data?.data?.data?.masuk }}</span>
          </div>
          <div class="col-2">
            Keluar : <span class="text-negative">{{ data?.data?.data?.keluar }}</span>
          </div>
          <div class="col-2">
            Sisa : <span :class="parseFloat(data?.data?.data?.sisa).toFixed(2)!==parseFloat(data?.data?.data?.tts).toFixed(2)?'text-negative':'text-green'">{{ data?.data?.data?.sisa }}</span>
          </div>
          <div class="col-2">
            Opname : <span :class="parseFloat(data?.data?.data?.sisa).toFixed(2)!==parseFloat(data?.data?.data?.tts).toFixed(2)?'text-negative':'text-green'">{{ data?.data?.data?.tts }}</span>
          </div>
        </div>
        <div class="row q-py-sm " style="border-bottom: 1px solid #ccc;">
          <div class="col-4 f-16">
            Saldo Awal
          </div>
          <div class="col-8">
            <div class="row bg-dark text-white">
              <div class="col-1">
                No
              </div>
              <div class="col-2">
                Jumlah
              </div>
              <div class="col-2">
                Harga
              </div>
              <div class="col-3">
                Nomor Penerimaaan
              </div>
              <div class="col-2">
                Tgl Penerimaaan
              </div>
              <div class="col-1">
                Nobatch
              </div>
            </div>
            <div v-for="(rinc,i) in data?.data?.data?.saldoAwalRinci" :key="i">
              <div class="row" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-1">
                  {{ i+1 }}.
                </div>
                <div class="col-2">
                  {{ rinc?.total }}
                </div>
                <div class="col-2">
                  {{ rinc?.harga }}
                </div>
                <div class="col-3">
                  {{ rinc?.nopenerimaan }}
                </div>

                <div class="col-2">
                  {{ dateFull( rinc?.tglpenerimaan) }}
                </div>
                <div class="col-1">
                  {{ rinc?.nobatch }}
                </div>
              </div>
            </div>
            <!-- {{ data?.data?.data?.saldoAwalRinci }} -->
          </div>
        </div>
        <!-- Opname -->
        <div class="row q-py-sm items-center" style="border-bottom: 1px solid #ccc;">
          <div class="col-1 text-weight-bold f-16" :class="data?.opnameJml&&data?.opnameTrx?'text-green':'text-negative'">
            Opname :
          </div>
          <div class="col-2">
            <q-btn
              v-if="!editOpname && bisaEditOpname"
              no-caps
              dense
              label="Edit Opname"
              color="primary"
              @click="editOpname=true"
            />
            <span v-if="!periodeSelesai" class="text-grey-7">
              Perbaikan bulan berjalan melalui menu stok
            </span>
            <span v-else-if="!bisaEditOpname" class="text-grey-7">
              Tidak ada sisa stok untuk diopname
            </span>
            <q-btn
              v-if="editOpname"
              no-caps
              dense
              label="Simpan Opname"
              color="green"
              :loading="store.loadingFixOpname"
              :disable="store.loadingFixOpname"
              @click="simpanOpname()"
            />
            <q-btn
              v-if="editOpname"
              class="q-ml-sm"
              no-caps
              dense
              label="Batal"
              color="dark"
              :loading="store.loadingFixOpname"
              :disable="store.loadingFixOpname"
              @click="editOpname=false"
            />
          </div>
          <div v-if="editOpname" class="col-9">
            <div class="row bg-dark text-white">
              <div class="col-1">
                Target
              </div>
              <div class="col-2">
                Jumlah Sekarang
              </div>
              <div class="col-2">
                Selisih
              </div>
              <div class="col-2">
                #
              </div>
            </div>
            <div class="row items-center">
              <div class="col-1">
                {{ targetOpname }}
              </div>
              <div class="col-2">
                {{ data?.data?.data?.cekOpname?.opname?.reduce((total, item) => total + parseFloat(item.jumlah), 0) }}
              </div>
              <div class="col-2">
                {{ targetOpname - data?.data?.data?.cekOpname?.opname?.reduce((total, item) => total + parseFloat(item.jumlah), 0) }}
              </div>
              <div class="col-2">
                <q-btn
                  class="q-pa-none"
                  no-caps
                  dense
                  label="Auto Fix"
                  color="orange"
                  :loading="store.loadingFixOpname"
                  :disable="store.loadingFixOpname"
                  @click="autoFix()"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row q-py-sm" style="border-bottom: 1px solid #ccc;">
          <div class="col-auto per-dua">
            <div class="text-weight-bold">
              Data Opname
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 5%;">
                No
              </div>
              <div class="col-2">
                Jumlah
              </div>
              <div class="col-1">
                Harga
              </div>
              <div class="col-4">
                Nomor Penerimaaan
              </div>
              <div class="col-3">
                Tgl Penerimaaan
              </div>
              <div class="col-1">
                Nobatch
              </div>
            </div>
            <div v-for="(opnm,i) in data?.data?.data?.cekOpname?.opname" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 5%;">
                  {{ i+1 }}.
                </div>
                <div class="col-2">
                  <div v-if="!editOpname">
                    {{ opnm?.jumlah }}
                  </div>
                  <div v-if="editOpname">
                    <app-input v-model="opnm.jumlah" label="Jumlah" outlined valid />
                  </div>
                </div>
                <div class="col-1">
                  {{ opnm?.harga }}
                </div>
                <div class="col-4">
                  {{ opnm?.nopenerimaan }}
                </div>
                <div class="col-3">
                  {{ dateFull( opnm?.tglpenerimaan) }}
                </div>
                <div class="col-1">
                  {{ opnm?.nobatch }}
                </div>
              </div>
            </div>
            <!-- <div v-if="editOpname" class="row justify-center">
              <q-btn icon="icon-mat-add_circle" color="primary" dense flat @click="addRow()">
                <q-tooltip>Tambah Row</q-tooltip>
              </q-btn>
            </div> -->
          </div>
          <div class="col-auto per-dua">
            <div class="text-weight-bold">
              Data Penerimaan
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 5%;">
                No
              </div>
              <div class="col-1">
                Jumlah
              </div>
              <div class="col-2">
                Harga
              </div>
              <div class="col-4">
                Nomor Penerimaaan
              </div>
              <div class="col-3">
                Tgl Penerimaaan
              </div>
              <div class="col-1">
                Nobatch
              </div>
            </div>
            <div v-if="store.loadingFixHarga || store.loadingGetData" class="row justify-center">
              <div class="col-12 text-center">
                <q-spinner-cube
                  color="primary"
                  size="3em"
                />
                <div>Harap Tunggu ...</div>
              </div>
            </div>
            <div v-for="(perbaikan,i) in data?.data?.data?.cekOpname?.penerimaan" :key="i">
              <div
                v-if="!store.loadingFixHarga && !store.loadingGetData"
                class="row items-center "
                :class="(i%2==0?'bg-grey-2':'bg-grey-4') + ' ' + (mutSaja.includes(store.params.kdruang)?'':'cursor-pointer bisa-hover')"
                @click="()=>{
                  if(perbaikan?.koreksi) return notifErrVue('Data Penerimaan Koreksi, tidak bisa di edit')
                  if(!mutSaja.includes(store.params.kdruang)){
                    store.openHarga=true
                    store.getPerbaikanHarga(perbaikan)
                  }
                }"
              >
                <div class="col-auto" style="width: 5%;">
                  {{ i+1 }}.
                </div>
                <div class="col-1">
                  {{ perbaikan?.jml_terima_k }}
                </div>
                <div class="col-2">
                  {{ perbaikan?.harga_netto_kecil }}
                </div>
                <div class="col-4">
                  {{ perbaikan?.nopenerimaan }} <span v-if="perbaikan?.koreksi" class="f-10 text-italic">( koreksi )</span>
                </div>
                <div class="col-3">
                  {{ dateFull( perbaikan?.tglpenerimaan) }}
                </div>
                <div class="col-1">
                  {{ perbaikan?.no_batch }}
                </div>
              </div>
            </div>
          </div>
          <!-- {{ data?.data?.data?.cekOpname }} -->
        </div>
        <!-- Transaksi -->
        <div class="row q-py-sm items-center" style="border-bottom: 1px solid #ccc;">
          <div class="col-2 text-weight-bold f-16" :class="data?.trxKurang&&data?.trxLebih&&data?.trxSesuai?'text-green':'text-negative'">
            Transaksi :
          </div>
          <div v-if="mutSaja.includes(store.params.kdruang)" class="col-2">
            <q-btn
              no-caps
              dense
              label="Auto Fix Mutasi"
              color="orange"
              :loading="store.loadingFixMutasi"
              :disable="store.loadingMutasi || store.loadingFixMutasi"
              @click="autofixMutasi()"
            />
          </div>
          <div v-if="mutSaja.includes(store.params.kdruang)" class="col-2">
            <q-btn
              no-caps
              dense
              label="List Mutasi"
              color="primary"
              :loading="store.loadingMutasi"
              :disable="store.loadingMutasi || store.loadingFixMutasi"
              @click="listMutasi()"
            />
          </div>
          <div v-if="!mutSaja.includes(store.params.kdruang)" class="col-2">
            <q-btn
              no-caps
              dense
              :label="store.params.kdruang==='Gd-03010101'?'Autofix Mutasi ke Ruangan':'Autofix Resep'"
              color="orange"
              :loading="store.loadingFixResep"
              :disable="store.loadingFixResep || store.loadingResep"
              @click="autoFixResep('default')"
            />
          </div>
          <div v-if="!mutSaja.includes(store.params.kdruang)" class="col-2">
            <q-btn
              no-caps
              dense
              label="List Transaksi"
              color="primary"
              :loading="store.loadingResep"
              :disable="store.loadingResep || store.loadingFixResep"
              @click="listResep()"
            />
          </div>
        </div>
        <!-- mutasi saja, gudangS -->
        <div v-if="mutSaja.includes(store.params.kdruang)" class="row q-py-sm" style="border-bottom: 1px solid #ccc;">
          <div class="col-auto per-tiga">
            <div class="text-weight-bold">
              Transaksi Kurang
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 7%;">
                No
              </div>
              <div class="col-6" style="width: 45%;">
                Nomor Penerimaaan
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Masuk
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Keluar
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Diff
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Op
              </div>
            </div>
            <div v-for="(mut,i) in data?.data?.data?.penKur" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 7%;">
                  {{ i+1 }}
                </div>
                <div class="col-auto" style="width: 45%;">
                  {{ mut?.noper }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.maSuk }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.keLuar }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.sts }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.stOpnya }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto per-tiga">
            <div class="text-weight-bold">
              Transaksi Lebih
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 7%;">
                No
              </div>
              <div class="col-6" style="width: 45%;">
                Nomor Penerimaaan
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Masuk
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Keluar
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Diff
              </div><div class="col-auto" style="width: calc(48% / 4)">
                Op
              </div>
            </div>
            <div v-for="(mut,i) in data?.data?.data?.penLeb" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 7%;">
                  {{ i+1 }}
                </div>
                <div class="col-auto" style="width: 45%;">
                  {{ mut?.noper }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.maSuk }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.keLuar }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.sts }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.stOpnya }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto per-tiga">
            <div class="text-weight-bold">
              Transaksi Pas
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 7%;">
                No
              </div>
              <div class="col-6" style="width: 45%;">
                Nomor Penerimaaan
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Masuk
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Keluar
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Diff
              </div><div class="col-auto" style="width: calc(48% / 4)">
                Op
              </div>
            </div>
            <div v-for="(mut,i) in data?.data?.data?.penPas" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 7%;">
                  {{ i+1 }}
                </div>
                <div class="col-auto" style="width: 45%;">
                  {{ mut?.noper }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.maSuk }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.keLuar }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.sts }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ mut?.stOpnya }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!mutSaja.includes(store.params.kdruang)" class="row q-py-sm" style="border-bottom: 1px solid #ccc;">
          <div class="col-auto per-tiga">
            <div class="text-weight-bold">
              Transaksi Kurang
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 7%;">
                No
              </div>
              <div class="col-6" style="width: 45%;">
                Nomor Penerimaaan
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Masuk
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Keluar
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Diff
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Op
              </div>
            </div>
            <div v-for="(mut,i) in data?.data?.data?.penKur" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 7%;">
                  {{ i+1 }}
                </div>
                <div class="col-auto" style="width: 45%;">
                  {{ mut?.noper }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.maSuk),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.keLuar),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.sts),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.stOpnya),2) }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto per-tiga">
            <div class="text-weight-bold">
              Transaksi Lebih
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 7%;">
                No
              </div>
              <div class="col-6" style="width: 45%;">
                Nomor Penerimaaan
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Masuk
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Keluar
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Diff
              </div><div class="col-auto" style="width: calc(48% / 4)">
                Op
              </div>
            </div>
            <div v-for="(mut,i) in data?.data?.data?.penLeb" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 7%;">
                  {{ i+1 }}
                </div>
                <div class="col-auto" style="width: 45%;">
                  {{ mut?.noper }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.maSuk),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat((mut?.keLuar)),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.sts),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.stOpnya),2) }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto per-tiga">
            <div class="text-weight-bold">
              Transaksi Pas
            </div>
            <div class="row bg-dark text-white">
              <div class="col-auto" style="width: 7%;">
                No
              </div>
              <div class="col-6" style="width: 45%;">
                Nomor Penerimaaan
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Masuk
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Keluar
              </div>
              <div class="col-auto" style="width: calc(48% / 4)">
                Diff
              </div><div class="col-auto" style="width: calc(48% / 4)">
                Op
              </div>
            </div>
            <div v-for="(mut,i) in data?.data?.data?.penPas" :key="i">
              <div class="row items-center" :class="i%2==0?'bg-grey-2':'bg-grey-4'">
                <div class="col-auto" style="width: 7%;">
                  {{ i+1 }}
                </div>
                <div class="col-auto" style="width: 45%;">
                  {{ mut?.noper }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.maSuk),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.keLuar),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.sts),2) }}
                </div>
                <div class="col-auto" style="width: calc(48% / 4)">
                  {{ formatDouble(parseFloat(mut?.stOpnya),2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { dateFull, formatDouble } from 'src/modules/formatter'
import { notifErrVue } from 'src/modules/utils'
import { usePerbaikanDataFarmasiStore } from 'src/stores/simrs/farmasi/perbaikandata/perbaikandata'
import { computed, ref } from 'vue'
const store = usePerbaikanDataFarmasiStore()
const emits = defineEmits(['close', 'fixMutasi', 'fixResep'])
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  data: { type: Object, default: () => {} }
})

/**
 * opname section
 */

const editOpname = ref(false)
const periodeSelesai = computed(() => {
  const tahun = Number(store.params.tahun)
  const bulan = Number(store.params.bulan)
  const sekarang = new Date()
  return Number.isInteger(tahun) && Number.isInteger(bulan) && bulan >= 1 && bulan <= 12 &&
    (tahun < sekarang.getFullYear() || (tahun === sekarang.getFullYear() && bulan < sekarang.getMonth() + 1))
})
const targetOpname = computed(() => {
  const data = props.data?.data?.data
  return Number(data?.cekOpname?.opname?.length ? data?.cekOpname?.jmlOp : data?.sisa)
})
const bisaEditOpname = computed(() => periodeSelesai.value &&
  ((props.data?.data?.data?.cekOpname?.opname?.length ?? 0) > 0 || targetOpname.value > 0))

async function simpanOpname () {
  const berhasil = await store.perbaikanDataOpname(props.data.kd_obat)
  if (berhasil) editOpname.value = false
}

function autoFix () {
  const cekOpname = props?.data?.data?.data?.cekOpname
  if (!cekOpname || !periodeSelesai.value) return

  const opnameLama = cekOpname.opname ?? []
  const target = targetOpname.value
  if (!Number.isFinite(target) || target <= 0) {
    notifErrVue('Tidak ada sisa stok untuk dibuatkan opname')
    return
  }

  const sumber = [
    ...(cekOpname.penerimaan ?? []).map(item => ({
      harga: item?.harga_netto_kecil,
      kapasitas: item?.jml_terima_k,
      nobatch: item?.no_batch,
      nopenerimaan: item?.nopenerimaan,
      tglpenerimaan: item?.tglpenerimaan,
      tglexp: item?.tgl_exp
    })),
    ...(props.data?.data?.data?.saldoAwalRinci ?? []).map(item => ({
      harga: item?.harga,
      kapasitas: item?.total,
      nobatch: item?.nobatch,
      nopenerimaan: item?.nopenerimaan,
      tglpenerimaan: item?.tglpenerimaan,
      tglexp: item?.tglexp
    }))
  ]
  const gabungan = new Map()
  for (const item of sumber) {
    const kapasitas = Number(item.kapasitas)
    if (!Number.isFinite(kapasitas) || kapasitas <= 0) continue
    const key = JSON.stringify([String(item.nopenerimaan), String(item.nobatch ?? ''), String(item.tglpenerimaan), String(item.harga)])
    const sebelumnya = gabungan.get(key)
    if (sebelumnya) sebelumnya.kapasitas += kapasitas
    else gabungan.set(key, { ...item, kapasitas })
  }
  const rincianSumber = [...gabungan.values()].sort((a, b) => new Date(b.tglpenerimaan) - new Date(a.tglpenerimaan))

  const tahun = Number(store.params.tahun)
  const bulan = Number(store.params.bulan)
  const hariTerakhir = String(new Date(tahun, bulan, 0).getDate()).padStart(2, '0')
  const akhirBulan = `${tahun}-${String(bulan).padStart(2, '0')}-${hariTerakhir} 23:59:58`
  const tglopname = opnameLama[0]?.tglopname ?? akhirBulan
  const hasil = opnameLama.map(item => ({ ...item, jumlah: 0 }))
  let sisa = Math.round(target * 100) / 100
  let index = 0

  for (const item of rincianSumber) {
    if (sisa <= 0) break
    if (!item.nopenerimaan || !item.tglpenerimaan || item.harga == null || item.harga === '' || !Number.isFinite(Number(item.harga))) {
      notifErrVue('Informasi penerimaan tidak lengkap; opname belum diubah')
      return
    }
    const jumlah = Math.round(Math.min(sisa, item.kapasitas) * 100) / 100
    if (jumlah <= 0) continue
    const rincian = {
      nopenerimaan: item.nopenerimaan,
      jumlah,
      tglexp: item.tglexp,
      nobatch: item.nobatch ?? '',
      tglpenerimaan: item.tglpenerimaan,
      tglopname,
      kdobat: props.data.kd_obat,
      kdruang: store.params.kdruang,
      harga: item.harga
    }
    if (index < hasil.length) hasil[index] = { ...hasil[index], ...rincian }
    else hasil.push({ id: null, ...rincian })
    index++
    sisa = Math.round((sisa - jumlah) * 100) / 100
  }

  if (sisa > 0) {
    notifErrVue(`Rincian penerimaan kurang ${sisa}; opname belum diubah`)
    return
  }
  cekOpname.opname = hasil
}
/**
 * opname section end
 */

/**
 * transaction section
 */
const mutSaja = ref(['Gd-05010100', 'Gd-03010100'])
function listMutasi () {
  store.openMutasi = true
  store.getDetailMutasi(props.data.kd_obat)
}
function autofixMutasi () {
  // editTransaction.value = false

  emits('fixMutasi', props.data?.kd_obat)
}
function listResep () {
  store.openResep = true
  store.getDetailResep(props.data.kd_obat)
}
function autoFixResep (val) {
  emits('fixResep', { obat: props.data?.kd_obat, tipe: val })
  // editTransaction.value = false
}

/**
 * transaction section end
 */

function show () {
  editOpname.value = false
}
function hide () {
  editOpname.value = false
}
</script>
<style lang="scss" scoped>
.per-empat{
  width: 24%;
  margin-left: 5px;
}
.per-tiga{
  width: 32.7%;
  margin-left: 5px;
}
.per-dua{
  width: 49%;
  margin-left: 5px;
}

.bisa-hover:hover{
  background-color: #81e6db !important;
}
</style>
