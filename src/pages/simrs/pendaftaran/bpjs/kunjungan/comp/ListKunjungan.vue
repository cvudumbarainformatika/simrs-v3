<template>
  <div>
    <app-loading v-if="loading" />
    <div v-else>
      <div v-if="items?.length <= 0">
        <div class="column flex-center" style="min-height:50vh">
          <div class="text-h3 q-mb-md">
            🏷️
          </div>
          <div class="f-14">
            Belum Ada Data
          </div>
        </div>
      </div>
      <q-list v-else separator>
        <q-separator spaced inset />

        <q-item v-for="(item, i) in items" :key="i">
          <q-item-section avatar>
            <app-avatar-pasien :pasien="item" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">
              {{ item.nama }} | <span class="text-primary">{{ item.norm }}</span>
            </q-item-label>
            <q-item-label>
              NOREG : <span class="text-weight-bold">{{ item.noreg }} </span> | Penjamin : <span
                class="text-weight-bold"> {{ item.sistembayar }}</span>
            </q-item-label>
            <q-item-label>
              DPJP : <span class="text-negative text-weight-bold">{{ item.dokter }}</span> | RUANGAN : <span
                class="text-teal text-weight-bold"> {{ item.poli }}</span>
            </q-item-label>
            <q-item-label caption>
              USIA : <span class="text-weight-bold">{{ item.usia }}</span> | Kelamin : <span class="text-weight-bold">{{
                item.kelamin }}</span>
            </q-item-label>
            <q-item-label>
              Tgl Kunjungan : <span class="text-weight-bold text-accent"> {{ dateFullFormat(item.tgl_kunjungan) }}
              </span> | jam : {{ formatJam(item.tgl_kunjungan) }}
            </q-item-label>
            <q-item-label caption>
              <i>Status Pasien: <span class="text-negative text-weight-bold">{{ getStatus(item.taskid) }}</span></i>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <div class="row" v-if="loadingBpjs && !getSatusAntrianBpjs(item)?.status">
              <q-btn loading flat />
            </div>
            <div class="row items-center" v-else>
              <div class="col-10">
                <div v-if="getSatusAntrianBpjs(item)?.length">
                  <div v-for="antr in getSatusAntrianBpjs(item)" :key="antr">
                    <!-- {{ antr }} -->
                    Status Antrian Bpjs : <span class="text-weight-bold">{{ antr?.status ??
                      'Data Antrian di BPJS tidak ditemukan' }}</span>
                  </div>
                </div>
                <div v-else>
                  Status Antrian Bpjs : <span class="text-weight-bold"> Data Antrian di BPJS tidak ditemukan</span>
                </div>
              </div>
              <div class="col-2">
                <q-btn icon="icon-mat-visibility" dense flat round color="grey" @click="showAntiran(item)">
                  <q-tooltip>Lihat Detail</q-tooltip>
                </q-btn>
                <q-btn v-if="getSatusAntrianBpjs(item)?.length == 1 &&
                  getSatusAntrianBpjs(item)[0]?.status?.toLowerCase() != 'selesai dilayani' &&
                  cekTanggal(item?.tgl_kunjungan) && cekAddAntrian(item)" icon="icon-mat-send" dense flat round
                  color="primary" @click="kirimUlangitem(item, getSatusAntrianBpjs(item)[0])" :loading="item?.loading"
                  :disable="item?.loading">

                  <q-tooltip>Kirim Ulang</q-tooltip>
                </q-btn>
              </div>
            </div>
            <!-- <template v-if="item?.taskid?.length > 0"> -->
            <div class="row bg-dark text-white text-bold q-px-xs">
              <div class="col-2">Task Id</div>
              <div class="col-10">
                <div class="row">
                  <div class="col-4">Status</div>
                  <div class="col-8">message</div>
                </div>
              </div>
            </div>
            <div v-for="task in tasks" :key="task">
              <div class="row q-px-xs cursor-pointer" @click="detailResponse(task, item?.bpjshttprespon)">
                <div class="col-2 text-center">{{ task }}</div>
                <div class="col-10 ">
                  <div v-if="cariResponse(task, item?.bpjshttprespon)?.length">
                    <div v-for="res in cariResponse(task, item?.bpjshttprespon)" :key="res">
                      <div class="row">
                        <div class="col-2">{{ res?.respon?.metadata?.code }}</div>
                        <div class="col-8">{{ res?.respon?.metadata?.message }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="row q-py-none">
                    <div class="col-12">Respon tidak ditemukan</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- </template> -->
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              <div class="row justify-end" @click="bukaSep(item)">
                <div v-if="loadingReSep === item.noreg && sepStore.loading">
                  <app-btn dense loading />
                </div>
                <div v-else :class="item.sep ? 'q-ml-sm' : 'q-ml-sm cursor-pointer'">
                  <q-badge outline :color="item.sep ? 'teal' : 'negative'"
                    :label="item.sep ? item.sep : 'SEP Belum terbit'" />
                </div>
              </div>
              <div class="row q-mt-sm justify-end">
                <q-btn outline size="sm" class="q-px-md" :color="item.generalconsent ? 'teal' : 'negative'"
                  :label="item.generalconsent ? 'Lihat General Consent' : 'General Consent Belum Ada'"
                  @click="genCon(item)" />
              </div>
              <div class="row q-mt-sm justify-end">
                <div class="q-ml-sm">
                  <q-btn outline size="sm" color="teal" :loading="loadingP && temp === item.noka" label="Pengajuan SEP"
                    @click="PengajuanSep(item)" />
                </div>
              </div>
              <div class="row q-mt-sm justify-end">
                <div class="q-ml-sm">
                  <q-btn size="sm" padding="xs" color="negative" :loading="loadingH && temp === item.noka"
                    label="Hapus Pasien" @click="hapus(item)" />
                </div>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </q-list>
    </div>

    <!-- General COnsent -->
    <app-general-consent :key="pasien" v-model="openGen" :pasien="pasien" @close="openGen = !openGen"
      @open-preview-gc="openPreviewGc()" />
    <app-preview-general-consent :key="pasien" v-model="openPrevGc" :pasien="pasien"
      @close="openPrevGc = !openPrevGc" />
    <app-dialog-form v-model="dialog" title="Alasan Pengajuan SEP" @save-form="simpanPengajuan()">
      <template #default>
        <div>
          <div class="row q-mb-sm">
            <div class="col-12">
              <app-autocomplete v-model="jenisPengajuan" label="Jenis Pengajuan" option-value="value"
                option-label="nama" :source="jenisPengajuans" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <app-input v-model="keterangan" label="keterangan" />
            </div>
          </div>
        </div>
      </template>
    </app-dialog-form>
    <DialogSep />
    <!-- dialog hapus -->
    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="row items-center text-weight-bold f-18 q-pa-xl">
          <span class="q-ml-sm">Nomor SEP Belum Tercatat di data Rumah Sakit !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn push no-caps label="Batal" color="dark" @click="batal" />
          <q-btn push no-caps label="Ambil Data SEP" color="primary" @click="ambil" />
          <q-btn push no-caps label="Tidak Dibuatkan SEP" color="primary" @click="tidak" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <app-dialog-not-full v-model="openDialog" @on-ok="openDialog = false" @on-cancel="openDialog = false"
      label="Detail informasi Antrian yang di dapat dari BPJS">
      <template #default>
        <div class="q-pa-lg">
          <div v-for="perseta in isPeserta" :key="perseta" class="q-my-md">
            <div class="row " style="min-width: 700px;">
              <div class="col-10">
                <div class="row">
                  <div class="col-4">Nomor Referensi</div>
                  <div class="col-8">{{ perseta?.nomorreferensi }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Kode Booking</div>
                  <div class="col-8">{{ perseta?.kodebooking }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Nomor Rekam Medis</div>
                  <div class="col-8">{{ perseta?.norekammedis }}</div>
                </div>
                <div class="row">
                  <div class="col-4">NIK</div>
                  <div class="col-8">{{ perseta?.nik }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Nomor Kartu</div>
                  <div class="col-8">{{ perseta?.nokapst }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Nomor Antrian</div>
                  <div class="col-8">{{ perseta?.noantrean }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Tanggal Antrian</div>
                  <div class="col-8">{{ dateFullFormat(perseta?.tanggal) }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Status Layanan</div>
                  <div class="col-8">{{ perseta?.status }}</div>
                </div>
                <div class="row">
                  <div class="col-4">Sumber Data</div>
                  <div class="col-8">{{ perseta?.sumberdata }}</div>
                </div>
              </div>
              <div class="col-2">
                <div
                  v-if="perseta?.status?.toLowerCase() == 'belum dilayani' && isPeserta?.length == 1 && cekTanggal(perseta?.tanggal)"
                  class="row">
                  <!-- <app-btn label="Kirim Ulang Antrian" @click="kirimUlang(perseta)" :loading="perseta?.loading"
                    :disable="perseta?.loading" /> -->
                </div>
              </div>
            </div>
            <q-separator class="q-my-md" />
          </div>
          <!-- {{ isPeserta }} -->
        </div>
      </template>
    </app-dialog-not-full>
    <app-dialog-not-full v-model="isOpenResp" @on-ok="isOpenResp = false" @on-cancel="isOpenResp = false"
      label="Detail informasi Request">
      <template #default>
        <div class="q-pa-lg" style="min-width: 850px;">
          <div v-if="dataResp[0]?.url == '/antrean/add'" class="row bg-dark text-white">
            <div class="col-2">Task Id</div>
            <div class="col-2">Kode Booking</div>
            <div class="col-3">Nomor Referensi</div>
            <div class="col-1">No Antr</div>
            <div class="col-2">Angka Antrean</div>
            <div class="col-2">Tgl Periksa</div>
          </div>
          <div v-else class="row bg-dark text-white">
            <div class="col-2">Task Id</div>
            <div class="col-4">Kode Booking</div>
            <div class="col-6 ">Tanggal dan jam task id</div>
          </div>
          <div v-for="data in dataResp" :key="data">
            <div class="row" v-if="data?.url == '/antrean/add'">
              <div class="col-2">Tambah Antrian</div>
              <div class="col-2">{{ data?.request?.kodebooking }}</div>
              <div class="col-3">{{ data?.request?.nomorreferensi }}</div>
              <div class="col-1">{{ data?.request?.nomorantrean }}</div>
              <div class="col-2">{{ data?.request?.angkaantrean }}</div>
              <div class="col-2">{{ dateFullFormat(data?.request?.tanggalperiksa) }}</div>
            </div>
            <div class="row" v-else>
              <div class="col-2">{{ data?.request?.taskid }}
              </div>
              <div class="col-4">{{ data?.request?.kodebooking }}</div>
              <div class="col-6 ">{{ date.formatDate(new Date(data?.request?.waktu), 'DD MMMM YYYY HH:mm:ss') }}
              </div>
            </div>
            <!-- {{ data }} -->
          </div>
        </div>
      </template>
    </app-dialog-not-full>
  </div>
</template>

<script setup>
import { date } from 'quasar'
import DialogSep from './DialogSep.vue'
import { api } from 'src/boot/axios'
import { dateFullFormat, formatJam } from 'src/modules/formatter'
import { notifCenterVue } from 'src/modules/utils'
import { useSepBpjsStore } from 'src/stores/simrs/pendaftaran/kunjungan/bpjs/sep'
import { ref } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  loadingH: { type: Boolean, default: false },
  loadingBpjs: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  antrian: { type: Array, default: () => [] },
})
// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['hapus', 'kirim'])

const temp = ref(null)
const confirm = ref(false)
const tempData = ref(null)
const tasks = ref([
  'add',
  '1',
  '2',
  '3',
  '4',
  '5',
  // '6',
  // '7'
])
const pesertaTertampung = ref(null)
const openDialog = ref(false)
const isPeserta = ref(null)
function cekTanggal (tgl) {
  const tgl_kunjungan = new Date(tgl)

  const now = new Date()
  const semingguLalu = new Date()
  semingguLalu.setDate(now.getDate() - 7)
  if (tgl_kunjungan >= semingguLalu) return true
  else return false
}
function cekAddAntrian (item) {
  const addAntr = cariResponse('add', item?.bpjshttprespon)
  const statusAnt = getSatusAntrianBpjs(item)
  // console.log('cek add', addAntr[0]?.respon?.metadata?.code, statusAnt, item, statusAnt[0]?.sumberdata == "Mobile JKN")
  if (statusAnt[0]?.sumberdata == "Mobile JKN") return true
  else {
    return addAntr[0]?.respon?.metadata?.code == 200 ? true : false
  }

}
function showAntiran (item) {
  isPeserta.value = getSatusAntrianBpjs(item)
  openDialog.value = true
  pesertaTertampung.value = item
}
function kirimUlangitem (item, peserta) {
  item.loading = true
  pesertaTertampung.value = item
  kirimUlang(peserta)
}
function getSatusAntrianBpjs (value) {
  const peserta = props.antrian.filter((item) => {
    const samePerson = (item.nokapst === value.noka || item.nik === value.nktp)
    const d1 = new Date(item?.tanggal)
    const d2 = new Date(value?.tgl_kunjungan)
    const sameDate = date.formatDate(d1, 'YYYY-MM-DD') === date.formatDate(d2, 'YYYY-MM-DD')
    // console.log('get', d1, d2, sameDate)
    return samePerson && sameDate
  })
  // console.log('get', peserta, value)
  return peserta ?? null
}
const isOpenResp = ref(false)
const dataResp = ref(null)
function detailResponse (task, item) {
  isOpenResp.value = true
  dataResp.value = cariResponse(task, item)
}
function cariResponse (task, item) {
  let data = null
  if (task == 'add') data = item?.filter(x => x.url == '/antrean/add')
  else data = item?.filter(x => x.url == 'antrean/updatewaktu' && parseInt(x.request?.taskid) == parseInt(task))
  // console.log('task', task, 'item', item, 'data', data)
  return data
}
function kirimUlang (pst) {
  pst.loading = true
  const kodebooking = pst?.kodebooking
  const resBpjs = pesertaTertampung.value?.bpjshttprespon
  const statusAnt = getSatusAntrianBpjs(pesertaTertampung.value)
  const maxTask = pesertaTertampung.value?.taskid?.map(x => parseInt(x?.taskid)).reduce((a, b) => Math.max(a, b), -Infinity)
  const taskId = maxTask == 7 ? (statusAnt[0]?.sumberdata == "Mobile JKN" ? ['3', '4', '5', '6', '7'] : ['1', '2', '3', '4', '5', '6', '7']) : (statusAnt[0]?.sumberdata == "Mobile JKN" ? ['3', '4', '5'] : ['1', '2', '3', '4', '5'])
  const resp = []
  console.log('maks', maxTask)

  taskId?.forEach((item) => {
    const res = cariResponse(item, resBpjs)
    if (res?.length > 0) {
      console.log('res')

      if (parseInt(item) == 3 && res[0].metadata?.message?.includes('Waktu')) {
        const waktu = res[0].request.waktu + 1000
        res[0].request.waktu = waktu
      }
      resp.push(res[0])
    }
    else {
      // console.log('item', item)
      if (kodebooking.endsWith('/J') && (parseInt(item) >= 3)) {
        const before = cariResponse((parseInt(item) - 1), resBpjs)
        const after = cariResponse((parseInt(item) + 1), resBpjs)
        let waktu = new Date(pesertaTertampung.value?.tgl_kunjungan).getTime()
        console.log('waktu', dateFullFormat(waktu))
        if (before?.length > 0) waktu = before[0].request.waktu + 1800000
        else if (after?.length > 0) waktu = after[0].request.waktu - 1800000
        console.log('waktu2', dateFullFormat(waktu))

        resp.push({
          request: {
            taskid: parseInt(item),
            waktu: waktu,
          },
          respon: { metadata: { code: 201 } }
        })
      } else if (!kodebooking.endsWith('/J') && (parseInt(item) >= 3)) {
        const before = cariResponse((parseInt(item) - 1), resBpjs)
        const after = cariResponse((parseInt(item) + 1), resBpjs)
        let waktu = new Date(pesertaTertampung.value?.tgl_kunjungan).getTime()
        if (before?.length > 0) waktu = before[0].request.waktu + 1800000
        else if (after?.length > 0) waktu = after[0].request.waktu - 1800000
        console.log('waktu', dateFullFormat(waktu))
        resp.push({
          request: {
            taskid: parseInt(item),
            waktu: waktu,

          },
          respon: { metadata: { code: 201 } }
        })
      }
    }
    // console.log('item', res)

  })
  // console.log('pst', pst, pesertaTertampung.value)
  // console.log('resp', resp)
  const raw = []
  if (resp?.length > 0) {
    resp?.forEach((item) => {
      raw.push({
        kodebooking: kodebooking,
        taskid: parseInt(item?.request?.taskid),
        waktu: item?.request?.waktu,
        noreg: item?.noreg ?? pesertaTertampung.value?.noreg,
        code: item?.respon?.metadata?.code
      })
      // if (parseInt(item?.respon?.metadata?.code) != 200) {
      // }
    })
    // 1️⃣ sort DESC dulu berdasarkan taskid
    // const desc = raw.sort((a, b) => b.taskid - a.taskid)

    // // 2️⃣ pastikan waktu makin kecil ke bawah (dikurangi)
    // for (let i = 1; i < desc.length; i++) {
    //   if (desc[i].waktu >= desc[i - 1].waktu) {
    //     // misal kurangi 1 detik (1000 ms)
    //     desc[i].waktu = desc[i - 1].waktu - 6000
    //   }
    // }

    // 3️⃣ terakhir sort ASC lagi biar urut normal
    // const sorted = desc.sort((a, b) => a.taskid - b.taskid)
    const sorted = raw.sort((a, b) => a.taskid - b.taskid)
    // pastikan waktu makin besar seiring taskid
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].waktu <= sorted[i - 1].waktu) {
        // misal tambahin 1 detik (1000 ms) biar lebih besar dikit
        sorted[i].waktu = sorted[i - 1].waktu + 4000
      }
    }
    const payload = {
      task: sorted.filter(x => x.code == 201),
      kodebooking,
      noreg: pesertaTertampung.value?.noreg
    }

    emits('kirim', payload)

    console.log('pay', sorted)

  }

}
function batal () {
  temp.value = ''
  tempData.value = ''
  confirm.value = false
}
function ambil () {
  loadingReSep.value = tempData.value.noreg
  sepStore.getSep(tempData.value).then(resp => {
    console.log('resp sep', resp)
    loadingReSep.value = ''
    tempData.value = null
    // emits('hapus', item)
    console.log('Cancel dalem', loadingReSep.value)
  })
  confirm.value = false
}
function tidak () {
  emits('hapus', tempData.value)
  confirm.value = false
}
function hapus (item) {
  temp.value = item.noka
  if (item.sep) {
    emits('hapus', item)
  } else {
    console.log('anu')
    confirm.value = true
    tempData.value = item
    // Dialog.create({
    //   title: 'Tidak Ada SEP',
    //   message: 'Nomor SEP Belum Tercatat di data Rumah Sakit',
    //   ok: {
    //     label: 'Tidak Dibuatkan SEP',
    //     'no-caps': true,
    //     color: 'primary'
    //   },
    //   cancel: {
    //     label: 'Ambil Data SEP',
    //     'no-caps': true,
    //     color: 'primary'
    //   }
    // })
    //   .onOk(() => {
    //     console.log('OK')
    //     emits('hapus', item)
    //   })
    //   .onCancel(() => {
    //     loadingReSep.value = item.noreg
    //     sepStore.getSep(item).then(resp => {
    //       console.log('resp sep', resp)
    //       loadingReSep.value = ''
    //       // emits('hapus', item)
    //       console.log('Cancel dalem', loadingReSep.value)
    //     })
    //     console.log('Cancel', loadingReSep.value)
    //   })
  }
}

const pasien = ref(null)
const openGen = ref(false)
const openPrevGc = ref(false)

function openPreviewGc () {
  openPrevGc.value = !openPrevGc.value
}

const dialog = ref(false)
const loadingP = ref(false)
const jenisPengajuans = ref([
  { nama: 'pengajuan backdate', value: '1' },
  { nama: 'pengajuan finger print', value: '2' }
])
const keterangan = ref('')
const jenisPengajuan = ref('2')
function PengajuanSep (val) {
  dialog.value = true
  temp.value = val.noka
}
const sepStore = useSepBpjsStore()
const loadingReSep = ref(null)
function bukaSep (val) {
  console.log('buka sep', val)
  // sepStore.setOpen()
  loadingReSep.value = val.noreg
  // const form = {
  //   noreg: val.noreg,
  //   norm: val.norm,
  //   noka: val.noka
  // }
  if (!val.sep) {
    sepStore.getSep(val)
  }
}
function simpanPengajuan () {
  const data = {
    noka: temp.value,
    jenispengajuan: jenisPengajuan.value,
    keterangan: keterangan.value
  }
  console.log(data)
  dialog.value = false
  return new Promise(resolve => {
    loadingP.value = true
    api.post('v1/simrs/bridgingbpjs/pendaftaran/pengajuansep', data)
      .then(resp => {
        loadingP.value = false
        if (resp.metadata.code === '200' || resp.status === 200) {
          notifCenterVue('Pengajuan SEP sudah disampaikan')
        }
        jenisPengajuan.value = '2'
        keterangan.value = ''
        resolve(resp)
      })
      .catch(() => {
        loadingP.value = false
      })
  })
}
function getStatus (arr) {
  if (arr?.length === 0) {
    return '-'
  }

  // 1 (mulai waktu tunggu admisi),
  // 2 (akhir waktu tunggu admisi/mulai waktu layan admisi),
  // 3 (akhir waktu layan admisi/mulai waktu tunggu poli),
  // 4 (akhir waktu tunggu poli/mulai waktu layan poli),
  // 5 (akhir waktu layan poli/mulai waktu tunggu farmasi),
  // 6 (akhir waktu tunggu farmasi/mulai waktu layan farmasi membuat obat),
  // 7 (akhir waktu obat selesai dibuat),
  // 99 (tidak hadir/batal)
  const arr0 = arr[0].taskid
  let text
  switch (arr0) {
    case '1' || 1:
      text = 'Menunggu di Admisi'
      break
    case '2' || 2:
      text = 'Pelayanan di Admisi'
      break
    case '3' || 3:
      text = 'Menunggu di Poli'
      break
    case '4' || 4:
      text = 'Pelayanan di Poli'
      break
    case '5' || 5:
      text = 'Menunggu di Farmasi'
      break
    case '6' || 6:
      text = 'Farmasi'
      break
    case '7' || 7:
      text = 'Sudah Ambil Obat di Farmasi'
      break
    default:
      text = 'Tidak Hadir/ Batal'
  }
  return text
}

function genCon (row) {
  // console.log(row)
  pasien.value = row
  openGen.value = !openGen.value
}
</script>
<style scoped>
.qrcode {
  display: inline-block;
  font-size: 0;
  margin: 0;
  position: relative;
}
</style>
