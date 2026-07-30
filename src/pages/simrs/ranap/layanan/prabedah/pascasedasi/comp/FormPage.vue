<template>
  <q-form class="fit full-width text-dark font-sans q-pb-xl" @submit="onSimpan">
    <div class="q-pa-md column q-gutter-y-md">
      
      <!-- CARD 1: INFORMASI PROSEDUR & TIM SEDASI -->
      <q-card flat bordered class="rounded-borders bg-white shadow-1">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-subtitle1 text-bold flex items-center">
            <q-icon name="icon-mat-assignment" size="22px" class="q-mr-sm" />
            1. Informasi Prosedur & Tim Sedasi
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="form.prosedur" label="Nama Prosedur Tindakan" dense outlined color="primary" placeholder="e.g. Endoskopi Saluran Cerna / Kolonoskopi" />
            </div>

            <!-- DOKTER ANESTESI AUTOCOMPLETE -->
            <div class="col-12 col-md-4">
              <app-autocomplete-new
                v-model="form.kddokter"
                label="Dokter Anestesi (Pelaku Sedasi)"
                autocomplete="nama"
                option-value="kdpegsimrs"
                option-label="nama"
                outlined
                dense
                :source="storeDokters"
                @on-select="(val) => {
                  form.kddokter = val
                  form.dokter = storeDokters?.find(item => item.kdpegsimrs === val)?.nama
                  form.dokter_sedasi = form.dokter
                }"
                @clear="() => {
                  form.kddokter = null
                  form.dokter = null
                  form.dokter_sedasi = null
                }"
              />
            </div>

            <!-- DOKTER OPERATOR AUTOCOMPLETE -->
            <div class="col-12 col-md-4">
              <app-autocomplete-new
                v-model="form.kd_operator"
                label="Dokter Operator (Pelaku Prosedur)"
                autocomplete="nama"
                option-value="kdpegsimrs"
                option-label="nama"
                outlined
                dense
                :source="storeDokters"
                @on-select="(val) => {
                  form.kd_operator = val
                  form.operator = storeDokters?.find(item => item.kdpegsimrs === val)?.nama
                }"
                @clear="() => {
                  form.kd_operator = null
                  form.operator = null
                }"
              />
            </div>

            <!-- ASISTEN SEDASI AUTOCOMPLETE -->
            <div class="col-12 col-md-4">
              <app-autocomplete-new
                v-model="form.kd_asisten"
                label="Asisten Sedasi (Perawat / Petugas)"
                autocomplete="nama"
                option-value="kdpegsimrs"
                option-label="nama"
                outlined
                dense
                :source="storeNakes"
                @on-select="(val) => {
                  form.kd_asisten = val
                  form.asisten = storeNakes?.find(item => item.kdpegsimrs === val)?.nama
                }"
                @clear="() => {
                  form.kd_asisten = null
                  form.asisten = null
                }"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="form.tgl_prosedur" type="date" label="Tgl Prosedur" dense outlined color="primary" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="form.jam_mulai" mask="##:##" label="Jam Mulai (HH:MM)" placeholder="14:00" dense outlined color="primary">
                <template v-slot:append>
                  <q-icon name="icon-mat-schedule" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="form.jam_selesai" mask="##:##" label="Jam Selesai (HH:MM)" placeholder="14:30" dense outlined color="primary">
                <template v-slot:append>
                  <q-icon name="icon-mat-schedule" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select v-model="form.rencana_sedasi" :options="['Ringan', 'Sedang', 'Dalam']" label="Rencana Sedasi" dense outlined color="primary" />
            </div>

            <!-- ASA CLASS & MALLAMPATI -->
            <div class="col-12 col-md-6">
              <div class="text-caption text-bold text-primary q-mb-xs">ASA Classification:</div>
              <q-btn-toggle
                v-model="form.asa"
                spread
                no-caps
                dense
                rounded
                unelevated
                toggle-color="primary"
                color="grey-2"
                text-color="dark"
                :options="[
                  { label: 'ASA 1', value: '1' },
                  { label: 'ASA 2', value: '2' },
                  { label: 'ASA 3', value: '3' },
                  { label: 'ASA 4', value: '4' },
                  { label: 'ASA 5', value: '5' },
                  { label: 'E', value: 'E' }
                ]"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption text-bold text-primary q-mb-xs">Skor Mallampati:</div>
              <q-btn-toggle
                v-model="form.mallampati"
                spread
                no-caps
                dense
                rounded
                unelevated
                toggle-color="primary"
                color="grey-2"
                text-color="dark"
                :options="[
                  { label: 'Class 1', value: '1' },
                  { label: 'Class 2', value: '2' },
                  { label: 'Class 3', value: '3' },
                  { label: 'Class 4', value: '4' }
                ]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- CARD 2: PEMANTAUAN VITAL SIGNS & OBAT SELAMA PROSEDUR -->
      <q-card flat bordered class="rounded-borders bg-white shadow-1">
        <q-card-section class="bg-primary text-white q-py-sm row justify-between items-center">
          <div class="text-subtitle1 text-bold flex items-center">
            <q-icon name="icon-mat-show_chart" size="22px" class="q-mr-sm" />
            2. Pemantauan Selama Prosedur (Time-Series Vital Signs & Obat)
          </div>
          <div class="row q-gutter-x-sm">
            <q-btn
              :label="showChart ? 'Tutup Grafik' : '📊 Lihat Grafik Monitoring'"
              :icon="showChart ? 'icon-mat-close' : 'icon-mat-show_chart'"
              color="white"
              text-color="primary"
              size="sm"
              no-caps
              dense
              class="q-px-md text-weight-bold"
              @click="showChart = !showChart"
            />
            <q-btn
              label="Tambah Waktu Pemantauan"
              icon="icon-mat-add"
              color="amber-7"
              text-color="dark"
              size="sm"
              no-caps
              dense
              class="q-px-md text-weight-bold shadow-1"
              @click="store.addMonitoringRow"
            />
          </div>
        </q-card-section>

        <!-- GRAFIK APEXCHART (DAPAT DIBUKA/TUTUP INTERAKTIF) -->
        <q-card-section v-if="showChart" class="bg-indigo-1 border-bottom-panel q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-insights" class="q-mr-xs" />
            Grafik Tren Fluktuasi Vital Signs Selama Sedasi
          </div>
          <div class="bg-white rounded-borders q-pa-sm shadow-1">
            <apexchart
              type="line"
              height="260"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none overflow-auto">
          <q-markup-table flat borderless dense class="bg-white">
            <thead class="bg-indigo-1 text-primary">
              <tr>
                <th width="4%">No</th>
                <th width="14%">Waktu (HH:MM)</th>
                <th width="24%">Obat-obatan & Rute</th>
                <th width="10%">SpO2 (%)</th>
                <th width="10%">Nadi (x/m)</th>
                <th width="16%">Tensi (Sis / Dis)</th>
                <th width="8%">Suhu (°C)</th>
                <th width="10%">Fr (x/m)</th>
                <th width="10%">Sedasi (0-4)</th>
                <th width="4%">Hapus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in form.monitoring_intra" :key="i">
                <td class="text-center text-bold">{{ i + 1 }}</td>
                <td>
                  <q-input
                    v-model="row.waktu"
                    dense
                    outlined
                    color="primary"
                    mask="##:##"
                    placeholder="14:00"
                    input-class="text-center text-bold"
                  />
                </td>
                <td>
                  <q-input v-model="row.obat_sedasi" dense outlined color="primary" placeholder="e.g. Miloz 2 cc" />
                </td>
                <td>
                  <q-input v-model.number="row.spo2" type="number" dense outlined color="primary" input-class="text-center" />
                </td>
                <td>
                  <q-input v-model.number="row.nadi" type="number" dense outlined color="primary" input-class="text-center" />
                </td>
                <td>
                  <div class="row items-center no-wrap q-gutter-x-xs">
                    <q-input v-model.number="row.sis" type="number" dense outlined input-class="text-center" style="width: 55px;" placeholder="Sis" />
                    <div class="text-bold text-grey-7">/</div>
                    <q-input v-model.number="row.dis" type="number" dense outlined input-class="text-center" style="width: 55px;" placeholder="Dis" />
                  </div>
                </td>
                <td>
                  <q-input v-model.number="row.suhu" type="number" step="0.1" dense outlined color="primary" input-class="text-center" placeholder="36.5" />
                </td>
                <td>
                  <q-input v-model.number="row.fr" type="number" dense outlined color="primary" input-class="text-center" />
                </td>
                <td>
                  <q-select
                    v-model.number="row.derajat_sedasi"
                    :options="[0, 1, 2, 3, 4]"
                    dense
                    outlined
                    color="primary"
                    options-dense
                    input-class="text-center"
                  />
                </td>
                <td class="text-center">
                  <q-btn icon="icon-mat-delete" size="xs" color="negative" flat round @click="store.removeMonitoringRow(i)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>

      <!-- CARD 3: KALKULATOR INTERAKTIF SKOR ALDRETE -->
      <q-card flat bordered class="rounded-borders bg-white shadow-1">
        <q-card-section class="bg-primary text-white q-py-sm row justify-between items-center">
          <div class="text-subtitle1 text-bold flex items-center">
            <q-icon name="icon-mat-calculate" size="22px" class="q-mr-sm" />
            3. Pemantauan Pasca Sedasi & Kalkulator Skor Aldrete
          </div>
          <div class="row items-center q-gutter-x-sm">
            <span class="text-caption text-bold">TOTAL SKOR:</span>
            <q-badge
              :color="store.totalSkorAldrete >= 8 ? 'positive' : 'warning'"
              class="text-bold text-subtitle1 q-px-md"
            >
              {{ store.totalSkorAldrete }} / 10
              <span v-if="store.totalSkorAldrete >= 8" class="q-ml-xs">(Aman Dipulangkan ✓)</span>
            </q-badge>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input v-model="form.jam_pulih" mask="##:##" label="Jam Masuk Ruang Pulih (HH:MM)" placeholder="14:00" dense outlined color="primary">
                <template v-slot:append>
                  <q-icon name="icon-mat-schedule" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-8">
              <q-input v-model="form.catatan" label="Catatan Pemantauan Pasca Sedasi" dense outlined color="primary" />
            </div>
          </div>

          <!-- TABEL PEMANTAUAN VITAL SIGNS PASCA SEDASI (15 MENIT DI RUANG PULIH) -->
          <div class="q-my-md bg-grey-1 rounded-borders border-bordered q-pa-sm">
            <div class="row justify-between items-center q-mb-xs">
              <div class="text-subtitle2 text-bold text-primary flex items-center">
                <q-icon name="icon-mat-timer" class="q-mr-xs" />
                Pemantauan Vital Signs Pasca Sedasi (Tiap 15 Menit di Ruang Pulih)
              </div>
              <q-btn
                label="Tambah Waktu (15m)"
                icon="icon-mat-add"
                color="primary"
                size="xs"
                no-caps
                dense
                class="q-px-sm text-weight-bold"
                @click="store.addMonitoringPascaRow()"
              />
            </div>

            <q-markup-table flat borderless dense class="bg-white">
              <thead class="bg-indigo-1 text-primary font-8">
                <tr>
                  <th width="5%">No</th>
                  <th width="18%">Waktu (15m)</th>
                  <th width="16%">SpO2 (%)</th>
                  <th width="16%">Nadi (x/m)</th>
                  <th width="24%">Tensi (Sis / Dis)</th>
                  <th width="16%">Fr (Nafas)</th>
                  <th width="5%">Hapus</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pRow, pIdx) in form.monitoring_pasca" :key="pIdx">
                  <td class="text-center text-bold font-9">{{ pIdx + 1 }}</td>
                  <td>
                    <q-input
                      v-model="pRow.waktu"
                      dense
                      outlined
                      color="primary"
                      mask="##:##"
                      placeholder="14:56"
                      input-class="text-center text-bold font-9"
                    />
                  </td>
                  <td>
                    <q-input v-model.number="pRow.spo2" type="number" dense outlined color="primary" input-class="text-center" />
                  </td>
                  <td>
                    <q-input v-model.number="pRow.nadi" type="number" dense outlined color="primary" input-class="text-center" />
                  </td>
                  <td>
                    <div class="row items-center no-wrap q-gutter-x-xs">
                      <q-input v-model.number="pRow.sis" type="number" dense outlined input-class="text-center" style="width: 55px;" placeholder="Sis" />
                      <div class="text-bold text-grey-7">/</div>
                      <q-input v-model.number="pRow.dis" type="number" dense outlined input-class="text-center" style="width: 55px;" placeholder="Dis" />
                    </div>
                  </td>
                  <td>
                    <q-input v-model.number="pRow.fr" type="number" dense outlined color="primary" input-class="text-center" />
                  </td>
                  <td class="text-center">
                    <q-btn icon="icon-mat-delete" size="xs" color="negative" flat round @click="store.removeMonitoringPascaRow(pIdx)" />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <!-- INTERACTIVE DENSE RADIO LIST FOR ALDRETE CRITERIA -->
          <div class="q-my-sm">
            <div class="text-subtitle2 text-bold text-primary q-mb-xs">Penilaian Kriteria Skor Aldrete:</div>
            
            <q-list dense bordered separator class="rounded-borders bg-white shadow-1">
              <!-- 1. KESADARAN -->
              <q-item class="q-py-xs bg-grey-1">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  1. Kesadaran
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model.number="form.aldrete_kesadaran" :val="2" label="2 - Sadar Penuh" dense color="primary" />
                    <q-radio v-model.number="form.aldrete_kesadaran" :val="1" label="1 - Mengantuk / Tdk Sadar" dense color="warning" />
                    <q-radio v-model.number="form.aldrete_kesadaran" :val="0" label="0 - Tdk Ada Reaksi" dense color="negative" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 2. PERNAFASAN -->
              <q-item class="q-py-xs bg-white">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  2. Pernafasan
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model.number="form.aldrete_pernafasan" :val="2" label="2 - Teratur Kuat / Batuk" dense color="primary" />
                    <q-radio v-model.number="form.aldrete_pernafasan" :val="1" label="1 - Nafas Berat Dyspnea" dense color="warning" />
                    <q-radio v-model.number="form.aldrete_pernafasan" :val="0" label="0 - Nafas Dibantu" dense color="negative" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 3. TENSI -->
              <q-item class="q-py-xs bg-grey-1">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  3. Sirkulasi / Tensi
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model.number="form.aldrete_tensi" :val="2" label="2 - Sama Nilai Awal ± 20%" dense color="primary" />
                    <q-radio v-model.number="form.aldrete_tensi" :val="1" label="1 - Berbeda 20 - 30%" dense color="warning" />
                    <q-radio v-model.number="form.aldrete_tensi" :val="0" label="0 - Berbeda > 30%" dense color="negative" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 4. PERGERAKAN -->
              <q-item class="q-py-xs bg-white">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  4. Pergerakan
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model.number="form.aldrete_pergerakan" :val="2" label="2 - Gerak Terkendali" dense color="primary" />
                    <q-radio v-model.number="form.aldrete_pergerakan" :val="1" label="1 - Ada Reaksi Rangsangan" dense color="warning" />
                    <q-radio v-model.number="form.aldrete_pergerakan" :val="0" label="0 - Gerak Tak Terkendali" dense color="negative" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 5. WARNA KULIT -->
              <q-item class="q-py-xs bg-grey-1">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  5. Warna Kulit
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model.number="form.aldrete_warna_kulit" :val="2" label="2 - Merah" dense color="primary" />
                    <q-radio v-model.number="form.aldrete_warna_kulit" :val="1" label="1 - Pucat" dense color="warning" />
                    <q-radio v-model.number="form.aldrete_warna_kulit" :val="0" label="0 - Cyanosis" dense color="negative" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>

      <!-- CARD 4: KRITERIA & KEPUTUSAN DISCHARGE -->
      <q-card flat bordered class="rounded-borders bg-white shadow-1">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-subtitle1 text-bold flex items-center">
            <q-icon name="icon-mat-meeting_room" size="22px" class="q-mr-sm" />
            4. Kriteria Discharge Pasien Pasca Sedasi
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md">
          <!-- ROW 1: INPUT FIELDS (4 EQUAL COLUMNS) -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-input v-model.number="form.skor_discharge" type="number" label="Skor Aldrett Discharge" dense outlined color="primary" readonly />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="form.nyeri_vas" label="Skala Nyeri (VAS 0-10)" dense outlined color="primary" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="form.jam_keluar" mask="##:##" label="Jam Keluar Ruang Pulih (HH:MM)" placeholder="14:30" dense outlined color="primary">
                <template v-slot:append>
                  <q-icon name="icon-mat-schedule" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="form.keputusan"
                :options="['Dipulangkan', 'MRS', 'Rawat Khusus']"
                label="Keputusan Discharge Pasien"
                dense
                outlined
                color="primary"
              />
            </div>
          </div>

          <!-- INTERACTIVE DENSE RADIO LIST FOR DISCHARGE CRITERIA -->
          <div class="q-mt-md">
            <div class="text-subtitle2 text-bold text-primary q-mb-xs">Kriteria Kelayakan Pulih (Discharge):</div>

            <q-list dense bordered separator class="rounded-borders bg-white shadow-1">
              <!-- MUAL / MUNTAH -->
              <q-item class="q-py-xs bg-grey-1">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  Mual / Muntah
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model="form.mual_muntah" val="Tidak Ada" label="Tidak Ada" dense color="primary" />
                    <q-radio v-model="form.mual_muntah" val="Ada" label="Ada" dense color="warning" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- PERDARAHAN -->
              <q-item class="q-py-xs bg-white">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  Perdarahan
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model="form.perdarahan" val="Tidak Ada" label="Tidak Ada" dense color="primary" />
                    <q-radio v-model="form.perdarahan" val="Ada" label="Ada" dense color="warning" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- AMBULASI -->
              <q-item class="q-py-xs bg-grey-1">
                <q-item-section class="col-12 col-md-3 text-bold text-indigo-9">
                  Ambulasi
                </q-item-section>
                <q-item-section class="col-12 col-md-9">
                  <div class="row q-gutter-x-md items-center">
                    <q-radio v-model="form.ambulasi" val="Mandiri" label="Mandiri" dense color="primary" />
                    <q-radio v-model="form.ambulasi" val="Dibantu" label="Dibantu" dense color="warning" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>

      <!-- CARD 5: INSTRUKSI PASCA SEDASI WITH LARGE VISIBLE QUICK CHIPS -->
      <q-card flat bordered class="rounded-borders bg-white shadow-1">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-subtitle1 text-bold flex items-center">
            <q-icon name="icon-mat-description" size="22px" class="q-mr-sm" />
            5. Instruksi Pasca Sedasi (Klik Tombol Opsi Cepat)
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            
            <!-- OBAT-OBATAN -->
            <div class="col-12">
              <div class="text-caption text-bold text-primary q-mb-xs">Obat-obatan:</div>
              <div class="row q-gutter-sm q-mb-sm">
                <q-btn
                  label="+ Restrain Tangan & Kaki"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_obat', 'Restrain di tangan & kaki')"
                />
                <q-btn
                  label="+ Analgetik IV Jika Nyeri"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_obat', 'Analgetik IV jika nyeri')"
                />
              </div>
              <q-input v-model="form.instruksi_obat" type="textarea" dense outlined color="primary" rows="2" placeholder="e.g. Restrain di tangan & kaki, Analgetik IV jika nyeri" />
            </div>

            <!-- MOBILISASI -->
            <div class="col-12">
              <div class="text-caption text-bold text-primary q-mb-xs">Mobilisasi:</div>
              <div class="row q-gutter-sm q-mb-sm">
                <q-btn
                  label="+ Bed Rest 2 Jam"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_mobilisasi', 'Bed rest 2 jam')"
                />
                <q-btn
                  label="+ Berjalan Dengan Bantuan"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_mobilisasi', 'Berjalan dengan bantuan')"
                />
              </div>
              <q-input v-model="form.instruksi_mobilisasi" type="textarea" dense outlined color="primary" rows="2" placeholder="e.g. Bed rest 2 jam, berjalan dengan bantuan" />
            </div>

            <!-- DIET & NUTRISI -->
            <div class="col-12">
              <div class="text-caption text-bold text-primary q-mb-xs">Diet & Nutrisi:</div>
              <div class="row q-gutter-sm q-mb-sm">
                <q-btn
                  label="+ Diet Rendah Garam 6x100 cc"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_diet', 'Diet Rendah Garam 6x100 cc')"
                />
                <q-btn
                  label="+ Puasa s/d Sadar Penuh"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_diet', 'Puasa s/d sadar penuh')"
                />
              </div>
              <q-input v-model="form.instruksi_diet" type="textarea" dense outlined color="primary" rows="2" placeholder="e.g. Diet Rendah Garam 6x100 cc" />
            </div>

            <!-- EDUKASI & FOLLOW UP -->
            <div class="col-12">
              <div class="text-caption text-bold text-primary q-mb-xs">Edukasi & Follow Up:</div>
              <div class="row q-gutter-sm q-mb-sm">
                <q-btn
                  label="+ Observasi TTV Tiap 15 Mnt"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_edukasi', 'Observasi TTV tiap 15 mnt')"
                />
                <q-btn
                  label="+ Posisikan Head Up 30°"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_edukasi', 'Posisikan kepala Head up 30°')"
                />
                <q-btn
                  label="+ Segera Lapor Dokter Bila Sesak/Mual"
                  icon="icon-mat-add"
                  color="indigo-1"
                  text-color="primary"
                  size="sm"
                  no-caps
                  unelevated
                  class="text-weight-bold"
                  @click="addText('instruksi_edukasi', 'Segera lapor dokter jika sesak/mual')"
                />
              </div>
              <q-input v-model="form.instruksi_edukasi" type="textarea" dense outlined color="primary" rows="2" placeholder="e.g. Observasi TTV, Posisikan kepala Head up 30°" />
            </div>

            <div class="col-12">
              <div class="text-caption text-bold text-primary q-mb-xs">Lain-lain:</div>
              <q-input v-model="form.instruksi_lain" type="textarea" dense outlined color="primary" rows="2" />
            </div>

          </div>
        </q-card-section>

        <!-- BOTTOM ACTION FOOTER BAR -->
        <q-card-section class="bg-grey-2 q-pa-sm flex justify-between items-center">
          <q-btn label="Reset Form" color="negative" outline icon="icon-mat-refresh" @click="store.resetForm(pasien)" />
          <q-btn label="Simpan Status Sedasi" color="primary" icon="icon-mat-save" :loading="store.loadingSave" type="submit" class="q-px-lg text-weight-bold" />
        </q-card-section>
      </q-card>
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePascaSedasiRanapStore } from 'src/stores/simrs/ranap/pascasedasi'
import AppAutocompleteNew from 'src/components/~global/AppAutocompleteNew.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'on-saved'])

const store = usePascaSedasiRanapStore()

const showChart = ref(false)
const form = computed(() => store.form)

const storeDokters = computed(() => {
  return store.dokters || []
})

const storeNakes = computed(() => {
  return store.nakes || []
})

onMounted(() => {
  store.getNakes()
  
  if (props.pasien) {
    if (!form.value.kddokter && props.pasien.kddokter) {
      form.value.kddokter = props.pasien.kddokter
      form.value.dokter = props.pasien.dokter
      form.value.dokter_sedasi = props.pasien.dokter
    }
  }
})

function addText(field, text) {
  if (!form.value[field]) {
    form.value[field] = text
  } else if (!form.value[field].includes(text)) {
    form.value[field] += `, ${text}`
  }
}

async function onSimpan() {
  const success = await store.saveData(props.pasien)
  if (success) {
    emit('on-saved')
    emit('close')
  }
}

// APEXCHARTS COMPUTED SERIES & OPTIONS
const chartSeries = computed(() => {
  const intra = form.value.monitoring_intra || []
  return [
    { name: 'SpO2 (%)', data: intra.map(r => Number(r.spo2) || 0) },
    { name: 'Nadi (x/m)', data: intra.map(r => Number(r.nadi) || 0) },
    { name: 'Sistole (mmHg)', data: intra.map(r => Number(r.sis) || 0) },
    { name: 'Diastole (mmHg)', data: intra.map(r => Number(r.dis) || 0) },
    { name: 'Fr (x/m)', data: intra.map(r => Number(r.fr) || 0) }
  ]
})

const chartOptions = computed(() => {
  const intra = form.value.monitoring_intra || []
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Helvetica, Arial, sans-serif'
    },
    colors: ['#0288D1', '#E65100', '#2E7D32', '#9C27B0', '#D32F2F'],
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4 },
    xaxis: {
      categories: intra.map(r => r.waktu || '-'),
      labels: { style: { fontSize: '10px' } }
    },
    yaxis: {
      min: 0,
      max: 220,
      labels: { style: { fontSize: '10px' } }
    },
    grid: { borderColor: '#e0e0e0' },
    legend: { position: 'top', horizontalAlign: 'right' }
  }
})
</script>

<style lang="scss" scoped>
.border-bottom-panel {
  border-bottom: 1px solid #c5cae9;
}
</style>
