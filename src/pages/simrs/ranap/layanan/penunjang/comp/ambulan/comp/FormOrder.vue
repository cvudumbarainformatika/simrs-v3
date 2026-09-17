<template>
  <div class="fit column scroll">
    <q-form ref="formRef" @submit="onSubmit" class="q-pa-md">
      <!-- HEADER INFO PASIEN & MODE EDIT -->
      <q-banner dense rounded :class="store.form?.id ? 'bg-amber-1 text-amber-10 q-mb-md border' : 'bg-indigo-1 text-indigo-10 q-mb-md border'">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-x-sm">
            <q-icon :name="store.form?.id ? 'icon-mat-edit' : 'icon-mat-directions_car'" size="24px" :color="store.form?.id ? 'warning' : 'primary'" />
            <div>
              <div class="text-subtitle2 text-weight-bold flex items-center q-gutter-x-sm">
                <span>FORMULIR PEMESANAN AMBULANCE</span>
                <q-badge v-if="store.form?.id" color="warning" text-color="dark" class="text-bold">
                  MODE EDIT: {{ store.form?.nota }}
                </q-badge>
              </div>
              <div class="text-caption text-grey-8">Penilaian Skore Indeks Risiko Pasien & Spesifikasi Petugas Pengantar</div>
            </div>
          </div>
          <div class="row items-center q-gutter-x-md">
            <div class="text-right text-caption">
              <div><b>{{ pasien?.nama }}</b> (RM: {{ pasien?.norm }})</div>
              <div class="text-grey-7">{{ pasien?.ruangan || '-' }} | DPJP: {{ pasien?.dokter || '-' }}</div>
            </div>
            <q-btn v-if="store.form?.id" label="Batal Edit" outline color="negative" size="sm" dense class="q-px-sm" @click="store.initReset()" />
          </div>
        </div>
      </q-banner>

      <div class="row q-col-gutter-md">
        <!-- SEKSI 1: DETAIL PERMINTAAN -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="rounded-borders bg-white h-full">
            <div class="bg-grey-2 q-px-md q-py-xs text-subtitle2 text-weight-bold text-dark flex items-center q-gutter-x-xs">
              <q-icon name="icon-mat-info" size="18px" color="primary" />
              <span>Detail Pemesanan & Tujuan</span>
            </div>
            <q-card-section class="q-gutter-y-sm">
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Tujuan Ambulan</div>
                <app-autocomplete-new ref="refTujuan" :model="store.form.tujuan" label="Pilih Kota / RS Tujuan" autocomplete="rs2"
                  option-value="rs1" option-label="rs2" outlined :source="store.tujuans" @on-select="(val) => {
                    store.form.tujuan = val
                  }" @clear="store.form.tujuan = ''" />
              </div>

              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Alasan / Keperluan</div>
                <q-input v-model="store.form.alasan_keperluan" placeholder="Misal: Rujuk Pemeriksaan Lanjut / Pindah RS / Pulang APS" outlined dense />
              </div>

              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Indikasi Rujuk</div>
                <q-input v-model="store.form.indikasi_rujuk" placeholder="Misal: Memerlukan penanganan ICU / Bedah Saraf" outlined dense />
              </div>

              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Keterangan Tambahan</div>
                <q-input v-model="store.form.keterangan" placeholder="Catatan tambahan kondisi pasien..." outlined :rows="2" type="textarea" />
              </div>

              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Layanan Supir</div>
                  <app-autocomplete-new :model="store.form.layanansupir" label="Layanan Supir" autocomplete="label"
                    option-value="value" option-label="label" outlined :source="store.layanans" valid @on-select="(val) => {
                      store.form.layanansupir = val
                    }" />
                </div>
                <div class="col-6">
                  <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Layanan Perawat</div>
                  <app-autocomplete-new :model="store.form.layananperawat" label="Layanan Perawat"
                    autocomplete="label" option-value="value" option-label="label" outlined :source="store.layanans" valid
                    @on-select="(val) => {
                      store.form.layananperawat = val
                    }" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- SEKSI 2: JENIS AMBULAN & PETUGAS PENDAMPING -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="rounded-borders bg-white h-full">
            <div class="bg-grey-2 q-px-md q-py-xs text-subtitle2 text-weight-bold text-dark flex items-center q-gutter-x-xs">
              <q-icon name="icon-mat-local_shipping" size="18px" color="teal" />
              <span>Jenis Ambulan & Petugas Pengantar</span>
            </div>
            <q-card-section class="q-gutter-y-sm">
              <!-- Pilihan Jenis Ambulan -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Jenis Ambulance Yang Dipesan</div>
                <div class="q-pa-sm border-grey rounded-borders bg-grey-1 column q-gutter-y-xs">
                  <div v-for="jns in store.jenisAmbulans" :key="jns.value">
                    <q-radio v-model="store.form.jenis_ambulan" :val="jns.value" :label="jns.label" dense color="primary" class="text-caption" size="xs" />
                  </div>
                </div>
              </div>

              <!-- Rekomendasi Hasil Skoring -->
              <q-banner dense rounded :class="kategoriColorClass" class="q-my-xs text-white">
                <div class="row justify-between items-center">
                  <div>
                    <div class="text-weight-bold f-12">Total Skor: {{ totalSkor }} (Kategori {{ kategoriResiko }})</div>
                    <div class="text-caption" style="font-size: 11px;">Rekomendasi Pengantar: <b>{{ kualifikasiPengantar.pengantar }}</b> ({{ kualifikasiPengantar.kualifikasi }})</div>
                  </div>
                  <q-badge v-if="totalSkor > 2" color="negative" text-color="white" class="text-weight-bold q-pa-xs">
                    Wajib Ambulance Emergency!
                  </q-badge>
                </div>
              </q-banner>

              <!-- Petugas Pengantar & Driver -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Driver / Sopir Ambulance</div>
                <app-autocomplete-new ref="refDriver" :model="store.form.kd_driver" label="Pilih Driver / Sopir" autocomplete="nama"
                  option-value="kdpegsimrs" option-label="nama" outlined :source="store.drivers" valid @on-select="(val) => {
                    store.form.kd_driver = val
                  }" @clear="store.form.kd_driver = ''" />
              </div>

              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Perawat Pendamping 1</div>
                <app-autocomplete-new ref="refPerawat1" :model="store.form.perawat1" label="Pilih Perawat 1" autocomplete="nama"
                  option-value="kdpegsimrs" option-label="nama" outlined :source="store.perawats" valid @on-select="(val) => {
                    store.form.perawat1 = val
                  }" @clear="store.form.perawat1 = ''" />
              </div>

              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Perawat Pendamping 2</div>
                <app-autocomplete-new ref="refPerawat2" :model="store.form.perawat2" label="Pilih Perawat 2 (Opsional)" autocomplete="nama"
                  option-value="kdpegsimrs" option-label="nama" outlined :source="store.perawats" valid @on-select="(val) => {
                    store.form.perawat2 = val
                  }" @clear="store.form.perawat2 = ''" />
              </div>

              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Dokter Pendamping</div>
                <app-autocomplete-new ref="refDokter" :model="store.form.kodedokter" label="Pilih Dokter" autocomplete="nama"
                  option-value="kdpegsimrs" option-label="nama" outlined :source="store.dokters" valid @on-select="(val) => {
                    store.form.kodedokter = val
                  }" @clear="store.form.kodedokter = ''" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- SEKSI 3: TABEL SKORE INDEKS RISIKO PASIEN (11 PARAMETER) -->
        <div class="col-12">
          <q-card flat bordered class="rounded-borders bg-white shadow-1">
            <q-expansion-item default-opened header-class="bg-indigo text-white text-subtitle2 text-weight-bold" expand-icon-class="text-white">
              <template #header>
                <div class="row full-width items-center justify-between">
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-assignment" size="20px" />
                    <span>PENILAIAN / PENGUKURAN SKORE INDEKS RESIKO PASIEN (11 PARAMETER)</span>
                  </div>
                  <q-badge color="white" text-color="indigo-10" class="text-weight-bold q-px-sm q-py-xs f-12">
                    Skor: {{ totalSkor }} | Kategori: {{ kategoriResiko }}
                  </q-badge>
                </div>
              </template>

              <q-card-section class="q-pa-xs">
                <q-markup-table dense flat bordered separator="cell" wrap-cells class="table-scoring-compact">
                  <thead>
                    <tr class="bg-indigo-10 text-white font-bold">
                      <th style="width: 35px;" class="text-center">NO</th>
                      <th style="width: 180px;" class="text-left">PARAMETER</th>
                      <th class="text-left">PILIHAN INDIKATOR</th>
                      <th style="width: 50px;" class="text-center">SKOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 1. HAEMODINAMIK -->
                    <tr>
                      <td class="text-center font-bold">1</td>
                      <td class="font-bold">HAEMODINAMIK</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.haemodinamik" :val="0" label="STABIL (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.haemodinamik" :val="1" label="MODERAT (dengan terapi darah < 15 ml/mnt) (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.haemodinamik" :val="2" label="UNSTABLE (dengan terapi darah > 15 ml/mnt dan atau terapi inotropic) (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.haemodinamik }}</td>
                    </tr>

                    <!-- 2. CARDIO -->
                    <tr>
                      <td class="text-center font-bold">2</td>
                      <td class="font-bold">CARDIO</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.cardio" :val="0" label="ARITMIA TIDAK ADA (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.cardio" :val="1" label="ARITMIA (tidak serius) atau IMA onset > 48 jam (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.cardio" :val="2" label="ARITMIA (buruk) atau IMA onset < 48 jam (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.cardio }}</td>
                    </tr>

                    <!-- 3. ECG MONITOR -->
                    <tr>
                      <td class="text-center font-bold">3</td>
                      <td class="font-bold">ECG MONITOR</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.ecg_monitor" :val="0" label="TIDAK PERLU (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.ecg_monitor" :val="1" label="PERLU (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.ecg_monitor" :val="2" label="SANGAT DIBUTUHKAN (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.ecg_monitor }}</td>
                    </tr>

                    <!-- 4. INTRAVENUS LINE -->
                    <tr>
                      <td class="text-center font-bold">4</td>
                      <td class="font-bold">INTRAVENUS LINE</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.intravenous_line" :val="0" label="TIDAK (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.intravenous_line" :val="1" label="IYA (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.intravenous_line" :val="2" label="TERPASANG CVC (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.intravenous_line }}</td>
                    </tr>

                    <!-- 5. PROVESIONAL PACEMAKER -->
                    <tr>
                      <td class="text-center font-bold">5</td>
                      <td class="font-bold">PROVESIONAL PACEMAKER</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.provesional_pacemaker" :val="0" label="TIDAK (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.provesional_pacemaker" :val="1" label="IYA / NON INVASIF (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.provesional_pacemaker" :val="2" label="ENDOCAVITY (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.provesional_pacemaker }}</td>
                    </tr>

                    <!-- 6. RESPIRASI -->
                    <tr>
                      <td class="text-center font-bold">6</td>
                      <td class="font-bold">RESPIRASI</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.respirasi" :val="0" label="ANTARA 10 – 14 x/mnt (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.respirasi" :val="1" label="ANTARA 15 – 35 x/mnt (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.respirasi" :val="2" label="APNOE / < 10 atau > 35 x/mnt (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.respirasi }}</td>
                    </tr>

                    <!-- 7. AIRWAYS -->
                    <tr>
                      <td class="text-center font-bold">7</td>
                      <td class="font-bold">AIRWAYS</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.airways" :val="0" label="TANPA ALAT (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.airways" :val="1" label="MAYO TUBE (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.airways" :val="2" label="INTUBASI (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.airways }}</td>
                    </tr>

                    <!-- 8. RESPIRATORY SUPPORT -->
                    <tr>
                      <td class="text-center font-bold">8</td>
                      <td class="font-bold">RESPIRATORY SUPPORT</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.respiratory_support" :val="0" label="TIDAK (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.respiratory_support" :val="1" label="THERAPY O2 (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.respiratory_support" :val="2" label="VENTILASI MEKANIK (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.respiratory_support }}</td>
                    </tr>

                    <!-- 9. KESADARAN -->
                    <tr>
                      <td class="text-center font-bold">9</td>
                      <td class="font-bold">KESADARAN</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.kesadaran" :val="0" label="GCS = 15 (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.kesadaran" :val="1" label="GCS 8 – 14 (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.kesadaran" :val="2" label="GCS < 8 (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.kesadaran }}</td>
                    </tr>

                    <!-- 10. PREMATURITAS -->
                    <tr>
                      <td class="text-center font-bold">10</td>
                      <td class="font-bold">PREMATURITAS</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.prematuritas" :val="0" label="BAYI BARU LAHIR DENGAN BB > 2000 gr / Bukan Bayi (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.prematuritas" :val="1" label="BAYI BARU LAHIR DENGAN BB ANTARA 1200 – 2000 gr (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.prematuritas" :val="2" label="BAYI BARU LAHIR DENGAN BB < 1200 gr (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.prematuritas }}</td>
                    </tr>

                    <!-- 11. LANJUT USIA -->
                    <tr>
                      <td class="text-center font-bold">11</td>
                      <td class="font-bold">LANJUT USIA</td>
                      <td>
                        <div class="q-gutter-y-xs q-py-xs">
                          <div><q-radio v-model="store.form.penilaian_resiko.lanjut_usia" :val="0" label="USIA ≤ 60 thn (0)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.lanjut_usia" :val="1" label="USIA > 60 thn (1)" dense size="xs" /></div>
                          <div><q-radio v-model="store.form.penilaian_resiko.lanjut_usia" :val="2" label="USIA > 60 thn DENGAN DELIRIUM (2)" dense size="xs" /></div>
                        </div>
                      </td>
                      <td class="text-center font-bold bg-grey-1 f-14 text-primary">{{ store.form.penilaian_resiko.lanjut_usia }}</td>
                    </tr>

                    <!-- TOTAL -->
                    <tr class="bg-indigo-1 text-weight-bold">
                      <td colspan="3" class="text-right text-subtitle2 q-pa-sm">TOTAL SKOR:</td>
                      <td class="text-center text-subtitle1 text-primary q-pa-sm">{{ totalSkor }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- SUBMIT BUTTON -->
      <div class="row full-width justify-between items-center q-pb-xl">
        <div class="text-caption text-grey-7">
          *Formulir permintaan ambulance dan penilaian risiko akan otomatis tersimpan & siap dicetak.
        </div>
        <q-btn :loading="store.loadingOrder" :disable="store.loadingOrder" :label="store.form?.id ? 'Simpan Perubahan' : 'Kirim Permintaan Ambulan'" type="submit"
          :color="store.form?.id ? 'warning' : 'primary'" :text-color="store.form?.id ? 'dark' : 'white'" :icon="store.form?.id ? 'icon-mat-save' : 'icon-mat-send'" class="q-px-lg shadow-2 text-weight-bold" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { usePermintaanAmbulanStore } from 'src/stores/simrs/ranap/ambulance'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const store = usePermintaanAmbulanStore()
const formRef = ref(null)

// TOTAL SKOR KALKULASI REAKTIF
const totalSkor = computed(() => {
  const p = store.form.penilaian_resiko || {}
  return Number(p.haemodinamik || 0) +
    Number(p.cardio || 0) +
    Number(p.ecg_monitor || 0) +
    Number(p.intravenous_line || 0) +
    Number(p.provesional_pacemaker || 0) +
    Number(p.respirasi || 0) +
    Number(p.airways || 0) +
    Number(p.respiratory_support || 0) +
    Number(p.kesadaran || 0) +
    Number(p.prematuritas || 0) +
    Number(p.lanjut_usia || 0)
})

// KATEGORI RISIKO
const kategoriResiko = computed(() => {
  const skor = totalSkor.value
  const p = store.form.penilaian_resiko || {}
  
  if (skor === 2 && p.lanjut_usia === 2) {
    return '0.5'
  }
  if (skor <= 2) return '0'
  if (skor >= 3 && skor <= 5) return '1'
  if (skor >= 6 && skor <= 8) return '2'
  return '3'
})

// SPESIFIKASI PETUGAS PENGANTAR
const kualifikasiPengantar = computed(() => {
  const kat = kategoriResiko.value
  switch (kat) {
    case '0':
    case '0.5':
    case '1':
      return { pengantar: 'PERAWAT', kualifikasi: 'BLS' }
    case '2':
      return { pengantar: 'PERAWAT', kualifikasi: 'Pelatihan Code Blue, BCLS/BTLS' }
    case '3':
      return { pengantar: 'PERAWAT INTENSIF + DOKTER UMUM', kualifikasi: 'BLS/ALS, BTCLS/ATCLS, BCLS/ACLS, PPGD/PPGDON/GELS' }
    default:
      return { pengantar: 'PERAWAT', kualifikasi: 'BLS' }
  }
})

// COLOR CLASS REKOMENDASI
const kategoriColorClass = computed(() => {
  const kat = kategoriResiko.value
  if (kat === '3') return 'bg-negative'
  if (kat === '2') return 'bg-deep-orange-8'
  if (kat === '1') return 'bg-amber-9'
  return 'bg-teal'
})

// SYNC KE STORE FORM
watch(totalSkor, (val) => {
  store.form.skor_indeks = val
  store.form.kategori_resiko = kategoriResiko.value
  store.form.kualifikasi_petugas = `${kualifikasiPengantar.value.pengantar} (${kualifikasiPengantar.value.kualifikasi})`
  
  // Otomatis pilih Ambulance Emergency jika skor > 2
  if (val > 2 && store.form.jenis_ambulan === 'Ambulance Reguler') {
    store.form.jenis_ambulan = 'Ambulance Emergency'
  }
}, { immediate: true })

function onSubmit() {
  store.form.skor_indeks = totalSkor.value
  store.form.kategori_resiko = kategoriResiko.value
  store.form.kualifikasi_petugas = `${kualifikasiPengantar.value.pengantar} (${kualifikasiPengantar.value.kualifikasi})`
  
  store.saveOrder(props.pasien)
    .then(() => {
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    })
}
</script>

<style scoped>
.table-scoring-compact {
  font-size: 11px !important;
}

.table-scoring-compact th {
  padding: 4px 6px !important;
  font-size: 11px !important;
}

.table-scoring-compact td {
  padding: 3px 6px !important;
  font-size: 11px !important;
  line-height: 1.3 !important;
}

:deep(.table-scoring-compact .q-radio__label) {
  font-size: 11px !important;
  line-height: 1.3 !important;
}

:deep(.table-scoring-compact .q-radio__inner) {
  font-size: 14px !important;
}
</style>
