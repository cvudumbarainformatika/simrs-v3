<template>
  <table style="width: calc(80vw + 10px); margin-bottom: 10px;">
    <thead class="my-sticky-header-table">
      <tr>
        <th width="5%">
          No
        </th>
        <th>
          Nama
        </th>
        <th>
          Persediaan Awal
        </th>
        <th>
          Penambahan
        </th>
        <th>
          Pemakaian
        </th>
        <th>
          Sisa
        </th>
        <th>
          Total
        </th>
        <!-- <th>
          Jumlah Akhir
        </th> -->
        <th>
          #
        </th>
      </tr>
      <tr>
        <th colspan="2" style="max-width: 200px;">
          <div>
            <app-autocomplete-new v-model="store.formKasa.kode" label="" :source="store.masterKasa" outlined dense
              clearable option-label="nama" option-value="kode" autocomplete="nama" @update:model-value="setKasa" />
          </div>
        </th>
        <th style="max-width: 100px;">
          <app-input ref="refAwal" v-model="store.formKasa.awal" label="" outlined dense
            @update:model-value="hitung($event, 'awal')" />
        </th>
        <th style="max-width: 100px;">
          <app-input v-model="store.formKasa.tambah" label="" outlined dense valid
            @update:model-value="hitung($event, 'tambah')" />
        </th>
        <th style="max-width: 100px;">
          <app-input ref="refPakai" v-model="store.formKasa.pakai" label="" outlined dense
            @update:model-value="hitung($event, 'pakai')" />
        </th>
        <th>
          {{ store.formKasa.sisa ?? 0 }}
        </th>
        <th>
          {{ store.formKasa.akhir ?? 0 }}
        </th>
        <!-- <th>
          {{ parseInt(store.formKasa.tambah ?? 0) + parseInt(store.formKasa.awal ?? 0) }}
        </th> -->
        <th>
          <q-btn dense color="green" label="simpan" no-caps :loading="store.loading" :disable="store.loading"
            @click="simpan" />
        </th>
      </tr>
    </thead>

    <tbody>
      <!-- inventaris_kasa -->
      <template v-if="store.loading">
        <tr>
          <td>
            <app-loading />
          </td>
        </tr>
      </template>

      <template v-else-if="!store?.pasien?.inventaris_kasa?.length">
        <tr>
          <td colspan="8">
            <app-no-data />
          </td>
        </tr>
      </template>
      <template v-else>
        <template v-for="(item, n) in store?.pasien?.inventaris_kasa" :key="n">
          <tr :class="n % 2 === 0 ? 'even' : 'odd'">
            <td width="5%">
              <div class="row items-center">
                {{ n + 1 }}
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row  q-mr-sm">
                <div class="col-auto">
                  {{ item?.nama }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row justify-end q-mr-sm">
                <div class="col-auto">
                  {{ item?.awal }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row justify-end q-mr-sm">
                <div class="col-auto">
                  {{ item?.tambah }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row justify-end q-mr-sm">
                <div class="col-auto">
                  {{ item?.pakai }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row justify-end q-mr-sm">
                <div class="col-auto">
                  {{ item?.sisa }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row justify-end q-mr-sm">
                <div class="col-auto">
                  {{ item?.akhir }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row justify-end items-center">
                <div class="col-auto q-mr-sm">
                  <q-btn dense flat rounded color="primary" icon="edit" size="10px" @click="edit(item)" />
                </div>
                <div class="col-auto q-mr-sm">
                  <q-btn dense flat rounded color="negative" icon="delete_sweep" size="10px" @click="hapus(item)" />
                </div>
              </div>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { Dialog } from 'quasar'
import { notifErrVue } from 'src/modules/utils'
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { onMounted, ref } from 'vue'

const store = useSurgicalSafetyStore()
function hitung (event, type) {
  console.log('evt', event, type)
  store.formKasa[type] = event
  const awal = parseInt(store.formKasa.awal ?? 0)
  const tambah = parseInt(store.formKasa.tambah ?? 0)
  const pakai = parseInt(store.formKasa.pakai ?? 0)
  store.formKasa.sisa = awal + tambah - pakai
  store.formKasa.akhir = store.formKasa.sisa + pakai

}
const refAwal = ref(null)
const refPakai = ref(null)
function simpan () {
  console.log('awal', refAwal.value?.refInput)
  if (refAwal.value?.refInput?.validate() && refPakai.value?.refInput?.validate()) {

    store.simpanKasa().then(() => {
      refAwal.value?.refInput?.resetValidation()
      refPakai.value?.refInput?.resetValidation()
    })
  } else notifErrVue('Silahkan Isi yang belum lengkap')
}
function setKasa (val) {
  const master = store.masterKasa.find(item => item?.kode === val)
  console.log('set', val, master)
  if (val) store.setFormKasa('nama', master?.nama)
  else store.setFormKasa('nama', '')
}
function edit (val) {
  console.log('edit', val)
  store.resetFormKasa()
  store.setFormKasa('awal', val?.awal)
  store.setFormKasa('tambah', val?.tambah)
  store.setFormKasa('pakai', val?.pakai)
  store.setFormKasa('sisa', val?.sisa)
  store.setFormKasa('akhir', val?.akhir)
  store.setFormKasa('nama', val?.nama)
  store.setFormKasa('kode', val?.kode)

  const awal = parseInt(store.formKasa.awal ?? 0)
  const tambah = parseInt(store.formKasa.tambah ?? 0)
  const pakai = parseInt(store.formKasa.pakai ?? 0)
  store.formKasa.sisa = awal + tambah - pakai
  store.formKasa.akhir = store.formKasa.sisa + pakai
}
function hapus (val) {
  // console.log('hapus', val)
  Dialog.create({
    title: 'Konfirmasi',
    message: 'Apakah anda yakin akan menghapus data ini ?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    store.hapusKasa(val)
  })

}
onMounted(() => {
  setTimeout(() => {
    refAwal.value?.refInput?.resetValidation()
    refPakai.value?.refInput?.resetValidation()
  }, 200)
})
</script>
<style lang="scss" scoped>
.hv:hover {
  background-color: #0D5A86;
  color: #fff
}

.gt {
  border-top: 1px solid black;
}

.gka {
  border-right: 1px solid black;
}

.gki {
  border-left: 1px solid black;
}

.gb {
  border-bottom: 1px solid black;
}

//
.head {
  border: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
}

.child {
  border-bottom: 1px solid rgb(44, 43, 43);
  border-left: 1px solid rgb(44, 43, 43);
  border-right: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
}

.text-end {
  text-align: end;
}

/* Standard Tables */

table {
  // margin: 1em 0;
  border-collapse: collapse;
  border: 1px solid #d6d6d6;
  width: 100%;
  margin-bottom: 50px;
}

thead {
  border: 1px solid black;

  tr {
    th {
      border: 1px solid black;
      vertical-align: center !important;
      background-color: white;
      color: black;
    }
  }
}

.odd {
  background-color: rgba(255, 255, 255, 0.05);
}

.even {
  background-color: rgba(0, 0, 0, 0.05);
}

td {

  text-align: left;
  text-indent: 2px;
  border: 1px solid black;
  vertical-align: center;
  border: 1px solid black;
}

tr:nth-child(even) th[scope=row] {
  background-color: #f2f2f2;
}

tr:nth-child(odd) th[scope=row] {
  background-color: #fff;
}

th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 5;
  border: inherit;
}

th[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
  border: inherit;
}

th[scope=row] {
  vertical-align: top;
  color: inherit;
  background-color: inherit;
  background: linear-gradient(90deg, transparent 0%, transparent calc(100% - .05em), #d6d6d6 calc(100% - .05em), #d6d6d6 100%);
  border: inherit;
}

table:nth-of-type(2) th:not([scope=row]):first-child {
  left: 0;
  z-index: 3;
  background: linear-gradient(90deg, #666 0%, #666 calc(100% - .05em), #ccc calc(100% - .05em), #ccc 100%);
}

/* Strictly for making the scrolling happen. */

th[scope=row]+td {
  min-width: 24em;
}

th[scope=row] {
  min-width: 20em;
}
</style>
