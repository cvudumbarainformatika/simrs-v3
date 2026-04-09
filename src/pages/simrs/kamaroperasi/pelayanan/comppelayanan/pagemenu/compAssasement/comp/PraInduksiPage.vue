<template>
  <div class="q-pa-sm">
    <div class="row items-center">
      <div class="col-auto depan ">Keluhan Utama</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-input v-model="store.formInduksi.keluhan_utama" label="" type="textarea" />
      </div>
    </div>

    <div class="row items-center">
      <div class="col-auto depan ">Diagnosa</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-input ref="refDiagnosa" v-model="store.formInduksi.diagnosa" label="" :rules="[
          val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
        ]" />
      </div>
    </div>

    <div class="row items-center">
      <div class="col-auto depan ">Rencana Pembedahan</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-input v-model="store.formInduksi.rencana_bedah" label="" type="textarea" />
      </div>
    </div>

    <div class="row items-center q-py-xs">
      <div class="col-auto depan ">Riwayat Anastesi</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-option-group v-model="store.formInduksi.riwayat_anastesi" :options="options" inline dense
          @update:model-value="clearJenis($event, 'jenis_riwayat_anastesi', 'Tidak')" />
        <q-input v-if="store?.formInduksi?.riwayat_anastesi == 'Ya'" v-model="store.formInduksi.jenis_riwayat_anastesi"
          label="Jenis Anastesi" :rules="[
            val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
          ]" />
      </div>
    </div>

    <div class="row items-center q-py-xs">
      <div class="col-auto depan ">Riwayat Merokok</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-option-group v-model="store.formInduksi.riwayat_merokok" :options="options" inline dense />
      </div>
    </div>

    <div class="row items-center q-py-xs">
      <div class="col-auto depan ">Alkoholik</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-option-group v-model="store.formInduksi.alkohol" :options="options" inline dense />
      </div>
    </div>

    <div class="row items-center q-py-xs">
      <div class="col-auto depan ">Riwayat Alergi</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-option-group v-model="store.formInduksi.riwayat_alergi" :options="options" inline dense
          @update:model-value="clearJenis($event, 'jenis_alergi', 'Tidak')" />
        <q-input v-if="store?.formInduksi?.riwayat_alergi == 'Ya'" v-model="store.formInduksi.jenis_alergi"
          label="Jenis " :rules="[
            val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
          ]" />
      </div>
    </div>

    <div class="row items-center q-py-xs">
      <div class="col-auto depan ">Persiapan Transfusi</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <q-option-group v-model="store.formInduksi.persiapan_transfusi" :options="options" inline dense
          @update:model-value="(val) => {
            clearJenis(val, 'jenis_transfusi', 'Tidak')
            clearJenis(val, 'jumlah_transfusi', 'Tidak')
          }" />
        <div v-if="store?.formInduksi?.persiapan_transfusi == 'Ya'" class="row q-col-gutter-x-sm">
          <div class="col-6">
            <q-input v-model="store.formInduksi.jenis_transfusi" label="Jenis " :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" />
          </div>
          <div class="col-6">
            <div class="row no-wrap items-center">
              <div class="col-10">
                <q-input v-model="store.formInduksi.jumlah_transfusi" label="Jumlah " :rules="[
                  val => (!val || /^-?\d*[.,]?\d*$/.test(val)) || 'Format angka tidak valid'
                ]" />
              </div>
              <div class="col-2 f-14">
                Kolf/Unit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row items-center">
      <div class="col-auto depan ">Pengukuran Vital Sign</div>
      <div class="col-auto dua">:</div>
      <div class="col-auto belakang">
        <div class="row q-col-gutter-x-lg">
          <div class="col-6">
            <div class="row items-center">
              <div class="col-2">Sens :</div>
              <div class="col-10">
                <q-input v-model="store.formInduksi.vit_sens" label="" dense />
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="row items-center">
              <div class="col-2">TD :</div>
              <div class="col-3">
                <q-input v-model="store.formInduksi.vit_td_sistole" label="" dense />
              </div>
              <div class="col-2 text-center">/</div>
              <div class="col-3">
                <q-input v-model="store.formInduksi.vit_td_diastole" label="" dense />
              </div>
              <div class="col-2">mmHg</div>
            </div>
          </div>

          <div class="col-6">
            <div class="row items-center">
              <div class="col-2">Nadi :</div>
              <div class="col-8">
                <q-input v-model="store.formInduksi.vit_nadi" label="" dense />
              </div>
              <div class="col-2">x/mnt</div>
            </div>
          </div>

          <div class="col-6">
            <div class="row items-center">
              <div class="col-2">RR :</div>
              <div class="col-8">
                <q-input v-model="store.formInduksi.vit_rr" label="" dense />
              </div>
              <div class="col-2">x/mnt</div>
            </div>
          </div>

          <div class="col-6">
            <div class="row items-center">
              <div class="col-2">Suhu :</div>
              <div class="col-8">
                <q-input v-model="store.formInduksi.vit_suhu" label="" dense />
              </div>
              <div class="col-2">
                °C
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="row text-weight-bold f-14">Pemeriksaan Fisik :</div>
    <div class="row items-start">
      <div class="col-auto" style="width: 2%;">
        1.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-center q-mb-xs">
          <div class="col-auto depan">Jalan Napas (Kesulitan Intubasi)</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.fis_jalan_napas" :options="options" inline dense />
          </div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-auto depan">Mulut</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.fis_mulut" :options="options" inline dense />
          </div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-auto depan">Tenggorokan</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.fis_tenggorokan" :options="options" inline dense />
          </div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-auto depan">Skor Mallampati</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.fis_skor_mallapati" :options="optionMallapatis" inline dense />
          </div>
        </div>
      </div>
    </div>

    <div class="row items-start">
      <div class="col-auto" style="width: 2%;">
        2.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-center q-mb-xs">
          <div class="col-auto depan">Kelainan Tulang Belakang</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.fis_kel_tul_bel" :options="options" inline dense />
          </div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-auto depan">Kelainan Jantung / Paru-paru</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.fis_kel_jan_par" :options="options" inline dense />
          </div>
        </div>
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        3.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start">
          <div class="col-auto depan ">Abdomen</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-input v-model="store.formInduksi.fis_abdomen" label="" :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" dense />
          </div>
        </div>
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        4.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start">Pemeriksaan Penunjang</div>
        <div class="row items-center">
          <div class="col-auto depan ">Laboratorium</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-input v-model="store.formInduksi.fis_penj_lab" label="" :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" dense />
          </div>
        </div>
        <div class="row items-center">
          <div class="col-auto depan ">EKG</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-input v-model="store.formInduksi.fis_penj_ekg" label="" :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" dense />
          </div>
        </div>
        <div class="row items-center">
          <div class="col-auto depan ">Thorak</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-input v-model="store.formInduksi.fis_penj_thorax" label="" :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" dense />
          </div>
        </div>
        <div class="row items-center">
          <div class="col-auto depan ">Lain-lain</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-input v-model="store.formInduksi.fis_penj_lain" label="" :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" dense />
          </div>
        </div>
      </div>
    </div>
    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        5.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start q-mm-xs">
          <div class="col-auto depan">Skor Nyeri</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.ket_skor_nyeri" :options="SkorNyeriOptions" inline dense />
          </div>
        </div>
      </div>
    </div>
    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        6.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start q-mm-xs">
          <div class="col-auto depan">Klasifikasi Asa</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.klasifikasi_asa" :options="KlasifikasiAsaOptions" inline dense />
          </div>
        </div>
      </div>
    </div>
    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        7.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start q-mm-xs">
          <div class="col-auto depan">Rencana Anastesi</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <div class="row">
              <div class="col-4">
                <q-option-group v-model="store.formInduksi.renc_anastesi" :options="RenAnasOptions" inline dense
                  @update:model-value="clearJenis($event, 'region_anas', 'Umum')" />
              </div>
              <div class="col-6">
                <q-option-group v-if="store.formInduksi.renc_anastesi == 'Regional'"
                  v-model="store.formInduksi.region_anas" :options="RegionAnasOptions" inline dense />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        8.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start q-mm-xs">
          <div class="col-auto depan">Rencana Pemulihan Pasca Anastesi</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.renc_pemulihan_pasca_anas"
              :options="RencPemulihanPascaAnaOptions" inline dense />
          </div>
        </div>
      </div>
    </div>
    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        9.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start q-mm-xs">
          <div class="col-auto depan">Rencana Management Nyeri</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
            <q-option-group v-model="store.formInduksi.renc_management_nyeri" :options="RencManagementNyesiOptions"
              inline dense />
          </div>
        </div>
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col-auto" style="width: 2%;">
        10.
      </div>
      <div class="col-auto" style="width: 98%;">
        <div class="row items-start q-mm-xs">
          <div class="col-auto depan">Pemberian Obat pre-medikasi</div>
          <div class="col-auto dua">:</div>
          <div class="col-auto belakang">
          </div>
        </div>
        <div class="row">
          <table style="width: calc(80vw + 10px); margin-bottom: 10px;">
            <thead class="my-sticky-header-table">
              <tr>
                <th width="5%" class="q-pa-xs">No</th>
                <th class="q-pa-xs">Obat Pre-Medikasi</th>
                <th class="q-pa-xs">Dosis</th>
                <th class="q-pa-xs">Jam</th>
                <th class="q-pa-xs">Pelaksana</th>
                <th class="q-pa-xs">#</th>
              </tr>
              <tr @keyup.enter="() => {
                // console.log('enter');
                addObatMedikasi()
              }">
                <th colspan="2" class="q-pa-xs"><q-input ref="inputObatMedikasi"
                    v-model="obatMedikasi.obat_pre_medikasi" label="" dense /></th>
                <th class="q-pa-xs"><q-input v-model="obatMedikasi.dosis" label="" dense /></th>
                <th class="q-pa-xs"><q-input v-model="obatMedikasi.jam" label="" dense /></th>
                <th class="q-pa-xs"><app-autocomplete v-model="obatMedikasi.pelaksana" label="" dense
                    :source="laporanOp.nakes" option-label="nama" hide-dropdown-icon /></th>
                <th class="q-pa-xs"><q-btn icon="add" @click="addObatMedikasi" dense color="primary" rounded /></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="store.loadingInduksi">
                <tr>
                  <td>
                    <app-loading />
                  </td>
                </tr>
              </template>
              <template v-else-if="!store.formInduksi?.obat_pre_medikasi?.length">
                <tr>
                  <td colspan="6">
                    <app-no-data />
                  </td>
                </tr>
              </template>
              <template v-else>
                <template v-for="(item, n) in store.formInduksi?.obat_pre_medikasi" :key="n">
                  <tr
                    :class="item.delete ? 'obat-hapus' : (obatBaru(item, n) ? 'obat-baru' : (n % 2 === 0 ? 'even' : 'odd'))">
                    <td width="5%">
                      <div class="row items-center">
                        {{ n + 1 }}
                      </div>
                    </td>
                    <td style="white-space: normal;">
                      <div class="row items-center">
                        <div class="col-auto">
                          {{ item?.obat_pre_medikasi }}
                        </div>
                      </div>
                    </td>
                    <td style="white-space: normal;">
                      <div class="row items-center">
                        <div class="col-auto">
                          {{ item?.dosis }}
                        </div>
                      </div>
                    </td>
                    <td style="white-space: normal;">
                      <div class="row items-center">
                        <div class="col-auto">
                          {{ item?.jam }}
                        </div>
                      </div>
                    </td>
                    <td style="white-space: normal;">
                      <div class="row items-center">
                        <div class="col-auto">
                          {{ item?.pelaksana?.nama }}
                        </div>
                      </div>
                    </td>
                    <td style="white-space: normal;">
                      <div class="row justify-center">
                        <div class="col-auto text-center">
                          <q-btn v-if="!item.delete" icon="delete_sweep" color="negative" dense flat @click="() => {
                            if (obatBaru(item, n)) store.formInduksi.obat_pre_medikasi.splice(n, 1)
                            else item.delete = true
                          }" />
                          <div v-if="obatBaru(item, n)">
                            <div class="row">
                              klik simpan
                            </div>
                            <div class="row">
                              untuk tambah
                            </div>
                            <div class="row">
                              permanen data
                            </div>
                          </div>
                          <div v-if="item.delete && !obatBaru(item, n)">
                            <div class="row">
                              klik simpan
                            </div>
                            <div class="row">
                              untuk hapus
                            </div>
                            <div class="row">
                              permanen data
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row q-my-sm q-col-gutter-x-sm">
      <div class="col-4"><app-input-date :model="store.formInduksi.tgl" label="Tanggal" dense outlined @set-model="(val) => {
        store.formInduksi.tgl = val
      }" /></div>
      <div class="col-4"><app-input-date :model="store.formInduksi.jam" label="Jam" :type-date="false" dense outlined
          @set-model="(val) => {
            store.formInduksi.jam = val
          }" /></div>
      <div class="col-4"><app-autocomplete v-model="store.formInduksi.dokter_anastesi" :key="laporanOp.nakes"
          label="Dokter Anastesi" outlined dense :source="laporanOp.nakes?.filter(y => y?.kdgroupnakes == '1')"
          option-label="nama" option-value="kdpegsimrs" hide-dropdown-icon /></div>
    </div>
    <div class="row justify-end q-my-lg q-mr-md">
      <q-btn label="Simpan" no-caps color="primary" glossy :loading="store.loadingInduksi"
        :disable="store.loadingInduksi" @click="store.simpanFormInduksi(props.pasien)" />
    </div>
  </div>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { useAssasementPraBedahStore } from 'src/stores/simrs/kamaroperasi/assasement/praBedah'
import { onMounted, ref } from 'vue'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const obatMedikasi = ref({})
const inputObatMedikasi = ref({})
function obatBaru (item, n) {
  // const baru = props.pasien?.pra_induksi?.obat_pre_medikasi?.find(el => el.obat_pre_medikasi === item.obat_pre_medikasi && el.dosis === item.dosis && el.jam === item.jam && el.pelaksana?.id === item.pelaksana?.id)
  const baru = props.pasien?.pra_induksi?.obat_pre_medikasi[n]
  console.log('obat bar', baru, item, props.pasien?.pra_induksi?.obat_pre_medikasi)
  if (!baru) return true

}
function addObatMedikasi () {
  console.log('add', inputObatMedikasi.value)
  if (!obatMedikasi.value?.obat_pre_medikasi) return notifErrVue('Obat pre medikasi tidak boleh kosong')
  else store.formInduksi.obat_pre_medikasi.push(obatMedikasi.value)
  obatMedikasi.value = {}
  inputObatMedikasi.value.focus()

}
const options = ref([
  {
    label: 'Ya',
    value: 'Ya'
  },
  {
    label: 'Tidak',
    value: 'Tidak'
  },
])

const RenAnasOptions = ref([
  {
    label: 'Umum',
    value: 'Umum'
  },
  {
    label: 'Regional',
    value: 'Regional'
  },
])

const RegionAnasOptions = ref([
  {
    label: 'Spinal',
    value: 'Spinal'
  },
  {
    label: 'Epidural',
    value: 'Epidural'
  },
  {
    label: 'Blok Syaraf',
    value: 'Blok Syaraf'
  },
])

const optionMallapatis = ref([
  {
    label: 'Grade I',
    value: 'Grade I'
  },
  {
    label: 'Grade II',
    value: 'Grade II'
  },
  {
    label: 'Grade III',
    value: 'Grade III'
  },
  {
    label: 'Grade IV',
    value: 'Grade IV'
  },
])

const SkorNyeriOptions = ref([
  {
    label: 'Ringan (0-3)',
    value: 'Ringan (0-3)'
  },
  {
    label: 'Sedang (4-6)',
    value: 'Sedang (4-6)'
  },
  {
    label: 'Berat (7-10)',
    value: 'Berat (7-10)'
  },
])

const KlasifikasiAsaOptions = ref([
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: 'E',
    value: 'E'
  },
])

const RencPemulihanPascaAnaOptions = ref([
  {
    label: 'ICU',
    value: 'ICU'
  },
  {
    label: 'HCU',
    value: 'HCU'
  },
  {
    label: 'Rercovery Room',
    value: 'Rercovery Room'
  },
])

const RencManagementNyesiOptions = ref([
  {
    label: 'IV Bolus',
    value: 'IV Bolus'
  },
  {
    label: 'Oral',
    value: 'Oral'
  },
  {
    label: 'Supp',
    value: 'Supp'
  },
  {
    label: 'IV Kontinue',
    value: 'IV Kontinue'
  },
  {
    label: 'Patch',
    value: 'Patch'
  },
])

const store = useAssasementPraBedahStore()
const laporanOp = useLaporanOperasiStore()

const refDiagnosa = ref(null)
function clearJenis (evt, key, value) {
  // console.log('clear', evt, key, value)
  if (evt == value) {
    store.formInduksi[key] = null
  }

}
onMounted(() => {
  if (laporanOp.nakes.length == 0) laporanOp.getNakes()
})
</script>


<style lang="scss" scoped>
.obat-baru {
  background-color: #0fd30fdc;
  color: #fff
}

.obat-hapus {
  background-color: #d30f0fb6;
  color: #fff
}

.depan {
  width: 20%;
}

.dua {
  width: 1%;
}

.belakang {
  width: 79%;
}

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
