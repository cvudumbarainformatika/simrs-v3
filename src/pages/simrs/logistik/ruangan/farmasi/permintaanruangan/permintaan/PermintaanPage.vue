<template>
  <!-- head -->
  <div
    class="fixed-top row no-wrap items-center justify-between q-mx-sm bg-white"
    style="z-index: 10;"
  >
    <div>
      <div class="row items-center">
        <div class="q-mr-md">
          No Permintaan:
        </div>
        <div class="q-mr-sm">
          {{ store.form.no_permintaan ? store.form.no_permintaan :'-' }}
        </div>
        <!-- <app-input
          v-model="store.form.no_permintaan"
          label="Nomor Permintaan"
          outlined
          readonly
          valid
          :loading="store.loading"
        /> -->
        <div class="q-ml-md">
          <q-btn
            v-if="store.form.no_permintaan"
            flat
            icon="icon-mat-send"
            dense
            color="primary"
            :loading="store.loadingKunci"
            @click="store.selesaiDanKunci()"
          >
            <q-tooltip
              class="primary"
              :offset="[10, 10]"
            >
              Kirim Permmintaan Ke Depo
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
    <div>
      <q-btn
        flat
        :icon="!style.componentfull ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'"
        round
        :color="style.componentfull ? 'green' : 'primary'"
        size="12px"
        class="q-ml-md"
        @click="style.setComponentFull"
      />
    </div>
  </div>
  <!-- Permintaan -->
  <div class="q-mt-lg q-py-md q-px-sm">
    <div class="row q-col-gutter-md ">
      <div class="col-6">
        <div class="row q-mb-xs">
          <div class="col-12">
            <app-input-date-human
              :model="store.disp.tgl_permintaan"
              label="Tanggal Transaksi"
              outlined
              @set-display="dispTanggal"
              @db-model="setTanggal"
            />
          </div>
        </div>

        <div v-if="apps.user.pegawai.role_id === 1">
          <div class="row no-wrap q-mb-xs">
            <div class="col-12">
              <app-autocomplete
                v-model="store.form.tujuan"
                label="Pilih Depo"
                option-label="nama"
                option-value="value"
                outlined
                clearable
                :source="store.depos"
                @selected="gudangSelected"
              />
            </div>
          </div>
          <div class="row no-wrap q-mb-xs">
            <div class="col-12">
              <app-autocomplete
                v-model="store.form.dari"
                label="Pilih Ruangan"
                option-label="uraian"
                option-value="kode"
                outlined
                clearable
                :source="apps.ruangs"
                @selected="depoSelected"
              />
            </div>
          </div>
          <div class="row no-wrap q-mb-xs">
            <div class="">
              <app-btn
                label="Ambil data Obat"
                :disable="store.loadingObat"
                :loading="store.loadingObat"
                @click="store.getListObat"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row no-wrap q-mb-xs">
          <div class="col-4">
            Penanggung Jawab
          </div>
          <div class="col-8 text-weight-bold">
            {{ user.nama }}
          </div>
        </div>
        <div v-if="apps.user.pegawai.role_id !== 1">
          <div class="row no-wrap q-mb-xs">
            <div class="col-4">
              Depo Asal :
            </div>
            <div
              v-if="store.disp.gudang"
              class="col-4 text-weight-bold"
            >
              {{ store.disp.gudang }}
            </div>
            <div
              v-if="!store.disp.gudang"
              class="col-4 text-weight-bold text-negative"
            >
              Anda Tidak Memiliki Akses Permintaan Ruangan
            </div>
            <div class="col-4 text-cyan">
              ({{ store.form.tujuan ? store.form.tujuan :'-' }})
            </div>
          </div>
          <div class="row no-wrap q-mb-xs">
            <div class="col-4 ">
              Ruang Tujuan :
            </div>
            <div
              v-if="store.disp.depo"
              class="col-4 text-weight-bold"
            >
              {{ store.disp.depo }}
            </div>
            <div
              v-if="!store.disp.depo"
              class="col-4 text-weight-bold text-negative"
            >
              Anda Tidak Memiliki Akses Permintaan Ruangan
            </div>
            <div class="col-4 text-cyan">
              ({{ store.form.dari ? store.form.dari :'-' }})
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-grey-2">
      <!-- <div
        class="row bg-grey q-pa-sm"
      >
        <div class="f-14 text-weight-bold">
          Rincian Permintaan
        </div>
      </div> -->
      <div
        class="row bg-grey q-pa-xs q-mt-sm"
      >
        <div class="f-12 text-weight-bold">
          Rincian Permintaan Obat
        </div>
      </div>
      <div class="row q-my-sm q-col-gutter-md">
        <div class="col-6">
          <div class="row q-mb-xs">
            <div
              class="col-12"
            >
              <CompSelect
                ref="refObat"
                :model="store.form.kdobat"
                autocomplete="nama_obat"
                option-label="nama_obat"
                option-value="kdobat"
                label="Cari Obat"
                outlined
                :debounce="700"
                :source="store.obats"
                :loading="store.loadingObat"
                @on-select="store.obatSelected"
                @clear="store.clearObat"
                @buang="store.cariObat"
              />
            </div>
          </div>
          <div class="row q-mb-xs">
            <div class="col-12">
              <app-input
                ref="refJumlahMinta"
                v-model="store.form.jumlah_minta"
                label="Jumlah Minta"
                outlined
                :rules="[
                  val => !isNaN(val) || 'Harus pakai Nomor'
                ]"
                @update:model-value="setJumlahMinta($event)"
              />
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="row q-mb-xs">
            <div>Kode Barang</div>
            <div class="q-ml-sm text-weight-bold">
              {{ store.form.kdobat ? store.form.kdobat:'-' }}
            </div>
          </div>
          <div class="row q-mb-xs">
            <div>Stok user</div>
            <div class="q-ml-sm text-weight-bold">
              {{ store.form.stok ? store.form.stok : 0 }}
            </div>
          </div>
          <div class="row q-mb-xs">
            <div>Stok Alokasi</div>
            <div class="q-ml-sm text-weight-bold">
              {{ store.form.stok_alokasi ? store.form.stok_alokasi:0 }}
            </div>
          </div>
          <div class="row no-wrap q-mb-xs items-center">
            <div>Max Stok</div>
            <div
              v-if="store.form.mak_stok"
              class="q-ml-sm text-weight-bold"
            >
              {{ store.form.mak_stok }}
            </div>
            <div
              v-if="!store.form.mak_stok"
              class="q-ml-sm "
            >
              <div class="row no-wrap items-center">
                <div class="q-mr-sm text-weight-bold">
                  tidak ada
                </div>
                <div
                  v-if="(store.form.kdobat && !mintaMax) "
                  class="q-mr-sm"
                >
                  <app-btn
                    label="Minta Max Stok"
                    color="orange"
                    @click="setMinta"
                  />
                </div>
                <div
                  v-if="store.form.kdobat && mintaMax"
                  class="q-mr-sm"
                >
                  <app-input
                    v-model="JumlahMintaMin"
                    label="Jumlah Minta Min"
                    outlined
                    :loading="store.loadingMax"
                  />
                </div>
                <div
                  v-if="store.form.kdobat && mintaMax"
                  class="q-mr-sm"
                >
                  <app-input
                    v-model="JumlahMintaMax"
                    label="Jumlah Minta Max"
                    outlined
                    :loading="store.loadingMax"
                    @update:model-value="numberMax"
                  />
                </div>
                <div
                  v-if="store.form.kdobat && mintaMax"
                  class="q-mr-sm"
                >
                  <app-btn
                    label="Simpan Permintaan Max Depo"
                    color="primary"
                    :disable="store.loadingMax"
                    :loading="store.loadingMax"
                    @click="simpanMintaAlokasi"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-my-sm q-mr-lg justify-end">
        <app-btn
          label="Simpan Rincian"
          :disable="store.loading"
          :loading="store.loading"
          @click="simpan"
        />
      </div>
      <div
        class="row bg-grey q-pa-xs"
      >
        <div class="f-12 text-weight-bold">
          Rincian Permintaan Tersimpan
        </div>
      </div>
      <div v-if="store.details?.length">
        <div
          v-for="(det,i) in store.details"
          :key="i"
          class="anu"
        >
          <div class="row no-wrap">
            <div class="col-6">
              <div class="row no-wrap justify-between q-mr-sm det">
                <div>Kode</div>
                <div class="text-weight-bold">
                  {{ det.kdobat? det.kdobat:'-' }}
                </div>
              </div>
              <div class="row no-wrap justify-between q-mr-sm det">
                <div>Nama</div>
                <div class="text-weight-bold">
                  {{ det.nama_obat? det.nama_obat:'-' }}
                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="row no-wrap justify-between q-mr-md det">
                <div>Jumlah Minta</div>
                <div class="text-weight-bold">
                  {{ det.jumlah_minta ? det.jumlah_minta : '-' }}
                </div>
              </div>
              <!-- <div class="row no-wrap justify-between q-mr-md det">
                <div>Stok Alokasi</div>
                <div class="text-weight-bold">
                  {{ det.stok_alokasi ? det.stok_alokasi : '-' }}
                </div>
              </div> -->
              <div class="row no-wrap justify-between q-mr-md det">
                <div>Stok Maksimal</div>
                <div class="text-weight-bold">
                  {{ det.mak_stok ? det.mak_stok : '-' }}
                </div>
              </div>
              <!-- <div class="row no-wrap justify-between q-mr-md det">
                <div>Status obat</div>
                <div class="text-weight-bold">
                  {{ det.status_obat ? det.status_obat : '-' }}
                </div>
              </div> -->
            </div>
            <div class="col-1 text-right">
              <q-btn
                flat
                icon="icon-mat-delete"
                dense
                color="negative"
                size="sm"
                :loading="det.loading"
                @click="hapus(det)"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Hapus Obat
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!store.details?.length">
        <app-no-data />
      </div>
    </div>
  </div>
</template>
<script setup>
import { notifErrVue, notifInfVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useStyledStore } from 'src/stores/app/styled'
import { useFarmasiPermintaanRuanganStore } from 'src/stores/simrs/farmasi/permintaanruangan/permintaan'
import { computed, onMounted, ref, onUnmounted } from 'vue'

import CompSelect from './comp/CompSelect.vue'
import { Dialog } from 'quasar'

const style = useStyledStore()
const store = useFarmasiPermintaanRuanganStore()

const mintaMax = ref(false)
const JumlahMintaMax = ref(0)
const JumlahMintaMin = ref(5)
function setMinta () {
  mintaMax.value = true
}
function numberMax (val) {
  const temp = !isNaN(parseFloat(val)) ? parseFloat(val) : 0
  JumlahMintaMax.value = temp
}
function simpanMintaAlokasi () {
  const mintamax = !isNaN(parseFloat(JumlahMintaMax.value)) ? parseFloat(JumlahMintaMax.value) : 0
  const mintamin = !isNaN(parseFloat(JumlahMintaMin.value)) ? parseFloat(JumlahMintaMin.value) : 0
  if (mintamax > 0) {
    const data = {
      kd_obat: store.form.kdobat,
      kd_ruang: store.form.dari,
      min: mintamin,
      max: mintamax
    }
    store.simpanMintaMax(data).then(() => {
      mintaMax.value = false
      store.setForm('mak_stok', mintamax)
    })
  }
  else {
    notifErrVue('Jumlah Minta Max harus lebih besar dari 0')
  }
}
function setTanggal (val) {
  store.setForm('tgl_permintaan', val)
}
function dispTanggal (val) {
  store.setDisp('tgl_permintaan', val)
}

const apps = useAplikasiStore()
const user = computed(() => {
  if (apps.user.pegawai) {
    if (apps.user.pegawai.role_id === 1) {
      if (!store.form.dari) {
        store.setForm('dari', 'R-0202010')
        store.setParam('kddepo', 'R-0202010')
        // store.getListObat()
      }
      if (!store.form.tujuan) {
        store.setForm('tujuan', 'Gd-03010101')
        store.setParam('kdgudang', 'Gd-03010101')
        store.getListObat()
      }
    }
    else if (apps.user?.kdruangansim) {
      const peg = store.ruangans.filter(val => val.kode === apps.user?.kdruangansim)
      if (peg?.length) {
        store.setForm('dari', peg[0].kode)
        store.setDisp('depo', peg[0].uraian)
        const dep = store.floor.filter(a => a.kode === peg[0].kode)
        console.log('dep', dep)

        store.setForm('tujuan', 'Gd-03010101')
        store.setParam('kdgudang', 'Gd-03010101')
        store.setParam('kddepo', peg[0].kode)
        store.setDisp('gudang', 'Floor Stock 1 (AKHP)')
        store.getListObat()
      }
    }
  }
  return apps.user
})

function gudangSelected (val) {
  console.log('gudang', val)
  store.setParam('kdgudang', val)
}
function depoSelected (val) {
  console.log('depo', val)
  store.setParam('kddepo', val)
}

function setJumlahMinta (evt) {
  const inc = evt.includes('.')
  const ind = evt.indexOf('.')
  const panj = evt?.length
  const jumlah = isNaN(parseFloat(evt)) ? 0 : (inc && (ind === (panj - 2)) ? evt : parseFloat(evt))
  // const jumlah = !isNaN(parseFloat(evt)) ? parseFloat(evt) : 0
  store.setForm('jumlah_minta', jumlah)
  const max = parseFloat(store.form.mak_stok) ?? 0
  const stok = parseFloat(store.form.stok) ?? 0
  const bisaMinta = max - stok
  const alokasi = !isNaN(parseFloat(store.form.stok_alokasi)) ? parseFloat(store.form.stok_alokasi) : 0
  if (bisaMinta < jumlah) {
    store.setForm('jumlah_minta', bisaMinta)
    notifInfVue('Jumlah minta tidak boleh melebihi stok maksimal user')
  }
  else if (alokasi < jumlah) {
    store.setForm('jumlah_minta', alokasi)
    notifInfVue('Jumlah minta tidak boleh melebihi alokasi')
  }
  else {
    store.setForm('jumlah_minta', jumlah)
  }
}

const refObat = ref(null)
const refJumlahMinta = ref(null)
function validasi () {
  const obat = refObat.value?.$refs?.refAuto.validate()
  const jumlah = refJumlahMinta.value?.$refs?.refInput.validate()
  // console.log(jumlah)
  const adaMax = store.form.mak_stok ? (parseFloat(store.form.mak_stok) > 0) : false
  const adaAlokasi = store.form.stok_alokasi ? (parseFloat(store.form.stok_alokasi) >= 0) : false
  const adaJumlahMinta = store.form.jumlah_minta ? (parseFloat(store.form.jumlah_minta) > 0) : false
  if (obat && jumlah && adaMax && adaAlokasi && adaJumlahMinta) return true
  else if (adaMax && adaAlokasi && adaJumlahMinta) {
    return true
  }
  else {
    if (!adaMax) notifErrVue('Tidak Ada Jumlah Stok Maksimal Depo, Silahkan Minta Stok Maksimal Terlebih dahulu')
    if (!adaAlokasi) notifErrVue('Tidak Ada Jumlah Stok Alokasi, Pastikan ada Stok di gudang dan pastikan tidak ada transaksi permintaan yang belum selesai')
    if (!adaJumlahMinta) notifErrVue('Tidak Ada Jumlah Minta, Silahkan Isi Jumlah Minta')
    return false
  }
}
function simpan () {
  console.log('form', store.form)
  if (validasi()) {
    console.log('disp', store.disp)
    store.simpan()
  }
}

function hapus (det) {
  console.log('det', det)
  Dialog.create({
    title: 'Konfirmasi',
    message: 'Apakah Anda Ingin Menghapus ' + det?.nama_obat + ' ?',
    ok: {
      push: true,
      'no-caps': true,
      label: 'Hapus',
      color: 'negative'
    },
    cancel: {
      push: true,
      'no-caps': true,
      label: 'Batal',
      color: 'dark'
    }
  }).onOk(() => {
    store.hapusRinci(det).then(() => {
      store.getListObat()
      const index = store.details.findIndex(it => it.id === det.id)
      if (index >= 0) {
        store.details.splice(index, 1)
      }

      // if (!val.flag) val.flag = 1
    })
  })
}
onMounted(() => {
  store.getInitialData()
})
onUnmounted(() => {
  store.clearForm()
})
</script>
<style lang="scss" scoped>
.anu {
  margin-top: 1px;
  margin-bottom: 1px;
}

.anu:hover {
  background-color: #87e9df;
}
.det:hover {
  background-color: #3555f7;
  color: rgb(255, 255, 255);
}
</style>
