<template>
  <div class="fit column scroll">
    <q-form ref="formRef" @submit="onSubmit" class="">
      <div class="q-pa-md">
        <b>Ruangan Asal</b>
      </div>
      <q-separator class="" />

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-4">Asal Ruangan </div>
        <div class="col-8">: {{ asalRuangan?.kamar }}</div>
        <div class="col-4">Kamar </div>
        <div class="col-8">: {{ asalRuangan?.kd_kmr }}</div>
        <div class="col-4">Nomor Bed </div>
        <div class="col-8">: {{ asalRuangan?.no_bed }}</div>
        <div class="col-4">Tarip </div>
        <div class="col-8">: Rp. {{ formatRp(store?.tarip) }}</div>
      </div>


      <q-separator class="" />
      <div class="q-pa-md">
        <b>Ruangan Tujuan</b>
      </div>
      <q-separator class="" />

      <div class="row q-col-gutter-sm q-pa-md">

        <div class="col-4">Alasan Mutasi </div>
        <div class="col-8 flex q-gutter-x-sm ">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refRuangan" :model="store.form.kd_mutasi" label="Alasan" autocomplete="rs2"
              option-value="rs1" option-label="rs2" outlined :source="store.alasans" @on-select="(val) => {
                // console.log('val', val);

                store.form.kd_mutasi = val

              }" @clear="() => {
                store.form.kd_mutasi = null

              }" />
          </div>
        </div>


        <div class="col-4">Ruangan Tujuan </div>
        <div class="col-8 flex q-gutter-x-sm ">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refRuangan" :model="store.form.ruanganTujuan" label="Tujuan" autocomplete="rs2"
              option-value="rs1" option-label="rs2" outlined :source="store.ruangans" @on-select="(val) => {
                // console.log('val', val);

                store.form.ruanganTujuan = val
                store.showKamar(val)
                store.selectRuangan = store?.ruangans?.find((x) => x?.rs1 === val)?.rs2 || null
                store.form.kamar = null
                store.form.noBed = null
              }" @clear="() => {
                store.form.ruanganTujuan = null
                store.form.kamar = null
                store.selectRuangan = null
                store.form.noBed = null
              }" />
          </div>
        </div>
        <div class="col-4">Kamar </div>
        <div class="col-8 flex q-gutter-x-sm">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refKamar" :model="store.form.kamar" label="Kamar" autocomplete="rs1"
              option-value="rs1" option-label="rs1" outlined :source="store.kamars" @on-select="(val) => {
                // console.log('val', val);

                store.form.kamar = val


                store.showBed(store.selectRuangan, val)
                // ])
                store.form.noBed = null
              }" @clear="() => {
                store.form.kamar = null
                store.selectRuangan = null
                store.form.noBed = null
              }" />
          </div>
        </div>
        <div class="col-4">Nomor Bed </div>
        <div class="col-8 flex q-gutter-x-sm">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refBed" :model="store.form.noBed" label="No Bed" autocomplete="rs2"
              option-value="rs2" option-label="rs2" outlined :source="store.beds" @on-select="(val) => {
                // console.log('val', val);

                store.form.noBed = val
                // store.showKamar(val)
                // store.showBed(store.selectRuangan, val)
              }" @clear="() => {
                store.form.kamar = null
                store.selectRuangan = null
                store.form.noBed = null
              }" />
          </div>
        </div>
        <!-- <div class="col-4">Tarip </div>
        <div class="col-8">: Rp. tarrrrr</div> -->
      </div>
      <q-separator class="q-my-xs" />
      <div class="q-pa-md">
        <b>Doc Penyerahan Pasien</b>
        <q-separator />
      </div>
      <div class="row q-px-md q-col-gutter-x-xs">
        <div class="col-3">Derajat Pasien :</div>
        <app-input-simrs v-model="store.form.derajatPasien" label="Derajat Px" outlined dense class="col-4" />
        <div class="col-12 q-mb-xs">Objective :</div>
        <app-input-simrs label="Tensi (mmHg)" class="col-3" v-model="store.form.tensi" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) store.form.tensi = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="Nadi (x/mnt)" class="col-3" v-model="store.form.nadi" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) store.form.nadi = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="Suhu (°C)" class="col-3" v-model="store.form.suhu" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) store.form.suhu = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="RR (x/mnt)" class="col-3" v-model="store.form.rr" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) store.form.rr = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="SPO2 (%)" class="col-3" v-model="store.form.spo2" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) store.form.spo2 = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />

        <div class="col-12 q-mb-xs relative-position">
          <q-btn color="purple" class="relative-position justify-center" label="Terapi dan Obat" icon="icon-mat-add">
            <q-menu style="width:40%" class="bg-grey-3">
              <div class="row q-pa-md">
                <div class="column">
                  <div class=" text-weight-bold">Tambah Data Terapi</div>
                  <q-separator class=""></q-separator>
                </div>


              </div>
              <q-form class="q-px-md row">
                <app-input-simrs v-model="store.terapi.obat" label="Terapi / Obat" outlined dense class="col-12"
                  :valid="{ required: false }" />
                <app-input-simrs v-model="store.terapi.dosis" label="Dosis" outlined dense class="col-4"
                  :valid="{ required: false }" />
                <app-input-simrs v-model="store.terapi.jamMasuk" label="Jam Masuk" outlined dense class="col-4"
                  :valid="{ required: false }" />
                <app-input-simrs v-model="store.terapi.sisa" label="Sisa" outlined dense class="col-4"
                  :valid="{ required: false }" />
                <app-input-simrs v-model="store.terapi.ket" label="Keterangan" outlined dense class="col-12"
                  :valid="{ required: false }" />


                <q-separator></q-separator>
                <div class="q-pa-md flex full-width justify-end">
                  <q-btn color="primary" class="relative-position" icon="icon-mat-save"> Simpan Terapi</q-btn>
                </div>
              </q-form>


            </q-menu>
          </q-btn>

          <q-markup-table separator="cell" flat bordered>
            <thead>
              <tr>
                <th class="text-left">Terapi dan Obat</th>
                <th class="text-right">Dosis</th>
                <th class="text-right">Jam Masuk</th>
                <th class="text-right">Sisa Obat</th>
                <th class="text-right">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="store.form.terapis?.length">
                <tr v-for="(item, index) in store.form.terapis" :key="index">
                  <td class="text-left">
                    {{ item.obat }}
                  </td>
                  <td class="text-right">
                    {{ item.dosis }}
                  </td>
                  <td class="text-right">
                    {{ item.jamMasuk }}
                  </td>
                  <td class="text-right">
                    {{ item.sisa }}
                  </td>
                  <td class="text-right">
                    {{ item.ket }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="5" class="text-center">Tidak Ada Data Terapi</td>
                </tr>
              </template>
            </tbody>
          </q-markup-table>


        </div>

        <app-input-simrs v-model="store.form.plann" label="Rencana Terapi / Tindakan / Pemeriksaan" outlined autogrow
          type="textarea" class="col-12 q-mt-sm" :valid="{ required: true }" />

        <div class="col-12 q-mb-xs">Pemeriksaan yg disertakan :</div>
        <div class="col-2 q-mb-xs">RO : </div>
        <app-input-simrs v-model="store.form.ro" label="" outlined dense class="col-4" />
        <div class="col-6 q-mb-xs">Jenis / Tanggal /jam</div>
        <div class="col-2 q-mb-xs">LAB : </div>
        <app-input-simrs v-model="store.form.lab" label="" outlined dense class="col-4" />
        <div class="col-6 q-mb-xs">Jenis / Tanggal /jam</div>
        <div class="col-2 q-mb-xs">ECG : </div>
        <app-input-simrs v-model="store.form.ecg" label="" outlined dense class="col-4" />
        <div class="col-6 q-mb-xs">Jenis / Tanggal /jam</div>
        <div class="col-2 q-mb-xs">lain : </div>
        <app-input-simrs v-model="store.form.lain" label="lain-lain" outlined dense class="col-10" />
        <!-- <div class="col-6 q-mb-xs">Jenis / Tanggal /jam</div> -->

        <app-input-simrs v-model="store.form.kelengkapan" label="Kelengkapan yang disertakan" outlined autogrow
          type="textarea" class="col-12 q-mt-sm" :valid="{ required: true }" />
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width justify-end q-pa-md">
        <q-btn :loading="store.loadingOrder" :disable="store.loadingOrder" label="Simpan Mutasi Pasien" type="submit"
          color="primary" />
      </div>
      <div style="margin-bottom: 100px;"></div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { formatRp } from 'src/modules/formatter'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})

const formRef = ref(null)
const asalRuangan = computed(() => {
  return props.store?.ruanganAsal
})

// console.log('props', props?.pasien);


function onSubmit() {
  // console.log('onSubmit', props.store.form)

  props.store.simpanMutasi(props.pasien)
}

watchEffect(() => {
  // if (props.store?.form?.ruanganTujuan) {
  //   props.store.showKamar(props.store.form.ruanganTujuan)
  // }
})

</script>
